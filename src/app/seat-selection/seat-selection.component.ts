import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';


export interface Seat {
  seatId: number;
  seatNo: number;
  cost: string;
  selected?: boolean;
}

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  rows: number = 0; 
  seatsPerRow: number = 6; 
  totalSeats: number = 0;
  seatSelection: Seat[][] = []; 
  selectedSeats: Seat[] = []; 
  hoveredSeat: Seat | null = null;
  isTooltipVisible: boolean = false;
  tooltipStyle: { [key: string]: string } = {};
  flightScheduleId: number = 0;
  noOfPassengers: number = 0;
  

  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.fetchSeatData();
  }

  // ngAfterViewInit(): void {
  //   this.initializeTooltips();
  // }
  

  fetchSeatData() {
    const params = new HttpParams()
      .set('flightScheduleId',localStorage.getItem('flightScheduleId') || '')
      .set('numberOfSeats', localStorage.getItem('noOfSeats') || '')
      .set('flightClass', localStorage.getItem('flightClass') || '');

    this.http.get<any>('http://localhost:8080/flight/fetchFlightStatus', { params })
      .subscribe(response => {
        this.totalSeats = response.totalSeats;
        this.initializeSeats(response.availableSeatDetails);
      });
  }

  initializeSeats(seatDetails: any[]) {
    this.rows = Math.ceil(this.totalSeats / this.seatsPerRow);

    this.seatSelection = Array.from({ length: this.rows }, (_, rowIndex) => 
      Array.from({ length: this.seatsPerRow }, (_, colIndex) => {
        const seatNumber = rowIndex * this.seatsPerRow + colIndex + 1;
        return { seatId: 0, seatNo: seatNumber, cost: '' } as Seat; // Initialize with default values
      })
    );

    seatDetails.forEach(seat => {
      const seatIndex = parseInt(seat.seatNo.replace(/[A-Z]/g, ''), 10) - 1;
      const rowIndex = Math.floor(seatIndex / this.seatsPerRow);
      const colIndex = seatIndex % this.seatsPerRow;

      this.seatSelection[rowIndex][colIndex] = {
        seatId: seat.seatId,
        seatNo: seat.seatNo,
        cost: seat.cost
      };
    });
    setTimeout(this.initializeTooltips,1000);
  }

  getSeatLabel(rowIndex: number, colIndex: number): string {
    return this.seatSelection[rowIndex][colIndex].seatNo.toString(); // Return the seat number for display
  }

  toggleSeatSelection(rowIndex: number, colIndex: number) {
    const seat = this.seatSelection[rowIndex][colIndex];
    const minSeats = parseInt(localStorage.getItem('noOfSeats') || '0', 10); // Minimum seats
    const maxSeats = 10; // Maximum seats
  
    if (seat.cost !== undefined) {
      if (seat.selected) {
        seat.selected = false;
        this.selectedSeats = this.selectedSeats.filter(s => s.seatId !== seat.seatId);
      } else {
        if (this.selectedSeats.length < maxSeats) {
          seat.selected = true;
          this.selectedSeats.push(seat);
  
          // Check if the current selection meets the minimum requirement
          if (this.selectedSeats.length > maxSeats) {
            alert(`You can only select up to ${maxSeats} seats.`);
            seat.selected = false;
            this.selectedSeats = this.selectedSeats.filter(s => s.seatId !== seat.seatId);
          } 
        } else {
          alert(`You can only select up to ${maxSeats} seats.`);
        }
      }
    }
  
  }
  
  

  isSeatAvailable(rowIndex: number, colIndex: number): boolean {
    return this.seatSelection[rowIndex][colIndex].cost !== undefined && !this.seatSelection[rowIndex][colIndex].selected;
  }

  isSeatBooked(rowIndex: number, colIndex: number): boolean {
    return this.seatSelection[rowIndex][colIndex].cost === undefined || this.seatSelection[rowIndex][colIndex].cost === '';
  }
  
  initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    console.log(tooltipTriggerList)
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }


  getSelectedSeats(): Seat[] {
    return this.selectedSeats;
  }

  submitSelection() {
    const minSeats = parseInt(localStorage.getItem('noOfSeats') || '0', 10);
    
    if (this.selectedSeats.length < minSeats) {
      alert(`You must select at least ${minSeats} seats.`);
      return;
    }
  
    localStorage.setItem('selectedSeats', JSON.stringify(this.selectedSeats));
    this.router.navigate(['/seat/addPassenger']);
    console.log('Selected Seats:', this.selectedSeats);
  }
  
}
