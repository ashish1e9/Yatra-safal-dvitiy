import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSelectSummaryComponent } from './flight-select-summary.component';

describe('FlightSelectSummaryComponent', () => {
  let component: FlightSelectSummaryComponent;
  let fixture: ComponentFixture<FlightSelectSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightSelectSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSelectSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
