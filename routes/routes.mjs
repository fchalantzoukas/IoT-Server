import express from "express"
const router = express.Router();

let viewerList = []
let viewTime = []
let questionerList = []
let dataController = await import('../controller/data-controller.mjs')

router.route('/').get((req, res) => {
  res.send('Welcome!')
})


router.route('/savequest').post((req,res)=>{
  let questioner = req.body.questioner
    let len=17
    
    let id=questioner.slice(len-2,len).toUpperCase()
    let index = questionerList.indexOf(id)
    if (index==-1){
      questionerList.push(id)
      console.log(questionerList)
      res.send('Questioner stored by the server')
    }
  else{
  console.log(questionerList)
  res.send('')
  }
})

router.route('/viewquest').get((req,res)=>{
  let responseStr=""
  for (let i=0; i<questionerList.length; i++){
    responseStr+=questionerList[i]+", "
  }
  responseStr = responseStr.slice(0,responseStr.length-2)
  res.send(responseStr)
})


router.route('/view').get((req,res)=>{
  let responseStr=""
  console.log(viewTime)
  for (let i=0; i<viewTime.length; i++){
    responseStr+=viewerList[i]+": "+viewTime[i]+" minutes, "
  }
  responseStr = responseStr.slice(0,responseStr.length-2)
  res.send(responseStr)
})

router.route('/save').post((req,res)=>{
  let viewers = req.body.viewers
  let msgList = req.body.msgList
  let len=17
  if (typeof(viewers)=='string'){
    let id=viewers.slice(len-2,len).toUpperCase()
    dataController.editWatchList(id, viewerList, viewTime)
  }
  else if (viewers!=undefined) {
  for (let i=0; i<viewers.length; i++){
    let id=viewers[i].slice(len-2,len).toUpperCase()
    dataController.editWatchList(id, viewerList, viewTime)
  }}
  console.log(viewTime)
  res.send('Data stored by the server')
})

router.route('/clear').post((req,res)=>{
  viewerList = []
  viewTime = []
  questionerList = []
  res.send('History Cleared')
})

router.route('*').get((req,res)=>{
  res.send('404!')
})

router.route('*').post((req,res)=>{
  res.send('404!')
})

export default router;