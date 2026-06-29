# StudyNook 🏫✨

### Modern Peer-to-Peer Library Study Room Booking Platform

StudyNook is a responsive, feature-rich, and recruiter-friendly full-stack web application where students, educator circles, and librarians can seamlessly list study cells, and registered students can search, filter, and reserve high-focus study spaces in real-time.

- **Live Client Portal (Netlify)**: [StudyNook Netlify Client](https://studynook-client.netlify.app)

---

## 🌟 Key Features

- 📅 **Real-Time Double-Booking Conflict Prevention**: Advanced scheduling overlap algorithms check requested slots in real-time, protecting libraries and users from overlapping reservation conflicts.
- 🔍 **Interactive Catalog with Adaptive Search & Filters**: Search rooms by text and filter dynamically based on floor number, maximum price, and customizable premium conveniences (e.g., High-Speed Wi-Fi, Interactive Whiteboard, Projectors, Air Conditioning).
- 🔒 **Secure Cookie-Based JWT Authentication**: Uses robust JSON Web Token (JWT) credentials stored inside secure, HTTP-only, and cross-site cookies with flexible fallback options for Google Single Sign-On (SSO).
- 💼 **Dual Operational Dashboards (`My Listings` & `My Bookings`)**: High-fidelity control centers allowing users to register new study spaces, update room pricing and status, check active room bookings, or cancel upcoming schedules safely.
- 🎨 **Ivy League Premium Vibe & Multi-Theme Controller**: Elegant visual architecture combining modern clean typography (Inter, Space Grotesk) with customizable premium daisyUI styles, light/dark modes, and smooth `framer-motion` view transitions.
- 🔄 **History-API Stateful Custom Router**: Guarantees page-refresh immunity across Netlify CDN or traditional server deployment targets, resolving fallback redirections without resetting state.

---

## 🛠️ Technology Stack

- **Client Frontend**: React (v19), Vite, Tailwind CSS (v4), daisyUI, Motion, Lucide Icons, Sonner Toaster.
- **Server Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Cookie-Parser, BcryptJS.
- **Database Schema**: MongoDB (via Mongoose) featuring an automatic local JSON database fallback.

---
