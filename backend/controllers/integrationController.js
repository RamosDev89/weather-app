const axios = require("axios")

const getYoutubeVideos = async (req, res) => {
  const { location } = req.params

  if (!location) {
    return res.status(400).json({ message: "informa a localização" })
  }

  try {
    const chave = process.env.GOOGLE_API_KEY
    const resp = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: location + " weather clima",
        type: "video",
        maxResults: 5,
        key: chave
      }
    })

    const videos = resp.data.items.map(item => ({
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      videoId: item.id.videoId,
      url: "https://www.youtube.com/watch?v=" + item.id.videoId
    }))

    res.json({ location, videos })
  } catch (err) {
    res.status(500).json({ message: "erro ao buscar videos", error: err.message })
  }
}

const getGoogleMap = async (req, res) => {
  const { location } = req.params

  if (!location) {
    return res.status(400).json({ message: "informa a localização" })
  }

  try {
    const chave = process.env.GOOGLE_API_KEY
    const mapUrl = "https://www.google.com/maps/embed/v1/place?key=" + chave + "&q=" + encodeURIComponent(location)

    res.json({
      location,
      mapUrl,
      embedHtml: '<iframe width="600" height="450" style="border:0" loading="lazy" src="' + mapUrl + '"></iframe>'
    })
  } catch (err) {
    res.status(500).json({ message: "erro ao buscar mapa", error: err.message })
  }
}

module.exports = { getYoutubeVideos, getGoogleMap }