/**
 * Using Backbone.View Sample
 */

$.PluginName = Backbone.View.extend({
	el: '#element',
	
	initialize: function () {
		// run this on init
	},
	
	events: {
		'click .button': 'buttonClick'
	},
	
	
	// event actions
	buttonClick: function () {
		// this == instance, not jQuery object
		// this.$el == jQuery object
	},
	
	render: function () {
		// generic method
	}
});


/**
 * Using $.Plugin Sample
 * @type {*}
 */
$.PluginName = $.Plugin.extend({
	el: '#element',

	initialize: function () {
		// run this on init
	},

	events: {
		'click .button': 'buttonClick'
	},


	// event actions
	buttonClick: function () {
		// this == element
	},
	
	render: function () {
		// generic method
	}
})

