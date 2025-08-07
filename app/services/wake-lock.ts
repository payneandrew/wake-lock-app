import { action } from '@ember/object';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

type MessageType = 'info' | 'error' | 'success';

interface WakeLockEvent {
  id: string;
  message: string;
  timestamp: Date;
  type: MessageType;
}

export default class WakeLockService extends Service {
  @tracked private sentinel: WakeLockSentinel | null = null;
  @tracked public events: WakeLockEvent[] = [];
  @tracked public isToggleEnabled: boolean = false;

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
      this.addEvent('Wake lock activated', 'success');
      sentinel.onrelease = () => {
        this.sentinel = null;
        this.addEvent('Wake lock released', 'error');
      };
    } catch (err) {
      this.addEvent(`WakeLock request failed: ${String(err)}`, 'error');
    }
  }

  // Release the current wake lock, if any.
  @action
  public async releaseWakeLock(): Promise<void> {
    // If no wake lock is held, do nothing.
    if (!this.sentinel) return;
    try {
      await this.sentinel.release();
    } catch (err) {
      this.addEvent(`WakeLock release failed: ${String(err)}`, 'error');
    } finally {
      this.sentinel = null;
    }
  }

  @action
  public async toggle(): Promise<void> {
    this.isToggleEnabled = !this.isToggleEnabled;
    await (this.isToggleEnabled
      ? this.requestWakeLock()
      : this.releaseWakeLock());
  }

  private _onVisibilityChange = (): void => {
    if (document.visibilityState === 'visible' && this.isToggleEnabled) {
      this.addEvent('Page visible, reactivating wake lock', 'info');
      void this.requestWakeLock();
    } else {
      void this.releaseWakeLock();
    }
  };

  private addEvent(message: string, type: MessageType): void {
    const event: WakeLockEvent = {
      id: crypto.randomUUID(),
      message,
      timestamp: new Date(),
      type,
    };
    // Keep the last 10 events
    this.events = [event, ...this.events.slice(0, 9)];
  }
}
