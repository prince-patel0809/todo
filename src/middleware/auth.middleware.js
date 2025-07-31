import jwt from "jsonwebtoken"
export const AuthMiddleware = async (req, res, next) => {
    try {
        const headers = req.headers
        let token = null;
        if (headers.authorization) {
            const arr = headers.authorization.split(' ')
            if (arr.length >= 2) {
                token = arr[1]
            }
        }
        if (!token) {
            throw new Error("Unautherized Request")
        }

        // validaten token 
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded.data
        next()
    } catch (error) {
        return res.send({
            success: false,
            message: "Unautherized Request",
            error
        })
    }
}