# LJ Jewelry E-Commerce Platform

LJ is a modern jewelry commerce platform built as a full-stack MERN application. It combines a refined storefront experience with a structured admin and API layer, supporting product browsing, authentication, cart and order flows, live metal-rate driven pricing, and media-backed product management.

The project is organized as two coordinated applications:

- `backend` provides the Express API, MongoDB data layer, authentication, cart/order/product logic, and image upload handling.
- `frontend` delivers the React + Vite client, route structure, UI shell, reusable components, and application state providers.

## Highlights

- Role-aware authentication with local login/register and Google sign-in support.
- Product catalog and detail flows designed for a premium shopping experience.
- Cart, checkout, order, and order-history workflows.
- Live price computation based on metal rates.
- Admin-oriented content management structure for products and orders.
- Cloudinary-backed uploads with a local disk fallback when credentials are unavailable.
- Centralized API, cart, auth, and rate contexts for predictable state management.

## Tech Stack

- Frontend: React 19, Vite, React Router, Tailwind CSS, Axios, React Helmet Async, React Hot Toast
- Backend: Node.js, Express 5, MongoDB, Mongoose, JWT, bcrypt, Multer, Cloudinary
- Auth and integrations: Google OAuth, rate limiting, REST API architecture

## Project Structure

```text
backend/
  server.js
  src/
    config/
    controllers/
    functions/
    middlewares/
    models/
    routes/
    scripts/
    utils/
  uploads/

frontend/
  src/
    api/
    components/
    context/
    pages/
    utils/
```

## Prerequisites

- Node.js 18+ recommended
- MongoDB connection string
- Optional Cloudinary credentials for remote image storage
- Optional Google OAuth client ID for frontend sign-in

## Environment Variables

Create a `.env` file in `backend/` with the backend configuration used by the server:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in `frontend/` if you want Google sign-in configured locally:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

If Cloudinary variables are not provided, the backend falls back to local disk uploads in `backend/uploads`.

## Installation

Install dependencies separately for each app:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running the Project

Start the backend API:

```bash
cd backend
npm start
```

Start the frontend development server:

```bash
cd frontend
npm run dev
```

By default, the backend runs on port `5000`, and the frontend runs on the Vite dev server.

## Available Scripts

Backend:

- `npm start` - start the API with Nodemon

Frontend:

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build locally

## What This Project Covers

The current codebase includes a production-style foundation for a jewelry storefront: authentication, product management, cart persistence, pricing logic, rate handling, uploads, and a structured multi-page React UI. The code is already split in a way that supports future expansion into a more complete commerce platform without requiring a redesign of the core architecture.

## Notes

- The backend automatically loads `.env` from `backend/`.
- Image uploads are stored in Cloudinary when configured, otherwise they are written locally.
- The frontend wraps the app with authentication, cart, rate, routing, and error-boundary providers for predictable runtime behavior.
