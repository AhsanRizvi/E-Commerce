import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  });
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCart(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${environment.apiUrl}/cart`).pipe(
      tap(cart => this.saveCart(cart))
    );
  }

  addToCart(item: Omit<CartItem, 'id'>): Observable<Cart> {
    return this.http.post<Cart>(`${environment.apiUrl}/cart/items`, item).pipe(
      tap(cart => this.saveCart(cart))
    );
  }

  updateQuantity(itemId: string, quantity: number): Observable<Cart> {
    return this.http.patch<Cart>(`${environment.apiUrl}/cart/items/${itemId}`, { quantity }).pipe(
      tap(cart => this.saveCart(cart))
    );
  }

  removeItem(itemId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${environment.apiUrl}/cart/items/${itemId}`).pipe(
      tap(cart => this.saveCart(cart))
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/cart`).pipe(
      tap(() => {
        localStorage.removeItem('cart');
        this.cartSubject.next({
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        });
      })
    );
  }

  getItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(cart => cart.items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  getSubtotal(): Observable<number> {
    return this.cart$.pipe(
      map(cart => cart.subtotal)
    );
  }

  getTotal(): Observable<number> {
    return this.cart$.pipe(
      map(cart => cart.total)
    );
  }
}
