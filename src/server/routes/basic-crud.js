const express = require('express');
const router = express.Router();
const authHelpers = require('../dao/auth');
const crud = require('../dao/basic-crud');

module.exports = (table, authRequired) => {
  if (authRequired) router.all('*', authHelpers.checkAuthentication);

  router.get(`/${table}`, (req, res) => {
    crud.getAll(table)
      .then(data => {
        res.status(200).json({ data });
      })
      .catch(err => {
        res.status(500).json({
          err: err,
          message: `There was an error retrieving the ${table}`
        });
      });
  });

  router.get(`/${table}/:id`, (req, res) => {
    const id = req.params.id;
    crud.getOne(table, id)
      .then(data => {
        res.status(200).json({ data });
      })
      .catch(err => {
        res.status(500).json({
          err: err,
          message: `There was an error retrieving the ${table}`
        });
      });
  });

  router.post(`/${table}`, (req, res) => {
    const newDoc = req.body;
    crud.addOne(table, newDoc)
      .then(result => {
        res.status(200).json({
          data: result[0],
          message: `Created new row in ${table}`
        });
      })
      .catch(err => {
        res.status(500).json({
          err: err,
          message: `There was an error creating a row in ${table}`
        });
      });
  });

  router.put(`/${table}/:id`, (req, res) => {
    const id = req.params.id;
    const editedFields = req.body;
    crud.editOne(table, id, editedFields)
      .then(result => res.status(200).json({
        data: result[0],
        message: `Edited id ${id} in ${table}`
      }))
      .catch(err => {
        res.status(500).json({
          err: err,
          message: `There was an error editing the row in ${table}`
        });
      });
  });

  router.delete(`/${table}/:id`, (req, res) => {
    const id = req.params.id;
    crud.deleteOne(table, id)
      .then(() => res.status(200).json({ message: `Deleted id ${id} in ${table}` }))
      .catch(err => {
        res.status(500).json({
          err: err,
          message: `There was an error deleting the row in ${table}`
        });
      });
  });

  return router;
};
