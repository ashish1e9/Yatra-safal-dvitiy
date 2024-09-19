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

  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.fetchSeatData();
  }

  // ngAfterViewInit(): void {
  //   this.initializeTooltips();
  // }
  

  fetchSeatData() {
    const params = new HttpParams()
      .set('flightScheduleId', '10')
      .set('numberOfSeats', '2')
      .set('flightClass', 'ECONOMY');

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
    if (seat.cost !== undefined) {
      seat.selected = !seat.selected;
      if (seat.selected) {
        this.selectedSeats.push(seat);
      } else {
        this.selectedSeats = this.selectedSeats.filter(s => s.seatId !== seat.seatId);
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

  // showTooltip(rowIndex: number, colIndex: number) {
  //   const seat = this.seatSelection[rowIndex][colIndex];
  //   if (seat.cost) {
  //     this.isTooltipVisible = true;
  //     this.tooltipStyle = {
  //       position: 'absolute',
  //       bottom: '100%', // Position it above the seat
  //       left: '50%',
  //       transform: 'translateX(-50%)',
  //       backgroundColor: '#333',
  //       color: '#fff',
  //       padding: '5px',
  //       borderRadius: '4px',
  //       whiteSpace: 'nowrap',
  //       fontSize: '12px',
  //     };
  //   }
  // }

  // hideTooltip() {
  //   this.isTooltipVisible = false;
  // }

  getSelectedSeats(): Seat[] {
    return this.selectedSeats;
  }

  submitSelection() {
    const selectedSeats = this.getSelectedSeats();
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    this.router.navigate(['/seat/addPassenger'])
    console.log('Selected Seats:', selectedSeats);
  }
}
