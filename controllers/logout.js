const router = require('express').Router();

const tokenExtractor = require('../util/tokenExtractor');
const { Session } = require('../models');

router.post('/',  async (req, res) => {
    console.log(req.get('authorization').substring(7));
    const sessionEnd = await Session.destroy({
        where: {
            token: req.get('authorization').substring(7)
        }
    });

    res.status(200).json(sessionEnd);
});

module.exports = router;