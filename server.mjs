import express from "express"
import routes from './routes/routes.mjs'

const app = express()
const port = 80

app.use(express.urlencoded({extended:true}))
app.use('/', routes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})