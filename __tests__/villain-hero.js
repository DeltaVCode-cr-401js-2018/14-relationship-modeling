'use strict';

const request = require('supertest');

import app from '../src/app';
import Hero from '../src/models/hero';
import Villain from '../src/models/villain';

const mongoConnect = require('../src/util/mongo-connect');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/401-2018-heroes';

describe('villain/hero interaction', ()=> {
  beforeAll(()=> {
    return mongoConnect(MONGODB_URI);
  });

  describe('with villain', () => {
    let testVillain;
    beforeEach(() => {
      testVillain = new Villain({ name: 'Add heroes to me' });
      return testVillain.save();
    });

    it('can create hero on villain', () => {
      let heroBody = {
        name: 'I am a fake hero',
        villain: testVillain._id,
      };
      return request(app)
        .post('/api/heroes')
        .send(heroBody)
        .expect(200)
        .expect(response => {
          let hero = response.body;
          expect(hero.villain).toBeDefined();
          expect(hero.villain._id).toEqual(testVillain._id.toString());
          expect(hero.villain.name).toEqual(testVillain.name);

          return request(app)
            .get(`/api/villains/${testVillain._id}`)
            .expect(200)
            .expect(response => {
              let Villain = response.body;
              expect(Villain).toBeDefined();
              expect(Villain.heroes).toBeDefined();
              expect(Villain.heroes.length).toBe(1);
              expect(Villain.heroes[0]._id).toEqual(hero._id.toString());
            });
        });
    });
  });
});