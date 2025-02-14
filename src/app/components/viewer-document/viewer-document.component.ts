import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-viewer-document',
  imports: [],
  templateUrl: './viewer-document.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerDocumentComponent {
  @Input() documentUrl: string | null = null;
  @Output() close = new EventEmitter<void>();

  sanitizedUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    if (this.documentUrl) {
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.documentUrl);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
