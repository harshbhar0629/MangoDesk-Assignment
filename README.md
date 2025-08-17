# 📄 Transcript Summarizer & Email Sender  

A **React + Vite** based application that allows users to:  
- Upload a transcript file  
- Write a custom **prompt** for generating answers using the **Groq API**  
- View the generated **summary** in an editable field  
- Share the final summary with multiple recipients via **email**  

This project integrates **Groq API** for AI-powered text generation and **Nodemailer** for sending summaries via email.  

---

## ✨ Features  

- **Transcript Upload** → Upload your transcript for processing.  
- **Prompt-based Generation** → Enter a prompt and generate responses using Groq API.  
- **Editable Summary** → Generated summaries are displayed in an input field, and you can freely edit them before sending.  
- **Email Sharing** → Share your summaries with multiple recipients at once.  
- **Comma-Separated Emails** → Enter multiple email addresses in a single field (comma-separated).  
- **Email Delivery** → Nodemailer is used to send the summaries. *(Note: Sometimes emails may land in spam; please check spam folders.)*  

---

---

## 🔗 Live Demo  

👉 [Try the website here](https://mangodesk-assignment-kappa.vercel.app/)  

---

## 🛠️ Tech Stack  

- **Frontend:** React + Vite  
- **Backend/Server:** Node.js + Express  
- **AI:** Groq API  
- **Email Service:** Nodemailer  

---

## ⚙️ Installation  

Clone this repository and install dependencies:  

```bash
git clone https://github.com/harshbhar0629/MangoDesk-Assignment.git
cd your-repo-name
npm install
