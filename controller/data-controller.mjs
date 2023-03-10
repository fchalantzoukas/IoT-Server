import sqlite3 from 'sqlite3'

//Returns the corresponding Name from the MAC Address ID
export let getName = (MACID, callback) => {
    const sql = "SELECT Name FROM Participant WHERE MACID = ?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [MACID], (err, row) => {
        db.close()
        if (err){ console.log(err)
                callback(err,null)}
        else {callback(null, row)}
    })
}

//Checks if a viewer has already been stored in the viewer list of a lecture/talk
export let checkWatchList = (MACID, talkId, callback) => {
    const sql = "SELECT Duration FROM Watches WHERE MACID = ? AND TalkID = ?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [MACID, talkId], (err, row) => {
        db.close()
        if (err){ console.log(err)
                callback(err,null)}
        else {callback(null, row)}
    })
}

//Updates the Duration for a viewer
export let updateWatchList = (MACID, talkId, duration, callback) => {
    duration = duration+5
    const sql = "UPDATE Watches SET Duration = ? WHERE MACID = ? AND TalkID = ?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [duration, MACID, talkId], (err, row) => {
        db.close()
    })
}

//Adds a new viewer in the viewer list
export let insertWatchList = (MACID, talkId, duration, callback) => {
    duration = 5
    const sql = "INSERT INTO Watches (MACID, TalkID, Duration) VALUES (?,?,?)"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [MACID, talkId, duration], (err, row) => {
        db.close()
    })
}

//Stores a new question
export let insertQuestion = (Person, talkId, callback) => {
    const d = new Date()
    const time = d.getTime()
    const sql = "INSERT INTO Question (PersonMACID, RoomID, Timestamp) VALUES (?,?,?)"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [Person, talkId, time], (err, row) => {
        db.close()
        if (err){callback(err,null)}
        else {callback(null, row)}
    })
}

//Deletes old questions
export let clearQuestions = (roomId) => {
    let sql = "DELETE FROM Question WHERE RoomID=?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [roomId])
    db.close()
}

//Returns the viewer list of a talk/lecture
export let getWatchList = (talkId, callback) => {
    const sql = "SELECT Name, Email, Duration FROM Watches JOIN Participant on Watches.MACID=Participant.MACID WHERE TalkID=? ORDER BY Duration DESC, Name DESC"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.all(sql, [talkId], (err, row) => {
        
        if (err){ console.log(err)
            db.close()
            callback(err,null)}
    else {
        db.close()
        callback(null, row)}
    })
}

//Returns the question list of a room
export let getQuestionList = (talkId, callback) => {
    const sql = "SELECT Name, Email, Timestamp FROM Question JOIN Participant on Question.PersonMACID=Participant.MACID WHERE RoomID=? ORDER BY Timestamp ASC"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.all(sql, [talkId], (err, row) => {
        db.close()
        if (err){ console.log(err)
            
            callback(err,null)}
    else {
        callback(null, row)}
    })
}

//Returns a list of the authorised beacons
export let getAuthBeacons = (callback) => {
    const sql = "SELECT KioskMACID FROM Kiosk"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.all(sql,(err, row) => {
        db.close()
        if (err){ console.log(err)
            
            callback(err,null)}
    else {
        callback(null, row)}
    })
}

//Returns a list of the data exchange requests
export let getExchanges = (callback) => {
    const sql = "SELECT * FROM Request"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.all(sql,(err, row) => {
        db.close()
        if (err){ console.log(err)
            
            callback(err,null)}
    else {
        callback(null, row)}
    })
}

//Updates the closest person to a particular kiosk
export let updateClosest = (closestID, kioskID, callback) => {
    let sql = "UPDATE Kiosk SET ClosestPerson = ? WHERE KioskMACID = ?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [closestID, kioskID], (err, row) => {
        
        if (err){
            db.close()
            callback(err,null)
        }
        else {
            sql = 'SELECT Company FROM Kiosk WHERE KioskMACID=?'
            db.get(sql, [kioskID], (err, rows) => {
                db.close()
                if (err){
                    callback(err,null)
                }
                else {
                    callback(null,rows)
                }})
        }
    })
}

//Returns the closest person to a particular kiosk
export let getClosest = (kioskID, callback) => {
    const sql = "SELECT * FROM Participant JOIN Kiosk on Participant.MACID=Kiosk.ClosestPerson WHERE Kiosk.KioskMACID = ?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [kioskID], (err, row) => {
        db.close()
        if (err){
            callback(err,null)
        }
        else {
                    callback(null,row)
                }})
        }

//Save a request for data exchange
export let exchangeData = (initID, closestID, callback) => {
    let sql = "INSERT INTO Request (MACID1, MACID2) VALUES (?,?)"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [initID, closestID], (err, row) => {
    db.close()
        if (err){
            callback(err,null)
        }
        else {callback(null,row)}})
        }