const errorHandle = (statusCode,massage) =>{
        const error = new Error();
        error.statusCode = statusCode;
        error.massage = massage;
        return error;
}