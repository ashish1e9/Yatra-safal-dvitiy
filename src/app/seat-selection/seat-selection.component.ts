import { Component } from '@angular/core';

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent {

  rows: number = 10;  // total number of rows
  cols: number = 6;   // total seats per row (A-F)
  businessClassRows: number = 3;  // 'a' number of business class rows

  seatSelection: boolean[][] = [];

  constructor() {
    this.initializeSeats();
  }

  // Initialize the seatSelection array with false (no seats selected initially)
  initializeSeats() {
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push(false);  // No seats selected initially
      }
      this.seatSelection.push(row);
    }
  }

  // Helper method to get seat label (1A, 1B, etc.)
  getSeatLabel(rowIndex: number, colIndex: number): string {
    const rowNumber = rowIndex + 1;
    const seatLetter = String.fromCharCode(65 + colIndex);  // A=65, B=66, ...
    return `${rowNumber}${seatLetter}`;
  }

  // Toggle seat selection
  toggleSeatSelection(rowIndex: number, colIndex: number) {
    this.seatSelection[rowIndex][colIndex] = !this.seatSelection[rowIndex][colIndex];
  }

  // Helper method to check if the row belongs to business class
  isBusinessClass(rowIndex: number): boolean {
    return rowIndex < this.businessClassRows;
  }

  // Submit seat selection (just for example purposes)
  submitSelection() {
    console.log('Seat Selection:', this.seatSelection);
  }
}
