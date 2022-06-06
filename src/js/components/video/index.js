import Plyr from 'plyr';

export default class Video {
	constructor() {
		this.video = document.querySelectorAll('[data-video]');

		if (this.video && this.video.length > 0) {
			this.video.forEach((elem) => {
				this.render(elem);
			});
		}
	}

	render(elem) {
		return new Plyr(this.video);
	}
}
