import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DashboardPanelComponent} from './dashboard-panel/dashboard-panel.component';
import {ContactsComponent} from './contacts/contacts.component';


const routes: Routes = [

  { path: 'login', component: LoginComponent },
  {path: 'admin', component: DashboardPanelComponent, canActivate:[AuthGuard]},
  { path: 'dashboard', component:DashboardComponent},
  { path: 'Contacts', component:ContactsComponent},
  //{ path: '**', redirectTo: ''}
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
