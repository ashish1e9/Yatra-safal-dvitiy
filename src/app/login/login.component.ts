import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  submitted = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void { }

  onSubmit() {
    if (!this.validateEmail(this.email)) {
      alert('Invalid email format');
      return;
    }
    if (this.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    const apiUrl = `http://localhost:8080/user/login?email=${this.email}&password=${this.password}`;

    this.http.get<any>(apiUrl).subscribe(
      response => {
        if (response.status) {
          localStorage.setItem('userId', response.userId.toString());
          this.router.navigate(['/seat']);
        } else {
          alert(response.message);
        }
      },
      error => {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
      }
    );
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
