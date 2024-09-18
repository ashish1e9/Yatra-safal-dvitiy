import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BookingHistory } from 'src/model/booking-history';
import { BookingHistoryCard } from 'src/model/booking-history-card';
import { CancelledTicket } from 'src/model/cancelled-ticket';

@Component({
  selector: 'my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.css']
})
export class MyTripsComponent implements OnInit {

  bookingHistoryCard: BookingHistoryCard[] = [];
 
  cancelledTicket?: CancelledTicket;

  user: number = 1;
  url: string = `http://localhost:8080/mytrips?userId=${this.user}`;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<BookingHistoryCard[]>(this.url).subscribe(
      (data) => {
        console.log(data);
        this.bookingHistoryCard = data;
    });
  }

  cancelBooking(ticketId: number) {
    console.log(ticketId);
    this.cancelledTicket = new CancelledTicket();
    this.cancelledTicket.ticketId = ticketId;
    this.cancelledTicket.cancellationDate = new Date();

    
    if (confirm("Are you sure you want to cancel this ticket?")) {
      this.http.post<CancelledTicket>(`http://localhost:8080/mytrips/cancel?ticketId=${ticketId}`, this.cancelledTicket).subscribe(
        (data) => {
          console.log("cancelled-ticket : ", data);
          this.ngOnInit();
        }
      )
    }
  }
}
