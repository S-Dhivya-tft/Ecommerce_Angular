import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; 

@Component({
  standalone: true,
  selector: 'app-order-confirmation-dialog',
  templateUrl: './order-confirmation-dialog.component.html',
  styleUrls: ['./order-confirmation-dialog.component.css'],
  imports: [FormsModule, MatButtonModule, MatInputModule, MatRadioModule, MatDialogModule,  MatIconModule,]
})
export class OrderConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  confirmOrder() {
    if (!this.data.address.street || !this.data.address.city || !this.data.address.zip) {
      alert("Please enter a valid delivery address!");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:3000/customer/order', this.data, { headers }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error("Order failed:", err);
        alert("Order failed. Please check your login session.");
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
