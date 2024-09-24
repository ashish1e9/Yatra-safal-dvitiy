import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BookingData } from 'src/model/booking-data';
import { CancelledTicket } from 'src/model/cancelled-ticket';
import { FlightSummary } from 'src/model/flight-summary';
import { Gender } from 'src/model/gender-enum';
import { Passenger, Traveller } from 'src/model/traveller';

@Component({
  selector: 'app-cancel-confirmation',
  templateUrl: './cancel-confirmation.component.html',
  styleUrls: ['./cancel-confirmation.component.css'],
})
export class CancelConfirmationComponent implements OnInit {
  bookingData!: BookingData;
  flightScheduleId!: number;
  userId!: number;
  ticketId!: number;
  seatId!: number;
  flightClass!: string;
  flightSummary!: FlightSummary[];
  flightType!: string;
  traveller!: Passenger;
  seatCharges: number = 0;
  totalBaseFare: number = 0;
  total: number = 0;
  tax: number = 0;
  refund: number = 0;
  isLoaded: boolean = false;
  refundPercent: number = 0;
  cancelledTicket?: CancelledTicket;

  constructor(private http: HttpClient, private router: Router) {}

  parseTime(timeString: string): Time {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  percentage(base: number, extra: number): number {
    return (18 * (base + extra)) / 100;
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

  cancel() {

    this.cancelledTicket = new CancelledTicket();
    this.cancelledTicket.ticketId = this.ticketId;
    this.cancelledTicket.seatId = this.seatId;
    this.cancelledTicket.cancellationDate = new Date();
    this.cancelledTicket.refundAmount = this.refund;

    this.http.post<CancelledTicket>(`http://localhost:8080/mytrips/cancel`, this.cancelledTicket).subscribe(
        (data) => {
          console.log("cancelled-ticket : ", data);
          // this.upcomingBooking = this.upcomingBooking.map(booking => {
          //   booking.bookingHistory = booking.bookingHistory.filter(history => history.ticketId !== ticketId);
          //   return booking;
          // }).filter(booking => booking.bookingHistory.length > 0);    
          // console.log("upcomingBooking", this.upcomingBooking);
          alert("Ticket cancelled successfully! A refund will be credited to your account within 7 working days.");
          sessionStorage.removeItem("seatId");
          sessionStorage.removeItem("ticketId");
          sessionStorage.removeItem("seatNo");
          this.router.navigate(["/mytrips"])
        }
      )
  }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId')!);
    this.flightScheduleId = parseInt(sessionStorage.getItem('flightScheduleId')!);
    this.flightClass = localStorage.getItem('flightClass')!;
    this.ticketId = parseInt(sessionStorage.getItem('ticketId')!);
    this.seatId = parseInt(sessionStorage.getItem('seatId')!);

    if (this.ticketId && this.seatId && this.flightScheduleId) {
      let url = `http://localhost:8080/flight/summary?flightScheduleId=${this.flightScheduleId}&flightClass=${this.flightClass}`;
      this.http.get<FlightSummary[]>(url).subscribe(async (response) => {
        console.log(response);

        const cost = await firstValueFrom(
          this.http.get<number>(
            `http://localhost:8080/flight/cost?seatId=${this.seatId}`
          )
        );
        this.seatCharges = cost;

        console.log('HERE');
        this.flightSummary = response;

        this.tax = this.percentage(
          this.flightSummary[0].baseFare,
          this.seatCharges
        );

        this.total =
          this.seatCharges + this.flightSummary[0].baseFare + this.tax;

          const scheduleDay = new Date(this.flightSummary[0].scheduleDay);
          const currentDate = new Date();
          const normalizedScheduleDay = new Date(scheduleDay.setHours(0, 0, 0, 0));
          const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
      
          // Calculate difference in days
          const diffTime = normalizedScheduleDay.getTime() - normalizedCurrentDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
          console.log(normalizedCurrentDate, normalizedScheduleDay, diffDays);
      
          if (diffDays >= 7) {
            this.refundPercent = 100;
          } else if (diffDays >= 3) {
            this.refundPercent = 50;
          } else {
            this.refundPercent = 0;
          }

        this.refund = this.total * this.refundPercent / 100;

        this.http
          .get<any>(
            `http://localhost:8080/ticket/passenger?ticketId=${this.ticketId}`
          )
          .subscribe((res) => {
            console.log("RES", res);
            this.traveller = {
              email: res?.email,
              firstName: res?.firstName,
              lastName: res?.lastName,
              gender: res?.gender,
              seatNo: sessionStorage.getItem('seatNo')!

            }
            console.log('traveller', this.traveller);
            this.isLoaded = true;
          });
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
