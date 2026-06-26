# LeadOptix | Automated Lead Management & Email Tracking System

LeadOptix is a full-stack **MERN (MongoDB, Express, React, Node.js)** application designed to capture user leads, persist data in a MongoDB database, send automated tracked emails, and display detailed engagement metrics (Email Opens, Link Clicks, Conversion Rates, AI Classification) in an interactive dashboard.

---

## 🚀 Key Features

1. **Lead Capture Form:** Collects Full Name, Email, Phone, Company, and Message/Requirement.
2. **AI Requirement Classifier:** Leverages Gemini AI (with a pattern-matching offline fallback) to parse user requirements into categories (*Sales, Support, Careers, Partnership, General*) and determine sentiment (*Positive, Neutral, Negative*).
3. **Automated Tracking Email:** Instantly fires a personalized email upon form submission.
4. **Email Open Tracking:** Uses a transparent `1x1` GIF tracking pixel to monitor unique email opens and total open frequencies.
5. **Link Click Tracking:** Proxies external links through a tracking gateway to count click conversions and redirect the user back to the web application.
6. **Real-time Analytics Dashboard:** Visualizes total leads, sent emails, opens, clicks, conversion rates, and AI classification breakdowns.
7. **Email Sandbox:** A built-in testing interface to inspect sent outbox logs, simulate email opens, and test trackable links directly from the local browser.

---

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Vanilla CSS (Premium Glassmorphic Dark UI), Lucide Icons
- **Backend:** Node.js, Express, Nodemailer, CORS
- **Database:** MongoDB (Atlas / Local)
- **AI Integration:** Google Generative AI (Gemini) SDK / Pattern rule engine

---

## ⚙️ How the Email Tracking System Works

### 1. Email Open Tracking (Tracking Pixel)
During email compilation, an invisible image tag is placed inside the HTML:
```html
<img src="http://localhost:5000/api/track/open/<leadId>" width="1" height="1" style="display:none;" />
```
- When the recipient opens the email, their email client fetches this transparent image from our Express server.
- The server records the hit, increments the open count in MongoDB, logs timestamps, and returns a clean `1x1` transparent GIF buffer.

### 2. Link Click Tracking
Trackable links in the email body are redirected through our tracking gateway:
```html
<a href="http://localhost:5000/api/track/click/<leadId>">Learn More</a>
```
- When clicked, the request hits the backend tracking endpoint.
- The server increments the click counter in MongoDB and issues a `302 Redirect` back to the frontend app, displaying a success banner.

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or a running local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/amitkumaryadav2672/AI-TECH-INTERN.git
cd AI-TECH-INTERN
```

### 2. Configure the Backend
Navigate to the `backend` folder and create a `.env` file:
```bash
cd backend
npm install
```
Add your environment variables inside `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
# Optional: GEMINI_API_KEY=your_gemini_api_key
```
Start the backend server:
```bash
node server.js
```

### 3. Configure the Frontend
Navigate to the `frontend` folder and start the Vite development server:
```bash
cd ../frontend
npm install
npm run dev
```

The application will be live at:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend Server:** [http://localhost:5000](http://localhost:5000)

---

## 🧪 Verification Guide

1. Go to the **Capture Lead** tab in the browser and register a lead.
2. Navigate to the **Email Sandbox** tab to see your outbox logs.
3. Click **Simulate Open** or **Simulate Click** inside the Sandbox.
4. Watch the real-time counters and classification graphs on the **Dashboard** increment immediately.
