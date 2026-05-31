import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'

export default async function signUp(name, email, password, img_url, bio, page_color, db) {
    const hash = await bcrypt.hash(password, 10)
    const Schema = {
        "id" : v4(),
        "name" : name,
        "email" : email,
        "password" : hash,
        "bio" : bio,
        "img_url" : img_url,
        "page_color" : page_color,
        "links" : []
    }  

    const collection = await db.collection("users")
    const user = await collection.findOne({email : email})
    if (!user) {
       await collection.insertOne(Schema) 
       return Schema
    }
    return 0

}