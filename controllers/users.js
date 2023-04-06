const router = require('express').Router();
const bcrypt = require('bcrypt');

const activeSession = require('../util/sessionStatus');
const { User, Blog, } = require('../models');
const tokenExtractor = require('../util/tokenExtractor');

const isAdmin = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            username: req.decodedToken.username
        }
    });
    if (!user.admin) {
        return res.status(401).json({ error: 'operation not allowed' });
    }
    next();
}
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
        attributes: ['id', 'name', 'username'],
        include: {
            model: Blog,
            attributes: { exclude: ['userId']}
        },

    });
    res.json(users);
});

//provide userdata by id (added blogs, marked blogs and reading list status)
router.get('/:id', async (req, res) => {
    let where = {};
    if (req.query.read) {
        where.read = req.query.read;
    };
    console.log(where)
     const user = await User.findByPk(req.params.id, {
        attributes: ['name', 'username'],
        include: [ {
            model: Blog,
            attributes: { exclude: ['userId'] }
        },
            {
            model: Blog,
            as: 'readings',
            attributes: { exclude: ['userId'] },
            through: {
                attributes: ['read', 'id'],
                where
            }
        }, 
    
    ]
     });
     res.json(user);
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

//user status change
router.put('/user/:username', tokenExtractor, isAdmin, userFinder, async (req, res, next) => {
    console.log(req.body)
    if (req.user) {
        req.user.disabled = req.body.disabled;
        await req.user.save();
        res.json(req.user);
    }
    else {
        res.status(404).end();
    }
});

module.exports = router;