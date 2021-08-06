//file designed specifically to be used as a module for date generation
exports.getDate = function(){        //set as anonymous function
    let today = new Date();
    
    let options = {                 //defined JS object for formatting date (as shown on stackoverflow)
    weekday: "long",
    day: "numeric",
    month: "long"
    };

    return day = today.toLocaleDateString("en-US",options);        //first parameter is region, and second is options for formatting
}

exports.getDay = function(){        //set as anonymous function
    let today = new Date();
    
    let options = {                 //defined JS object for formatting date (as shown on stackoverflow)
    weekday: "long"
    };

    return day = today.toLocaleDateString("en-US",options);        //first parameter is region, and second is options for formatting
}