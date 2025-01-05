import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { CartService, Cart } from '../../../core/services/cart.service';
import { OrderService, CreateOrderRequest } from '../../../core/services/order.service';

declare const paypal: any;

@Component({
  selector: 'app-checkout',
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Checkout Form -->
        <div>
          <h2 class="text-2xl font-bold mb-6">Shipping Information</h2>
          
          <form [formGroup]="shippingForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" formControlName="firstName"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" formControlName="lastName"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Street Address</label>
              <input type="text" formControlName="street"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">City</label>
                <input type="text" formControlName="city"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">State</label>
                <input type="text" formControlName="state"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Postal Code</label>
                <input type="text" formControlName="postalCode"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" formControlName="phone"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
              </div>
            </div>
          </form>

          <div class="mt-8">
            <h2 class="text-2xl font-bold mb-6">Payment Method</h2>
            
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <input type="radio" id="stripe" name="paymentMethod" value="stripe"
                       [(ngModel)]="selectedPaymentMethod"
                       class="h-4 w-4 text-primary-600 focus:ring-primary-500"/>
                <label for="stripe" class="text-sm font-medium text-gray-700">Credit Card (Stripe)</label>
              </div>
              
              <div class="flex items-center gap-4">
                <input type="radio" id="paypal" name="paymentMethod" value="paypal"
                       [(ngModel)]="selectedPaymentMethod"
                       class="h-4 w-4 text-primary-600 focus:ring-primary-500"/>
                <label for="paypal" class="text-sm font-medium text-gray-700">PayPal</label>
              </div>
            </div>

            <div *ngIf="selectedPaymentMethod === 'stripe'" class="mt-4">
              <div #stripeElement></div>
            </div>

            <div *ngIf="selectedPaymentMethod === 'paypal'" class="mt-4">
              <div #paypalElement></div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div *ngIf="cart" class="space-y-4">
            <div *ngFor="let item of cart.items" class="flex justify-between">
              <span>{{ item.name }} (x{{ item.quantity }})</span>
              <span>{{ item.price * item.quantity | currency }}</span>
            </div>
            
            <div class="border-t pt-4">
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
              
              <div class="flex justify-between font-bold mt-4">
                <span>Total</span>
                <span>{{ cart.total | currency }}</span>
              </div>
            </div>

            <button (click)="placeOrder()"
                    [disabled]="!shippingForm.valid || !selectedPaymentMethod || processing"
                    class="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300 disabled:bg-gray-400">
              {{ processing ? 'Processing...' : 'Place Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  shippingForm: FormGroup;
  cart: Cart | null = null;
  selectedPaymentMethod: 'stripe' | 'paypal' = 'stripe';
  processing = false;
  private stripe: any;
  private card: any;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });

    this.stripe = await loadStripe(environment.stripePublishableKey);
    this.initializeStripe();
    this.initializePayPal();
  }

  private async initializeStripe(): Promise<void> {
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#stripe-element');
  }

  private initializePayPal(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return this.createPayPalOrder();
      },
      onApprove: (data: any, actions: any) => {
        return this.onPayPalApprove(data);
      }
    }).render('#paypal-element');
  }

  private async createPayPalOrder(): Promise<string> {
    if (!this.cart) return '';
    
    const order = await this.orderService.initiatePayment(
      this.cart.id,
      'paypal'
    ).toPromise();
    
    return order.paypalOrderId || '';
  }

  private async onPayPalApprove(data: any): Promise<void> {
    this.processing = true;
    try {
      await this.orderService.confirmPayment(
        this.cart?.id || '',
        data.orderID
      ).toPromise();
      
      await this.cartService.clearCart().toPromise();
      this.router.navigate(['/orders/confirmation']);
    } catch (error) {
      console.error('PayPal payment failed:', error);
    } finally {
      this.processing = false;
    }
  }

  async placeOrder(): Promise<void> {
    if (!this.cart || !this.shippingForm.valid) return;

    this.processing = true;
    try {
      const orderRequest: CreateOrderRequest = {
        items: this.cart.items,
        shippingAddress: {
          ...this.shippingForm.value,
          country: 'US' // Add country selector if needed
        },
        paymentMethod: this.selectedPaymentMethod
      };

      const order = await this.orderService.createOrder(orderRequest).toPromise();

      if (this.selectedPaymentMethod === 'stripe') {
        const payment = await this.orderService.initiatePayment(
          order.id,
          'stripe'
        ).toPromise();

        const result = await this.stripe.confirmCardPayment(payment.clientSecret, {
          payment_method: {
            card: this.card
          }
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        await this.orderService.confirmPayment(
          order.id,
          result.paymentIntent.id
        ).toPromise();
      }

      await this.cartService.clearCart().toPromise();
      this.router.navigate(['/orders/confirmation']);
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      this.processing = false;
    }
  }
}
