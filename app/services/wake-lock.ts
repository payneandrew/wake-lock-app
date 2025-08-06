import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class WakeLockService extends Service {
  // track the current sentinel or null
  @tracked private sentinel: WakeLockSentinel | null = null;

  /**
   * Check if wake lock is currently active
   */
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
    // fire-and-forget release
    void this.releaseWakeLock();
  }

  /**
   * Acquire a screen wake lock if supported and not already held.
   */
  @action
  public async requestWakeLock(): Promise<void> {
    if (!('wakeLock' in navigator) || this.sentinel) {
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

  /**
   * Release the current wake lock, if any.
   */
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

  /**
   * Re-acquire on show, release on hide.
   */
  private _onVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      void this.requestWakeLock();
    } else {
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