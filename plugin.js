/**!
 * Plugin
 * A Plugin for managing plugins in jQuery
 *
 * @author    cmfolio
 * @docs      http://web.cmfolio.com/projects/plugin-js/
 * @source    _Source_URL_
 * @license   MIT License
 * @version   v0.5.0 R05.06.2013
 * @requires  jQuery 1.4.3+
 */
;(function ($) {

	$.Plugin = (function () {

		// Plugin.js info
		var info = {
			'id': 'PluginJS',
			'jQname': 'pluginjs',
			'version': '0.5.0'
		};

		// return a basic plugin
		var Plugin = function Plugin(options) {
			
			if ( !(this instanceof Plugin)) {
				throw SyntaxError('Missing `new` construct');
				return this;
			}
			
			// Allow `options` to simply be a selector string
			if (typeof options === 'string') {
				options = { el: options };
			}
			
			// Set a default for safety
			options = options || {};

			// Any `defaults` get added to the `options` object
			this.options = $.extend({}, this.defaults, options.defaults);
			delete options.defaults;
			
			// Everything else gets added directly to `this`
			$.extend(this, options);

			// Setup a bogus element for events
			// This is in case we don't have an element before setting or triggering events
			this.$el = Plugin.bogusElement();

			// Setup and cache the element
			this.setElement(this.el);

			// Run the `initialize()` if available
			if (typeof this.initialize === 'function') {
				this.initialize.call(this);
			}

			return this;
		};

		/**
		 * Static Variables on the `Plugin` constructor
		 */
		$.extend(Plugin, {
			
			// Plugin.js Version
			'version': info.version,
			
			// Events automatically attached to each plugin instance
			'events': {
				'error': function (e, msg) {
					Plugin.console.error(msg);
				}
			},

			// Plugin statics that should be set for each new plugin
			'statics': {
				'id': null,
				'version': null,
				'jQname': null
				// Optional overrides
				// jQfn: The name for the `$.fn.jQfn` assignment
				// jQdata: The accessible name for `$el.data(jQdata)`
			},
			
			// Mockup console for safety
			'console': (function () {
				return console || { log: $.noop, debug: $.noop, error: $.noop }
			})(),

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
				    events = ['on','off','one','trigger'],
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
			},

			/**
			 * Extend a Plugin
			 *
			 * Allows you to extend a plugin
			 *
			 * @param properties
			 * @param statics
			 */
			'extend': function (properties, statics) {

				var Parent = this,
				    P = Plugin;

				// The new Plugin constructor
				var Child = function Plugin (options) {
					return P.apply(this, arguments);
				};

				// Extend the statics with passed in statics
				$.extend(true, Child,
					$.extend({}, P.statics), // default statics for all
					statics,
					{ extend: Parent.extend }
				);
				
				// Prototype Chaining
				var Surrogate = function(){ this.constructor = Child; };
				Surrogate.prototype = Parent.prototype;
				Child.prototype = new Surrogate;

				// Extend the Childs prototype with passed in properties
				if (properties) $.extend(true, Child.prototype, properties, { parent: Parent });

				// Setup the jQuery function
				if (Child.jQfn !== false) {
					$.fn[Child.jQfn || Child.jQname] = function (options) {
						new Child($.extend(options, { el: this }));
						return this;
					};
				}

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
					this.undelegateEvents();
					this.trigger('reset');
				}

				// Get the main element
				var $el = element instanceof $ ? element : $(element);
				// If it doesn't exist, we have to create a bogus element for events
				if (!$el.length) {
					$el = Plugin.bogusElement().extend({ selector: $el.selector });
				}
				// Set the element whether it's bogus or not
				this.$el = $el;
				// Set actual DOM element
				this.el = $el[0];
				// Set `this.$el.find()` shorthand
				this.$ = function (selector) {
					return $el.find(selector);
				}

				// Set the unique ID of this instance
				this.id = this.el.id || this.$el.attr({ id: (Date.now() + 1).toString(36) })[0].id;

				// Copy over events to main object
				Plugin.eventProxy(this, this.$el);

				// Attach all predefined events
				if (Plugin.events) {
					this.delegateEvents(Plugin.events);
				}
				if (this.events) {
					this.delegateEvents(this.events);
				}
				
				// If no elements were found, write error and finish
				if (this.$el.bogus) {
					this.trigger('error', ['No matching elements were found on the page ('+element+')']);
					return this;
				}

				// Attach the Plugin to its element
				this.$el.data(this.constructor.jQdata || this.constructor.jQname, this);
				
				return this;
			},

			/**
			 * Delegate Events to the element
			 *
			 * Allows us to have the same Backbone-style event assignments:
			 *
			 *     {
			 *       'click .someClass': 'methodName'
			 *     }
			 *
			 * @param events
			 */
			'delegateEvents': function (events) {
				if (!(events || this.events)) return this;
				this.undelegateEvents();
				for (var key in events) {
					var method = events[key];
					if (typeof method != 'function') method = this[events[key]];
					if (!method) continue;

					var match = key.match(/^(\S+)\s*(.*)$/);
					var eventName = match[1], selector = match[2];
					method = $.proxy(method, this);
					eventName += '.delegateEvents_' + this.id;
					if (selector === '') {
						this.$el.on(eventName, method);
					} else {
						this.$el.on(eventName, selector, method);
					}
				}
				return this;
			},

			/**
			 * Remove Events
			 * 
			 * Reverses anything we did with `this.delegateEvents()`
			 */
			'undelegateEvents': function() {
				this.$el.off('.delegateEvents_' + this.id);
				return this;
			},
			
			// Default render method
			render: function () {
				return this;
			}
		});
		
		// Return the Constructor: `$.Plugin()`
		return Plugin.extend({}, info);
		
	})();

})(jQuery);