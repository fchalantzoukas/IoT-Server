import express from "express"
import * as dotenv from 'dotenv'
dotenv.config()
const router = express.Router();

let questionRoom = []
let questionerList = []
import * as dataController from '../controller/data-controller.mjs'

router.route('/').get((req, res) => {
  res.status(200).send('Welcome!')
})

//Saves a question in the DB
router.route('/savequestion').post((req,res)=>{
  let questioner = req.body.questioner.toUpperCase()
  let roomId = req.body.roomId
  dataController.getName(questioner, (err, person) => {
    if (person != undefined) {
      dataController.insertQuestion(questioner, roomId, (err,rows)=>{
      if (err){if (err.errno==19){res.status(409).send('This Question is Already Stored')}}
      else {res.status(200).send('Questioner stored by the server')}
    })}
    else { res.status(500).send('Questioner not found') }
  })
  
})

//Renders the questions of a room given its ID
router.route('/questions/:id').get((req,res)=>{
  let id=(req.params.id==undefined?1:req.params.id)
  dataController.getQuestionList(id, (err, rows) =>{
  if (err){
    res.status(400).send('Fail')}
    else if (rows.length==0){
      res.status(200).send('No Questions')
    }
    else{
      const d = new Date()
      const time = d.getTime()
  for (let i=0; i<rows.length; i++){
    let timeDiff = 0
    timeDiff = time - parseInt(rows[i].Timestamp)
    rows[i].Timestamp=(timeDiff>60000?String(Math.round(timeDiff/60000))+" minute(s) ago, ":String(Math.round(timeDiff/1000))+" seconds ago, ")
    let splitNames=rows[i].Name.split(' ')
    let initials = splitNames[0][0]+(splitNames[1]==undefined?'':splitNames[1][0])
    rows[i].Initials = initials
  }
  res.status(200).render('questions', {questions: rows, room: "Room "+id, layout: 'room.hbs'})}
  })
})

router.route('/questions/').get((req,res)=>{
  res.status(300).redirect('/questions/1')})

//Renders the viewers of a lecture given its ID
router.route('/viewers/:id').get((req,res)=>{
  let id=(req.params.id==undefined?1:req.params.id)
  dataController.getWatchList(id, (err, rows) =>{
  if (err||(rows==undefined)){
    res.status(400).send('Fail')}
    else{
  for (let i=0; i<rows.length; i++){
    let splitNames=rows[i].Name.split(' ')
    let initials = splitNames[0][0]+(splitNames[1]==undefined?'':splitNames[1][0])
    rows[i].Initials = initials
    rows[i].Timestamp = rows[i].Duration+" minutes"
  }
  res.status(200).render('questions', {questions: rows, room: id, layout: 'room.hbs'})}
  })
})

router.route('/viewers/').get((req,res)=>{
  res.status(300).redirect('/viewers/1')})

//Saves the current viewers of a talk
router.route('/saveviewers').post((req,res)=>{
  let viewers = req.body.viewers
  let talkId=req.body.talkId
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
  res.status(200).send('Data stored by the server')
})

//Returns a list of the auth beacons
router.route('/getauthbeacons').get((req,res)=>{
  // let hallID=1
  dataController.getAuthBeacons((err, rows) =>{
  if (err){
    res.status(400).send('Fail')}
    else if (rows.length==0){
      res.status(200).send('No Auth Beacons found')
    }
    else{
  res.status(200).send(rows)}
  })
})

//Stores the closest person to a particular kiosk
router.route('/saveclosest').post((req,res)=>{
  let closestID = req.body.closestID
  let kioskID = req.body.kiosk
  dataController.updateClosest(closestID, kioskID, (err,rows)=>{
    if (err){
      res.status(400).send('Fail')}
    else {
      res.status(200).send(rows.Company+" kiosk updated")
    }
  })
})

//Saves a data exchange request
router.route('/exchangedata').post((req,res)=>{
  let closestID = req.body.closestID
  let initID = req.body.initID
  dataController.exchangeData(initID, closestID, (err,rows)=>{
    if (err){
      if (err.errno==19){res.status(409).send('This Request is Already Stored')}
      else{
      res.status(400).send('Failure')}}
    else {
      res.send("Data exchange between "+initID+", "+closestID+" saved")
    }
  })
})

//Renders the data of the closest person to a particular kiosk given its ID
router.route('/getclosest/:id').get((req,res)=>{
  dataController.getClosest(req.params.id.toUpperCase(), (err,row)=>{
    if (err){
      res.status(400).send('Fail')}
    else if (row==undefined){
      res.status(200).render('near-me')}
    else {
      res.status(200).render('near-me',{name: row.Name, profession: row.Job, email: row.Email, company: row.Company, phone: row.Phone})
    }
  })
})

//Deletes old questions
router.route('/clear').post((req,res)=>{
  let roomId = req.body.roomId
  // if (process.env.KEY==req.body.key){
  for (let room in questionRoom){
    if (room==roomId){
      questionerList.slice(questionRoom.indexOf(room))}}
  dataController.clearQuestions(roomId)
  res.status(200).send('Questions Cleared')
})

//Responds to bad URLs
router.route('*').get((req,res)=>{
  res.status(404).json({error:'Invalid URL'})
})

//Responds to bad URLs
router.route('*').post((req,res)=>{
  res.status(404).json({error:'Invalid URL'})
})

export default router;