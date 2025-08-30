# ⚙️ Git Repository Dashboard – Backend

This is the **backend service** for the Git Repository Dashboard project.  
It provides APIs to fetch and manage GitHub repository data.  
Built with **Node.js + Express + MongoDB**, and deployed on **AWS EC2** with **PM2** for process management.  

---

## 🌐 Live API

- **Base URL (EC2):** [http://13.127.84.94:3003](http://13.127.84.94:3003)  
- **Repositories API:** [http://13.127.84.94:3003/repo/all](http://13.127.84.94:3003/repo/all)  

---

## 🛠️ Tech Stack
- **Node.js + Express** – Backend framework  
- **MongoDB Atlas** – Database  
- **AWS EC2 (Ubuntu)** – Deployment server  
- **PM2** – Keeps server running  
- **CORS** – Cross-origin support  

---

## 📌 Features
- REST API for repositories (`/repo/all`)  
- MongoDB Atlas integration  
- EC2 deployment with PM2  
- Frontend (Amplify) connected to backend  

---

## ⚙️ Local Setup
```bash
# Clone the repo
git clone https://github.com/arvi8080/Git-backend
cd Git-backend

# Install dependencies
npm install


PORT=3003
MONGO_URI=your_mongodb_connection_string🚀 Deployment on EC2

Launch AWS EC2 (t2.micro – Free Tier) with Ubuntu.

Install Node.js, npm, and pm2.

Clone backend repo and install dependencies.

Add .env file with MongoDB Atlas URI.

Open port 3003 in EC2 Security Group.

Start server with pm2:

npm start


# Add environment variables
touch .env

🚀 Deployment on EC2

Launch AWS EC2 (t2.micro – Free Tier) with Ubuntu.

Install Node.js, npm, and pm2.

Clone backend repo and install dependencies.

Add .env file with MongoDB Atlas URI.

Open port 3003 in EC2 Security Group.

Start server with pm2:

pm2 start index.js --name git-backend
pm2 save
pm2 startup

🐞 Issues Faced & Fixes

CORS Errors → Installed cors and allowed Amplify domain.

ETIMEDOUT → Checked public EC2 IP & port security.

Server stopped after logout → Fixed using pm2.

📚 Learnings

Hosting Node.js backend on EC2

Connecting MongoDB Atlas to deployed server

Handling CORS between Amplify frontend & EC2 backend

Using pm2 for process management

Debugging AWS networking/firewall issues

🚀 Future Improvements

Add authentication with JWT

Deploy with Nginx + HTTPS

Custom domain for API

Extend repository management APIs

👨‍💻 Author

Arvind Prajapati

GitHub: @arvi8080

LinkedIn: Arvind Prajapati



