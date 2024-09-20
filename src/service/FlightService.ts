import { Injectable } from '@angular/core';
import { FlightView, Airline } from 'src/model/flight-summary';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private selectedOneWayFlight!: FlightView;
  private selectedReturnFlight: FlightView | null = null;

  getSelectedOneWayFlight(): FlightView {
    return this.selectedOneWayFlight;
  }
  setOneWayFlight(flight: FlightView): void {
    this.selectedOneWayFlight = flight;
  }
  getReturnFlight(): FlightView | null {
    return this.selectedReturnFlight;
  }
  setReturnFlight(flight: FlightView|null): void {
    this.selectedReturnFlight = flight;
  }

  private localStorageKey = 'flightState';

  // Define the state interface
  private defaultState: {
    flights: FlightView[];
    
    oneWayFlights: FlightView[];
    returnViewFlights: FlightView[];
    filteredFlights: FlightView[];
    returnFilteredFlights: FlightView[];
    airlines: Airline[];
    source: string;
    destination: string;
    passenger: number;
    date: string;
    returnDate: string;
  } = {
    flights: [],
    oneWayFlights: [],
    returnViewFlights: [],
    filteredFlights: [],
    returnFilteredFlights: [],
    airlines: [],
    source: '',
    destination: '',
    passenger: 0,
    date: '',
    returnDate: ''
  };

  constructor() {
    // Load state from local storage if available
    const savedState = localStorage.getItem(this.localStorageKey);
    if (savedState) {
      Object.assign(this.defaultState, JSON.parse(savedState));
    }
  }

  // Setters and getters
  setFlights(flights: FlightView[]): void {
    this.defaultState.flights = flights;
    this.saveState();
  }

  getFlights(): FlightView[] {
    return this.defaultState.flights;
  }



  setOneWayFlights(oneWayFlights: FlightView[]): void {
    this.defaultState.oneWayFlights = oneWayFlights;
    this.saveState();
  }

  getOneWayFlights(): FlightView[] {
    return this.defaultState.oneWayFlights;
  }

  setReturnFlights(returnViewFlights: FlightView[]): void {
    this.defaultState.returnViewFlights = returnViewFlights;
    this.saveState();
  }

  getReturnFlights(): FlightView[] {
    return this.defaultState.returnViewFlights;
  }

  setFilteredFlights(filteredFlights: FlightView[]): void {
    this.defaultState.filteredFlights = filteredFlights;
    this.saveState();
  }

  getFilteredFlights(): FlightView[] {
    return this.defaultState.filteredFlights;
  }

  setReturnFilteredFlights(returnFilteredFlights: FlightView[]): void {
    this.defaultState.returnFilteredFlights = returnFilteredFlights;
    this.saveState();
  }

  getReturnFilteredFlights(): FlightView[] {
    return this.defaultState.returnFilteredFlights;
  }

  setAirlines(airlines: Airline[]): void {
    this.defaultState.airlines = airlines;
    this.saveState();
  }

  getAirlines(): Airline[] {
    return this.defaultState.airlines;
  }

  setSource(source: string): void {
    this.defaultState.source = source;
    this.saveState();
  }

  getSource(): string {
    return this.defaultState.source;
  }

  setDestination(destination: string): void {
    this.defaultState.destination = destination;
    this.saveState();
  }

  getDestination(): string {
    return this.defaultState.destination;
  }
  
  setPassenger(passenger: number): void {
    this.defaultState.passenger=passenger;
    this.saveState();
  }
  getPassenger(): number {
    return this.defaultState.passenger;
  }

  getDate(): string {
    return this.defaultState.date;
  }
  setDate(date: string): void {
    this.defaultState.date =date;
    this.saveState();
  }

  getReturnDate(): string {
    return this.defaultState.returnDate;
  }
  setReturnDate(returnDate: string): void {
    this.defaultState.returnDate =returnDate;
    this.saveState();
  }

  private saveState(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.defaultState));
  }
}
