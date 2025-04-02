import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],  // 👈 THIS FIXES THE ERROR
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.fetchWishlistItems();
  }

  fetchWishlistItems() {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`
    });

    this.http.get('http://localhost:3000/customer/wishlists', { headers }).subscribe({
      next: (res: any) => this.wishlistItems = res,
      error: (err) => console.error('Error fetching wishlist:', err)
    });
  }
  addToCart(item: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `${token}` });
  
    // First: Add to cart
    this.http.post(`http://localhost:3000/customer/carts/${item._id}`, { quantity: 1 }, { headers }).subscribe({
      next: () => {
        // Then: Remove from wishlist
        this.removeFromWishlist(item._id);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      }
    });
  }
  
  removeFromWishlist(productId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `${token}` });
  
    this.http.delete(`http://localhost:3000/customer/wishlists/${productId}`, { headers }).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(item => item._id !== productId);
        console.log('Removed from wishlist');
      },
      error: (err) => {
        console.error('Error removing from wishlist:', err);
      }
    });
  }
  goToDashboard() {
    this.router.navigate(['/home/dashboard']);
  }
}
