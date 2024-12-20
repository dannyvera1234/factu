import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { CreatePerfilComponent } from '../create-perfil';
import { PerfilesService } from '@/services';
import { finalize, mergeMap, of } from 'rxjs';
import { TextInitialsPipe } from '../../pipes';
import { DeletePerfilComponent } from './components';
import { ListProfile } from '../../interfaces';

@Component({
  selector: 'app-perfiles',
  imports: [NgOptimizedImage, ModalComponent, CreatePerfilComponent, TextInitialsPipe, NgClass, DeletePerfilComponent],
  templateUrl: './perfiles.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilesComponent {
  public readonly loading = signal(false);

  public readonly perfiles = signal<ListProfile | null>(null);

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
      .subscribe((data) => this.perfiles.set(data));
  }

  deleteRol(event: any) {
    // this.perfiles.update(
    //   this.perfiles().filter((item: any) => {
    //     return item.ide !== event.ide;
    //   }),
    // );
  }
}
