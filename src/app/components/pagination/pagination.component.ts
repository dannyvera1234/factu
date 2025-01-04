import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, Output } from '@angular/core';
import { MinNumberPipe } from '../../pipes';
import { SearchService } from '../../utils/services';


@Component({
  selector: 'app-pagination',
  imports: [NgClass, MinNumberPipe],
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  // TODO: Handle page limit via ENV
  private readonly search = computed(() => this.searchService.search());

  public readonly pagination = computed(() => this.searchService.pagination());

  public readonly currentPage = computed(() => {
    const pagination = this.pagination();
    if (!pagination) return 0;

    return Math.floor(pagination.offset / pagination.limit) + 1;
  });

  public readonly pages = computed<number[]>(() => {
    const pages: number[] = [];
    const pagination = this.pagination();
    if (!pagination) return pages;

    // If the total number of pages is less than or equal to 3, show all available pages
    if (pagination.total_pages <= 3) {
      for (let i = 1; i <= pagination.total_pages; i++) {
        pages.push(i);
      }
    } else {
      // If the current page is 1 or 2, show the first 3 pages
      if (this.currentPage() <= 2) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
      } else if (this.currentPage() >= pagination.total_pages - 1) {
        // If the current page is one of the last two pages, show the last 3 pages
        for (let i = pagination.total_pages - 2; i <= pagination.total_pages; i++) {
          pages.push(i);
        }
      } else {
        // In other cases, show the current page and the next two
        for (let i = this.currentPage() - 1; i <= this.currentPage() + 1; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  });

  // Used to make manual trigger
  @Output() public readonly changed = new EventEmitter<number>();

  constructor(private readonly searchService: SearchService) {}

  changePage(offset: number) {
    this.searchService.search.set(this.search().copyWith({ offset }));
    this.changed.emit();
  }

  changeLimit(event: Event) {
    const limit = Number((event.target as HTMLTextAreaElement)?.value);
    if (limit) {
      this.searchService.search.set(this.search().copyWith({ limit }));
      this.changed.emit();
    }
  }

  next() {
    const offset = Math.max(0, this.pagination()!.offset - this.pagination()!.limit);
    this.searchService.search.set(this.search().copyWith({ offset }));
    this.changed.emit();
  }

  prev() {
    const offset = Math.max(0, this.pagination()!.offset - this.pagination()!.limit);
    this.searchService.search.set(this.search().copyWith({ offset }));
    this.changed.emit();
  }
}
