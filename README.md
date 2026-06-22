# 🛎️ Look's Men's Parlour & Salon

A premium, modern, dark-themed digital experience for a modern salon and family parlour. Designed with sleek typography, high-contrast gold accents, luxury spacing, fluid interactive-state animations, and practical business tools.

---

## 🌟 Key Features

*   **Interactive Booking System**: A clean, multi-step booking wizard with dynamic services selection, automated date styling, time-slot selection, validation checks, and customer detailed options.
*   **Double-Channel Email Notifications**:
    1.  **Immediate Admin Alerts**: Custom-coded automated email notification dispatch using `FormSubmit.co` to ensure the owner (`ksurajyadav93@gmail.com`) receives fully detailed order notifications directly in their inbox with no hidden API keys or backend servers needed!
    2.  **Custom EmailJS Webhook**: Configurable API integration for custom transactional service routes.
*   **Dynamic Gallery & Shop Showcase**: A beautiful photo stream showing real shop images with interactive category filters ("All", "Shop", "Styling", "Grooming", "Equipment") and live interactive like/comment counters.
*   **Interactive Admin Console**: Under-the-hood salon manager dashboard to track reservations, manage real-time notifications, customize webhook addresses, and update destination email parameters in real-time.
*   **Responsive Modern Layout**: Perfectly designed for mobile touch-targets and wide-screen desktop displays, leveraging custom font parings and beautiful smooth motion.

---

## 🛠️ Built With

*   **Core**: React 19 + TypeScript + Vite 6 (Single Page Application architecture)
*   **Styling**: Tailwind CSS v4 (Using raw utility directives and an elegant Charcoal-Gold design palette)
*   **Animations**: `motion` (for smooth tab transitions and wizard steps)
*   **Icons**: `lucide-react` (for consistent modern vector iconography)
*   **Form Despatches**: Safe client-side Ajax integrations via production-ready webhook fallbacks

---

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### 1. Close and Install Dependencies
```bash
# Install packages defined in package.json
npm install
```

### 2. Launch Development Server
```bash
# Run the local Vite preview server on your port
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to inspect.

### 3. Build & Produce Static Dist
```bash
# Compile TypeScript files & bundle assets into /dist
npm run build
```
This produces a fully self-contained static folder inside `dist/` ready to host anywhere!

---

## 🚀 How to Deploy on GitHub

This website is a **Client-Side SPA (React Single Page Application)**. You can compile all features into a static bundle with `npm run build` and host it for free on **GitHub Pages**, **Vercel**, **Netlify**, or **Cloud Run**. 

### Deploying directly to GitHub Pages:
1.  **Install gh-pages helper package**:
    ```bash
    npm install --save-dev gh-pages
    ```
2.  **Configure path in `vite.config.ts`**:
    Ensure the `base` key in `vite.config.ts` matches your repository name:
    ```javascript
    base: "/your-repository-name/",
    ```
3.  **Add deploy scripts to `package.json`**:
    ```json
    "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
    }
    ```
4.  **Run Deploy Tool**:
    ```bash
    npm run deploy
    ```
    Your website will be live at `https://<your-username>.github.io/<your-repository-name>/` with all bookings, galleries, notification alerts, and styles fully preserved and operational!

---

## ⚙️ Customizing the Owner E-Mail Actions

You don't need any backend servers! All reservations are fully logged and safely pushed to your inbox:
1.  Open the website in your browser.
2.  Click the secret menu/notification drawer or scroll to the reservation admin desk.
3.  Choose **Settings / Email JS**.
4.  Update the **Admin Notification Recipient Email** (e.g. `your-email@gmail.com`) and click Save. 
5.  This is saved permanently in your browser's local cache. Future bookings will instantly alert that inbox, allowing you to manage client bookings completely on-the-go from your mobile phone!
