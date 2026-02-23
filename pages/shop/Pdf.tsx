import React from 'react';

function PDFDownload() {
  const handleDownload = async () => {
    const response = await fetch('http://tu-servidor/pdf');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ejemplo.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={handleDownload}>Descargar PDF</button>
    </div>
  );
}

export default PDFDownload;
