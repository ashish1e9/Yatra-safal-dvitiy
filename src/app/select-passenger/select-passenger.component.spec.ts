import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPassengerComponent } from './select-passenger.component';

describe('SelectPassengerComponent', () => {
  let component: SelectPassengerComponent;
  let fixture: ComponentFixture<SelectPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPassengerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
