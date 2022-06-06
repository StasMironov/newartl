import gsap from 'gsap';
import { debounce } from 'throttle-debounce';
import Swiper from 'swiper/swiper-bundle';

export default {
	init() {

		if (document.querySelector('[data-slider-comment-wrap]')) {
			let slidersWrapNode = document.querySelectorAll(
				'[data-slider-comment-wrap]'
			);

			slidersWrapNode.forEach((slider) => {
				let sliderWrap = slider.querySelector('[data-slider-comment]');
				let sliderPag = slider.querySelector('[data-pag]');
				let prev = slider.querySelector('[data-nav-arrow-prev]');
				let next = slider.querySelector('[data-nav-arrow-next]');
				let progress = slider.querySelector('[data-slider-progress]');

				const pagSlide = new Swiper(sliderPag, {
					slidesPerView: 8,
					spaceBetween: 10,
					touchRatio: false,
          observer: true,
			    observeParents: true,
					//loop: true,
					slideToClickedSlide: true,
					touchRatio: 0.2,
					breakpoints: {
						359: {
							spaceBetween: 14,
							slidesPerView: 3,
						},
						641: {
							spaceBetween: 13,
							slidesPerView: 3,
						},
						939: {
							spaceBetween: 10,
						},
					},
					on: {
            beforeInit: function () {
              let numOfSlides = this.wrapperEl.querySelectorAll(".swiper-slide").length;
              if (numOfSlides >= 5) {
								document.querySelector('[data-pag]').classList.add('overlay');
							}
              if (numOfSlides < 2) {
                sliderPag.setAttribute('style', 'display: none');
                prev.setAttribute('style', 'display: none');
                next.setAttribute('style', 'display: none');
              }              
            },
						init() {
						},
						touchEnd() {
							const lastSlide = this.slides[
								this.slides.length - 1
							];
							if (
								$(lastSlide).hasClass(
									'swiper-slide-thumb-active'
								)
							) {
								document
									.querySelector('[data-pag]')
									.classList.remove('overlay');
							} else {
								document
									.querySelector('[data-pag]')
									.classList.add('overlay');
							}
						},
					},
				});

				let sliderComment = new Swiper(sliderWrap, {
					allowTouchMove: true,
					speed: 500,
					watchSlidesVisibility: true,
					watchSlidesProgress: true,
					slideToClickedSlide: true,
					fadeEffect: { crossFade: true },
					effect: 'fade',
					// loop: true,
					observer: true,
					observeParents: true,
					lazy: {
						loadPrevNext: true,
						elementClass: 'swiper-lazy',
					},
				  autoplay: {
						delay: 50000,
						disableOnInteraction: false,
					},
					
          //autoHeight: true,
					navigation: {
						nextEl: next,
						prevEl: prev,
					},

					thumbs: {
						swiper: pagSlide,
					},
					on: {
						slideChangeTransitionStart() {
							const lastSlide =
								pagSlide.slides[pagSlide.slides.length - 1];
							if (
								$(lastSlide).hasClass(
									'swiper-slide-thumb-active'
								)
							) {
								sliderPag.classList.remove('overlay');
							} else {
								sliderPag.classList.add('overlay');
							}
							showContent(this.slides[this.activeIndex]);
						},
						init: function () {
							progress.classList.remove('animate');
							progress.classList.add('animate');
						},
						slideChangeTransitionStart: function () {
							progress.classList.remove('animate');
              
              document.querySelectorAll('[data-text-hidden]').forEach(txt => {
                txt.style.display = "none";
              });
              document.querySelectorAll('[data-show-more]').forEach(btn => {
                btn.innerHTML = "Читать далее";
              });
						},
						slideChangeTransitionEnd: function () {
							progress.classList.add('animate');              
						},
            slideChange: function () {
              document.querySelectorAll('[data-text-hidden]').forEach(txt => {
                txt.style.display = "none";
              });
              document.querySelectorAll('[data-show-more]').forEach(btn => {
                btn.innerHTML = "Читать далее";
              });  
            }
					},
				});

				sliderComment.update();
				pagSlide.update();

				window.addEventListener(
					'resize',
					debounce(100, () => {
						sliderComment.update();
						pagSlide.update();
					})
				);
      });  

      let showHide = function() {
        const moreBtn = this.previousElementSibling.querySelector('[data-text-hidden]');

        if (moreBtn.style.display === "block" ) {
          moreBtn.style.display = "none";
          moreBtn.classList.remove('read-more-comment__visible'); 
          this.innerHTML = "Читать далее";
        } else {
          moreBtn.style.display = "block"; 
          moreBtn.classList.add('read-more-comment__visible');        
          this.innerHTML = "Скрыть";
        }
      }

      document.querySelectorAll('.read-more-comment__btn').forEach(item => {
        item.addEventListener('click', showHide);
      });
		}
	},
};