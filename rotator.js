/**!
 * Rotator
 * A javascript banner rotator built on jQuery with extensive features and expandability.
 *
 * @author     cmfolio & agroism.com
 * @docs       http://web.cmfolio.com/projects/rotator/
 * @source     https://github.com/chadwithuhc/rotator-js
 * @copyright  MIT License
 * @version    v0.9.8 R05.06.13
 */
(function ($) {

	var info = {
		id: 'Rotator',
		jQname: 'rotator',
		version: '0.9.8 R05.06.13'
	};

	/**
	 * Privates
	 */
	// holds the setInterval
	var timer = false;

	// holds the current slide
	var $current;

	// starts the interval timer
	var startInterval = function () {
		timer = setInterval(function () {
			this.next()
		}, this.options.interval);
		return true;
	};

	// stops the interval timer
	var stopInterval = function () {
		clearInterval(timer);
		timer = false;
		return true;
	};

	// fixes the id to account for going over or under
	var fixId = function (id, fixForArray) {
		id = parseInt(id);
		if (id < 1) {
			id = this.$slides.length;
		}
		else {
			if (id > this.$slides.length) {
				id = 1;
			}
		}
		return (fixForArray || false) ? (parseInt(id) - 1) : parseInt(id);
	};

	// builds the rotator nav and inserts it
	var buildNav = function () {
		var config = this.options;
		
		this.$nav = $('<ul />').attr({ id: this.id + '-nav', 'class': 'rotator-nav' });

		// add a templated nav item
		var addNavItem = function (data) {
			this.$nav.append($('<li />').attr({ 'class': data.type }).append($('<a />').attr({ href: '#' + data.type, 'class': data.type + '-icon' }).attr(config.slideIdAttr, data.type).html(data.text)));
		};

		// add a templated nav item step
		var addNavItemStep = function (data) {
			this.$nav.append($('<li />').attr({ 'class': 'step ' + data.type }).append($('<a />').attr({ href: '#' + config.slideNumClass.replace(/\#/, data.num).replace(/\./, '') }).html(data.text).attr(config.slideIdAttr, data.num)));
		};

		// previous link
		if (!!config.nav.prev) {
			addNavItem({ text: (config.nav.prev == true) ? '<' : config.nav.prev, type: 'prev' });
		}

		// stop link
		if (!!config.nav.stop) {
			addNavItem({ text: (config.nav.stop == true) ? 'stop' : config.nav.stop, type: 'stop' });
		}

		// start link
		if (!!config.nav.start) {
			addNavItem({ text: (config.nav.start == true) ? 'start' : config.nav.start, type: 'start' });
		}

		// create a step for each slide
		if (!!config.nav.icons || !!config.nav.numbers) {
			var step_type = (!!config.nav.numbers) ? 'number' : 'icon';
			var text = null;
			if (step_type == 'icon') {
				text = (config.nav.icons === true) ? '&bull;' : config.nav.icons;
			}
			for (var num = 1; num <= this.$slides.length; num++) {
				addNavItemStep({ type: step_type, text: text || num, num: num });
			}
		}

		// next link
		if (!!config.nav.next) {
			addNavItem({ text: (config.nav.next == true) ? '>' : config.nav.next, type: 'next' });
		}

		// clicking inside nav
		this.$nav.find('a').click(function (e) {
			e.preventDefault();
			var clicked = $(this);
			setTimeout(function () {
				this.trigger('navClick', {
					event: e,
					navClicked: {
						id: parseInt(clicked.attr(config.slideIdAttr)),
						name: this.$slides.eq(fixId(parseInt(clicked.attr(config.slideIdAttr)), true)).attr(config.slideNameAttr),
						obj: this.$slides.eq(fixId(parseInt(clicked.attr(config.slideIdAttr)), true))
					}
				})
			}, config.transitionDuration + 500);
			this.resetInterval(true);
			var slideIdAttr = $(this).attr(config.slideIdAttr);
			switch (slideIdAttr) {
				case 'prev':
					this.prev();
					break;
				case 'next':
					this.next();
					break;
				case 'start':
					this.start();
					break;
				case 'stop':
					this.stop();
					break;
				// its got to be a slide num
				default:
					this.goTo(slideIdAttr);
			}
			if (config.stopOnClick == true && slideIdAttr != 'start' && slideIdAttr != 'stop') {
				this.stop();
			}
		});

		// and insert
		if (config.nav.position == 'before') {
			this.$el.before(this.$nav);
		}
		else {
			if (config.nav.position == 'inside') {
				this.$el.append(this.$nav);
			}
			else {
				this.$el.after(this.$nav);
			}
		}

		// set some shortcuts
		this.$el.nav = this.$nav;
		this.$nav.steps = this.$nav.find('.step');
		// set first slide to current
		this.$nav.steps.eq(0).addClass(config.currentNavClass.replace(/\./g, ''));
	}

	// runs an event if available
	var setupTrigger = function () {
		var self = this;
		var old_trigger = self.trigger;
		var extendedTrigger = function extendedTrigger(name, data) {
			data = $.extend({}, self.getEventData(), data || {});
			return old_trigger.call(self, name, data);
		};

		self.trigger = extendedTrigger;
	};
	// end privates

	$.Rotator = $.Plugin.extend({

			defaults: {
				first: 1, // which slide num to start at
				random: false, // start at a random slide (overrides config.first)
				reorderSlides: false, // reorder the slides by rewriting to DOM if they are in random order
				transition: 'fade', // transition name
				transitionDuration: 1000, // effect speed in milliseconds
				transitions: {}, // pass in additional transitions at generation
				interval: 7000, // interval between slides in milliseconds
				slideClass: '.slide', // the slide class
				slideNumClass: '.slide-#', // generates slide numbers, use # for the number placeholder
				slideIdAttr: 'data-slide-id', // the attribute for the slide id, e.g. data-slide-id="3"
				slideNameAttr: 'data-slide-name', // the attribute for the slide name (a unique text string), e.g. data-slide-name="SaleHalfOff"
				width: 980, // width of container
				height: 360, // height of container
				nav: { // nav options, set to false for no nav
					prev: true,
					next: true,
					start: false,
					stop: false,
					numbers: true,
					icons: false,
					position: 'after' // [before|inside|after]
				},
				currentNavClass: '.current', // the class of the selected nav item
				stopOnClick: true, // stop rotating on nav click
				loadingClassName: 'loading', // class name of loading class
				autostart: true, // whether or not to autostart rotation
				quickLoad: false, // load without waiting for images
				zIndex: 10, // z-index to start at
				//ieFadeFix: false, // IE has problems with complete black in fading images; DEPRECATED
				debug: false
			},


			// jQuery object vars available
			$slides: null,
			$nav: null,

			// the initiation of the rotator. gets all the slides, assigns classes, and adds nav
			initialize: function () {
				var config = this.options;
				
				setupTrigger.apply(this);

				// get the slides
				this.$slides = this.$(config.slideClass);

				// if starting random, generate a num
				if (config.random == true) {
					config.first = (Math.floor(Math.random() * 100) % this.$slides.length) + 1;
				}

				// add the slide numbers
				var i = config.first,
					tmpSlides = [];
				this.$slides.each(function () {
					if (i > this.$slides.length) {
						i = 1;
					}
					tmpSlides[i - 1] = $(this).attr(config.slideIdAttr, i).addClass(config.slideNumClass.replace(/\#/, i).replace(/\./, ''))[0];
					i++;
				});

				// slides DOM reordering
				if (config.reorderSlides == true && config.random == true) {
					this.$slides.remove();
					this.$el.append(tmpSlides);
				}

				// recollect
				this.$slides = $(tmpSlides);
				$current = this.$slides.eq(0).css({ zIndex: config.zIndex });

				// slides clicking event
				this.$slides.find('a').click(function (e) {
					this.trigger('click', { event: e });
				});

				// copy any transitions that are added
				config.transitions = $.extend(this.transitions, config.transitions);

				// add the nav
				if (!!config.nav && this.$slides.length > 1) {
					buildNav();
				}

				// init event
				this.trigger('initialize');

				// when the first slide is done loading, show the rotator.
				var loadFn = function () {
					config.rotatorLoaded = true;
					this.$el.removeClass(config.loadingClassName);

					config.events.onLoadDefault = function () {
						$current.fadeIn(500);

						// fade in the nav
						if (this.$nav) {
							this.$nav.fadeIn();
						}
					};
					// if no onLoad event, run default loading event
					if (!options.events) {
						config.events.onLoadDefault();
					}
					else {
						if (!options.events.onLoad) {
							config.events.onLoadDefault();
						}
					}

					// run onLoad event
					this.trigger('load');

					// autostart rotating
					if (config.autostart == true && this.$slides.length > 1) {
						this.start();
					}
				}
				// quickloader
				if (config.quickLoad == true) {
					//loadFn.apply(this);
				}
				// otherwise start after loading
				else {
					// wait for the first image to load, then start
					var first_img = $current.find('img');
					if (first_img.length > 0) {
						first_img.one('load', loadFn);
					}
					// if no images, just start
					else {
						//loadFn.apply(this);
					}

					// otherwise if we still haven't started by the time the window loads, then just start
					$(window).load(function () {
						if (config.rotatorLoaded != true) {
							//loadFn.apply(this);
						}
					});
				}

				return this;
			}, // end init

			// start the rotation
			start: function () {
				this.trigger('start');
				startInterval();
				return this;
			},

			// stops the rotation
			stop: function () {
				this.trigger('stop');
				stopInterval();
				return this;
			},

			// switches to the next slide
			next: function () {
				return this.goTo(this.current() + 1);
			},

			// switches to prev slide
			prev: function () {
				return this.goTo(this.current() - 1);
			},

			// gets the id of the current shown slide
			current: function () {
				// return -1 if it's not applicable yet; this should never happen
				if (typeof $current === 'undefined') {
					return -1;
				}
				return parseInt($current.attr(this.options.slideIdAttr));
			},

			// go to a specific slide num
			goTo: function (id) {
				var config = this.options;
				
				if (typeof id == 'undefined' || typeof this.transitions[config.transition] !== 'function' || this.$slides.filter(':animated').length > 0) {
					return this;
				}

				// get id's
				var to = id, from = this.current();

				// we aren't going anywhere
				if (from == to) {
					return this;
				}

				// increase z-index if integer
				config.zIndex = (config.zIndex !== 'auto' && typeof parseInt(config.zIndex) == 'number') ? parseInt(config.zIndex) + 2 : config.zIndex;

				// add some additional data to the slides
				var from_slide = this.$slides.eq(fixId(from, true));
				$.extend(from_slide, { id: from_slide.attr(config.slideIdAttr), name: from_slide.attr(config.slideIdAttr) });
				var to_slide = this.$slides.eq(fixId(to, true));
				$.extend(to_slide, { id: to_slide.attr(config.slideIdAttr), name: to_slide.attr(config.slideIdAttr) });

				// call the transition if it exists
				this.transitions[config.transition](from_slide, to_slide, config);

				// set to the current slide
				$current = to_slide;

				// select the nav number
				if (!!config.nav) {
					this.$nav.steps.removeClass(config.currentNavClass.replace(/\./g, '')).eq(fixId(to, true)).addClass(config.currentNavClass.replace(/\./g, ''));
				}

				// run onChange event
				this.trigger('change');

				return this;
			},

			// applies the ie fading fix
			ieFadeFix: function (enable) {
				this.$el.css({ backgroundColor: (enable || true) ? 'black' : 'transparent' });
				return this;
			},

			// grabs rotator and slide data at time of event
			getEventData: function () {
				var config = this.options;
				var current = this.current();

				var eventData = {
					rotator: this,
					slides: {
						current: {
							id: current,
							name: this.$slides.eq(fixId(current, true)).attr(config.slideNameAttr),
							obj: this.$slides.eq(fixId(current, true))
						},
						next: {
							id: fixId(current + 1),
							name: this.$slides.eq(fixId(current + 1, true)).attr(config.slideNameAttr),
							obj: this.$slides.eq(fixId(current + 1, true))
						},
						prev: {
							id: fixId(current - 1),
							name: this.$slides.eq(fixId(current - 1, true)).attr(config.slideNameAttr),
							obj: this.$slides.eq(fixId(current - 1, true))
						},
						total: this.$slides.length
					}
				};
				return eventData;
			},

			// clears the interval for rotating and starts it again
			// in case you need to restart counting down
			resetInterval: function () {
				stopInterval();
				startInterval();
				return this;
			},

			// tells you whether we're on timer or not
			isRunning: function () {
				return (timer === false);
			},

			// holds all the available effects for changing slides.
			// to add a new transition, simply add a new function.
			transitions: {
				swipe: function (from, to, config) {
					config.zIndex++;
					width = { start: 0, end: to.parent().innerWidth() }, img = to;
					img.css({ width: width.start, zIndex: config.zIndex, display: 'block'}).animate({ width: width.end }, to.transitionDuration, function () {
						from.hide()
					});
				},
				push: function (from, to, config) {
					var parent = from.parent();
					var leftpx = ((config.width * to.attr(config.slideIdAttr)) - config.width);
					if (leftpx !== 0) {
						leftpx = leftpx * -1;
					}
					parent.animate({ left: leftpx }, config.transitionDuration);
				},
				fade: function (from, to, config) {
					from.fadeOut(config.transitionDuration);
					to.fadeIn(config.transitionDuration);
				}
			}
		},
		// Plugin options
		info);

})(jQuery);