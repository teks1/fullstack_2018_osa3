const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv.length < 3) {
    console.log('puhelinluettelo:')
    Person
    .find({})
    .then(result => {
        result.forEach(p => {
            console.log(p.name, p.number)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 4) {
    const nm = process.argv[2]
    const nmbr = process.argv[3]
    const person = new Person({
        name: nm,
        number: nmbr
    })
    person.save().then(response => {
        console.log(`lisätään henkilö ${nm} numero ${nmbr} luetteloon`)
        mongoose.connection.close()
    })
}

