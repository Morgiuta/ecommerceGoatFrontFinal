import jsPDF from "jspdf";

export const generarPDF = (monto, fecha, nroPedido) => {
  const doc = new jsPDF();

  // 🧾 TÍTULO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("FACTURA", 105, 20, { align: "center" });

  // Línea separadora
  doc.setLineWidth(0.5);
  doc.line(20, 30, 190, 30);

  // 🔹 Información
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  doc.text(`Pedido N°: ${nroPedido}`, 20, 50);
  doc.text(`Fecha: ${fecha}`, 20, 60);

  // 💰 Total destacado
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: $${Number(monto).toFixed(2)}`, 20, 80);

  // Caja alrededor del total
  doc.rect(15, 70, 180, 20);

  // Footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Gracias por su compra.", 105, 280, { align: "center" });

  doc.save(`Factura-${nroPedido}.pdf`);
};
