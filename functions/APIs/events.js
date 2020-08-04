const { db } = require("../util/admin");

exports.getAllEvents = (request, response) => {
  db.collection("events")
    .where("username", "==", request.user.username)
    .orderBy("time", "desc")
    .get()
    .then((data) => {
      let events = [];
      data.forEach((doc) => {
        events.push({
          eventId: doc.id,
          username: doc.data().username,
          event: doc.data().event,
          location: doc.data().location,
          note: doc.data().note,
          time: doc.data().time,
        });
      });
      return response.json(events);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.postEvent = (request, response) => {
  if (request.body.event.trim() === "") {
    return response.status(400).json({ event: "Event must not be empty" });
  }

  if (request.body.location.trim() === "") {
    return response
      .status(400)
      .json({ location: "Location must not be empty" });
  }
  if (request.body.time.trim() === "") {
    return response.status(400).json({ time: "Time must not be empty" });
  }

  const newEventItem = {
    username: request.body.username,
    event: request.body.event,
    location: request.body.location,
    time: request.body.time,
    note: request.body.note,
  };
  console.log(newEventItem)
  db.collection("events")
    .add(newEventItem)
    .then((doc) => {
      console.log(doc)
      const responseEventItem = newEventItem;
      responseEventItem.id = doc.id;
      return response.json(responseEventItem);
    })
    .catch((err) => {
      response.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

exports.deleteEvent = (request, response) => {
  const document = db.doc(`/events/${request.params.eventId}`);
  document
    .get()
    .then((doc) => {
      if (doc.data().username !== request.user.username) {
        return response.status(403).json({ error: "UnAuthorized" });
      }
      if (!doc.exists) {
        return response.status(404).json({ error: "Event not found" });
      }
      return document.delete();
    })
    .then(() => {
      response.json({ message: "Delete successfull" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.editEvent = (request, response) => {
  let document = db.collection("events").doc(`${request.params.eventId}`);
  document
    .update(request.body)
    .then(() => {
      response.json({ message: "Updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({
        error: err.code,
      });
    });
};
