import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Notification, NotificationService } from '@/utils/services/notification.service';

@Component({
  selector: 'app-toast',
  template: `
    <button
      class="p-2 rounded max-w-lg text-start w-full break-all"
      [ngClass]="classStatus()"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      (click)="dispose()"
    >
      {{ notification.message }}
    </button>
  `,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnChanges {
  @Input({ required: true }) notification!: Notification & { id: string };

  private timmer!: ReturnType<typeof setTimeout>;

  constructor(public readonly notificationService: NotificationService) {}

  public classStatus(): string {
    switch (this.notification.type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  }

  dispose() {
    clearTimeout(this.timmer);
    this.notificationService.remove(this.notification.id);
  }

  ngOnChanges(): void {
    clearTimeout(this.timmer);
    this.timmer = setTimeout(() => {
      this.notificationService.remove(this.notification.id);
    }, this.notification.delay);
  }
}
