import axios from 'axios'
const baseUrl = '/api/blogs'

let auth = null

const setToken = (newToken) => {
  auth = `Bearer ${newToken}`
}

const getAll = async () => {
  let options = {
    method: 'GET',
    url: baseUrl,
    headers: {
      Accept: '*/*',
      Authorization: auth,
    },
  }

  const response = await axios.request(options)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: auth },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, updatedObject) => {
  const config = {
    headers: { Authorization: auth },
  }

  const response = await axios.put(`${baseUrl}/${id}`, updatedObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: auth },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { setToken, getAll, create, update, remove }
