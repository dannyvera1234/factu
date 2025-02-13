import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '@/utils/services';
import { FormErrorMessageComponent } from '@/components';
import { ClientesService } from '@/services/service-empresas';
import { finalize, mergeMap, of } from 'rxjs';
import { montoTotalValidator } from '@/utils/validators';

@Component({
  selector: 'app-update-pago',
  imports: [ReactiveFormsModule, CurrencyPipe, FormErrorMessageComponent],
  templateUrl: './update-pago.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePagoComponent {
  @Input({ required: true }) set total(value: number) {
    this._total = value;
    this.form.controls.paymentList.setValidators(montoTotalValidator(value));
  }

  @Input({ required: true }) letterPayIde!: number;

  public readonly loading = signal(false);

  @Output() public readonly created = new EventEmitter<any | null>();

  public _total!: number;

  paymentMethods = [
    { paymentMethodId: '01', descripaymentMethodDescriptionption: 'Efectivo' },
    { paymentMethodId: '20', descripaymentMethodDescriptionption: 'Transferencia' },
  ];

  constructor(
    private _fb: FormBuilder,
    private readonly notificacion: NotificationService,
    private readonly clienteService: ClientesService,
  ) {}

  form = this._fb.group({
    paymentList: this._fb.array(
      [
        this._fb.group({
          paymentMethodId: ['01', Validators.required], // Código de método de pago
          paidAmount: [0, [Validators.required]], // Monto del pago
        }),
      ],
      [montoTotalValidator(this._total)], // Suponiendo que montoTotalValidator es el validador para la suma total
    ),
    observaciones: [''],
    documentos: new FormControl<File | null>(null),
  });

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.controls.documentos.setValue(file);
    }
  }

  agregarPago() {
    this.form.controls.paymentList.push(
      this._fb.group({
        paymentMethodId: ['01', Validators.required],
        paidAmount: [0, Validators.required],
      }),
    );
  }

  public onDecimalInput(event: any, formControlName: string): void {
    const inputValue = event.target.value;

    // Permite números enteros o con hasta 2 decimales
    const formattedValue = inputValue
      .replace(/[^0-9.]/g, '') // Solo números y punto decimal
      .replace(/(\..*?)\..*/g, '$1') // Solo un punto decimal
      .replace(/^(\d+\.\d{2})\d*/, '$1'); // Máximo 2 decimales

    event.target.value = formattedValue;

    const control = this.form.get(formControlName);
    if (control) {
      control.setValue(formattedValue);
    }
  }

  removeFile(): void {
    this.form.controls.documentos.setValue(null);
  }

  eliminarPago(index: number) {
    this.form.controls.paymentList.removeAt(index);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dataCredito = {
      letterPayIde: this.letterPayIde,
      observations: this.form.value.observaciones,
      paymentList: this.form.value.paymentList?.map((pago) => {
        const method = this.paymentMethods.find((method) => method.paymentMethodId === pago.paymentMethodId);
        return {
          paymentMethodId: pago.paymentMethodId, // Código del método de pago
          paidAmount: pago.paidAmount, // Monto
          paymentMethodDescription: method?.descripaymentMethodDescriptionption,
        };
      }),
    };

    const file = this.form.value.documentos as File;

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.payLetter(dataCredito, file)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.notificacion.push({ message: 'Pago registrado correctamente', type: 'success' });
          this.created.emit({
            letterPayIde: Number(resp.data),
            paymentStatus: 'PAGADO',
          });
        }
      });
  }
}
