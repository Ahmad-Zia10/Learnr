class apiError extends Error { // inherit from base class Error
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)//calls constructor of base class
        this.statusCode = statusCode;       // JavaScript adds that property dynamically to the object when the constructor runs.
        this.data = null; 
        this.message = message;
        this.success = false;
        this.errors = errors;
        
        if(stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default apiError;

//A stack trace (or stacktrace) is a record of the function calls made in your program at a particular point — typically when an error occurs.
//Where the error occurred . How your code got there (the call path). Which file, line, and column the error happened on

//if a custom stack trace is passed → use that.
//Otherwise → generate a new one using Error.captureStackTrace(...), which fills this.stack with the current function call chain.


