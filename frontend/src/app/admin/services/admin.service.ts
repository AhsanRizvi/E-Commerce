import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/dashboard/stats`);
  }

  // Products Management
  getProducts(params: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/products`, { params });
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/products`, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/products/${id}`);
  }

  // Orders Management
  getOrders(params: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/orders`, { params });
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/admin/orders/${id}/status`, { status });
  }

  // Users Management
  getUsers(params: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/users`, { params });
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/users/${id}`, userData);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/users/${id}`);
  }

  // Categories Management
  getCategories(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/categories`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/categories`, category);
  }

  updateCategory(id: string, category: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/categories/${id}`);
  }

  // Content Management
  getBanners(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/content/banners`);
  }

  updateBanner(id: string, banner: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/content/banners/${id}`, banner);
  }

  // Settings
  getSettings(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/settings`);
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/settings`, settings);
  }

  // Analytics
  getSalesReport(params: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/analytics/sales`, { params });
  }

  getCustomerReport(params: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/analytics/customers`, { params });
  }

  getInventoryReport(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/analytics/inventory`);
  }

  // File Upload
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/admin/upload`, formData);
  }

  // Bulk Operations
  bulkUpdateProducts(products: any[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/products/bulk-update`, { products });
  }

  bulkDeleteProducts(productIds: string[]): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/admin/products/bulk-delete`, { productIds });
  }

  // SEO Management
  updateSeoSettings(pageId: string, seoData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/seo/${pageId}`, seoData);
  }

  getSeoSettings(pageId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/seo/${pageId}`);
  }
}
