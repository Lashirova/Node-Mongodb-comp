const express = require('express')
const app = express()
const port = 3001
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
app.set('views engine', 'index.pug')
app.use(express.static('public'))
app.use(bodyParser.json())


const connectionString = 'mongodb+srv://lachinAshirova:lachin_ashirova@cluster0.loww4.mongodb.net/quotes?retryWrites=true&w=majority'


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db('quotes')
    const quotesCollection = db.collection('quotes')
    app.use(bodyParser.urlencoded({ extended: true }))
    // app.get('/', (req, res) => {
    //   res.sendFile(__dirname + '/index.html')
    // })
    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.pug', { quotes: results })

        })
        .catch(error => console.error(error))
      // ...
    })
    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'lachin' },		// write it manually from your quotes
        {
          $set: {
            name: req.body.name,
            address: req.body.address
          }
        },
        {
          upsert: true
        }
      )
      .then(result => {
        res.json('Success')
       })
        .catch(error => console.error(error))
    })
    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name},
        options
      )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No quote to delete')
    }
    res.json(`Deleted  quote`)
  })
  .catch(error => console.error(error))
  })
app.listen(port,()=> console.log('Example app listening on port!'))
}) 
.catch(console.error)
