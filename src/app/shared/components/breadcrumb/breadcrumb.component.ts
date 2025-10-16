import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="flex items-center space-x-2 text-sm text-slate-600 mb-6">
      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
      </svg>
      
      @for (item of items; track $index) {
        @if ($index > 0) {
          <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        }
        
        @if (item.route && $index < items.length - 1) {
          <a 
            [routerLink]="item.route" 
            class="hover:text-blue-600 transition-colors font-medium"
          >
            {{ item.label }}
          </a>
        } @else {
          <span [class]="$index === items.length - 1 ? 'text-slate-900 font-semibold' : 'text-slate-600'">
            {{ item.label }}
          </span>
        }
      }
    </nav>
  `
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}