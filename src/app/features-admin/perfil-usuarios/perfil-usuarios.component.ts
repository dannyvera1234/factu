import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { GeneriResp, PersonData } from '@/interfaces';
import { PerfilesService } from '@/services';
import { NgOptimizedImage, NgClass } from '@angular/common';
import { ModalComponent } from '@/components';
import { CreatePerfilComponent } from '@/features/create-perfil';
import { TextInitialsPipe } from '@/pipes';
import { DeletePerfilComponent } from './components';

@Component({
  selector: 'app-perfil-usuarios',
  imports: [NgOptimizedImage, ModalComponent, CreatePerfilComponent, TextInitialsPipe, NgClass, DeletePerfilComponent],
  templateUrl: './perfil-usuarios.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilUsuariosComponent {
  public readonly loading = signal(false);

  public readonly perfiles = signal<GeneriResp<PersonData[]> | null>(null);

  public readonly viewing = signal<number | null>(null);

  constructor(private readonly perfilService: PerfilesService) {
    this.getListPerfiles();
  }

  getListPerfiles() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.perfilService.getListPefiles()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => this.perfiles.set(resp));
  }

  updatePerfil(data: PersonData) {
    const perfilesData = this.perfiles();
    if (perfilesData && perfilesData.data) {
      const updatedData = [...perfilesData.data, data];

      this.perfiles.set({
        ...perfilesData,
        data: updatedData,
      });
    }

    this.getListPerfiles();
  }

  deleteRol(idePersona: string) {
    const idePerosonaRol = Number(idePersona);
    this.perfiles()!.data = this.perfiles()!.data.filter((item) => item.idePersonaRol !== idePerosonaRol);
  }
}
