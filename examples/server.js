const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
const complier = webpack(WebpackConfig)

app.use(webpackDevMiddleware(complier, {
    publicPath: '/__build__/',
    stats: {
        colors: true,
        chunks: false
    }
}))

app.use(webpackHotMiddleware(complier))
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

const router = express.Router()

router.get('/simple/get', (req, res) => {
    res.json({
        msg: `hello word`
    })
})
router.get('/base/get', (req, res) => {
    res.json(req.query)
})
router.post('/base/post', (req, res) => {
    res.json(req.body)
})
router.post('/base/buffer', (req, res) => {
    let msg = []
    req.on('data', (chunks) => {
        msg.push(chunks);
    })
    req.on('end',() => {
        let buf = Buffer.concat(msg)
        res.json(buf.toJSON())
    })
})

// 超时接口
router.get('/error/timeout', (req, res) => {
    setTimeout(() => {
        res.json({
            msg: 'hello world'
        })
    }, 3000)
})

// 请求错误
router.get('/error/error', (req, res) => {
    if (Math.random() > 0.5) {
        res.json({
            msg: 'hello world'
        })
    } else {
        res.status(500)
        res.end()
    }
})

app.use(router)

const port = process.env.PORT || 5050

module.exports = app.listen(port, () => {
    console.log('server listen 5050')
})
