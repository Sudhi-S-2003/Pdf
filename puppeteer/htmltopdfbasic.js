const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Get the full path to the index.html file
    const filePath = path.resolve('index.html');
    const fileUrl = `file://${filePath}`;

    // Load the HTML file
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Generate the PDF
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Save the PDF to a file
    fs.writeFileSync('output.pdf', pdfBuffer);

    // Close the browser
    await browser.close();

    console.log('PDF generated successfully.');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

// Run the function
generatePDF();
