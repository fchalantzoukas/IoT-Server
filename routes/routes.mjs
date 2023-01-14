import express from "express"
import * as dotenv from 'dotenv'
dotenv.config()
const router = express.Router();

// let viewerList = []
// let viewTime = []
let questionerList = []
let dataController = await import('../controller/data-controller.mjs')

router.route('/').get((req, res) => {
  res.send('Welcome!')
})


router.route('/savequest').post((req,res)=>{
  let questioner = req.body.questioner.toUpperCase()
  let index = questionerList.indexOf(questioner)
  let roomId = 1
  if (index==-1){
    dataController.getName(questioner, (err, person)=>{
      if (person!=undefined){
        questionerList.push(questioner)
        dataController.insertQuestion(person.Name, roomId)
        res.send('Questioner stored by the server')
      }
      else {res.send('Fail')}
    })}
  else{
  res.send('Pass')
  }
})

router.route('/viewquest').get((req,res)=>{
  let responseStr=""
  let id=1
  dataController.getQuestionList(id, (err, rows) =>{
  if (err){
    responseStr='Fail'}
    else if (rows.length==0){
      responseStr='No Questions'
    }
    else{
  for (let i=0; i<rows.length; i++){
    responseStr+=rows[i].Name+", "
  }
  responseStr = responseStr.slice(0,responseStr.length-2)}
  res.send(responseStr)
  })
})


router.route('/view').get((req,res)=>{
  let responseStr=""
  let id=1
  dataController.getWatchList(id, (err, rows) =>{
  if (err||(rows==undefined)){
    responseStr='Fail'}
    else{
  for (let i=0; i<rows.length; i++){
    responseStr+=rows[i].Name+": "+rows[i].Duration+" minutes, "
  }
  responseStr = responseStr.slice(0,responseStr.length-2)}
  res.send(responseStr)
  })
})

router.route('/save').post((req,res)=>{
  let viewers = req.body.viewers
  // let msgList = req.body.msgList
  let talkId=1
  if (typeof(viewers)=='string'){
    let MAC = viewers.toUpperCase()
    dataController.getName(MAC, (err, id)=>{
      if (id!=undefined){
      dataController.checkWatchList(MAC, talkId, (err, duration)=>{
        if (duration!=undefined){
          dataController.updateWatchList(MAC, talkId, duration.Duration)
        }
        else {dataController.insertWatchList(MAC, talkId, duration)}
      })}
  })}
  else if (viewers!=undefined) {
  for (let i=0; i<viewers.length; i++){
      let MAC = viewers[i].toUpperCase()
      dataController.getName(MAC, (err, id)=>{
      if (id!=undefined){
      dataController.checkWatchList(MAC, talkId, (err, duration)=>{
        if (duration!=undefined){
          dataController.updateWatchList(MAC, talkId, duration.Duration)
        }
        else {dataController.insertWatchList(MAC, talkId, duration)}
      })}
  })
  }}
  res.send('Data stored by the server')
})

router.route('/clear').post((req,res)=>{
  // if (process.env.KEY==req.body.key){
  questionerList = []
  dataController.clearAll()
  res.send('History Cleared')
  // res.send('Fail')
})

router.route('*').get((req,res)=>{
  res.send('404!')
})

router.route('*').post((req,res)=>{
  res.send('404!')
})

export default router;