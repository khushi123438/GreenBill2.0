require("dotenv").config();
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendTestMail() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL, 
      subject: "🚀 Test Mail from GreenBill",
      html: `<h2>✅ Your email setup is working!</h2>
             <p>If you see this mail, Nodemailer + Gmail App Password is correct 🎉</p>`
    });

    console.log("📩 Test email sent successfully!");
  } catch (err) {
    console.error("❌ Error sending mail:", err);
  }
}

sendTestMail();
