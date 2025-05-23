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

## 🧱 **Models in Mongoose**

Models are constructor functions that create new JavaScript objects based on a defined schema. These objects include all the properties and methods specified in the schema, including methods to interact with the database.

### Saving an object

To save a new object to the database, use the `save` method, which returns a promise:

```js
Person.save().then(result => {
  console.log('person saved!');
  mongoose.connection.close();
});
```

### Retrieving objects

To retrieve all documents from the collection, use the find method with an empty object as the search criteria:

```js
Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person);
  });
  mongoose.connection.close();
});
```

### Deleting an object

You can delete an object using Mongoose's findByIdAndDelete method:

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});
```

## 🔧 Formatting JSON Output

By default, Mongoose includes fields like _id and __v that aren't always useful for frontend applications. To clean up the returned JSON, you can override the toJSON method in the schema:

```js
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
```

---

## ⚠️ Error Handling and Status Codes

- `400 Bad Request`: If name or number is missing or not unique.
- `404 Not Found`: If person is not found during lookup by ID.
- `204 No Content`: On successful deletion of a contact.

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

- **Same-Origin Policy** blocks cross-origin API requests by default
- Use **CORS** for development cross-origin communication
- Use `app.use(express.static('dist'))` to serve frontend
- Use **relative URLs** to simplify frontend API logic
- Configure **Vite proxy** for seamless development experience
- Remove CORS once everything shares the same origin in production
- Setting up an Express server
- Creating RESTful routes (GET, POST, DELETE)
- Using middleware: `express.json()` for parsing JSON
- Custom middleware for tracking request timestamps
- Using `morgan` for logging HTTP requests with a custom token
- Responding with appropriate HTTP status codes: `200`, `201`, `204`, `400`, `404`
- Filtering and finding objects within an array
- Data validation for POST requests
- Returning custom error messages for invalid or duplicate inputs
- Avoiding multiple responses using `return` before `res` calls in conditional branches
- Managing in-memory data updates properly (especially in DELETE route)
- Formatting HTML responses with line breaks using `<br>`
- Define and use Mongoose models
- Save and fetch data from MongoDB
- Format returned JSON for frontend use
- Centralize error handling with middleware
- Perform CRUD operations via RESTful routes


Link to deployed backend: https://fso-step-10-11-rfah.onrender.com


Made with ❤️ during the Full Stack Open course.