import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatPassengerSelectComponent } from './seat-passenger-select.component';

describe('SeatPassengerSelectComponent', () => {
  let component: SeatPassengerSelectComponent;
  let fixture: ComponentFixture<SeatPassengerSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeatPassengerSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatPassengerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
