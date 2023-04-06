const express = require("express");

const errorHandler = (error, req, res, next) => {
    console.error(error.errors[0].message);

    
    return res.status(400).send({ error: error.errors[0].message })


    next(error)
}

module.exports = errorHandler;