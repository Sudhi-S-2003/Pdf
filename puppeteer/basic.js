const puppeteer = require('puppeteer');
const fs = require('fs');

async function generatePDF() {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content of the page (you can also use page.goto() to load a URL)
    await page.setContent('<h1>Hello, World!</h1><p>This is a sample PDF generated without Express.</p>');

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
