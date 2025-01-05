import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  topProducts: any[];
  salesChart: any;
}

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

      <div *ngIf="stats$ | async as stats" class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm">Total Orders</h3>
            <p class="text-3xl font-bold">{{ stats.totalOrders }}</p>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm">Total Revenue</h3>
            <p class="text-3xl font-bold">{{ stats.totalRevenue | currency }}</p>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm">Total Customers</h3>
            <p class="text-3xl font-bold">{{ stats.totalCustomers }}</p>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm">Total Products</h3>
            <p class="text-3xl font-bold">{{ stats.totalProducts }}</p>
          </div>
        </div>

        <!-- Sales Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Sales Overview</h2>
          <canvas #salesChart></canvas>
        </div>

        <!-- Recent Orders and Top Products -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Orders -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Recent Orders</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2">Order ID</th>
                    <th class="text-left py-2">Customer</th>
                    <th class="text-left py-2">Amount</th>
                    <th class="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let order of stats.recentOrders" class="border-b">
                    <td class="py-2">{{ order.id }}</td>
                    <td class="py-2">{{ order.customerName }}</td>
                    <td class="py-2">{{ order.amount | currency }}</td>
                    <td class="py-2">
                      <span [class]="getStatusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Top Products -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Top Products</h2>
            <div class="space-y-4">
              <div *ngFor="let product of stats.topProducts" 
                   class="flex items-center gap-4 p-2 hover:bg-gray-50 rounded">
                <img [src]="product.image" [alt]="product.name" 
                     class="w-12 h-12 object-cover rounded"/>
                <div class="flex-grow">
                  <h3 class="font-medium">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500">{{ product.sales }} sales</p>
                </div>
                <p class="font-medium">{{ product.revenue | currency }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats$: Observable<DashboardStats>;

  constructor(private adminService: AdminService) {
    this.stats$ = this.adminService.getDashboardStats();
  }

  ngOnInit(): void {
    this.initializeSalesChart();
  }

  private initializeSalesChart(): void {
    // Initialize Chart.js chart here
    // This would typically use the Chart.js library to create a sales chart
    // You'll need to add Chart.js as a dependency and implement the chart configuration
  }

  getStatusClass(status: string): string {
    const classes = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${classes[status] || ''}`;
  }
}
