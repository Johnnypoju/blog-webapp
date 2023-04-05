const router = require('express').Router();

const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id);
    next();
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll();
    console.log()
    res.json(JSON.stringify(blogs));
});

router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        await Blog.destroy({ 
            where: { 
                id: req.params.id 
            } 
        });
        console.log(req.blog.toJSON());
        res.json(req.blog);
    } else {
        res.status(404).end();
    }
});

router.post('/', async (req, res, next) => {
    try {
        console.log(req);
        const blog = await Blog.create(req.body);
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