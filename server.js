const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

var db, collection;

const url = "mongodb+srv://cintnguyen98:mongodb613@cluster0.x0ntbdd.mongodb.net/?retryWrites=true&w=majority";
const dbName = "todolistdb";

app.listen(3000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('tasks').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', { tasks: result })
  })
})

//creating the users task input
app.post('/tasks', (req, res) => {
  db.collection('tasks').insertOne({ taskName: req.body.taskName, complete: false }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

//toggling between complete status true or false in mongoDB
app.put('/tasks', (req, res) => {
  console.log(req.body)
  db.collection('tasks')
    .findOneAndUpdate({ _id: ObjectID(req.body.taskId) }, [{
      $set: {
        complete: {
          $not: "$complete"
        }
      }
    }],
      (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
})

app.delete('/tasks', (req, res) => {
  db.collection('tasks').findOneAndDelete({ taskName: req.body.taskName}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

app.delete('/deleteAllTasks', (req, res) => {
  db.collection('tasks').deleteMany((err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})