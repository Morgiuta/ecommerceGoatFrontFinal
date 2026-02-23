import jsPDF from "jspdf";

export const generarPDF = (monto, fecha, nroPedido) => {
  const doc = new jsPDF();

  doc.text(`Monto: $${monto}`, 10, 10);
  doc.text(`Fecha: ${fecha}`, 10, 20);
  doc.text(`Pedido N°: ${nroPedido}`, 10, 30);

  doc.save("archivo.pdf");
};
