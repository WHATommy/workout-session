const express = require('express');
const router = express.Router;
const morgan = require('morgan');
const app = express;

app.use(morgan('common'));

ShoppingList.create('bean', 2);

app.get('/', (req, res) => {
    res.json(ShoppingList.get());
});

app.post('/shoppinglist', (req, res) => {
    requiredFields = ['name', 'budget'];
    for (i = 0; i < requiredFields.lenght; i++) {
        let field = requiredFields[i];
        if (!field in req.body) {
            const message = 'missing field'
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const item = ShoppingList.create(req.body.name, req.body.budget);
    res.status(201).json(item);
})

