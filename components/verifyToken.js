import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export async function decodeJWT(auth) {
    const accessToken = auth.split(" ")[1]

    try {
        const decode = jwt.verify(accessToken, process.env.JWT_SECRET)
        return decode
    }
    catch {
        return 0
    }
}