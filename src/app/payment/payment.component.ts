import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  amount: number = 5310;
  method!: string;
  userId: number = 1;
  timeRemaining: string = '00:00';
  timer: any;
  expirationTime!: number;
  startTime!: number;
  isExpired: boolean = false;

  sessionId: string | null = null;
  sessionValid: boolean = false;

  paymentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift();
    return undefined;
  }

  checkSessionValidity() {
    const sessionId = this.getCookie('sessionId');
    if (sessionId) {
      this.http
        .get<boolean>(
          `http://localhost:8080/payment/validate-session?userId=${this.userId}`
        )
        .subscribe((isValid) => {
          this.sessionValid = isValid;
          if (!this.sessionValid) {
            console.log('Session expired.');
            this.router.navigate(['/']);
          }
        });
    } else {
      console.log('No session found.');
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    const creationTime = sessionStorage.getItem('creationTime');
    if (creationTime) {
      const creationTimestamp = parseInt(creationTime, 10);
      this.startTime = Date.now();
      this.expirationTime = this.startTime - creationTimestamp;
      this.updateTimer();
      this.paymentForm = this.fb.group({
        amount: [this.amount, Validators.required],
        method: ['', Validators.required],
      });

      this.checkSessionValidity();
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateTimer() {
    this.timer = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const remaining = this.expirationTime - elapsed;

      if (remaining <= 0) {
        clearInterval(this.timer);
        this.isExpired = true;
        this.timeRemaining = '00:00';
        this.router.navigate(["/"]);
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        this.timeRemaining = `${this.pad(minutes)}:${this.pad(seconds)}`;
      }
    }, 1000);
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  pay() {
    console.log(this.paymentForm.value);
  }
}
