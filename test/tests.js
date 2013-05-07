var assert = chai.assert;

describe('Attaching Itself', function () {
	it('should be available on `$.Plugin`', function() {
		assert(!!$.Plugin);
	});
});


describe('Insantiating', function () {
	
	describe('with `$.Plugin`', function() {
		
		it('should be able to be used as a Constructor with or without `new`', function () {
			var p = new $.Plugin('#mocha');
			assert.isObject(p);
			
			var p2 = $.Plugin('#mocha');
			assert.isObject(p);
			
			assert.equal(p, p2);
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
		
		it('should be able to take an `options` object', function () {
			var p = new $.Plugin('#mocha', {
				title: 'Mocha Tests',
				status: 'passing'
			});
			
			assert.equal(p.status, 'passing');
		})
		
		it('should run an `initialize()` method if available', function () {
			var init = false;
			var p = new $.Plugin('#mocha', {
				initialize: function () {
					init = true;
					console.log('Init!');
				}
			});
			
			assert(init);
		})
		
		it('should create an instance for each passed in element')
		it('should give each instance a unique ID')
		it('should set a jQuery bridge function')
		
		
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
			
			var dude = new Man('#mocha', {
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
			assert.equal(Earth.constructor.galaxy, 'Milky Way');
		})

		it('should copy default statics to extended Constructors')
		
	})

	describe('Multiple Levels', function() {
		
	})
	
});

describe('Events', function () {
	
	it('should be automatically attached on instantiation')
	it('should be available on Object')
	it('on Object should point to Element')
	
	describe('using `.eventProxy()`', function () {
		
		it('should copy select Events from element to an object')
		it('should only copy compatible events')
		it('should work with jQuery 1.4.2+')
		
	})
});



