/**
 * Created by vitorcool on 8/21/2017.
 */
window.addEventListener("resize",function(event){
    if(typeof jQuery!=="undefined") {
        $("#toastr-container").css('maxWidth')
    }
})
document.addEventListener("DOMContentLoaded", function(event) {
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
    loadJS(typeof jQuery !== "undefined",               "http://code.jquery.com/jquery-latest.min.js",function(){
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
            toastr.setContainerHeight();

            $(document).on('click','.jsonview .prop',function(event){
                //event.stopPropagation();
                var e=$(event.target).prev(".collapser");
                if(e.length>0) e[0].click();
            })

            // add toastr.retry()
            toastr.retry=function(toPush, responseObj, options ) {
                return new retryToaster(toPush,responseObj,options);
            }
        });
        // load JSONView
        loadCSS(typeof $.fn.JSONView !== "undefined", "https://cdnjs.cloudflare.com/ajax/libs/jquery-jsonview/1.2.3/jquery.jsonview.css");
        loadJS(typeof $.fn.JSONView !== "undefined",  "https://cdnjs.cloudflare.com/ajax/libs/jquery-jsonview/1.2.3/jquery.jsonview.js");
    });

});

toasterRetryContainerId=1;
var retryToaster = function(to222Push,responseObj, options ){
    //if( $("#retryToaster-"+(window.toasterRetryContainerId)).length==0 ) return;
    window.toasterRetryContainerId++;
    Const = retryButtonClass = 'toast-retryButton';
    Const = toggleInfoButtonClass = 'toast-toggleInfoButton';
    Const = toasterRetryClass= 'toast-retry';
    Const = toasterJsonClass = 'toast-json';

    this.retryButtonText = "RETRY",
    this.closeButton = true,
    this.timeOut = 0,
    this.tapToDismiss = false,
    this.closeOnHover = false,
    this.extendedTimeOut = 0,
    this.showInfo = true,
    this.pushAfterClose = false,
    this.onText = null,
    this.onTitle = null,
    this.onJSON = null,
    this.onCalcRemainingNonPushed=null,
    this.onCancel=null,
    this.onRetry = null;

    var me=this;

    var toasterOptions={
        closeButton     :   this.closeButton,
        timeOut         :   this.timeOut,
        tapToDismiss    :   this.tapToDismiss,
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
        setToast('closeButton'  ,options.closeButton);
        setToast('timeOut'      ,options.timeOut);
        setToast('tapToDismiss' ,options.tapToDismiss);
        setToast('closeOnHover' ,options.closeOnHover);
        setToast('extendedTimeOut',options.extendedTimeOut);

    },
        this.getOptions=function(options) {
            return options;
        },
        this.getToasterOptions=function() {
            return toasterOptions;
        }


    this.setOptions(options);

    var doRetry = function(){
            console.log('doRetry');
            // force toaster down
            toastr.clear( thisToaster ,{force:true});
            if(typeof(me.onRetry)=='function')
                console.log('onRetry');
            if(this.pushAfterClose)
                window.setTimeout(function(){
                    me.onRetry.apply( me, [to222Push, responseObj,doCalcRemainingNonPushed()] );
                },thisToaster.hideDuration);
            else
                me.onRetry.apply( me, [to222Push, responseObj,doCalcRemainingNonPushed()] );
        },

        doCancel = function(){
            console.log('doCancel');
            if(typeof(me.onCancel)==='function') {
                console.log('onCancel');
                me.onCancel.apply(me, [to222Push, responseObj,doCalcRemainingNonPushed()]);
            }
        },
        doJSON = function(){
            console.log('doJSON');
            if(typeof(me.onJSON)==='function') {
                console.log('onJSON');
                return me.onJSON.apply(me, [to222Push, responseObj,doCalcRemainingNonPushed()]);
            }else if(typeof(me.onJSON)==='object' && me.onJSON!==null) {
                return me.onJSON;
            }else{
                // default json
                return {
                    processing: to222Push,
                    response: responseObj,
                    remaining: doCalcRemainingNonPushed(),
                }
            }
        },
        remainingNonPushed=null,
        doCalcRemainingNonPushed=function(){
            console.log('doCalcRemainingNonPushed');
            if(remainingNonPushed!=null)
                return remainingNonPushed;
            if(typeof(me.onCalcRemainingNonPushed)==='function') {
                console.log('onCalcRemainingNonPushed');
                return me.onCalcRemainingNonPushed.apply(me,[to222Push, responseObj] );
            }else
                return [];
        },

        doText=function(){
            console.log('doText');
            var ret='';
            var r = doCalcRemainingNonPushed();

            if(typeof(me.onText)==='function') {
                console.log('onText');
                ret += me.onText.apply(me,[to222Push, responseObj,r] );
            }else if(typeof(me.onText)==='string') {
                ret = me.onText;
            }else{
                ret = 'Failed ('+(r.length)+ "/"+ to222Push.length +")";
            }

            ret += '<br><button type="button" class="'+retryButtonClass+' btn clear">'+me.retryButtonText+'</button>';
            if(me.showInfo) {
                ret+= '<a href="#" aria-expanded="false" class="'+toggleInfoButtonClass+' btn clear glyphicon" '+
                    'data-toggle="collapse" data-target="#json-'+window.toasterRetryContainerId+'"><span class="glyphicon"></span></a>' ;
                ret+= '<br><pre id="json-'+window.toasterRetryContainerId+'" class="'+toasterJsonClass+' collapse"></pre>';
            }
            return ret;
        },

        doTitle=function(){
            console.log('doTitle');
            if(typeof(me.onTitle)==='function') {
                console.log('onTitle');
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
    $(thisToaster).prop('id', "retryToaster-"+(window.toasterRetryContainerId) );
    // share retry-funcs
    $(thisToaster).data('retry-funcs',this);
    // add instance CSS Class
    $(thisToaster).addClass(toasterRetryClass);
    if(me.showInfo) {
        $(thisToaster).find( '.'+toasterJsonClass ).JSONView(doJSON(), {collapsed: true});
        $(thisToaster).find( '.'+toasterJsonClass ).JSONView('toggle', 2)
    }
}

