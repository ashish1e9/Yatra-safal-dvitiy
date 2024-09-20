import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.http.post('http://localhost:8080/user/signup', this.signupForm.value).subscribe(
        (response: any) => {
          if (response.status) {
            localStorage.setItem('userId', response.userId);
            this.router.navigate(['/']); 
          } else {
            alert('Sign in again.');
          }
        },
        error => {
          console.error('Error occurred during signup:', error);
          alert('An error occurred. Please try again later.'); // Handle error
        }
      );
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
