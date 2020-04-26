import { XAStatic, XAComponent } from 'sxa-types/xa';
declare var XA: XAStatic;

import './xaclock.scss';

/**
 * Component XaClock
 * @module XaClock
 * @param  {jQuery} $ Instance of jQuery
 * @return {Object} List of XaClock methods
 */
XA.component.xaClock = (function ($) {
    /**
    * This object stores all public api methods
    * @type {Object.<Methods>}
    * @memberOf module:XaClock
    * @
    * */
    var api: XAComponent = {};

    function clockUpdate(component: JQuery) { 
        const stateContainer = component[0]; // unwrap
        const showTwelve: boolean = jQuery.data(stateContainer, "showTwelve");
        const hourShiftData: string | undefined = component.attr("data-hourshift");
        const hourShift = isNaN(parseInt(hourShiftData, 10)) ? 0 : parseInt(hourShiftData, 10);
        var date = new Date();
        component.css({ 'color': '#fff', 'text-shadow': '0 0 6px #ff0' });
        function addZero(x: number | string) {
            if (x < 10) {
                return x = '0' + x;
            } else {
                return x;
            }
        } 
    
        function twelveHour(x: number) {
            if (x > 12) {
                return x = x - 12; 
            } else if (x == 0) {
                return x = 12;
            } else {
                return x; 
            }
        }
    
        var hours = (date.getHours() + hourShift) % 24;
        if (showTwelve) hours = twelveHour(hours);
        var h = addZero(hours);
        var m = addZero(date.getMinutes());
        var s = addZero(date.getSeconds());
    
        component.text(h + ':' + m + ':' + s)
    }

    /**
    * initInstance method of a XaClock element
    * @memberOf module:XaClock
    * @method
    * @param {jQuery} component Root DOM element of XaClock component wrapped by jQuery
    * @param {jQuery} xaClockModule XaClock inner DOM element of XaClock component wrapped by jQuery
    * @alias module:XaClock.initInstance
    */
    api.initInstance = function (component, xaClockModule) { 
        const stateContainer = component[0]; // unwrap
        jQuery.data(stateContainer, "showTwelve", false);
        $(component).click(() => {
            let showTwelve: boolean = jQuery.data(stateContainer, "showTwelve");
            showTwelve = !showTwelve;
            jQuery.data(stateContainer, "showTwelve", showTwelve);
            console.log("showTwelve:", showTwelve);
        });
        clockUpdate(component);
        setInterval(() => clockUpdate(component), 1000);
    };

    /**
     * init method calls in a loop for each
     * XaClock component on a page and runs XaClock's
     * ["initInstance"]{@link module:XaClock.api.initInstance} methods.
     * @memberOf module:XaClock
     * @alias module:XaClock.init
     */
    api.init = function () {
        var $xaClocks = $(".xaClock:not(.initialized)");
        $xaClocks.each(function () {
            var $xaClockModule = $(this);
            // @ts-ignore
            api.initInstance($(this), $xaClockModule);
            $(this).addClass("initialized");
        });
    };

    return api;
})(jQuery);

XA.register("xaclock", XA.component.xaClock);
