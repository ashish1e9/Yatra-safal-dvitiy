import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dateAfterValidator } from './date-validator';

@Component({
  selector: 'app-add-flight',
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css']
})
export class AddFlightComponent implements OnInit {

  flightForm!: FormGroup;
  airlineName: string = '';
  adminEmail!: string;
  successMessage: string = '';
  errorMessage: string = '';
  airlineId!: number;
  airlineIdPrefix: string = '';
  minDate: string = '';
  minFromDate: string = '';
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {


    const today = new Date();
    this.minDate = this.formatDate(today);
    this.flightForm = this.fb.group({
      flightNo: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      economyBaseFare: ['', [Validators.required, Validators.min(0)]],
      businessBaseFare: ['', [Validators.required, Validators.min(0)]],
      sourceCity: ['', Validators.required],
      destinationCity: ['', Validators.required],
      airlineId: [''],
      numberOfEconomyRows: ['', [Validators.required, Validators.min(1)]],
      numberOfBusinessRows: ['', [Validators.required, Validators.min(1)]],
      aisleCharge: ['', Validators.required],
      windowCharge: ['', Validators.required],
      middleCharge: ['', Validators.required],
    }, { validators: dateAfterValidator('fromDate', 'toDate') });

    const storedAdminEmail = sessionStorage.getItem('adminEmail');
    this.adminEmail = storedAdminEmail !== null ? storedAdminEmail : '';
    const url = `http://localhost:8080/airline?email=${this.adminEmail}`; 
    this.http.get<any>(url).subscribe(
      (response) => {
        console.log(response)
        this.airlineName = response.airlineName; 
        this.airlineId = response.id;
        console.log(this.airlineId, this.airlineName);
      }
    );
  }  

  onSubmit() {
    if (this.flightForm.valid) {
      const formValues = this.flightForm.value;
      const totalSeats = 6 * (formValues.numberOfBusinessRows + formValues.numberOfEconomyRows);
      const flightData = {
        airlineId: this.airlineIdPrefix + this.airlineId,
        aisleCharge: formValues.aisleCharge,
        arrivalTime: formValues.arrivalTime,
        businessBaseFare: formValues.businessBaseFare,
        departureTime: formValues.departureTime,
        destinationCity: formValues.destinationCity,
        economyBaseFare: formValues.economyBaseFare,
        flightNo: formValues.flightNo,
        fromDate: formValues.fromDate,
        middleCharge: formValues.middleCharge,
        numberOfBusinessRows: formValues.numberOfBusinessRows,
        numberOfEconomyRows: formValues.numberOfEconomyRows,
        sourceCity: formValues.sourceCity,
        toDate: formValues.toDate,
        total_seats: totalSeats, 
        windowCharge: formValues.windowCharge
      };
      if(flightData.arrivalTime <= flightData.departureTime){
        alert("Arrival time should be greater than departure time");
        return;
      }
      if(flightData.fromDate > flightData.toDate){
        alert("From date should be less than to date");
        return;
      }
      if(flightData.numberOfEconomyRows < 1 || flightData.numberOfBusinessRows < 1){
        alert("Number of rows should be greater than 0");
        return;
      }
      if(flightData.economyBaseFare < 0 || flightData.businessBaseFare < 0){
        alert("Base fare should be greater than 0");
        return;
      }
      if(flightData.aisleCharge < 0 || flightData.windowCharge < 0 || flightData.middleCharge < 0){
        alert("Charges should be greater than 0");
        return;
      }
      if(flightData.sourceCity === flightData.destinationCity){
        alert("Source and destination city should be different");
        return;
      }
      

      console.log(flightData); 
      const url = `http://localhost:8080/admin/addFlight?airlineId=${flightData.airlineId}&aisleCharge=${flightData.aisleCharge}&arrivalTime=${flightData.arrivalTime}&businessBaseFare=${flightData.businessBaseFare}&departureTime=${flightData.departureTime}&destinationCity=${flightData.destinationCity}&economyBaseFare=${flightData.economyBaseFare}&flightNo=${flightData.flightNo}&fromDate=${flightData.fromDate}&middleCharge=${flightData.middleCharge}&numberOfBusinessRows=${flightData.numberOfBusinessRows}&numberOfEconomyRows=${flightData.numberOfEconomyRows}&sourceCity=${flightData.sourceCity}&toDate=${flightData.toDate}&total_seats=${flightData.total_seats}&windowCharge=${flightData.windowCharge}`;
  
      this.http.get<any>(url).subscribe(
        (response) => {
          console.log(response);
          this.successMessage = 'Flight successfully added!';
          alert('Flight added successfully!');
          this.flightForm.reset(); 
        },
        (error) => {
          this.errorMessage = 'Error adding flight!';
          alert('Error adding flight!');
          console.error(error);
        }
      );
    } else {
      this.flightForm.markAllAsTouched();  
    }
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  getAirlineCode(airlineName: string) {
    if (!airlineName || airlineName.length < 2) {
      return ''; 
    }
    return this.airlineIdPrefix= airlineName.substring(0, 2).toUpperCase();
  }
}
