import { BookingHistory } from "./booking-history";

export class BookingHistoryCard {
  bookingId!: number;
  bookingDate!: Date;
  scheduleDay!: Date;
  airlineName!: string;
  flightNo!: string;
  seatsBooked!: number;
  sourceCity!: string;
  destinationCity!: string;
  arrivalTime!: string;
  departureTime!: string;

  bookingHistory!: BookingHistory[];
}