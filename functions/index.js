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

// Export Event Function
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

// Export Resource Functions
exports.exportResources = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const format = req.query.format || 'csv';
            const resourcesCollection = admin.firestore().collection("resources");
            const snapshot = await resourcesCollection.get();
            const resources = snapshot.docs.map(doc => doc.data());

            if (format === 'csv') {
                const headers = ['Resource Name', 'Description', 'Category', 'Access Link'];
                const csvRows = [
                    headers.join(','),
                    ...resources.map(resource => [
                        resource.resourceName,
                        resource.description,
                        resource.category,
                        resource.accessLink
                    ].map(field => `"${field}"`).join(','))
                ];
                const csvContent = csvRows.join('\n');

                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=resources.csv');
                res.status(200).send(csvContent);
            } else if (format === 'pdf') {
                const doc = new PDFDocument();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=resources.pdf');

                doc.pipe(res);

                doc.fontSize(16).text('Mental Health Resources', { align: 'center' });
                doc.moveDown();

                resources.forEach(resource => {
                    doc.fontSize(14).text(resource.resourceName);
                    doc.fontSize(10).text(`Description: ${resource.description}`);
                    doc.text(`Category: ${resource.category}`);
                    doc.text(`Access Link: ${resource.accessLink}`);
                    doc.moveDown();
                });

                doc.end();
            } else {
                throw new Error('Invalid format');
            }
        } catch (error) {
            console.error("Error exporting resources:", error.message);
            res.status(500).send("Error exporting resources");
        }
    });
});

// Send Email Function
exports.sendEmail = onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            res.status(405).send({error: "Method not allowed"});
            return;
        }

        try {
            const { to, subject, text, attachment } = req.body;

            const data = {
                personalizations: [
                    {
                        to: [{email: to}],
                        subject: subject,
                    },
                ],
                from: {email: "j1531502692@gmail.com"},
                content: [
                    {
                        type: "text/plain",
                        value: text,
                    },
                ],
            };

            if (attachment) {
                data.attachments = [{
                    content: attachment.content,
                    filename: attachment.filename,
                    type: attachment.type,
                    disposition: attachment.disposition,
                }];
            }

            const sendgridApiKey = "SG.L2T5xd8iQQO4HZcEEmtuYA.KATElJLfj4mx"+
            "2hBXZIK8MJg6TVLViDOdw-E4iBDToTQ";

            const options = {
                hostname: "api.sendgrid.com",
                port: 443,
                path: "/v3/mail/send",
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sendgridApiKey}`,
                    "Content-Type": "application/json",
                },
            };

            const sendgridReq = https.request(options, (sendgridRes) => {
                let responseData = "";
                sendgridRes.on("data", (chunk) => {
                    responseData += chunk;
                });
                sendgridRes.on("end", () => {
                    if (sendgridRes.statusCode >= 200 && sendgridRes.statusCode < 300) {
                        res.status(200).send({success: true});
                    } else {
                        console.error("Error sending email:", responseData);
                        res.status(500).send({success: false, error: responseData});
                    }
                });
            });

            sendgridReq.on("error", (error) => {
                console.error("Error sending email:", error);
                res.status(500).send({success: false, error: error.message});
            });

            sendgridReq.write(JSON.stringify(data));
            sendgridReq.end();

        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).send({success: false, error: "Internal server error"});
        }
    });
});