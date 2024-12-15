import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-handler',
  imports: [FormsModule],
  templateUrl: './file-handler.component.html',
})
export class FileHandlerComponent {
  public docType = '';

  showFile = signal(false);

  @Input() types: { options: string[]; labels: string[] } = { options: [], labels: [] };

  @Input() public source?: string | File;

  @Input() public withType: boolean = false;

  @Input({ required: true }) public name!: string;

  @Input({ required: true }) public type!: string;

  @Input({ required: true }) public sizeInKb!: number;

  @Input() public isUploading = false;

  @Input() public progressUpload = 0;

  @Output() public removeFile = new EventEmitter<void>();

  kbFormatter = Intl.NumberFormat('en', {
    notation: 'compact',
    style: 'unit',
    unit: 'byte',
    unitDisplay: 'narrow',
  });

  public openVysor(): void {
    // Known bug: If when instantiating the PDF viewer there is no height or width, it will not be displayed later
    this.showFile.set(true);
  }

  setType(type: string) {
    if (this.source instanceof File && this.withType) {
      Object.assign(this.source, { docType: type });
    }
  }
}
