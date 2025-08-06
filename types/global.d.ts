import '@glint/environment-ember-loose';

// Wake Lock API types
interface WakeLockSentinel extends EventTarget {
  released: boolean;
  release(): Promise<void>;
  onrelease: (() => void) | null;
}

interface Navigator {
  wakeLock?: {
    request(type: 'screen'): Promise<WakeLockSentinel>;
  };
}
