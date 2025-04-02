import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { name: '', email: '', password: '' }; 

  constructor(private http: HttpClient, private router: Router) {} // FIXED

  registerUser() {
    this.http.post('http://localhost:3000/auth/register', this.user).subscribe({
      next: () => {
        alert('Registration successful! Please log in.');
        this.router.navigate(['/login']); // FIXED
      },
      error: err => alert('Error registering user: ' + err.message)
    });
  }
}
