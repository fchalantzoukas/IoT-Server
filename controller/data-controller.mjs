export function editWatchList (id, viewerList, viewTime){

    let index = viewerList.indexOf(id)
    if (index==-1){
        viewerList.push(id)
        let add=10
        viewTime.push(add)
    }
    else viewTime[index]+=10
}