import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelConfirmationComponent } from './cancel-confirmation.component';

describe('CancelConfirmationComponent', () => {
  let component: CancelConfirmationComponent;
  let fixture: ComponentFixture<CancelConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
