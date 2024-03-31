module.exports = (app, models) => {
  // NEW
  app.get('/events/:eventId/rsvps/new', (req, res) => {
    models.Event.findByPk(req.params.eventId).then(event => {
      res.render('rsvps-new', { event: event });
    });
  });

  // CREATE
  app.post('/events/:eventId/rsvps', (req, res) => {
    if (!req.body || !req.body.name || !req.body.email) {
      res.status(400).send('Name and email are required');
      return;
    }

    req.body.EventId = req.params.eventId;
    models.Rsvp.create(req.body).then(rsvp => {
      res.redirect(`/events/${req.params.eventId}`);
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
  });

  // DELETE
  app.delete('/events/:eventId/rsvps/:id', (req, res) => {
    models.Rsvp.findByPk(req.params.id).then(rsvp => {
      if (!rsvp) {
        res.status(404).send('RSVP not found');
        return;
      }

      rsvp.destroy();
      res.redirect(`/events/${req.params.eventId}`);
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
  });
};