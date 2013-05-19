var assert = chai.assert;
function Success(message) {
	this.name = "Success";
	this.message = (message);
}
Success.prototype = Error.prototype;


describe('Available where expected', function () {
	it('should be available on `$.Plugin`', function() {
		assert(!!$.Plugin);
	});
	
	it('should have config options available on `$.Plugin.config`')
});


describe('Insantiating', function () {
	
	describe('with `$.Plugin`', function() {
		
		it('should take a string or object as first parameter',function () {
			var p = new $.Plugin('#mocha');
			var p2 = new $.Plugin({ el: '#mocha' });
			
			assert.equal(p.el.id, p2.el.id);
		})
		
		it('should throw informative error when constructed without `new`', function () {
			assert.throw(function () {
				var p = $.Plugin('#mocha');
			}, Error, /missing `new`/i);
		})

		it('should return a jQuery element of the main selector', function () {
			var p = new $.Plugin('#mocha');
			assert.notEqual(p.$el.length, 0);
		})

		it('should quietly error if console is missing', function () {
			// console was removed for this test
			var p = new $.Plugin('#missing');
			assert.notEqual(window.console, $.Plugin.console);
		})
		
		it('should set a bogus element if none is found', function () {
			var p = new $.Plugin('#missing');
			assert.equal(p.$el.bogus, true);
		})

		it('should log message if element is missing', function () {
			// temporary overriding console
			var tmp_console = $.Plugin.prototype.parent.console;
			var output;
			$.Plugin.prototype.parent.console = {
				log: function (message) {
					throw new Success(output = message);
				}
			};
			
			assert.throws(function () {
				var p = new $.Plugin('#missing');
			}, Success, output);

			// resetting console back
			$.Plugin.prototype.parent.console = tmp_console;
		})
		
		it('should be able to take an `options` object', function () {
			var p = new $.Plugin({
				el: '#mocha',
				title: 'Mocha Tests',
				status: 'passing'
			});
			
			assert.equal(p.status, 'passing');
		})
		
		it('should merge `options.defaults` and `prototype.defaults`', function () {
			var P = $.Plugin.extend({
				defaults: {
					one: true,
					two: false,
					four: true
				}
			}, {
				id: 'OptionsTest',
				jQname: 'optionstest'
			});
			
			var p = new P({
				defaults: {
					two: true,
					three: true
				}
			});
			
			assert.deepEqual(p.options, { one: true, two: true, three: true, four: true });
		})
		
		it('should put all other `options` directly on `this`', function () {
			var P = $.Plugin.extend({
				defaults: {
					one: true
				},
				
				rootOne: false
			}, {
				id: 'OptionsTest',
				jQname: 'optionstest'
			});

			var p = new P({
				defaults: {
					two: true
				},
				
				rootOne: true,
				rootTwo: true
			});
			
			assert.deepEqual(p.options, { one: true, two: true });
			assert.strictEqual(p.rootOne, true);
			assert.strictEqual(p.rootTwo, true);
		})
		
		it('should run an `initialize()` method if available', function () {
			// direct instantiation
			assert.throws(function () {
				var p = new $.Plugin({
					el: '#mocha',
					initialize: function () {
						throw new Success('It worked!');
					}
				});
			}, Success, 'It worked!');
			
			// extending and instantiating
			assert.throws(function () {
				var P = $.Plugin.extend({
					el: '#mocha',
					initialize: function () {
						throw new Success('It worked!');
					}
				});

				var p2 = new P();
			}, Success, 'It worked!');
		})
		
		it('should create an instance for each passed in element')
		it('should give each instance a unique ID')
		
		it('should be an `instanceof $.Plugin`',function () {
			var P = $.Plugin.extend({},{ id: 'Plugin' });
			var p = new P();
			
			assert.instanceOf(p, $.Plugin);
		})
		
	})
	
	describe('with `$(element).jQfn()`', function () {
		
		it('should be able to instantiate and return jQuery element', function () {
			var P = $.Plugin.extend({}, {
				id: 'jQfnTest',
				jQname: 'jqfntest'
			});
			
			var p = $('#mocha').jqfntest({ pass: true });
			var p_obj = p.data('jqfntest');
			
			assert.equal(p, p_obj.$el);
			assert.strictEqual(p_obj.pass, true)
		})
		
	})
	
});


describe('Extending', function () {
	
	describe('with `.extend()`', function() {
		
		it('should be able to extend to a new Constructor', function () {
			var Person = $.Plugin.extend({
				sex: null,
				occupation: null,
				eyes: 2
			});
			
			var Man = Person.extend({
				sex: 'Male',
				hair: 'Brown'
			});
			
			var dude = new Man({
				name: 'dude'
			});
			
			assert.equal(dude.name, 'dude');
			assert.equal(dude.hair, 'Brown');
			assert.equal(dude.sex, 'Male');
			assert.equal(dude.eyes, 2);
		})
		
		it('should allow static variables on Constructor', function () {
			var Person = $.Plugin.extend({},{
				planet: 'Earth'
			});
			
			assert.equal(Person.planet, 'Earth');
		})
		
		it('should not inherit statics from Parents', function () {
			var Planet = $.Plugin.extend({},{
				galaxy: 'Milky Way'
			});
			
			var Earth = Planet.extend({
				name: 'Earth',
				position: 3
			});
			
			assert.isUndefined(Earth.galaxy);
			assert.equal(Earth.prototype.parent.galaxy, 'Milky Way');
		})

		it('should copy default statics to extended Constructors', function () {
			var Planet = $.Plugin.extend();

			var Earth = Planet.extend();
			
			var prop, props = $.Plugin.prototype.parent.statics;
			for (prop in props) {
				if (props.hasOwnProperty(prop)){
					assert.property(Planet, prop);
					assert.property(Earth, prop);
				}
			}
		})
		
		it('should create a jQuery method automatically', function () {
			var P = $.Plugin.extend({}, {
				id: 'foobar',
				jQname: 'foobar'
			});
			
			assert.isFunction($.fn.foobar);
		})
		
		it('should NOT create a jQuery method if `jQfn === false`', function () {
			var P = $.Plugin.extend({}, {
				id: 'foobar2',
				jQname: 'foobar2',
				jQfn: false
			});

			assert.isUndefined($.fn.foobar2);
		})
		
	})
	
});

describe('Events', function () {

	describe('using `.eventProxy()`', function () {

		it('should copy select Events from element to an object')
		it('should only copy compatible events')
		it('should work with jQuery 1.4.2+')

	})
	
	
	it('should be automatically attached on instantiation', function () {
		assert.throws(function () {
			var p = new $.Plugin({
				el: '#missing',
				events: {
					'error': function () {
						throw new Error('Error Dude');
					}
				}
			});
		}, Error, 'Error Dude');
	})
	
	it('should be available on Object', function () {
		var passes = [];
		var p = new $.Plugin({
			el: '#mocha',
			events: {
				pass: function () {
					passes.push('Pass');
				}
			}
		});

		p.on('twerk', p.events.pass);

		p.trigger('pass');
		p.trigger('twerk');

		assert.lengthOf(passes, 2);
	})
	
	it('should point to Element from Plugin calls', function () {
		
		var passes = [];
		var p = new $.Plugin({
			el: '#mocha',
			events: {
				pass: function () {
					passes.push('Pass');
				},
				twerk: function () {
					passes.push('Pass');
				}
			}
		});

		p.trigger('pass');
		p.trigger('twerk');
		p.$el.trigger('pass');
		
		assert.lengthOf(passes, 3);
	})
	
});



describe('Calling Methods', function () {
	
	describe('with `.setElement()`', function () {

		it('should set the new element', function () {
			var p = new $.Plugin({
				el: '#mocha'
			});
			
			p.setElement('body');
			
			assert.equal(p.$el.selector, 'body');
		})
		
		it('and bind all prior passed in events', function () {
			// setup: remove all prior events
			$('#mocha, body').off();
			
			var p = new $.Plugin({
				el: '#mocha',
				
				events: {
					fire: function () {
						throw new Success('Passed');
					}
				}
			});
			
			// faux iterator
			$.getLength = function (obj) {
				var length = 0;
				$.each(obj, function () {
					length++;
				});
				return length;
			};
			
			// phase 1: events set to `#mocha`
			var $mocha_events = p.$el.data('events');
			assert.equal($.getLength($mocha_events), 1);
			
			p.setElement('body');

			// phase 2: events removed from `#mocha` and added to `body`
			var $body_events = p.$el.data('events');
			assert.equal($.getLength($mocha_events), 0, 'Events were not undelegated correctly');
			assert.equal($.getLength($body_events), 1, 'Events were not delegated to new element correctly');
		})

		it('should set the object on `$el.data()`', function () {
			var p = new $.Plugin({
				el: '#mocha',
				extra: 'an extra for comparison'
			});

			assert.equal(p, p.$el.data('pluginjs'));
		})
		
		it('should allow a `jQdata` override', function () {
			var P = $.Plugin.extend({
				el: '#mocha',
				extra: 'an extra for comparison'
			}, {
				id: 'jQdataTest',
				jQname: 'jqdatatest',
				jQdata: 'jqdata'
			});
			
			var p = new P();

			assert.isUndefined(p.$el.data(P.jQname));
			assert.equal(p, p.$el.data('jqdata'));
		})
		
	})

	describe('with ``', function () {

		it('')
		it('')
		it('')

	})
	
})

