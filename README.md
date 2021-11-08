![Lucid Logo](/assets/lucid_logo_small.jpg?raw=true "Lucid Logo")

## Preview (Game Demo)
General:
* switching to map3 enabled pathfinding and grid debug mode

Controls:
* use arrow keys or point-and-click (only available in top-down maps)
* use space to attack (only available in top-down maps)
* access menu in top right corner to switch maps

AI behaviour:
* first priority: Heal (when below 30% life)
* second priority: Chase (when in line-of-sight) and Attack (when in attack-range) enemy

[[Game Demo]](https://oxiaction.github.io/Lucid-Engine/demo/game/game.html)

## What is Lucid Engine?
A 2D game engine, written in JavaScript.<br />
The goal of this project is, to provide all the (core) tools for creating a simple 2D game.<br />
The engine supports top-down (RPG style) games, as well as side-scroll (platformer) game types.<br />
Supports both, mobile devices and desktop computers.

## Open tasks & nice to have
* WebGL renderer
* basic editor and its forms
* animation manager
* map related events triggering
* more advanced physics for the entities
* sounds / music manager
* dynamic loading of JavaScript files on demand (require-style)
* user management and dynamic spawning of user-entities
* resolving all the TODO sections in the code
* extended [[JSDoc]](http://usejsdoc.org/)

## Code Details & Coding Conventions
The best way to work on this project is, by using the [[Sublime Text]](https://www.sublimetext.com/) editor. 

* getter and setters are **only** used for complex data types (e.g. Objects like Camera, Map etc.) but **not** for primitive data types (e.g. String, Number) **unless** there is some good reason for it (e.g. you need to manipulate something when setting / getting)
* for notifications / messaging we use the [[Publish–subscribe pattern]](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) and the corresponding Lucid.Event class.
* use the official [[JSDoc]](http://usejsdoc.org/) documentation guidelines
* install [[DoxyDoxygen]](https://github.com/20Tauri/DoxyDoxygen), which makes documentation in [[Sublime Text]](https://www.sublimetext.com/) easy and continuous
* use the following [[Sublime Text]](https://www.sublimetext.com/) snippet, to create your own Engine plugins:
```xml
<snippet>
    <content><![CDATA[/**
 * TODO: description.
 */
var TODO_NAME = BaseComponent.extend({
  // config variables and their default values
  var1: false,

  // local variables
  var2: false,
  
  /**
   * Automatically called when instantiated.
   *
   * @param      {Object}   config  The configuration.
   * @return     {Boolean}  Returns true on success.
   */
  init: function(config) {
    this.componentName = "TODO_NAME";

    this._super(config);

    return true;
  }
});]]></content>
    <tabTrigger>etemp</tabTrigger>
    <scope>source.js</scope>
    <description>Plugin Template</description>
</snippet>
```

## Code Example
You can find examples in the demo folder.

## Installation
Just download the branch and run the HTML file(s) from the demo folder(s).<br />
If you just want to open the .html files in your browser, make sure you are using [[Firefox]](https://www.mozilla.org/en-US/firefox/), as its the only browser supporting local file access (which is required for assets / map loading).<br />
In case you run the demo files on a local or online webserver, it doesnt matter which browser you use, as long as its not Internet Explorer 6 ;-)

### Dependencies (third party libraries)

* [[jQuery]](https://jquery.com/) version 3.2.1+ (Editor only)
* [[jQueryUI]](https://jqueryui.com/) version 1.12.1+ (Editor only)

### License

* [[AGPL]](https://www.gnu.org/licenses/agpl-3.0.html)
