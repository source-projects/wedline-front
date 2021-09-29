import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CircleProgressOptions } from 'ng-circle-progress';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {
 
  progressOptions = new CircleProgressOptions();
  reloadMemberDataStatusSubscription:Subscription;
  memberDetails:any = "";
  constructor(
    private router:Router,
    private loginService:LoginService,
    private snackBar:MatSnackBar
  ) {
    // this.progressOptions.percent = 0;
    this.progressOptions.radius = 50;
    this.progressOptions.outerStrokeGradient = true;
    this.progressOptions.outerStrokeWidth = 10;
    this.progressOptions.outerStrokeColor = "#4882c2";
    this.progressOptions.outerStrokeGradientStopColor = "#53a9ff";
    this.progressOptions.innerStrokeColor = "#e7e8ea";
    this.progressOptions.innerStrokeWidth = 10;
    this.progressOptions.animationDuration = 800;
    this.progressOptions.space = -10;
    this.progressOptions.showBackground = false;
    this.progressOptions.showTitle = false;
    this.progressOptions.showSubtitle = false;
    this.progressOptions.showUnits = false;
    this.reloadMemberDataStatusSubscription = this.loginService.getreloadMemberDataStatus().subscribe(res=>{
      if(res){
        this.memberDetails = this.loginService.memberDetails;
      }
    }); 
   }

  ngOnInit(): void {
  }
  ngOnDestroy(): void{
    this.reloadMemberDataStatusSubscription.unsubscribe();
  }
  logout(){
    this.loginService.logout().subscribe((res:any)=>{
        localStorage.setItem("matri","");
        this.loginService.hasLoggedIn.next(false);
        this.loginService.memberDetails = "";
        this.loginService.reloadMemberData.next(false);
        this.router.navigateByUrl("/login");     
   },error=>{
     this.showSnackbar("Connection error",true,"close");
   });  
  }
  
showSnackbar(content:string,hasDuration:boolean,action:string){
  const config = new MatSnackBarConfig();
  if(hasDuration){
    config.duration = 3000;
  }
  config.panelClass = ['snackbar-styler'];
  return this.snackBar.open(content, action, config);
}
}
