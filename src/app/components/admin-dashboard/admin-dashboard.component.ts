import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterModule], 
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']); 
  }
  goToOrders() {
    this.router.navigate(['/orders']);
  }
}
