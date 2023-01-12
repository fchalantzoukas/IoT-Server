import sqlite3 from 'sqlite3'

export function editWatchList (id, viewerList, viewTime){
    id = id.Name
    console.log(id)
    let index = viewerList.indexOf(id)
    if (index==-1){
        viewerList.push(id)
        let add=10
        viewTime.push(add)
    }
    else viewTime[index]+=10
}

export let getName = (MAC, callback) => {
    const sql = "SELECT Name FROM Person WHERE MAC = ?"
    const db = new sqlite3.Database('./controller/db-test.db')
    db.get(sql, [MAC], (err, row) => {
        db.close()
        if (err){ console.log(err)
                callback(err,null)}
        else {callback(null, row)}
    })
}