import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import signUp from './components/signupSchema'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())

// Connecting to MongoDB Client
const client = new MongoClient(process.env.MONGO_URI)
client.connect()



// Register Port
app.post('/register', async (req, res) => {
    const {name, email, password, img_url, bio} = await req.body
    const db = client.db("Linklane")
    const success = await signUp(name, email, password, img_url, bio, db)
    if(success) res.send("Registration Successfull")
    else res.send("User already registered")
})



//  Port Listening

app.listen(PORT, ()=>{
    console.log("Server is started")
})
