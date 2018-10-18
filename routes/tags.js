'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

/* ==============GET ALL============== */



router.get('/', (req, res, next) => {
    // const searchTag = req.query.searchTag;
    knex.select('tags.id', 'tags.name')
    .from('tags')
    .orderBy('tags.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

//click on a tag, and have it pull up all notes with that tag
/* =============GET BY ID================================= */

router.get('/:id', (req, res, next) => {
    const tagId = req.params.id;
    knex.select('tags.id', 'tags.name', 'notes_tags.tag_id', 'notes_tags.note_id', 'notes.title') 
            //step one get the tag to show up! xxxxxxxxxxx
            //step two get tag to show up with associated notes_tagxxxxxx
            //step three get tag to show up with all of its notes associated
        .from('tags')
        .where('tags.id', tagId)
        .leftJoin('notes_tags', 'tags.id', 'notes_tags.tag_id')
        .leftJoin('notes', 'notes.id', 'notes_tags.note_id')
        .then(results => {
            res.json(results);
        })

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
    const { name } = req.body;
  
    /***** Never trust users. Validate input *****/
    if (!name) {
      const err = new Error('Missing `tag name` in request body');
      err.status = 400;
      return next(err);
    }
  
    const updateItem = {name};

    knex('tags')
    .update(updateItem)
    .where('id', req.params.id)
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



//tags - > notes_tags - > notes
//first we made a table looked like tagsnotes_tags
//then we made a table that looked like tagsnotes_tagsnotes


/* ========== POST/CREATE ITEM ========== */
router.post('/tags', (req, res, next) => {
    const { name } = req.body;
  
    /***** Never trust users. Validate input *****/
    if (!name) {
      const err = new Error('Missing `name` in request body');
      err.status = 400;
      return next(err);
    }
  
    const newItem = { name };
  
    knex.insert(newItem)
      .into('tags')
      .returning(['id', 'name'])
      .then((results) => {
        // Uses Array index solution to get first item in results array
        const result = results[0];
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      })
      .catch(err => next(err));
  });

  /* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
    knex.del()
      .where('id', req.params.id)
      .from('tags')
      .then(() => {
        res.status(204).end();
      })
      .catch(err => {
        next(err);
      });
  });

  module.exports = router;