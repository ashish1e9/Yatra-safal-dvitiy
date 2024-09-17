import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
<<<<<<< HEAD
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { LoginComponent } from './login/login.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
=======
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddFlightComponent } from './add-flight/add-flight.component';
import { EditScheduleComponent } from './edit-schedule/edit-schedule.component';
>>>>>>> origin/admin

@NgModule({
  declarations: [
    AppComponent,
<<<<<<< HEAD
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    FlightCardComponent,
    LoginComponent,
    FlightSearchComponent,
    SignupComponent,
    LandingPageComponent,
    SeatSelectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
=======
    AdminLoginComponent,
    AdminDashboardComponent,
    AddFlightComponent,
    EditScheduleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
>>>>>>> origin/admin
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
