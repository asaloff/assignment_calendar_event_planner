const express = require('express');
const router = express.Router();
const db = require('./../models');
const sequelize = db.sequelize;


// ----------------------------------------
// Index
// ----------------------------------------
router.get('/', (req, res) => {
  db.calendars.findAll({
    include: [
      { model: db.users, as: 'user' }
    ]
  })
    .then(calendars => {
      res.render('calendars/index', { calendars });
    })
    .catch(e => res.status(500).send(e.stack));
});


// ----------------------------------------
// New
// ----------------------------------------
router.get('/new', (req, res) => {
  res.render('partials/_calendarForm');
});


// ----------------------------------------
// Create
// ----------------------------------------
router.post('/', (req, res) => {
  // req.flash('success', "Test success flash");
  let calendarParams = req.body.calendar;

  db.users.find({ where: { username: calendarParams.username } })
    .then(user => {
      if (user) {
        db.calendars.create({
          name: calendarParams.name,
          userId: user.id
        })
          .then(calendar => {
            req.flash('success', `Calendar: ${ calendar.name } created successfully`);
            res.redirect(`/calendars/${ calendar.id }`);
          })
          .catch(e => {
            req.flash('error', e.errors[0].message);
            res.render('partials/_calendarForm');
          });
      } else {
        req.flash('error', "The username does not exist");
        res.render('partials/_calendarForm');
      }
    })
    .catch(e => res.status(500).send(e.stack));
});


// ----------------------------------------
// Show
// ----------------------------------------
router.get('/:id', (req, res) => {
  db.calendars.findById(req.params.id, {
    include: [{
      model: db.users,
      as: 'user'
    }]
  })
    .then(calendar => {
      if (calendar) {
        res.render('calendars/show', { calendar });
      } else {
        res.status(404).send('404 Not Found');
      }
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;