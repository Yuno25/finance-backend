const { body } = require('express-validator');

const updateRoleValidator = [
  body('role')
    .isIn(['viewer', 'analyst', 'admin'])
    .withMessage('Role must be viewer, analyst, or admin')
];

module.exports = { updateRoleValidator };