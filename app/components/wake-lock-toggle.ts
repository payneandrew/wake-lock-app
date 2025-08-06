import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type WakeLockService from '../services/wake-lock';

export default class WakeLockToggleComponent extends Component {
  @service('wake-lock') declare wakeLockService: WakeLockService;

  get isActive(): boolean {
    return this.wakeLockService.isActive;
  }

  get isEnabled(): boolean {
    return this.wakeLockService.enabled;
  }

  @action
  async toggleWakeLock(): Promise<void> {
    await this.wakeLockService.toggle();
  }
}