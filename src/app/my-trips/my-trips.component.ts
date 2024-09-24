import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BookingHistory } from 'src/model/booking-history';
import { BookingHistoryCard } from 'src/model/booking-history-card';
import { CancelledTicket } from 'src/model/cancelled-ticket';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';

@Component({
  selector: 'my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.css'],
})
export class MyTripsComponent implements OnInit {
  bookingHistoryCard: BookingHistoryCard[] = [];

  previousBooking: BookingHistoryCard[] = [];
  upcomingBooking: BookingHistoryCard[] = [];

  selectedCard: BookingHistoryCard | null = null;

  cancelledTicket?: CancelledTicket;

  user: number = parseInt(localStorage.getItem('userId') || '0');
  url: string = `http://localhost:8080/mytrips?userId=${this.user}`;

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<BookingHistoryCard[]>(this.url).subscribe((data) => {
      console.log(data);
      this.bookingHistoryCard = data;

      this.bookingHistoryCard.forEach((card) => {
        console.log('CARD', card);
        if (new Date(card.scheduleDay) < new Date()) {
          this.previousBooking.push(card);
        } else {
          this.upcomingBooking.push(card);
        }
      });
    });
  }

  toggleCollapse(bookingId: number) {
    console.log('Toggling collapse for:', bookingId);
  }

  openModal(card: BookingHistoryCard) {
    this.selectedCard = card;
  }

  closeModal() {
    this.selectedCard = null;
  }

  downloadAsPDF(bookingId: number | undefined) {
    const bookingElement = document.querySelector('.modal-body');
    const noPrintElements = document.querySelectorAll('.no-print');

    // Hide all no-print elements before generating the PDF
    noPrintElements.forEach(
      (el) => ((el as HTMLElement).style.display = 'none')
    );

    if (bookingElement) {
      html2canvas(bookingElement as HTMLElement).then((canvas) => {
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`BoardingPass_${bookingId}.pdf`);

        // Restore the visibility of no-print elements after generating the PDF
        noPrintElements.forEach(
          (el) => ((el as HTMLElement).style.display = '')
        );
      });
    }
  }

  cancelBooking(
    ticketId: number,
    seatId: number,
    seatNo: string,
    flightScheduleId: number
  ) {
    console.log(ticketId);
    

    sessionStorage.setItem('flightScheduleId', flightScheduleId.toString());
    sessionStorage.setItem('ticketId', ticketId.toString());
    sessionStorage.setItem('seatId', seatId.toString());
    sessionStorage.setItem('seatNo', seatNo);
    this.router.navigate(['/cancellation/summary']);
  }
}
