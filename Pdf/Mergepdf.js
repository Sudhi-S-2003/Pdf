const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function modifyPdf() {
  // Load the existing PDF document
  const existingPdfBytes = fs.readFileSync('output.pdf');
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Load the source PDF document (from which pages will be copied)
  const srcPdfBytes = fs.readFileSync('Mern.pdf'); //  'Mern.pdf' is source file
  const srcDoc = await PDFDocument.load(srcPdfBytes);

  // Copy pages from the source document
  const [copiedPage] = await pdfDoc.copyPages(srcDoc, [0]); // Copy the first page from srcDoc

  // Add the copied page to the existing document
  pdfDoc.insertPage(0,copiedPage); // Adds the copied page to pdfDoc

  // Save the modified PDF document
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('modified.pdf', pdfBytes);
}

modifyPdf();
