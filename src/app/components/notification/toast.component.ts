import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Notification, NotificationService } from '@/utils/services/notification.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="p-4 w-full max-w-lg">
      <button
        class="p-4 rounded-lg w-full bg-gradient-to-r font-semibold text-left shadow-xl flex items-center justify-between gap-3 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-50 hover:shadow-2xl"
        role="alert"
        [ngClass]="classStatus()"
        aria-live="assertive"
        aria-atomic="true"
        (click)="dispose()"
      >
        <div class="flex items-center gap-3">
          <div class="flex-grow">
            <span class="block text-sm opacity-90">{{ notification.message }}</span>
          </div>
        </div>
      </button>
    </div>
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
