import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Flight, FlightSummary, FlightView, Airline } from 'src/model/flight-summary';
import { FlightService } from 'src/service/FlightService';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {

  searchForm!: FormGroup;
  filterFormDay!: FormGroup;
  filterFormPrice!: FormGroup;
  filterFormDeparture!: FormGroup;
  filterFormAirline!: FormGroup;
  flights: Flight[] = [];
  viewFlights: FlightView[] = [];
  filteredFlights: FlightView[] = [];
  airlines: Airline[] = [];
  selectedFlight: FlightView | null = null;
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
  noOfPassengers: number = 0;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private flightService: FlightService) {

    // Initializing forms with correct form controls
    this.searchForm = this.fb.group({
      source: this.flightService.getSource(),
      destination: this.flightService.getDestination(),
      date: this.flightService.getDate(),
      noOfPassengers: this.flightService.getPassenger()
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
  selectFlight(flightScheduleId:number,flightClass:string,flight:FlightView) {
    localStorage.setItem('flightScheduleId', JSON.stringify(flightScheduleId));
    localStorage.setItem('flightClass', flightClass.toUpperCase());
    localStorage.setItem('noOfSeats', JSON.stringify(this.noOfPassengers));
    this.flightService.setOneWayFlight(flight);
  

    this.router.navigate(['/flight/view']);
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = this.formatDate(today);
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
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.filteredFlights = this.flightService.getFilteredFlights();
    this.viewFlights = this.flightService.getFlights();
    this.airlines = this.flightService.getAirlines();

    console.log("stored" + this.flightService.getFilteredFlights());

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
  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
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
    if (this.searchForm.invalid) {
      // Handle form invalidity
      return;
    }

    let source = this.searchForm.value.source;
    let destination = this.searchForm.value.destination;
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

    this.showAlert = false;
    let date = this.searchForm.value.date;
    let noOfPassengers = this.searchForm.value.noOfPassengers;
     this.noOfPassengers = this.searchForm.value.noOfPassengers;
    this.filteredFlights = this.flightService.getFilteredFlights();
    this.flightService.setSource(source);
    this.flightService.setDestination(destination);
    this.flightService.setDate(date);
    this.flightService.setPassenger(noOfPassengers);



    let url = `http://localhost:8080/flight/search?source=${source}&destination=${destination}&date=${date}&noOfPassengers=${noOfPassengers}`;

    this.http.get<Flight[]>(url).subscribe(data => {
      this.flights = data;
      console.log(this.flights);
      this.populateAvailableFlights();
      this.fetchAirlines();

    });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter(city => city.toLowerCase().includes(filterValue));
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
    this.filteredFlights = this.viewFlights;
    this.flightService.setFlights(this.viewFlights);
    this.flightService.setFilteredFlights(this.filteredFlights);

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
