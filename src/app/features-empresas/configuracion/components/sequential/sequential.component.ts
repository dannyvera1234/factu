import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { AccountingControlSystemService, NotificationService } from '@/utils/services';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '@/services/service-empresas';

@Component({
  selector: 'app-sequential',
  imports: [FormsModule],
  templateUrl: './sequential.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SequentialComponent {
  @Input({ required: true }) enviroment!: string;

  public readonly docsType = signal<any[] | null>(null);

  public readonly loading = signal(false);

  public readonly loadingModal = signal(false);

  @Output() public readonly created = new EventEmitter<any | null>();

  constructor(
    private readonly configFactu: AccountingControlSystemService,
    private readonly emisorService: EmpresaService,
    private readonly notification: NotificationService,
  ) {
    this.getDocsType();
  }

  getDocsType() {
    of(this.loadingModal.set(true))
      .pipe(
        mergeMap(() => this.configFactu.getdocsType()),
        finalize(() => this.loadingModal.set(false)),
      )
      .subscribe((res) => {

        if (res.status === 'OK') {
          this.docsType.set(res.data);
          this.getListSequential();
        }
      });
  }

  getListSequential() {
    of(this.loadingModal.set(true))
      .pipe(
        mergeMap(() => this.emisorService.listSequential(this.enviroment)),
        finalize(() => this.loadingModal.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          const docs = this.docsType();
          if (docs && res.data) {
            const updatedDocs = docs.map((doc) => {
              const matchedDoc = res.data.find((item: any) => item.codDocumentType === String(doc.code));
              if (matchedDoc) {
                return {
                  ...doc,
                  selected: true,
                  value: matchedDoc.sequential || 0,
                };
              }
              return doc;
            });

            this.docsType.set(updatedDocs);
          }
        }
      });
  }

  addSequential() {
    const selectedDocs = this.docsType()?.filter((doc) => doc.selected);

    const invalidDocs = selectedDocs?.filter((doc) => {
      const value = doc.value ? doc.value.toString() : '';
      return !value || value.trim() === '';
    });

    if (invalidDocs && invalidDocs.length > 0) {
      this.notification.push({
        message: 'Por favor, complete todos los campos de los documentos seleccionados.',
        type: 'warning',
      });
      return;
    }

    const docsSequential = selectedDocs?.map((doc) => ({
      codDoc: doc.code,
      value: doc.value,
    }));

    if (!docsSequential || docsSequential.length === 0) {
      this.notification.push({
        message: 'Por favor, seleccione al menos un documento para agregar el secuencial.',
        type: 'warning',
      });
      return;
    }

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.emisorService.addSequential(docsSequential, this.enviroment)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.notification.push({
            message: 'Secuencial agregado correctamente.',
            type: 'success',
          });
          this.created.emit(res.data);
        }
      });
  }
}
