import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import signUp from './components/signupSchema'
import genJWT from './components/genJWT'
import login from './components/login'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())

// Connecting to MongoDB Client
const client = new MongoClient(process.env.MONGO_URI)
client.connect()
const userDB = client.db("Linklane")


// Register Port
app.post('/register', async (req, res) => {
    const {name, email, password, img_url, bio} = await req.body
    const success = await signUp(name, email, password, img_url, bio, userDB)
    if(!success) res.status(409).json(
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
            accessToken
        }
    )

})


//  Port Listening

app.listen(PORT, ()=>{
    console.log("Server is started")
})
