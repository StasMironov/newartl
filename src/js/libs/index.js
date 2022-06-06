import lazyload from './lazyload';
import mask from './mask';
import sal from './sal';
import repeat from './repeat';
import counter from './counter';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);


export default {
	init() {
		require('./jquery.inputmask.bundle');
		require('./jquery.inputmask-multi');
		require('./steps');

		lazyload.init();
		mask.initMask();
		sal.init();
		repeat.init();
		counter.init();
	},
};
