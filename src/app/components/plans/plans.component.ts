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
  packages:any = [];
  options:any = {};
  planChoosed:any;
  orderId:string = "";
  loginStatusSubscription:Subscription;
  hasLoggedIn:boolean = false;
  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar,
    private router:Router,
    private zone:NgZone
  ) { 
    this.loginStatusSubscription = this.loginService.getLoginSetStatus().subscribe(res=>{
      this.hasLoggedIn = res;
    }); 
  }

  ngOnInit(): void {    
    let that = this;
    this.options = {
      "key": "rzp_test_AH9Z2L7Vuospz9",
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
    this.loginService.getAllPackages().subscribe((res:any)=>{
       this.showSpinner =true;
       if(res["status"]=="success"){
          this.packages = res["plan_data"];
       }else{
         this.showSnackbar("No Plan details found!",true,"close");
       }
    },error=>{
      this.showSpinner =true;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }
  
  choosePackage(plan:any){
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
    let params:any = {};
    // params["totalPrice"] = this.planChoosed.sellingPrice;
    // params["vendorId"] = localStorage.getItem("vid");
    // params["orderType"] = "MEMBERSHIP";

    /*To remove */
    this.showSnackbar("Please complete payment!",true,"close");
    //     this.orderId = res["data"]["orderId"]; 
        this.options["amount"] = this.planChoosed.plan_amount+"00";
        this.options["description"] = "Purchase "+this.planChoosed.plan_name+ " Membership";
    //     this.options["order_id"] = this.orderId;
        var rzp1 = new Razorpay(this.options);
        rzp1.open();
        rzp1.on('payment.failed', function (response:any){
          that.showSnackbar(response.error.code+": "+response.error.reason+" "+response.error.description,true,"");
          console.log(response);          
        });

    /*To remove ends */

    // this.loginService.createOrder(params).subscribe(res=>{
    //   this.isProccessing = false;
    //   if(res["success"]){
    //     this.showSnackbar("Please complete payment!",true,"close");
    //     this.orderId = res["data"]["orderId"]; 
    //     this.options["amount"] = this.planChoosed.sellingPrice+"00";
    //     this.options["description"] = "Purchase "+this.planChoosed.membershipName+ " Membership";
    //     this.options["order_id"] = this.orderId;
    //     var rzp1 = new Razorpay(this.options);
    //     rzp1.open();
    //     rzp1.on('payment.failed', function (response:any){
    //       that.showSnackbar(response.error.code+": "+response.error.reason+" "+response.error.description,true,"");
    //       console.log(response);          
    //     });
    //   }else{
    //     this.showSnackbar("Connection Error!",true,"close");
    //   }
    // },error=>{
    //   this.showSnackbar("Connection Error!",true,"close");
    //   this.isProccessing = false;
    // });    
  }
  saveMembershipForFree(){
    this.isProccessing = true;
    this.showSnackbar("Please wait...",false,"");
    let requestData = new FormData();
    requestData.append("payment_method","RazorPay");
    requestData.append("plan_id",this.planChoosed.id);
    this.loginService.verifyPaymentStatus(requestData).subscribe((res:any)=>{
      this.isProccessing = false;
        if(res["status"]=="success"){
          this.showSnackbar("Subscribed successfully!",true,"close");
          localStorage.setItem("profileStatus","Subscribed");
          this.loginService.hasLoggedIn.next(true);
          this.loginService.profileStatus.next("Subscribed");
          this.router.navigate(["/dashboard"]);
        }else{
          this.showSnackbar(res["error_message"],true,"close");
        }
    },error=>{
      this.isProccessing = false;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }
  saveMembership(response:any){
    
    // alert(response.razorpay_payment_id);
    // alert(response.razorpay_order_id);
    // alert(response.razorpay_signature);
    this.isProccessing = true;
    this.showSnackbar("Please wait verifying payment...",false,"");
    // let params:any = {};
    // params["membershipId"] = this.planChoosed.membershipId;
    // params["vendorId"] = localStorage.getItem("vid");
    // params["paymentId"] = response.razorpay_payment_id;
    // params["orderId"] = this.orderId;
    // params["signature"] = response.razorpay_signature;
    let requestData = new FormData();
    requestData.append("payment_method","RazorPay");
    requestData.append("plan_id",this.planChoosed.id);
    this.loginService.verifyPaymentStatus(requestData).subscribe((res:any)=>{
        if(res["status"]=="success"){
          this.showSnackbar("Subscribed successfully!",true,"close");
          localStorage.setItem("profileStatus","Subscribed");
          this.loginService.hasLoggedIn.next(true);
          this.loginService.profileStatus.next("Subscribed");
          this.router.navigate(["/dashboard"]);
        }else{
          this.showSnackbar(res["error_message"],true,"close");
        }
    },error=>{
      this.isProccessing = false;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }

}
