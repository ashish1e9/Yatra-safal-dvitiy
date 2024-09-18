import { BookingHistory } from "./booking-history";

export class BookingHistoryCard {
  bookingId!: number;
  bookingDate!: Date;
  airlineName!: string;
  flightNo!: string;
  seatsBooked!: number;
  sourceCity!: string;
  destinationCity!: string;
  arrivalTime!: Date;
  departureTime!: Date;

  bookingHistory!: BookingHistory[];
}