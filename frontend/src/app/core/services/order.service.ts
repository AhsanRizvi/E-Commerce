import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  name: string;
  variantName: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Payment {
  method: 'stripe' | 'paypal';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  transactionId?: string;
  paymentDetails: Record<string, any>;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  payment: Payment;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'stripe' | 'paypal';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, order);
  }

  getOrders(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Observable<{ items: Order[]; total: number }> {
    return this.http.get<{ items: Order[]; total: number }>(`${environment.apiUrl}/orders`, {
      params: params as any
    });
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
  }

  cancelOrder(id: string): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders/${id}/cancel`, {});
  }

  initiatePayment(orderId: string, paymentMethod: 'stripe' | 'paypal'): Observable<{
    clientSecret?: string;
    paypalOrderId?: string;
  }> {
    return this.http.post<{ clientSecret?: string; paypalOrderId?: string }>(
      `${environment.apiUrl}/orders/${orderId}/payment`,
      { paymentMethod }
    );
  }

  confirmPayment(orderId: string, paymentIntentId: string): Observable<Order> {
    return this.http.post<Order>(
      `${environment.apiUrl}/orders/${orderId}/payment/confirm`,
      { paymentIntentId }
    );
  }
}
