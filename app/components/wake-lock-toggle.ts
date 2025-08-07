import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type WakeLockService from '../services/wake-lock';

export default class WakeLockToggleComponent extends Component {
  @service('wake-lock') declare wakeLockService: WakeLockService;

  get isActive(): boolean {
    return this.wakeLockService.isActive;
  }

  get isToggleEnabled(): boolean {
    return this.wakeLockService.isToggleEnabled;
  }

  @action
  async toggleWakeLock(): Promise<void> {
    await this.wakeLockService.toggle();
  }
}
