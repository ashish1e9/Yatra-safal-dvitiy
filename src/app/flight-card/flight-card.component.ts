import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css']
})
export class FlightCardComponent implements OnInit {

  constructor() {    this.flightDetails.push(
    new FlightDetails('VE-123', 'Air India', 'Delhi', 'Mumbai', '10:00 AM', '12:00 PM', '2 Hours', 'Rs. 5000'),
    new FlightDetails('VE-124', 'IndiGo', 'Delhi', 'Bangalore', '11:00 AM', '1:00 PM', '2 Hours', 'Rs. 6000'),
    new FlightDetails('VE-125', 'SpiceJet', 'Mumbai', 'Kolkata', '9:00 AM', '11:30 AM', '2.5 Hours', 'Rs. 5500')
  ); }

  flightDetails: FlightDetails[] = [];

  ngOnInit(): void {
  }

}

class FlightDetails {
  flightNo: string;
  flightName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: string;

  constructor(
    flightNo: string,
    flightName: string,
    from: string,
    to: string,
    departureTime: string,
    arrivalTime: string,
    duration: string,
    price: string
  ) {
    this.flightNo = flightNo;
    this.flightName = flightName;
    this.from = from;
    this.to = to;
    this.departureTime = departureTime;
    this.arrivalTime = arrivalTime;
    this.duration = duration;
    this.price = price;
  }
}