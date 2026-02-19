# MiniCart Admin Dashboard

This project is a full-stack MiniCart Admin Dashboard built as part of a technical assessment.
It includes frontend UI implementation, backend APIs, database integration, authentication,
and admin-only features.

---

## 🔧 Tech Stack

**Frontend**
- React
- Axios
- CSS

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- Nodemon
- JWT Authentication

---

## 📁 Project Structure
minicart-project/
│
├── client/ # React frontend
├── server/ # Node.js backend
├── README.md

Migrations

MongoDB uses schema-based models, so migrations are handled automatically through Mongoose models.

Running the Backend
cd server
npm install

Running the Frontend
cd client
npm install
npm start


Authentication & Authorization

JWT-based authentication

Admin-only routes protected with middleware

Admin can post LOCATION AND USER; THESE ARE THE MODULES IMPLEMENTED 

Token must be passed via request headers:

API Testing (Thunder Client / Postman)
Steps:

Authenticate as an admin to obtain JWT token

Open Thunder Client or Postman

Add request header:

📌 Notes

This project was completed within a limited timeframe, focusing on:

Clean code

Maintainable architecture

Best practices

Scalability