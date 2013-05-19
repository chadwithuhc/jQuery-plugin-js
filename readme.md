# Plugin.js  
A better jQuery plugin boilerplate system using Backbone-like syntax.

***

## What

__Plugin.js__ is a constructor class that helps you create a jQuery plugin that can be extended or inherited. It provides a Backbone.js syntax model with some enhancements to help plugin development. One of the main goals is to give a Backbone-like experience, without the requirement for Backbone. Think of it like using `Backbone.View` to build a jQuery Plugin.

## How

Main goals of Plugin.js:  
	- Acts as a base to extend on for all plugins
	- Automatically create instances for each passed in element
	- Automatically set a unique ID if the element does not have one
	- Create consistent structure for plugins to inherit
	- Allow plugins to extend from each other
	- Allows you to rename plugins to whatever you'd like
	- No requirements other than jQuery

## Why

When creating jQuery plugins, I feel the code is quite "loose" and unorganized. Wrapping in an IIFE doesn't help. Also, by the time I setup all my configuration, instantiated, and tied into the rest of the application, it still didn't seem to fit in right. I wanted better structure and the ability to extend a plugin so I could create a custom configuration that simply could be insantiated with just an element.

With __Plugin.js__ you can take a plugin such as [Rotator.js](), extend it with some additional config and suddenly it's a Gallery plugin. Or maybe change the config a little more, add a new method, and now it can handle being a Step Wizard.

In the end, resuability is key. __Plugin.js__ aims to take your reusable plugin and repurpose it for whatever your needs. I guess.


## Contributing

If you feel __Plugin.js__ could benefit from a new feature, please help out and submit an issue or pull request. My goal is to keep it as basic as possible and use the "one off" features on an extended plugin. But if you see an opportunity that could benefit the base, I would love to hear it.

## License

We're licensed under MIT because we wish we were smart enough to go there.