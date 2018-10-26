var express = require('express')
var session = require('express-session');
var path = require('path')
// var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var log4js = require('./logs')
var cors = require('cors')

var bindRoute = require('./routes')

var app = express()

// 初始化配置
log4js.configure()
// 挂载中间件
app.use(log4js.useLog())

// 添加CORS 用以支持不同源访问
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/static', express.static('static'))


// 添加session机制
app.use(session({
  //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  name: 'cze',
  secret: 'keyboard cat', 
  cookie: { path: '/', httpOnly: true, secure: false, maxAge:  60000 },
  //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
  resave: true, 
  //强制“未初始化”的会话保存到存储。 
  saveUninitialized: true
}))

// 跨域情况下 必须添加此属性 用以可以接收到cookie
app.use('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

bindRoute(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
