import express from 'express';
import puppeteer from 'puppeteer';
import 'dotenv/config';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { initDb } from './db.js';
import Preview from './Preview.js';


const app = express();
const PORT = process.env.PORT || 1337;

// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());


let db;

// Initialize the database at server start
initDb().then(database => {
    db = database;
    console.log('Database initialized successfully');

    // Start the server after the DB is ready
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize the database:', err);
    process.exit(1);
});


/**  PDF routes */

app.post('/users/:userId/pdfs', async (req, res) => {
    const userId = req.params.userId;
    const { resume } = req.body;
    try {
        const htmlContent = ReactDOMServer.renderToStaticMarkup(React.createElement(Preview, { resume: resume }));

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        // Generate the PDF
        const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: "20px", bottom: '20px' } });
        const filename = `CV_${Date.now()}.pdf`;

        // Insert metadata into SQLite database
        await db.run('INSERT INTO pdf_metadata (filename, content, userId) VALUES (?, ?, ?)', [filename, JSON.stringify(resume), userId]);

        await browser.close();
        console.log('PDF generated successfully');

        res.status(200)
            .set({
                'Content-Type': 'application/pdf',
                'Content-Length': pdfBuffer.length,
                'Content-Disposition': 'attachment; filename="CV.pdf"'
            })
            .end(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to generate PDF' });
    }
});

app.get('/users/:userId/pdfs', async (req, res) => {
    const userId = req.params.userId;
    try {
        const rows = await db.all('SELECT * FROM pdf_metadata WHERE userId = ?', [userId]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve PDFs' });
    }
});

app.get('/users/:userId/pdfs/:pdfId', async (req, res) => {
    const { userId, pdfId } = req.params;
    try {
        const row = await db.get('SELECT * FROM pdf_metadata WHERE id = ? AND userId = ?', [pdfId, userId]);
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ status: 'error', message: 'PDF not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve PDF' });
    }
});

app.put('/users/:userId/pdfs/:pdfId', async (req, res) => {
    const { userId, pdfId } = req.params;
    const data = req.body;

    try {
        const htmlContent = ReactDOMServer.renderToStaticMarkup(React.createElement(Preview, { resume: data.resume }));

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        // Generate the PDF
        const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: "20px", bottom: '20px' } });

        await db.run('UPDATE pdf_metadata SET content = ? WHERE id = ? AND userId = ?', [JSON.stringify(data.resume), pdfId, userId]);

        await browser.close();
        console.log('PDF generated successfully');

        res.status(200)
            .set({
                'Content-Type': 'application/pdf',
                'Content-Length': pdfBuffer.length,
                'Content-Disposition': 'attachment; filename="CV.pdf"'
            })
            .end(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to generate PDF' });
    }
});

app.post('/webhook', async (req, res) => {
    // Verify the webhook signature if Clerk provides one (recommended for security)
    const { type, data } = req.body;

    if (type === 'user.created') {
        const { id, first_name, last_name, email_addresses } = data;

        try {
            // Insert the new user into your database
            await db.run(`
                INSERT INTO users (id, fullName, email, accountType)
                VALUES (?, ?, ?, ?)`,
                [id, first_name + ' ' + last_name, email_addresses[0].email_address, 'free'] // Defaults to 'free' account type
            );

            console.log('User registered in database:', first_name + ' ' + last_name);
            res.status(201).send('User registered');
        } catch (err) {
            console.error('Error registering user:', err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(400).send('Unhandled event type');
    }
});