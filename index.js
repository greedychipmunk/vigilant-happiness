const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const crypto = require('crypto');
const hash = crypto.createHash('sha256');

app.use(bodyParser.json())

// const mongoUrl = 'mongodb://hashdbuser:0p3n1tn0w@ds215502.mlab.com:15502/hashdb'

function messageToHash(message) {
  hash.update(message)
  return hash.digest('hex')
}

function addHashToDB(hashedMessage, message) {
}

app.post('/messages', (req, res) => {
  const { message = '' } = req.body
  if(message === '') res.status(404).send('Message not found. Try \'{ "message": "your message here" }\'')
  const hashedMessage = messageToHash(message)
  // addHashToDB(hashedMessage, message)
  res.status(200).send(hashedMessage)
})

app.get('/messages/:hash', (req, res) => {
  res.status(200).send('Hello Hash!')
})

app.listen(3000, () => console.log('text-to-hash app listening on port 3000!'))