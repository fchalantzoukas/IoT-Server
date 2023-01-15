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
        dataController.insertQuestion(questioner, roomId)
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
      const d = new Date()
      const time = d.getTime()
  for (let i=0; i<rows.length; i++){
    let timeDiff = 0
    timeDiff = time - parseInt(rows[i].Timestamp)
    responseStr+=rows[i].Name+": "+(timeDiff>60000?String(Math.round(timeDiff/60000))+" minute(s) ago, ":String(Math.round(timeDiff/1000))+" seconds ago, ")
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
    let MACID = viewers.toUpperCase()
    dataController.getName(MACID, (err, id)=>{
      if (id!=undefined){
      dataController.checkWatchList(MACID, talkId, (err, duration)=>{
        if (duration!=undefined){
          dataController.updateWatchList(MACID, talkId, duration.Duration)
        }
        else {dataController.insertWatchList(MACID, talkId, duration)}
      })}
  })}
  else if (viewers!=undefined) {
  for (let i=0; i<viewers.length; i++){
      let MACID = viewers[i].toUpperCase()
      dataController.getName(MACID, (err, id)=>{
      if (id!=undefined){
      dataController.checkWatchList(MACID, talkId, (err, duration)=>{
        if (duration!=undefined){
          dataController.updateWatchList(MACID, talkId, duration.Duration)
        }
        else {dataController.insertWatchList(MACID, talkId, duration)}
      })}
  })
  }}
  res.send('Data stored by the server')
})

router.route('/getauthbeacons').get((req,res)=>{
  let hallID=1
  dataController.getAuthBeacons(hallID, (err, rows) =>{
  if (err){
    res.send('Fail')}
    else if (rows.length==0){
      res.send('No Auth Beacons found for this hall')
    }
    else{
  res.send(rows)}
  })
})

router.route('/saveclosest').post((req,res)=>{
  let closestID = req.body.closestID==undefined?undefined:req.body.closestID.toUpperCase()
  let kioskID = req.body.kiosk.toUpperCase()
  dataController.updateClosest(closestID, kioskID, (err,rows)=>{
    if (err){
      res.send('Fail')}
    else {
      res.send(rows.Company+" kiosk updated")
    }
  })
})

router.route('/getclosest/:id').get((req,res)=>{
  dataController.getClosest(req.params.id.toUpperCase(), (err,row)=>{
    if (err){
      res.send('Fail')}
    else if (row==undefined){
      res.send('No one close')}
    else {
      res.send(row.Name)
    }
  })
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