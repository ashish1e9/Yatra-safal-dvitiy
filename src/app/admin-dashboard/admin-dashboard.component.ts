import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  flightData!: any[];
  constructor() { }

  ngOnInit(): void {
    this.flightData = [{
      flightId: 1,
      flightNo: "S204",
      totalSeats: 300,
      baseFare: 4000,
      sourceCity: "Mumbai",
      destinationCity: "Delhi",
      fromDate: "2024-09-12",
      toDate: "2024-09-20",
      departureTime: "12:30",
      arrivalTime: "16:30",
      status: "ontime" 
    }, {
      flightId: 2,
      flightNo: "P205",
      totalSeats: 90,
      baseFare: 2000,
      sourceCity: "Mumbai",
      destinationCity: "Pune",
      fromDate: "2024-09-12",
      toDate: "2024-09-20",
      departureTime: "12:30",
      arrivalTime: "16:30",
      status: "ontime" 
    }];
  }

  

}

