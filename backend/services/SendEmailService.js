const nodemailer = require('nodemailer')
require('dotenv').config()
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

})

// Package Dispatch
exports.sendCargoDispatch = (email, fullname, blnNumber, currentLocation, finalDestination) => {
    const trackUrl = `https://texmonlogistics.co.ke/track/results?number=${encodeURIComponent(blnNumber)}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Cargo Clearance Notification',
        html: `<html>
        <head>
            <title>Cargo Clearance Notification</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    text-transform: capitalize;
                }
                p {
                    margin-bottom: 10px;
                }
                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                li {
                    margin-bottom: 10px;
                }
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #000;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Cargo Clearance</h1>
                <p>Dear ${fullname},</p>
                <p>Your cargo has been cleared for dispatch. Please find the details below:</p>
                <ul>
                    <li><strong>BLN Number:</strong> ${blnNumber}</li>
                    <li><strong>Current Location:</strong> ${currentLocation}</li>
                    <li><strong>Final Destination:</strong> ${finalDestination}</li>
                </ul>
                <p>You can track your cargo using the link below:</p>
                <a href="${trackUrl}" class="btn">Track Cargo</a>
                <p>If you have any questions or concerns, please contact our support team.</p>
            </div>
        </body>
        </html>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Cargo Dispatch sent.');
        }
    });
};

