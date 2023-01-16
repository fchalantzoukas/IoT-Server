import express from "express"
import routes from './routes/routes.mjs'
import {engine} from "express-handlebars"

const app = express()
const port = 80

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));
app.engine('.hbs', engine({extname: '.hbs', defaultLayout:'main'}));
app.set('view engine', '.hbs');
app.use('/', routes);

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`)
})