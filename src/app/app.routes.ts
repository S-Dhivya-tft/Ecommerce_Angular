import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HomeDashboardComponent } from './components/home-dashboard/home-dashboard.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { BrandManagementComponent } from './components/brand-management/brand-management.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrdersComponent } from './components/orders/orders.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'home/dashboard', component: HomeDashboardComponent },
  { path: 'admin/categories', component: CategoryManagementComponent },
  { path: 'admin/brands', component: BrandManagementComponent },
  { path: 'admin/products', component: ProductManagementComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
   { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'orders', component: OrdersComponent }
];
