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
  doc.text(`N° ${order.bill?.bill_number}`, 105, 28, { align: "center" });

  doc.line(20, 35, 190, 35);

  // =========================
  // CLIENTE
  // =========================
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Cliente:", 20, 50);

  doc.setFont("helvetica", "normal");
  doc.text(
    `${order.client?.name} ${order.client?.lastname}`,
    20,
    58
  );
  doc.text(order.client?.email || "", 20, 66);

  // =========================
  // INFO FACTURA
  // =========================
  doc.text(`Fecha: ${order.bill?.date}`, 140, 58);
  doc.text(`Pago: ${order.bill?.payment_type}`, 140, 66);

  // =========================
  // DETALLES PRODUCTOS
  // =========================
  let y = 95;

  doc.setFont("helvetica", "bold");
  doc.text("Productos", 20, y);
  y += 10;

  doc.setFont("helvetica", "normal");

  order.details?.forEach((detail) => {
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
    `Total: ${formatCurrency(order.bill?.total || 0)}`,
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

  doc.save(`Factura-${order.bill?.bill_number}.pdf`);
};
