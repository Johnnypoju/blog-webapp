const router = require('express').Router();
const tokenExtractor = require('../util/tokenExtractor');

const { Reading_list } = require('../models');

router.post('/', async (req, res, next) => {
    const readList = await Reading_list.create(req.body);
    res.json(readList);
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
    try {
        const reading_list_entry = await Reading_list.findByPk(req.params.id);
        if (reading_list_entry.userId === req.decodedToken.id) {
            reading_list_entry.read = req.body.read;
            await reading_list_entry.save();
            res.json(reading_list_entry);
        }
        else {
            throw ('Authentication failure');
        }
    } catch (error) {
        next(error);
    }
    
})

module.exports = router;