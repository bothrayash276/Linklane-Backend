import bcrypt from 'bcrypt'

export default async function login(email, password, db) {
    const collection = db.collection("users")
    const user = await collection.findOne({email : email})
    
    if(!user) return 0

    const hash = user.password
    const result = await bcrypt.compare(password, hash)

    if(result)
}