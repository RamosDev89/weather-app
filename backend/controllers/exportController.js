const pool = require("../db/connection")
const { Parser } = require("json2csv")
const PDFDocument = require("pdfkit")

const exportJSON = async (req, res) => {
  try {
    const [linhas] = await pool.query("SELECT id, location, date_start, date_end, created_at FROM weather_searches")
    res.setHeader("Content-Disposition", "attachment; filename=historico.json")
    res.json(linhas)
  } catch (err) {
    res.status(500).json({ message: "erro ao exportar", error: err.message })
  }
}

const exportCSV = async (req, res) => {
  try {
    const [linhas] = await pool.query("SELECT id, location, date_start, date_end, created_at FROM weather_searches")
    const campos = ["id", "location", "date_start", "date_end", "created_at"]
    const parser = new Parser({ fields: campos })
    const csv = parser.parse(linhas)
    res.setHeader("Content-Disposition", "attachment; filename=historico.csv")
    res.setHeader("Content-Type", "text/csv")
    res.send(csv)
  } catch (err) {
    res.status(500).json({ message: "erro ao exportar csv", error: err.message })
  }
}

const exportPDF = async (req, res) => {
  try {
    const [linhas] = await pool.query("SELECT id, location, date_start, date_end, created_at FROM weather_searches")
    const doc = new PDFDocument()
    res.setHeader("Content-Disposition", "attachment; filename=historico.pdf")
    res.setHeader("Content-Type", "application/pdf")
    doc.pipe(res)
    doc.fontSize(18).text("Weather App - Historico de Pesquisas", { align: "center" })
    doc.moveDown()
    linhas.forEach((linha, i) => {
      doc.fontSize(12).text((i + 1) + ". " + linha.location)
      doc.fontSize(10).text("   De: " + linha.date_start + " ate: " + linha.date_end)
      doc.fontSize(10).text("   Criado em: " + linha.created_at)
      doc.moveDown(0.5)
    })
    doc.end()
  } catch (err) {
    res.status(500).json({ message: "erro ao exportar pdf", error: err.message })
  }
}

module.exports = { exportJSON, exportCSV, exportPDF }