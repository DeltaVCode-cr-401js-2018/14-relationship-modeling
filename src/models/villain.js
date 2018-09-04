'use strict';

import mongoose, { Schema } from 'mongoose';

const villainSchema = Schema({
  name: { type: String, required: true },
  power: { type: Date },
  heroes: [
    { type: Schema.Types.ObjectId, ref: 'hero' },
  ],
});

villainSchema.pre('findOne', function (next) {
  this.populate('heroes');
  next();
});

const Villain = mongoose.model('villain', villainSchema);

Villain.route = 'villains';
export default Villain;