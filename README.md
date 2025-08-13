# 🗺️ Micro Adventure

**Discover Your Next Micro-Adventure**

A modern, responsive web application for planning, optimizing, and navigating custom routes through your city. Turn everyday walks into extraordinary adventures with location-based route discovery, interactive maps, and seamless navigation.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite)

## 🚀 Features

### ✨ Core Functionality
- **Interactive Route Planning** - Create and customize adventure routes with drag-and-drop waypoints
- **Location-Based Discovery** - Find personalized routes based on your current location
- **Real-Time Navigation** - Turn-by-turn navigation with live location tracking
- **Route Optimization** - AI-powered route optimization for the best experience
- **Offline Support** - Access saved routes without internet connection

### 🎯 User Experience
- **Responsive Design** - Optimized for mobile, tablet, and desktop devices
- **Progressive Web App** - Install and use like a native mobile app
- **Push Notifications** - Get notified about nearby adventures and route updates
- **Smooth Animations** - Fluid UI interactions powered by Framer Motion
- **Error Boundaries** - Graceful error handling and recovery

### 🌍 Location Features
- **GPS Integration** - Real-time location tracking and positioning
- **Interactive Maps** - Powered by Leaflet with custom markers and routes
- **Location Services** - Smart location-based route recommendations
- **Regional Content** - Curated adventures for different Indian cities

## 🏗️ Architecture

### Technology Stack

#### Frontend Framework
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe development with enhanced IDE support
- **Vite 5.4.2** - Fast development server and optimized builds

#### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework for rapid styling
- **Framer Motion 12.23.12** - Smooth animations and page transitions
- **Lucide React 0.344.0** - Beautiful, customizable SVG icons

#### Mapping & Location
- **Leaflet 1.9.4** - Open-source interactive maps
- **React Leaflet 4.2.1** - React components for Leaflet integration
- **Geolocation API** - Browser-native location services

#### Navigation & State
- **React Router 7.8.0** - Client-side routing and navigation
- **Context API** - Global state management for auth and notifications
- **Custom Hooks** - Reusable logic for location, notifications, and routes

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AuthModal.tsx    # User authentication modal
│   ├── ErrorBoundary.tsx # Error handling wrapper
│   ├── Header.tsx       # Navigation header
│   ├── LocationAccessButton.tsx # Location permission UI
│   ├── MapView.tsx      # Interactive map component
│   ├── RouteCard.tsx    # Route display cards
│   └── SearchBox.tsx    # Route search functionality
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication state management
├── hooks/               # Custom React hooks
│   ├── useLocation.ts   # Location services and utilities
│   ├── useLocationBasedRoutes.ts # Location-aware route discovery
│   └── useNotifications.ts # Push notification management
├── pages/               # Main application pages
│   ├── HomePage.tsx     # Landing page with route discovery
│   ├── AdventureMapPage.tsx # Interactive map and route selection
│   ├── RoutePlannerPage.tsx # Route creation and editing
│   └── MyRoutesPage.tsx # User's saved routes
├── services/            # External API and service integrations
│   ├── LocationService.ts # Location-related API calls
│   ├── LocationBasedRouteService.ts # Route discovery services
│   └── NotificationService.ts # Push notification handling
├── types/               # TypeScript type definitions
│   └── index.ts         # Application-wide type definitions
├── utils/               # Utility functions and helpers
│   └── routeOptimizer.ts # Route optimization algorithms
└── App.tsx              # Main application component
```

## 🔧 Installation & Setup

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **npm** or **yarn** - Package manager
- **Modern Browser** - Chrome, Firefox, Safari, or Edge

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/micro-adventure.git
   cd micro-adventure
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 Usage Guide

### Getting Started
1. **Enable Location Services** - Allow browser access to your location for personalized route recommendations
2. **Explore Featured Routes** - Browse curated adventures in major Indian cities
3. **Search and Filter** - Find routes by location, difficulty, or interests
4. **Start Your Adventure** - Click "Start Adventure" to begin navigation

### Creating Custom Routes
1. Navigate to the **Route Planner** page
2. **Add Waypoints** - Click on the map to add stops to your route
3. **Customize Details** - Add descriptions, estimated times, and difficulty levels
4. **Optimize Route** - Use the built-in optimizer for the best path
5. **Save and Share** - Store your route and share with friends

### Navigation Features
- **Real-time Tracking** - See your current position on the map
- **Turn-by-Turn Directions** - Get guided navigation to each waypoint
- **Offline Maps** - Continue navigation without internet connection
- **Progress Tracking** - Monitor your adventure progress

## 🧩 Component Architecture

### Core Components

#### `MapView.tsx`
- **Purpose**: Interactive map display with route visualization
- **Features**: 
  - Leaflet integration with custom markers
  - Route polylines and waypoint display
  - User location tracking
  - Click handlers for route interaction
- **Props**: `route`, `locations`, `center`, `zoom`, `showUserLocation`

#### `RouteCard.tsx`
- **Purpose**: Display route information in card format
- **Features**:
  - Responsive design for mobile/desktop
  - Route statistics (distance, time, difficulty)
  - Action buttons (Start, Edit)
  - Loading states and error handling
- **Props**: `route`, `onSelect`, `onEdit`, `showActions`

#### `LocationAccessButton.tsx`
- **Purpose**: Handle location permission requests
- **Features**:
  - Browser geolocation API integration
  - Permission state management
  - Error handling for location failures
  - User-friendly permission prompts

### Custom Hooks

#### `useLocation.ts`
```typescript
interface LocationHook {
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  getCurrentLocation: () => Promise<GeolocationPosition>;
  watchPosition: () => number;
  clearWatch: (watchId: number) => void;
}
```

#### `useNotifications.ts`
```typescript
interface NotificationHook {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, options?: NotificationOptions) => void;
}
```

#### `useLocationBasedRoutes.ts`
```typescript
interface LocationBasedRoutesHook {
  routes: Route[];
  loading: boolean;
  error: string | null;
  getRoutesForLocation: (coords: Coordinates) => Promise<void>;
  clearRoutes: () => void;
}
```

## 🔄 State Management

### Context Providers

#### AuthContext
- **User Authentication** - Login, logout, and session management
- **User Preferences** - Settings and personalization options
- **Profile Management** - User data and avatar handling

#### Route State
- **Active Route** - Currently selected or navigating route
- **Route History** - Previously completed adventures
- **Favorites** - User's saved and bookmarked routes

### Local State Pattern
Components use React's `useState` and `useReducer` for:
- **Form inputs** - Search queries, filter options
- **UI states** - Loading, error, success states
- **Temporary data** - Draft routes, unsaved changes

## 🌐 API Integration

### Location Services
```typescript
// LocationService.ts
export class LocationService {
  static getCurrentPosition(): Promise<GeolocationPosition>
  static watchPosition(callback: PositionCallback): number
  static calculateDistance(point1: Coordinates, point2: Coordinates): number
  static reverseGeocode(coords: Coordinates): Promise<Address>
}
```

### Route Discovery
```typescript
// LocationBasedRouteService.ts
export class LocationBasedRouteService {
  static getRoutesNearLocation(coords: Coordinates, radius: number): Promise<Route[]>
  static searchRoutes(query: string, location?: Coordinates): Promise<Route[]>
  static getRouteRecommendations(preferences: UserPreferences): Promise<Route[]>
}
```

## 🎨 Styling & Theme

### Tailwind CSS Configuration
- **Custom Color Palette** - Brand colors for consistent theming
- **Responsive Breakpoints** - Mobile-first responsive design
- **Component Utilities** - Reusable component classes
- **Animation Classes** - Custom animations for smooth interactions

### Design System
- **Typography**: Inter font family with carefully chosen font sizes
- **Colors**: Blue and emerald accent colors with neutral grays
- **Spacing**: Consistent padding and margin scale
- **Shadows**: Subtle elevation system for depth

## 🔧 Performance Optimizations

### Code Splitting
- **Route-based splitting** - Each page loads independently
- **Component lazy loading** - Heavy components load on demand
- **Dynamic imports** - Reduce initial bundle size

### Caching Strategy
- **Service Worker** - Cache static assets and API responses
- **Local Storage** - Persist user preferences and route data
- **Memory caching** - Cache expensive calculations

### Bundle Optimization
- **Tree shaking** - Remove unused code from final bundle
- **Asset compression** - Optimize images and other assets
- **Modern JavaScript** - Use ES6+ features for smaller code

## 🧪 Testing Strategy

### Component Testing
```bash
# Run component tests
npm run test:components

# Test coverage report
npm run test:coverage
```

### Integration Testing
- **User workflows** - Complete user journey testing
- **API integration** - Mock external service responses
- **Cross-browser** - Ensure compatibility across browsers

### Performance Testing
- **Lighthouse scores** - Monitor web vitals and performance metrics
- **Load testing** - Test with multiple concurrent users
- **Memory profiling** - Detect and fix memory leaks

## 📱 Mobile Optimization

### Responsive Design
- **Mobile-first approach** - Start with mobile and scale up
- **Touch-friendly interfaces** - Appropriately sized touch targets
- **Gesture support** - Swipe, pinch, and tap interactions

### Progressive Web App
- **App manifest** - Install prompt and app-like experience
- **Service worker** - Offline functionality and caching
- **Push notifications** - Re-engagement through notifications

### Performance on Mobile
- **Optimized images** - Serve appropriate sizes for different devices
- **Lazy loading** - Load content as users scroll
- **Reduced JavaScript** - Minimize parsing time on slower devices

## 🔐 Security & Privacy

### Data Protection
- **Location privacy** - User location data handled securely
- **Local storage encryption** - Sensitive data encrypted at rest
- **HTTPS enforcement** - All communication over secure connections

### Error Handling
- **Error boundaries** - Graceful failure handling
- **Input validation** - Sanitize all user inputs
- **Rate limiting** - Prevent abuse of API endpoints

## 🚀 Deployment

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment Platforms
- **Vercel** - Recommended for React applications
- **Netlify** - Easy deployment with form handling
- **GitHub Pages** - Free hosting for static sites
- **AWS S3 + CloudFront** - Scalable cloud hosting

### Environment Variables
```bash
# .env.production
VITE_API_BASE_URL=https://api.microadventure.com
VITE_MAP_API_KEY=your_map_api_key
VITE_ANALYTICS_ID=your_analytics_id
```

## 🤝 Contributing

### Development Guidelines
1. **Fork the repository** and create a feature branch
2. **Follow TypeScript conventions** - Use proper types and interfaces
3. **Write meaningful commit messages** - Use conventional commit format
4. **Add tests** for new features and bug fixes
5. **Update documentation** - Keep README and code comments current

### Code Style
- **ESLint** - Follow the configured linting rules
- **Prettier** - Use consistent code formatting
- **TypeScript** - Leverage type system for better code quality

### Pull Request Process
1. Ensure all tests pass and code is properly formatted
2. Update documentation for any new features
3. Add screenshots for UI changes
4. Request review from maintainers

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Leaflet** - For the excellent mapping library
- **Tailwind CSS** - For the utility-first CSS framework
- **Indian Tourism** - For inspiration and route ideas
- **Open Source Community** - For the countless libraries and tools

## 📞 Support

### Documentation
- **API Documentation** - [docs.microadventure.com](https://docs.microadventure.com)
- **Component Storybook** - [storybook.microadventure.com](https://storybook.microadventure.com)
- **Tutorial Videos** - [YouTube Playlist](https://youtube.com/playlist)

### Community
- **GitHub Issues** - Report bugs and request features
- **Discord Server** - Join our development community
- **Twitter** - Follow [@MicroAdventure](https://twitter.com/microadventure) for updates

### Professional Support
For enterprise support, custom development, or consulting services, contact us at:
- **Email**: support@microadventure.com
- **Website**: [www.microadventure.com](https://www.microadventure.com)

---

**Made with ❤️ in India** | **Happy Adventuring! 🗺️**
