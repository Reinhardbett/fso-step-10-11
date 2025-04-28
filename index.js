const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create a custom token
morgan.token('body', function (req, res) { 
    return JSON.stringify(req.body) 
});

// Add custom token to logs that are using our tiny configuration
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.use(function(req, res, next) { 
    req.startTime = new Date(); 
    next(); 
});

app.get('/info', (request, response) => {
    response.send(
        `Phonebook has info for ${persons.length} people<br>${request.startTime}`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    console.log(person)
    
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.filter(person => person.id !== id)
    response.status(204).end();
});

const generateId = () => {
    return Math.floor(Math.random() * 10000).toString();
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body;
  
    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'name or number missing' });
    }

    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ error: 'name must be unique'})
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };
  
    persons = persons.concat(person);
  
    response.json(person);
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})