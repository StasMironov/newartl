import ScrollBooster from 'scrollbooster';

export default {
	init() {
		if (!document.querySelector('[data-table-viewport]')) {
			return;
		}
		new ScrollBooster({
			viewport: document.querySelector('[data-table-viewport]'),
			content: document.querySelector('[data-table-content]'),
			scrollMode: 'transform', // use CSS 'transform' property
			direction: 'horizontal', // allow only horizontal scrolling
			emulateScroll: true, // scroll on wheel events
		});
	},
};
