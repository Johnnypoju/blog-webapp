const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User } = require('../models');

//user finder
const userFinder = async (req, res, next) => {
    req.user = await User.findOne({
        where: {
            username: req.params.username
        }
    });
    next();
}

router.get('/', async (req, res) => {
    const users = await User.findAll({
        attributes: ['id', 'name', 'username']
    });
    res.json(users);
});

//User creation
router.post('/', async (req, res, next) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
    try {
        const newUser = {
            ...req.body,
            password: passwordHash
        }
        const user = await User.create(newUser);
        res.json(user);
    } catch(error) {
        next(error);
    };
});

//username change
router.put('/:username', userFinder, async (req, res, next) => {
    try {
        console.log(req.user);
        req.user.username = req.body.username
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        next(error);
    }
});

module.exports = router;