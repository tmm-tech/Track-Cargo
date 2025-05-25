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


//Account Creation
exports.sendAccountCreation = (email, password, fullname, roles) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Confirmation',
        html: `<html>
        <head>
            <title>Account Created Confirmation</title>
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
                <h1>Account Confirmation</h1>
                <p>Dear ${fullname},</p>
                <p>We are pleased to inform you that your account has been successfully created. Please find below your login credentials:</p>
                <ul>
                    <li><strong>Username: </strong> ${email}</li>
                    <li><strong>Password: </strong>${password}</li>
                    <li><strong>Role: </strong>${roles.charAt(0).toUpperCase() + roles.slice(1)}</li>
                </ul>
                <p>You can now use your login credentials to access your KETRB CMS account.</p>
                <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
                <a href="https://ketrb-cms-one.vercel.app/" class="btn">Go to Website</a>
            </div>
        </body>
        
        </html>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Account Creation sent.');
        }
    });
};

// Password Update
exports.sendPasswordUpdate = (userData) => {
    const { email, fullname, roles, password } = userData;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Update Confirmation',
        html: `<html>
        <head>
            <title>Account Update</title>
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
    <h1>Account Updated</h1>
    <p>Dear ${fullname},</p>
    <p>Your account has been successfully updated. ${password ? 'Your password has been changed.' : ''} Please find your updated details below:</p>
    <ul>
        <li><strong>Email:</strong> ${email}</li>
        ${password ? `<li><strong>Password:</strong> ${password}</li>` : ''}
        <li><strong>Role:</strong> ${roles.charAt(0).toUpperCase() + roles.slice(1)}</li>
    </ul>
    <p>You can now log in to your account using your updated details.</p>
    <p>If you have any questions, feel free to contact us.</p>
    <a href="https://ketrb-cms-one.vercel.app/" class="btn">Go to Website</a>
</div>
        </body>
        </html>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Password Update sent.');
        }
    });
};

// Account Deactivation
exports.sendAccountDeactivation = (email, fullname) => {
    console.log('Sending email to:', email);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Deactivation',
        html: `<html>
        <head>
            <title>Account Deactivation</title>
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
                <h1>Account Deactivation</h1>
                <p>Dear ${fullname},</p>
                <p>We regret to inform you that your account has been deactivated. You will no longer be able to access your account unless it is reactivated.</p>
                <p>If you believe this was a mistake or if you have any questions, please contact our support team.</p>
                <a href="https://ketrb-cms-one.vercel.app/" class="btn">Go to Website</a>
            </div>
        </body>
        
        </html>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Account Deactivation sent.');
        }
    });
};

// Account Activation
exports.sendAccountActivation = (email, fullname) => {
    console.log('Sending email to:', email);     
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Activation',
        html: `<html>
        <head>
            <title>Account Activation</title>
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
                <h1>Account Activation</h1>
                <p>Dear ${fullname},</p>
                <p>We are pleased to inform you that your account has been activated. You can now log in using your credentials.</p>
                <p>If you have any questions or concerns, please contact our support team.</p>
                <a href="https://ketrb-cms-one.vercel.app/" class="btn">Go to Website</a>
            </div>
        </body>
        
        </html>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Account Activation sent.');
        }
    });
};
