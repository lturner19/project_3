let axios = require('axios');
var convert = require('xml-js');

const fetchXML = async (root, game) => {
    try {
      const response = await axios.get(`${root}${game}`);
      return convert.xml2json(response.data);
    } catch (err) {
      return {
        error: err.message
      }
    }
  }

// Defining methods for the booksController
module.exports = {
    gameController: async (req, res) => {
        const { game } = req.params;
        const root = 'https://www.boardgamegeek.com/xmlapi/search?search=';
        const output = await fetchXML(root, game);
        const json = JSON.parse(output);
        // console.log("json: ",json);
        // console.log("output: ", output);
        if (json.errors) {
            res.status(500);
            res.json({
            content: 'Unable to get the data from boardgamegeek.com',
            ... json
            })
        } else {
            res.json(json);
        }
    },
    findById:  async (req, res) => {
        const { id } = req.params;
        const root = 'https://www.boardgamegeek.com/xmlapi2/thing?id=';
        const output = await fetchXML(root, id);
        const json = JSON.parse(output);
        // console.log("json: ",json);
        // console.log("output: ", output);
        if (json.errors) {
            res.status(500);
            res.json({
            content: 'Unable to get the data from boardgamegeek.com',
            ... json
            })
        } else {
            res.json(json);
        }
    },
    hotItems: async (res) => {
      const root = 'https://api.geekdo.com/xmlapi2/hot?boardgame';
      const output = await fetchXML(root);
      const json = JSON.parse(output);
      console.log("json: ",json);
      console.log("output: ", output);
      if (json.errors) {
        res.status(500);
        res.json({
        content: 'Unable to get the data from boardgamegeek.com',
        ... json
        })
    } else {
        res.json(json);
    }
    }
};

