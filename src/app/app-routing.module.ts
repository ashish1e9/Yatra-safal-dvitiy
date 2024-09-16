import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { EditScheduleComponent } from './edit-schedule/edit-schedule.component';
import { AddFlightComponent } from './add-flight/add-flight.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

const routes: Routes = [
  {path: "dashboard", component: AdminDashboardComponent},
  {path: "", component: AdminLoginComponent},
  {path: "flight/add", component: AddFlightComponent},
  {path: "schedule/edit", component: EditScheduleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
