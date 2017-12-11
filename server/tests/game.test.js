const app = require('./../server.js');
const request = require('supertest');
const { expect } = require('chai');

// Helper function to generate new games before testing where needed
const generateGame = async () => request(app)
  .post('/v1/game/create/2')
  .then(res => request(app).get(`/v1/game/scores/${res.body.arenaID}`))
  .then(res => res.body);

describe('Game API', () => {
  describe('POST /v1/game/create', () => {
    it('should create a new game and return arena ID', () => request(app)
      .post('/v1/game/create/2')
      .expect(201)
      .then((res) => {
        expect(res.body).to.include.keys('arenaID');
      }));
  });

  describe('POST v1/game/attempt_swing/', () => {
    let arenaID;
    let courtID;
    let playerID;
    // Create game to attempt swing on a court
    beforeEach(async () => {
      const newGame = await generateGame();
      arenaID = newGame.arena.id;
      courtID = Object.keys(newGame.arena.courts)[0];
      playerID = Object.keys(newGame.arena.courts[courtID].players)[0];
    });

    it('should return whether a player has hit / missed a swing', async () => {
      request(app)
        .post(`/v1/game/attempt_swing/${arenaID}/${courtID}/${playerID}`)
        .then((res) => {
          expect(res.body).to.include.keys('hasLandedHit');
        });
    });

    it('should error if we cant find the player', async () => {
      request(app)
        .post(`/v1/game/attempt_swing/${arenaID}/${courtID}/123`)
        .then((res) => {
          const { error } = res.body;
          expect(error).to.include('No player found matching the provided details');
        });
    });
  });

  describe('GET /v1/game/scores/', () => {
    let arenaID;
    // Create game fetch scores for
    beforeEach(async () => {
      const newGame = await generateGame();
      arenaID = newGame.arena.id;
    });

    it('Should return the scores for an arena', () => {
      request(app)
        .get(`/v1/game/scores/${arenaID}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.include.keys('arena');
        })
        .catch((e) => { console.log(e); });
    });

    it('Should error if we cant find the arena', () => {
      request(app)
        .get('/v1/game/scores/123')
        .expect(200)
        .then((res) => {
          const { error } = res.body;
          expect(error).to.include('No arena found matching the ID provided');
        });
    });
  });

  describe('GET /v1/game/reset', () => {
    let arenaID;
    let courtID;
    // Create game to reset
    beforeEach(async () => {
      const newGame = await generateGame();
      arenaID = newGame.arena.id;
      courtID = Object.keys(newGame.arena.courts)[0];
    });

    it('Should reset the scores for a court', async () => {
      request(app)
        .post(`/v1/game/reset/${arenaID}/${courtID}`)
        .expect(200)
        .then((res) => {
          const { success } = res.body;
          expect(success).to.include(`court ${courtID}: was reset sucessfully`);
        })
        .catch((e) => { console.log(e); });
    });

    it('Should error if we cant find court', async () => {
      request(app)
        .post(`/v1/game/reset/${arenaID}/123`)
        .expect(200)
        .then((res) => {
          const { error } = res.body;
          expect(error).to.include('unable to find court 123');
        })
        .catch((e) => { console.log(e); });
    });
  });
});
