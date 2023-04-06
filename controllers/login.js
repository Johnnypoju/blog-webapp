const jwt = require('jsonwebtoken');
const router = require('express').Router();
const bcrypt = require('bcrypt');

const { SECRET } = require('../util/config');
const { User, Session } = require('../models');

router.post('/', async (req, res) => {
    const body = req.body;
    console.log(body);
    const user = await User.findOne({
        where: {
            username: body.username
        }
    });

    const passwordCorrect = user === null 
        ? false
        : await bcrypt.compare(body.password, user.password);

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        });
    };

    if (user.disabled) {
        return res.status(401).json({
            error: 'account is disabled, please contact your admin'
        })
    }
    const userForToken = {
        username: user.username,
        id: user.id,
    };

    const token = jwt.sign(userForToken, SECRET);
    Session.create({token: token})
    res
        .status(200)
        .send({ token, username: user.username, name: user.name});
});

module.exports = router;