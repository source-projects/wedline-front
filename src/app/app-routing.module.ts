import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { FullProfileComponent } from './components/full-profile/full-profile.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileSettingComponent } from './components/profile-setting/profile-setting.component';
import { MyInterestComponent } from './components/my-interest/my-interest.component';
import { MyShortlistComponent } from './components/my-shortlist/my-shortlist.component';
import { ChatComponent } from './components/chat/chat.component';
import { IgnoredListComponent } from './components/ignored-list/ignored-list.component';
import { FilterComponent } from './components/filter/filter.component';
import { LoginComponent } from './components/login/login.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';
import { ProfileStarterComponent } from './components/profile-starter/profile-starter.component';
import { PlansComponent } from './components/plans/plans.component';

const routes: Routes = [
  {path:"home",component: HomeComponent},
  {path:"",redirectTo: "home", pathMatch:"full"},
  {path:"about",component: AboutComponent},
  {path:"register",component: RegisterComponent,canActivate:[LoginGuard]},
  {path:"login",component: LoginComponent,canActivate:[LoginGuard]},
  {path:"full-profile",component: FullProfileComponent,canActivate:[AuthGuard]},
  {path:"profile",component: ProfileComponent,canActivate:[AuthGuard]},
  {path:"dashboard",component: DashboardComponent,canActivate:[AuthGuard]},
  {path:"profile-setting",component: ProfileSettingComponent,canActivate:[AuthGuard]},
  {path:"my-interest",component: MyInterestComponent,canActivate:[AuthGuard]},
  {path:"profile-starter",component: ProfileStarterComponent,canActivate:[AuthGuard]},
  {path:"plans",component: PlansComponent,canActivate:[AuthGuard]},
  {path:"my-shortlist",component: MyShortlistComponent,canActivate:[AuthGuard]},
  {path:"chat",component: ChatComponent,canActivate:[AuthGuard]},
  {path:"ignored-list",component: IgnoredListComponent,canActivate:[AuthGuard]},
  {path:"filter",component: FilterComponent,canActivate:[AuthGuard]}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
