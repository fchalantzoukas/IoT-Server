import sqlite3 from 'sqlite3'

export let getName = (MAC, callback) => {
    const sql = "SELECT Name FROM Participant WHERE MAC = ?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [MAC], (err, row) => {
        db.close()
        if (err){ console.log(err)
                callback(err,null)}
        else {callback(null, row)}
    })
}

export let checkWatchList = (MAC, talkId, callback) => {
    const sql = "SELECT Duration FROM Watches WHERE MAC = ? AND TalkID = ?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [MAC, talkId], (err, row) => {
        db.close()
        if (err){ console.log(err)
                callback(err,null)}
        else {callback(null, row)}
    })
}

export let updateWatchList = (MAC, talkId, duration, callback) => {
    duration = duration+10
    const sql = "UPDATE Watches SET Duration = ? WHERE MAC = ? AND TalkID = ?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [duration, MAC, talkId], (err, row) => {
        db.close()
    })
}

export let insertWatchList = (MAC, talkId, duration, callback) => {
    duration = 10
    const sql = "INSERT INTO Watches (MAC, TalkID, Duration) VALUES (?,?,?)"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [MAC, talkId, duration], (err, row) => {
        db.close()
    })
}

export let insertQuestion = (Person, talkId) => {
    const sql = "INSERT INTO Question (PersonMAC, RoomID) VALUES (?,?)"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [Person, talkId], (err, row) => {
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
    const sql = "SELECT Name, Duration FROM Watches JOIN Participant on Watches.MAC=Participant.MAC WHERE TalkID=?"
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
    const sql = "SELECT Name FROM Question JOIN Participant on Question.PersonMAC=Participant.Name WHERE RoomID=?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.all(sql, [talkId], (err, row) => {
        db.close()
        if (err){ console.log(err)
            
            callback(err,null)}
    else {
        callback(null, row)}
    })
}