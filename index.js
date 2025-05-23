require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

// Create a custom token
morgan.token('body', function (req, res) { 
    return JSON.stringify(req.body) 
});

// Add custom token to logs that are using our tiny configuration
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response, next) => {
    Person.find()
        .then((personEntry) => {
            response.send(`Phonebook has info for ${personEntry.length} people<br>${Date()}`);
        })
        .catch((error) => next(error));
});


app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
});

app.put('/api/persons/:id', (request, response, next) => {
    const { id } = request.params;
    const { number } = request.body;

    Person.findByIdAndUpdate(id, {number}, {new:true})
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))    
});

// Create a new person object  
app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
});

// Handler of requests that result to certain errors
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted Id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message});
    }
    console.log('typeof response:', typeof response.status); // Should be function


    next(error);
};

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})