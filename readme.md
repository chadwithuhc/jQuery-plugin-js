# Plugin.js  
A better jQuery plugin boilerplate system using Backbone-like syntax.

***

## What

__Plugin.js__ is a constructor class that helps you create a jQuery plugin which can be extended. It provides a [Backbone.js](http://backbonejs.org) syntax model with some enhancements to help plugin development. One of the main goals is to give a Backbone-like experience, without the requirement for Backbone. Think of it like using `Backbone.View` to build a jQuery Plugin.

***

## How

Main goals of Plugin.js:

	- Easily create plugins in a Backbone-style syntax
	- Allow plugins to be extended to create new plugins
	- Automatically handle common tasks such as:
		- Creating instances for each element in the set
		- Set a unique ID if the element does not have one
		- Accept and merge options automatically
		- Auto-attach events on instantiation
		- Extend jQuery with a method on `$.fn.fnName`
	- Allows you to rename plugins to whatever you'd like by cloning them
	- No requirements other than jQuery

***

## Why

When creating jQuery plugins, I feel the code is quite "loose" and unorganized. Wrapping in an IIFE doesn't help. Also, by the time I setup all my configuration, instantiated, and tied into the rest of the application, it still didn't seem to fit in right. I wanted better structure and the ability to extend a plugin so I could create a custom configuration that simply could be insantiated with just an element.

With __Plugin.js__ you can take a plugin such as [Rotator.js](), extend it with some additional config and suddenly it's a Gallery plugin. Or maybe change the config a little more, add a new method, and now it can handle being a Step Wizard.

In the end, resuability is key. __Plugin.js__ aims to take your plugin reusable by re-purposing it for whatever your needs.

***

## Differences between `Backbone.View` and `$.Plugin`

We have tried to mimic the Backbone syntax to keep the learning curve down and code structure similar to what you know. There are a few differences however.

### Differences

__Backbone and Underscore are unavailable__  
It is obvious that unless you specifically included Backbone and Underscore on your page, you will not have access to them in your Plugin.

__Extended constructors have additional members__  
When you extend a constructor with `.extend()` you will have access to `this.constructor` and `this.parent` if you need to access those for any reason. There is no `this.__super__` like Backbone has.

__<code>defaults</code> and <code>options</code>__  
When you instantiate, all passed in options under `defaults` will be assigned to `this.options` and everything else will be assigned directly to `this`. This mimics more of the `Backbone.Model` syntax. For Example:

    var p = new $.Plugin({
      defaults: {
        background: 'green'
      },
      
      setBackground: function() {
        document.body.style.backgroundColor = this.options.background;
      }
    });
    
    p.options.background == 'green'; // true
    p.setBackground(); // sets the body background color

__Some statics are used as config options__  
We use a few statics as config options. These are `Constructor.id` -- the ID of the plugin; `Constructor.jQname` -- the jQuery function and `.data()` name; The optional `Constructor.jQfn` which overrides the jQuery function name; and the optional `Constructor.jQdata` which overrides the jQuery `.data()` name. You are free to add more if you would like.


### Similarities

__Elements are assigned the same way__  
When extending or instantiating, you can pass in an option under the name `el` and it will be cached or created.

    {
      el: '#someElement'
    }

__Events can be assigned and delegated the same as Backbone__  
We have copied the way events are delegated to the element. This means you can use your normal event assignments:

    events: {
      'click .childElement': 'clickEvent'
    }

The only difference here is the event methods are using the jQuery names. This means there is no `listenTo`, `listenToOnce` and `once` is actually called `one`. `on`, `off` and `trigger` have their expected behaviors.

__Exact similarities__  
- `initialize()` can be passed in to any constructor
- `this.setElement()` is available
- `this.delegateEvents()` and `this.undelegateEvents()` are available
- `this.$()` is available
- `this.render()` is a noop
- Statics can be passed as a second argument when extending `$.Plugin.extend(properties, statics);`


## Contributing

If you feel __Plugin.js__ could benefit from a new feature, please help out and submit an issue or pull request. My goal is to keep it as basic as possible and use the "one off" features on an extended plugin. But if you see an opportunity that could benefit the base, I would love to hear it.

## License

We're licensed under MIT License.