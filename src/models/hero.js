'use strict';

import mongoose, { Schema } from 'mongoose';
import Villain from './villain';

const heroSchema = Schema({
  name: { type: String, required: true },
  universe: { type: String },
  power: { type: String },
  villain: { type: Schema.Types.ObjectId, ref: 'villain' },
});

heroSchema.pre('findOne', function(next) {
  this.populate('villain');
  next();
});

heroSchema.pre('save', function(next) {
  let heroId = this._id;
  let villainId = this.villain;

  if (!villainId) {
    return next();
  }

  Villain.findById(villainId)
    .then(villain => {
      if (!villain) {
        return Promise.reject('Invalid Villain Id');
      }

      return Villain.findByIdAndUpdate(
        villainId,
        { $addToSet: { heroes: heroId } }
      );
    })
    .then(() => next())
    .catch(err => next(err));
});

const Hero = mongoose.models.hero || mongoose.model('hero', heroSchema, 'hero');

Hero.route = 'heroes';
export default Hero;