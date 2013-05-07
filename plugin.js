/**!
 * Plugin
 * A Plugin for managing plugins in jQuery
 *
 * @author    cmfolio
 * @docs      http://web.cmfolio.com/projects/plugin-js/
 * @source    _Source_URL_
 * @license   MIT License
 * @version   v0.5.0 R05.06.2013
 * @requires  jQuery 1.4+
 */
;(function ($) {

	$.Plugin = (function () {

		// Plugin.js version
		var version = '0.5.0';

		// return a basic plugin
		var Plugin = function Plugin(elements, options) {
			return __constructor.apply(this, arguments);
		};
		
		var __constructor = function (elements, options) {
			options = options || {};

			// Setup a bogus element for events
			// This is in case we don't have an element before setting or triggering events
			this.$el = Plugin.bogusElement;

			// Setup the configuration
			$.extend(true, this, options || {});

			// Setup and cache the element
			this.setElement(elements);

			// Run the `initialize()` if available
			if (typeof this.initialize === 'function') {
				this.initialize.apply(this, [elements, options]);
			}
			
			return this;
		};

		/**
		 * Static Variables on the `Plugin` constructor
		 */
		$.extend(Plugin, {
			
			// Plugin.js Version
			'version': version,
			
			'config': {
				'jQevents': ['on','off','one','trigger'],
				'events': {
					'error': function (e, message) {
						Plugin.console.log(message);
					}
				}
			},
			
			// Mockup console for safety
			'console': function () {
				return console || { log: $.noop, debug: $.noop, error: $.noop }
			}(),

			// Plugin statics that should be set for each new plugin
			'statics': {
				'version': null,
				'name': null,
				'jQname': null
			},

			/**
			 * Events Mixin
			 *
			 * Allow jQuery events to be used directly on the object, in the context of an element
			 * 
			 * @param target   The object to copy to
			 * @param context  The object to get the methods from and trigger on
			 */
			'eventProxy': function (target, context) {
				var e, i, alias,
				    events = this.config.jQevents,
				    // jQuery 1.4 compat
				    map = { 'on':'bind','off':'unbind' },
				    jQ4 = !context.on && !!context.bind;
				for (i in events) {
					alias = e = events[i];
					if (jQ4 && /^(on|off)$/.test(alias)) { e = map[e]; } // jQuery 1.4 compat
					
					if (events.hasOwnProperty(i) && typeof context[e] === 'function') {
						target[alias] = $.proxy(context[e], context);
					}
				}
				return target;
			},

			/**
			 * Bogus Element
			 * 
			 * Returns a bogus element to use for Events
			 */
			'bogusElement': function () {
				return $('<div/>').extend({ bogus: true });
			}(),

			/**
			 * Extend a Plugin
			 *
			 * Allows you to extend a plugin
			 *
			 * @param properties
			 * @param statics
			 */
			'extend': function (properties, statics) {

				// The new Plugin constructor
				var Child = function Plugin(elements, options) {
					return __constructor.apply(this, arguments);
				};

				// Extend the prototype with passed in properties
				Child.prototype = $.extend(true, {},
					this.prototype,
					properties || {}
				);

				// Extend the statics with passed in statics
				$.extend(true,
					Child,
					$.extend({}, Plugin.statics),
					statics || {},
					{ extend: this.extend, constructor: this }
				);

				// Returns a constructor
				return Child;
			}
			
		});

		/**
		 * Inheritable Methods for the `Plugin` constructor
		 */
		$.extend(Plugin.prototype, {

			/**
			 * Set Element for Plugin
			 *
			 * This is required when changing the element. We will need to rebind to the new element.
			 * 
			 * @param element  jQuery selector or element
			 */
			'setElement': function (element) {

				// Trigger a `reset` if we are overwriting
				if (!this.$el.bogus) {
					this.trigger('reset');
				}

				// Get the main element
				var $el = $(element).eq(0);
				if (!$el.length) {
					$el = Plugin.bogusElement.extend({ selector: $el.selector });
				}
				this.$el = $el;

				// Copy over events to main object
				Plugin.eventProxy(this, this.$el);

				// Attach all predefined events
				if (Plugin.config.events) {
					this.on(Plugin.config.events);
				}
//				if (this.Constuctor.options.events) {
//					this.on(this.Constuctor.arguments[1].events);
//				}
//				if (this.Constuctor.statics.events) {
//					this.on(this.Constuctor.arguments[2].events);
//				}
				
				// If no elements were found, write error and finish
				if (this.$el.bogus) {
					this.trigger('error', [element + ': No matching elements were found on the page.']);
					return this;
				}
				
				// Set the unique ID of this instance
				this.id = this.$el[0].id || this.$el.attr({ id: (Date.now() + 1).toString(36) })[0].id;

				// Attach the Plugin to its element
				this.$el.data(this.jQdata, this);
				
				return this;
			}

		});
		
		// Return the Constructor: `$.Plugin()`
		return Plugin;
	})();

})(jQuery);