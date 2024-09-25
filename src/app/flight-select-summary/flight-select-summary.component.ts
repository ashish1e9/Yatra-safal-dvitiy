import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Flight, FlightView } from 'src/model/flight-summary';
import { FlightService } from 'src/service/FlightService';

@Component({
  selector: 'flight-select-summary',
  templateUrl: './flight-select-summary.component.html',
  styleUrls: ['./flight-select-summary.component.css']
})
export class FlightSelectSummaryComponent implements OnInit {
  selectedOneWayFlight!:FlightView;
  selectedReturnFlight!:FlightView|null;
  ifBusiness:boolean=false;

  constructor(private flightService: FlightService,private router: Router) { 

  }

  ngOnInit(): void {

    
    this.selectedOneWayFlight = this.flightService.getSelectedOneWayFlight();
    console.log(this.selectedOneWayFlight); 
    this.selectedReturnFlight = this.flightService.getReturnFlight();
    console.log(this.selectedReturnFlight); 
    this.ifBusiness=localStorage.getItem('flightClass')==='BUSINESS'?true:false;


    
  }
  handleBooking() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/seat']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
