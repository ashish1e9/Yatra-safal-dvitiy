import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { EditScheduleComponent } from './edit-schedule/edit-schedule.component';
import { AddFlightComponent } from './add-flight/add-flight.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { MyTripsComponent } from './my-trips/my-trips.component';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';
import { PaymentComponent } from './payment/payment.component';
import {SelectPassengerComponent} from './select-passenger/select-passenger.component'
import { FlightReturnComponent } from './flight-return/flight-return.component';
import { FlightSelectSummaryComponent } from './flight-select-summary/flight-select-summary.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { ViewTicketsComponent } from './view-tickets/view-tickets.component';
import { CancelConfirmationComponent } from './cancel-confirmation/cancel-confirmation.component';
import { SeatPassengerSelectComponent } from './seat-passenger-select/seat-passenger-select.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'flight/search', component: FlightSearchComponent },
  { path: 'flight/return', component: FlightReturnComponent },
  { path: 'flight/view', component: FlightSelectSummaryComponent },
  { path: 'flight/card', component: FlightCardComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'seat', component: SeatSelectionComponent },
  {path: "admin/login", component: AdminLoginComponent},
  {path: "admin/flight/add", component: AddFlightComponent},
  {path: "admin/schedule/edit", component: EditScheduleComponent},
  { path: "admin/dashboard", component: AdminDashboardComponent },
  { path: "flight/add", component: AddFlightComponent },
  { path: "schedule/edit", component: EditScheduleComponent },
  { path: "mytrips", component: MyTripsComponent },
  {path: "booking/summary", component: BookingSummaryComponent},
  {path: "booking/payment", component: PaymentComponent},
  {path: 'seat/addPassenger', component: SelectPassengerComponent},
  {path: 'booking/confirmation', component: PaymentConfirmationComponent},
  {path: 'booking/tickets', component: ViewTicketsComponent},
  {path: "cancellation/summary", component: CancelConfirmationComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
