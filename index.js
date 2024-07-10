const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const app = express();

const PORT = process.env.PORT || 3001;

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// MIDDLEWARE
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :req-body")
);
app.use(cors())
// defining custom token for POST
morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// GET ALL PERSONS
app.get("/api/persons/", (req, res) => {
  res.json(persons);
});

// GET PERSON:ID
app.get("/api/persons/:id", (req, res) => {
  let id = Number(req.params.id);
  let person = persons.filter((person) => person.id == id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// DELETE PERSON:ID
app.delete("/api/persons/:id", (req, res) => {
  let id = Number(req.param.id);
  person = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

// POST NEW PERSON
app.post("/api/persons/", (req, res) => {
  const body = req.body;

  // check if an entry is missing
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "something missing",
    });
  }
  // Check if name is in phonebook
  const nameExists = persons.find((person) => person.name === body.name);
  if (nameExists) {
    res.status(400).json({ error: "name must be unique" });
  }
  // Check if number is in phonebook
  const numberExists = persons.find((person) => person.number === body.number);
  if (numberExists) {
    res.status(400).json({ error: "this number exists" });
  }
  // create person object to concat to persons list
  if (!numberExists && !nameExists) {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    };
    persons = persons.concat(person);
    res.json(person);
  }



  //   body.id = generateId();
  //   persons = persons.concat(body);
  //   res.status(201).send(persons);
});

app.get("/info/", (req, res) => {
  res.send(
    `Phonebook has info for ${persons.length} people. <br><br> ${Date()}`
  );
});

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});