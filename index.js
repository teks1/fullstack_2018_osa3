const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3001
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('type', (req, res) => { return JSON.stringify(req.body) })

app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

/**
const ll = (req, res, next) => {
    console.log('Time:', Date.now())
    next()
}
app.use(ll)
**/

app.use(bodyParser.json())

let persons = [
	{
		id: 1,
		name: 'Arto',
		number: '666',
	},
	{
		id: 2,
		name: 'Arto 2',
		number: '999',
	},
	{
		id: 3,
		name: 'Martti',
		number: '123',
	},
]

const formatPerson = (person) => {
	return {
		id: person._id,
		name: person.name,
		number: person.number
	}
}

app.get('/api/persons', (req, res) => {
	Person
		.find({})
		.then(persons => {
			res.json(persons.map(formatPerson))
		})
})

app.get('/api/persons/:id' ,(req, res) => {
	Person
		.findById(req.params.id)
		.then(person => {
			if (person) {res.json(formatPerson(person))
			} else {
				res.status(404).end()
			}
		})
		.catch(error => {
			console.log(error)
			res.status(400).send({ error: 'malformatted id' })
		})
})

app.get('/info', (req, res) => {
	let maara = persons.length
	res.send(`luettelossa ${maara} henkilön tiedot <br>`  + new Date())
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	if (body.name === undefined || body.number === undefined) {
		return res.status(400).json({ error: 'name and/or number missing' })
	}
	/**else if (persons.findIndex(p => p.name === body.name) > -1) {
        return res.status(418).json({error: 'name taken'})
    }**/
	let p = 0
	Person.find({}).then(persons => {p = persons.length})
	console.log(p)
	const person = new Person({
		name: body.name,
		number: body.number
	})
	person.save().then(res => {
		console.log(`lisätään henkilö ${body.name} numero ${body.number} luetteloon`)
	})
})

app.delete('/api/persons/:id', (req, res) => {
	Person
		.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => {
			res.status(400).send({ error: 'bad id' })
		})
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
