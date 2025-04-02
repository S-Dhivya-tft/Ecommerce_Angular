import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { OrderConfirmationDialogComponent } from '../order-confirmation-dialog/order-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatRadioModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  orderPlaced = false;
  paymentType: string = "COD";
  address = { street: "", city: "", zip: "" };

  constructor(private http: HttpClient, public dialog: MatDialog,private router: Router) {}

  ngOnInit(): void {
    this.fetchCartItems();
  }

  fetchCartItems() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `${token}` });

    this.http.get('http://localhost:3000/customer/carts', { headers }).subscribe({
      next: (res: any) => this.cartItems = res,
      error: (err) => console.error('Error fetching cart:', err)
    });
  }

  updateQuantity(item: any, change: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `${token}` });
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      this.http.delete(`http://localhost:3000/customer/carts/${item.product._id}`, { headers }).subscribe({
        next: () => this.cartItems = this.cartItems.filter(i => i.product._id !== item.product._id),
        error: (err) => console.error('Error removing item:', err)
      });
    } else {
      item.quantity = newQuantity;
    }
  }
  
  getDiscountedPrice(price: number, discount: number): number {
    return price - (price * discount / 100);
  }  
  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
  
  getTotalDiscount(): number {
    return this.cartItems.reduce((total, item) => {
      const discountAmount = item.product.price * item.product.discount / 100;
      return total + discountAmount * item.quantity;
    }, 0);
  }
  
  getAmountPayable(): number {
    return this.getTotalPrice() - this.getTotalDiscount();
  }
  getEstimatedDeliveryDate(): string {
    const date = new Date();
    const randomDays = Math.floor(Math.random() * 4) + 2; // 2 to 5 days
    date.setDate(date.getDate() + randomDays);
    return date.toDateString();
  }
  placeOrder() {
    const dialogRef = this.dialog.open(OrderConfirmationDialogComponent, {
      width: '400px',
      data: {
        items: this.cartItems,
        date: new Date(),
        paymentType: 'COD',
        address: { street: "", city: "", zip: "" }
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartItems = []; // Clear cart after successful order
        this.orderPlaced = true;
      }
    });
  }
  goToDashboard() {
    this.router.navigate(['/home/dashboard']);}
}
