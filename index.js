const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const crypto = require('crypto');
const { Client } = require('pg');

app.use(bodyParser.json())

/** 
 * create table hashdb (
 * hash varchar(128) not null,
 * message varchar(255) not null)
 * ;
*/

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

function getMessageWithHash(hash) {
  return client.query(`SELECT message FROM hashdb WHERE hash='${hash}';`, (err, res) => {
    if (err) return err;
    client.end();
    return res
  });
}

function messageToHash(message) {
  const hash = crypto.createHash('sha256');
  hash.update(message)
  return hash.digest('hex')
}

function addToDB(hashedMessage, message) {
  return client.query(`INSERT INTO hashdb VALUES ('${hashedMessage}', '${message}');`, (err, res) => {
    if (err) return err;
    client.end();
    return res
  });
}

app.post('/messages', (req, res) => {
  const { message = '' } = req.body
  if(message === '') res.status(404).send('Message not found. Try \'{ "message": "your message here" }\'')
  const hashedMessage = messageToHash(message)
  try {
    const status = addToDB(hashedMessage, message)
    console.log('addToDB status', status)
    res.status(200).send(hashedMessage)
  } catch(err) {
    res.status(404).send(err)
  }
})

app.get('/messages/:hash', (req, res) => {
  const { hash = '' } = req.params
  if(hash === '') res.status(404).send('Hash not found.')
  try {
    const message = getMessageWithHash(hash)
    res.status(200).send(message)
  } catch(err) {
    res.status(404).send(err)
  }
})

app.listen(3000, () => console.log('text-to-hash app listening on port 3000!'))