import service from '../utils/request'

// 国内疫情请求API key值
const domesticKey = '339ac07ae7fbe7181168c53032ceb5ef'

export const domesticGet = (date) => service({
  method: 'get',
  url: 'ncovcity/index?key=' + domesticKey + '&date=' + date
})

export const cityDataGet = (date) => service({
  method: 'get',
  url: 'ncovcity/index?key=' + domesticKey
})

export const domesticCountGet = (date) => service({
  method: 'get',
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // },
  url: 'ncov/index?key=' + domesticKey + '&date=' + date
})

export const domesticTotalGet = () => service({
  method: 'get',
  url: 'ncov/index?key=' + domesticKey
})

export const foreignDataGet = () => service({
  method: 'get',
  url: 'ncovabroad/index?key=' + domesticKey
})

export const nearbyGet = (provice, city, district) => service({
  method: 'get',
  url: 'ncovnearby/index?key=' + domesticKey + '&province=' + provice + '&city=' + city + '&district=' + district
})
