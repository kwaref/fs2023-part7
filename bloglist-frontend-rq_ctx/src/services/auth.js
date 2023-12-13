import axios from 'axios'
const baseUrl = '/api/login'

const login = async accessData => {
  const response = await axios.post(baseUrl, accessData)
  return response.data
}

export default { login }