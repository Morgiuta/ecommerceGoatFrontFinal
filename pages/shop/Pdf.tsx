import jsPDF from "jspdf";
import { Order } from "@/types";
export const generarPDF = (order: Order) => {

console.log(order, "hola")

  const doc = new jsPDF();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

  // =========================
  // HEADER
  // =========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("FACTURA", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`N° ${order[0].bill?.bill_number}`, 105, 28, { align: "center" });

  doc.line(20, 35, 190, 35);

  // =========================
  // CLIENTE
  // =========================
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Cliente:", 20, 50);

  doc.setFont("helvetica", "normal");
  doc.text(
    `${order[0].client?.name} ${order[0].client?.lastname}`,
    20,
    58
  );
  doc.text(order[0].client?.email || "", 20, 66);

  // =========================
  // INFO FACTURA
  // =========================
  doc.text(`Fecha: ${order[0].bill?.date}`, 140, 58);
  doc.text(`Pago: ${order[0].bill?.payment_type}`, 140, 66);

  // =========================
  // DETALLES PRODUCTOS
  // =========================
  let y = 95;

  doc.setFont("helvetica", "bold");
  doc.text("Productos", 20, y);
  y += 10;

  doc.setFont("helvetica", "normal");

  order[0].details?.forEach((detail) => {
    const subtotal = detail.quantity * detail.price;

    doc.text(detail.product?.name || "Producto", 20, y);
    doc.text(`x${detail.quantity}`, 120, y);
    doc.text(formatCurrency(subtotal), 160, y);

    y += 8;
  });

  // =========================
  // TOTALES
  // =========================
  y += 10;

  doc.line(20, y, 190, y);
  y += 10;

  doc.setFont("helvetica", "bold");

  doc.text(
    `Total: ${formatCurrency(order[0].bill?.total || 0)}`,
    140,
    y
  );

  // =========================
  // FOOTER
  // =========================
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Gracias por su compra.", 105, 280, {
    align: "center",
  });

  doc.save(`Factura-${order[0].bill?.bill_number}.pdf`);
};
