import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

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
  
  adminEmail: string | null = '';
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
  private adminId = 1; 
  fId! :number;
  filteredSchedules: Schedule[] = [];
  FilterForm: FormGroup;

  cancelScheduleForm: FormGroup;
  cancelResponse: { success: boolean, message: string, noOfSchedules?: number } | null = null;

  confirmDelete: string = '';

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

    this.FilterForm = this.fb.group({
      fromDate: [''],                          
      toDate: [''],                           
      flightNo: [''],                         
      economyBaseFare: [null],                 
      businessBaseFare: [null],                
      arrivalTime: [''],                       
      departureTime: [''],    
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
    this.adminEmail = sessionStorage.getItem('adminEmail');
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
  applyFilters(): void {
    const fromDateStr = this.FilterForm.value.fromDate;
    const toDateStr = this.FilterForm.value.toDate;

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

  confirmDeleteAction(): void {
    this.confirmDelete = 'true';
  }

  getCancelFlightId(fId: number): void {
    this.fId = fId;
  }

  cancelSchedule(): void {
    if (this.cancelScheduleForm.valid) {
      console.log("flightId : ", this.fId);
      const fromDate = this.cancelScheduleForm.value.fromDate;
      const toDate = this.cancelScheduleForm.value.toDate;
      if(confirm("Are you sure you want to cancel the schedule")) {
        this.http.get<any>(`http://localhost:8080/admin/cancel/schedule?fId=${this.fId}&fromDate=${fromDate}&toDate=${toDate}`).subscribe(
          (response) => {
            this.cancelResponse = {
              success: true,
              message: 'Schedules cancelled successfully.',
              noOfSchedules: response.noOfSchedules
            };
            console.log(this.cancelResponse.message);
          }
        );
      }
    }
  }

  // openConfirmDeleteModal(): void {
  //   this.confirmDelete = 'true';
  //   // Hide the cancel schedule modal and show the confirm delete modal
  //   const cancelModalElement = document.getElementById('cancelScheduleModal');
  //   if (cancelModalElement) {
  //     const cancelModal = new bootstrap.Modal(cancelModalElement);
  //     cancelModal.hide();
  //   }
  
  //   const confirmModalElement = document.getElementById('confirmDeleteModal');
  //   if (confirmModalElement) {
  //     const confirmModal = new bootstrap.Modal(confirmModalElement);
  //     confirmModal.show();
  //   }
  // }
  
  // cancelSchedule(): void {
  //   if (this.cancelScheduleForm.valid && this.selectedFlight) {
  //     const fId = this.selectedFlight.id;
  //     const fromDate = this.cancelScheduleForm.value.fromDate;
  //     const toDate = this.cancelScheduleForm.value.toDate;
  //     this.http.get<any>(`http://localhost:8080/admin/cancel/schedule?fId=${fId}&fromDate=${fromDate}&toDate=${toDate}`).subscribe(
  //       (response) => {
  //         this.cancelResponse = {
  //           success: true,
  //           message: 'Schedules cancelled successfully.',
  //           noOfSchedules: response.noOfSchedules
  //         };
  //         // Hide confirm modal after action
  //         const confirmModalElement = document.getElementById('confirmDeleteModal');
  //         if (confirmModalElement) {
  //           const confirmModal = bootstrap.Modal.getInstance(confirmModalElement);
  //           confirmModal?.hide();
  //         }
  //       },
  //       (error) => {
  //         this.cancelResponse = {
  //           success: false,
  //           message: 'Failed to cancel schedules. Please try again later.'
  //         };
  //       }
  //     );
  //   }
  // }
  
  
}
