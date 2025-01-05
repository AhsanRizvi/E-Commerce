import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-management',
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Product Management</h1>
        <button (click)="openProductDialog()" 
                class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          Add New Product
        </button>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" [(ngModel)]="filters.search" 
                 placeholder="Search products..."
                 class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"/>
          
          <select [(ngModel)]="filters.category"
                  class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>
          
          <select [(ngModel)]="filters.status"
                  class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          
          <button (click)="loadProducts()"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Apply Filters
          </button>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let product of products">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img [src]="product.images[0]?.url" 
                       [alt]="product.name"
                       class="h-10 w-10 rounded-full object-cover"/>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      SKU: {{ product.variants[0]?.sku }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.category?.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ product.variants[0]?.price | currency }}
                </div>
                <div *ngIf="product.variants[0]?.salePrice" class="text-sm text-red-500">
                  Sale: {{ product.variants[0]?.salePrice | currency }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ product.variants[0]?.stock }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [class]="getStatusClass(product.status)">
                  {{ product.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button (click)="editProduct(product)"
                        class="text-primary-600 hover:text-primary-900 mr-4">
                  Edit
                </button>
                <button (click)="deleteProduct(product)"
                        class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div class="flex-1 flex justify-between sm:hidden">
            <button (click)="previousPage()"
                    [disabled]="currentPage === 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button (click)="nextPage()"
                    [disabled]="currentPage === totalPages"
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                to
                <span class="font-medium">
                  {{ Math.min(currentPage * pageSize, totalItems) }}
                </span>
                of
                <span class="font-medium">{{ totalItems }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button *ngFor="let page of getPageNumbers()"
                        (click)="goToPage(page)"
                        [class.bg-primary-50]="page === currentPage"
                        [class.text-primary-600]="page === currentPage"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {{ page }}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductManagementComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  filters = {
    search: '',
    category: '',
    status: ''
  };
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe(
      categories => this.categories = categories
    );
  }

  loadProducts(): void {
    const params = {
      page: this.currentPage,
      pageSize: this.pageSize,
      ...this.filters
    };

    this.adminService.getProducts(params).subscribe(
      response => {
        this.products = response.items;
        this.totalItems = response.total;
        this.totalPages = Math.ceil(response.total / this.pageSize);
      }
    );
  }

  openProductDialog(product?: any): void {
    // Implement product dialog
  }

  editProduct(product: any): void {
    this.openProductDialog(product);
  }

  deleteProduct(product: any): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(product.id).subscribe(
        () => {
          this.loadProducts();
          this.snackBar.open('Product deleted successfully', 'Close', {
            duration: 3000
          });
        }
      );
    }
  }

  getStatusClass(status: string): string {
    const classes = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-gray-100 text-gray-800',
      'out_of_stock': 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${classes[status] || ''}`;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
