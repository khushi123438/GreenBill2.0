# 🌿 GreenBill2.0 – Smart Digital Billing & Expense Tracker

GreenBill2.0 is a full-stack web application that allows users to upload, store, and manage their bills digitally.  
The system analyzes previous billing data and estimates next month’s expected expense using logical trend calculations.

It promotes paperless billing and smart expense tracking.


## 🚀 Overview

GreenBill2.0 helps users:

- Upload and store bills securely
- Access complete billing history
- Track monthly expenses
- Get next month expense estimation based on previous records
- Interact with a built-in chatbot for bill-related queries
- Manage accounts securely through authentication

---

## ✨ Key Features

### 🔐 Authentication System
- User Signup & Login
- Secure password encryption
- JWT-based authentication
- User-specific data storage

### 🧾 Bill Management
- Upload bills
- Store bills permanently in database
- View and manage previous bills
- Search and filter functionality

### 📊 Monthly Expense Estimation
- Calculates spending trends from past months
- Estimates next month’s expense
- Helps in budget planning

### 🤖 Integrated Chatbot
- Responds to bill-related queries
- Provides expense summary
- Assists users within the application

### 📁 Persistent Storage
- All bills stored in MongoDB
- Secure and user-isolated data

### 📱 Responsive Interface
- Clean and user-friendly UI
- Works across devices

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JWT
- bcrypt

---

GreenBill-2.0/
│
├── client/ # Frontend Client
├── server/ # Backend Server
├── models/ # Database Models
├── routes/ # API Routes
├── controllers/ # Business Logic
├── chatbot/ # Chatbot Logic
└── .env # Environment Variables


---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login | Login user |
| POST   | /api/bill/upload | Upload bill |
| GET    | /api/bill/all | Get all bills |
| GET    | /api/estimate | Get next month expense estimation |
| POST   | /api/chat | Chatbot interaction |

---

## ⚙️ Installation & Setup

1. Clone the repository
git clone https://github.com/khushi123438/GreenBill2.0.git


2. Install dependencies
cd server
npm install

cd ../client
npm install


3. Add environment variables
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key


4. Run the application
npm start


---

## 📈 Estimation Logic

The system calculates previous monthly expenses and applies logical trend analysis to estimate next month’s expected spending.

---

## 🎯 Project Highlights

- Full-stack MERN implementation
- Authentication & secure data handling
- Logical data analysis
- Real-world financial tracking use case

---

## 👩‍💻 Author

Khushi Pandey  
B.Tech CSE | MERN Stack Developer


