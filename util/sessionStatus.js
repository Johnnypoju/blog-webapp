const { Session } = require('../models');

const sessionStatus = async (req, res, next) => {
    const authorization = req.get('authorization').substring(7);
    const activeSession = await Session.findOne({
        where: {
            token: authorization
        }
    })
    if (!activeSession) {
        return res.status(401).json({ error: 'token no longer active'})
    }
    next()
};

module.exports = sessionStatus;