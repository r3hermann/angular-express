
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule } from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field'; //contacts
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppMaterialModule } from './app-material/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import {MatInputModule} from '@angular/material';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
//import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { SimpleNotificationsModule } from 'angular2-notifications';
import * as globals from "globals";


//import { AuthService } from './auth/auth.service';
//import { HeaderComponent } from './header/header.component';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatNativeDateModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';







@NgModule({
  declarations: [
    AppComponent,
    //HeaderComponent,
    LoginComponent,
    DashboardComponent,
    NavBarComponent,
    ContactsComponent,
    DashboardPanelComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTableModule


  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
