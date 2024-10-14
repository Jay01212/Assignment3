/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const PDFDocument = require('pdfkit');
// const logger = require("firebase-functions/logger");

admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// 新增: 导出事件功能
exports.exportEvents = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const format = req.query.format || 'csv';
            const eventsCollection = admin.firestore().collection("events");
            const snapshot = await eventsCollection.get();
            const events = snapshot.docs.map(doc => doc.data());

            if (format === 'csv') {
                const headers = ['Event Name', 'Details', 'Date', 'Location', 'Status'];
                const csvRows = [
                    headers.join(','),
                    ...events.map(event => [
                        event.eventName,
                        event.details,
                        event.date,
                        event.location,
                        event.status
                    ].map(field => `"${field}"`).join(','))
                ];
                const csvContent = csvRows.join('\n');

                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=events.csv');
                res.status(200).send(csvContent);
            } else if (format === 'pdf') {
                const doc = new PDFDocument();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=events.pdf');

                doc.pipe(res);

                doc.fontSize(16).text('Mental Health Events', { align: 'center' });
                doc.moveDown();

                events.forEach(event => {
                    doc.fontSize(14).text(event.eventName);
                    doc.fontSize(10).text(`Details: ${event.details}`);
                    doc.text(`Date: ${event.date}`);
                    doc.text(`Location: ${event.location}`);
                    doc.text(`Status: ${event.status}`);
                    doc.moveDown();
                });

                doc.end();
            } else {
                throw new Error('Invalid format');
            }
        } catch (error) {
            console.error("Error exporting events:", error.message);
            res.status(500).send("Error exporting events");
        }
    });
});