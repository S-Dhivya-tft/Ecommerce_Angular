import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productId: string = '';
  product: any;
  isWishlisted: boolean = false;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchProduct();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }

  fetchProduct() {
    this.http.get(`http://localhost:3000/customer/product/${this.productId}`, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (res) => (this.product = res),
      error: (err) => console.error('Error fetching product:', err),
    });
  }

  addToCart() {
    const body = { quantity: 1 };
    this.http.post(`http://localhost:3000/customer/carts/${this.productId}`, body, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (res) => console.log('Added to cart:', res),
      error: (err) => console.error('Error adding to cart:', err),
    });
  }

  addToWishlist() {
    this.http.post(`http://localhost:3000/customer/wishlists/${this.productId}`, {}, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (res) => console.log('Added to wishlist:', res),
      error: (err) => console.error('Error adding to wishlist:', err),
    });
  }
}
