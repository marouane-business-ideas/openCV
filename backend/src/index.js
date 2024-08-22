import puppeteer from 'puppeteer';
import http from 'http';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import 'dotenv/config';

import Preview from './Preview.js';

const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/print-pdf') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const data = JSON.parse(body);
            const htmlContent = ReactDOMServer.renderToStaticMarkup(React.createElement(Preview, { resume: data }));

            const browser = await puppeteer.launch({
                headless: true,
            });

            const page = await browser.newPage();

            try {
                await page.setContent(htmlContent);

                // Generate the PDF
                const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: "20px", bottom: '20px', } });

                console.log('PDF generated successfully');

                await browser.close();
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Content-Length': pdfBuffer.length,
                    'Content-Disposition': 'attachment; filename="CV.pdf"'

                });
                res.end(pdfBuffer);
            } catch (err) {
                console.log(err);
                await browser.close();
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Failed to print PDF' }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Method not allowed' }));
    }
});

server.listen(1337, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});