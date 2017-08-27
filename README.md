# toaster-retry
- Easy to use, RETRY UI.
- Extension of toastr.js notifications. One notification type "retry", for error handling

<img align="right" src="https://raw.githubusercontent.com/vitorcool/toaster-retry/master/printscreen.png">

### Requirements:
- [jquery/jquery] - New Wave JavaScript
- [twbs/bootstrap] - Powerful front-end framework for faster and easier web development
- [CodeSeven/toastr] - toastr is a Javascript library for non-blocking notifications.
- [yesmeck/jquery-jsonview] - Formats & syntax highlights JSON.
       
                
        
## Install
#### [Bower](http://bower.io/search/?q=toaster-retry) - (recommended)
```
bower install toaster-retry
```
#### [npm](https://www.npmjs.com/package/toaster-retry)
```
npm install toaster-retry
```
#### [Download zip](https://github.com/vitorcool/toaster-retry/archive/master.zip)


        
        
## Setup
* Simple (required javascript libraries will be auto-load). Note: In order to stylesheet defs work well, make sure toastr-retry.css is loaded after body tag        
```
        <html lang="en">
        <head>
            <meta charset="UTF-8">          
            <script src="http://code.jquery.com/jquery-latest.min.js"></script>
            <script src="js/toastr-retry.js"></script>
        </head>
        
        <body>
            <link href="css/toastr-retry.css" rel="stylesheet"></link>
```
           
        
* Manual (load all javascript libraries)
```HTML
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
                        <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet">
                        <link href="https://cdnjs.cloudflare.com/ajax/libs/jquery-jsonview/1.2.3/jquery.jsonview.css" rel="stylesheet">
            
            <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>      
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
            <script src="js/toastr-retry.js"></script>                 
        </head>
        
        <body>
            <link href="css/toastr-retry.css" rel="stylesheet"></link>
```

## Current version

[ver 1.0.1](https://github.com/vitorcool/toaster-retry)
      
        
[jquery/jquery]: <https://github.com/jquery/jquery>
[twbs/bootstrap]: <https://github.com/twbs/bootstrap>
[CodeSeven/toastr]: <https://github.com/CodeSeven/toastr>
[yesmeck/jquery-jsonview]: <https://github.com/yesmeck/jquery-jsonview>


## How to use it

### The simpler way
```
toastr.retry(null,null,{
       onText : "There have been some errors",
       onTitle: "Simple Retry",
       onCancel: function () {
           // do some thing
       },
       onRetry: function () {
           // repeat
           simple_retry();
       },
       timeOut:10000,
});
```
               
### Handling data being processed and response resulted from that process 
```
toastr.retry(toPush,responseObj,
{
    // calculate non processed elements 
    onCalcRemainingNonPushed: function (toPush, responseObj) {
            var ret = [];
            toPush.forEach(function (current) {
                if (responseObj['ticket_ids_updated'].indexOf(current.ticketId) == -1)
                    ret.push(current);
            });
            return ret;
    },
    onText : function(toPush, responseObj, remaingNonUpdate){
        return 'Failed to update ' +
            (remaingNonUpdate.length) + '/' + toPush.length + ' tickets' ;
    },
    onTitle: function(ticketsToPush, responseObj, remaingNonUpdate){
        return "Retry update tickets (DEMO)",
    },
    onCancel: function (toPush, responseObj, remainingNonUpdades) {
        // do some think or not
        //unselectAllTickets(remainingNonUpdades);
    },
    onRetry: function (toPush, responseObj, remainingNonUpdated) {
        // any(execute, update, process, insert, [verb])
        execute_retry(remainingNonUpdated);
    },
    showInfo: true,
    // Information that will be available to see on retry notification
    onJSON: function (toPush, responseObj, remainingNonUpdated) {
        return {Updating: toPush,
            ResponseObj:responseObj,
            Remaining:remainingNonUpdated}
    },
    // timeOut=0 (forever), timeOut=miliseconds
    timeOut:0,
});
```               

## Aditional options
```
// if true display messages to console
consoleLog = false

// Text of retry button 
retryButtonText = "RETRY"

// Time wait until the notification is closed 
timeOut = 10000

// if true and mouse is hover the notification, then it closes
closeOnHover = true,

Time wait after mouse has been hover the notification
extendedTimeOut = 2000,
```    
    
## Author
**Vitor Oliveira**




## License
toastr-retry is under MIT license - http://www.opensource.org/licenses/mit-license.php
    