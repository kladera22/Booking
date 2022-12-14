const user = require('./routes/user')
const package = require('./routes/package')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const logger = require('./middlewares/logger')
const error = require('./middlewares/error')
const errorHandler = require('./middlewares/error')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const hpp = require('hpp')
const xss = require('xss-clean')

dotenv.config({ path: './config/config.env'})

connectDB()

const app = express()

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(bodyParser.json())
app.use(logger)
app.use(cookieParser())
app.use(fileupload())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
app.use(helmet())
app.use(cors())

const limiter = rateLimit({
    windowMs: 10*60*1000,
    max: 100
})

app.use(limiter)

app.use('/api/v1/user', user)
app.use('/api/v1/package', package)

app.use(errorHandler)

const PORT = process.env.PORT || 5001

const server = app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    server.close(() => process.exit(1))
})
