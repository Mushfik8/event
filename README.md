# Event Sharing App

A modern, production-ready event sharing platform built with React, TypeScript, and Tailwind CSS featuring a beautiful dark/light theme system.

## Features

- **User Authentication**: Login and registration with persistent sessions
- **Event Management**: Create, view, and manage events
- **Messaging System**: Direct messaging between users and event hosts
- **Admin Panel**: Administrative controls for user and event management
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Responsive Design**: Mobile-first design that works on all devices
- **Performance Optimized**: Fast loading with code splitting and lazy loading
- **Accessibility**: WCAG compliant with proper contrast ratios
- **PWA Ready**: Service worker and manifest for app-like experience

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-sharing-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

### Troubleshooting Local Development

If you encounter issues running the app locally:

1. **Clear npm cache and reinstall:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Try alternative start commands:**
```bash
npm start
# or
npm run serve
```

3. **Check Node.js version:**
```bash
node --version
# Should be 16.0.0 or higher
```

4. **Common port issues:**
If port 5173 is busy, Vite will automatically use the next available port.

## Usage

### User Features
- **Registration/Login**: Create an account or login with existing credentials
- **Browse Events**: View all available events with search and filter options
- **Event Details**: Click on events to see full details and contact organizers
- **Messaging**: Click on event organizer names/photos to start conversations
- **Profile Management**: Update your profile information and avatar

### Admin Features
- **Admin Login**: Use admin credentials to access administrative features
- **User Management**: View and manage user accounts
- **Event Moderation**: Monitor and manage events
- **System Overview**: Dashboard with key metrics

### Demo Credentials
- **Regular User**: Any email/password combination
- **Admin Access**: `admin@eventshare.com` / `admin123`

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Development**: ESLint, TypeScript
- **Theme System**: Context-based dark/light mode
- **Performance**: Code splitting, lazy loading, service worker

## Performance Optimizations

- **Bundle Splitting**: Vendor, router, and icon chunks
- **Tree Shaking**: Unused code elimination
- **Minification**: Terser for JavaScript compression
- **Image Optimization**: WebP format with fallbacks
- **Lazy Loading**: Components and routes loaded on demand
- **Service Worker**: Caching for offline functionality

## Accessibility Features

- **WCAG 2.1 AA Compliant**: Proper contrast ratios and focus management
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Reduced Motion**: Respects user's motion preferences
- **High Contrast Mode**: Support for high contrast displays
## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   └── ThemeToggle.tsx
├── contexts/           # React contexts for state management
│   ├── AuthContext.tsx
│   ├── EventContext.tsx
│   ├── MessageContext.tsx
│   └── ThemeContext.tsx
├── pages/              # Main application pages
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
VITE_API_URL=http://localhost:3001
```

## Deployment

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Vercel
```bash
npm run build
# Deploy using Vercel CLI or GitHub integration
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards (ESLint + Prettier)
4. Ensure accessibility compliance
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is licensed under the MIT License.