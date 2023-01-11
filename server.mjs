import express from "express"
import routes from './routes/routes.mjs'

const app = express()
const port = 80

app.use(express.urlencoded({extended:true}))
app.use('/', routes);

let viewerList = []
let viewTime = []

app.get('/', (req, res) => {
  res.send('Welcome!')
})

app.get('/view', (req,res)=>{
  let responseStr=""
  console.log(viewTime)
  for (let i=0; i<viewTime.length; i++){
    responseStr+=viewerList[i]+": "+viewTime[i]+" minutes, "
  }
  responseStr = responseStr.slice(0,responseStr.length-2)
  res.send(responseStr)
})

app.post('/save', (req,res)=>{
  let viewers = req.body.viewers
  let msgList = req.body.msgList
  let len=17
  if (typeof(viewers)=='string'){
    let id=viewers.slice(len-2,len).toUpperCase()
    let index = viewerList.indexOf(id)
    if (index==-1){
      viewerList.push(id)
      let add=10
      viewTime.push(add)
    }
    else viewTime[index]+=10
  }
  else if (viewers!=undefined) {
  for (let i=0; i<viewers.length; i++){
    let id=viewers[i].slice(len-2,len).toUpperCase()
    let index = viewerList.indexOf(id)
    if (index==-1){
      viewerList.push(id)
      let add=10
      viewTime.push(add)
    }
    else viewTime[index]+=10
  }}
  console.log(viewTime)
  res.send('Data stored by the server')
})

app.post('/clear', (req,res)=>{
  viewerList = []
  viewTime = []
  res.send('History Cleared')
})

app.get('*', (req,res)=>{
  res.send('404!')
})

app.post('*', (req,res)=>{
  res.send('404!')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})