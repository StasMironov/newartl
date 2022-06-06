import { Loader } from 'google-maps';
import PerfectScrollbar from 'perfect-scrollbar';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Swiper from 'swiper/swiper-bundle';
import gsap from 'gsap';
import { isDesktop, isTablet, isMob } from '../../utils/breakpoints';

export default class MapService {
	constructor() {
		this.mapNode = document.querySelector('[data-map]');
		if (!this.mapNode) return;

		this.triggerBtnMap = document.querySelector('[data-trigger-map]');
		if (!this.triggerBtnMap) return;

		this.triggerBtnList = document.querySelector('[data-trigger-list]');
		if (!this.triggerBtnList) return;

		this.mapWrp = document.querySelector('[data-wrp-map]');
		if (!this.mapWrp) return;

		this.mapInitNode = this.mapNode.querySelector('[data-map-init]');
		if (!this.mapInitNode) return;

		this.urlData = this.mapNode.getAttribute('data-url');
		if (!this.urlData) return;

		this.card = this.mapNode.querySelector('[data-map-card]');
		if (!this.card) return;

		this.cardContent = this.card.querySelector('[data-map-card-content]');
		if (!this.cardContent) return;

		this.wrapCard = document.querySelector('[data-wrp-service]');
		if (!this.wrapCard) return;

		this.APIKEY = 'AIzaSyBKxxX68AJCEH2DX3_j0u1knkD6__xrYAk'; // TODO использовать только на этом проекте
		this.initOptions = {
			language: 'RU',
		};

		this.ps = null;
		this.psWrap = null;

		this.loader = new Loader(this.APIKEY, this.initOptions);

		this.filterProduction = false;
		this.id = false;

		this.inputVal = false;
		this.clusterArr = [];

		this.load();
	}

	load() {
		if (!window.isMapsApiLoaded) {
			window.isMapsApiLoaded = true;	
			this.loader.load().then((google) => {
				//console.log('map service');
				this.render(google);
				window.mapLoad = google;
			});
		} else  {
			//console.log('map service уже');
			this.render(window.mapLoad);
		}
	}

	render(google) {
		this.mapOptions = {
			center: { lat: 55.02147974086529, lng: 82.92257557883947 },
			zoom: 4,
			disableDefaultUI: true,
			scrollwheel: false,
			zoomControl: false,
			restriction: {
				latLngBounds: {
					east: 179.9999,
					north: 85,
					south: -85,
					west: -179.9999,
				},
				strictBounds: true,
			},
			styles: [
				{
					featureType: 'water',
					elementType: 'geometry',
					stylers: [{ color: '#E0E0E0' }, { lightness: 17 }],
				},
				{
					featureType: 'landscape',
					elementType: 'all',
					stylers: [
						{ lightness: 20 },
						{ visibility: 'on' },
						{ color: '#ffffff' },
					],
				},
				{
					featureType: 'landscape.man_made',
					elementType: 'geometry.stroke',
					stylers: [
						{ visibility: 'on' },
						{ color: '#dddddd' },
						{ lightness: -30 },
					],
				},
				{
					featureType: 'road.highway',
					elementType: 'geometry.fill',
					stylers: [{ color: '#ffffff' }, { lightness: 17 }],
				},
				{
					featureType: 'road.highway',
					elementType: 'geometry.stroke',
					stylers: [
						{ color: '#ffffff' },
						{ lightness: 29 },
						{ weight: 0.2 },
					],
				},
				{
					featureType: 'road.arterial',
					elementType: 'geometry',
					stylers: [{ color: '#ffffff' }, { lightness: 18 }],
				},
				{
					featureType: 'road.local',
					elementType: 'geometry',
					stylers: [{ color: '#ffffff' }, { lightness: 16 }],
				},
				{
					featureType: 'poi',
					elementType: 'geometry',
					stylers: [{ color: '#f5f5f5' }, { lightness: 21 }],
				},
				{
					featureType: 'poi.park',
					elementType: 'geometry',
					stylers: [{ color: '#dedede' }, { lightness: 21 }],
				},
				{
					featureType: 'landscape',
					elementType: 'labels.text.stroke',
					stylers: [
						{ visibility: 'on' },
						{ color: '#ffffff' },
						{ lightness: 16 },
					],
				},
				{
					elementType: 'labels.icon',
					stylers: [{ visibility: 'off' }],
				},
				{
					featureType: 'transit',
					elementType: 'geometry',
					stylers: [{ color: '#f2f2f2' }, { lightness: 19 }],
				},
				{
					featureType: 'administrative',
					elementType: 'geometry.fill',
					stylers: [{ color: '#bbbbbb' }, { lightness: 20 }],
				},
				{
					featureType: 'administrative',
					elementType: 'geometry.stroke',
					stylers: [
						{ color: '#aaaaaa' },
						{ lightness: 17 },
						{ weight: 1.2 },
					],
				},
			],
		};

		if (isMob()) {
			this.mapOptions.zoom = 0;
		} else if (isTablet()) {
			this.mapOptions.zoom = 3;
		}

		this.map = new google.maps.Map(this.mapInitNode, this.mapOptions);

		this.zoomIn = this.mapNode.querySelector('[data-zoom-in]');
		this.zoomOut = this.mapNode.querySelector('[data-zoom-out]');

		if (this.zoomIn) {
			this.zoomIn.addEventListener('click', () => {
				const currentZoomLevel = this.map.getZoom();

				if (currentZoomLevel !== 21) {
					this.map.setZoom(currentZoomLevel + 1);
				}
			});
		}

		if (this.zoomOut) {
			this.zoomOut.addEventListener('click', () => {
				const currentZoomLevel = this.map.getZoom();

				if (currentZoomLevel !== 0) {
					this.map.setZoom(currentZoomLevel - 1);
				}
			});
		}

		this.cardWrap = this.mapNode.querySelector('[data-card-wrap]');
		this.cardClose = this.card.querySelector('[data-close]');

		this.markers = [];

		this.activeIndex = null;

		this.cardClose.addEventListener('click', () => {
			this.cardWrap.classList.remove('is-active');
			this.filterMarkers(); // показ всех меток текущего региона
			this.stateMarks(this.inputVal);
			this.map.setZoom(4);
			this.activeIndex = null; // это нужно для возможности повторного нажатия на пин при закрытии карточки
		});

		this.psWrap = new PerfectScrollbar(this.wrapCard, {
			suppressScrollX: true,
			wheelPropagation: true,
			minScrollbarLength: 140, // исправляет бесконечную прокрутку и баг с большим количеством элементов
		});

		this.ps = new PerfectScrollbar(this.cardContent, {
			suppressScrollX: true,
			wheelPropagation: true,
			minScrollbarLength: 140, // исправляет бесконечную прокрутку и баг с большим количеством элементов
		});

		this.tabs = new Swiper(this.tabsNode, {
			slidesPerView: 'auto',
			speed: 400,
			a11y: false,
			freeMode: {
				enabled: true,
				sticky: false,
			},
			simulateTouch: true,
			resistance: true,
			resistanceRatio: 0,
			observer: true,
			observeParents: true,
		});

		// this.tabButtons = this.tabsNode.querySelectorAll('[data-region]');
		// this.tabButtons.forEach((tab, idx) => {
		// 	if (tab.classList.contains('tab--active')) {
		// 		this.currentRegion = tab.getAttribute('data-region'); // определение текущего региона, чтобы исключить остальные
		// 	}

		// 	tab.addEventListener('click', () => {
		// 		setTimeout(() => {
		// 			this.tabs.slideTo(idx, 800);
		// 		}, 50);

		// 		for (let i = 0; i < this.tabButtons.length; i++) {
		// 			if (idx === i) continue;
		// 			this.tabButtons[i].classList.remove('tab--active');
		// 		}

		// 		tab.classList.add('tab--active');
		// 		this.currentRegion = tab.getAttribute('data-region');
		// 		this.filterMarkers(false, true);

		// 		this.cardWrap.classList.remove('is-active'); // при переключении табов скрываем попап с данными ранее выбранной метки
		// 	});
		// });

		this.bounds = null;

		this.getPOI().then((data) => {
			data.data.forEach((markerData, idx) => {
				this.addMarker(markerData, idx);
			});

			// if (this.currentRegion) {
			// 	this.bounds = null;
			// 	this.filterMarkers(false, true);
			// }
			this.clusterArr = this.markers;
			this.setCluster();
		});

		this.triggerHandler();
	}

	addMarker(markerData, index) {
		if(markerData.products.length>0){
			const marker = new google.maps.Marker({
			id: markerData.id,
			exist: !!markerData.exist,
			position: new google.maps.LatLng(
				markerData.coords[0],
				markerData.coords[1]
			),
			map: this.map,
			icon: this.setIcon(markerData),
			products: markerData.products,
			city: markerData.city,
		});

		marker.setMap(this.map);
		marker.setCursor('default');
		this.markers.push(marker);
		

		if (!this.mapNode.hasAttribute('data-noclick')) {
			marker.setCursor('pointer');
			marker.addListener('click', () => {
				if (this.activeIndex !== index) {
					// заперт на повторный клик по активной метке
					this.showContent(markerData); // передача данных метки
					this.cardWrap.classList.add('is-active'); // показ попапа с данными метки

					this.activeIndex = index;
				//	this.excludeMarker(this.activeIndex); // true - исключаем все метки, кроме текущей
				}

				this.map.setCenter(marker.getPosition());
				//this.map.setZoom(6);
			});
		}
		}
		

		
	}

	// excludeMarker(index){
	// 	//console.log(index);
	// 	console.log(this.markers[index]);
	// 	for (let i = 0; i < this.markers.length; i++) {
			
	// 		if(index == i){
				
	// 		//	console.log(this.markers[i]);
	// 			// this.markers[i].setVisible(true);
	// 		} else {
	// 			//this.markers[i].setVisible(false);
	// 		}
	// 	}
	// }

	setIcon({ type }) {
		let fillColor = '#000000';
		if (type.trim() === 'service') {
			fillColor = '#00D372';
		} else if (type.trim() === 'factories') {
			fillColor = '#000000';
		} else {
			fillColor = '#CE00F8';
		}
		const svg = `<svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.4362 13.0009C27.2265 10.8039 26.491 8.68979 25.292 6.83705C24.0929 4.98431 22.4655 3.44742 20.5472 2.35627C18.6289 1.26511 16.4762 0.651746 14.2709 0.568008C12.0656 0.48427 9.87252 0.932617 7.87703 1.87516C5.88153 2.81771 4.14225 4.22676 2.80615 5.98323C1.47004 7.73971 0.576387 9.792 0.200694 11.9667C-0.174999 14.1414 -0.0216884 16.3745 0.64767 18.4775C1.31703 20.5804 2.48277 22.4913 4.04637 24.0487L12.6194 32.6379C12.7698 32.7895 12.9487 32.9099 13.1458 32.992C13.3429 33.0741 13.5543 33.1164 13.7679 33.1164C13.9814 33.1164 14.1928 33.0741 14.3899 32.992C14.587 32.9099 14.7659 32.7895 14.9163 32.6379L23.457 24.0487C24.8986 22.6179 26.0036 20.8842 26.6918 18.9733C27.3801 17.0624 27.6343 15.0222 27.4362 13.0009Z" fill="${fillColor}"/>		<path fill-rule="evenodd" clip-rule="evenodd" d="M20.7507 20.5581H13.7371C9.88303 20.5581 6.75073 17.3986 6.75073 13.5581C6.75073 9.70402 9.89665 6.55811 13.7507 6.55811C17.6048 6.55811 20.7507 9.70402 20.7507 13.5581V20.5581ZM18.204 13.5581V18.0114H13.7507C11.2994 18.0114 9.29743 15.9958 9.29743 13.5581C9.29743 11.1204 11.2994 9.1048 13.7507 9.1048C16.2021 9.1048 18.204 11.1204 18.204 13.5581Z" fill="white"/></svg>`;
		const icon = {
			url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
			strokeOpacity: 0,
			fillOpacity: 1.0,
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(0, 20), // anchor
			size: new google.maps.Size(80, 80),
		};

		// цвет иконки в зависимости от типа метки
		//	console.log(this.mapNode.hasAttribute('data-noclick'));

		return icon;
	}

	async getPOI() {
		// получение данных меток
		const response = await fetch(this.urlData);

		if (!response.ok) {
			throw new Error(`There is some error by ${this.urlData}`);
		}

		return await response.json();
	}

	showContent(markerData) {
		// контент попапа
		this.cardContent.innerHTML = '';

		let heading = null;

		if (markerData.heading) {
			heading = document.createElement('p');
			heading.classList.add('card-map__heading', 'h2');
			heading.setAttribute('data-item', '');

			heading.innerText = markerData.heading;
			this.cardContent.appendChild(heading);
		}

		if (markerData.address) {
			this.cardContent.appendChild(
				this.createElement(markerData.address)
			);
		}

		if (markerData.phone) {
			let caption = null;

			const item = document.createElement('div');
			item.classList.add('card-map__item');
			item.setAttribute('data-item', '');

			if (markerData.phone.caption) {
				caption = document.createElement('p');
				caption.classList.add('card-map__caption');

				caption.innerText = markerData.phone.caption;
				item.appendChild(caption);
			}

			if (markerData.phone.links.length) {
				const linksContainer = document.createElement('div');
				linksContainer.classList.add('card-map__links');

				let links = '<ul class="card-map__list">';

				for (let i = 0; i < markerData.phone.links.length; i++) {
					links += `<li class='card-map__link-item'>
								<a href='tel:${markerData.phone.links[i].href}' class="card-map__link h3">${markerData.phone.links[i].text}</a>
								</li>`;
				}

				links += '</ul>';

				linksContainer.innerHTML = links;
				item.appendChild(linksContainer);
			}

			this.cardContent.appendChild(item);
		}

		if (markerData.staff) {
			this.cardContent.appendChild(this.createElement(markerData.staff));
		}

		if (markerData.production) {
			this.cardContent.appendChild(
				this.createElement(markerData.production)
			);
		}

		const items = this.cardContent.querySelectorAll('[data-item]');

		if (!items.length > 0) return;

		const timeline = gsap.timeline({
			paused: true,
		});

		timeline.staggerFromTo(
			items,
			0.5,
			{ opacity: 0, yPercent: 100 },
			{ opacity: 1, yPercent: 0 },
			0.2,
			'+=0.4'
		);

		setTimeout(() => {
			this.ps.update();
			timeline.play();
		}, 0);
	}

	createElement(data) {
		// разметка для элементов попапа
		let caption = null;
		let text = null;

		const item = document.createElement('div');
		item.classList.add('card-map__item');
		item.setAttribute('data-item', '');

		if (data.caption) {
			caption = document.createElement('p');
			caption.classList.add('card-map__caption');

			caption.innerText = data.caption;
			item.appendChild(caption);
		}

		if (data.text) {
			text = document.createElement('p');
			text.classList.add('card-map__text', 'h3');

			text.innerText = data.text;
			item.appendChild(text);
		}

		return item;
	}

	filterMarkers(exclude = false, fit = false, filter = false) {
		// отображение / скрытие меток
		this.bounds = new google.maps.LatLngBounds();
		let arrProducts = '';
		let markers;
		this.clusterArr = [];

		for (let i = 0; i < this.markers.length; i++) {
			this.markers[i].setVisible(false);
		}

		for (let i = 0; i < this.markers.length; i++) {
			if (filter) {
				if (this.inputVal) {
					if (this.markers[i].city.toLowerCase().indexOf(this.inputVal.toLowerCase()) !== -1) {
						if(this.markers[i].products.length>0){
							arrProducts = this.markers[i].products;
							arrProducts.forEach((el) => {
								if (el == this.filterProduction) {
									this.markers[i].setVisible(true);
								}
							});
						}
					}

					if (
						this.filterProduction === 'All' &&
						this.markers[i].city.toLowerCase().indexOf(this.inputVal.toLowerCase()) !== -1
					) {
						if(this.markers[i].products.length>0){
							this.markers[i].setVisible(true);
						}
					}
				} else {
					if (this.inputVal == false) {
						if(this.markers[i].products.length>0){
							arrProducts = this.markers[i].products;
							arrProducts.forEach((el) => {
								if (el == this.filterProduction) {
									//console.log('filter 3');
									this.markers[i].setVisible(true);
								}
							});
						}
					}

					if (this.filterProduction === 'All') {
						if(this.markers[i].products.length>0){
							this.markers[i].setVisible(true);
						}
					}
				}
			} else {
				if (!exclude) {
					// если нужно исключить все метки, кроме выбранной
					// this.markers[i].setVisible(true);
					this.bounds.extend(this.markers[i].position);
				} else {
					//this.markers[i].setVisible(true);
				}
			}

			if(this.markers[i].getVisible()){
				this.clusterArr.push(this.markers[i]);
			}
		}

		// if (!exclude && fit) {
		// 	this.map.fitBounds(this.bounds);
		// }
	}

	stateMarks(inputVal, select) {
		let arrProducts = '';
		let arrival = inputVal;
		let cityEl = '';
		this.clusterArr = [];

		for (let i = 0; i < this.markers.length; i++) {
			this.markers[i].setVisible(false);
		}

		if (!arrival.length) {
			cityEl = '';

			if (this.filterProduction) {
				if (this.filterProduction !== 'All') {
					for (let i = 0; i < this.markers.length; i++) {
						if(this.markers[i].products.length>0){
							arrProducts = this.markers[i].products;
							arrProducts.forEach((el) => {
								if (el == this.filterProduction) {
									this.markers[i].setVisible(true);
								}
							});
						}
					}
				} else {
					for (let i = 0; i < this.markers.length; i++) {
						this.markers[i].setVisible(true);
					}
				}
			} else {
				for (let i = 0; i < this.markers.length; i++) {
					this.markers[i].setVisible(true);
				}
			}
		} else {
			if (!this.filterProduction) {
				cityEl = this.markers.filter(function (place) {
					if (place.city.toLowerCase().indexOf(arrival.toLowerCase()) !== -1) {
						//console.log(place);
					}
					return place.city.toLowerCase().indexOf(arrival.toLowerCase()) !== -1;
				});

				for (let i = 0; i < cityEl.length; i++) {
					cityEl[i].setVisible(true);
				}
			} else {
				if (this.filterProduction !== 'All') {
					cityEl = this.markers.filter(function (place) {
						if (place.city.toLowerCase().indexOf(arrival.toLowerCase()) !== -1) {
							//console.log(place);
						}
						return place.city.toLowerCase().indexOf(arrival.toLowerCase()) !== -1;
					});

					for (let i = 0; i < cityEl.length; i++) {
						if(cityEl[i].products.length>0){
							arrProducts = cityEl[i].products;
							arrProducts.forEach((el) => {
								if (el == this.filterProduction) {
									cityEl[i].setVisible(true);
								}
							});
						}
					}
				} else {
					for (let i = 0; i < this.markers.length; i++) {
						if (
							this.markers[i].city.toLowerCase().indexOf(this.inputVal.toLowerCase()) !== -1
						) {
							this.markers[i].setVisible(true);
						}
					}
				}
			}
		}

		for (let i = 0; i < this.markers.length; i++) {
			if(this.markers[i].getVisible()){
				this.clusterArr.push(this.markers[i]);
			}
		}
	}

	setClusterIcon() {
		let fillColor = '#00d372';

		const svg =

			`<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M33.4362 16.4427C33.2265 14.2458 32.491 12.1317 31.292 10.2789C30.0929 8.4262 28.4655 6.88932 26.5472 5.79816C24.6289 4.707 22.4762 4.09364 20.2709 4.0099C18.0656 3.92616 15.8725 4.37451 13.877 5.31706C11.8815 6.2596 10.1422 7.66865 8.80615 9.42513C7.47004 11.1816 6.57639 13.2339 6.20069 15.4086C5.825 17.5833 5.97831 19.8164 6.64767 21.9194C7.31703 24.0223 8.48277 25.9332 10.0464 27.4906L18.6194 36.0798C18.7698 36.2314 18.9487 36.3518 19.1458 36.4339C19.3429 36.516 19.5543 36.5583 19.7679 36.5583C19.9814 36.5583 20.1928 36.516 20.3899 36.4339C20.587 36.3518 20.7659 36.2314 20.9163 36.0798L29.457 27.4906C30.8986 26.0598 32.0036 24.3261 32.6918 22.4152C33.3801 20.5043 33.6343 18.4641 33.4362 16.4427Z" fill="${fillColor}"/>
			</svg>`;

		const icon = {
			url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
			strokeOpacity: 0,
			fillOpacity: 1.0,
			// origin: new google.maps.Point(0, 0), // origin
			// anchor: new google.maps.Point(0, 0), // anchor
			// size: new google.maps.Size(40, 40),
		};

		return icon;
	}

	rendererCluster() {
		let that = this;

		return {
			render({ count, position }) {
				return new google.maps.Marker({
					label: {
						text: String(count),
						color: '#fff',
						fontSize: '16px',
						className: 'cluster'
					},
					position,
					// icon: '/img/pin-cluster.svg',
					icon: that.setClusterIcon(),
					// adjust zIndex to be above other markers
					zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
				});
			}
		}
	}

	setCluster(){
		if(this.clusterMarkers) {
            this.clusterMarkers.clearMarkers();
            this.clusterMarkers = null;
        }

		let markers = this.clusterArr;
		let map = this.map;

		function onClusterClickHandler(clusterIcon, event) {
			map.setZoom(map.getZoom() + 2.5);

			if(map.getZoom() <= 10) {
				map.setZoom(map.getZoom() + 1);
			}
			map.setCenter({ lat: clusterIcon.latLng.lat(), lng: clusterIcon.latLng.lng() });	
		}
		

		// Add a marker clusterer to manage the markers.
		this.clusterMarkers = new MarkerClusterer({
			markers, map,zoomOnClick: true, maxZoom: 15, gridSize: 20, minimumClusterSize: 2, renderer: this.rendererCluster(),});
	}

	triggerHandler() {
		const btnMap = this.triggerBtnMap;
		const btnList = this.triggerBtnList;

		btnMap.addEventListener('click', () => {
			$(this.mapWrp).addClass('show');
			$(btnMap).removeClass('show');
			$(btnList).addClass('show');
		});

		btnList.addEventListener('click', () => {
			$(this.mapWrp).removeClass('show');
			$(btnMap).addClass('show');
			$(btnList).removeClass('show');
		});

		$('#filter-form-select-1').on('select2:select', (e) => {
			var select_val = $(e.currentTarget).val();
			this.filterProduction = select_val;
			this.filterMarkers(false, false, true);
			this.setCluster();
		});

		$('body').on('keypress keyup change input', '[data-input]', (e) => {
			this.inputVal = e.target.value;
			this.stateMarks(this.inputVal);
			this.setCluster();
		});

		$('[data-reset]').on('click', () => {
			this.inputVal = false;
			this.stateMarks(this.inputVal);
			this.setCluster();
		});
	}
}
