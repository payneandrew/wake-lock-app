import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type WakeLockService from '../services/wake-lock';

export default class WakeLockToggleComponent extends Component {
  @service('wake-lock') declare wakeLockService: WakeLockService;

  get isActive(): boolean {
    return this.wakeLockService.isActive;
  }

  @action
  async toggleWakeLock(): Promise<void> {
    if (this.isActive) {
      await this.wakeLockService.releaseWakeLock();
    } else {
      await this.wakeLockService.requestWakeLock();
    }
  }
}