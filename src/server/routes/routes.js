module.exports = {
  auth: require('./auth'),
  notes: require('./basic-crud')('Notes', false),
  ping: require('./ping')
};
