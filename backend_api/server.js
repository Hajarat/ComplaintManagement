require('dotenv').config()
const assert = require('assert')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(
	express.urlencoded({
		extended: true
	})
)
app.use(express.json())
const MongoClient = require('mongodb').MongoClient
const uri = process.env.DB_String

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect(function(err) {
	assert.equal(null, err);
	console.log('Connected successfully to server')

	app.post('/register', async (req, res) => {
		console.log("Register attempt")
		try {
			const emailMatch = await client.db("Complaints").collection("Users").findOne(
				{email: req.body.email}
			)
			if (emailMatch !== null) {
				res.send({error: "Email already taken."})
				return
			}
			const usernameMatch = await client.db("Complaints").collection("Users").findOne(
				{username: req.body.username}
			)
			if (usernameMatch !== null) {
				res.send({error: "Username already taken."})
				return
			}

			const insertionAttempt = await client.db("Complaints").collection("Users").insertOne({
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			})
			res.send({message: "Registration Successful."})
			console.log("1 record inserted")
		} catch (e) {
			res.send({error: "Error writing to database."})
			return
		}
		
	})

	app.post('/login', async (req, res) => {
		console.log("Login attempt")
		try {
			client.db("Complaints").collection("Users").findOne(
				{username: req.body.username, password: req.body.password}, (err, user) => {
					if (err) {
						res.send({error: "User not found."})
					} else {
						res.send({message: "Logged in successfully"})
					}
				}
			)
		} catch (e) {
			res.send({error: "Error verifying user data."})
		}
	})

	app.listen(8080, () =>
		console.log(`Listening on port 8080!`),
	)
})