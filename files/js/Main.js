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

    var game = new Game();
});