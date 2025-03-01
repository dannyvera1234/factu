import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GeneriResp } from '@/interfaces';
import { DetailsXmlComponent } from '../details-xml';
import { NgOptimizedImage } from '@angular/common';
import { ModalComponent } from '@/components';
import { SubirXmlComponent } from '../subir-xml';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agg-xml',
  imports: [DetailsXmlComponent, NgOptimizedImage, ModalComponent, SubirXmlComponent, RouterLink],
  templateUrl: './agg-xml.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggXmlComponent {
  public readonly loading = signal(false);

  public readonly dataXML = signal<GeneriResp<any> | null>(null);

  public readonly showForm = signal(false);

  constructor() {}

  createXML(dataXML: any) {
    if (dataXML) this.showForm.set(true);
    console.log(dataXML);
    this.dataXML.set(dataXML);
  }
}
