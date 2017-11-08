## Engine2D
2D game engine, written in JavaScript (for the most part). Currently in development.

The following covers the structured project tasks. Every task is followed by the difficulty (easy, medium, hard, very hard).

### Finished tasks:

* engine base layout. This also includes stuff like the plugin system (inheritance), general structure and many mandatory functions required by the engine - **very hard**
* loader - **medium**
* utils - **medium**
* map (currently done, but there is still some stuff to-do later on) - **easy**

### Open tasks (critical):

* basic editor and its forms (**in progress**) - **hard**
* graphics (layer) implementation (**in progress** due to editor being in progress) - **medium**
* final data structures for entities, maps, tilesets (**in progress** due to editor being in progress) - **easy**
* collision implementation - **medium**
* ai implementation which also includes some form of Dijkstra algorithm - **medium**
* entity implmementation - **easy**
* controls implementation - **easy**

### Optional tasks (nice to have):

* extended configuration options for the editor - **medium**
* as we said: This is a side scroll game, but its not too hard to also render with top down view. Possible scenarios: One map could be side scroll and another map could be top down - which sounds cool :) - **medium**
* extended JSDoc - **easy**
* sounds / music - **hard**

### Further thoughts:

* we should switch to SVG for smooth graphics when dynamically scaling - e.g. using [[this]](https://opengameart.org/content/free-platformer-game-tileset) as a base tileset

## Coding Conventions for this Project
This project is being developed with Sublime Text 3, a powerful editor.

If you want to work on the code of the project, you should:

* use the official [[JSDoc]](http://usejsdoc.org/) documentation guidelines
* install [[DoxyDoxygen]](https://github.com/20Tauri/DoxyDoxygen), which makes documentation in Sublime Text 3 easy and continuous
* use the following Sublime Text 3 snippet, to create your own Engine2D plugins:
```xml
<snippet>
    <content><![CDATA[/**
 * TODO: description.
 *
 * @type       {TODO_NAME}
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
      * @return     {boolean}  Returns true on success.
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
var engine2d = new Engine2D();
```

TODO...

## Installation
For local testing, please use the latest Firefox version!
You may encounter some warnings in the console when loading files, but those are just warnings and wont appear when the project runs on a proper server.

### Dependencies (third party libraries)

* [[jQuery]](https://jquery.com/) version 3.2.1+ - required by **Engine2D** and **Editor**
* [[jQueryUI]](https://jqueryui.com/) version 1.12.1+ - required by **Editor**