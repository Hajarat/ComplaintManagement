require('dotenv').config()
const assert = require('assert')
const express = require('express')
const app = express()
app.use(
	express.urlencoded({
		extended: true
	})
)
app.use(express.json())

const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
const uri = process.env.DB_String
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect(function(err) {
	assert.equal(null, err);
	console.log('Connected successfully to server')

	app.get('/retrieve-all-pending-complaints/:user', async (req, res) => {
		console.log("Attempting to retrieve all pending complaints.")
		try {
			const adminMatch = client.db("Complaints").collection("Admin").findOne(
				{username: req.params.user})
			if (adminMatch === null) {
				{error: "You do not have admin access."}
				return
			}
			const complaints = await client.db("Complaints").collection("User-complaints").find({complaintStatus: "Pending"}).toArray()
			res.send(complaints)
		} catch (e) {
			res.send({error: "Error accessing database."})
		}
	})

	app.get('/retrieve-complaints/:user', async (req, res) => {
		console.log("Attempting to retrieve user complaints.")
		try {
			const complaints = await client.db("Complaints").collection("User-complaints").find({username: req.params.user}).toArray()
			res.send(complaints)
		} catch (e) {
			res.send({error: "Error accessing database."})
		}
	})

	app.post('/register', async (req, res) => {
		console.log("Register attempt.")
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
		}
		
	})

	app.post('/handle-complaint' , async (req, res) => {
		console.log("Handle " + req.body.action + " attempt on object " + req.body.id + ".")
		try {
			var id = new ObjectId(req.body.id)
			if (req.body.action === "resolve") {
				client.db("Complaints").collection("User-complaints").updateOne({_id: id}, {$set: {complaintStatus: "Resolved"}})
				res.send({message: "Complaint Resolved."})
				console.log("1 record updated")
			}
			if (req.body.action === "dismiss") {
				client.db("Complaints").collection("User-complaints").updateOne({_id: id}, {$set: {complaintStatus: "Dismissed"}})
				res.send({message: "Complaint Dismissed."})
				console.log("1 record updated")
			}
		} catch (e) {
			res.send({error: "Error writing to database."})
		}
	})

	app.post('/login', async (req, res) => {
		console.log("Login attempt.")
		try {
			client.db("Complaints").collection("Users").findOne(
				{username: req.body.username, password: req.body.password}, (err, user) => {
					if (err) {
					} else {
						res.send({message: "Logged in successfully"})
					}
				}
			)
		} catch (e) {
			res.send({error: "Error verifying user data."})
		}
	})

	app.post('/send-complaint', async (req, res) => {
		console.log("Complaint attempt.")
		try {
			client.db("Complaints").collection("User-complaints").insertOne({
				username: req.body.username,
				sector: req.body.sector,
				option1Checked: req.body.option1Checked,
				option2Checked: req.body.option2Checked,
				option3Checked: req.body.option3Checked,
				option4Checked: req.body.option4Checked,
				complaintTitle: req.body.complaintTitle,
				complaintBody: req.body.complaintBody,
				complaintStatus: "Pending"
			})
			res.send({message: "Complaint Successfully sent."})
			console.log("1 record inserted")
		} catch (e) {
			res.send({error: "Error while attempting to write complaint."})
		}
	})

	app.listen(8080, () =>
		console.log(`Listening on port 8080!`),
	)
})