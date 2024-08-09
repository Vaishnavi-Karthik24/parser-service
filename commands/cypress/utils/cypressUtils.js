/* eslint-disable no-undef */
export const API_AUTH_PREFIX = '/auth'
export const API_AUTH_VERSION = '/v1'
const chance = new (require('chance'))()
// export const username = chance.first()
// export const username = 'SVC-VSON1'
export const url = Cypress.env('ENV')

export const username = Cypress.env('USER_NAME')

export const password = Cypress.env('PASSWORD')

export const apiRoot = url
export const rootUrl = url
export const authRoute = (path) => {
  return url + '/app-name/' + username + path
}

export const baseUrl = (path) => {
  return url + path
}
export const authRouteSecondUser = (path) => {
  // setCache('SVC-VSON1')
  return rootUrl + 'app-name/' + username + path
}
export const openRoute = (path) => {
  return rootUrl + '/' + path
}

export const setCache = (userInfo, token) => {
  // localStorage.setItem('app-ui', {'realUser': {'loginId': 'svc_vson', 'userName': 'svc_vson'}, 'currentUser': {'loginId': 'svc_vson', 'userName': 'svc_vson'}})
  // localStorage.setItem('VSON_AUTH', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJsb2dpbmlkIjoic3ZjLXZzb24iLCJpYXQiOjE1MTYyMzkwMjIsImlzcyI6IlZTT04ifQ.enMB1m9uQhtqHSKZoxi2d1Y8R3bO5HhGE_OlaNCV3qhLHEqWTZeVYzhMKiWhdGPdq9QVxqIPD_H8F5a_5kHAqg')

  localStorage.setItem('vson-ui', {
    realUser: { loginId: userInfo, userName: userInfo },
    currentUser: { loginId: userInfo, userName: userInfo },
  })
  localStorage.setItem(
    'VSON_AUTH',
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJsb2dpbklkIjoiU1ZDLVZTT04iLCJmaXJzdE5hbWUiOiJTVkMtVlNPTiIsImxhc3ROYW1lIjoiU1ZDLVZTT04iLCJwaG9uZSI6IiIsImVtYWlsIjoiIiwic3RhdHVzIjoiQUNUSVZFIiwicm9sZSI6IlZTT05fQUxHT1JJVEhNX0RFVkVMT1BFUiIsInNvbkFkbWluIjoxLCJpYXQiOjE1OTUyMzU1MzksImlzcyI6IlZTT04ifQ.-pM0SLUO40mvrcgL7dW7IsQPfFczcWMtlPoffDZ49RLVRJMo-iuDa7R3YjrMXUAEmrqiwbQncf1sqxZ8wbbUDAsss'
  )
}
