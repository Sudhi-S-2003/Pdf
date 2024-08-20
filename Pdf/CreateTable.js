const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPDFWithTable() {
  const pdfDoc = await PDFDocument.create();
  const pageWidth = 600;
  const pageHeight = 800;
  const margin = 50;
  const rowHeight = 100;
  const headerHeight = 40;
  const descWidth = 255;
  const textWidth = 120;
  const fontSize = 12;

  const imagePath = path.resolve(__dirname, './img/pdficon.png');
  const imageBytes = fs.readFileSync(imagePath);
  const image = await pdfDoc.embedPng(imageBytes);

  const data = require('./data');

  function drawHeader(page, yOffset) {
    page.drawRectangle({
      x: margin,
      y: yOffset,
      width: pageWidth - 2 * margin,
      height: headerHeight,
      color: rgb(0.9, 0.9, 0.9),
    });
    page.drawText('No', { x: margin + 5, y: yOffset + 10, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText('Image', { x: margin + 50, y: yOffset + 10, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText('Name', { x: margin + 120, y: yOffset + 10, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText('Price', { x: margin + 250, y: yOffset + 10, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText('Description', { x: margin + 330, y: yOffset + 10, size: fontSize, color: rgb(0, 0, 0) });
  }

  function drawTable(page, data) {
    let yOffset = pageHeight - margin - headerHeight;
    drawHeader(page, yOffset);
    yOffset -= headerHeight;

    data.forEach((item) => {
      if (yOffset - rowHeight < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yOffset = pageHeight - margin - headerHeight;
        drawHeader(page, yOffset);
        yOffset -= headerHeight;
      }

      const drawWrappedText = (text, x, y, width) => {
        const lines = wrapText(text, width, fontSize);
        lines.forEach((line, i) => {
          page.drawText(line, { x, y: y - i * fontSize, size: fontSize, color: rgb(0, 0, 0) });
        });
        return lines.length * fontSize;
      };

      page.drawText(`${item.no}`, { x: margin + 5, y: yOffset + 10, size: fontSize, color: rgb(0, 0, 0) });

      const imageWidth = 50;
      const imageHeight = 50;
      const imageX = margin + 50;
      const imageY = yOffset - (rowHeight - imageHeight) / 2;

      page.drawImage(image, {
        x: imageX,
        y: imageY,
        width: imageWidth,
        height: imageHeight,
      });

      let textOffset = drawWrappedText(item.name, margin + 120, yOffset + 10, textWidth);
      textOffset = Math.max(textOffset, fontSize);

      textOffset += drawWrappedText(item.price, margin + 250, yOffset + 10, textWidth);
      textOffset = Math.max(textOffset, fontSize);

      textOffset += drawWrappedText(item.description, margin + 330, yOffset + 10, descWidth);
      yOffset -= Math.max(rowHeight, textOffset);
    });
  }

  function wrapText(text, maxWidth, fontSize) {
    const words = text.split(' ');
    let lines = [];
    let line = '';
    const spaceWidth = fontSize * 0.3;

    words.forEach(word => {
      const testLine = line + (line ? ' ' : '') + word;
      const lineWidth = testLine.length * (fontSize * 0.6) + (line.split(' ').length - 1) * spaceWidth;

      if (lineWidth > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    });

    lines.push(line);
    return lines;
  }

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  drawTable(page, data);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('output.pdf', pdfBytes);
}

createPDFWithTable().catch(err => console.error('Error creating PDF:', err));
