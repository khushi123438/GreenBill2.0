const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const multer = require("multer");


const User = require("./models/User");
const billRoutes = require("./routes/bills");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./routes/analyzer'));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../GreenBill-frontend")));
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
app.use(express.static(path.join(__dirname, "public")));


app.use("/api/bills", billRoutes);
const forecastRoute = require('./routes/forecast');
app.use('/api/forecast', forecastRoute);



const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });



app.use('/api/bill', require('./routes/bills'));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false },
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `📬 New Contact Message from ${name}`,
      html: `<h3>New Contact Message</h3>
             <p><b>Name:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Message:</b> ${message}</p>`,
    });
    res.json({ success: true, message: "✅ Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "❌ Failed to send email." });
  }
});

app.post("/api/review", async (req, res) => {
  const { name, rating, comment = "" } = req.body;
  if (!name || !rating) return res.json({ success: false, message: "Name and rating required." });
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `⭐ Review from ${name}`,
      html: `<h3>New Review</h3>
             <p><b>Name:</b> ${name}</p>
             <p><b>Rating:</b> ${rating}/5</p>
             <p><b>Comment:</b> ${comment}</p>`,
    });
    console.log("New Review:", { name, rating, comment, date: new Date() });
    return res.json({ success: true, message: "✅ Review submitted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "❌ Failed to submit review." });
  }
});


app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.BASE_URL}/reset-password.html?token=${resetToken}&email=${email}`;
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click below to reset your password (valid 15 mins):</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.json({ message: "✅ Reset link sent to your email!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Server error" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { email, token, password } = req.body;
  if (!password) return res.status(400).json({ message: "Password required" });

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "✅ Password reset successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Server error" });
  }
});


app.get("/reset-password", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "reset-password.html"));
});
app.get("/", (req, res) => res.send("✅ GreenBill backend running"));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
