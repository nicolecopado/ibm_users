import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from "@carbon/charts-angular";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import axios from 'axios';


// carbon-components-angular default imports
import {
  IconModule,
  UIShellModule,
  IconService,
  ButtonModule,
  InputModule,
  StructuredListModule,
  TabsModule,
  SearchModule,
  CheckboxModule,
  RadioModule,
  GridModule,
  TagModule,
  ModalModule,
  DropdownModule,
  NotificationModule,
  
} from 'carbon-components-angular';

import { LoginComponent } from './login/login.component';
import { RecoverComponent } from './recover/recover.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { LoanFormComponent } from './loan-form/loan-form.component';
import { FocalLoansComponent } from './focal-loans/focal-loans.component';
import { MyLoansComponent } from './my-loans/my-loans.component';
import { ProfileComponent } from './profile/profile.component';
import { LoanConfirmationComponent } from './loan-confirmation/loan-confirmation.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { PeripheralRegistrationComponent } from './peripheral-registration/peripheral-registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SecurityAuthComponent } from './security-auth/security-auth.component';
//import { AngularCsv } from 'angular7-csv/dist/Angular-csv';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoverComponent,
    MenuBarComponent,
    LoanFormComponent,
    FocalLoansComponent,
    MyLoansComponent,
    ProfileComponent,
    RoleManagementComponent,
    PeripheralRegistrationComponent,
    LoanConfirmationComponent,
    DashboardComponent,
    SecurityAuthComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UIShellModule,
    IconModule,
    ButtonModule,
    InputModule,
    ReactiveFormsModule,
    StructuredListModule,
    TabsModule,
    SearchModule,
    Ng2SearchPipeModule,
    CheckboxModule,
    RadioModule,
    GridModule,
    TagModule,
    ModalModule,
    DropdownModule,
    NotificationModule,
    ChartsModule,

  ],
  providers: [MyLoansComponent, ProfileComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}