const pool = require("../db/connection")
const axios = require("axios")

const createSearch = async (req, res) => {
  const { location, date_start, date_end, search_type, country } = req.body

  if (!location || !date_start || !date_end) {
    return res.status(400).json({ message: "please fill in all fields" })
  }

  if (new Date(date_start) > new Date(date_end)) {
    return res.status(400).json({ message: "start date cannot be after end date" })
  }

  try {
    const chave = process.env.OPENWEATHER_API_KEY
    const isCoords = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location.trim())
    const isPostal = search_type === 'postal'
    const selectedCountry = country || 'BR'

    let query

    if (isCoords) {
      query = `lat=${location.split(',')[0]}&lon=${location.split(',')[1]}`
    } else if (isPostal && selectedCountry === 'BR') {
      // Para CEP brasileiro usa o OpenCEP para converter em cidade
      const cleanCEP = location.replace(/\D/g, '')
      try {
        const cepResponse = await axios.get(`https://opencep.com/v1/${cleanCEP}`)
        const cepData = cepResponse.data
        if (!cepData || cepData.erro) {
          return res.status(404).json({ message: "CEP not found, please check and try again" })
        }
        const cidade = cepData.localidade
        const estado = cepData.uf
        query = `q=${cidade},${estado},BR`
      } catch {
        return res.status(404).json({ message: "CEP not found, please check and try again" })
      }
    } else if (isPostal) {
      // Para outros países usa o zip code diretamente
      query = `zip=${location.trim()},${selectedCountry}`
    } else {
      query = `q=${location}`
    }

    const resultado = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${chave}&units=metric&lang=en`
    )

    const dadosClima = resultado.data

    const [insert] = await pool.query(
      "INSERT INTO weather_searches (location, date_start, date_end, weather_data) VALUES (?, ?, ?, ?)",
      [location, date_start, date_end, JSON.stringify(dadosClima)]
    )

    res.status(201).json({
      message: "saved successfully",
      id: insert.insertId,
      location,
      date_start,
      date_end,
      weather: dadosClima
    })
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ message: "location not found, please try another" })
    }
    res.status(500).json({ message: "error fetching weather", error: err.message })
  }
}

const getSearches = async (req, res) => {
  try {
    const [linhas] = await pool.query(
      "SELECT id, location, date_start, date_end, created_at FROM weather_searches ORDER BY created_at DESC"
    )
    res.json(linhas)
  } catch (err) {
    res.status(500).json({ message: "error listing searches", error: err.message })
  }
}

const getSearchById = async (req, res) => {
  const { id } = req.params
  try {
    const [linhas] = await pool.query(
      "SELECT * FROM weather_searches WHERE id = ?", [id]
    )
    if (linhas.length === 0) return res.status(404).json({ message: "not found" })
    res.json(linhas[0])
  } catch (err) {
    res.status(500).json({ message: "error fetching search", error: err.message })
  }
}

const updateSearch = async (req, res) => {
  const { id } = req.params
  const { location, date_start, date_end } = req.body
  if (!location || !date_start || !date_end) {
    return res.status(400).json({ message: "please fill in all fields" })
  }
  if (new Date(date_start) > new Date(date_end)) {
    return res.status(400).json({ message: "start date cannot be after end date" })
  }
  try {
    const [upd] = await pool.query(
      "UPDATE weather_searches SET location = ?, date_start = ?, date_end = ? WHERE id = ?",
      [location, date_start, date_end, id]
    )
    if (upd.affectedRows === 0) return res.status(404).json({ message: "record not found" })
    res.json({ message: "updated successfully!" })
  } catch (err) {
    res.status(500).json({ message: "error updating record", error: err.message })
  }
}

const deleteSearch = async (req, res) => {
  const { id } = req.params
  try {
    const [del] = await pool.query(
      "DELETE FROM weather_searches WHERE id = ?", [id]
    )
    if (del.affectedRows === 0) return res.status(404).json({ message: "record not found" })
    res.json({ message: "deleted successfully!" })
  } catch (err) {
    res.status(500).json({ message: "error deleting record", error: err.message })
  }
}

module.exports = { createSearch, getSearches, getSearchById, updateSearch, deleteSearch }