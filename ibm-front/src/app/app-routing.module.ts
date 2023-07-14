import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FocalLoansComponent } from './focal-loans/focal-loans.component';
import { LoanFormComponent } from './loan-form/loan-form.component';
import { LoginComponent } from './login/login.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MyLoansComponent } from './my-loans/my-loans.component';
import { PeripheralRegistrationComponent } from './peripheral-registration/peripheral-registration.component';
import { ProfileComponent } from './profile/profile.component';
import { RecoverComponent } from './recover/recover.component';
import { LoanConfirmationComponent } from './loan-confirmation/loan-confirmation.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SecurityAuthComponent } from './security-auth/security-auth.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'recover', component: RecoverComponent },
  { path: 'home', component: MyLoansComponent },
  { path: 'loan/:area', component: FocalLoansComponent },
  { path: 'newloan', component: LoanFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage', component: RoleManagementComponent },
  { path: 'newperipheral', component: PeripheralRegistrationComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'accept/:id', component: LoanConfirmationComponent },
  { path: 'security/:id', component: SecurityAuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
