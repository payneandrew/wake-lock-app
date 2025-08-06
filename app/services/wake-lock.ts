import { action } from '@ember/object';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class WakeLockService extends Service {
  @tracked private sentinel: WakeLockSentinel | null = null;

  // Check if wake lock is currently active
  get isActive(): boolean {
    return this.sentinel !== null && !this.sentinel.released;
  }

  constructor() {
    super();
    document.addEventListener('visibilitychange', this._onVisibilityChange);
  }

  willDestroy(): void {
    super.willDestroy();
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
    void this.releaseWakeLock();
  }

  // Acquire a screen wake lock if supported and not already held.
  @action
  public async requestWakeLock(): Promise<void> {
    if (!('wakeLock' in navigator) || this.sentinel !== null) {
      return;
    }
    try {
      const sentinel = await navigator.wakeLock.request('screen');
      this.sentinel = sentinel;
      console.log('Wake lock activated - screen will stay awake');
      sentinel.onrelease = () => {
        this.sentinel = null;
        console.log('Wake lock released - screen may turn off');
      };
    } catch (err) {
      console.error('WakeLock request failed:', err);
    }
  }

  // Release the current wake lock, if any.
  @action
  public async releaseWakeLock(): Promise<void> {
    if (!this.sentinel) {
      return;
    }
    try {
      await this.sentinel.release();
      console.log('Wake lock manually released');
    } catch (err) {
      console.error('WakeLock release failed:', err);
    } finally {
      this.sentinel = null;
    }
  }

  private _onVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      // page is back in front, try to re-lock
      console.log('Page is visible, attempting to acquire wake lock');
      void this.requestWakeLock();
    } else {
      // page hidden → UA likely already released it, but cleanup anyway
      console.log('Page is hidden, releasing wake lock');
      void this.releaseWakeLock();
    }
  };
}

// allow `@service wake-lock` to be correctly typed
declare module '@ember/service' {
  interface Registry {
    'wake-lock': WakeLockService;
  }
}
