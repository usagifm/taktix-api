import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import bodyParser from 'body-parser'
import routes from './routes'
import nodemailer from 'nodemailer'

import passport from 'passport'

const app = express()

app.use(passport.initialize())
app.use(express.json({ limit: '50mb' }))
app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'))

routes(app)

const port = process.env.PORT || 2000
app.listen(port, console.log(`Taktix-api Server is running on port ${port}`))
