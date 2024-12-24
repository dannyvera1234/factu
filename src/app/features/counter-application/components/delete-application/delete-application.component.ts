import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-delete-application',
  imports: [],
  templateUrl: './delete-application.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteApplicationComponent {
  @Input({ required: true }) public idePersonaRol!: number;
  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<null>();

  deleteApplication() {
  }

}
