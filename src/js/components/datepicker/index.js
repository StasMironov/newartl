import gsap from "gsap";
import { isMob} from "../../utils/breakpoints";
import {debounce} from "throttle-debounce";
// import PerfectScrollbar from 'perfect-scrollbar';

export default class Datepicker {
    constructor() {
        this.nodes = document.querySelectorAll('[data-datepicker]');

        if (!this.nodes.length) return;

        this.init();
    }

    init() {
        this.nodes.forEach((el, idx) => {
            if (!el.init) this.render(el, idx); // пропуск, если ранее был проинициализирован
        });

        document.addEventListener('click', (e) => {
            if (!e.target.hasAttribute('data-datepicker-toggle')
                && !e.target.hasAttribute('data-datepicker-box')
                && !e.target.closest('[data-datepicker-box]')
                && !e.target.closest('.select2-container')) {
                this.reverse(this.nodes); // закрыть все datepicker
            }
        });

        window.addEventListener(
            'resize',
            debounce(100, () => {
                this.reverse(this.nodes); // закрыть все datepicker
            }));
    }


    render(datepicker, idx) {
        const toggle = datepicker.querySelector('[data-datepicker-toggle]');
        toggle.addEventListener('click', () => {
			//console.log(datepicker.onlyStart);
            if (datepicker.active) {
                datepicker.timeline.reverse(); // закрыть

                if (datepicker.onlyStart) {
                    datepicker.classList.add('only-start');

                    selectEnd.disabled = true;

                    radioEnd.forEach((el) => {
                        el.disabled = true;
                    });
                } else {
                    datepicker.classList.remove('only-start');
                    selectEnd.enabled = true;

                    radioEnd.forEach((el) => {
                        el.disabled = false;
                    });
                }
            } else {
                datepicker.timeline.play(); // открыть
            }

            this.reverse(this.nodes, idx); // закрыть все, кроме текущего
        });

        const dates = {
            startMonth: undefined,
            endMonth: undefined,
            startYear: undefined,
            endYear: undefined
        };

        datepicker.onlyStart = false;

        const input = datepicker.querySelector('[data-datepicker-input]'); // скрытый инпут, где будут храниться начальная и конечная даты
        const placeholder = datepicker.querySelector('[data-datepicker-placeholder]');

        const placeholderInitValue = placeholder.innerText.trim() || '';

        const selectStart = datepicker.querySelector('[data-datepicker-select-start]');
        const selectEnd = datepicker.querySelector('[data-datepicker-select-end]');

        const $selectStart = $(selectStart);
        const $selectEnd = $(selectEnd);

        const radioStart = datepicker.querySelectorAll('[data-datepicker-radio-start]');
        const radioEnd = datepicker.querySelectorAll('[data-datepicker-radio-end]');

        const resetButton = datepicker.querySelector('[data-datepicker-reset]');
        const applyButton = datepicker.querySelector('[data-datepicker-apply]');

        const checkbox = datepicker.querySelector('[data-datepicker-checkbox]');

		function stateSelect(){
			if (datepicker.onlyStart) {
				datepicker.classList.add('only-start');

				selectEnd.disabled = true;

				radioEnd.forEach((el) => {
					el.disabled = true;
                    el.checked = false;
				});
                dates.endMonth = undefined;
                try {
                    applyButton.disabled = this.checkUndefined(dates, datepicker) !== -1;
                }
                catch(err){
                }
			} else {
				datepicker.classList.remove('only-start');
				selectEnd.enabled = true;
				selectEnd.disabled = false;

				radioEnd.forEach((el) => {
					el.disabled = false;
				});
			}
		}

		//console.log(checkbox);

		if(checkbox) {
			checkbox.addEventListener('change', () => {
				if(checkbox.checked){
					datepicker.onlyStart = true;
                    radioStart.forEach((el) => {
                        // el.checked = false;
                         el.disabled = false;
                     });
                   // this.radioReset([...radioStart, ...radioEnd], dates);
				}
            	else {
					datepicker.onlyStart = false;
				}
                

				applyButton.disabled = this.checkUndefined(dates, datepicker) !== -1;

			//	console.log(datepicker.onlyStart);

				stateSelect();
        	});
		}

        

        $selectStart.on('change', (e) => {
            dates.startYear = e.target.value;

            this.selectOptionsCheck($selectEnd, $selectStart);

           // if(dates.startYear == dates.endYear) {
                this.radioReset([...radioStart, ...radioEnd], dates);
           // }


            

            applyButton.disabled = this.checkUndefined(dates, datepicker) !== -1;
        });

        $selectEnd.on('change', (e) => {
            dates.endYear = e.target.value;

            this.selectOptionsCheck($selectStart, $selectEnd, false);

            //if(dates.startYear == dates.endYear) {
                this.radioReset([...radioStart, ...radioEnd], dates);
            //}
           

            applyButton.disabled = this.checkUndefined(dates, datepicker) !== -1;
        });

        radioStart.forEach((radio, idx) => {
            radio.addEventListener('change', (e) => {
                //console.log(datepicker.onlyStart);
                dates.startMonth = e.target
                    .getAttribute('data-radio-text')
                    .toLowerCase();

                if(!datepicker.onlyStart) {
                    if (dates.startYear === dates.endYear) { // disabled для месяцев перед выбранным
                        radioEnd.forEach((r, id) => {
                            if (idx > id) {
                                r.disabled = true;
                                r.checked = false;
                            } else {
                                r.disabled = false;
                            }
                        });
                    }

                    if (dates.startYear < dates.endYear) { // disabled для месяцев после выбранного
                        radioStart.forEach((r, id) => {
                            r.disabled = false;
                        });
                    }  
                }
                

                applyButton.disabled = this.checkUndefined(dates, datepicker) !== -1;
            });
        });

        radioEnd.forEach((radio, idx) => {
            radio.addEventListener('change', (e) => {
                dates.endMonth = e.target
                    .getAttribute('data-radio-text')
                    .toLowerCase();

                    

                if (dates.startYear === dates.endYear) { // disabled для месяцев после выбранного
                    radioStart.forEach((r, id) => {
                        if (idx < id) {
                            r.disabled = true;
                            r.checked = false;
                        } else {
                            r.disabled = false;
                        }
                    });
                }

				if (dates.startYear < dates.endYear) { // disabled для месяцев после выбранного
                    radioStart.forEach((r, id) => {
                        r.disabled = false;
                    });
                }

                applyButton.disabled = this.checkUndefined(dates, datepicker) !== -1;
            });
        });

        const box = datepicker.querySelector('[data-datepicker-box]');
        const content = datepicker.querySelector('[data-datepicker-content]');
        // const roll = datepicker.querySelector('[data-datepicker-roll]');

        // TODO решил оставить нативный скролл, т.к. он смотрится лучше на мобиле.
        // TODO для кастомного придётся смещать контент, а это не предусмотрено в дизайне
        // const ps = new PerfectScrollbar(roll, {
        //     suppressScrollX: true,
        //     wheelPropagation: false,
        //     minScrollbarLength: 80,
        // });

        const timeline = gsap.timeline({
            paused: true, onStart: () => {
                datepicker.classList.add('is-active');

                if (isMob()) {
                    //window._disableScroll();
                }
            }, onComplete: () => {
                datepicker.active = true;

                // ps.update();

                timeline.invalidate();
            }, onReverseComplete: () => {
                datepicker.active = false;
                datepicker.classList.remove('is-active');
                $selectStart.select2('close');
                $selectEnd.select2('close');

                timeline.invalidate();

                //window._enableScroll();
            }
        });

        timeline
            .fromTo(box, {
                minHeight: 0, height: 0
            }, {
                minHeight: 'auto', height: 'auto', duration: '0.3', ease: 'none'
            })
            .fromTo(content, {
                opacity: 0, y: 16
            }, {
                opacity: 1, y: 0, duration: '0.25', ease: 'power1.out'
            }, '0.15');

        datepicker.timeline = timeline;

        resetButton.addEventListener('click', () => {
            datepicker.onlyStart = false; 
            
            for (let key in dates) {
                dates[key] = undefined;
            }

            $selectStart.val('').trigger('change');
            $selectEnd.val('').trigger('change');

            this.resetOptions($selectStart);
            this.resetOptions($selectEnd);

            this.radioReset([...radioStart, ...radioEnd], dates, true);

            input.value = '';
            placeholder.innerText = placeholderInitValue;
            placeholder.classList.remove('rendered');

            const event = new CustomEvent('change', {
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(event);

            datepicker.classList.remove('filled');
            datepicker.classList.remove('only-start');

            timeline.reverse();
           
            if(checkbox) {
               checkbox.checked = false; 
            }

            stateSelect();
            
        });

        applyButton.disabled = this.checkUndefined(dates, datepicker) !== -1; // если хотя бы одно поле в date равно undefined

        applyButton.addEventListener('click', (e) => {
            e.preventDefault();
            let value = '';

            if (datepicker.onlyStart) {
                value += `${dates.startMonth.toLowerCase()} ${dates.startYear} по н.в`;
				placeholder.innerText = `${value}`;
            } else {
                value += `${dates.startMonth.toLowerCase()} ${dates.startYear} – ${dates.endMonth.toLowerCase()} ${dates.endYear}`;
				placeholder.innerText = value;
			}


            input.value = value;
            placeholder.classList.add('rendered');

            const event = new CustomEvent('change', {
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(event);

            datepicker.classList.add('filled');

            timeline.reverse();
        });

        $('body').on('keydown', 'input, select', function (e) {
            if (e.key === "Enter") {
                $(applyButton).click();
                return false;
            }
        });

        datepicker.init = true;
    }

    selectOptionsCheck($selectCheck, $currentSelect, more = true) { // не должно быть возможности выбрать год окончания, раньше года начала
        const options = $selectCheck[0].querySelectorAll('option');

        const currentValue = $currentSelect.val(); // выбранное значение (текущий селект)

        options.forEach((option) => {
            const value = option.value;

            if (more) {
                option.disabled = currentValue > value;
            } else {
                option.disabled = currentValue < value;
            }
        });
    }

    radioReset(arr, dates, btnRes = false) { // сброс всех месяцев
        if(!btnRes) {
            arr.forEach((el) => {
                el.disabled = false;
            }); 
        } 
        else {
             arr.forEach((el) => {
                el.checked = false;
                el.disabled = false;
            });

            dates.startMonth = undefined;
            dates.endMonth = undefined;
            
        }
    }

    resetOptions($select) { // сброс всех option
        const options = $select[0].querySelectorAll('option');

        options.forEach((option) => {
            option.disabled = false;
        });
    }

    checkUndefined(obj, datepicker) { // проверка dates на наличие undefined
       // console.log(datepicker.onlyStart)
        if (datepicker.onlyStart) {
            if ((obj.startYear && obj.startMonth)) {
                return -1;
            }
        } else {
            //console.log(Object.values(obj))
            return Object.values(obj).indexOf(undefined);
        }

    }

    reverse(arr, idx = undefined) {
        for (let i = 0; i < arr.length; i++) {
            if (idx === i) continue;

            if (arr[i].active) {
                arr[i].timeline.reverse();
            }
        }
    }
}
