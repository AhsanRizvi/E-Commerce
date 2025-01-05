import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, Cart, CartItem } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div *ngIf="(cart$ | async) as cart" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div *ngIf="cart.items.length === 0" class="text-center py-8">
            <p class="text-gray-600 mb-4">Your cart is empty</p>
            <button routerLink="/products" 
                    class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300">
              Continue Shopping
            </button>
          </div>

          <div *ngFor="let item of cart.items" 
               class="flex items-center gap-4 p-4 mb-4 bg-white rounded-lg shadow">
            <img [src]="item.image" [alt]="item.name" 
                 class="w-24 h-24 object-cover rounded"/>
            
            <div class="flex-grow">
              <h3 class="font-semibold">{{ item.name }}</h3>
              <p class="text-gray-600">{{ item.variantName }}</p>
              <p class="text-primary-600 font-bold">{{ item.price | currency }}</p>
            </div>

            <div class="flex items-center gap-2">
              <button (click)="updateQuantity(item, item.quantity - 1)"
                      class="p-2 rounded-full hover:bg-gray-100"
                      [disabled]="item.quantity <= 1">
                <span class="material-icons">remove</span>
              </button>
              
              <span class="w-8 text-center">{{ item.quantity }}</span>
              
              <button (click)="updateQuantity(item, item.quantity + 1)"
                      class="p-2 rounded-full hover:bg-gray-100">
                <span class="material-icons">add</span>
              </button>
            </div>

            <button (click)="removeItem(item.id)" 
                    class="p-2 text-gray-500 hover:text-red-500">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>

        <!-- Order Summary -->
        <div *ngIf="cart.items.length > 0" class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div class="space-y-4">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>{{ cart.subtotal | currency }}</span>
            </div>
            
            <div class="flex justify-between">
              <span>Shipping</span>
              <span>{{ cart.shipping | currency }}</span>
            </div>
            
            <div class="flex justify-between">
              <span>Tax</span>
              <span>{{ cart.tax | currency }}</span>
            </div>
            
            <div class="border-t pt-4">
              <div class="flex justify-between font-bold">
                <span>Total</span>
                <span>{{ cart.total | currency }}</span>
              </div>
            </div>

            <button (click)="checkout()" 
                    class="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart>;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe();
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(item.id, quantity).subscribe();
    }
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId).subscribe();
  }

  checkout(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: '/checkout' }
      });
    }
  }
}
