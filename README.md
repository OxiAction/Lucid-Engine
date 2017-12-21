![Lucid Logo](/misc/lucid_logo_small.jpg?raw=true "Lucid Logo")

## Preview
This is a preview of the Lucid Engine running a simple test game:
[[A simple test game]](https://htmlpreview.github.io/?https://github.com/OxiAction/Lucid-Engine/master/game.html)

Important: This may **not** be an up-to-date build (its a seperate **public** repo - which is required for rendering the preview).

## Lucid Engine
2D game engine, written in JavaScript (for the most part). Currently in development.

The following covers the structured project tasks. Every task is followed by the difficulty (easy, medium, hard, very hard).

### Finished tasks:

#### Milestones Meeting 1 (09.11.2017)

* engine base layout. This also includes stuff like the plugin system (inheritance), general structure and many mandatory functions required by the engine - **very hard**
* loader - **medium**
* utils - **medium**
* map - **easy**

#### Milestones Metting 2 (30.11.2017)

* graphics/rendering implementation - **medium**
* entities implementation - **easy**
* controls implementation - **easy**
* collision implementation - **medium**
* A* pathfinding implementation - **medium**

### Open tasks (**critical**):

* AI implementation (new since Milestone 1 - this and A* pathfinding are now two seperate tasks! A* pathfinding is done already) - **in progress** - **hard**
* items implementation (new since Milestone 1) - **easy**
* a final (basic) game based on the engine - **medium**
* basic editor and its forms - **hard**

### Optional tasks (nice to have):

* extended configuration options for the editor - **medium**
* top down AND side scroll rendering **medium**
* extended JSDoc - **easy**
* sounds / music - **hard**

## Code Details & Coding Conventions
This project is being developed with Sublime Text 3, a powerful editor.

* getter and setters are **only** used for complex data types (e.g. Objects like Camera, Map etc.) but **not** for primitive data types (e.g. string, number) **unless** there is some good reason for it (e.g. you need to manipulate something when setting / getting)
* for notifications / messaging we use the [[Publish–subscribe pattern]](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
* use the official [[JSDoc]](http://usejsdoc.org/) documentation guidelines
* install [[DoxyDoxygen]](https://github.com/20Tauri/DoxyDoxygen), which makes documentation in Sublime Text 3 easy and continuous
* use the following Sublime Text 3 snippet, to create your own Engine plugins:
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
```javascript
var engine = new Lucid.Engine();
```

TODO...

## Installation
For local testing, please use the latest Firefox version!<br />
You will have the best results / performance with [[Firefox Quantum]](https://www.mozilla.org/en-US/firefox/).<br />
You may encounter some warnings in the console when loading files, but those are just warnings and wont appear when the project runs on a proper server.

### Dependencies (third party libraries)

* [[jQuery]](https://jquery.com/) version 3.2.1+ (Editor only)
* [[jQueryUI]](https://jqueryui.com/) version 1.12.1+ (Editor only)
* [[EasyStar.js]](http://easystarjs.com/) version 0.4.1+