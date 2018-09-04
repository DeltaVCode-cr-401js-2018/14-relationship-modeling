'use strict';

import express from 'express';
const router = express.Router();

export default router;

import modelFinder from '../middleware/models';

router.param('model', modelFinder);

router.get('/api/:model', (req, res, next)=> {
  req.Model.find({})
    .then(models => {
      res.json(models);
    });
});

router.post('/api/:model', (req, res, next)=> {
  if (!req.body) {
    res.send(400);
    res.end();
    return;
  }

  var newModel = new req.Model(req.body);
  newModel.save()
    .then(saved => {
      return req.Model.findById(saved._id);
    })
    .then(found => {
      res.json(found);
    })
    .catch(next);
});

router.get('/api/:model/:id', (req, res, next) => {
  return req.Model.findById(req.params.id)
    .then(model => {
      if (model === null) {
        res.sendStatus(404);
        res.end();
        return;
      }
      res.json(model);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next();
      } 
      else {
        next(err);
      }
    });
});
