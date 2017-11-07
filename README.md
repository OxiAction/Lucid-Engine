## Engine2D
2D game engine, written in JavaScript (for the most part).

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
TODO...

## License
TODO...