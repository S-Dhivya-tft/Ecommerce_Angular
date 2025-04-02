import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../model/login-response.model';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth/login';

  constructor(private http: HttpClient, private router: Router) {} 

  login(email: string, password: string): Observable<LoginResponse> { 
    return this.http.post<LoginResponse>(this.apiUrl, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']); 
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    try {
      const payload: any = jwtDecode(token);
      return payload.exp * 1000 > Date.now(); 
    } catch (error) {
      console.error("Invalid token format:", error);
      return false;
    }
  }
  

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
