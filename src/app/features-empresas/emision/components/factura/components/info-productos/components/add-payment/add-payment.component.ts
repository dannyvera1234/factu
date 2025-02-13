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
    this.form.patchValue({ valor: value });
  }
  public readonly paymentMethods = signal<GeneriResp<any[]> | null>(null);

  public readonly loading = signal(false);

  @Output() public readonly addPay = new EventEmitter<any | null>();

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
    valor: ['', [Validators.required]],
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
    if (this.form.invalid) {
      this.notification.push({
        message: 'Por favor, llene todos los campos',
        type: 'error',
      });
      this.form.markAllAsTouched();
      return;
    }

    this.addPay.emit(this.form.value);

    this.form.reset({
      valor: this.total,
      metodoPago: '',
      plazo: '0',
      tiempo: 'dias',
    });
  }
}
