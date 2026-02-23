import jsPDF from "jspdf";

export const generarPDF = (monto,fecha,nroPedido) => {
  const doc = new jsPDF();
  doc.text("Hola Tomas 🚀", 10, 10);
  doc.save("archivo.pdf");
};
