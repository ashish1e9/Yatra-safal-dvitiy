import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Traveller } from 'src/model/traveller';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  amount!: number;
  method!: string;
  userId: number = 1;
  timeRemaining: string = '00:00';
  timer: any;
  expirationTime!: number;
  startTime!: number;
  sessionDuration!: number;
  isExpired: boolean = false;

  travellers!: Traveller[];

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
    const sessionId = sessionStorage.getItem('creationTime');
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
    
    if (creationTime && sessionStorage.getItem("total")) {
      this.amount = parseInt(sessionStorage.getItem("total")!);
      const creationTimestamp = new Date(creationTime).getTime(); 
      this.startTime = Date.now();
      this.sessionDuration = 300000;
      this.expirationTime = creationTimestamp + this.sessionDuration;
      console.log("exptime", this.expirationTime);
      this.updateTimer();
      this.paymentForm = this.fb.group({
        amount: [this.amount, Validators.required],
        method: ['', Validators.required],
      });


      this.checkSessionValidity(); 
    }
    else{
      console.log("Here1")
      this.router.navigate(["/"]);
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // updateTimer() {
  //   this.timer = setInterval(() => {
  //     const elapsed = Date.now() - this.startTime;
  //     const remaining = this.expirationTime - elapsed;

  //     if (remaining <= 0) {
  //       clearInterval(this.timer);
  //       this.isExpired = true;
  //       this.timeRemaining = '00:00';
  //       this.router.navigate(["/"]);
  //     } else {
  //       const minutes = Math.floor(remaining / 60000);
  //       const seconds = Math.floor((remaining % 60000) / 1000);
  //       this.timeRemaining = `${this.pad(minutes)}:${this.pad(seconds)}`;
  //     }
  //   }, 1000);
  // }

  updateTimer() {
    this.timer = setInterval(() => {
      const remaining = this.expirationTime - Date.now(); 
      console.log("Remaining", remaining)

      if (remaining <= 0) {
        clearInterval(this.timer);
        this.isExpired = true;
        this.timeRemaining = '00:00';
        console.log("Here2")
        this.router.navigate(["/"]);
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        this.timeRemaining = `${this.pad(minutes)}:${this.pad(seconds)}`;
      }
    }, 1000);
  }

  // Helper function to pad single-digit numbers
  pad(num: any) {
    return num < 10 ? `0${num}` : num;
  }

  pay() {
    const passengers: any[] = [];
    if (localStorage.getItem('passengerAssignments')) {
      this.travellers = JSON.parse(
        localStorage.getItem('passengerAssignments')!
      );
      console.log('Travellers: ', this.travellers);
    } else {
      console.log('INVALID');
      this.router.navigate(['/']);
    }

    this.travellers.map((tr) => {
      passengers.push({
        passengerId: tr.passengerId,
        seatId: tr.seat.seatId,
      });
    });

    const paymentData = {
      amount: this.paymentForm.value.amount,
      method: this.paymentForm.value.method,
      bookingId: sessionStorage.getItem('bookingId'),
      passengers: passengers,
    };

    console.log(this.paymentForm.value);

    console.log('payment', paymentData);

    let url = 'http://localhost:8080/payment';
    this.http.post(url, paymentData).subscribe((response: any) => {
      console.log(response);
      if (response?.status) {
        sessionStorage.removeItem("creationTime")
        sessionStorage.removeItem("total")
        alert('Payment Successful');
      } else {
        alert('Payment Failed');
      }
    });
  }
}
