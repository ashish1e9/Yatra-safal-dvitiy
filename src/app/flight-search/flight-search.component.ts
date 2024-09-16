import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {

  constructor() { }
  source: string = '';
  destination: string = '';
  date: string = '';
  passengers: number = 1;
  ngOnInit(): void {
  }

}
