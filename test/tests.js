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
		
		it('should merge `options.defaults` and `prototype.defaults`')
		
		it('should run an `initialize()` method if available', function () {
			assert.throws(function () {
				var p = new $.Plugin({
					initialize: function () {
						throw new Success('It worked!');
					}
				});
			}, Success, 'It worked!');
		})
		
		it('should create an instance for each passed in element')
		it('should give each instance a unique ID')
		it('should set a jQuery bridge function')
		
		it('should be an `instanceof $.Plugin`',function () {
			var P = $.Plugin.extend({},{ id: 'Plugin' });
			var p = new P();
			
			assert.instanceOf(p, $.Plugin);
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

		p.on('twerk', p.options.events.pass);

		p.trigger('pass');
		p.trigger('twerk');

		assert.lengthOf(passes, 2);
	})
	
	it('on Plugin should point to Element', function () {
		
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

		it('should set the new element')
		it('and bind all prior passed in events')
		it('')
		
	})

	describe('with ``', function () {

		it('')
		it('')
		it('')

	})
	
})

