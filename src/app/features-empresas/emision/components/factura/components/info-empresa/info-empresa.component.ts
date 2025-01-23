import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { of, finalize, mergeMap } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { ConfigFacturacionService } from '@/utils/services';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomSelectComponent, CustomInputComponent } from '@/components';
import { FormatIdPipe, FormatPhonePipe, CustomDatePipe } from '@/pipes';
import { DocumentosService, EmpresaService } from '@/services/service-empresas';
import { CreateFacturaEmpresaService } from '../../create-factura-empresa.service';

@Component({
  selector: 'app-info-empresa',
  imports: [
    FormsModule,
    FormatIdPipe,
    FormatPhonePipe,
    CustomSelectComponent,
    RouterLink,
    CustomDatePipe,
    CustomInputComponent,
    NgClass,
  ],
  templateUrl: './info-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoEmpresaComponent {
  public readonly isEditing = signal(false);

  public readonly isEditingEstabliecimient = signal(false);

  public readonly loading = signal(false);

  public readonly infoEmpresa = signal<GeneriResp<any> | null>(null);

  public readonly getListEstablishment = signal<any[]>([]);

  public readonly transformedEstabliecimient = computed<{ values: number[]; labels: string[] }>(() =>
    this.getListEstablishment().reduce(
      (acc: any, item: any) => {
        acc.values.push(item.code);
        acc.labels.push(item.code);
        return acc;
      },
      { values: [], labels: [] } as { values: number[]; labels: string[] },
    ),
  );

  constructor(
    public readonly configFactu: CreateFacturaEmpresaService,
    public readonly config: ConfigFacturacionService,
    public readonly emisorService: EmpresaService,
    public readonly facturacionService: DocumentosService,
  ) {
    this.retrieveEmisor();
  }

  retrieveEmisor() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.emisorService.retrieveEmisor()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.infoEmpresa.set(resp);
          this.configFactu.setEmisor.set(resp.data.idePersonaRol);
          this.configFactu.infoEmisor.set(resp.data);
          this.getListEstablishmentByEmisor(resp.data.idePersonaRol);
        }
      });
  }

  getListEstablishmentByEmisor(personaRolIde: number) {
    this.facturacionService.subsidiaries(personaRolIde).subscribe((resp) => {
      if (resp.status === 'OK') {
        this.getListEstablishment.set(resp.data);
      }
    });
  }

  preventLetters(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);

    // Solo permite números
    if (!/[0-9]/.test(inputChar)) {
      event.preventDefault();
    }

    // Limitar a 3 dígitos
    if (this.configFactu.pointCode?.length >= 3) {
      event.preventDefault();
    }
  }

  validatePointCode() {
    // Si el campo está vacío, asignar "001" como valor inicial
    if (!this.configFactu.pointCode()) {
      this.configFactu.pointCode.set('001');
    }

    // Si el valor es "000", asignar "001"
    if (this.configFactu.pointCode() === '000' || this.configFactu.pointCode() === '0') {
      this.configFactu.pointCode.set('001');
    }

    // Eliminar ceros iniciales y asegurarse de que el número sea válido
    const numericValue = this.configFactu.pointCode().replace(/^0+/, '');

    // Si el valor ingresado es numérico, incrementamos el valor
    if (numericValue) {
      // Asegurarse de que siempre tenga 3 dígitos, rellenando con ceros si es necesario
      this.configFactu.pointCode.set(numericValue.padStart(3, '0'));
    }
  }
  toggleEdit(type: 'pointOfSale' | 'establishment') {
    if (type === 'pointOfSale') {
      this.isEditing.set(!this.isEditing());
    } else if (type === 'establishment') {
      this.isEditingEstabliecimient.set(!this.isEditingEstabliecimient());
    }
  }

  // Función para guardar cambios
  saveChanges(type: 'pointOfSale' | 'establishment') {
    if (type === 'pointOfSale') {
      this.isEditing.set(false);
      // Lógica para guardar el punto de venta
    } else if (type === 'establishment') {
      this.isEditingEstabliecimient.set(false);
      // Lógica para guardar el establecimiento
    }
  }
}
