import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Router } from '@angular/router';

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

  SortForm: FormGroup ;
  adminEmail: string | null = '';
  adminId: string | null = '';
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
  
  fId! :number;
  filteredSchedules: Schedule[] = [];
  FilterForm: FormGroup;

  cancelScheduleForm: FormGroup;
  cancelResponse: { success: boolean, message: string, noOfSchedules?: number } | null = null;

  confirmDelete: string = '';
  flightFetchData = false;
  dataLoaded: boolean = false;
  searchFlightMessage: string = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  paginatedFlights = [];  // Store the current page's flights


  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    
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

    this.SortForm = this.fb.group({
      sortByFlightNo: [''],
      sortByFromDate: [''],
      sortByArrivalDate: [''],
      sortByArrivalTime: [''],
      sortByDepartureTime: [''],
      sortByEconomyBaseFare: [''],
      sortByBusinessBaseFare: [''],
      sortByToDate: [''],
    });
    
  }
  ngOnInit(): void {
    this.adminEmail = sessionStorage.getItem('adminEmail') || '';
    this.adminId = sessionStorage.getItem('adminId') || '';
    if (this.adminId) {
      this.loadFlights(this.adminId);
    } else {
      console.error('AdminId is missing from sessionStorage.');
      this.router.navigate(['/admin/login']);
    }
  }

  // applySorting() {
  //   const sortBy = this.SortForm.value.sortBy;
  //   if (sortBy === 'sortByFlightNo') {
  //     this.flightData.sort((a, b) => a.flightNo - b.flightNo);
  //   } else if (sortBy === 'sortByEconomyBaseFare') {
  //     this.flightData.sort((a, b) => a.economyBaseFare - b.economyBaseFare);
  //   } else if (sortBy === 'sortByBusinessBaseFare') {
  //     this.flightData.sort((a, b) => a.businessBaseFare - b.businessBaseFare);
  //   } else if (sortBy === 'sortByArrivalTime') {
  //     this.flightData.sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
  //   } else if (sortBy === 'sortByDepartureTime') {
  //     this.flightData.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  //   } else if (sortBy ===  'sortByFlightName') {
  //     this.flightData.sort((a, b) => a.flightName.localeCompare(b.flightName));
  //   }
  // }

  // applySorting(): void {
  //   const sortValues = this.SortForm.value;
  
  //   if (sortValues.sortByFlightName) {
  //     this.flightData.sort((a, b) => {
  //       return sortValues.sortByFlightName === 'asc' ? a.flightName.localeCompare(b.flightName) : b.flightName.localeCompare(a.flightName);
  //     });
  //   }
  
  //   if (sortValues.sortByFlightNo) {
  //     this.flightData.sort((a, b) => {
  //       return sortValues.sortByFlightNo === 'asc' ? a.flightNo.localeCompare(b.flightNo) : b.flightNo.localeCompare(a.flightNo);
  //     });
  //   }
  
  //   if (sortValues.sortByFromDate) {
  //     this.flightData.sort((a, b) => {
  //       return sortValues.sortByFromDate === 'asc' ? new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime() : new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime();
  //     });
  //   }
  
  //   if (sortValues.sortByArrivalDate) {
  //     this.flightData.sort((a, b) => {
  //       return sortValues.sortByArrivalDate === 'asc' ? new Date(a.toDate).getTime() - new Date(b.toDate).getTime() : new Date(b.toDate).getTime() - new Date(a.toDate).getTime();
  //     });
  //   }
  
  //   if (sortValues.sortByArrivalTime) {
  //     this.flightData.sort((a, b) => {
  //       return sortValues.sortByArrivalTime === 'asc' ? a.arrivalTime.localeCompare(b.arrivalTime) : b.arrivalTime.localeCompare(a.arrivalTime);
  //     });
  //   }
  
  //   if (sortValues.sortByDepartureTime) {
  //     this.flightData.sort((a, b) => {
  //       return sortValues.sortByDepartureTime === 'asc' ? a.departureTime.localeCompare(b.departureTime) : b.departureTime.localeCompare(a.departureTime);
  //     });
  //   }

  //   if (sortValues.sortByEconomyBaseFare) {
  //     this.flightData.sort((a, b) => {
  //       return sortValues.sortByEconomyBaseFare === 'asc' ? a.economyBaseFare - b.economyBaseFare : b.economyBaseFare - a.economyBaseFare;
  //     });
  //   }

  //   if (sortValues.sortByBusinessBaseFare) {
  //     this.flightData.sort((a, b) => {
  //       return sortValues.sortByBusinessBaseFare === 'asc' ? a.businessBaseFare - b.businessBaseFare : b.businessBaseFare - a.businessBaseFare;
  //     });
  //   }
  // }

  applySorting() {
    const sortValues = this.SortForm.value;
  
    let sortedData = [...this.flightData];
  
    if (sortValues.sortByFlightNo) {
      sortedData.sort((a, b) => sortValues.sortByFlightNo === 'asc' ? a.flightNo.localeCompare(b.flightNo) : b.flightNo.localeCompare(a.flightNo));
    }
  
    if (sortValues.sortByFlightName) {
      sortedData.sort((a, b) => sortValues.sortByFlightName === 'asc' ? a.flightName.localeCompare(b.flightName) : b.flightName.localeCompare(a.flightName));
    }
  
    if (sortValues.sortByDepartureTime) {
      sortedData.sort((a, b) => sortValues.sortByDepartureTime === 'asc' ? a.departureTime.localeCompare(b.departureTime) : b.departureTime.localeCompare(a.departureTime));
    }
  
    if (sortValues.sortByArrivalTime) {
      sortedData.sort((a, b) => sortValues.sortByArrivalTime === 'asc' ? a.arrivalTime.localeCompare(b.arrivalTime) : b.arrivalTime.localeCompare(a.arrivalTime));
    }
  
    if (sortValues.sortByEconomyBaseFare) {
      sortedData.sort((a, b) => sortValues.sortByEconomyBaseFare === 'asc' ? a.economyBaseFare - b.economyBaseFare : b.economyBaseFare - a.economyBaseFare);
    }
  
    if (sortValues.sortByBusinessBaseFare) {
      sortedData.sort((a, b) => sortValues.sortByBusinessBaseFare === 'asc' ? a.businessBaseFare - b.businessBaseFare : b.businessBaseFare - a.businessBaseFare);
    }
  
    if (sortValues.sortByFromDate) {
      sortedData.sort((a, b) => sortValues.sortByFromDate === 'asc' ? a.fromDate.localeCompare(b.fromDate) : b.fromDate.localeCompare(a.fromDate));
    }
  
    if (sortValues.sortByArrivalDate) {
      sortedData.sort((a, b) => sortValues.sortByArrivalDate === 'asc' ? a.toDate.localeCompare(b.toDate) : b.toDate.localeCompare(a.toDate));
    }

    this.filteredFlights = sortedData;
  }
  
  
  
  // loadFlights(adminId: string): void {
  //   this.dataLoaded = false;
  //   this.http.get<any[]>(`${this.apiUrl}/flights/${adminId}`).subscribe(
  //     (response) => {
  //       this.flightData = response;
  //       this.filteredFlights = response;
  //       this.flights = response;
  //       console.log(this.flightData);
  //       console.log(this.flightData.length);
  //       this.dataLoaded = true;
  //       if(this.flightData.length == 0) {
  //         this.flightFetchData = true;
  //       }
  //     }
  //   );
    
  //     console.log(this.flightFetchData);
  //     console.log(this.flightData.length);
    
  // }

  loadFlights(adminId: string): void {
    this.dataLoaded = false;
    this.http.get<any[]>(`${this.apiUrl}/flights/${adminId}`).subscribe(
      (response) => {
        this.flightData = response;
        this.filteredFlights = response;
        this.flights = response;
        console.log(this.flightData);
        console.log(this.flightData.length);
        this.dataLoaded = true;
        if (this.flightData.length === 0) {
          this.flightFetchData = true;
        }

        this.totalItems = this.filteredFlights.length;
        // Pagination Logic
        // const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        // const endIndex = startIndex + this.itemsPerPage;
        //this.paginatedFlights = this.filteredFlights.slice(startIndex, endIndex);
        console.log(this.flightFetchData);
        console.log(this.flightData.length);
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
      if(this.filteredFlights.length == 0) {
        this.searchFlightMessage = "No flights found with the given search term.";
      }
    }
  }

 
/////////////////////////////////////////////////////////////////////////////////////
  // applyFilters(): void {
  //   const fromDateStr = this.FilterForm.value.fromDate;
  //   const toDateStr = this.FilterForm.value.toDate;

  //   const fromDate = new Date(fromDateStr);
  //   const toDate = new Date(toDateStr);

  //   if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
  //     console.error('Invalid date value');
  //     this.filteredSchedules = this.selectedSchedule; 
  //     return;
  //   }

  //   for(let i=0;i<this.selectedSchedule.length;i++){
  //     const scheduleDate = new Date(this.selectedSchedule[i].departureTime);
  //     if (scheduleDate >= fromDate && scheduleDate <= toDate) {
  //       this.filteredSchedules.push(this.selectedSchedule[i]);
  //     }
  //   }
  //   console.log(this.filteredSchedules);
  // }
////////////////////////////////////////////////////////////////////////////////////////

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
  updateFlightDetails(): void {
    if (this.editFlightForm.valid && this.selectedFlight) {
      const updatedFlightDetails = this.editFlightForm.value; 
      updatedFlightDetails.flightId = this.selectedFlight.id;
      console.log(updatedFlightDetails);
      if(this.editFlightForm.value.arrivalTime <= this.editFlightForm.value.departureTime){
        alert("Arrival time should be greater than departure time");
        return;
      }
      else {
        this.http.post<any>(`${this.apiUrl}/edit/flight`, updatedFlightDetails).subscribe(
          (response) => {
            console.log(response);
            if(response){
              alert("Flight details updated successfully");
            }
          }
        );
      }
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

  dataForValidation: any;
  editSchedulesBetweenDates(flightId: number): void {
    this.http.get<any>(`${this.apiUrl}/flight/${flightId}`).subscribe(
      (response) => {
        console.log("here is me");
        console.log(response);
        this.dataForValidation = response;
        this.editScheduleForm.patchValue({
          fromDate: response.fromDate,
          toDate: response.toDate,  
          departureTime: response.departureTime,
          arrivalTime: response.arrivalTime,
        });
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
      if(arrivalTime <= departureTime){
        alert("Arrival time should be greater than departure time");
        return;
      }
      if(fromDate > toDate){
        alert("From date should be less than to date");
        return;
      }
      if(fromDate < this.dataForValidation.fromDate){
        alert("From Date should be greater than or equal to the existing From Date");
        return;
      }
      if(toDate > this.dataForValidation.toDate){
        alert("To Date should be less than or equal to the existing To Date");
        return;
      }
      this.http.get<any>(`http://localhost:8080/admin/edit/schedule?flightId=${fId}&fromDate=${fromDate}&toDate=${toDate}&arrivalTime=${arrivalTime}:00&departureTime=${departureTime}`).subscribe(
        (response) => {
          console.log(response);
          if(response){
            var dif = toDate - fromDate;
            alert(dif + "Schedule updated successfully");
          }
        }
      );

    }
  }

  confirmDeleteAction(): void {
    this.confirmDelete = 'true';
  }

  dataForValidation2: any;
  getCancelFlightId(fId: number): void {
    this.fId = fId;
    this.http.get<any>(`${this.apiUrl}/flight/${fId}`).subscribe(
      (response) => {
        console.log("here is me");
        console.log(response);
        this.dataForValidation2 = response;
        this.cancelScheduleForm.patchValue({
          fromDate: response.fromDate,
          toDate: response.toDate
        });
        this.selectedFlight = { fId };
        this.selectedSchedule = response;
        console.log(this.selectedSchedule);
      }
    );
  }

  cancelSchedule(): void {
    if (this.cancelScheduleForm.valid) {
      console.log("flightId : ", this.fId);
      const fromDate = this.cancelScheduleForm.value.fromDate;
      const toDate = this.cancelScheduleForm.value.toDate;
      if(fromDate > toDate){
        alert("From date should be less than to date");
        return;
      }
      if(fromDate < this.dataForValidation2.fromDate){
        alert("From Date should be greater than or equal to the existing From Date");
        return;
      }
      if(toDate > this.dataForValidation2.toDate){
        alert("To Date should be less than or equal to the existing To Date");
        return;
      }
      if(confirm("Are you sure you want to cancel the schedule")) {
        this.http.get<any>(`http://localhost:8080/admin/cancel/schedule?fId=${this.fId}&fromDate=${fromDate}&toDate=${toDate}`).subscribe(
          (response) => {
            // this.cancelResponse = {
            //   success: true,
            //   message: 'Schedules cancelled successfully.',
            //   noOfSchedules: response.noOfSchedules
            // };
            // console.log(this.cancelResponse.message);
            console.log(response.reason);
            
              alert(response.reason);
            
          }
        );
      }
    }
  }  

  logout(): void {
    sessionStorage.clear();
    console.log(sessionStorage);
  }
  
}
