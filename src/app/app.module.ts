import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgCircleProgressModule } from 'ng-circle-progress';
// import { NgxHideOnScrollModule } from 'ngx-hide-on-scroll';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RegisterComponent } from './components/register/register.component';
import { FullProfileComponent } from './components/full-profile/full-profile.component';


import { SwiperModule } from 'swiper/angular';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileSettingComponent } from './components/profile-setting/profile-setting.component';
import { MyInterestComponent } from './components/my-interest/my-interest.component';
import { MyShortlistComponent } from './components/my-shortlist/my-shortlist.component';
import { ChatComponent } from './components/chat/chat.component';
import { IgnoredListComponent } from './components/ignored-list/ignored-list.component';
import { LoginComponent } from './components/login/login.component';
import { AsideComponent } from './components/aside/aside.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageCropperModule } from 'ngx-image-cropper';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import 'hammerjs';
import 'mousetrap';
import {GalleryModule} from '@ks89/angular-modal-gallery';
import {NgxPaginationModule} from 'ngx-pagination';

//Mat Imports

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from './config/mat-date-formats';
import { ProfileStarterComponent } from './components/profile-starter/profile-starter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageCropperComponent } from './dialogs/image-cropper/image-cropper.component';
import { PlansComponent } from './components/plans/plans.component';
import { PublicViewComponent } from './components/public-view/public-view.component';
import { SearchComponent } from './components/search/search.component';
import { MyLikesComponent } from './components/my-likes/my-likes.component';
import { InterestMessagesComponent } from './dialogs/interest-messages/interest-messages.component';
import { PrivacySettingsComponent } from './components/privacy-settings/privacy-settings.component';
import { SuccessStoriesComponent } from './components/success-stories/success-stories.component';
import { CharacterLimiterPipe } from './pipes/character-limiter.pipe';
import { SuccessStoryComponent } from './components/success-story/success-story.component';
import { ContactComponent } from './components/contact/contact.component';
import { PostSuccessStoryComponent } from './components/post-success-story/post-success-story.component';
import { ReferenceOrBackupNotForProductionComponent } from './components/reference-or-backup-not-for-production/reference-or-backup-not-for-production.component';
import { ReadMessageComponent } from './dialogs/read-message/read-message.component';
import { ComposeMessageComponent } from './dialogs/compose-message/compose-message.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { DateBeautifierPipe } from './pipes/date-beautifier.pipe';
import { Base64EncodePipe } from './pipes/base64-encode.pipe';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { ServicesComponent } from './components/services/services.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    FooterComponent,
    HeaderComponent,
    RegisterComponent,
    FullProfileComponent,
    DashboardComponent,
    ProfileSettingComponent,
    MyInterestComponent,
    MyShortlistComponent,
    ChatComponent,
    IgnoredListComponent,
    LoginComponent,
    AsideComponent,
    ProfileStarterComponent,
    ImageCropperComponent,
    PlansComponent,
    PublicViewComponent,
    SearchComponent,
    MyLikesComponent,
    InterestMessagesComponent,
    PrivacySettingsComponent,
    SuccessStoriesComponent,
    CharacterLimiterPipe,
    SuccessStoryComponent,
    ContactComponent,
    PostSuccessStoryComponent,
    ReferenceOrBackupNotForProductionComponent,
    ReadMessageComponent,
    ComposeMessageComponent,
    NotificationsComponent,
    DateBeautifierPipe,
    Base64EncodePipe,
    ErrorDialogComponent,
    ServicesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    // NgxHideOnScrollModule,
    NgCircleProgressModule.forRoot(),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    NgSelectModule,
    ImageCropperModule,
    NgxMaterialTimepickerModule,
    GalleryModule,
    NgxPaginationModule
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
