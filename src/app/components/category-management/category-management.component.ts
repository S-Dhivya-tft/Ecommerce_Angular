import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
  ],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
})
export class CategoryManagementComponent implements OnInit {
  dataList: any[] = [];
  displayedColumns: string[] = ['sno', 'name', 'actions'];
  apiUrl = 'http://localhost:3000/category';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchCategories();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }

  fetchCategories() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        this.dataList = response.map((item) => ({ ...item, editing: false }));
      },
      error: (error) => console.error('Error fetching categories:', error),
    });
  }

  addRow() {
    const newRow = { name: '', editing: true };
    this.dataList = [...this.dataList, newRow];

    this.http.post<any>(this.apiUrl, { name: '' }, { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        this.dataList = this.dataList.map((item) =>
          item === newRow ? { ...response, editing: true } : item
        );
      },
      error: (error) => console.error('Error adding category:', error),
    });
  }

  deleteRow(row: any, index: number) {
    if (!row._id) {
      this.dataList = this.dataList.filter((_, i) => i !== index);
      return;
    }

    if (confirm('Are you sure you want to delete this category?')) {
      this.http.delete(`${this.apiUrl}/${row._id}`, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          this.dataList = this.dataList.filter((_, i) => i !== index);
        },
        error: (error) => console.error('Error deleting category:', error),
      });
    }
  }

  editRow(row: any) {
    if (row.editing) {
      this.updateRow(row);
    }
    row.editing = !row.editing;
  }

  updateRow(row: any) {
    this.http.put(`${this.apiUrl}/${row._id}`, { name: row.name }, { headers: this.getAuthHeaders() }).subscribe({
      next: () => console.log('Category updated successfully'),
      error: (error) => console.error('Error updating category:', error),
    });
  }
}
