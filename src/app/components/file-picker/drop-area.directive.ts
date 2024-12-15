import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDropArea]',
  standalone: true,
})
export class DropDirective {
  @Output() files: EventEmitter<any> = new EventEmitter();

  @HostListener('dragover', ['$event'])
  public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event'])
  public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.dataTransfer == null) return;

    if (evt.dataTransfer.files.length > 0) {
      this.files.emit(evt.dataTransfer.files[0]);
    }
  }
}
