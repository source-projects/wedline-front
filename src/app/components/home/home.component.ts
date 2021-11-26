import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import SwiperCore, { Autoplay,Pagination} from 'swiper';
SwiperCore.use([Autoplay]);
SwiperCore.use([Pagination]);
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    featuredMembers:any[] = [];
    stories:any[] = [];
    countryCodes:any[] = [];
    signupForm:FormGroup;
    generatedTokenStatusSubscription:Subscription;
    isGettingFeatured:boolean = false;
    isNoResultsFeatured:boolean = false;
    isGettingStory:boolean = false;
    isNoResultsStory:boolean = false;
    pagination = {
        clickable: true,
        renderBullet: function (index:any, className:any) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    };
  constructor(
      private loginService:LoginService,
      private snackBar:MatSnackBar,
      private fb:FormBuilder,
      private router:Router
  ) {
    this.signupForm = this.fb.group({
      gender:['Male',Validators.required],
      email:['',[Validators.required,Validators.email]],
      country_code:['',Validators.required],
      mobile_number:['',[Validators.required,Validators.pattern("^[0-9]{10}$")]]
    });  
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
        if(res){
          this.getMobileCountryCode();
          this.getFeaturedMembers();
          this.getSuccessStories();
        }
      }); 
   }

  ngOnInit(): void {
   this.initalizeSlider();
  }
  ngOnDestroy():void{
    this.generatedTokenStatusSubscription.unsubscribe();
  }  
  
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  initalizeSlider() {   
      
      $(".aiz-carousel").not(".slick-initialized").each(function(index:any,event:any) {
         
          var $this = $(event);

          var slidesRtl = false;

          var slidesPerViewXs = $this.data("xs-items");
          var slidesPerViewSm = $this.data("sm-items");
          var slidesPerViewMd = $this.data("md-items");
          var slidesPerViewLg = $this.data("lg-items");
          var slidesPerViewXl = $this.data("xl-items");
          var slidesPerView = $this.data("items");

          var slidesCenterMode = $this.data("center");
          var slidesArrows = $this.data("arrows");
          var slidesDots = $this.data("dots");
          var slidesRows = $this.data("rows");
          var slidesAutoplay = $this.data("autoplay");
          var slidesFade = $this.data("fade");
          var asNavFor = $this.data("nav-for");
          var infinite = $this.data("infinite");
          var focusOnSelect = $this.data("focus-select");
          var adaptiveHeight = $this.data("auto-height");


          var vertical = $this.data("vertical");
          var verticalXs = $this.data("vertical-xs");
          var verticalSm = $this.data("vertical-sm");
          var verticalMd = $this.data("vertical-md");
          var verticalLg = $this.data("vertical-lg");
          var verticalXl = $this.data("vertical-xl");

          slidesPerView = !slidesPerView ? 1 : slidesPerView;
          slidesPerViewXl = !slidesPerViewXl ? slidesPerView : slidesPerViewXl;
          slidesPerViewLg = !slidesPerViewLg ? slidesPerViewXl : slidesPerViewLg;
          slidesPerViewMd = !slidesPerViewMd ? slidesPerViewLg : slidesPerViewMd;
          slidesPerViewSm = !slidesPerViewSm ? slidesPerViewMd : slidesPerViewSm;
          slidesPerViewXs = !slidesPerViewXs ? slidesPerViewSm : slidesPerViewXs;


          vertical = !vertical ? false : vertical;
          verticalXl = (typeof verticalXl == 'undefined') ? vertical : verticalXl;
          verticalLg = (typeof verticalLg == 'undefined') ? verticalXl : verticalLg;
          verticalMd = (typeof verticalMd == 'undefined') ? verticalLg : verticalMd;
          verticalSm = (typeof verticalSm == 'undefined') ? verticalMd : verticalSm;
          verticalXs = (typeof verticalXs == 'undefined') ? verticalSm : verticalXs;


          slidesCenterMode = !slidesCenterMode ? false : slidesCenterMode;
          slidesArrows = !slidesArrows ? false : slidesArrows;
          slidesDots = !slidesDots ? false : slidesDots;
          slidesRows = !slidesRows ? 1 : slidesRows;
          slidesAutoplay = !slidesAutoplay ? false : slidesAutoplay;
          slidesFade = !slidesFade ? false : slidesFade;
          asNavFor = !asNavFor ? null : asNavFor;
          infinite = !infinite ? false : infinite;
          focusOnSelect = !focusOnSelect ? false : focusOnSelect;
          adaptiveHeight = !adaptiveHeight ? false : adaptiveHeight;


          if ($("html").attr("dir") === "rtl") {
              slidesRtl = true;
          }
          $this.slick({
              slidesToShow: slidesPerView,
              autoplay: slidesAutoplay,
              dots: slidesDots,
              arrows: slidesArrows,
              infinite: infinite,
              vertical: vertical,
              rtl: slidesRtl,
              rows: slidesRows,
              centerPadding: "0px",
              centerMode: slidesCenterMode,
              fade: slidesFade,
              asNavFor: asNavFor,
              focusOnSelect: focusOnSelect,
              adaptiveHeight: adaptiveHeight,
              slidesToScroll: 1,
              prevArrow:
                  '<button type="button" class="slick-prev"><i class="las la-angle-left"></i></button>',
              nextArrow:
                  '<button type="button" class="slick-next"><i class="las la-angle-right"></i></button>',
              responsive: [
                  {
                      breakpoint: 1500,
                      settings: {
                          slidesToShow: slidesPerViewXl,
                          vertical: verticalXl,
                      },
                  },
                  {
                      breakpoint: 1200,
                      settings: {
                          slidesToShow: slidesPerViewLg,
                          vertical: verticalLg,
                      },
                  },
                  {
                      breakpoint: 992,
                      settings: {
                          slidesToShow: slidesPerViewMd,
                          vertical: verticalMd,
                      },
                  },
                  {
                      breakpoint: 768,
                      settings: {
                          slidesToShow: slidesPerViewSm,
                          vertical: verticalSm,
                      },
                  },
                  {
                      breakpoint: 576,
                      settings: {
                          slidesToShow: slidesPerViewXs,
                          vertical: verticalXs,
                      },
                  },
              ],
          });
      });
    
  }
  getFeaturedMembers(){
    this.isNoResultsFeatured = false;
    this.isGettingFeatured = true;
    let requestData = new FormData();
    requestData.append("featured","featured");
    requestData.append("religion","30");
    requestData.append("user_agent","NI-AAPP");
    requestData.append("search_order","latest_first");
    this.loginService.search(requestData,1).subscribe((res:any)=>{
      this.featuredMembers = [];
      this.isGettingFeatured = false;
      if((res["status"]=="success")&&(res["total_count"]>0)){        
        this.featuredMembers = res["data"];
      }else{
        this.isNoResultsFeatured = true;
      }
    },error=>{
      this.isGettingFeatured = false;
    }); 
  }
  getMobileCountryCode(){
    this.loginService.getMobileCountryCode().subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.countryCodes = res["data"];
      }
    },error=>{
      alert(error["message"]);
    })
 }
  getSuccessStories(){
    this.isNoResultsStory = false;
    this.isGettingStory = true;
    let requestData = new FormData();
    // requestData.append("religion","30");
    this.loginService.getSuccessStories(requestData,1,10).subscribe((res:any)=>{
      this.stories = [];
      this.isGettingStory = false;
      if((res["status"]=="success")&&(res["total_count"]>0)){        
        this.stories = res["data"];
        this.stories.map(result=>result.id = btoa(result.id));
      }else{
        this.isNoResultsStory = true;
      }
    },error=>{
      this.isGettingStory = false;
    }); 
  }
  saveRegisterAndRedirect(){
    if(this.signupForm.valid){
      this.loginService.homeRegisterData = this.signupForm.value;
      this.router.navigateByUrl("register");
    }else{
      this.showSnackbar("Please check all required fields",true,"okay");
    }
  }
}
