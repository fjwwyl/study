const axios = require("axios")


async function getReopList() {
  return axios.get("https://api.github.com/orgs/FEcourceZone/repos")
}

async function getTagList(repo) {
  return axios.get(`https://api.github.com/orgs/FEcourceZone/${repos}/tags`)
}

axios.interceptors.request.use(res => {
  return res.data;
})


module.exports = {getReopList, getTagList}