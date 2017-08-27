/**
 * Created by vitorcool on 8/21/2017.
 */

$.holdReady(true);
window.addEventListener('DOMContentLoaded', function(event) {
    var loadJS = function(isLoaded, url, implementationCode, location){
        location=typeof(location)=="undefined" ? document.body : location;
        if(isLoaded) {
            if(typeof(implementationCode)=='function')
                implementationCode();
            return;
        }
        var scriptTag = document.createElement('script');
        scriptTag.src = url;
        scriptTag.onload = implementationCode;
        //scriptTag.onreadystatechange = implementationCode;
        location.appendChild(scriptTag);
    };
    var loadCSS = function(isLoaded, url, implementationCode, location){
        location=typeof(location)=="undefined" ? document.head : location;
        if(isLoaded) {
            if(typeof(implementationCode)=='function')
                implementationCode();
            return;
        }
        var linkTag = document.createElement('link');
        linkTag.href = url;
        linkTag.rel = "stylesheet";
        linkTag.onload= implementationCode;
        location.appendChild(linkTag);
    };

    // load jquery
    if(typeof jQuery == "undefined"){
        console.log('toastr-retry error. jQuery must be loaded for toastr-retry to function.')
    }else{
        // load bootstrap
        loadCSS(typeof $().modal !== "undefined",       "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
        loadJS(typeof $().modal !== "undefined",        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js");
        // load toastr
        loadCSS(typeof toastr !== "undefined",          "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css");
        loadJS(typeof toastr !== "undefined",           "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js",function(){
            // set toastr ScrollBar

            toastr.setContainerHeight=function(h){
                h= typeof h=="undefined" ? ($( window ).height()-25) : h;
                $( "#toast-container" ).css( "maxHeight", ( h ) );
            }

            $( window ).bind( "resize", function(){
                toastr.setContainerHeight();
            });
            $( document.body ).bind("DOMSubtreeModified", function(event) {
                if (event.target!==document.body)
                    return;
                if($(document.body).children("#toast-container").length==1) {
                    toastr.setContainerHeight()
                }
            });

            // JSON propperties also tooogle (expand,collapse) children elements
            $(document).on('click','.jsonview .prop',function(event){
                //event.stopPropagation();
                var e=$(event.target).prev(".collapser");
                if(e.length>0) e[0].click();
            })

            // add toastr.retry()
            toastr.retry=function(toPush, responseObj, options ) {
                return new retryToaster(toPush,responseObj,options);
            }

            // handle click and drag
            var mousePos, scrollPos, curDown=false;
            var getSelectionText = function() {
                var text = "";
                if (window.getSelection) {
                    text = window.getSelection().toString();
                } else if (document.selection && document.selection.type != "Control") {
                    text = document.selection.createRange().text;
                }
                return text;
            }
            $(document.body).on('mousemove','#toast-container', function(e){
                if(curDown){
                    var scroller = $('#toast-container');
                    var max = {
                        y: scroller[0].scrollHeight - scroller.outerHeight(),
                        x: scroller[0].scrollWidth  - scroller.outerWidth(),
                    }
                    var scrollTo = {
                        y : Math.min( scrollPos.y + (mousePos.y - e.pageY), max.y),
                        x : Math.min( scrollPos.x + (mousePos.x - e.pageX), max.x)
                    }
                    var scrollTo = {
                        y : Math.max( 0, scrollTo.y ),
                        x : Math.max( 0, scrollTo.x )
                    }
                    $('html').css('cursor', 'row-resize');
                    scroller.scrollTop( scrollTo.y );
                    scroller.scrollLeft(scrollTo.x );
                    console.log({
                            x: scrollTo.x,
                            y: scrollTo.y
                        });
                }
            });

            var intervalClickDownClickUp=null;
            $(document.body).on('mousedown','#toast-container', function(e){
                mousePos = {y:e.pageY,x:e.pageX};
                var scroller = $('#toast-container');
                scrollPos = {y:scroller.scrollTop(),x:scroller.scrollLeft()};
                intervalClickDownClickUp = window.setTimeout(function() {
                    if (getSelectionText() == ""){
                        scroller.css({
                            'MozUserSelect': 'none',
                            'webkitUserSelect': 'none'
                        }).attr('unselectable', 'on').bind('selectstart', function () {
                            return false;
                        });
                        curDown = true;
                    }
                    intervalClickDownClickUp=null;
                },250);

            });

            $(document.body).on('mouseup','#toast-container', function(e){
                if(intervalClickDownClickUp!=null){
                    window.clearTimeout(intervalClickDownClickUp);
                    intervalClickDownClickUp=null;
                }
                curDown = false;
                var scroller = $('#toast-container');
                scroller.css({
                    'MozUserSelect':'',
                    'webkitUserSelect':''
                }).attr('unselectable','off').unbind('selectstart');
                $('html').css('cursor', 'auto');
            });

            $.holdReady(false);
        });
        // load JSONView
        loadCSS(typeof $.fn.JSONView !== "undefined", "https://cdnjs.cloudflare.com/ajax/libs/jquery-jsonview/1.2.3/jquery.jsonview.css");
        loadJS(typeof $.fn.JSONView !== "undefined",  "https://cdnjs.cloudflare.com/ajax/libs/jquery-jsonview/1.2.3/jquery.jsonview.js");
    }

});

toasterRetryContainerId=1;
var retryToaster = function(to222Push,responseObj, options ){
    var idx=window.toasterRetryContainerId++;
    var me=this;

    Const = retryButtonClass = 'toast-retryButton';
    Const = toggleInfoButtonClass = 'toast-toggleInfoButton';
    Const = toasterRetryClass= 'toast-retry';
    Const = toasterJsonClass = 'toast-json';

    this.consoleLog = false;
    this.retryButtonText = "RETRY",

    //this.closeButton = true,
    this.timeOut = 10000,
    //this.tapToDismiss = true,
    this.closeOnHover = true,
    this.extendedTimeOut = 2000,

    this.showInfo = true,
    this.onText = null,
    this.onTitle = null,
    this.onJSON = null,
    this.onCalcRemainingNonPushed=null,
    this.onCancel=null,
    this.onRetry = null;

    // set options
    this.setOptions=function(options) {
        for (var key in options) {
            if (typeof(me[key]) !== 'undefined') {
                me[key] = options[key];
            }
        }
        var setToast=function(prop,val){
            if(typeof(val)!='undefined' && toasterOptions[prop]!=val)
                toasterOptions[prop]=val;
        }
        //setToast('closeButton'  ,options.closeButton);
        //setToast('tapToDismiss' ,options.tapToDismiss);
        setToast('closeOnHover' ,options.closeOnHover);
        setToast('extendedTimeOut',options.extendedTimeOut);

    },
    this.getOptions=function(options) {
        return options;
    },
    this.getToasterOptions=function() {
        return toasterOptions;
    };

    var toasterOptions={
        closeButton     :   true,//this.closeButton,
        timeOut         :   0,
        tapToDismiss    :   false,//this.tapToDismiss,
        closeOnHover    :   this.closeOnHover,
        extendedTimeOut :   this.extendedTimeOut,
        onShow : function(e) {
            $("a.json-toggle").next().hide();
        },
        onCloseClick    :   function(e) {
            var me=$(e.target).closest('.'+toasterRetryClass).data('retryFuncs');
            me.cancel = true;
            doCancel();
        },
        onclick         :   function(e) {
            // toaster : Cancel button
            var me=$(e.target).closest('.'+toasterRetryClass).data('retryFuncs');
            if(typeof(me)!=="object") return;
            me.cancel=!$(e.target).is('.'+retryButtonClass);

            if (me.cancel){
                if( me.getToasterOptions().tapToDismiss==true ) doCancel();
                throw "Ignore all toaster clicks except #"+retryButtonClass;
            }else {
                doRetry();
            }
        },
    };

    this.setOptions(options);

    var
        consoleLog=function(text) {
            if(this.consoleLog)
                console.log(text);
        },

        doRetry = function(){
            consoleLog('doRetry');
            // force toaster down
            toastr.clear( thisToaster ,{force:true});
            if(typeof(me.onRetry)=='function')
                consoleLog('onRetry');

            me.onRetry.apply( me, [to222Push, responseObj,doCalcRemainingNonPushed()] );
        },

        doCancel = function(){
            consoleLog('doCancel');
            if(typeof(me.onCancel)==='function') {
                consoleLog('onCancel');
                me.onCancel.apply(me, [to222Push, responseObj,doCalcRemainingNonPushed()]);
            }
        },
        doJSON = function(){
            consoleLog('doJSON');
            if(typeof(me.onJSON)==='function') {
                consoleLog('onJSON');
                return me.onJSON.apply(me, [to222Push, responseObj,doCalcRemainingNonPushed()]);
            }else if(typeof(me.onJSON)==='object' && me.onJSON!==null) {
                return me.onJSON;
            }else{
                // default json
                var ret={};
                if(typeof to222Push != undefined && to222Push!=null)
                    ret.processing= to222Push;
                if(typeof responseObj != undefined && responseObj!=null)
                    ret.response= responseObj;
                var r=doCalcRemainingNonPushed();
                if(Object.keys(ret).length>0)
                    ret.remaining=r;
                if(Object.keys(ret).length==0)
                    me.showInfo=false;
                return ret;
            }
        },
        remainingNonPushed=null,
        doCalcRemainingNonPushed=function(){
            consoleLog('doCalcRemainingNonPushed');
            if(remainingNonPushed!=null)
                return remainingNonPushed;
            if(typeof(me.onCalcRemainingNonPushed)==='function') {
                consoleLog('onCalcRemainingNonPushed');
                return me.onCalcRemainingNonPushed.apply(me,[to222Push, responseObj] );
            }else
                return [];
        },

        doText=function(){
            consoleLog('doText');
            var ret='';
            var r = doCalcRemainingNonPushed();

            if(typeof(me.onText)==='function') {
                consoleLog('onText');
                ret += me.onText.apply(me,[to222Push, responseObj,r] );
            }else if(typeof(me.onText)==='string') {
                ret = me.onText;
            }else{
                ret = 'Failed ('+(r.length)+ "/"+ to222Push.length +")";
            }

            ret += '<br><button type="button" class="'+retryButtonClass+' btn clear">'+me.retryButtonText+'</button>';
            if(me.showInfo) {
                ret+= '<a href="#" aria-expanded="false" class="'+toggleInfoButtonClass+' btn clear glyphicon" '+
                    'data-toggle="collapse" data-target="#json-'+idx+'"><span class="glyphicon"></span></a>' ;
                ret+= '<br><pre id="json-'+idx+'" class="'+toasterJsonClass+' collapse"></pre>';
            }
            return ret;
        },

        doTitle=function(){
            consoleLog('doTitle');
            if(typeof(me.onTitle)==='function') {
                consoleLog('onTitle');
                return me.onTitle.apply(me,[to222Push, responseObj,doCalcRemainingNonPushed()] );
            }else if(typeof(me.onTitle)==='string') {
                return me.onTitle;
            }else{
                return 'Operation error';
            }
        }



    remainingNonPushed = doCalcRemainingNonPushed();

    var thisToaster=toastr.error(doText(), doTitle(), toasterOptions);
    // set maxHeight 4 #toastr-container
    toastr.setContainerHeight();
    // create identity
    $(thisToaster).prop('id', "retryToaster-"+(idx) );
    // share retry-funcs
    $(thisToaster).data('retry-funcs',this);
    // add instance CSS Class
    $(thisToaster).addClass(toasterRetryClass);
    // handle JSON info
    if(me.showInfo) {
        $(thisToaster).find( '.'+toasterJsonClass ).JSONView(doJSON(), {collapsed: true});
        $(thisToaster).find( '.'+toasterJsonClass ).JSONView('toggle', 2)
    }
    // handle timeOut
    var interval4close=null;
    if(me.timeOut>0){
        var maxTime = parseFloat(new Date().getTime()) + me.timeOut;
        var isMouseHouver = false;
        $("#retryToaster-"+(idx)).mouseleave(function(){
            consoleLog("MouseOut");
            isMouseHouver = false;
            maxTime = Math.max(maxTime, parseFloat(new Date().getTime()) + me.extendedTimeOut );
        }).mouseenter(function(){
            consoleLog("MouseOut");
            isMouseHouver = true;
            maxTime = Math.max(maxTime, parseFloat(new Date().getTime()) + me.extendedTimeOut );
        })
        interval4close=window.setInterval(function() {
            if((!isMouseHouver && (new Date().getTime()>maxTime)) ) {
                toastr.clear(thisToaster, {force: true});
                window.clearInterval(interval4close);
            }else if(!$(thisToaster).is(":visible")) {
                window.clearInterval(interval4close);
            }
        },250);
    }

}

