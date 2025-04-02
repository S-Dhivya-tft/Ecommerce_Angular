import { Component, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../model/login-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ]
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUser();
      this.router.navigate(user.isAdmin ? ['/admin/dashboard'] : ['/home/dashboard']);
    }
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response: LoginResponse) => {
        if (response.token) {
          localStorage.setItem('token', response.token); 
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(response.user.isAdmin ? ['/admin/dashboard'] : ['/home/dashboard']);
        } else {
          console.error('Token not received');
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.router.navigate(['/home/dashboard']);
      }
    });    
  }  
  goToRegister() {
    this.router.navigate(['/register']); 
  }
}
