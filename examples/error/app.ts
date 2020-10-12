import axios, { AxiosError }  from '../../src/index'
// axios({
//     url: '/error/timeout'
// }).then(res => {
//     // TODO
// }).catch((e) => {
//     console.log(e)
// })
// axios({
//     url: '/error/error'
// }).then(res => {
//     // TODO
// }).catch((e) => {
//     console.log(e)
// })

// axios({
//   method: 'get',
//   url: '/error/error'
// }).then((res) => {
//   console.log(res)
// }).catch((e) => {
//   console.log(e)
// })

// axios({
//   method: 'get',
//   url: '/error/error'
// }).then((res) => {
//   console.log(res)
// }).catch((e) => {
//   console.log(e)
// })

// setTimeout(() => {
//   axios({
//     method: 'get',
//     url: '/error/error'
//   }).then((res) => {
//     console.log(res)
//   }).catch((e) => {
//     console.log(e)
//   })
// }, 5000)

axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 3000
}).then((res) => {
  console.log(res)
}).catch((e: AxiosError) => {
  console.log(e.message)
  console.log(e.config)
  console.log(e.code)
  console.log(e.request)
  console.log(e.isAxiosError)
})
