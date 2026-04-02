const nodemailer = require('nodemailer');

// 🔹 Create transporter (Gmail OAuth2)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// 🔹 Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// 🔹 Common send email function
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('📩 Message sent:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

//  Registration Email
async function sendregisterationemail(useremail, name) {
  const subject = "Welcome to Backend Ledger 🎉";

  const text = `Hello ${name},

Thank you for registering at Backend Ledger.

We are happy to have you with us!

- Backend Ledger Team`;

  const html = `
    <h2>Welcome ${name} 🎉</h2>
    <p>Thank you for registering at <b>Backend Ledger</b>.</p>
    <p>We are happy to have you with us!</p>
    <p><b>- Backend Ledger Team</b></p>
  `;

  await sendEmail(useremail, subject, text, html);
}

// Transaction Success Email
async function sendtransactionemail(useremail, name, amount, toaccount) {
  const subject = "Transaction Successful 💸";

  const text = `Hello ${name},

Your transaction of ₹${amount} has been successfully completed.

Transferred To Account: ${toaccount}
Date: ${new Date().toLocaleString()}

Thank you for using Backend Ledger.

- Backend Ledger Team`;

  const html = `
    <h3>Hello ${name}</h3>
    <p>Your transaction of <b>₹${amount}</b> has been successfully completed ✅</p>
    <p><b>Transferred To Account:</b> ${toaccount}</p>
    <p><b>Date:</b> ${new Date().toLocaleString()}</p>
    <p>Thank you for using Backend Ledger 💙</p>
    <p><b>- Backend Ledger Team</b></p>
  `;

  await sendEmail(useremail, subject, text, html);
}

// Transaction Failed Email
async function sendtransactionfailureemail(useremail, name, amount,toaccount) {
  const subject = "Transaction Failed ";

  const text = `Hello ${name},

Your transaction of ₹${amount} could not be completed.

Possible reasons:
- Insufficient balance
- Network issue

Please try again later.

- Backend Ledger Team`;

  const html = `
    <h3>Hello ${name}</h3>
    <p>Your transaction of <b>₹${amount}</b> failed </p>
    <p>Possible reasons:</p>
    <ul>
      <li>Insufficient balance</li>
      <li>Network issue</li>
    </ul>
    <p>Please try again later.</p>
    <p><b>- Backend Ledger Team</b></p>
  `;

  await sendEmail(useremail, subject, text, html);
}

// 🔹 Export all functions
module.exports = {
  transporter,
  sendEmail,
  sendregisterationemail,
  sendtransactionemail,
  sendtransactionfailureemail,
};