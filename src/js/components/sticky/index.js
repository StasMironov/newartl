import Sticky from 'sticksy/dist/sticksy.min.js';

export default {
	init() {
		var stickyEl = new Sticksy('[data-sticky-widget]', {
			listen: true, // Listen for the DOM changes in the container
			topSpacing: 60,
		});
		// you can handle state changing
		stickyEl.onStateChanged = function (state) {
			if (state === 'fixed') {
				stickyEl.nodeRef.classList.add('widget--sticky');
			} else {
				stickyEl.nodeRef.classList.remove('widget--sticky');
			}
		};

		const action = $('[data-text-btn]');
		if (!action) return;
	},
};
