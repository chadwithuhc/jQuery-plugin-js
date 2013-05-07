/*!
 * _Plugin_
 * _Description_
 *
 * @author  _Author_
 * @docs  _Docs_URL_
 * @source  _Source_URL_
 * @license  _License_
 * @version  v_Version_
 */
(function ($) {

	$._Plugin_ = function (element, options) {

		// keep track of versions
		this.version = '_Version_';
		/*
		  We set the version on the main plugin since minifiers
		  will remove all comments causing us to lose track
		  of which version we are working on
		*/

		// default options
		var defaults = {
			debug: false
		};
		/*
		  Set all of your default values here. They will get
		  overwritten with passed in options later.
		*/

		// the config
		var config = $.extend({}, defaults, options || {});
		/*
		  Here is your basic options merging with the defaults.
		  All merged results end up in `config` or `base.config`
		  in case you ever need to access them.
		*/

		// will hold the _Plugin_ object
		var base = this;
		/*
		  We set `this` to `base` so the `base` variable will
		  always be our main plugin object.
		*/

		// some vars available for reference
		base.config = config;
		base.element;
		/*
		  The `base.config` statement is the only one that NEEDS
		  to be here. You can add others here to remind yourself
		  what has been set publicly on the `base` object.
		*/

		// let's get this started
		var init = function () {
			/*
			  The `init()` function only gets called once on instanciation.
			  Here you will write any of your "setup" code like gathering
			  elements, or manipulating that needs to happen before we
			  work with the rest of the plugin.
			*/

			// get the main element
			base.element = $(element).eq(0);
			base.id = base.element[0].id || base.element.attr({ id: (Date.now() + 1).toString(36) })[0].id;
			/*
			  We set the main element, even if it isn't something we're
			  manipulating. We will use this element to store all of
			  our plugin data in the next step.

			  We also set a unique ID to the element if it doesn't have
			  one. This is so we can reference the instance by ID if
			  we end up having multiple instances on a page.
			*/

			// attach the _Plugin_ to its element
			base.element.data('_plugin_', base);
			/*
			  Like we said above, this is to allow you to access the
			  whole object simply by getting the element with jQuery.
			  This would be something like:

			      var _plugin_ = $('#element').data('_plugin_');
			      _plugin_.someMethod();
			*/

			return base.element;
		}; // end init
		/*
		  At the end of `init()` we return `base.element` to allow
		  for chaining. For all future functions, we recommend you
		  return `base` so you can chain the object functions
		  instead. If you want to access the jQuery object at any
		  time, you can do so like this:

		      base.element.somejQueryFunction().isChainable();
		*/

		// initiate the _Plugin_
		return init();
		/*
		  Now go!
		*/
	};

	// jQuery bridge
	$.fn._plugin_ = function (options) {
		this.each(function () {
			new $._Plugin_(this, options || {});
		});
		return this;
	};
	/*
	  This allows you to call your plugin with multiple elements like normal jQuery
	  functions:

	      $('.gallery')._plugin_(options);
	*/

	new Plugin('Gallery', $.Rotator, default_options);

})(jQuery);
