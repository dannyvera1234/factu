import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-filters-proforma',
  imports: [NgClass, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './filters-proforma.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersProformaComponent {
  public readonly open = signal(false);

  @HostListener('document:click', ['$event.target'])
  onClick(btn: any) {
    if (this.open() && !this.ref.nativeElement.contains(btn)) {
      this.open.set(false);
    }
  }


    @Output() public readonly buscarResult = new EventEmitter<string | null>();

  selectedClasificacion: string | null = null;
  tablaMostrar: string = '';

  constructor(private readonly ref: ElementRef, private readonly _fb: FormBuilder) {}

  form  = this._fb.group({
    clasificacion: ['', [Validators.required]],
  });

  buscar() {
    if (this.form.valid) {
      const clasificacion = this.form.get('clasificacion')?.value;
      // this.selectedClasificacion = clasificacion;

      // Mostrar la tabla correspondiente según la clasificación seleccionada
      if (clasificacion === 'proformaRegistrada') {
        this.tablaMostrar = 'tablaProformaRegistrada'; // Cambia a tu lógica de tabla
        console.log(this.tablaMostrar, clasificacion);
      } else if (clasificacion === 'proformaEnProceso') {
        this.tablaMostrar = 'tablaProformaEnProceso'; // Cambia a tu lógica de tabla
        console.log(this.tablaMostrar, clasificacion);
      }
      this.buscarResult.emit(this.tablaMostrar);
      this.open.set(!this.open());
    } else {
      // Mostrar mensaje de error si no se selecciona ninguna opción
      console.error('Debe seleccionar una clasificación.');
    }
  }

  // Método para abrir o cerrar el filtro

}
