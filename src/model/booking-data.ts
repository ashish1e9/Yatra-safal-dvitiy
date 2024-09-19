export interface BookingData{
        flightScheduleId: number,
        userId: number,
        passengers: SeatId[]
}

export interface SeatId {
    seatId: number
}