import { Time } from "@angular/common";

export interface FlightSummary {
  flightNo: string;
  departureTime: string; //from flight schedule
  arrivalTime: string; // from flight schedule
  baseFare: number;
  sourceCity: string;
  destinationCity: string;
  scheduleDay: Date; // from flight schedule

}