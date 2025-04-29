# fso-step-10-11

# 📞 Full Stack Phonebook App — Backend, Frontend, and Deployment

This project implements a full-stack phonebook application using **Node.js**, **Express**, and **React**. This README focuses specifically on **deployment**, **handling CORS**, **static content serving**, and **proxying API requests**.

---

## 🌍 Understanding Same-Origin Policy

A **URL's origin** is defined as the combination of:
- **Protocol (Scheme)**: `http` or `https`
- **Hostname**: the domain, e.g., `example.com`
- **Port**: the server port, e.g., `80`, `5173`, `3001`

For example:

```
http://example.com:80/index.html
```

- Protocol: `http`  
- Host: `example.com`  
- Port: `80`

### 🧱 Same-Origin Limitation

By default, JavaScript running in the browser can **only communicate with the same origin**.

If the frontend is served from:

```
http://localhost:5173
```

And the backend is served from:

```
http://localhost:3001
```

The browser blocks the request because the origins do **not match**.

---

## 🔄 Solution 1: Enable CORS (Cross-Origin Resource Sharing)

To enable frontend and backend to communicate across different origins in development, you can use the **CORS middleware**:

### ✅ Installation

```bash
npm install cors
```

### ✅ Backend Configuration (`index.js`)

```js
const cors = require('cors');
app.use(cors());
```

This allows the backend to respond to requests from other origins like `localhost:5173`.

---

## ⚙️ Solution 2: Serve Frontend from Backend in Production

When deployed, frontend and backend should ideally be served from the **same origin**. Steps:

### 🛠 1. Create a Production Build (Frontend)

Using Vite:

```bash
npm run build
```

This creates a `dist` folder containing an optimized static site.

### 📦 2. Copy `dist` to Backend

Move the `dist/` directory into the root of the backend project:

```bash
mv dist ../backend/dist
```

### 🔌 3. Serve Static Files via Express

In `index.js` of the backend:

```js
app.use(express.static('dist'));
```

Now, for example:

- `GET /` or `/index.html` will serve the React app
- `GET /api/persons` will be routed to the backend

---

## ⚙️ Setting Up the Frontend Base URL

Once both frontend and backend are hosted from the **same origin**, requests from React can use **relative URLs**:

```js
axios.get('/api/persons');
```

There is no need to include the full server address.

---

## ⚙️ Solution 3: Use Proxy in Development (Vite)

In **development**, frontend is still at port `5173` and backend at `3001`.  
To avoid CORS and maintain consistent relative URLs, configure a **proxy** in `vite.config.js`:

### 🧩 `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

### 🔁 Behavior

- React dev server will **proxy** requests like `/api/persons` to `localhost:3001/api/persons`.
- React handles frontend paths (`/`, `/index.html`, etc.).
- Backend handles `/api/...`.

---

## 🧹 Optional: Remove CORS in Production

After setting up the proxy and static serving:

- All requests are made from the **same origin**.
- You can **remove the `cors` middleware** in `index.js`:

```bash
npm remove cors
```

---

## ✅ Final Setup Summary

| Scenario           | Setup Required                                               |
|--------------------|--------------------------------------------------------------|
| Development        | Use `cors` **or** Vite proxy to `localhost:3001`             |
| Production         | Serve React frontend from `express.static('dist')`           |
| Consistent URLs    | Use **relative URLs** (`/api/persons`) in frontend code        |

---

## ✅ Example Directory Structure (Production)

```
backend/
├── dist/              # production frontend build
│   ├── index.html
│   └── assets/
├── index.js           # Express server
├── package.json
└── ...
```

---

## 🧠 Recap of Core Concepts

- ✅ **Same-Origin Policy** blocks cross-origin API requests by default
- ✅ Use **CORS** for development cross-origin communication
- ✅ Use `app.use(express.static('dist'))` to serve frontend
- ✅ Use **relative URLs** to simplify frontend API logic
- ✅ Configure **Vite proxy** for seamless development experience
- ✅ Remove CORS once everything shares the same origin in production



Link to deployed backend: https://fso-step-10-11-rfah.onrender.com