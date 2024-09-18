import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FlightClass } from 'src/model/flight-class-enum';
import { FlightSummary } from 'src/model/flight-summary';
import { Gender } from 'src/model/gender-enum';
import { Traveller } from 'src/model/traveller';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.css'],
})
export class BookingSummaryComponent implements OnInit {
  flightScheduleId : number = 2;
  flightClass: string = "ECONOMY";
  flightSummary!: FlightSummary[];
  flightType!: string;
  travellers!: Traveller[];
  seatCharges: number = 0;
  totalBaseFare : number = 0;
  tax: number = 0;
  total: number = 0;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  parseTime(timeString: string): Time {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  percentage(extra: number, base:number) : number {
    return (18*(base + extra)) / 100;
 } 
 

  // formatTime(hours: number, minutes: number): string {
  //   // Pad hours and minutes with leading zeros if needed
  //   const formattedHours = hours.toString().padStart(2, '0');
  //   const formattedMinutes = minutes.toString().padStart(2, '0');
  //   return `${hours}:${minutes}`;
  // }


  genderToString(gender: Gender): string {
    return Gender[gender][0];
  }

  ngOnInit(): void {

    let url = `http://localhost:8080/flight/summary?flightScheduleId=${this.flightScheduleId}&flightClass=${this.flightClass}`;
    this.http.get<FlightSummary[]>(url).subscribe((response) => {
      console.log(response);
      this.flightSummary = response;
      this.tax = this.percentage(this.flightSummary[0].baseFare, this.seatCharges);

    this.total += this.tax + this.seatCharges + this.flightSummary[0].baseFare;
    });

    this.travellers = [
      {
        passengerId: 1,
        userId: 1,
        firstName: 'a',
        lastName: 'b',
        email: 'ab@gmail.com',
        gender: Gender.MALE,
        passportNo: 'ab12',
        seat: {
          seatId: 225,
          seatNo: 'A1',
          flightScheduleId: 1,
          cost: 500,
          class: FlightClass.ECONOMY,
        },
      },
      {
        passengerId: 2,
        userId: 1,
        firstName: 'c',
        lastName: 'd',
        email: 'cd@gmail.com',
        gender: Gender.MALE,
        passportNo: 'cd12',
        seat: {
          seatId: 226,
          seatNo: 'A2',
          flightScheduleId: 1,
          cost: 0,
          class: FlightClass.ECONOMY,
        },
      },
    ];

    this.travellers.map((tr) => {
      this.http.get<number>(`http://localhost:8080/flight/cost?seatId=${tr.seat.seatId}`).subscribe((cost) => this.seatCharges += cost  );
    });

    
    
  }
}
