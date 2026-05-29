import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export async function decodeJWT(auth) {
    try {
        const decode = jwt.verify(auth, process.env.JWT_SECRET)
        return decode
    }
    catch {
        return 0
    }
}