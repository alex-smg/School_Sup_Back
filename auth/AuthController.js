const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');


router.post('/register', (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(req.body.password, salt);

  User.create({
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    email : req.body.email,
    password : hashedPassword
  },

   (err, user) => {
    if (err) return res.status(500).send("There was a problem registering the user.")
    // create a token
    var token = jwt.sign({ id: user._id }, process.env.API_SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  }); 
});

router.get('/me', (req, res) => {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.API_SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    console.log(decoded)
    res.status(200).send(decoded);
  });
});

router.post('/login', async (req, res) => {
  console.log(req.body.email);
  await User.findOne({ email: req.body.email }).exec((err, user) => {
    console.log(bcrypt.compareSync(req.body.password, user.password));
    if (err) return res.status(401).send({auth: false, message: 'This account doesn\'t exist'});
    if(!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).send({auth: false, message: 'incorrect password'});
    } else {
      res.status(200).send({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      })
    }
  })
})

module.exports = router;

  
  