import { Time } from "@angular/common";

export interface FlightSummary {
  flightNo:string;
  flightScheduleId: number;
  departureTime: Time; //from flight schedule
  arrivalTime: Time; // from flight schedule
  baseFare: number;
  sourceCity: string;
  destinationCity: string;
  scheduleDay: Date; // from flight schedule
}
export interface FlightView {
  flightNo:string;
  flightScheduleId: number;
  departureTime: string; //from flight schedule
  arrivalTime: string; // from flight schedule
  economyBaseFare: number;
  businessBaseFare: number;
  sourceCity: string;
  destinationCity: string;
  scheduleDay: Date;
  airline:Airline; // from flight schedule
}

export class Flight{
  
  id!:number;
  economyBaseFare!:number;
  businessBaseFare!:number;
  flightNo!:string;
  sourceCity!:string;
  destinationCity!:string;
  flightSchedules!:Schedule[];
  airline!:Airline;

}
export class Schedule{
  
  id!:number;
  date!:Date;
  departureTime!:string;
  arrivalTime!:string;
  fare!:number;

}

export class Airline{
  id!:number;
  airlineName!:string;
  contactNumber!:string;
  
}