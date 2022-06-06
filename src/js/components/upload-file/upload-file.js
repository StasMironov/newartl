const uploadFile = {
	init() {
		const starters = document.querySelectorAll('[data-upload-file]');
		if(!starters.length>0) return;
	
		//console.log(starter);

		if (!starters.length) return

		const previewLabels = document.querySelectorAll('[data-upload-label]');
		const inputs = document.querySelectorAll('[data-upload-file]');
		//console.log(starters);

		starters.forEach(function(starter, index){
			const fileText = $(starter).closest('form').find('[data-filetextres]');
			const tempFileText = $(starter).data('filetext');

			
			let typeText;
			
			if($(starter).attr('data-typetext')){
				typeText = $(starter).attr('data-typetext');
				
			}
			
			starter.addEventListener('change', (e) => {
				if(starter.files.length) {
					const previewContainer = starter.closest('[data-upload-parent]');
					const previewLabel = previewLabels[index];
					const input = inputs[index];
					const maxSize = input.dataset.maxSize;
					const file = starter.files[0];
					const fileStringToArray = file.name.split('.');
					const fileName = fileStringToArray.slice(0, fileStringToArray.length - 2).join('.');
					const fileType = fileStringToArray.pop().toUpperCase();
					const errorMessage = input.dataset.errorsize;
					let fileExtension = input.getAttribute('accept'); 
					fileExtension = fileExtension.split(',')
					
					let fileSize;

					// fileExtension.forEach(type=>{
					// 	console.log(type);
					// })

					



					if (file.size <= maxSize * 1000000) {
						if (file.size > 1000000) {
							fileSize = Math.round(file.size / 1000000) + 'Mb'
						} else {
							fileSize = Math.round(file.size / 1000) + 'Kb'
						}

						$(fileText).text(tempFileText);
						$(fileText).removeClass('error');
						
					} else {
						$(fileText).text(errorMessage);
						$(fileText).addClass('error');
						//starter.closest('form').pristine.addError(starter, input.dataset.sizeMessage);
					
						if (file.size > 1000000) {
							fileSize = Math.round(file.size / 1000000) + 'Mb'
						} else {
							fileSize = Math.round(file.size / 1000) + 'Kb'
						}
						//return
					}

					
					if ($.inArray(`.${fileType.toLowerCase()}`, fileExtension) == -1) {
						$(fileText).text(typeText);
						$(fileText).addClass('error');

						if(file.size <= maxSize * 1000000){
							$(fileText).text(typeText);
						} else {
							$(fileText).text(errorMessage + ' ' + typeText);
						}
					} else {
						if(file.size <= maxSize * 1000000){
							$(fileText).text(tempFileText);
							$(fileText).removeClass('error');
						} else {
							$(fileText).text(errorMessage);
						}
					}


					const fileContainer = document.createElement('div');
					fileContainer.classList.add('file-wrapper');
					fileContainer.innerHTML = `<span class="icon" aria-hidden="true">` +
						`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">` +
						`<path d="M12.5921 17.9172L17.246 9.85647C18.246 8.12442 17.6931 5.85115 15.8945 4.81269V4.81269C14.1624 3.81269 12.0224 4.44242 11.0608 6.10785L6.06085 14.7681C5.407 15.9006 5.76272 17.4383 6.96183 18.1306C8.16095 18.8229 9.73713 18.4006 10.4294 17.2015L14.891 9.47388C15.2371 8.87432 15.0119 8.03369 14.4123 7.68754C13.8128 7.34138 12.9721 7.56663 12.626 8.16619L8.39522 15.4941" stroke="currentColor" stroke-miterlimit="10"></path>` +
						`</svg>` +
						`</span>` +
						`<div class="file-wrapper__text">` +
						`<p class="file-wrapper__name">${fileName}</p>` +
						`<p class="file-wrapper__info">${fileType}, ${fileSize}</p>` +
						`</div>`;
					const button = document.createElement('div');
					button.innerHTML = `<button type="button" class="file-wrapper__close" aria-label="удалить загруженные данные">` +
						`<span class="icon" aria-hidden="true">` +
						`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">` +
						`<path d="M18.7072 6.00008L6.00017 18.7071L5.29307 18L18.0001 5.29297L18.7072 6.00008Z"></path>` +
						`<path d="M6.00008 5.29297L18.7071 18L18 18.7071L5.29297 6.00008L6.00008 5.29297Z"></path>` +
						`</svg>` +
						`</span>` +
						`</button>`;
					fileContainer.appendChild(button);
					button.addEventListener('click', function () {
						fileContainer.remove();
						input.value = '';
						$(fileText).text(tempFileText);
						$(fileText).removeClass('error');
						previewLabel.classList.remove('visually-hidden')
					});
					previewContainer.appendChild(fileContainer);
					previewLabel.classList.add('visually-hidden')
				}


			})
		});

		
	}
}

export default uploadFile;
