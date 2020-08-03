/*
    debounce.js
    Utility that limits the time between function calls
    Used in the mood filter so that a user has a bit of time to finish typing before the results are filtered
*/

//Function will only be invoked after "wait" time in milliseconds has elapsed
export default (func, wait) => {
    let timeout;

    //the function that will be executed when time has elapsed
    return function executedFunction(...args) {

        //callback function that is executed after debounce time has elapsed
        const later = () => {
            timeout = null;
            func(...args); //spread (...) operator captures parameters we want to pass to the invoked function
        };

        //The clearTimeout() method clears a timer set with the setTimeout() method.
        clearTimeout(timeout);

        //The setTimeout() method calls a function or evaluates an expression after a specified number of milliseconds.
        timeout = setTimeout(later, wait);
    };
};