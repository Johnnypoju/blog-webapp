const router = require('express').Router();
const { Op } = require('sequelize');

const { Blog, User } = require('../models');

const sequelize = require('../util/db');

const tokenExtractor = require('../util/tokenExtractor');

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id);
    next();
}

router.get('/', async (req, res) => {
    let where = {};

    if (req.query.search) {
        where = {
            [Op.or]: [
                {
                    title: {
                        [Op.iLike]: `%${req.query.search}%`
                    }
                },
                {
                    author: {
                        [Op.iLike]: `%${req.query.search}%`
                    }
                }
            ]
        };
    };
    console.log(where);
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId']},
        order: [[ 'likes', 'DESC' ]],
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        
    });
    console.log()
    res.json(JSON.stringify(blogs));
});

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
    try {
        if (req.blog && req.blog.userId === req.decodedToken.id) {
            await Blog.destroy({ 
                where: { 
                    id: req.params.id 
                } 
            });
            console.log(req.blog.toJSON());
            res.json(req.blog);
        } else {
            throw "Not the correct user or token";
        }
     } catch (error) {
            next(error)
        }
});

//add new blog entry
router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        console.log(req);
        const user = await User.findOne({
            where: {
                username: req.decodedToken.username
            }
        });
        if (isNaN(req.body.year)) {
            return res.status(401).json({ error: "Year given is not a integer"})
        }
        const blog = await Blog.create({...req.body, userId: user.id });
        res.json(blog);
    } catch(error) {
        next(error);
    };
});

router.put('/:id', blogFinder, async (req, res, next) => {
    try {
        console.log(req.blog);
        req.blog.likes = req.body.likes;
        await req.blog.save();
        res.json(req.blog);
    } catch (error) {
        next(error);
    }
});

module.exports = router;