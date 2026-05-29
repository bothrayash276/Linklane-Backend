export default async function updateLink(accessToken, db, linkArray) {
    const collection = await db.collection("users")

    const user = await collection.findOne({email : accessToken.email})

    if (!user) return 0

    const {_id, ...userData} = user

    const updatedUser = {
        ...userData, 
        "links" : linkArray 
    }

    await collection.findOneAndReplace({id : updatedUser.id}, updatedUser)

    return 1

}