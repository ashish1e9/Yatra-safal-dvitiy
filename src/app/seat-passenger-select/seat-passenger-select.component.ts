import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';



export interface Seat {
  seatId: number;
  seatNo: string;
  cost: string;
  selected?: boolean;
}

export interface Passenger {
  passengerId: number;
  firstName: string;
  lastName: string;
  passportNo: string;
  email?: string;
  gender: string;
}

@Component({
  selector: 'app-seat-passenger-select',
  templateUrl: './seat-passenger-select.component.html',
  styleUrls: ['./seat-passenger-select.component.css']
})

export class SeatPassengerSelectComponent implements OnInit, AfterViewInit {
  rows: number = 0; 
  seatsPerRow: number = 6; 
  totalSeats: number = 0;
  seatSelection: Seat[][] = []; 
  selectedSeats: Seat[] = []; 
  passengers: Passenger[] = [];
  newPassenger: Passenger = { passengerId: 0, firstName: '', lastName: '', passportNo: '', email: '', gender: '' };
  passengerSelections: { [key: number]: Seat } = {};
  seatAssignments: { [seatId: number]: Passenger } = {};
  selectedPassenger: Passenger | null = null;
  isPassengerDisabled: boolean = true; 
  isSeatDisabled: boolean = false;


  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.fetchSeatData();
    this.fetchPassengers();
  }

  ngAfterViewInit(): void {
  }

  fetchSeatData() {
    const params = new HttpParams()
      .set('flightScheduleId', localStorage.getItem('flightScheduleId') || '')
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
        return { seatId: 0, seatNo: seatNumber.toString(), cost: '' } as Seat; 
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
  }

  fetchPassengers() {
    this.http.get<Passenger[]>('http://localhost:8080/user/getPassenger?userId=' + localStorage.getItem('userId'))
      .subscribe(response => {
        this.passengers = response;
      });
  }

  getSeatLabel(rowIndex: number, colIndex: number): string {
    return this.seatSelection[rowIndex][colIndex].seatNo.toString();
  }

  toggleSeatSelection(rowIndex: number, colIndex: number) {
    const seat = this.seatSelection[rowIndex][colIndex];
    const maxSeats = parseInt(localStorage.getItem('noOfSeats') || '0', 10); 

    if (seat.cost !== "") {
      if (seat.selected) {
        seat.selected = false;
        this.selectedSeats = this.selectedSeats.filter(s => s.seatId !== seat.seatId);
        const assignedPassengerId = Object.keys(this.passengerSelections).find(passengerId => {
          return this.passengerSelections[parseInt(passengerId)].seatId == seat.seatId;
        });
        if (assignedPassengerId) {
          delete this.passengerSelections[parseInt(assignedPassengerId, 10)];
          delete this.seatAssignments[seat.seatId];
        }
      } else {
        if (this.selectedSeats.length < maxSeats) {
          seat.selected = true;
          this.selectedSeats.push(seat);
          this.isPassengerDisabled = false;
          this.isSeatDisabled = true;
        } else {
          alert(`You can only select up to ${maxSeats} seats.`);
        }
      }
    }
  }

  isSeatAvailable(rowIndex: number, colIndex: number): boolean {
    return this.seatSelection[rowIndex][colIndex].cost !== "" && !this.seatSelection[rowIndex][colIndex].selected;
  }

  isSeatBooked(rowIndex: number, colIndex: number): boolean {
    return this.seatSelection[rowIndex][colIndex].cost === "";
  }



  selectPassenger(passenger: Passenger) {
    if (this.passengerSelections[passenger.passengerId]) {
      this.selectedPassenger = null; 
    } else {
      this.selectedPassenger = passenger;
    }
  
    if (this.selectedPassenger && this.selectedSeats.length > 0) {
      const lastSelectedSeat = this.selectedSeats[this.selectedSeats.length - 1];
      this.assignSeatToPassenger(lastSelectedSeat);
      this.isPassengerDisabled = true;
      this.isSeatDisabled = false;
    }
  }
  
  addNewPassenger() {
    alert('New passenger added!');
    const passengerData = {
      gender: this.newPassenger.gender.toUpperCase(),
      firstName: this.newPassenger.firstName,
      lastName: this.newPassenger.lastName,
      email: this.newPassenger.email,
      passportNo: this.newPassenger.passportNo,
      userId: 1 // Hardcoded user ID
    };
  
    this.http.post<number>('http://localhost:8080/user/addPassenger', passengerData).subscribe(passengerId => {
      // Create a new passenger object using the returned passengerId
      const newPassenger: Passenger = {
        passengerId: passengerId, // Use the returned ID
        firstName: this.newPassenger.firstName,
        lastName: this.newPassenger.lastName,
        passportNo: this.newPassenger.passportNo,
        email: this.newPassenger.email,
        gender: this.newPassenger.gender
      };
  
      this.passengers.push(newPassenger);
  
      if (this.passengerSelections[newPassenger.passengerId]) {
        const assignedSeat = this.passengerSelections[newPassenger.passengerId];
        this.seatAssignments[assignedSeat.seatId] = newPassenger; // Assign the seat to the new passenger
      }
  
      this.newPassenger = { passengerId: 0, firstName: '', lastName: '', passportNo: '', email: '', gender: '' }; // Reset form
    }, error => {
      console.error('Error adding passenger', error);
    });
  }
  assignSeatToPassenger(seat: Seat) {
    if (this.selectedPassenger) {
      if (this.seatAssignments[seat.seatId]) {
        alert('This seat is already assigned to another passenger.');
        return;
      }
  
      // Assign the seat to the selected passenger
      this.passengerSelections[this.selectedPassenger.passengerId] = seat;
      this.seatAssignments[seat.seatId] = this.selectedPassenger;
      this.selectedPassenger = null;
      console.log(this.selectedSeats)
      // seat.selected = false;
    }
  }

  saveAssignments() {
    const selectedSeats = this.selectedSeats;
    const minSeats = parseInt(localStorage.getItem('noOfSeats') || '0');
    if (selectedSeats.length < minSeats) {
      alert("You must select " + minSeats + " seats.");
      return;
    }
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    const assignments = Object.keys(this.passengerSelections).map(key => {
      const seat = this.passengerSelections[parseInt(key, 10)];
      const passenger = this.passengers.find(p => p.passengerId === parseInt(key, 10)); 
      return {
        passengerId: passenger ? passenger.passengerId : 0, 
        firstName: passenger ? passenger.firstName : '', 
        lastName: passenger ? passenger.lastName : '',
        email: passenger ? passenger.email : '',
        gender: passenger ? passenger.gender : '',
        seat: seat 
      };
    });
    if (assignments.length<minSeats){
      alert("You must select " + minSeats + " passengers.");
      return;
    }
    localStorage.setItem('passengerAssignments', JSON.stringify(assignments));
    this.router.navigate(['/booking/summary']);
  }

  allSeatsAssigned(): boolean {
    console.log(this.selectedSeats.length);
    console.log(parseInt(localStorage.getItem('noOfSeats')||''))
    return this.selectedSeats.length>=parseInt(localStorage.getItem('noOfSeats')||'');
  }

  resetSelections() {
    this.newPassenger = { passengerId: 0, firstName: '', lastName: '', passportNo: '', email: '', gender: '' };
    this.selectedPassenger = null;
    this.passengerSelections = {};
    this.seatAssignments = {};
    this.fetchPassengers(); 
  }

  submitSelection() {

  }
}

