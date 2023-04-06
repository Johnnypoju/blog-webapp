const { Blog } = require('../models');
const { sequelize } = require('../util/db');

const router = require('express').Router();

router.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.findAll({
            attributes: ['author', [sequelize.fn('COUNT', sequelize.col('author')), 'articles'], 
                        [sequelize.fn('SUM', sequelize.col('likes')), 'total_likes']],
            group: ['author'],
            order: sequelize.literal('total_likes DESC')
        });
        console.log(blogs);
        return res.json(blogs);
    } catch (error) {
        next(error)
    }
})

module.exports = router;