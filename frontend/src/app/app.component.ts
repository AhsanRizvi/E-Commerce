import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <nav class="container mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <!-- Logo -->
            <a routerLink="/" class="text-2xl font-bold text-primary-600">
              E-Commerce
            </a>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center space-x-8">
              <a routerLink="/products" 
                 routerLinkActive="text-primary-600"
                 class="text-gray-700 hover:text-primary-600">
                Products
              </a>
              <a routerLink="/categories" 
                 routerLinkActive="text-primary-600"
                 class="text-gray-700 hover:text-primary-600">
                Categories
              </a>
              <a routerLink="/cart" 
                 routerLinkActive="text-primary-600"
                 class="text-gray-700 hover:text-primary-600 flex items-center">
                <span class="material-icons mr-1">shopping_cart</span>
                <span class="bg-primary-500 text-white rounded-full px-2 py-1 text-xs" 
                      *ngIf="cartItemCount$ | async as count">
                  {{ count }}
                </span>
              </a>
            </div>

            <!-- Auth Links -->
            <div class="flex items-center space-x-4">
              <ng-container *ngIf="!(isAuthenticated$ | async); else userMenu">
                <a routerLink="/auth/login" 
                   class="text-gray-700 hover:text-primary-600">
                  Login
                </a>
                <a routerLink="/auth/register" 
                   class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  Register
                </a>
              </ng-container>
              
              <ng-template #userMenu>
                <div class="relative" #dropdown>
                  <button (click)="toggleDropdown()"
                          class="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    <span class="material-icons">account_circle</span>
                    <span>{{ (currentUser$ | async)?.firstName }}</span>
                  </button>
                  
                  <div *ngIf="isDropdownOpen"
                       class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <a routerLink="/account" 
                       class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Account
                    </a>
                    <a routerLink="/account/orders" 
                       class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Orders
                    </a>
                    <a *ngIf="isAdmin$ | async"
                       routerLink="/admin" 
                       class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </a>
                    <button (click)="logout()"
                            class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                </div>
              </ng-template>
            </div>
          </div>
        </nav>
      </header>

      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t mt-16">
        <div class="container mx-auto px-4 py-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 class="text-lg font-semibold mb-4">About Us</h3>
              <p class="text-gray-600">
                Your trusted online shopping destination for quality products.
              </p>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
              <ul class="space-y-2">
                <li>
                  <a routerLink="/about" class="text-gray-600 hover:text-primary-600">
                    About Us
                  </a>
                </li>
                <li>
                  <a routerLink="/contact" class="text-gray-600 hover:text-primary-600">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a routerLink="/faq" class="text-gray-600 hover:text-primary-600">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
              <ul class="space-y-2">
                <li>
                  <a routerLink="/shipping" class="text-gray-600 hover:text-primary-600">
                    Shipping Information
                  </a>
                </li>
                <li>
                  <a routerLink="/returns" class="text-gray-600 hover:text-primary-600">
                    Returns Policy
                  </a>
                </li>
                <li>
                  <a routerLink="/privacy" class="text-gray-600 hover:text-primary-600">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold mb-4">Connect With Us</h3>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-600 hover:text-primary-600">
                  <span class="material-icons">facebook</span>
                </a>
                <a href="#" class="text-gray-600 hover:text-primary-600">
                  <span class="material-icons">twitter</span>
                </a>
                <a href="#" class="text-gray-600 hover:text-primary-600">
                  <span class="material-icons">instagram</span>
                </a>
              </div>
            </div>
          </div>
          
          <div class="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; {{ currentYear }} E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit {
  isDropdownOpen = false;
  currentYear = new Date().getFullYear();
  isAuthenticated$ = this.authService.currentUser;
  currentUser$ = this.authService.currentUser;
  isAdmin$ = this.authService.currentUser.pipe(
    map(user => user?.role === 'admin')
  );
  cartItemCount$ = this.cartService.getItemCount();

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Track router navigation for analytics
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Implement analytics tracking here
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdown = this.dropdown?.nativeElement;
    if (dropdown && !dropdown.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
}
