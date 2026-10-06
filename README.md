# QRLnk

Turn any link into a QR code. A production-quality, fast, and minimal web application for generating QR codes.

## Features

- **Authentication**: Sign up, log in, reset password (Firebase Auth)
- **Fast Generation**: Client-side QR code generation
- **Customizable**: Change colors and error correction levels
- **Download Options**: Save as PNG or SVG
- **Responsive**: Works on desktop, tablet, and mobile

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your Firebase config:
   ```bash
   cp .env.example .env
   ```
   *(Note: The app will run in "mock mode" if Firebase credentials are not provided, allowing you to test UI locally without a backend).*

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Tech Stack

- React
- TypeScript
- Vite
- Firebase Authentication
- qrcode.react
- Lucide React (Icons)
- Vanilla CSS (Premium, minimal design system)

## Security

- Routes are protected via authentication guard
- URLs are validated and sanitized client-side
- Credentials stored securely via environment variables
