import sqlite3 from 'sqlite3'

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

export let updateWatchList = (MACID, talkId, duration, callback) => {
    duration = duration+10
    const sql = "UPDATE Watches SET Duration = ? WHERE MACID = ? AND TalkID = ?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [duration, MACID, talkId], (err, row) => {
        db.close()
    })
}

export let insertWatchList = (MACID, talkId, duration, callback) => {
    duration = 10
    const sql = "INSERT INTO Watches (MACID, TalkID, Duration) VALUES (?,?,?)"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [MACID, talkId, duration], (err, row) => {
        db.close()
    })
}

export let insertQuestion = (Person, talkId) => {
    const d = new Date()
    const time = d.getTime()
    const sql = "INSERT INTO Question (PersonMACID, RoomID, Timestamp) VALUES (?,?,?)"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [Person, talkId, time], (err, row) => {
        db.close()
    })
}

export let clearAll = () => {
    let sql = "DELETE FROM Watches"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql)
    sql = "DELETE FROM Question"
    db.get(sql)
    db.close()
}

export let getWatchList = (talkId, callback) => {
    const sql = "SELECT Name, Duration FROM Watches JOIN Participant on Watches.MACID=Participant.MACID WHERE TalkID=?"
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

export let getQuestionList = (talkId, callback) => {
    const sql = "SELECT Name, Timestamp FROM Question JOIN Participant on Question.PersonMACID=Participant.MACID WHERE RoomID=?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.all(sql, [talkId], (err, row) => {
        db.close()
        if (err){ console.log(err)
            
            callback(err,null)}
    else {
        callback(null, row)}
    })
}

export let getAuthBeacons = (hallId, callback) => {
    const sql = "SELECT KioskMACID FROM Kiosk WHERE HallID=?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.all(sql, [hallId], (err, row) => {
        db.close()
        if (err){ console.log(err)
            
            callback(err,null)}
    else {
        callback(null, row)}
    })
}

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

export let getClosest = (kioskID, callback) => {
    const sql = "SELECT Name FROM Participant JOIN Kiosk on Participant.MACID=Kiosk.ClosestPerson WHERE Kiosk.KioskMACID = ?"
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