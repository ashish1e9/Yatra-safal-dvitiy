import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Airline, Flight, FlightView } from 'src/model/flight-summary';

@Component({
  selector: 'flight-return',
  templateUrl: './flight-return.component.html',
  styleUrls: ['./flight-return.component.css']
})
export class FlightReturnComponent implements OnInit {

  searchForm!: FormGroup;
  filterFormDay!: FormGroup;
  filterFormPrice!: FormGroup;
  filterFormDeparture!: FormGroup;
  filterFormAirline!: FormGroup;
  flights: Flight[] = [];
  viewFlights: FlightView[] = [];
  filteredFlights: FlightView[] = [];
  airlines: Airline[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router) {
    // Initializing forms with correct form controls
    this.searchForm = this.fb.group({
      source: ['Washington'],
      destination: ['LA'],
      date: ['2024-12-23'],
      returndate: ['2024-12-23'],
      noOfPassengers: ['4']
    });
    this.filterFormDay = this.fb.group({
      morning: [false],
      night: [false]
    });
    this.filterFormPrice = this.fb.group({
      sortPrice: [''] // Corrected form control name
    });
    this.filterFormDeparture = this.fb.group({
      sortDeparture: [''] // Corrected form control name
    });
    this.filterFormAirline = this.fb.group({
      selectedAirlines: this.fb.array([]),
      formairlines: [''] // Corrected form control name
    });
  }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
}
  ngOnInit(): void {
    // Move valueChanges subscription inside ngOnInit
    this.filterFormDay.valueChanges.subscribe(() => {
      this.filter();
    });

    this.filterFormPrice.valueChanges.subscribe(() => {
      this.filter();
    });

    this.filterFormDeparture.valueChanges.subscribe(() => {
      this.filter();
    });
    this.filterFormAirline.valueChanges.subscribe(() => {
      this.filter();
    });
  }

  fetchAirlines() {
    const airlineSet: Set<Airline> = new Set();

    this.flights.forEach(flight => {
      airlineSet.add(flight.airline);  // Set ensures unique airlines
    });

    this.airlines = Array.from(airlineSet);
    console.log(this.airlines);  // Convert Set to array
  }

  search() {
    let source = this.searchForm.value.source;
    let destination = this.searchForm.value.destination;
    let date = this.searchForm.value.date;
    let noOfPassengers = this.searchForm.value.noOfPassengers;

    let url = `http://localhost:8080/flight/search?source=${source}&destination=${destination}&date=${date}&noOfPassengers=${noOfPassengers}`;

    this.http.get<Flight[]>(url).subscribe(data => {
      this.flights = data;
      this.populateAvailableFlights();
      this.fetchAirlines();
     
    });
  }

  populateAvailableFlights() {
    this.viewFlights = this.flights.flatMap(flight =>
      flight.flightSchedules.map(schedule => ({
        flightNo: flight.flightNo,
        flightScheduleId: schedule.id,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        businessBaseFare: flight.businessBaseFare,
        economyBaseFare: flight.economyBaseFare,
        sourceCity: flight.sourceCity,
        destinationCity: flight.destinationCity,
        scheduleDay: schedule.date,
        airline: flight.airline
      } as FlightView))
    );
    this.filteredFlights = this.viewFlights;
  }

  onAirlineSelectionChange(event: any, airlineName: string) {
    const selectedAirlines = this.filterFormAirline.get('selectedAirlines') as FormArray;

    if (event.target.checked) {
      selectedAirlines.push(new FormControl(airlineName));
    } else {
      const index = selectedAirlines.controls.findIndex(x => x.value === airlineName);
      selectedAirlines.removeAt(index);
    }
  }

  filter() {
    const morning = this.filterFormDay.value.morning;
    const night = this.filterFormDay.value.night;
    const selectedAirlines = this.filterFormAirline.value.selectedAirlines;
    const sortDeparture = this.filterFormDeparture.value.sortDeparture;
    const sortPrice = this.filterFormPrice.value.sortPrice;
  
    // Re-populate flights before applying filters
    this.populateAvailableFlights();
  
    // Apply all filters in one filter call
    this.filteredFlights = this.viewFlights.filter(flight => {
      const isAirlineMatch = !selectedAirlines || selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline.airlineName);
  
      const isMorningMatch = morning && !night
        ? flight.departureTime >= '05:00' && flight.departureTime < '18:00'
        : true;
  
      const isNightMatch = night && !morning
        ? (flight.departureTime >= '18:00' && flight.departureTime <= '23:59') ||
          (flight.departureTime >= '00:00' && flight.departureTime < '05:00')
        : true;
  
      return isAirlineMatch && isMorningMatch && isNightMatch;
    });
  
    // Apply sorting by departure time
    if (sortDeparture) {
      this.filteredFlights = [...this.filteredFlights].sort((a, b) => {
        const timeA = this.parseTime(a.departureTime);
        const timeB = this.parseTime(b.departureTime);
        return sortDeparture === 'asc' ? timeA - timeB : timeB - timeA;
      });
    }
  
    // Apply sorting by price
    if (sortPrice) {
      this.filteredFlights = [...this.filteredFlights].sort((a, b) =>
        sortPrice === 'low-high'
          ? a.economyBaseFare - b.economyBaseFare
          : b.economyBaseFare - a.economyBaseFare
      );
    }
  
    console.log('Filtered and Sorted Flights:', this.filteredFlights);
  }
  
  

  parseTime(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds; // Convert time to seconds
  }
}
