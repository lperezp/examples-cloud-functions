import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

import * as express from "express";
import * as cors from "cors";

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://examples-cloud-functions.firebaseio.com"
});

const db = admin.firestore();

 export const helloWorld = functions.https.onRequest((request, response) => {
  response.json({
      mensaje :"Hola mundo desde Firebase!!"
    });
 });

 export const getHorses = functions.https.onRequest( async (request, response) => {
  const horseRef = db.collection('horses');
  const docsSnap = await horseRef.get();
  const horses = docsSnap.docs.map(doc => doc.data());
  response.json(horses);
});

// Express

const app = express();
app.use(cors({ origin : true}));

app.get('/horses', async (req, res) => {
  const horseRef = db.collection('horses');
  const docsSnap = await horseRef.get();
  const horses = docsSnap.docs.map(doc => doc.data());
  res.json(horses);
})

app.post('/horses/:id', async (req, res) => {
  const id = req.params.id;
  const horsesRef = db.collection('horses').doc(id);
  const horseSnap = await horsesRef.get();
  if(!horseSnap.exists){
    res.status(404).json({
      code: 404,
      status : false,
      message: `The horse ID ${id} does exist.`
    })
  }else{
    res.json({
      code: 200,
      status : true,
      message: "The horse ID does exist."
    })
  }
})

export const api = functions.https.onRequest(app);