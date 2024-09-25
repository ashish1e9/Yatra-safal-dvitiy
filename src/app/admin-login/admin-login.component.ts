import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

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
  

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

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
      console.log(loginData);
      console.log(this.loginForm);

      this.http.post<any>(this.loginApiUrl, loginData).subscribe(
        (response) => {
          if (response !== -1){
            console.log(response);
            sessionStorage.setItem('adminId', response);
            sessionStorage.setItem('adminEmail', loginData.email);
              this.router.navigate(['/admin/dashboard']);
          }
          else{
            this.errorMessage = 'Login failed. Please check your credentials.';
            this.successMessage = '';
            console.log(this.errorMessage);
          }
        }      
      );
    }
  }
}
