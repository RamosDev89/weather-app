const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const pool = require('./db/connection')
const weatherRoutes = require('./routes/weatherRoutes')
const exportRoutes = require('./routes/exportRoutes')
const integrationRoutes = require('./routes/integrationRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/weather', weatherRoutes)
app.use('/api/export', exportRoutes)
app.use('/api/integration', integrationRoutes)

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Weather App API funcionando!' })
})

// Rota de teste do banco
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result')
    res.json({ message: 'Banco conectado!', result: rows[0].result })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao conectar ao banco', error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})