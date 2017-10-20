var baseURL = window.location.protocol + "//" + window.location.host + "/";

/**
* prevent console.log errors on older browsers
*/
(function() {
    var method;
    var noop = function () {};
    var methods = [
        "assert", "clear", "count", "debug", "dir", "dirxml", "error",
        "exception", "group", "groupCollapsed", "groupEnd", "info", "log",
        "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd",
        "timeStamp", "trace", "warn"
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/**
* determines if touch is available
* NOTE: This is not allways accurate
*/
var supportsTouch;

var supportsTransitions;

var supportsTransforms;

var isIE;

var transitionEndString = "webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd";

$(document).ready(function() {
	var userAgent = window.navigator.userAgent;
    userAgent = userAgent.toLowerCase();

	// touch device detection
	supportsTouch = "ontouchend" in document;
	if (supportsTouch) {
		$("html").addClass("touch-supported");
	} else {
		$("html").addClass("no-touch-supported");
	}
    
    supportsTransitions = $("html").hasClass("csstransitions");
    supportsTransforms = $("html").hasClass("csstransforms");

    isIE = /(msie) ([\w.]+)/.exec(userAgent);
    if (isIE) {
        $("html").addClass("ie");
        $("img[src$='.png']").each(function() {
            this.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + this.src + ",sizingMethod='scale')";
        });
    }

    var isAndroid = userAgent.indexOf("android") > -1;
    if(isAndroid) {
        $("html").addClass("is-android");
    }


    // XML Parser testing
    var xmlParser = $(this).XMLParser();
    
    // load XML
    xmlParser.init("files/maps/map1.xml", 1);

    var engine2D;

    // event listener
    $(document).on("XMLParserSuccess", function(event, id, xml) {
        console.log("XML successfully loaded - id: " + id);

        // now that we have the XML data, we can create an Map object
        var map = $(this).Map();
        map.init(xml);

        // setup game engine
        engine2D = $("#canvas").Engine2D();
        engine2D.init();
    });

    $(window).resize(function() {
        console.log("resize");
        if (engine2D != undefined) {
            engine2D.resize();
        }
    });
});