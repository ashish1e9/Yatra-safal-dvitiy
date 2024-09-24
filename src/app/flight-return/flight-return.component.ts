import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Airline, Flight, FlightView } from 'src/model/flight-summary';
import { FlightService } from 'src/service/FlightService';

@Component({
  selector: 'flight-return',
  templateUrl: './flight-return.component.html',
  styleUrls: ['./flight-return.component.css']
})
export class FlightReturnComponent implements OnInit {
  @ViewChild('flightsSection') flightsSection!: ElementRef;

  searchForm!: FormGroup;
  filterFormDay!: FormGroup;
  filterFormPrice!: FormGroup;
  filterFormDeparture!: FormGroup;
  filterFormAirline!: FormGroup;
  filterFormDayReturn!: FormGroup;
  filterFormPriceReturn!: FormGroup;
  filterFormDepartureReturn!: FormGroup;
  filterFormAirlineReturn!: FormGroup;
  flights: Flight[] = [];
  viewFlights: FlightView[] = [];
  oneWayFlights: FlightView[] = [];
  filteredFlights: FlightView[] = [];
  returnViewFlights: FlightView[] = [];
  returnFilteredFlights: FlightView[] = [];
  airlines: Airline[] = [];
  source!: String;
  destination!: String;
  selectedOneWayFlight!: FlightView;
  selectedReturnFlight!: FlightView;
  cities: string[] = [];
  filteredSourceCities: string[] = [];
  filteredDestinationCities: string[] = [];
  showSourceDropdown = false;
  showDestinationDropdown = false;
  highlightedIndex: number = -1;
  showAlert = false;  // For displaying the Bootstrap alert
  alertMessage = '';
  alertFadeOut!: boolean;
  minDate: string = '';
  today: string = '';
  showEmptyFlights = false;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private flightService: FlightService) {
    // Initializing forms with correct form controls
    this.searchForm = this.fb.group({
      source: this.flightService.getSource(),
      destination: this.flightService.getDestination(),
      date: this.flightService.getDate(),
      noOfPassengers: this.flightService.getPassenger(),
      returndate: this.flightService.getReturnDate(),
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
    this.filterFormDayReturn = this.fb.group({
      morning: [false],
      night: [false]
    });
    this.filterFormPriceReturn = this.fb.group({
      sortPrice: [''] // Corrected form control name
    });
    this.filterFormDepartureReturn = this.fb.group({
      sortDeparture: [''] // Corrected form control name
    });
    this.filterFormAirlineReturn = this.fb.group({
      selectedAirlines: this.fb.array([]),
      formairlines: [''] // Corrected form control name
    });
  }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  ngOnInit(): void {
    const today = new Date();
    this.today = this.formatDate(today);

    this.searchForm.get('date')?.valueChanges.subscribe(date => {
      this.minDate = date ? this.formatDate(new Date(date)) : this.today;
      this.searchForm.get('returndate')?.updateValueAndValidity();
    });
    
    let url = `http://localhost:8080/flight/getCities`
    this.http.get<string[]>(url).subscribe(data => {
      this.cities = data;
      console.log(this.cities);
    });

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
    this.filterFormDayReturn.valueChanges.subscribe(() => {
      this.filterReturn();
    });

    this.filterFormPriceReturn.valueChanges.subscribe(() => {
      this.filterReturn();
    });

    this.filterFormDepartureReturn.valueChanges.subscribe(() => {
      this.filterReturn();
    });
    this.filterFormAirlineReturn.valueChanges.subscribe(() => {
      this.filterReturn();

    });
    this.fetchInitialData();
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  
  filterCities(searchText: string, type: 'source' | 'destination'): void {
    if (type === 'source') {
      this.filteredSourceCities = this.cities.filter(city => city.toLowerCase().includes(searchText.toLowerCase()));
    } else {
      this.filteredDestinationCities = this.cities.filter(city => city.toLowerCase().includes(searchText.toLowerCase()));
    }
  }


  handleKeydown(event: KeyboardEvent, type: 'source' | 'destination') {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.highlightedIndex > -1) {
        const selectedCity = type === 'source' ? this.filteredSourceCities[this.highlightedIndex] : this.filteredDestinationCities[this.highlightedIndex];
        this.selectCity(selectedCity, type);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (type === 'source') {
        if (this.highlightedIndex < this.filteredSourceCities.length - 1) {
          this.highlightedIndex++;
        }
      } else {
        if (this.highlightedIndex < this.filteredDestinationCities.length - 1) {
          this.highlightedIndex++;
        }
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (type === 'source') {
        if (this.highlightedIndex > 0) {
          this.highlightedIndex--;
        }
      } else {
        if (this.highlightedIndex > 0) {
          this.highlightedIndex--;
        }
      }
    }
  }

  selectCity(city: string, type: 'source' | 'destination') {
    if (type === 'source') {
      this.searchForm.get('source')?.setValue(city);
      this.showSourceDropdown = false;
    } else {
      this.searchForm.get('destination')?.setValue(city);
      this.showDestinationDropdown = false;
    }
    this.highlightedIndex = -1;
  }

  hideDropdownWithDelay(type: 'source' | 'destination') {
    setTimeout(() => {
      if (type === 'source') {
        this.showSourceDropdown = false;
      } else {
        this.showDestinationDropdown = false;
      }
    }, 200);
  }
  fetchInitialData() {
    this.filteredFlights = this.flightService.getFilteredFlights();
    this.viewFlights = this.flightService.getFlights();
    this.oneWayFlights = this.flightService.getOneWayFlights();
    this.returnFilteredFlights = this.flightService.getReturnFilteredFlights();
    this.returnViewFlights = this.flightService.getReturnFlights();
    this.airlines = this.flightService.getAirlines();

    console.log("stored" + this.flightService.getFilteredFlights());
    console.log("stored" + this.flightService.getReturnFilteredFlights());

  }
  selectOneWayFlight(flight: FlightView): void {
    this.selectedOneWayFlight = flight;
  }

  selectReturnFlight(flight: FlightView): void {
    this.selectedReturnFlight = flight;
  }

  confirmFlights(): void {
    if (this.selectedOneWayFlight && this.selectedReturnFlight) {
      this.flightService.setOneWayFlight(this.selectedOneWayFlight);
      this.flightService.setReturnFlight(this.selectedReturnFlight);
      this.router.navigate(['/flight/view']);
    } else {
      alert('Please select both one-way and return flights.');
    }
  }
  fetchAirlines() {
    const airlineSet: Set<string> = new Set();

    this.flights.forEach(flight => {
      // Add airline name or a unique identifier like airline ID to the Set
      airlineSet.add(flight.airline.airlineName);
    });

    // Map back to Airline objects, assuming you have a full list of airlines or can reconstruct the objects
    this.airlines = Array.from(airlineSet).map(airlineName => ({
      airlineName
    } as Airline));
    this.flightService.setAirlines(this.airlines);
    console.log(this.airlines);  // Convert Set to array and display unique airlines
  }


  search() {
    this.showEmptyFlights=true;
    let source = this.searchForm.value.source;
    let destination = this.searchForm.value.destination;
    this.source = source;
    this.destination = destination;
    let date = this.searchForm.value.date;
    let returndate = this.searchForm.value.returndate;
    let noOfPassengers = this.searchForm.value.noOfPassengers;
    this.flightService.setSource(source);
    this.flightService.setDestination(destination);
    this.flightService.setDate(date);
    this.flightService.setReturnDate(returndate);
    this.flightService.setPassenger(noOfPassengers);
  
    let url = `http://localhost:8080/flight/searchreturn?source=${source}&destination=${destination}&date=${date}&returnDate=${returndate}&noOfPassengers=${noOfPassengers}`;
    if (this.searchForm.invalid) {
      // Handle form invalidity
      return;
    }

   
    if (source === destination) {
      this.alertMessage = 'Source and Destination cannot be the same.';
      this.showAlert = true;
      this.alertFadeOut = false;

      // Automatically fade out alert after 5 seconds
      setTimeout(() => {
        this.alertFadeOut = true;
      }, 5000);

      // Hide alert after the fade-out animation
      setTimeout(() => {
        this.showAlert = false;
        this.alertFadeOut = false;
      }, 5500);
      return;

    }
    if (returndate && new Date(returndate) <= new Date(date)) {
      this.alertMessage = 'Return date must be after the departure date.';
      this.showAlert = true;
      this.alertFadeOut = false;

      setTimeout(() => {
        this.alertFadeOut = true;
      }, 5000);

      setTimeout(() => {
        this.showAlert = false;
        this.alertFadeOut = false;
      }, 5500);
      return;
    }

    this.showAlert = false;
    this.http.get<Flight[]>(url).subscribe(data => {
      this.flights = data;
      this.populateAvailableFlights();
      this.divideFlights();
      this.fetchAirlines();

    });
    this.scrollToFlights();
  }

  scrollToFlights() {
    if (this.flightsSection) {
      this.flightsSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        scheduleDate: schedule.scheduleDay,
        airline: flight.airline
      } as FlightView))
    );
    this.flightService.setFlights(this.viewFlights);
  }
  divideFlights() {
    this.oneWayFlights = this.viewFlights.filter(flight => {
      return flight.sourceCity === this.searchForm.value.source;
    });

    this.returnViewFlights = this.viewFlights.filter(flight => {
      return flight.sourceCity === this.searchForm.value.destination;
    });

    this.filteredFlights = this.oneWayFlights;
    this.returnFilteredFlights = this.returnViewFlights;

    this.flightService.setOneWayFlights(this.oneWayFlights);
    this.flightService.setFilteredFlights(this.filteredFlights);
    this.flightService.setReturnFlights(this.returnViewFlights);
    this.flightService.setReturnFilteredFlights(this.returnViewFlights);
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
  onAirlineSelectionChangeReturn(event: any, airlineName: string) {
    const selectedAirlinesReturn = this.filterFormAirlineReturn.get('selectedAirlines') as FormArray;

    if (event.target.checked) {
      selectedAirlinesReturn.push(new FormControl(airlineName));
    } else {
      const index = selectedAirlinesReturn.controls.findIndex(x => x.value === airlineName);
      selectedAirlinesReturn.removeAt(index);
    }


  }



  filter() {
    const morning = this.filterFormDay.value.morning;
    const night = this.filterFormDay.value.night;
    const selectedAirlines = this.filterFormAirline.value.selectedAirlines;
    const sortDeparture = this.filterFormDeparture.value.sortDeparture;
    const sortPrice = this.filterFormPrice.value.sortPrice;

    // Apply all filters in one filter call
    this.filteredFlights = this.oneWayFlights.filter(flight => {
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

  }
  filterReturn() {
    const morning = this.filterFormDayReturn.value.morning;
    const night = this.filterFormDayReturn.value.night;
    const selectedAirlinesReturn = this.filterFormAirlineReturn.value.selectedAirlines;
    const sortDeparture = this.filterFormDepartureReturn.value.sortDeparture;
    const sortPrice = this.filterFormPriceReturn.value.sortPrice;

    // Apply all filters in one filter call
    this.returnFilteredFlights = this.returnViewFlights.filter(flight => {
      const isAirlineMatch = !selectedAirlinesReturn || selectedAirlinesReturn.length === 0 || selectedAirlinesReturn.includes(flight.airline.airlineName);

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
      this.returnFilteredFlights = [...this.returnFilteredFlights].sort((a, b) => {
        const timeA = this.parseTime(a.departureTime);
        const timeB = this.parseTime(b.departureTime);
        return sortDeparture === 'asc' ? timeA - timeB : timeB - timeA;
      });
    }

    // Apply sorting by price
    if (sortPrice) {
      this.returnFilteredFlights = [...this.returnFilteredFlights].sort((a, b) =>
        sortPrice === 'low-high'
          ? a.economyBaseFare - b.economyBaseFare
          : b.economyBaseFare - a.economyBaseFare
      );
    }


  }


  parseTime(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds; // Convert time to seconds
  }
}
