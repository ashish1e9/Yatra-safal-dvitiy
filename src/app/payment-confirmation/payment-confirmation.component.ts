import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightSummary } from 'src/model/flight-summary';
import { Traveller } from 'src/model/traveller';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements OnInit {
  flightScheduleId!: number;
  userId!: number;
  flightClass!: string;
  flightSummary!: FlightSummary;
  flightType!: string;
  travellers!: Traveller[];
  seatCharges: number = 0;
  totalBaseFare: number = 0;
  tax: number = 0;
  total: number = 0;
  method!: string;

  constructor(private router : Router) { }

  percentage(extra: number, base: number): number {
    return (18 * (base + extra)) / 100;
  }

  generateTransactionId(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  ngOnInit(): void {
    if (localStorage.getItem('passengerAssignments') && sessionStorage.getItem("flightSummary") && sessionStorage.getItem("method")) {
      this.travellers = JSON.parse(
        localStorage.getItem('passengerAssignments')!
      );
      console.log('Travellers: ', this.travellers);

      this.flightSummary = JSON.parse(sessionStorage.getItem("flightSummary")!);

      this.flightClass = localStorage.getItem("flightClass")!;
      this.total = parseInt(sessionStorage.getItem("total")!);

      this.tax = this.percentage(
        this.flightSummary.baseFare * this.travellers.length,
        this.seatCharges
      );

      this.method = sessionStorage.getItem("method")!;
    } else {
      console.log('INVALID');
      this.router.navigate(['/']);
    }

  }

}
