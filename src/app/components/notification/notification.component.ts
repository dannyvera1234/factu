import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastComponent } from './toast.component';
import { NotificationService } from '../../utils/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  imports: [ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  constructor(public readonly notificationService: NotificationService) {}
}
