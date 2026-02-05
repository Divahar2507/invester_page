# InnoSphere Admin & Collaboration Portal

A modern, high-fidelity enterprise dashboard designed for managing research, innovation hubs, and collaboration networks. This project utilizes a hybrid React architecture with enhanced visual capabilities.

## 🚀 Features

- **Advanced Dashboard**: Real-time visualization of key metrics, research progress, and ecosystem statistics.
- **Immersive Tech Parks**: Interactive map interface with **Virtual Tour** capabilities and "Immersive View" for facility inspection.
- **Datasheet Generation**: Instant PDF generation for facility technical specifications using `jspdf`.
- **Role-Based Access**: Specialized views for Researchers, Mentors, and Administrators.
- **Modern UI/UX**:
  - Fully responsive design.
  - Glassmorphism and high-end visual aesthetics.
  - **Dark Mode** support (System & Toggle based).
  - Smooth animations and micro-interactions.

## 🛠 Tech Stack

- **Framework**: React 19 (Vite)
- **Language**: JavaScript / TypeScript (Hybrid)
- **Styling**: Tailwind CSS (CDN Configuration) + Lucide React Icons
- **Routing**: React Router DOM v7
- **Utilities**: jsPDF (Reporting)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd innosphere-admin-&-collaboration-portal
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   *Note: This will install React, Vite, and TypeScript support.*

## ⚡ Usage

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
   *(Port defaults to 3000 as configured in `vite.config.js`)*

## 📂 Project Structure

- **/pages**: Application routes (Dashboard, Research, Mentors, TechParks, Seminars).
- **App.jsx**: Main application layout and router setup.
- **constants.jsx**: Static data and configuration constants.
- **index.html**: Entry point with Tailwind CSS configuration.
- **tsconfig.json**: TypeScript configuration.

---

<div align="center">
  <p>InnoSphere Collaboration Portal © 2026</p>
</div>
