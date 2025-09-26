# Omillionaire Indian Site Client

A modern, responsive React application for an online lottery platform built with TypeScript, Vite, and Bootstrap. The application provides a complete user experience for purchasing lottery tickets, managing user profiles, and handling authentication via OTP.

## 🎯 Features

### Core Functionality

- **User Authentication**: Phone number-based OTP authentication system
- **Lottery Tickets**: Browse and purchase lottery tickets with interactive scratch cards
- **Shopping Cart**: Add tickets to cart with real-time cart management
- **User Profile**: Complete profile management with password change and account deletion
- **Purchase History**: Track purchased tickets and transaction history
- **Responsive Design**: Mobile-first design with Bootstrap components

### Technical Features

- **Modern React 19**: Latest React features with functional components and hooks
- **TypeScript**: Full type safety throughout the application
- **Redux Toolkit**: Centralized state management with modern Redux patterns
- **Axios Integration**: HTTP client for API communication
- **Phone Input**: International phone number input with country selection
- **Day.js**: Modern date/time handling
- **Lottie Animations**: Smooth animations for enhanced UX
- **Global Loading System**: Centralized loading state management

## 🛠 Tech Stack

### Frontend Framework

- **React 19** - Modern React with latest features
- **TypeScript 5.7** - Type-safe JavaScript
- **Vite 6.3** - Fast build tool and development server

### UI & Styling

- **Bootstrap 5.3** - Responsive CSS framework
- **Reactstrap 9.2** - Bootstrap React components
- **SASS** - CSS preprocessor for enhanced styling
- **FontAwesome** - Icon library

### State Management

- **Redux Toolkit 2.8** - Modern Redux with simplified syntax
- **React Redux 9.2** - React bindings for Redux
- **Redux Loading Bar** - Visual loading indicators

### Utilities

- **Axios 1.10** - HTTP client for API requests
- **Day.js 1.11** - Lightweight date manipulation
- **React Phone Number Input** - International phone input
- **React Router Dom 7.5** - Client-side routing
- **React Toastify** - Toast notifications
- **Lottie React** - Animation library

## 📁 Project Structure

```
src/
├── app/                          # Application configuration
│   └── config/                   # Configuration files
│       ├── axios-interceptor.ts  # HTTP interceptors
│       ├── constants.ts          # App constants
│       ├── store.ts             # Redux store configuration
│       └── translation.ts       # i18n setup
├── assets/                       # Static assets
│   └── images/                   # Image files
├── components/                   # Reusable components
│   ├── cart-ribbon/             # Shopping cart indicator
│   ├── loading/                 # Loading components
│   ├── scratch-card/            # Interactive scratch cards
│   └── ticket-image/            # Ticket display components
├── layout/                       # Layout components
│   ├── auth-layout/             # Authentication pages layout
│   ├── main-layout/             # Main application layout
│   ├── header/                  # Application header
│   └── footer/                  # Application footer
├── modules/                      # Feature modules
│   ├── auth-flow/               # Authentication flow
│   │   ├── login.tsx           # Login page
│   │   ├── register.tsx        # Registration page
│   │   └── otp-verification.tsx # OTP verification
│   ├── home/                    # Home page
│   ├── my-cart/                 # Shopping cart
│   ├── purchase-success/        # Purchase confirmation
│   └── user-profile/            # User profile management
└── shared/                       # Shared utilities
    ├── api/                     # API service layer
    ├── auth/                    # Authentication utilities
    ├── context/                 # React contexts
    └── reducers/                # Redux reducers
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bombe-ai/omillionaire-indian-site-client.git
   cd omillionaire-indian-site-client
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment setup**

   Copy the environment configuration and update as needed:

   ```bash
   cp .env .env.local
   # Edit .env.local with your local configuration if needed
   ```

4. **Start development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📝 Available Scripts

| Script         | Description                              |
| -------------- | ---------------------------------------- |
| `pnpm dev`     | Start development server with hot reload |
| `pnpm build`   | Build production-ready application       |
| `pnpm lint`    | Run ESLint for code quality checks       |
| `pnpm preview` | Preview production build locally         |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Olotto
VITE_NODE_ENV=development
VITE_DEVELOPMENT=true
VITE_API_URL=https://cms.olotto.co
```

### Path Aliases

The project uses path aliases for cleaner imports:

```typescript
import Component from "@components/component-name/component-name";
import { api } from "@shared/api/api-service";
import Layout from "@layout/main-layout/main-layout";
```

Available aliases:

- `@/` → `src/`
- `@components/` → `src/components/`
- `@modules/` → `src/modules/`
- `@shared/` → `src/shared/`
- `@layout/` → `src/layout/`
- `@assets/` → `src/assets/`

## 🏗 Architecture

### State Management

The application uses Redux Toolkit for state management with the following structure:

- **Authentication**: User login state and profile information
- **Loading**: Global loading states for UI feedback
- **Cart**: Shopping cart state management
- **User Profile**: User profile and preferences

### API Integration

- Centralized Axios configuration with interceptors
- Automatic token management for authenticated requests
- Error handling middleware for consistent error responses

### Component Architecture

- Functional components with React hooks
- TypeScript interfaces for prop validation
- Reusable UI components with consistent styling
- Modular SCSS for component-specific styles

## 🔐 Authentication Flow

1. **Phone Number Input**: User enters phone number with country code
2. **OTP Generation**: Backend sends OTP via SMS
3. **OTP Verification**: User enters OTP for verification
4. **Token Storage**: JWT token stored for authenticated requests
5. **Auto-logout**: Automatic session management

## 🛡 Security Features

- Phone number validation with country code requirements
- OTP expiration and cooldown timers
- JWT token management with automatic renewal
- Input sanitization and validation
- Protected routes with authentication guards

## 📱 Responsive Design

- Mobile-first approach with Bootstrap grid system
- Responsive breakpoints for all device sizes
- Touch-friendly interactions for mobile devices
- Progressive enhancement for desktop features

## 🎨 UI/UX Features

- Smooth animations with Lottie
- Interactive scratch cards for lottery tickets
- Real-time cart updates with visual feedback
- Toast notifications for user actions
- Loading states for all async operations

## 🔍 Development Guidelines

### Code Style

- ESLint configuration for consistent code style
- TypeScript strict mode for type safety
- Prettier integration for code formatting
- Husky pre-commit hooks for quality assurance

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow atomic design principles
- Include proper error boundaries

### Testing (Future Implementation)

- Unit tests with Jest and React Testing Library
- Integration tests for user flows
- E2E tests with Playwright or Cypress

## 🚀 Deployment

### Production Build

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

The build generates optimized static files in the `dist/` directory ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
