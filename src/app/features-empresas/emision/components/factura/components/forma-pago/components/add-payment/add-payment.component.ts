import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { GeneriResp } from '@/interfaces';
import { AccountingControlSystemService, NotificationService } from '@/utils/services';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-payment',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-payment.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPaymentComponent {
  @Input({ required: true }) set total(value: any) {
    this.valorTotal.set(value);
    this.form.patchValue({ valor: value });
  }
  @Output() public readonly addPay = new EventEmitter<any | null>();


  public readonly paymentMethods = signal<GeneriResp<any[]> | null>(null);
  private readonly valorTotal = signal<string>('');
  public readonly loading = signal(false);



  constructor(
    private readonly controlService: AccountingControlSystemService,
    private readonly notification: NotificationService,
    private readonly _fb: FormBuilder,
  ) {
    this.getPayForms();
  }

  private getPayForms() {
    this.controlService.getTypesPayForm().subscribe((resp) => {
      if (resp.status === 'OK') {
        this.paymentMethods.set(resp);
      }
    });
  }

  form = this._fb.group({
    metodoPago: ['', [Validators.required]],
    plazo: ['0', [Validators.required]],
    valor: ['0', [Validators.required]],
    tiempo: ['dias', [Validators.required]],
  });

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

  submit() {
    if (this.form.controls.metodoPago.value === '') {
      this.notification.push({
        message: 'Por favor, seleccione un método de pago',
        type: 'error',
      });
      this.form.markAllAsTouched();
      return;
    }

    const code = this.paymentMethods()!.data.find((x) => x.code === '00');
    if (this.form.controls.metodoPago.value === code && this.form.controls.plazo.value === '0') {
      this.notification.push({
        message: 'Por favor, seleccione un plazo de pago',
        type: 'error',
      });
      return;
    }

    if ( this.form.controls.valor.value === '0') {
      this.notification.push({
        message: 'El valor a pagar no puede ser 0',
        type: 'error',
      });
      return;
    }

    this.addPay.emit(this.form.value);

    this.form.reset({
      valor: '0',
      metodoPago: '',
      plazo: '0',
      tiempo: 'dias',
    });
  }
}
