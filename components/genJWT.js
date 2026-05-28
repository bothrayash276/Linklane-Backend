import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export default function genJWT(id, email) {
    const accessToken = jwt.sign(
        {
            id : id,
            email : email
        },
        process.env.JWT_SECRET,
        {
            expiresIn : "24h"
        }
    )

    return accessToken
}