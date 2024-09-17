import { Time } from "@angular/common";

export interface FlightSummary {
  flightScheduleId: number;
  departureTime: Time; //from flight schedule
  arrivalTime: Time; // from flight schedule
  baseFare: number;
  sourceCity: string;
  destinationCity: string;
  scheduleDay: Date; // from flight schedule

}