# Wake Lock Demo App

A demonstration of the **Screen Wake Lock API** built with **Ember.js**. This app prevents your device screen from turning off or dimming while the page is active, perfect for presentations, reading, or any long-running web applications.

## What is Screen Wake Lock?

The Screen Wake Lock API is a modern web standard that allows web applications to prevent the device screen from turning off, dimming, or showing a screensaver. This is particularly useful for:

- **Presentations** - Keep slides visible without manual interaction
- **Reading Apps** - Prevent screen timeout while reading long articles
- **Media Players** - Keep controls visible during video playback
- **Dashboard Apps** - Maintain visibility of real-time data
- **Cooking Apps** - Keep recipes visible while cooking

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- Modern browser with Wake Lock API support

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd wake-lock-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run start
   ```

4. **Open your browser**
   Navigate to [http://localhost:4200](http://localhost:4200)

### Building for Production

```bash
npm run build
```

The built application will be available in the `dist/` directory.

## How It Works

### The Toggle Interface

The app features an intuitive toggle switch that clearly indicates:

- **Current State**: Whether wake lock is currently enabled by the user
- **Active Status**: Whether the wake lock is actually preventing screen sleep
- **Action Intent**: Clear labeling of "Turn ON/OFF Wake Lock"

### Behavior

1. **User Control**: Toggle reflects user preference
2. **Page Visibility**: Automatically releases wake lock when page is hidden (tab switching)
3. **Auto Recovery**: Re-acquires wake lock when returning to the page (if enabled)
4. **Error Handling**: Gracefully handles API failures and browser limitations

## Resources

- [Screen Wake Lock API Specification](https://w3c.github.io/screen-wake-lock/)
- [MDN Wake Lock API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- [Can I Use - Wake Lock API](https://caniuse.com/wake-lock)

## Important Notes

- **HTTPS Required**: Wake Lock API only works over HTTPS in production
- **User Gesture**: Some browsers require user interaction before allowing wake lock
- **Battery Impact**: Wake lock prevents screen sleep, which may impact battery life
- **Automatic Release**: Wake locks are automatically released when the page becomes hidden
