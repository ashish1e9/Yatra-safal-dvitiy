import { FlightClass } from "./flight-class-enum";
import { Gender } from "./gender-enum";

interface Seat {
    seatId: number;
    seatNo: string;
    flightScheduleId: number; // will be recieved from localstorage
    cost: number;
    class: FlightClass; // will be recieved from localstorage
}

export interface Traveller {
    passengerId: number;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    passportNo: string;
    seat: Seat;
}