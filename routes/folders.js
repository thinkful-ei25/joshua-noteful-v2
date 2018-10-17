'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

/* ========== GET ALL FOLDERS ========== */
router.get('/folders', (req, res, next) => {  
    knex.select('id', 'name')
      .from('folders')
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        next(err);
      });
  });


  /* ========== GET SINGLE FOLDER ========== */
router.get('/:id', (req, res, next) => {
    const folderId = req.params.id;
  
    knex.first('id', 'name')
      .from('folder')
      .where('id', folderId)
      .then(result => {
        if (result) {
          res.json(result);
        } else {
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  });

  /* ========== UPDATE A FOLDER ========== */
router.put('/:id', (req, res, next) => {
    const folderId = req.params.id;
    const { name } = req.body;
  
    /***** Never trust users. Validate input *****/
    if (!name) {
      const err = new Error('Missing `name` in request body');
      err.status = 400;
      return next(err);
    }
  
    const updateName = {
      name: name,
    };
  
    knex('folders')
      .update(updateName)
      .where('id', folderId)
      .returning(['id', 'name'])
      .then(([result]) => {
        if (result) {
          res.json(result);
        } else {
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  });
  
  /* ========== CREATE FOLDER ========== */
router.post('/', (req, res, next) => {
    const { name } = req.body;
  
    /***** Never trust users. Validate input *****/
    if (!name) {
      const err = new Error('Missing `name` in request body');
      err.status = 400;
      return next(err);
    }
  
    const newFolder = {
      title: title,
      content: content
    };
  
    knex.insert(newFolder)
      .into('folder')
      .returning(['id', 'name'])
      .then((results) => {
        const result = results[0];
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      })
      .catch(err => {
        next(err);
      });
  });

  /* ========== DELETE FOLDER ========== */
router.delete('/:id', (req, res, next) => {
    knex.del()
      .where('id', req.params.id)
      .from('folder')
      .then(() => {
        res.status(204).end();
      })
      .catch(err => {
        next(err);
      });
  });
  
  module.exports = router;