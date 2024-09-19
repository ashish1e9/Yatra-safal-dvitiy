import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTicketComponent } from './download-ticket.component';

describe('DownloadTicketComponent', () => {
  let component: DownloadTicketComponent;
  let fixture: ComponentFixture<DownloadTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
