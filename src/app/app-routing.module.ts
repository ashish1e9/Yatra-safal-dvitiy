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
import {SelectPassengerComponent} from './select-passenger/select-passenger.component'
import { FlightReturnComponent } from './flight-return/flight-return.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'flight/search', component: FlightSearchComponent },
  { path: 'flight/return', component: FlightReturnComponent },
  { path: 'flight/card', component: FlightCardComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'seat', component: SeatSelectionComponent },
  {path: "dashboard", component: AdminDashboardComponent},
  {path: "admin", component: AdminLoginComponent},
  {path: "flight/add", component: AddFlightComponent},
  {path: "schedule/edit", component: EditScheduleComponent},
  {path: 'seat/addPassenger', component: SelectPassengerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
