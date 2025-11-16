# Electription – Blockchain-Based Electronic Voting System

<p align="right">
  <strong>🇬🇧 English</strong> | <a href="README.md">🇹🇷 Türkçe</a>
</p>

## 📋 About the Project

Electription is a graduation project that offers a secure, transparent, and decentralized electronic voting infrastructure using blockchain technology. The system consists of a React-based frontend, a Node.js/Express backend, smart contracts written in Solidity, and a MySQL database.

📅 Project Date: June 2025

---

## 🏗️ Project Structure

```
electription/
├── frontend/          # React-based user interface
├── backend/           # Node.js/Express API server
├── blockchain/        # Hardhat/Solidity smart contracts
└── database/          # MySQL database schema
```

---

## 🛠️ Technologies Used

### Frontend
- React 19.1.0
- React Router DOM 7.6.0
- Axios
- Lucide React (icons)
- Tailwind CSS

### Backend
- Node.js
- Express 5.1.0
- MySQL
- JWT (authentication)
- bcrypt (password hashing)

### Blockchain
- Hardhat 2.24.0
- Ethers.js 6.14.0
- Solidity 0.8.22
- OpenZeppelin Contracts 5.3.0

---

## 📦 Setup

### Requirements
- Node.js (v16+)
- MySQL
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd electription
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file and fill it based on the example below:

```env
# backend/edb.env example
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=evoting_db
JWT_SECRET=your-very-secret-jwt-key
PORT=3003
```

> ⚠️ Note: The `backend/edb.env` file is not included in the repository for security reasons.  
> You must create it manually in your local environment.

---

### 3. Database Setup
```bash
mysql -u root -p < database/edb.sql
```

### 4. Blockchain Setup
```bash
cd blockchain
npm install
```

### 5. Frontend Setup
```bash
cd frontend
npm install
```

---

## 🚀 Running the Project

### 1. Start the Blockchain Node
```bash
cd blockchain
npx hardhat node
```

### 2. Deploy Smart Contracts
```bash
cd blockchain
npx hardhat run scripts/deploy_VoteToken.js --network localhost
```

### 3. Start the Backend Server
```bash
cd backend
node edb.js
```

### 4. Start the Frontend App
```bash
cd frontend
npm start
```

The app will be available at `http://localhost:3000`.

---

## 🧠 Technical Notes

- The system automatically detects the local IP address using the following code:
  ```js
  const localIP = networkInterfaces["Wi-Fi"]?.find(info => info.family === "IPv4")?.address || "localhost";
  ```
  - This works on **Windows systems** via the `"Wi-Fi"` interface.
  - On **Linux systems**, `"Wi-Fi"` may not exist — users must manually enter the IP.
  - This logic is **not dependent on `.env`** and is defined directly in the code.

- The deployment logic in `blockchain/scripts/deploy_VoteToken.js` is also present in `backend/edb.js`.  
  This duplication allows the backend to interact directly with the blockchain.  
  In future versions, this can be modularized into a shared utility.

---

## 🔑 Features

- ✅ Secure blockchain-based voting
- ✅ Voter registration and verification
- ✅ Admin panel
- ✅ Candidate management
- ✅ Real-time vote counting
- ✅ JWT-based authentication
- ✅ Transparent and immutable vote records

---

## 🔐 Security

- Passwords are hashed using bcrypt  
- JWT tokens ensure secure session management  
- Immutable records are stored on the blockchain  
- Voter verification via national ID number

---

## 📝 Default Admin Credentials

**⚠️ MUST BE CHANGED IN PRODUCTION!**

- Username: `admin`  
- Password: (hashed in `database/edb.sql`)

---

## 👥 Contributors

- [İbrahim GÜNEŞ](https://github.com/ibrahimgunes)
- [İshak DURAN](https://github.com/dr-isosan)
- [Cuma TALJİBİNİ](https://github.com/Ctaljibini)
---
## 🤝 Contributing Guide

This is a graduation project, but we still welcome your contributions!

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/e-vote.git
cd e-vote
```

### 2. Create a Branch
```bash
git checkout -b feature/new-feature
# or
git checkout -b fix/bug-fix
```

### 3. Make Your Changes
- Follow the existing code style  
- Add comments where necessary  
- Test your changes

### 4. Commit
```bash
git add .
git commit -m "feat: added new feature"
```

#### Commit Message Format
```
<type>: <short description>

[optional detailed explanation]
```

**Types:**
- `feat`: New feature  
- `fix`: Bug fix  
- `docs`: Documentation  
- `style`: Code formatting  
- `refactor`: Code improvement  
- `test`: Adding tests  
- `chore`: General tasks

### 5. Push and Create a Pull Request
```bash
git push origin feature/new-feature
```
Then open a Pull Request on GitHub.

---

## 📋 Coding Standards

- **JavaScript**: Follow ESLint rules  
- **React**: Use functional components  
- **Solidity**: Follow OpenZeppelin standards  
- **Comments**: Explain complex code blocks

---

## 🐛 Bug Reports

When opening an issue:

- Clearly describe the bug  
- Provide steps to reproduce  
- Explain expected vs actual behavior  
- Attach screenshots if available

---

## 💡 Feature Suggestions

- Describe the feature in detail  
- Explain why it’s needed  
- Provide usage scenarios

---

## ✅ Pull Request Checklist

- [ ] Code runs and is tested  
- [ ] New features are documented  
- [ ] Commit messages are clear  
- [ ] No merge conflicts  
- [ ] `.gitignore` includes sensitive files
---
## 🔐 Security Notes

- Never commit `.env` or `backend/edb.env` files
- Always change `JWT_SECRET` and admin password in production
- Ensure `.gitignore` excludes sensitive files
- See `SECURITY.md` for full security guidelines
---
## 📄 License

This project is licensed under the [MIT License](LICENSE).  
You are free to use, modify, and distribute the code.
