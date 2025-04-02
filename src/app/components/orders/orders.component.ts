import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule]
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token'); // Get auth token
    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `${token}`, // Attach token
      'Content-Type': 'application/json'
    });

    this.http.get('http://localhost:3000/orders', { headers }).subscribe({
      next: (orders) => {
        console.log("Orders:", orders);
        this.orders = Array.isArray(orders) ? orders : [];  // ✅ Ensures it's an array

      },
      error: (err) => {
        console.error("Error fetching orders:", err);
      }
    });
  }
}
