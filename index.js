import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import signUp from './components/signupSchema.js'
import genJWT from './components/genJWT.js'
import login from './components/login.js'
import decodeJWT from './components/verifyToken.js'
import updateLink from './components/changeLinks.js'
import imgToURL from './components/Cloudinary.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

// Connecting to MongoDB Client
const client = new MongoClient(process.env.MONGO_URI)
client.connect()
const userDB = client.db("Linklane")


// Register Port
app.post('/register', async (req, res) => {
    const {name, email, password, img_url, bio, page_color} = await req.body
    //const URL = await imgToURL(img_url)
    const URL = 'none'
    const success = await signUp(name, email, password, URL, bio, page_color, userDB)
    
    if(!success) return res.status(409).json(
        {
            message : "User already registered"
        }
    )
    
    const accessToken = await genJWT(success.id, success.email)

    res.status(201).json(
        {
            message : "User Registered Successfully",
            accessToken,
        }
    )
})


// Login 
app.post('/login', async (req, res) => {
    const {email, password} = await req.body
    const success = await login(email, password, userDB)
    if(!success) res.status(401).json(
        {
            message : "Invalid Credentials"
        }
    )

    const accessToken = await genJWT(success.id, success.email)

    res.status(200).json(
        {
            message : "Login Successfull",
            accessToken,
            'id' : success.id
        }
    )

})


// Addition of Links
app.post('/update', async (req, res) => {

    const authHeader = await req.headers.accesstoken

    if(!authHeader) return res.status(401).json({
        "message" : "No token provided"
    })

    const accessToken = await decodeJWT(authHeader)

    if (!accessToken) return res.status(403).json({
        "message" : "Invalid Token"
    })

    const json = await req.body

    if (json.id !== accessToken.id) return res.status(401).json({
        'message' : 'Unauthorized Access'
    })
    

    const collection = await userDB.collection('users')
    const result = await collection.findOneAndReplace({id : json.id}, json)
    
    if(!result) res.status(404).json({
        "message" : "User not found"
    })
    
    res.status(200).json({
        "message" : "Profile Updated Successfully"
    })

})


// Public Details
app.get('/public', async (req, res) => {
    const id = await req.headers.id

    const collection = await userDB.collection("users")
    const user = await collection.findOne({id : id})

    if(!user) res.status(404).json({
        'message' : 'User not found'
    })

    res.status(200).json(user)
})

app.get('/permission', async (req, res) => {
    const {id, accesstoken} = await req.headers
    const response = await decodeJWT(accesstoken)
    if (response?.id === id) return res.status(200).json({
        'message' : 'Permission Granted'
    })

    res.status(401).json({
        'message' : 'Permission Denied'
    })
})



//  Port Listening

app.listen(PORT, ()=>{
    console.log("Server is started")
})
