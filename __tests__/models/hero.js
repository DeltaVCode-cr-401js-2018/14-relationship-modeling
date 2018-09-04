'use strict';
import Hero from '../../src/models/hero';
import Villain from '../../src/models/villain';
const mongoConnect = require('../../src/util/mongo-connect');
const MONGODB_URI = process.env.MONGODB_URI ||'mongodb://localhost/401-2018-heroes';

console.log(Villain);
describe('hero model', () => {
  beforeAll(() => {
    return mongoConnect(MONGODB_URI);
  });

  it('can save a hero', () => {
    let hero = new Hero({
      name: 'Blue Beetle',
      universe: 'DC',
      power: 'scarab',
    });

    return hero.save()
      .then(saved => {
        expect(saved.name).toBe('Blue Beetle');
        expect(saved.universe).toBe('DC');
        expect(saved.power).toBe('scarab');
      });
  });

  it('fails if no name is provided', () => {
    let hero = new Hero({
    });

    return expect(hero.save())
      .rejects.toBeDefined();
  });

  describe('findById', ()=> {
    let fakeHero;
    beforeEach(()=> {
      fakeHero = new Hero({ name: 'Bobo' });
      return fakeHero.save();
    });

    it('can find by an id that exists', () => {
      return Hero.findById(fakeHero._id)
        .then(foundHero => {
          expect(foundHero).toBeDefined();
          expect(foundHero._id).toEqual(fakeHero._id);
          expect(foundHero.title).toEqual(fakeHero.title);
        });
    });

    it('rejects given an id that is invalid', () => {
      return expect(Hero.findById('oops'))
        .rejects.toThrowError('Cast to ObjectId failed');
    });

    it('resolves with null given id that is valid but missing', () => {
      return expect(Hero.findById('deadbeefdeadbeefdeadbeef'))
        .resolves.toBe(null);
    });
  });
});