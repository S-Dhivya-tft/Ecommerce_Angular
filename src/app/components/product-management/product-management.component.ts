import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core';  

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,   
    MatOptionModule    
  ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  productList: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  displayedColumns: string[] = [
    'sno',
    'name',
    'description',
    'price',
    'discount',
    'images',
    'isFeatured',
    'isNewProduct',
    'actions'
  ];
  apiUrl = 'http://localhost:3000/product';

  showAddForm = false;
  newProduct = {
    name: '',
    description: '',
    price: 0,
    discount: 0,
    images: [''],
    isFeatured: false,
    isNewProduct: false,
    categoryId: '',
    brandId: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProducts();
    this.fetchCategories(); 
    this.fetchBrands(); 
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }

  fetchProducts() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        this.productList = response.map((item, index) => ({
          ...item,
          sno: index + 1,
          editing: false
        }));
      },
      error: (error) => console.error('Error fetching products:', error),
    });
  }
  onEditImageUpload(event: any, product: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        product.images[0] = reader.result as string; // Update the product's image
      };
      reader.readAsDataURL(file);
    }
  }
  
  fetchCategories() {
    this.http.get<any[]>('http://localhost:3000/category', { headers: this.getAuthHeaders() }).subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  fetchBrands() {
    this.http.get<any[]>('http://localhost:3000/brand', { headers: this.getAuthHeaders() }).subscribe({
      next: (res) => this.brands = res,
      error: (err) => console.error('Error fetching brands:', err)
    });
  }

  openAddForm() {
    this.showAddForm = true;
  }

  closeForm() {
    this.showAddForm = false;
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newProduct.images[0] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    this.http.post<any>(this.apiUrl, this.newProduct, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        this.fetchProducts(); // Fetch the updated product list
        this.closeForm();
      },
      error: (error) => console.error('Error adding product:', error),
    });
  }
  
  editRow(product: any) {
    if (product.editing) {
      this.updateProduct(product);
    }
    product.editing = !product.editing;
  }
  
  updateProduct(product: any) {
    this.http.put(`${this.apiUrl}/${product._id}`, {
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      isFeatured: product.isFeatured,
      isNewProduct: product.isNewProduct,
      images: product.images // Include updated image
    }, { headers: this.getAuthHeaders() }).subscribe({
      next: () => console.log('Product updated successfully'),
      error: (error) => console.error('Error updating product:', error),
    });
  }
  

  deleteRow(row: any, index: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`${this.apiUrl}/${row._id}`, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          this.productList = this.productList.filter((_, i) => i !== index);
        },
        error: (error) => console.error('Error deleting product:', error),
      });
    }
  }
  getCategoryName(id: string): string {
    const cat = this.categories.find(c => c._id === id);
    return cat ? cat.name : 'N/A';
  }
  
  getBrandName(id: string): string {
    const brand = this.brands.find(b => b._id === id);
    return brand ? brand.name : 'N/A';
  }
  
}
