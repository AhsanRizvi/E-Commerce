import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductService, Product, ProductsResponse } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Search and Filters -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-4">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="search$.next($event)"
            placeholder="Search products..."
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          
          <select
            [(ngModel)]="selectedCategory"
            (change)="loadProducts()"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>
          
          <select
            [(ngModel)]="sortBy"
            (change)="loadProducts()"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div *ngFor="let product of (products$ | async)?.items" 
             class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <img [src]="product.images[0]?.url" [alt]="product.name" 
               class="w-full h-48 object-cover"/>
          
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
            
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-primary-600">
                {{ product.variants[0]?.price | currency }}
              </span>
              
              <button (click)="addToCart(product)" 
                      class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex justify-center">
        <nav class="flex items-center gap-2">
          <button
            *ngFor="let page of getPages()"
            (click)="goToPage(page)"
            [class.bg-primary-500]="currentPage === page"
            [class.text-white]="currentPage === page"
            class="px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors duration-300"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products$!: Observable<ProductsResponse>;
  categories: any[] = [];
  searchQuery = '';
  selectedCategory = '';
  sortBy = 'newest';
  currentPage = 1;
  pageSize = 12;
  search$ = new Subject<string>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = Number(params['page']) || 1;
      this.selectedCategory = params['category'] || '';
      this.sortBy = params['sort'] || 'newest';
      this.searchQuery = params['search'] || '';
      this.loadProducts();
    });

    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.updateUrl();
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.products$ = this.productService.getProducts({
      page: this.currentPage,
      pageSize: this.pageSize,
      category: this.selectedCategory,
      search: this.searchQuery,
      sort: this.sortBy
    });
  }

  addToCart(product: Product): void {
    const defaultVariant = product.variants[0];
    if (defaultVariant) {
      this.cartService.addToCart({
        productId: product.id,
        variantId: defaultVariant.id,
        name: product.name,
        variantName: defaultVariant.name,
        price: defaultVariant.price,
        quantity: 1,
        image: product.images[0]?.url || ''
      }).subscribe();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateUrl();
    this.loadProducts();
  }

  getPages(): number[] {
    const totalPages = 10; // Replace with actual total pages from API
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  private updateUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        category: this.selectedCategory || null,
        sort: this.sortBy,
        search: this.searchQuery || null
      },
      queryParamsHandling: 'merge'
    });
  }
}
