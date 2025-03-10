import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CLIENTE_INITIAL_STATE } from '../../store';

@Component({
  selector: 'app-delete-cliente-empresa',
  imports: [],
  templateUrl: './delete-cliente-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteClienteEmpresaComponent {
  clienteStore = inject(CLIENTE_INITIAL_STATE);

  constructor() {}

  deleteClient() {
    this.clienteStore.deleteCustomer();
  }
}
