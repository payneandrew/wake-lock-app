import { action } from '@ember/object';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface WakeLockEvent {
  id: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'error' | 'success';
}

export default class WakeLockService extends Service {
  @tracked private sentinel: WakeLockSentinel | null = null;
  @tracked public events: WakeLockEvent[] = [];
  @tracked public userWantsWakeLock: boolean = false;

  // Check if wake lock is currently active
  get isActive(): boolean {
    return this.sentinel !== null && !this.sentinel.released;
  }

  private addEvent(message: string, type: 'info' | 'error' | 'success'): void {
    const event: WakeLockEvent = {
      id: Math.random().toString(36).substring(2, 15),
      message,
      timestamp: new Date(),
      type,
    };
    this.events = [event, ...this.events.slice(0, 9)];
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
      this.addEvent('Wake lock activated - screen will stay awake', 'success');
      sentinel.onrelease = () => {
        this.sentinel = null;
        this.addEvent('Wake lock released', 'error');
      };
    } catch (err) {
      this.addEvent(`WakeLock request failed: ${err}`, 'error');
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
      this.addEvent('Wake lock manually released', 'error');
    } catch (err) {
      this.addEvent(`WakeLock release failed: ${String(err)}`, 'error');
    } finally {
      this.sentinel = null;
    }
  }

  // Toggle wake lock based on user preference
  @action
  public async toggleWakeLockPreference(): Promise<void> {
    this.userWantsWakeLock = !this.userWantsWakeLock;

    if (this.userWantsWakeLock) {
      this.addEvent('User enabled wake lock', 'info');
      await this.requestWakeLock();
    } else {
      this.addEvent('User disabled wake lock', 'info');
      await this.releaseWakeLock();
    }
  }

  private _onVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      // page is back in front, only try to re-lock if user wants it
      if (this.userWantsWakeLock) {
        this.addEvent(
          'Page is visible, attempting to acquire wake lock',
          'info',
        );
        void this.requestWakeLock();
      }
    } else {
      // page hidden → UA likely already released it, but cleanup anyway
      //   this.addEvent('Page is hidden, releasing wake lock', 'info');
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
