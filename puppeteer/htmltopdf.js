const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Get the full path to the index.html file
    const filePath = path.resolve('Student.html');
    const fileUrl = `file://${filePath}`;

    // Load the HTML file
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Generate the PDF with footer and margin settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Ensures that background graphics are included
      margin: {
        top: '20mm',
        right: '10mm',
        bottom: '20mm',
        left: '10mm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>', // Empty header if not needed
      footerTemplate: `
        <div style="font-size:10px; width:100%; text-align:center;">
          <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
      path: 'output.pdf'
    });

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
