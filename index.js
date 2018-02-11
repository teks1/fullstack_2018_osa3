const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3001
const morgan = require('morgan')
const cors = require('cors')

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id' ,(req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    let maara = persons.length
    res.send(`luettelossa ${maara} henkilön tiedot <br>`  + new Date())
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({error: 'name and/or number missing'})
    } else if (persons.findIndex(p => p.name === body.name) > -1) {
        return res.status(418).json({error: 'name taken'})
    }
    const person = {
        id: Math.floor(Math.random() * Math.floor(1337)),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
