// This is a higher order function that runs the code in async await with try catch for error handling 

// This is just a wrapper function 

const asyncHandler = (fun) => {
    return async (req, res, next) => {
        try {
            await fun(req, res, next)

        } catch (error) {
            res.status(error?.statusCode || 500).json({
                success: false,
                message: error.message
            })
        }

    }
}

export default asyncHandler 