import { Component, OnInit } from '@angular/core';
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

  constructor(private flightService: FlightService) { 

  }

  ngOnInit(): void {

    
    this.selectedOneWayFlight = this.flightService.getSelectedOneWayFlight();
    console.log(this.selectedOneWayFlight); 
    this.selectedReturnFlight = this.flightService.getReturnFlight();
    console.log(this.selectedReturnFlight); 
  }

}
