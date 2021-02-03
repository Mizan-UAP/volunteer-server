const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');

const uri = "mongodb+srv://volunteerList:GKrRv8v1l69bWazz@cluster0.djtwh.mongodb.net/volunteer?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})




client.connect(err => {
    const collection = client.db("volunteer").collection("volunteerList");

    app.get('/volun', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //updateUI
    app.get( '/update/:id', (req, res) => {
        collection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post("/addVolunteer", (req, res) => {
        const volunteer = req.body;
        collection.insertOne(volunteer)
            .then(result => {

                res.redirect('/')
            })

    })
//updateDatabase
    app.patch('/update/:id', (req, res) => {
        collection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: { name: req.body.name , email: req.body.email, phoneNumber: req.body.phoneNumber}
        })
        .then(result => {
            console.log(result);
        })
    })

    app.delete('/delete/:id', (req, res) => {
      collection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
         res.send(result.deletedCount > 0)
      })
    })

    // client.close();
});



app.listen(5000);