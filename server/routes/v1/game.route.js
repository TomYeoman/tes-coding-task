const express = require('express');
// const validate = require('express-validation');
const controller = require('../../controllers/game.controller');
// const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
// const {
//   listUsers,
//   createUser,
//   replaceUser,
//   updateUser,
// } = require('../../validations/user.validation');

const router = express.Router();

router
  .route('/')
  .get(() => { console.log('hello'); });


// Initialise routes, all the endpoints POST data
// is lightweight so we'll keep it as part of the params
router
  .route('/attempt_swing/:arenaID/:courtID/:playerID')
  .post(controller.attemptSwing);

router
  .route('/scores/:arenaID/:courtID?')
  .get(controller.getScores);

router
  .route('/reset/:arenaID/:courtID')
  .post(controller.resetCourt);

router
  .route('/create/:courtAmount')
  .post(controller.createGame);

module.exports = router;
