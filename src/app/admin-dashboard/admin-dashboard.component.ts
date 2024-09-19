import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Schedule {
  id: number;
  arrivalTime: string;
  departureTime: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  flightData: any[] = [];
  selectedFlight: any = null;
  selectedSchedule: Schedule[] = []; 

  flights: any[] = [];
  filteredFlights: any[] = [];
  searchTerm: any

  searchForm!: FormGroup;
  editFlightForm: FormGroup;
  editScheduleForm: FormGroup;
  private apiUrl = 'http://localhost:8080/admin'; 
  private adminId = 2; 

  filteredSchedules: Schedule[] = [];
  scheduleFilterForm: FormGroup;

  cancelScheduleForm: FormGroup;
  cancelResponse: { success: boolean, message: string, noOfSchedules?: number } | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.editFlightForm = this.fb.group({
      arrivalTime: ['', Validators.required],
      departureTime: ['', Validators.required],
      economyBaseFare: ['', Validators.required],
      businessBaseFare: ['', Validators.required]
    });

    this.editScheduleForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      arrivalTime: ['', Validators.required],
      departureTime: ['', Validators.required]
    });

    this.scheduleFilterForm = this.fb.group({
      fromDate: [''],
      toDate: ['']
    });

    this.cancelScheduleForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadFlights(this.adminId);
  }

  loadFlights(adminId: number): void {
    this.http.get<any[]>(`${this.apiUrl}/flights/${adminId}`).subscribe(
      (response) => {
        this.flightData = response;
        this.filteredFlights = response;
        this.flights = response;
        console.log(this.flightData);
      }
    );
  }
  
  searchFlights(): void {
    console.log(this.searchForm.value.searchTerm);
    if (this.searchForm.value.searchTerm.trim() === '') {
      this.filteredFlights = this.flights;
    } else {
      this.filteredFlights = this.flights.filter(flight => 
        flight.flightNo.toLowerCase().includes(this.searchForm.value.searchTerm.toLowerCase())
      );
    }
  }

  editFlight(flightId: number): void {
    this.http.get<any>(`${this.apiUrl}/flight/${flightId}`).subscribe(
      (response) => {
        this.selectedFlight = response;
        this.editFlightForm.patchValue({
          arrivalTime: response.arrivalTime,
          departureTime: response.departureTime,
          economyBaseFare: response.economyBaseFare,
          businessBaseFare: response.businessBaseFare
        });
      }
    );
  }
/////////////////////////////////////////////////////////////////////////////////////
  filterSchedules(): void {
    const fromDateStr = this.scheduleFilterForm.value.fromDate;
    const toDateStr = this.scheduleFilterForm.value.toDate;

    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      console.error('Invalid date value');
      this.filteredSchedules = this.selectedSchedule; 
      return;
    }

    for(let i=0;i<this.selectedSchedule.length;i++){
      const scheduleDate = new Date(this.selectedSchedule[i].departureTime);
      if (scheduleDate >= fromDate && scheduleDate <= toDate) {
        this.filteredSchedules.push(this.selectedSchedule[i]);
      }
    }
    console.log(this.filteredSchedules);
  }
////////////////////////////////////////////////////////////////////////////////////////

  updateFlightDetails(): void {
    if (this.editFlightForm.valid && this.selectedFlight) {
      const updatedFlightDetails = this.editFlightForm.value; 
      updatedFlightDetails.flightId = this.selectedFlight.id;
      this.http.post<any>(`${this.apiUrl}/edit/flight`, updatedFlightDetails).subscribe(
        (response) => {
          console.log(response);
        }
      );
    }
  }

  loadSchedules(flightId: number): void {
    this.http.get<Schedule[]>(`${this.apiUrl}/schedules/${flightId}`).subscribe(
      (response) => {
        this.selectedFlight = { flightId };
        this.selectedSchedule = response;
        //this.filteredSchedules = response; 
        console.log(this.selectedSchedule);
      }
    );
  }

  editSchedulesBetweenDates(flightId: number): void {
    this.http.get<Schedule[]>(`${this.apiUrl}/schedules/${flightId}`).subscribe(
      (response) => {
        this.selectedFlight = { flightId };
        this.selectedSchedule = response;
        console.log(this.selectedSchedule);
      }
    );
  }

  editSchedule(flightId: number): void {
    this.http.get<Schedule[]>(`${this.apiUrl}/schedules/${flightId}`).subscribe(
      (response) => {
        this.selectedFlight = { flightId };
        this.selectedSchedule = response;
        console.log(this.selectedSchedule);
      }
    );
  }

  updateScheduleDetails(): void {
    if (this.editScheduleForm.valid && this.selectedFlight) {
      const updatedScheduleDetails= this.editScheduleForm.value;
      const fId = this.selectedFlight.flightId;
      const arrivalTime = this.editScheduleForm.value.arrivalTime;
      const departureTime = this.editScheduleForm.value.departureTime;
      const fromDate = this.editScheduleForm.value.fromDate;
      const toDate = this.editScheduleForm.value.toDate;
      this.http.get<any>(`http://localhost:8080/admin/edit/schedule?flightId=${fId}&fromDate=${fromDate}&toDate=${toDate}&arrivalTime=${arrivalTime}:00&departureTime=${departureTime}`).subscribe(
        (response) => {
        
          console.log(response);
        }
      );

    }
  }


  cancelSchedule(): void {
    if (this.cancelScheduleForm.valid && this.selectedFlight) {
      const fId = this.selectedFlight.id;
      console.log(this.selectedFlight);
      console.log(fId);
      const fromDate = this.cancelScheduleForm.value.fromDate;
      const toDate = this.cancelScheduleForm.value.toDate;
      this.http.get<any>(`http://localhost:8080/admin/cancel/schedule?fId=${fId}&fromDate=${fromDate}&toDate=${toDate}`).subscribe(
        (response) => {
          this.cancelResponse = {
            success: true,
            message: 'Schedules cancelled successfully.',
            noOfSchedules: response.noOfSchedules
          };
        },
        (error) => {
          this.cancelResponse = {
            success: false,
            message: 'Failed to cancel schedules. Please try again later.'
          };
        }
      );
    }
  }
  
}
