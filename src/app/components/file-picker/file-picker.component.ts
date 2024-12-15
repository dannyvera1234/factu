import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AccountingControlSystemService, InputErrorLocatorService } from '../../utils/services';
import { ObjectId } from '../../utils/built-in/generate-id';
import { FileHandlerComponent } from '../file-handler';

@Component({
  selector: 'app-file-picker',
  imports: [NgOptimizedImage, FormsModule, NgClass, FileHandlerComponent],
  templateUrl: './file-picker.component.html',
})
export class FilePickerComponent {
  public readonly seed = ObjectId();

  @ViewChild('filePicker') public filePicker!: ElementRef<HTMLInputElement>;

  @Input() public validExtensions: string[] = ['.p12'];

  @Input() public maxFiles: number = 4;

  @Input() public maxSizeInBytes: number = 1e7;

  @Input() public withType: boolean = false;

  @Input() public manualHandled: boolean = false;

  @Input() public hideDescription: boolean = false;


  public selectedType = '';

  @Output() public selectFiles = new EventEmitter<
    (File & {
      docType?: string;
    })[]
  >();

  public readonly errors = signal<any[]>([]);

  kbFormatter = Intl.NumberFormat('en', {
    notation: 'compact',
    style: 'unit',
    unit: 'byte',
    unitDisplay: 'narrow',
  });

  @Input() files: (File & { docType?: string })[] = [];

  constructor(
    public readonly errorLocator: InputErrorLocatorService,
    public readonly controlService: AccountingControlSystemService,
  ) {
    this.getExtensionCertificate();
  }

  private getExtensionCertificate() {
    this.controlService
      .getExtensionCertificate()
      .subscribe((res) => (this.validExtensions = res.data.map((ext: any) => `.${ext}`)));
  }

  public pickFile(event: any): void {
    if (
      !(event instanceof Event) &&
      !(event instanceof File) &&
      event instanceof Event &&
      (event.target as any).files.length == 0
    )
      return;

    this.errors.set([]);

    if (this.withType && !this.selectedType) {
      return;
    }

    const files: File[] = (event.target as any).files;
    if (this.manualHandled) {
      this.files = [];
    }

    if (files.length > this.maxFiles || files.length + this.files.length > this.maxFiles) {
      this.errors().push({ FILE_MAX_FILES: this.maxFiles });
      return;
    }

    for (let index = 0; index < files.length; index++) {
      const file: File = files[index];

      if (
        !this.validExtensions.map((ext) => ext.slice(1)).includes((file.name.split('.')?.pop() ?? '').toLowerCase())
      ) {
        this.errors().push({ FILE_INVALID_FORMAT: file.name });
        return;
      }

      if (this.files.length >= this.maxFiles) {
        this.errors().push({ FILE_MAX_FILES: this.maxFiles });
        return;
      }

      if (file.size > this.maxSizeInBytes) {
        this.errors().push({ FILE_INVALID_SIZE: [file.name, this.kbFormatter.format(this.maxSizeInBytes)] });
        return;
      }

      if (this.files.some((f) => f.name == file.name && f.size == file.size && f.lastModified == file.lastModified)) {
        this.errors().push({ FILE_DUPLICATED: file.name });
        return;
      }

      if (this.selectedType && this.withType) {
        Object.assign(file, { docType: this.selectedType });
      }

      this.files.push(file);
    }
    this.filePicker.nativeElement.value = '';
    this.selectedType = '';
    if (this.manualHandled) {
      this.selectFiles.emit(this.files);
    }
  }

  removeFile(pos: number): void {
    this.files.splice(pos, 1);
  }

  public ondragover(event: Event): void {
    event.preventDefault();
  }
}
