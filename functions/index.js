const functions = require('firebase-functions');
const auth = require('./util/auth');

exports.helloWorld = functions.https.onRequest((request, response) => {
     response.send("Hello from Firebase!");
});

const app = require('express')();
const cors = require('cors');
app.use(cors({origin:true}));

const {
    getAllEvents,
    postEvent,
    deleteEvent,
    editEvent,
  } = require("./APIs/events");

const {
    loginUser,
    signUpUser,
    getUserDetail
} = require('./APIs/users')

// Events
app.get("/events",auth, getAllEvents);
app.post("/event",auth, postEvent);
app.delete("/event/:eventId",auth, deleteEvent);
app.put("/event/:eventId",auth, editEvent);
// Users 
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.get('/user', auth, getUserDetail);
exports.api = functions.https.onRequest(app);