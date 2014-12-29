(function($) {
	$.fn.mModal = function(options) {
		var settings = $.extend({
			modal: null,						// the modal itself
			callbacks: [],						// button callbacks
			appearAnimation: 'fade',			// 'fade' or 'slide'
			disappearAnimation: 'fade',			// 'fade' or 'slide'
			appearSlideDirection: 'down',		// 'up', 'right', 'down' or 'left'
			disappearSlideDirection: 'up',		// 'up', 'right', 'down' or 'left'
			animateResize: true,				// animate to the new centre position instead of instant
			closeButton: true					// show a close button at the upper right corner
		}, options);
		
		if(settings.modal == null || typeof settings.modal == 'undefined') {
			console.error('The given modal was not set or found!');
			return false;
		}
		
		var modalLink = $(this);
		var modalButtons = settings.modal.find('.mModal-buttons').children();
		var modalCloseButton = (settings.closeButton) ? $('<div class="mModal-close"></div>').appendTo(settings.modal) : $();
		var modalCover = null;
		
		settings.modal.off('click').click(function(e) {
			e.stopImmediatePropagation();
		}).hide();
		modalButtons.outerWidth(settings.modal.width() / modalButtons.length);
		
		settings.modal.openModal = function() {
			modalCover = settings.modal.wrap($('<div class="mModal-cover"></div>')).parent();
			modalCover.off('click').click(function(e) {
				settings.modal.closeModal();
			}).hide();
			
			if(settings.appearAnimation == 'slide') {
				modalCover.fadeIn('fast', function() {
					settings.modal.show();
					
					var modalPositionLeft = ($(window).outerWidth() / 2) - (settings.modal.outerWidth() / 2);
					var modalPositionTop = ($(window).outerHeight() / 2) - (settings.modal.outerHeight() / 2);
					
					var startPositionLeft = (settings.appearSlideDirection == 'left' || settings.appearSlideDirection == 'right') ?
											(settings.appearSlideDirection == 'left' ? ($(window).outerWidth()) : (-modalPositionLeft)) : modalPositionLeft;
					var startPositionTop = (settings.appearSlideDirection == 'up' || settings.appearSlideDirection == 'down') ?
											(settings.appearSlideDirection == 'up' ? ($(window).outerHeight()) : (-modalPositionTop)) : modalPositionTop;
											
					settings.modal.css({ left: startPositionLeft, top: startPositionTop });
					settings.modal.stop(true, false).animate({ left: modalPositionLeft, top: modalPositionTop });
				});
			} else {
				modalCover.fadeIn('fast');
				settings.modal.show();
			}

			modalButtons.off('click').click(function(e) {
				e.preventDefault();

				var modalButtonCallback = $(this).attr('data-mModalCallback');
				if(typeof modalButtonCallback == 'undefined') {
					return false;
				}
				
				if(typeof settings.callbacks[modalButtonCallback] != 'undefined') {
					settings.callbacks[modalButtonCallback](settings.modal);
				}
			});
		};
		
		settings.modal.centerModal = function() {
			var modalPositionLeft = ($(window).outerWidth() / 2) - (settings.modal.outerWidth() / 2);
			var modalPositionTop = ($(window).outerHeight() / 2) - (settings.modal.outerHeight() / 2);
			
			if(settings.animateResize == true) {
				settings.modal.stop(true, false).animate({ left: modalPositionLeft, top: modalPositionTop }, 'fast', 'swing');
			} else {
				settings.modal.css({ left: modalPositionLeft, top: modalPositionTop });
			}			
		};
		
		settings.modal.closeModal = function() {
			if(settings.disappearAnimation == 'slide') {
				var modalPositionLeft = ($(window).outerWidth() / 2) - (settings.modal.outerWidth() / 2);
				var modalPositionTop = ($(window).outerHeight() / 2) - (settings.modal.outerHeight() / 2);
			
				var endPositionLeft = (settings.disappearSlideDirection == 'left' || settings.disappearSlideDirection == 'right') ?
												(settings.disappearSlideDirection == 'left' ? (-modalPositionLeft) : ($(window).outerWidth())) : modalPositionLeft;
				var endPositionTop = (settings.disappearSlideDirection == 'up' || settings.disappearSlideDirection == 'down') ?
										(settings.disappearSlideDirection == 'up' ? (-modalPositionTop) : ($(window).outerHeight())) : modalPositionTop;

				settings.modal.stop(true, false).animate({ left: endPositionLeft, top: endPositionTop }, 'fast', 'swing', function() {
					modalCover.fadeOut('fast', function() {
						settings.modal.hide();
						settings.modal.unwrap();
					});
				});
			}
			else
			{
				modalCover.fadeOut('fast', function() {
					settings.modal.hide();
					settings.modal.unwrap();
				});
			}
		};

		modalLink.click(function(e) {
			e.preventDefault();
			settings.modal.openModal();
		});
		
		modalCloseButton.off('click').click(function(e) {
			e.preventDefault();
			settings.modal.closeModal();
		});
		
		$(window).off('resize').resize(function(e) {
			settings.modal.centerModal();
		}).trigger('resize');
	};
} (jQuery));