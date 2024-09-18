import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { LoginComponent } from './login/login.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddFlightComponent } from './add-flight/add-flight.component';
import { EditScheduleComponent } from './edit-schedule/edit-schedule.component';
import { MyTripsComponent } from './my-trips/my-trips.component';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';
import { PaymentComponent } from './payment/payment.component';
import { TimeFormatPipe } from './time-format.pipe';
import { SelectPassengerComponent } from './select-passenger/select-passenger.component';
import { FlightReturnComponent } from './flight-return/flight-return.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    FlightCardComponent,
    LoginComponent,
    FlightSearchComponent,
    SignupComponent,
    LandingPageComponent,
    SeatSelectionComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AddFlightComponent,
    EditScheduleComponent,
    MyTripsComponent,
    BookingSummaryComponent,
    PaymentComponent,
    TimeFormatPipe,
    SelectPassengerComponent,
    FlightReturnComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
