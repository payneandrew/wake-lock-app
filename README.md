# Wake Lock Demo App

A demonstration of the **Screen Wake Lock API** built with **Ember.js**. This app prevents your device screen from turning off or dimming while the page is active, perfect for presentations, reading, or any long-running web applications.

## 🔒 What is Screen Wake Lock?

The Screen Wake Lock API is a modern web standard that allows web applications to prevent the device screen from turning off, dimming, or showing a screensaver. This is particularly useful for:

- **Presentations** - Keep slides visible without manual interaction
- **Reading Apps** - Prevent screen timeout while reading long articles
- **Media Players** - Keep controls visible during video playback
- **Dashboard Apps** - Maintain visibility of real-time data
- **Cooking Apps** - Keep recipes visible while cooking

## ✨ Features

- 🎛️ **Simple Toggle Interface** - Clear toggle switch showing current state
- 📊 **Real-time Status Display** - Visual indicator of wake lock status
- 📝 **Event Logging** - Live feed of wake lock events and state changes
- 🔄 **Smart Page Visibility Handling** - Automatically manages wake lock when switching tabs
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Modern UI** - Clean, professional interface with smooth animations

## 🌐 Browser Support

The Screen Wake Lock API has growing browser support:

| Browser        | Version | Status           |
| -------------- | ------- | ---------------- |
| Chrome         | 84+     | ✅ Full Support  |
| Edge           | 84+     | ✅ Full Support  |
| Firefox        | 126+    | ✅ Full Support  |
| Safari         | -       | ❌ Not Supported |
| iOS Safari     | -       | ❌ Not Supported |
| Android Chrome | 84+     | ✅ Full Support  |

> **Note**: The app gracefully handles unsupported browsers and will show appropriate messaging.

## 🚀 Getting Started

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

## 🎯 How It Works

### The Toggle Interface

The app features an intuitive toggle switch that clearly indicates:

- **Current State**: Whether wake lock is currently enabled by the user
- **Active Status**: Whether the wake lock is actually preventing screen sleep
- **Action Intent**: Clear labeling of "Turn ON/OFF Wake Lock"

### Smart Behavior

1. **User Control**: Toggle reflects user preference
2. **Page Visibility**: Automatically releases wake lock when page is hidden (tab switching)
3. **Auto Recovery**: Re-acquires wake lock when returning to the page (if enabled)
4. **Error Handling**: Gracefully handles API failures and browser limitations

### Event Tracking

The app logs all wake lock events in real-time:

- ✅ **Success Events**: Wake lock activation
- ℹ️ **Info Events**: Page visibility changes, user actions
- ❌ **Error Events**: API failures, unsupported browsers

## 🏗️ Architecture

### WakeLockService

The core service (`app/services/wake-lock.ts`) provides:

```typescript
class WakeLockService extends Service {
  enabled: boolean; // User preference
  isActive: boolean; // Current wake lock state
  events: WakeLockEvent[]; // Event history

  async toggle(): Promise<void>; // Toggle wake lock on/off
}
```

### Key Methods

- **`toggle()`** - Toggles user preference and wake lock state
- **`isActive`** - Computed property showing current wake lock status
- **`enabled`** - User's preference for wake lock behavior

### Component Integration

The `WakeLockToggle` component (`app/components/wake-lock-toggle.*`) provides the UI interface with:

- Toggle switch bound to service state
- Real-time status updates
- Event log display
- Responsive design

## 🔧 Technical Details

### Wake Lock Lifecycle

1. **Request**: `navigator.wakeLock.request('screen')`
2. **Monitor**: Listen for automatic release events
3. **Manual Release**: Call `sentinel.release()` when needed
4. **Cleanup**: Handle page visibility changes

### Error Handling

The app handles various error scenarios:

- **API Unavailable**: Graceful degradation for unsupported browsers
- **Permission Denied**: User feedback for permission issues
- **Network Issues**: Retry logic for temporary failures

### Performance

- **Lightweight**: Minimal bundle size impact
- **Event Driven**: Reactive updates using Ember's tracking system
- **Memory Efficient**: Automatic cleanup on component destruction

## 🎨 Customization

### Styling

The app uses modern CSS with:

- **CSS Custom Properties** for theming
- **Flexbox Layout** for responsive design
- **Smooth Animations** for state transitions

### Color Scheme

- **Success**: Green tones for active wake lock
- **Info**: Blue tones for informational events
- **Error**: Red tones for failures
- **Neutral**: Gray tones for inactive states

## 🔗 Resources

- [Screen Wake Lock API Specification](https://w3c.github.io/screen-wake-lock/)
- [MDN Wake Lock API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- [Ember.js Documentation](https://emberjs.com/)
- [Ember CLI Documentation](https://cli.emberjs.com/release/)
- [Can I Use - Wake Lock API](https://caniuse.com/wake-lock)

## ⚠️ Important Notes

- **HTTPS Required**: Wake Lock API only works over HTTPS in production
- **User Gesture**: Some browsers require user interaction before allowing wake lock
- **Battery Impact**: Wake lock prevents screen sleep, which may impact battery life
- **Automatic Release**: Wake locks are automatically released when the page becomes hidden

## 📱 Browser Extensions

Development Browser Extensions for Ember:

- [Ember Inspector for Chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
- [Ember Inspector for Firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

---
