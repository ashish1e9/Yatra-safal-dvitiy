import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Passenger {
  passengerId: number;
  firstName: string;
  lastName: string;
  passportNo: string;
  email?: string; // Optional fields
  gender: string; // Optional fields
  seat?: Seat; // Optional in case seat is not yet assigned
}

interface Seat {
  seatId: number;
  seatNo: string;
  cost: number;
  selected: boolean;
}

@Component({
  selector: 'app-select-passenger',
  templateUrl: './select-passenger.component.html',
  styleUrls: ['./select-passenger.component.css']
})
export class SelectPassengerComponent implements OnInit {
  passengers: Passenger[] = [];
  newPassenger: Passenger = { passengerId: 0, firstName: '', lastName: '', passportNo: '', email: '', gender: '' };
  selectedSeats: Seat[] = [];
  passengerSelections: { [key: number]: Seat } = {};
  seatAssignments: { [seatId: number]: Passenger } = {};
  selectedPassenger: Passenger | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchPassengers();
    this.fetchSeatsFromLocalStorage();
  }

  fetchPassengers() {
    this.http.get<Passenger[]>('http://localhost:8080/user/getPassenger?userId=1').subscribe(response => {
      this.passengers = response;
      console.log(this.passengers);
    });
  }

  fetchSeatsFromLocalStorage() {
    const seats = localStorage.getItem('selectedSeats');
    if (seats) {
      this.selectedSeats = JSON.parse(seats);
    }
  }

  selectPassenger(passenger: Passenger) {
    if (this.passengerSelections[passenger.passengerId] || this.selectedPassenger === passenger) {
      this.selectedPassenger = null; // Deselect passenger if already selected or if seat is already assigned
      return;
    }
    this.selectedPassenger = passenger;
    // Show seat assignment section if passenger is selected
    document.getElementById('seatAssignment')?.classList.remove('d-none');
  }

  assignSeatToPassenger(seat: Seat) {
    if (this.selectedPassenger) {
      if (this.seatAssignments[seat.seatId]) {
        alert('This seat is already assigned to another passenger.');
        return;
      }

      this.passengerSelections[this.selectedPassenger.passengerId] = seat;
      this.seatAssignments[seat.seatId] = this.selectedPassenger;
      this.selectedPassenger = null;

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
  

  saveAssignments() {
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
  
    localStorage.setItem('passengerAssignments', JSON.stringify(assignments));
    this.router.navigate(['/booking/summary'])
  }
  
  
  allSeatsAssigned(): boolean {
    // Check if all selected seats have been assigned to a passenger
    return this.selectedSeats.every(seat => this.seatAssignments[seat.seatId] !== undefined);
  }

  resetSelections() {
    this.newPassenger = { passengerId: 0, firstName: '', lastName: '', passportNo: '', email: '', gender: '' };
    
    this.selectedPassenger = null;
    
    this.passengerSelections = {};
    this.seatAssignments = {};
    
    
    this.fetchPassengers(); 
  }
  
}

