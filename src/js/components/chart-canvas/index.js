import PerfectScrollbar from 'perfect-scrollbar';
import { debounce } from 'throttle-debounce';
import { isDesktop } from '../../utils/breakpoints';
import { install } from 'resize-observer';

export default class ChartCanvas {
  
	constructor() {
		this.wrapNode = document.querySelector('[data-chart]');

		if (this.wrapNode) {
			this.render();
		}
	}

	render() {
    install();

		this.canvasNode = this.wrapNode.querySelector('[data-canvas]');
		if (!this.canvasNode) return;

		const chartModule = import(
			/* webpackChunkName: "chart" */ 'chart.js/auto/auto.esm'
		);
		const chartDataLabelsPlugin = import(
			/* webpackChunkName: "plugin-datalabels" */ 'chartjs-plugin-datalabels'
		);

		chartModule.then((module) => {
			const Chart = module.default;

			chartDataLabelsPlugin.then((plugin) => {
				const ChartDataLabels = plugin.default;

				Chart.register(ChartDataLabels);

				this.fontFamily =
					'"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

				this.chartData = this.wrapNode.getAttribute('data-chart');
				const obj = JSON.parse(this.chartData);

				this.sum = obj.sum || [];
				this.start = obj.start || [];
				this.end = obj.end || [];

				this.labels = obj.labels || [];

				this.data = {
					labels: this.labels,
					datasets: [
						{
							type: 'line',
							data: this.sum,
							fill: false,
							borderColor: 'rgb(0, 211, 114)',
							pointStyle: 'circle',
							pointBackgroundColor: 'rgb(0, 0, 0)',
							pointBorderColor: 'rgb(0, 0, 0)',
							datalabels: {
								align: 'end',
								anchor: 'end',
								display: true,
								backgroundColor: function (context) {
									return context.dataset.backgroundColor;
								},
								formatter: (i, j) => {
									const idx = j.dataIndex;

									if (i === this.start[idx]) {
										return i;
									} else {
										return `+${this.end[idx]}`;
									}
								},
								borderRadius: 4,
								color: 'rgb(0, 0, 0)',
								font: {
									size: 14,
									family: this.fontFamily,
								},
							},
						},
						{
							type: 'bar',
							data: this.end,
							backgroundColor: ['rgb(0, 211, 114)'],
							stack: 'stack0',
							barThickness: 24,
							maxBarThickness: 24,
							minBarLength: 0,
							datalabels: {
								display: false,
							},
						},
						{
							type: 'bar',
							data: this.start,
							backgroundColor: ['rgb(255, 255, 255)'],
							stack: 'stack0',
							barThickness: 24,
							maxBarThickness: 24,
							minBarLength: 0,
							datalabels: {
								display: false,
							},
						},
					],
				};

				this.config = {
					plugins: [ChartDataLabels],
					data: this.data,
					options: {
						plugins: {
							legend: {
								display: false,
							},
							title: {
								display: true,
								text: '', // нужно оставить пустым
							},
							tooltip: {
								enabled: false,
							},
						},
						responsive: true,
						scales: {
							x: {
								display: true,
								ticks: {
									color: 'rgb(0, 0, 0)',
									font: {
										size: 14,
										family: this.fontFamily,
									},
								},
								grid: {
									color: 'transparent',
								},
							},
							y: {
								display: true,
								ticks: {
									color: 'rgb(0, 0, 0, 0.4)',
									font: {
										size: 14,
										family: this.fontFamily,
									},
								},
								grid: {
									color: 'rgb(0, 0, 0, 0.1)',
								},
							},
						},
					},
				};

				var chart = new Chart(this.canvasNode, this.config);
				this.initScroll();

				window.addEventListener('resize', () => {
					chart.destroy();
					chart = new Chart(this.canvasNode, this.config);
				});
			});
		});
	}

	initScroll() {
		this.content = this.wrapNode.querySelector('[data-roll]');

		this.ps = new PerfectScrollbar(this.content, {
			suppressScrollY: true,
			wheelPropagation: true,
			minScrollbarLength: 140,
		});

		window.addEventListener(
			'resize',
			debounce(100, () => {
				this.ps.update();
			})
		);
	}
}
