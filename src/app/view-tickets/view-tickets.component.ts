import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BookingHistoryCard } from 'src/model/booking-history-card';

@Component({
  selector: 'app-view-tickets',
  templateUrl: './view-tickets.component.html',
  styleUrls: ['./view-tickets.component.css']
})
export class ViewTicketsComponent implements OnInit {

  bookingHistoryCard: BookingHistoryCard[] = [];
  card!: BookingHistoryCard[];
  url!: string;
  user!: number;

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  constructor(private http: HttpClient, private router : Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("userId") && sessionStorage.getItem("bookingId")){
      this.user = parseInt(localStorage.getItem("userId")!);
      this.url = `http://localhost:8080/mytrips?userId=${this.user}`;

      this.http.get<BookingHistoryCard[]>(this.url).subscribe(
        (data) => {
          console.log(data);
          this.bookingHistoryCard = data;

          this.card = this.bookingHistoryCard.filter((card) => card.bookingId === parseInt(sessionStorage.getItem("bookingId")!));
        });
    }
    else{
      this.router.navigate(["/"])
    }
   
  }

  downloadAsPDF(bookingId: number | undefined) {
    const bookingElement = document.querySelector('.modal-body');
    const noPrintElements = document.querySelectorAll('.no-print');
  
    // Hide all no-print elements before generating the PDF
    noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');
  
    if (bookingElement) {
      html2canvas(bookingElement as HTMLElement).then(canvas => {
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
  
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`BoardingPass_${bookingId}.pdf`);
  
        // Restore the visibility of no-print elements after generating the PDF
        noPrintElements.forEach(el => (el as HTMLElement).style.display = '');
      });
    }
  }
  

}
