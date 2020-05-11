import axios from 'axios'

const service = axios.create({
  baseURL: 'http://api.tianapi.com/txapi/',
  timeout: 5000
})

service.interceptors.request.use(
  (config) => config,
  (error) => {
    console.log(error)
    return error
  }
)

service.interceptors.response.use(
  (res) => {
    const { data } = res
    return data
  },
  (error) => {
    console.log(error)
    return error
  }
)

export default service
