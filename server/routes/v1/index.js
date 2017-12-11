const express = require('express');
const gameRoutes = require('./game.route');

const router = express.Router();

// Check server status
router.get('/status', (req, res) => res.send('OK'));

// Application Specific
router.use('/game', gameRoutes);

module.exports = router;
