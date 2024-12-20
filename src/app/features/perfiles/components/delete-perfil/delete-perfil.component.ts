import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PerfilesService } from '@/services';
import { finalize, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-delete-perfil',
  imports: [],
  templateUrl: './delete-perfil.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletePerfilComponent {
  @Input({ required: true }) public idePersonaRol!: number;

  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<null>();

  constructor(private readonly perfilService: PerfilesService) {}

  deletePerfil() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.perfilService.deletePerfil(this.idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => this.deleted.emit(resp.data));
  }
}
