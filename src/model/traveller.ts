import { FlightClass } from "./flight-class-enum";
import { Gender } from "./gender-enum";

interface Seat {
    seatId: number;
    seatNo: string;
    cost: number;
    selected: boolean;
}

export interface Traveller {
    passengerId: number;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    seat: Seat;
}