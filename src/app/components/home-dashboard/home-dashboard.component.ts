import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent implements OnInit {
  newProducts: any[] = [];
  featuredProducts: any[] = [];

  constructor(private router: Router, private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchNewProducts();
    this.fetchFeaturedProducts();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }

  fetchNewProducts() {
    this.http.get<any[]>('http://localhost:3000/customer/new-products', { headers: this.getAuthHeaders() })
      .subscribe({
        next: (response) => {
          this.newProducts = response.map(product => ({
            ...product,
            rating: (Math.random() * 2 + 3).toFixed(1),
            boughtCount: Math.floor(Math.random() * 900 + 100)
          }));
        },
        error: (error) => console.error('Error on fetching new products:', error),
      });
  }
  
  fetchFeaturedProducts() {
    this.http.get<any[]>('http://localhost:3000/customer/featured-products', { headers: this.getAuthHeaders() })
      .subscribe({
        next: (response) => {
          this.featuredProducts = response.map(product => ({
            ...product,
            rating: (Math.random() * 2 + 3).toFixed(1),
            boughtCount: Math.floor(Math.random() * 900 + 100)
          }));
        },
        error: (error) => console.error('Error fetching featured products:', error),
      });
  } 
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }


  viewProduct(product: any) {
    this.router.navigate(['/product', product._id]);
  }
  goToCart() {
    this.router.navigate(['/cart']);
  }
  
  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }
  
}
