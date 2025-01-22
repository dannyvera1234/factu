import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '../../components';
import { FormatIdPipe, FormatPhonePipe, TextInitialsPipe } from '../../pipes';
import { GeneriResp } from '../../interfaces';

@Component({
  selector: 'app-clientes',
  imports: [ModalComponent, FormatPhonePipe, FormatIdPipe, TextInitialsPipe],
  templateUrl: './clientes.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientesComponent {
public readonly listClientes = signal<GeneriResp<any[]> | null>(null);

public readonly loading = signal(false);
}
