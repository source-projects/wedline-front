import { Component, NgZone, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
declare var Razorpay: any;

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  showSpinner:boolean = false;
  isProccessing:boolean = false;
  plans:any = [];
  options:any = {};
  planChoosed:any;
  orderId:string = "";
  loginStatusSubscription:Subscription;
  hasLoggedIn:boolean = false;
  profileStatusSubscription:Subscription;
  profileStatus:string = localStorage.getItem("wedlineMatriChristianProfileStatus") as string;
  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar,
    private router:Router,
    private zone:NgZone
  ) { 
    this.loginStatusSubscription = this.loginService.getLoginSetStatus().subscribe(res=>{
      this.hasLoggedIn = res;
    }); 
    this.profileStatusSubscription = this.loginService.getProfileStatus().subscribe(res=>{
      this.profileStatus = res;
    });
  }
  ngOnInit(): void {    
    let that = this;
    this.options = {
      "key": "rzp_test_JelOhepkudmvBw",
      "amount": "50000",
      "currency": "INR",
      "name": "Wedline Matrimony",
      "description": "Purchase your membership",
      "image": "assets/public/assets/img/beforeweddinglogo.png",
      "handler": function (response:any){
          that.zone.run(()=>that.saveMembership(response));
      },
      "prefill": {
          // "name": localStorage.getItem("vname"),
          // "email": "gaurav.kumar@example.com",
          // "contact": "9999999999"
      },
      "notes": {},
      "theme": {
          "color": "#fd297b"
      }
    };
    this.getPlans();
  }
  ngOnDestroy():void{
    this.loginStatusSubscription.unsubscribe();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }

  getPlans(){
    this.loginService.getAllPlans().subscribe((res:any)=>{
       this.showSpinner =true;
       if(res["status"]=="success"){
          this.plans = res["plan_data"];
       }else{
         this.showSnackbar("No Plan details found!",true,"close");
       }
    },error=>{
      this.showSpinner =true;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }
  skip(){
    this.choosePlan(this.plans.find((plan:any)=>{
      return plan.plan_type.toUpperCase()=="FREE";
    }));
  }
  choosePlan(plan:any){
    if(!this.hasLoggedIn){
      this.router.navigateByUrl("/register");
      return;
    }
    this.planChoosed = plan;
    if(plan.plan_type.toUpperCase()!="FREE"){
        this.createOrderAndAcceptPayment();        
    }else{
      this.saveMembershipForFree();
    }
    
  }
  createOrderAndAcceptPayment(){
    this.isProccessing = true;
    this.showSnackbar("Please wait...",false,"");
    let that = this;
    let requestData = new FormData;
    requestData.append("amount",this.planChoosed.plan_amount+"00");
    this.loginService.createOrder(requestData).subscribe((res:any)=>{
      this.isProccessing = false;
      if(res["status"]=="created"){
         this.showSnackbar("Please complete payment!",true,"close");
          this.options["amount"] = this.planChoosed.plan_amount+"00";
          this.options["description"] = "Purchase "+this.planChoosed.plan_name+ " Membership";
          this.options["order_id"] = res["data"];
          this.orderId = res["data"];
          var rzp1 = new Razorpay(this.options);
          rzp1.open();
          rzp1.on('payment.failed', function (response:any){
            that.showSnackbar(response.error.code+": "+response.error.reason+" "+response.error.description,true,"");
            console.log(response);          
          });       
      }else{
        this.showSnackbar("Payment Failed!",true,"close");
      }
    },error=>{
      this.showSnackbar("Connection Error!",true,"close");
      this.isProccessing = false;
    });    
  }
  saveMembershipForFree(){
    this.isProccessing = true;
    this.showSnackbar("Please wait...",false,"");
    let requestData = new FormData();
    requestData.append("payment_method","NA");
    requestData.append("plan_id",this.planChoosed.id);
    this.loginService.verifyPaymentStatus(requestData).subscribe((res:any)=>{
        if(res["status"]=="success"){
          this.showSnackbar("Subscribed successfully!",true,"close");
          this.loginService.hasLoggedIn.next(true);
          this.router.navigate(["/dashboard"]);
        }else{
          this.isProccessing = false;
          this.showSnackbar(res["error_message"],true,"close");
        }
    },error=>{
      this.isProccessing = false;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }
  saveMembership(response:any){
    this.isProccessing = true;
    this.showSnackbar("Please wait verifying payment...",false,"");
    let requestData = new FormData();
    requestData.append("razorpay_payment_id",response.razorpay_payment_id);
    requestData.append("razorpay_signature",response.razorpay_signature);
    requestData.append("razorpay_order_id",this.orderId);
    requestData.append("payment_method","RazorPay");
    requestData.append("plan_id",this.planChoosed.id);

    this.loginService.verifyPaymentStatus(requestData).subscribe((res:any)=>{
        if(res["status"]=="success"){
          this.showSnackbar("Subscribed successfully!",true,"close");
          this.loginService.hasLoggedIn.next(true);
          this.router.navigate(["/dashboard"]);
        }else{
          this.isProccessing = false;
          this.showSnackbar(res["error_message"],true,"close");
        }
    },error=>{
      this.isProccessing = false;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }

}
