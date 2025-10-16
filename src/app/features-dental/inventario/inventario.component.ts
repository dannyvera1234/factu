import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-inventario',
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  templateUrl: './inventario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventarioComponent {
  searchTerm = signal('');
  selectedCategory = signal('todos');
  selectedStock = signal('todos');
  currentPage = signal(1);
  itemsPerPage = 10;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', route: '/sistema_dental/inicio' },
    { label: 'Inventario' }
  ];

  // Datos simulados de productos
  allProducts = signal([
    {
      id: 1,
      name: 'Resina Compuesta A2',
      description: 'Resina fotopolimerizable color A2',
      code: 'RC',
      category: 'materiales',
      stock: 15,
      minStock: 5,
      unit: 'unidades',
      price: 45.50,
      supplier: 'Dental Supply Co.'
    },
    {
      id: 2,
      name: 'Fresa Diamantada 801',
      description: 'Fresa diamantada para preparación',
      code: 'FD',
      category: 'instrumental',
      stock: 3,
      minStock: 10,
      unit: 'unidades',
      price: 12.75,
      supplier: 'Instrumentos Dentales SA'
    },
    {
      id: 3,
      name: 'Anestesia Lidocaína 2%',
      description: 'Anestesia local con epinefrina',
      code: 'AN',
      category: 'medicamentos',
      stock: 0,
      minStock: 20,
      unit: 'cartuchos',
      price: 2.30,
      supplier: 'Farmacéutica Dental'
    },
    {
      id: 4,
      name: 'Amalgama Dental',
      description: 'Amalgama de plata para obturaciones',
      code: 'AM',
      category: 'materiales',
      stock: 25,
      minStock: 8,
      unit: 'cápsulas',
      price: 3.80,
      supplier: 'Dental Supply Co.'
    },
    {
      id: 5,
      name: 'Espejo Bucal #5',
      description: 'Espejo bucal plano número 5',
      code: 'EB',
      category: 'instrumental',
      stock: 12,
      minStock: 6,
      unit: 'unidades',
      price: 8.90,
      supplier: 'Instrumentos Dentales SA'
    },
      {
      id: 6,
      name: 'Espejo Bucal #5',
      description: 'Espejo bucal plano número 5',
      code: 'EB',
      category: 'instrumental',
      stock: 12,
      minStock: 6,
      unit: 'unidades',
      price: 8.90,
      supplier: 'Instrumentos Dentales SA'
    },
      {
      id: 7,
      name: 'Espejo Bucal #5',
      description: 'Espejo bucal plano número 5',
      code: 'EB',
      category: 'instrumental',
      stock: 12,
      minStock: 6,
      unit: 'unidades',
      price: 8.90,
      supplier: 'Instrumentos Dentales SA'
    }
    ,
      {
      id: 8,
      name: 'Espejo Bucal #5',
      description: 'Espejo bucal plano número 5',
      code: 'EB',
      category: 'instrumental',
      stock: 12,
      minStock: 6,
      unit: 'unidades',
      price: 8.90,
      supplier: 'Instrumentos Dentales SA'
    },
      {
      id: 9,
      name: 'Espejo Bucal #5',
      description: 'Espejo bucal plano número 5',
      code: 'EB',
      category: 'instrumental',
      stock: 12,
      minStock: 6,
      unit: 'unidades',
      price: 8.90,
      supplier: 'Instrumentos Dentales SA'
    },
      {
      id: 10,
      name: 'Espejo Bucal #5',
      description: 'Espejo bucal plano número 5',
      code: 'EB',
      category: 'instrumental',
      stock: 12,
      minStock: 6,
      unit: 'unidades',
      price: 8.90,
      supplier: 'Instrumentos Dentales SA'
    },
      {
      id: 11,
      name: 'Espejo Bucal #5',
      description: 'Espejo bucal plano número 5',
      code: 'EB',
      category: 'instrumental',
      stock: 12,
      minStock: 6,
      unit: 'unidades',
      price: 8.90,
      supplier: 'Instrumentos Dentales SA'
    }
  ]);

  // Productos filtrados
  filteredProducts = computed(() => {
    let products = this.allProducts();

    // Filtrar por término de búsqueda
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.supplier.toLowerCase().includes(term)
      );
    }

    // Filtrar por categoría
    if (this.selectedCategory() !== 'todos') {
      products = products.filter(p => p.category === this.selectedCategory());
    }

    // Filtrar por stock
    if (this.selectedStock() !== 'todos') {
      products = products.filter(p => {
        switch (this.selectedStock()) {
          case 'disponible': return p.stock > p.minStock;
          case 'bajo': return p.stock > 0 && p.stock <= p.minStock;
          case 'agotado': return p.stock === 0;
          default: return true;
        }
      });
    }

    return products;
  });

  // Productos paginados
  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts().slice(start, end);
  });

  // Total de páginas
  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage);
  });

  newProduct() {
    console.log('Nuevo producto');
  }

  editProduct(productId: number) {
    console.log('Editar producto:', productId);
  }

  adjustStock(productId: number) {
    console.log('Ajustar stock:', productId);
  }

  exportList() {
    console.log('Exportar inventario');
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  getCategoryText(category: string) {
    switch (category) {
      case 'materiales': return 'Materiales';
      case 'instrumental': return 'Instrumental';
      case 'medicamentos': return 'Medicamentos';
      default: return category;
    }
  }

  getStockColor(stock: number, minStock: number) {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock <= minStock) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  getStockStatus(stock: number, minStock: number) {
    if (stock === 0) return 'Agotado';
    if (stock <= minStock) return 'Stock Bajo';
    return 'Disponible';
  }

  Math = Math;
}
