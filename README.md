![Lucid Logo](/assets/lucid_logo_small.jpg?raw=true "Lucid Logo")

## Preview
This is a preview of the Lucid Engine running a simple test game:
[[A simple test game]](https://htmlpreview.github.io/?https://github.com/OxiAction/Lucid-Engine/master/demo/game/game.html)

Important: This may **not** be an up-to-date build (its a seperate **public** repo - which is required for rendering the preview).

## Lucid Engine
2D game engine, written in JavaScript.

## Open tasks & nice to have:
* basic editor and its forms
* animation manager
* map related events triggering
* more advanced physics for the entities (like bouncing)
* sounds / music
* user management and dynamic spawning of user-entities
* bugfixes of the **TODO** sections
* a nice demo game
* extended JSDoc

## Code Details & Coding Conventions
The best way to work on this project, is by using Sublime Text 3 editor.

* getter and setters are **only** used for complex data types (e.g. Objects like Camera, Map etc.) but **not** for primitive data types (e.g. string, number) **unless** there is some good reason for it (e.g. you need to manipulate something when setting / getting)
* for notifications / messaging we use the [[Publish–subscribe pattern]](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) and the corresponding Lucid.Event class.
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
You can find examples in the demo folder.

## Installation
Just download the branch and run the HTML file(s) from the demo folder(s).<br />
You will have the best results / performance with [[Firefox Quantum]](https://www.mozilla.org/en-US/firefox/).

### Dependencies (third party libraries)

* [[jQuery]](https://jquery.com/) version 3.2.1+ (Editor only)
* [[jQueryUI]](https://jqueryui.com/) version 1.12.1+ (Editor only)
* [[EasyStar.js]](http://easystarjs.com/) version 0.4.1+