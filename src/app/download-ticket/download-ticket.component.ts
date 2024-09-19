import { Component, Input, OnInit } from '@angular/core';
import { BookingHistory } from 'src/model/booking-history';
import { BookingHistoryCard } from 'src/model/booking-history-card';

@Component({
  selector: 'download-ticket',
  templateUrl: './download-ticket.component.html',
  styleUrls: ['./download-ticket.component.css']
})
export class DownloadTicketComponent implements OnInit {

  constructor() { }

  @Input() card!: BookingHistoryCard;
  @Input() history!: BookingHistory;

  ngOnInit(): void {
    console.log("download-ticket component : ", this.card);
  }

}
