import barba from '@barba/core';
import gsap from 'gsap';
// import EasingFunctions from '../../utils/easing';

export default class PageTransition {
	constructor() {
        this.init = !window.hasAdminBX;

		if (!this.init) return;

		this.wrap = document.querySelector('.page-transition');
		this.overlay = null;
		this.path = null;
		this.numPoints = 10;
		this.duration = 900;
		this.delayPointsArray = [];
		this.delayPointsMax = 300;
		this.delayPerPath = 250;
		this.timeStart = Date.now();
		this.isOpened = false;
        this.center = '';
        this.kofOv = '';

        

		this.render();
	}

    leaveAnimation(e) {
        return new Promise(async resolve => {
        const loader = this.overlay;
          await gsap
          .fromTo(loader, 
                    {
                        //scale: 1,
                       
                        y: this.heightEl,
                        scale: 1,
                        autoAlpha: 1
                        // zoom: 1
                    },
                    { 
                        duration: 1,
                        autoRound:false, 
                        scale: 6.6, 
                        y: this.center,
                        ease: 'Power4.out',
                        // scale: 3
                    })
            .then();
          resolve()
        });
    }
      
    enterAnimation(e) {
    return new Promise(resolve => {
    const loader = this.overlay;
        gsap
        .fromTo(loader, 
        {
            //duration: 0.8,
            scale: 6.6, 
            y: this.center,
            ease: 'Power4.out'
        },
        { 
            duration: 1,
            y: (this.center*2 - this.heightEl),
            scale: 1,
            // scale: 3
            onComplete: ()=>{
                gsap.set(this.overlay, {
                    autoAlpha: 0
                })
            }
        })
        .then(resolve());
    
    });
    }

	initBarbaLinks() {
		let links = document.querySelectorAll('a[href]');

		if(!links.length) return;

		[...links].forEach(link => {
			if(link.href === window.location.href) {
				link.dataset.active = 'true';
			} else {
				link.dataset.active = 'false';
			}
		});
	}

	initBarba() {
		let that = this;

        barba.hooks.before(()=>{
            // console.log('stop server');
        });

        barba.hooks.beforeOnce(()=>{
           
            if (sessionStorage.getItem('preloader') !== 'initialize') {
                 document.querySelector('.preloader').classList.remove('hidden');
            } 
        });

        barba.hooks.leave(()=>{
            window.dispatchEvent(new CustomEvent('page:leave'));
            window._disableScroll();
        });

        barba.hooks.enter(() => {
            setTimeout(()=>{
                document.querySelector('html').scrollTo(0, 0);
            }, 100);

            window._enableScroll();

            // if(document.querySelector('.main-hero__ov')){
            //     setTimeout(()=>{
            //         $('.main-hero__ov').animate({
            //             "opacity": 0
            //         }, 300).remove();	
            //     }, 200);
            // }
    
        });
		

		barba.init({
            debug: true,
            prevent: ({ el }) => el.hasAttribute('data-prevent-barba-link'),
			prefetchIgnore: !!process.env.API,
            cacheIgnore: true, // fix vue map init
            transitions: [
              {
                sync: false,
                before() {
                    if(window.devServer) window.devServer.stop();
				},
                leave: ({ current }) => 
                  this.leaveAnimation(current.container.querySelector("main")),
                afterEnter: () => {
					if(window.devServer) window.devServer.start();
                   
				},
               
                once: ({ next }) => this.enterAnimation(next.container.querySelector("main")),
                enter: ({ next }) => {
                    this.enterAnimation(next.container.querySelector("main"));
                    this.initBarbaLinks();
                },
                after: () => {
                    window.dispatchEvent(new CustomEvent("reinit")); 
               },
                requestError: (trigger, action, url, response) => {
                    // go to a custom 404 page if the user click on a link that return a 404 response status
                    if (action === 'click' && response.status && response.status === 404) {
                        barba.go('/404.html');
                    }

                    // prevent Barba from redirecting the user to the requested URL
                    // this is equivalent to e.preventDefault() in this context
                    return false;
                }
              }
            ]
          });
        
        
        
	}

    setCenter(){
        this.overlay = this.wrap.querySelector('.page-transition-overlay');  
        this.kofOv = $(this.overlay).outerHeight(true)/2; 
        this.center =  (-$('html,body').outerHeight(true) / 2) + this.kofOv;
        this.heightEl = $(this.overlay).outerHeight(true);
    }

	render() {
		if(!this.wrap) return;
       
        this.setCenter();

        gsap.set(this.overlay, {
            autoAlpha: 0,
            xPercent: -50,
            y: 0,
            force3D: true,
            transformOrigin: 'center center',
        })

		this.initBarba();

        $(window).resize(
            ()=>{
                this.setCenter();
            }
        )
	}
}
