# Sporty.com - Sports Statistics Tracker

A React + TypeScript + Vite web application for tracking football statistics with user authentication powered by Supabase.

**Live Demo:** [https://sport-stats-tracker-five.vercel.app/](https://sport-stats-tracker-five.vercel.app/)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Technology Stack](#technology-stack)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`
- **npm** (comes with Node.js) or **yarn**
  - Verify npm: `npm --version`
- **Git** for version control
- **Supabase Account** (for authentication and database)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Siyabonga-Alfred-Nyembe/Sport-Stats-Tracker
   cd Sport-Stat-Tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment variables

Create a `.env` in the project root (do not commit). Vite exposes variables prefixed with `VITE_` to the client.

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Restart the dev server after changing env vars.

## Running the Application

### Development Server
```bash
npm run dev
# or
yarn dev
```

The application will start on `http://localhost:5173`

### Production Build
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
sporty.com/
├── public/
│   └── vite.svg
├── src/
│   ├── __test__/          # Test files
│   ├── pages/             # Page components
│   │   ├── landingPage.tsx    # Home page
│   │   ├── land.tsx           # User dashboard
│   │   ├── login.tsx          # Login page
│   │   ├── signup.tsx         # Registration page
│   │   ├── forgot.tsx         # Password reset request
│   │   └── reset.tsx          # Password reset form
│   ├── Styles/            # CSS stylesheets
│   │   ├── landingPage.css
│   │   └── signUpLogin.css
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # Application entry point
│   └── vite-env.d.ts      # TypeScript environment types
├── supabaseClient.ts      # Supabase configuration
├── package.json
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── vitest.config.cjs        # Vitest testing configuration
```

## Features

### Authentication System
- **Custom Username/Password Authentication**
  - Secure password hashing using SHA-256
  - Custom user table in Supabase
- **Google OAuth Integration**
  - One-click Google sign-in
  - Automatic user profile creation
- **Password Reset Flow**
  - Email-based password reset
  - Secure password update process

### User Interface
- **Landing Page**: Marketing page with call-to-action buttons
- **User Dashboard**: Personalized welcome page with Google user detection
- **Responsive Design**: Mobile-friendly interface
- **Modern Styling**: Gradient backgrounds and smooth animations

### Navigation
- **React Router**: Client-side routing between pages
- **Protected Routes**: Authentication-based navigation
- **State Management**: User session persistence

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run test` | Run Vitest tests |

## Testing

This project uses Vitest for testing:

```bash
# Run tests
npm run test
# or
yarn test

```

Example test file is included in `src/__test__/mock.test.js`.

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Configure environment variables on your hosting platform

## Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite 7.1.2** - Build tool and dev server
- **React Router Dom 7.8.1** - Client-side routing

### Backend/Database
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL database
  - Real-time subscriptions

### Authentication
- **Supabase Auth** - User management
- **Google OAuth** - Social login
- **Crypto-JS** - Password hashing

### Development Tools
- **TypeScript ESLint** - Code linting
- **Vitest** - Testing framework
- **ts-jest** - TypeScript Jest preset

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with descriptive messages
5. Push to your fork and create a pull request
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
