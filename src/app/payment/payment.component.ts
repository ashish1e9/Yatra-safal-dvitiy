import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  amount: number = 5310;
  method!: string;
  timeRemaining: string = '00:00';
  timer: any;
  expirationTime: number = 5 * 60 * 1000; // 5 minutes in milliseconds
  startTime!: number;
  isExpired: boolean = false;

  paymentForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.startTime = Date.now();
    this.updateTimer();
    this.paymentForm = this.fb.group({
      amount: [this.amount, Validators.required],
      method: ['', Validators.required]
    })
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
