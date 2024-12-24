import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { CreatePerfilComponent } from '../create-perfil';
import { PerfilesService } from '@/services';
import { finalize, mergeMap, of } from 'rxjs';
import { TextInitialsPipe } from '../../pipes';
import { DeletePerfilComponent } from './components';
import { GeneriResp, PersonData } from '@/interfaces';

@Component({
  selector: 'app-perfiles',
  imports: [NgOptimizedImage, ModalComponent, CreatePerfilComponent, TextInitialsPipe, NgClass, DeletePerfilComponent],
  templateUrl: './perfiles.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilesComponent {
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
