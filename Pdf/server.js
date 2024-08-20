const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  
  // Adds a new page to the PDF document.
  const page1 = pdfDoc.addPage([600, 400]);
  
  // Inserts a new page at the specified index.
  const page2 = pdfDoc.insertPage(0, [600, 400]);
  
  // Add a page without specifying the size (uses default size)
  const page3 = pdfDoc.addPage();
  
  // Draw text on page1
  page1.drawText('Hello, world!', {
    x: 50,
    y: 350,
    size: 30,
    color: rgb(0.95, 0.1, 0.221),
  });

  // Rectangle dimensions
  const rectWidth = 200;
  const rectHeight = 100;

  // Calculate center position
  const centerX = (600 - rectWidth) / 2;
  const centerY = (400 - rectHeight) / 2;

  // Draw rectangle in the middle of page2
  page2.drawRectangle({
    x: centerX,
    y: centerY,
    width: rectWidth,
    height: rectHeight,
    color: rgb(0.95, 0.1, 0.1),
  });

  // Retrieve the dimensions of page3
  const { width: pageWidth, height: pageHeight } = page3.getSize();

  // Calculate center position for the ellipse on page3
  const center3X = pageWidth / 2;
  const center3Y = pageHeight / 2;

  // Draw an ellipse in the middle of page3
  page3.drawEllipse({
    x: center3X,
    y: center3Y,
    xScale: 100,
    yScale: 50,
    color: rgb(0.1, 0.95, 0.1),
  });

  // Draw a line
  page3.drawLine({
    start: { x: 50, y: 150 },
    end: { x: 250, y: 150 },
    thickness: 5,
    color: rgb(0, 0, 0.75),
  });
  
  // Embed a PNG image
  const imageBytes = fs.readFileSync('./img/pdficon.png');
  const pngImage = await pdfDoc.embedPng(imageBytes);

  // Draw the embedded image on page3
  page3.drawImage(pngImage, {
    x: 50,
    y: 100,  // Adjusted to fit within page bounds
    width: 200,
    height: 200,
  });
  
  // Retrieve the form object from the PDF document.
  const form = pdfDoc.getForm();
  
  // Create a new text field on page1
  const textField = form.createTextField('textField');
  textField.setText('Default Text');
  textField.addToPage(page1, {
    x: 50,
    y: 50,
    width: 200,
    height: 50,
  });
  
  // Save the PDF and write it to a file
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('output.pdf', pdfBytes);
}

createPdf();
