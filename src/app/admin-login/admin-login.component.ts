import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  private loginApiUrl = 'http://localhost:8080/admin/login'; 

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      //console.log(loginData);
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post<any>(this.loginApiUrl, loginData, { headers }).subscribe(
        (response) => {
          this.successMessage = 'Login successful!';
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Login failed. Please check your credentials.';
          this.successMessage = '';
        }
      );
    }
  }
}
