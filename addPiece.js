
function addPiece(x,y,selectedType,e){
    // if user placed a item in the curent render cycle return 
    if(placeLock == true) return
    // if placing a free standing piece
    if(
        selectedType !== undefined 
        && 
        selectedType !== "Delete" 
        && 
        (
            findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y) == undefined 
            ||
            e.shiftKey == true
        )
    ){
        // console.log("free piece")
        let newgroup = new BunkerGroup()
        newgroup.BBpieces[selectedType][selectedTier].push(getPiece(x,y,rotation))
        newgroup.calculateStats()
        bunkerGroupes.push(newgroup)
        //console.log(newgroup)
        //console.log(bunkerGroupes)

    }
    // if deleting a piece
    else if(
        selectedType == "Delete"
    ){
        // console.log("del piece")
        let closestBP = findClosestBunkerPieceToPosition(curentMouse.x,curentMouse.y)
        if(
            closestBP.group == 'trenches'
        ){
            trenches[closestBP.type][closestBP.tier][closestBP.piece] = null
            trenches[closestBP.type][closestBP.tier] = trenches[closestBP.type][closestBP.tier].filter(n => n)
            
            trenches.calculateStats()
        }
        else
        {
            bunkerGroupes[closestBP.group].BBpieces[closestBP.type][closestBP.tier][closestBP.piece] = null
            bunkerGroupes[closestBP.group].BBpieces[closestBP.type][closestBP.tier] = bunkerGroupes[closestBP.group].BBpieces[closestBP.type][closestBP.tier].filter(n => n)
            for(let group in bunkerGroupes){
                let empty = true
                for(let type in bunkerGroupes[group].BBpieces){
                    if(bunkerGroupes[group].BBpieces[type][0] && bunkerGroupes[group].BBpieces[type][0].length!==0) empty = false
                    if(bunkerGroupes[group].BBpieces[type][1] && bunkerGroupes[group].BBpieces[type][1].length!==0) empty = false
                    if(bunkerGroupes[group].BBpieces[type][2] && bunkerGroupes[group].BBpieces[type][2].length!==0) empty = false
                }
                //console.log(bunkerGroupes[group].BBpieces)
                //console.log(empty)
                if(empty){
                    bunkerGroupes.splice(group,1)
                    
                    document.getElementById("totalPieces").innerText = 0
                    document.getElementById("RawHP").innerText = 0
                    document.getElementById("SIvalue").innerText = 1
                    document.getElementById("TotalHP").innerText = 0
                    document.getElementById("RepairCost").innerText = 0
                    document.getElementById("EhpPerSwing").innerText = 0
                    document.getElementById("PhpPerSwing").innerText = '0%'
                    document.getElementById("BCost").innerText = 0
                    document.getElementById("CCost").innerText = 0
                }else{
                    bunkerGroupes[closestBP.group].calculateStats()
                }
            }
            bunkerGroupes.filter(n=>n)
        }
    }
    // if attaching a piece to an existing border
    else if(
        findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y)!==undefined
        &&
        findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y).group!=='trenches'
    ){
        // console.log("attatched piece")
        //console.log('adding piece to group')
        let closestAP = findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y)
        //console.log(selectedType)
        if(['TS','TO','TC'].includes(selectedType)){
            trenches[selectedType][selectedTier].push(getPiece(closestAP.border.x,closestAP.border.y,closestAP.border.direction))
        }else if(closestAP.group!=='trenches'){
            bunkerGroupes[closestAP.group].BBpieces[selectedType][selectedTier].push(getPiece(closestAP.border.x,closestAP.border.y,closestAP.border.direction))
            bunkerGroupes[closestAP.group].calculateStats()
        }else{
            console.log("problem attaching to border")
        }
    }
    // if adding to trench
    else if(
        findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y)!==undefined
        &&
        findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y).group=='trenches'
    ){
        // console.log("trench piece")
        //console.log('adding piece to group')
        let closestAP = findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y)
        //console.log(selectedType)
        if(['TS','TO','TC'].includes(selectedType)){
            trenches[selectedType][selectedTier].push(getPiece(closestAP.border.x,closestAP.border.y,closestAP.border.direction))
        }else if(!['TS','TO','TC'].includes(selectedType)){

            let newgroup = new BunkerGroup()
            newgroup.BBpieces[selectedType][selectedTier].push(getPiece(closestAP.border.x,closestAP.border.y,closestAP.border.direction))
            newgroup.calculateStats()
            bunkerGroupes.push(newgroup)

        }else{
            console.log("problem attaching to border")
        }
    }
}


function getPiece(tx,ty,td,forceType,lockfacing){
    let type = selectedType
    let facing = curentFacing
    if(forceType)type = forceType
    if(lockfacing!==undefined)facing = lockfacing
    switch (type) {
        case 'BoB':
            return new BoB(tx,ty,td,type,selectedTier)
        case 'BS':
            return new BS(tx,ty,td,type,selectedTier)
        case 'BC':
            return new BC(curentOrgin,tx,ty,td,type,selectedTier)
        case 'BR':
            return new BR(tx,ty,td,facing,type,selectedTier)
        case 'RG': 
            return new RG(tx,ty,td,curentFacing,type,selectedTier)
        case 'MGG':
            return new MGG(tx,ty,td,curentFacing,type,selectedTier)
        case 'OB':
            return new OB(tx,ty,td,type,selectedTier)
        case 'EB':
            return new EB(tx,ty,td,type,selectedTier)
        case 'ATG':
            return new ATG(tx,ty,td,curentFacing,type,selectedTier)
        case 'HG':
            return new HG(tx,ty,td,curentFacing,type,selectedTier)
        case 'AB':
            return new AB(tx,ty,td,type,selectedTier)
        case 'IC':
            return new IC(tx,ty,td,type,selectedTier)
        case 'SC':
            return new SC(tx,ty,td,type,selectedTier)
        case 'TS':
            return new TS(curentOrgin,tx,ty,td,type,selectedTier)
        case 'TO':
            return new TO(tx,ty,td,type,selectedTier)
    
        default:
            //TODO make an error prompt
            break;
    }
}