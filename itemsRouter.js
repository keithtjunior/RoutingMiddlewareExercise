const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');

const ITEMS = require('./fakeDb.js');
const items = [...ITEMS];

router.get('/', (req, res, next) => {
    try {
        let data = items.map(i => i);
        res.json({ data })
    } catch (err) {
        next(err);
    }
});

router.post('/', (req, res, next) => {
    try {
        data = req.body;
        if(validData(data)) {
            data.name =  data.name.replace(/\s+/g, '');
            data.price = Math.abs(Number(data.price));
            items.push(data);
            res.status(201).json({'added': data});
        }
    } catch (err) {
        next(err);
    }
});

router.get('/:name', (req, res, next) => {
    try {
        let data = items.find(item => item.name === req.params.name);
        if(!data)
            throw new ExpressError('not found: cannot find the requested resource', 404);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.patch('/:name', (req, res, next) => {
    try {
        data = req.body;
        if(validData(data)){
            let idx = items.findIndex(item => item.name === req.params.name);
            if(idx < 0)
                throw new ExpressError('not found: cannot find the requested resource', 404);
            items[idx] = data;
            res.json({updated: data});
        }
    } catch (err) {
        next(err);
    }
});

router.delete('/:name', (req, res, next) => {
    try {
        let idx = items.findIndex(item => item.name === req.params.name);
        if(idx < 0)
            throw new ExpressError('not found: cannot find the requested resource', 404);
        items.splice(idx);
        res.json({message: 'Deleted'});
    } catch (err) {
        next(err);
    }
});

const validData = () => {
    if(!data) 
        throw new ExpressError('unprocessable content: invalid data.', 422);
    if(!data.hasOwnProperty('name')) 
        throw new ExpressError('unprocessable content: missing name property.', 422);
    if(!data.hasOwnProperty('price')) 
        throw new ExpressError('unprocessable content: missing price property.', 422);
    if(typeof data.name !== 'string' || 
        data.name.replace(/\s+/g, '').length < 2)
        throw new ExpressError('unprocessable content: name must be a valid string (2 characters or more)', 422);
    if(typeof data.price !== 'number' && 
        isNaN(data.price) || Number(data.price) < 0)
        throw new ExpressError('unprocessable content: price must numeric (zero or greater)', 422);
    return true;
}

module.exports = router;