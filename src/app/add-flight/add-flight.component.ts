import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-flight',
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css']
})
export class AddFlightComponent implements OnInit {

  flightForm!: FormGroup;
  //private apiUrl = 'http://localhost:8080/admin/addFlight?adminId=2';

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
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
      airlineId: ['', Validators.required],
      numberOfEconomyRows: ['', [Validators.required, Validators.min(1)]],
      numberOfBusinessRows: ['', [Validators.required, Validators.min(1)]],
      aisleCharge: ['', Validators.required],
      windowCharge: ['', Validators.required],
      middleCharge: ['', Validators.required],
    });
  }

  // ngOnInit(): void {
  //   this.flightForm = this.fb.group({
  //     flightNo: [''],
  //     fromDate: [''],
  //     toDate: [''],
  //     departureTime: [''],
  //     arrivalTime: [''],
  //     economyBaseFare: [''],
  //     businessBaseFare: [''],
  //     sourceCity: [''],
  //     destinationCity: [''],
  //     airlineId: [''],
  //     numberOfEconomyRows: [''],
  //     numberOfBusinessRows: [''],
  //     aisleCharge: [''],
  //     windowCharge: [''],
  //     middleCharge: [''],
  //   });
  // }
  

  onSubmit() {
    if (this.flightForm.valid) {
      const formValues = this.flightForm.value;
  
      const totalSeats = 6 * (formValues.numberOfBusinessRows + formValues.numberOfEconomyRows);
  
      const flightData = {
        airlineId: formValues.airlineId,
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
  
      console.log(flightData); 
      const url = `http://localhost:8080/admin/addFlight?airlineId=${flightData.airlineId}&aisleCharge=${flightData.aisleCharge}&arrivalTime=${flightData.arrivalTime}&businessBaseFare=${flightData.businessBaseFare}&departureTime=${flightData.departureTime}&destinationCity=${flightData.destinationCity}&economyBaseFare=${flightData.economyBaseFare}&flightNo=${flightData.flightNo}&fromDate=${flightData.fromDate}&middleCharge=${flightData.middleCharge}&numberOfBusinessRows=${flightData.numberOfBusinessRows}&numberOfEconomyRows=${flightData.numberOfEconomyRows}&sourceCity=${flightData.sourceCity}&toDate=${flightData.toDate}&total_seats=${flightData.total_seats}&windowCharge=${flightData.windowCharge}`;
  
      this.http.get<any>(url).subscribe(
        (response) => {
          console.log(response);
          this.successMessage = 'Flight successfully added!';
          this.flightForm.reset(); 
        }
      );
    } else {
      this.flightForm.markAllAsTouched();  
    }
  }
  
}

