const express = require('express');
const router = express.Router();
const authHelpers = require('../controllers/auth');
const crud = require('../controllers/basic-crud');

module.exports = (table, authRequired) => {
  if (authRequired) router.all('*', authHelpers.checkAuthentication);

  router.get(`/${table}`, (req, res, next) => {
    crud.getAll(table)
      .then(data => {
        res.status(200).json({ data });
      })
      .catch(err => {
        next(err);
      });
  });

  router.get(`/${table}/:id`, (req, res, next) => {
    const id = req.params.id;
    crud.getOne(table, id)
      .then(data => {
        res.status(200).json({ data });
      })
      .catch(err => {
        next(err);
      });
  });

  router.post(`/${table}`, (req, res, next) => {
    const newDoc = req.body;
    crud.addOne(table, newDoc)
      .then(result => {
        res.status(200).json({
          data: result[0],
          message: `Created new row in ${table}`
        });
      })
      .catch(err => {
        next(err);
      });
  });

  router.put(`/${table}/:id`, (req, res, next) => {
    const id = req.params.id;
    const editedFields = req.body;
    crud.editOne(table, id, editedFields)
      .then(result => res.status(200).json({
        data: result[0],
        message: `Edited id ${id} in ${table}`
      }))
      .catch(err => {
        next(err);
      });
  });

  router.delete(`/${table}/:id`, (req, res, next) => {
    const id = req.params.id;
    crud.deleteOne(table, id)
      .then(() => res.status(200).json({ message: `Deleted id ${id} in ${table}` }))
      .catch(err => {
        next(err);
      });
  });

  return router;
};
