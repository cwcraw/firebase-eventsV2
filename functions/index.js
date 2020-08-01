const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((request, response) => {
     response.send("Hello from Firebase!");
});

const app = require('express')();

const {
    getAllEvents,
    postEvent,
    deleteEvent,
    editEvent,
  } = require("./APIs/events");

// Events
app.get("/events", getAllEvents);
app.post("/event", postEvent);
app.delete("/event/:eventId", deleteEvent);
app.put("/event/:eventId", editEvent);
// Users 
// app.post("/login", loginUser);
// app.post("/signup", signUpUser);
// app.get('/user', auth, getUserDetail);
exports.api = functions.https.onRequest(app);