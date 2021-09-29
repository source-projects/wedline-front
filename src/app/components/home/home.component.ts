import { Component, OnInit } from '@angular/core';
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

    pagination = {
        clickable: true,
        renderBullet: function (index:any, className:any) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    };
  constructor() { }

  ngOnInit(): void {
   this.initalizeSlider();
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


}
