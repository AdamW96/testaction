require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { init } = require('./db')

const app = express()
app.use(cors( { origin: 'http://localhost:3030' } ))
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/stats', require('./routes/stats'))
app.use('/api/alerts', require('./routes/alerts'))
app.get('/health', (req, res) => res.json({ status:'ok' }))
app.use((req, res) => res.status(404).json( {error: 'Not found'} ))

init()

app.listen(process.env.PORT, () => console.log(`API is running on http://localhost:${process.env.PORT}`))

module.export = app