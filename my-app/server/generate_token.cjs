require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 'dummy_admin_id' }, process.env.JWT_SECRET, { expiresIn: '1d' });
console.log(token);
