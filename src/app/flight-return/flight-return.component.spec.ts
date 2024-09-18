import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightReturnComponent } from './flight-return.component';

describe('FlightReturnComponent', () => {
  let component: FlightReturnComponent;
  let fixture: ComponentFixture<FlightReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
