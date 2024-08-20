const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
    try {
        // Launch a headless browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Get the full path to the HTML file
        const filePath = path.resolve('AdvancedReport.html');
        const fileUrl = `file://${filePath}`;

        // Load the HTML file
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });

        // Generate the PDF with pagination
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: { top: '20mm', bottom: '20mm' },
            displayHeaderFooter: true,
            headerTemplate: '<div style="font-size:10px; margin-left: 20px;">Advanced Student Report</div>',
            footerTemplate: `
                <div style="font-size:10px; width: 100%; text-align: center; padding: 0 20px;">
                    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                </div>`,
            printBackground: true,
            
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
