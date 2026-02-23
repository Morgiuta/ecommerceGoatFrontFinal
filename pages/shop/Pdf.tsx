import jsPDF from "jspdf";

export const generarPDF = () => {
  const doc = new jsPDF();
  doc.text("Hola Tomas 🚀", 10, 10);
  doc.save("archivo.pdf");
};
