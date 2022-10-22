var curentMouse = {'x':null,'y':null}
var scale = 4
var selectedType = undefined
var selectedTier = undefined
var rotation = 0
var curentOrgin = 1
var curentFacing = 0
var shiftKeyPressed = false
var mouseInCanvas = false
var placingTC = false

// canvas setings
var canvas = document.getElementById("bbCanvas")
var canvasTotalFieldWidthInput
var canvasTotalFieldHeightInput
setTimeout(() => {
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height
    canvasTotalFieldWidthInput = document.getElementById("canvas_width")
    canvasTotalFieldWidthInput.value = canvas.width
    canvasTotalFieldHeightInput = document.getElementById("canvas_height")
    canvasTotalFieldHeightInput.value = canvas.height
    window.requestAnimationFrame(newUpdateCanvas)
}, 1);

// var scale = document.getElementById('zoom').value
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext('2d')





// var canvasViewOffsetX = 0
// var canvasViewOffsetY = 0
var canvasFieldTotalWidth = canvasTotalFieldWidthInput*scale
var canvasFieldTotalHight = canvasTotalFieldHeightInput*scale

var placeLock = false

var bunkerGroupes = []
var selectedGroup = 0
var BGHighlightBool = false
var trenches = {
    'TS':    [[]     ,[]     ,[]],
    'TO':    [[]     ,[]     ,[]],
    'TC':    [[]     ,[]     ,[]],
    // 'other':    [[]     ,null   ,null]
}

// line intersection check code
function intersects(xs1,ys1,xe1,ye1,xs2,ys2,xe2,ye2) {
    var det, gamma, lambda;
    det = (xe1 - xs1) * (ye2 - ys2) - (xe2 - xs2) * (ye1 - ys1);
    if (det === 0) {
    } else {
      lambda = ((ye2 - ys2) * (xe2 - xs1) + (xs2 - xe2) * (ye2 - ys1)) / det;
      gamma = ((ys1 - ye1) * (xe2 - xs1) + (xe1 - xs1) * (ye2 - ys1)) / det;
      if((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)){
          return lambda
      }
    }
  };
  
// key press checks
window.addEventListener("keypress",(e)=>{
    if(!mouseInCanvas) return
    switch(e.key){
        case 'q':
        case 'Q':
            if(e.shiftKey){
                rotation+=-15
                if(rotation<0) rotation+=360
            }else{
                rotation+= -1
                if(rotation<0) rotation+=360
            }
            break
        case 'e':
        case 'E':
            if(e.shiftKey){
                rotation+=15
                if(rotation>359) rotation+=-360
            }else{
                rotation+= 1
                if(rotation>359) rotation+=-360
            }
            break
        // case 's':
        // case 'S':
        //     if(e.shiftKey){
        //         canvasViewOffsetY+= 25*scale
        //         if(canvasViewOffsetY > (canvasFieldTotalHight-canvas.height)) canvasViewOffsetY = canvasFieldTotalHight-canvas.height
        //     }else{
        //         canvasViewOffsetY+= 1*scale
        //         if(canvasViewOffsetY > (canvasFieldTotalHight-canvas.height)) canvasViewOffsetY = canvasFieldTotalHight-canvas.height
        //     }
        //     break
        // case 'w':
        // case 'W':
        //     if(e.shiftKey){
        //         canvasViewOffsetY-= 25*scale
        //         if(canvasViewOffsetY < 0) canvasViewOffsetY = 0
        //     }else{
        //         canvasViewOffsetY-= 1*scale
        //         if(canvasViewOffsetY < 0) canvasViewOffsetY = 0
        //     }
        //     break
        // case 'd':
        // case 'D':
        //     if(e.shiftKey){
        //         canvasViewOffsetX+= 25*scale
        //         if(canvasViewOffsetX > (canvasFieldTotalWidth-canvas.width)) canvasViewOffsetX = canvasFieldTotalWidth-canvas.width
        //     }else{
        //         canvasViewOffsetX+= 1*scale
        //         if(canvasViewOffsetX > (canvasFieldTotalWidth-canvas.width)) canvasViewOffsetX = canvasFieldTotalWidth-canvas.width
        //     }
        //     break
        // case 'a':
        // case 'A':
        //     if(e.shiftKey){
        //         canvasViewOffsetX-= 25*scale
        //         if(canvasViewOffsetX < 0) canvasViewOffsetX = 0
        //     }else{
        //         canvasViewOffsetX-= 1*scale
        //         if(canvasViewOffsetX < 0) canvasViewOffsetX = 0
        //     }
        //     break
        default:
            console.log(e.key)
    }
})
// check for scrollup/down  !!temp disabled!!
// window.addEventListener("wheel",(e)=>{
//     if(e.deltaY>0){
//         rotation+= 1
//         if(rotation>360) rotation+=-360
//     }else if(e.deltaY<=0){
//         rotation+= -1
//         if(rotation<0) rotation+=360
//     }else{

//     }
// })
// when user moves mouse inside canvas
canvas.addEventListener("mousemove",(e)=>{getMousePos(canvas,e)})
// when user moves mouse out of canvas
canvas.addEventListener("mouseout",e=>{mouseInCanvas=false})
// when user moves mouse into the canvas
canvas.addEventListener("mouseover",e=>{mouseInCanvas=true})
// when user presses any mouse button (left, mid, or right)* not IE comapatible,
canvas.addEventListener("mousedown",e=>{
    //make shure the left button is pressed
    if(e.button==0){
        if(selectedType!=='TC'){
            placingTC = false
            addPiece(curentMouse.x-2.5*scale,curentMouse.y,selectedType,e)
        }else if(selectedType == 'TC' && selectedTier){
            if(!placingTC) placingTC = []
            if(
                findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y)
                && 
                    (
                        placingTC.length==0 
                        || 
                        findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y).border !== placingTC[0]
                    )
                && 
                !shiftKeyPressed
                ){
                    placingTC.push(findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y).border)
            }
            else if(
                shiftKeyPressed
                ||
                !findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y)
                ||
                findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y).border == placingTC[0]
                ){
                    placingTC.push({'x':curentMouse.x,'y':curentMouse.y,'direction':((placingTC.length>0)?placingTC[0].direction+rotation:rotation)+180})
            }
            // console.log(placingTC)
            if(Math.sqrt(Math.pow(placingTC[1].x-placingTC[0].x,2)+Math.pow(placingTC[1].y-placingTC[0].y,2))>8*scale){
                let angleSE = Math.atan2((placingTC[1].y-placingTC[0].y),(placingTC[1].x-placingTC[0].x)) * 180 /Math.PI
                placingTC[1].x = placingTC[0].x+(8*scale*Math.cos(Math.PI * angleSE / 180))
                placingTC[1].y = placingTC[0].y+(8*scale*Math.sin(Math.PI * angleSE / 180))
            }
            if(placingTC.length==2){
                trenches['TC'][selectedTier].push(new TC(placingTC[0],placingTC[1],selectedType,selectedTier))
                placingTC = false
            }
        }
    }
    else if(e.button == 2){
        placingTC = false
    }
})
// when user rightclicks in the canvas
canvas.addEventListener("contextmenu",e=>{
    e.preventDefault();
    if(selectedType == 'BC'){
        curentOrgin++
        if(curentOrgin>3)curentOrgin = curentOrgin%3
    }else if(selectedType == 'TS'){
        curentOrgin++
        if(curentOrgin>2)curentOrgin = curentOrgin%2
    }
    else if(['BoB','BR','RG','MGG','ATG','HG'].includes(selectedType)){
        if(shiftKeyPressed){
            curentFacing+= -90
            if(curentFacing<0)curentFacing +=360
        }else{
            curentFacing+= 90
            if(curentFacing>359) curentFacing = curentFacing%360
        }
    }
})
// misc eventlistener
document.getElementById("inc").addEventListener('click',e=>{
    if(selectedGroup > bunkerGroupes.length+2) return
    selectedGroup++
    updateselectegroup()
})
document.getElementById("dec").addEventListener('click',e=>{
    if(selectedGroup <1) return
    selectedGroup--
    updateselectegroup()
})
function updateselectegroup(){
    //console.log(selectedGroup)
    if(selectedGroup < bunkerGroupes.length){
        document.getElementById("selectedGroup").innerText = `${selectedGroup+1}`
    }else if( selectedGroup == bunkerGroupes.length){
        document.getElementById("selectedGroup").innerText = "all trench"
    }else if( selectedGroup == bunkerGroupes.length+1){
        document.getElementById("selectedGroup").innerText = "all bunkers"
    }else if( selectedGroup == bunkerGroupes.length+2){
        document.getElementById("selectedGroup").innerText = "all items"
    }
}


function getMousePos(canvas, evt) {
    (evt.shiftKey)?shiftKeyPressed = true :shiftKeyPressed = false
    if(mouseInCanvas == false){
        curentMouse.x=null,curentMouse.y=null
    }else{
        let rect = canvas.getBoundingClientRect();
            curentMouse.x = Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width)
            curentMouse.y = Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
            document.getElementById("mouse").innerText = `X : ${curentMouse.x} , Y : ${curentMouse.y}`
    }

}

function findClosestAttachableBorderToPosition(x,y){
    let closest = 5*scale*3
    let closestAttachableBorderToPosition = undefined
    for(let group in bunkerGroupes){
        for(let item in bunkerGroupes[group].BBpieces){
            for(let tier = 0;tier<=2;tier++){
                if(bunkerGroupes[group].BBpieces[item][tier] !== null){
                    for(let p = 0;p<bunkerGroupes[group].BBpieces[item][tier].length;p++){
                        let piece = bunkerGroupes[group].BBpieces[item][tier][p]
                        let closestBorderOnPiece = getClosesetBorderOnPiece(piece,x,y)
                        if(closestBorderOnPiece[0] < closest) {
                            closest = closestBorderOnPiece[0]
                            closestAttachableBorderToPosition = {
                                'border':piece[closestBorderOnPiece[1]],
                                'group':group,
                            }
                        }else{
                        }
                    }
                }
            }
        }
    }
    for(let item in trenches){
        for(let tier = 0;tier<=2;tier++){
            if(trenches[item][tier] !== null){
                for(let p = 0;p<trenches[item][tier].length;p++){
                    let piece = trenches[item][tier][p]
                    let closestBorderOnPiece = getClosesetBorderOnPiece(piece,x,y)
                    if(closestBorderOnPiece[0] < closest) {
                        closest = closestBorderOnPiece[0]
                        closestAttachableBorderToPosition = {
                            'border':piece[closestBorderOnPiece[1]],
                            'group':'trenches',
                        }
                    }else{
                    }
                }
            }
        }
    }
    if(closest == 5*scale*3) closestAttachableBorderToPosition = undefined
    
    return closestAttachableBorderToPosition
}
function getClosesetBorderOnPiece(piece,x,y){
    let closest = 5*scale*3
    let border = ''
    for(let ap = 1;ap < 8;ap++){
        if(!piece[`ap${ap}`]) continue
        if(Math.abs(piece[`ap${ap}`].x-x)+Math.abs(piece[`ap${ap}`].y-y) < closest){
            closest = Math.abs(piece[`ap${ap}`].x-x)+Math.abs(piece[`ap${ap}`].y-y)
            border = `ap${ap}`
        }
    }
    return [closest,border]
}
function findClosestBunkerPieceToPosition(x,y){
    let closest = 6*scale*3
    let closestBunkerPieceToPosition = undefined
    for(let group in bunkerGroupes){        
        for(let type in bunkerGroupes[group].BBpieces){
            for(let tier = 0;tier<=2;tier++){
                if(bunkerGroupes[group].BBpieces[type][tier] !== null){
                    for(let p = 0;p<bunkerGroupes[group].BBpieces[type][tier].length;p++){
                        let piece = bunkerGroupes[group].BBpieces[type][tier][p]
                        if(Math.abs(piece.center[0]-x)+Math.abs(piece.center[1]-y)<closest){
                            closest = Math.abs(piece.center[0]-x)+Math.abs(piece.center[1]-y)
                            closestBunkerPieceToPosition = {
                                'group':group,
                                'type':type,
                                'tier':tier,
                                'piece':p,
                            }
                        }
                    }
                }
            }
        }
    }
    for(let type in trenches){
        for(let tier = 0;tier<=2;tier++){
            if(trenches[type][tier] !== null){
                for(let p = 0;p<trenches[type][tier].length;p++){
                    let piece = trenches[type][tier][p]
                    if(Math.abs(piece.center[0]-x)+Math.abs(piece.center[1]-y)<closest){
                        closest = Math.abs(piece.center[0]-x)+Math.abs(piece.center[1]-y)
                        closestBunkerPieceToPosition = {
                            'group':'trenches',
                            'type':type,
                            'tier':tier,
                            'piece':p,
                        }
                    }
                }
            }
        }
    }
    if(closest == 5*scale*3) closestBunkerPieceToPosition = undefined
    return closestBunkerPieceToPosition
}



// var canvasLoop = setInterval(newUpdateCanvas,200)

function newUpdateCanvas(){
    // set canvas size and scale
   // scale = document.getElementById('zoom').value
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height

    // console.log(canvas.width,canvas.height)
    // console.log(canvasViewOffsetX,canvasViewOffsetY)
    selectedType = document.querySelector('input[name="type"]:checked')?.value
    ctx.curentOrgin
    // clear canvas
    ctx.restore()
    ctx.clearRect(0,0,canvasTotalFieldWidthInput.value,canvasTotalFieldHeightInput.value)
    ctx.save()
    // lock tiers unavailible to seleceted type
    checkAvailibleTiers()
    // draw all pieces
    drawAllPieces()
    // draw preview peiece
    drawPreviewPiece()
    // draw all enabled garison ranges
    drawSelectedGarisonRanges()
    // draw trenches overtop of arcs
    drawAllTrenches()
    // highlight closest piece for deletion
    if (selectedType == "Delete" && findClosestBunkerPieceToPosition(curentMouse.x,curentMouse.y) !== undefined){
        let closestToMouseBunkerPiece = findClosestBunkerPieceToPosition(curentMouse.x,curentMouse.y)
        if(closestToMouseBunkerPiece.group == 'trenches'){
            trenches[closestToMouseBunkerPiece.type][closestToMouseBunkerPiece.tier][closestToMouseBunkerPiece.piece]?.highlight("#F00")
        }else{
            bunkerGroupes[closestToMouseBunkerPiece.group].BBpieces[closestToMouseBunkerPiece.type][closestToMouseBunkerPiece.tier][closestToMouseBunkerPiece.piece]?.highlight("#F00")

        }
    } 
    // toggle ai range arc
    if(document.getElementById('AIRangeToggle').checked){
        bunkerGroupes.forEach(group=>{
            group.BBpieces.BoB.forEach(tier=>{
                if(tier!==null){
                    tier.forEach(piece=>{
                        piece.drawRange(80)
                    })
                }
            })
        })
    }
    // update stat display
    updateselectegroup()
    updatePartCounts()
    placeLock = false
    if(BGHighlightBool) highlightSelectedBunkerGroup()
    

    //  ctx.translate(canvasViewOffsetX,canvasViewOffsetY)
    window.requestAnimationFrame(newUpdateCanvas)
}
// update canvas related functions
function checkAvailibleTiers(){
    if(selectedType!==undefined && selectedType !== 'Delete'){
        if(['BoB','BS','BC','BR','RG','MGG','TS','TO','TC'].includes(selectedType)){
            document.getElementById("T1").disabled = false
        }else{
            document.getElementById("T1").disabled = true
            if(selectedTier == 0){
                selectedTier = undefined
                document.querySelector('input[name="tier"]:checked').checked = false
            }
        }
        if(['BoB','BS','BC','BR','RG','MGG','EB','OB','ATG','TS','TO','TC'].includes(selectedType)){
            document.getElementById("T2").disabled = false
        }else{
            document.getElementById("T2").disabled = true
            if(selectedTier == 1){
                selectedTier = undefined
                document.querySelector('input[name="tier"]:checked').checked = false
            }
        }
        if(['BoB','BS','BC','BR','RG','MGG','EB','OB','HG','AB','IC','SC','ATG','TS','TO','TC'].includes(selectedType)){
            document.getElementById("T3").disabled = false
        }else{
            document.getElementById("T3").disabled = true
            if(selectedTier == 2){
                selectedTier = undefined
                document.querySelector('input[name="tier"]:checked').checked = false
            }
        }
        selectedTier = document.querySelector('input[name="tier"]:checked')?.value
    }
}
function drawAllPieces(){
    bunkerGroupes.forEach(group=>{
        for(let type in group.BBpieces){
            type = group.BBpieces[type]
            type.forEach(tier=>{
                if(tier !== null){
                    tier.forEach(piece=>{
                        piece.draw()
                        if(piece.type=='BoB'){
                            piece.RampExtention.draw()
                        }
                    })
                }
            })
        }
    })
}
function drawPreviewPiece(){
    let preview
    // if adding piece to bunker group
    if(
        (
            findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y) !== undefined 
            // ||
            // findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y).group !== 'trenches' 
        )
        && 
        selectedType !== "Delete" 
        && 
        selectedType !== 'TC'
        && 
        !shiftKeyPressed
    ){
        let closestAttachableBorderToMouse = findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y)
        preview = getPiece(closestAttachableBorderToMouse.border.x,closestAttachableBorderToMouse.border.y,closestAttachableBorderToMouse.border.direction)
        if(preview.drawRange) preview.drawRange(15)
        if(preview.RampExtention) {
            preview.RampExtention.draw()
            preview.RampExtention.drawDetails()
        }
        preview.draw()
    }
    //if adding new group
    else if(
        selectedType!==undefined 
        && 
        selectedType !== "Delete" 
        && 
        selectedType !== 'TC' 
        && 
        selectedTier!==undefined 
        && 
        curentMouse.x !== null
    ){
        preview = getPiece(curentMouse.x-2.5*scale,curentMouse.y,rotation)
        if(preview.drawRange) preview.drawRange(preview.range*.2)
        if(preview.RampExtention) {
            preview.RampExtention.draw()
            preview.RampExtention.drawDetails()
        }
        preview.draw()
    }
    // if deleting piece
    else if (
        selectedType == "Delete" 
        && 
        findClosestBunkerPieceToPosition(curentMouse.x,curentMouse.y) !== undefined
    ){
        let closestToMouseBunkerPiece = findClosestBunkerPieceToPosition(curentMouse.x,curentMouse.y)
        //console.log(closestToMouseBunkerPiece)
        if(closestToMouseBunkerPiece.group == 'trenches'){
            // console.log("higlilght threcnh")
            trenches[closestToMouseBunkerPiece.type][closestToMouseBunkerPiece.tier][closestToMouseBunkerPiece.piece]?.highlight("#F00")
        }else{
            bunkerGroupes[closestToMouseBunkerPiece.group].BBpieces[closestToMouseBunkerPiece.type][closestToMouseBunkerPiece.tier][closestToMouseBunkerPiece.piece]?.highlight("#F00")
        }
    }
    // if adding a trench conector
    else if(
        selectedType == 'TC'
    ){ 
        // if start is set
        if(placingTC.length==1 ){
            let endTarget
            //if placing loose end
            if(
                shiftKeyPressed 
                || 
                (
                    findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y) == undefined 
                    || 
                    findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y).border == placingTC[0]
                )
            ){
                endTarget = {'x':curentMouse.x,'y':curentMouse.y,'direction':placingTC[0].direction+rotation+180}
                //console.log("without target")
            }
            // if adding fixed end
            else if(findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y).border !== placingTC[0]){
                endTarget = findClosestAttachableBorderToPosition(curentMouse.x,curentMouse.y).border
                //console.log("with target")
            }
            //limit length of piece
            if(Math.sqrt(Math.pow(endTarget.x-placingTC[0].x,2)+Math.pow(endTarget.y-placingTC[0].y,2))>8*scale){
                let angleSE = Math.atan2((endTarget.y-placingTC[0].y),(endTarget.x-placingTC[0].x)) * 180 /Math.PI  + 180 
                endTarget.x = placingTC[0].x-(8*scale*Math.cos(Math.PI * angleSE / 180))
                endTarget.y = placingTC[0].y-(8*scale*Math.sin(Math.PI * angleSE / 180))
            }
            preview = new TC(placingTC[0],endTarget,selectedType,selectedTier)
            preview.draw()

        }
    }
}
function drawSelectedGarisonRanges(){
    let garisons = ['RG','MGG','ATG']
    garisons.forEach(garison=>{
        if(document.getElementById(`${garison}RangeToggle`).checked){
            Array.from(document.getElementById(`${garison}RangeToggles`).children).forEach(child=>{child.hidden = false})
            let ranges = ['long','mid','short']
            ranges.forEach(range=>{
                if(document.getElementById(`${garison}${range}Toggle`).checked){
                    Array.from(document.getElementsByClassName(`${garison}${range}Hide`)).forEach(item=>{item.hidden=false})
                    if(document.getElementById("selectiveArcs").checked){
                        bunkerGroupes[selectedGroup].BBpieces[garison].forEach(tier=>{
                            if(tier== null) return
                            tier.forEach(piece=>{
                                piece.drawRange(document.getElementById(`${garison}${range}Range`).value)
                            })
                        })
                    }else{
                        bunkerGroupes.forEach(group=>{
                            group.BBpieces[garison].forEach(tier=>{
                                if(tier== null) return
                                tier.forEach(piece=>{
                                    piece.drawRange(document.getElementById(`${garison}${range}Range`).value)
                                })
                            })
                        })
                    }
                }else{
                    Array.from(document.getElementsByClassName(`${garison}${range}Hide`)).forEach(item=>{item.hidden=true})
                }
            })
        }else{
            Array.from(document.getElementById(`${garison}RangeToggles`).children).forEach(child=>{child.hidden = true})
        }
    })
    if(document.getElementById('HGRangeToggle').checked){
        if(document.getElementById("selectiveArcs").checked){
            bunkerGroupes[selectedGroup].BBpieces.HG.forEach(tier=>{
                if(tier== null) return
                tier.forEach(piece=>{
                    piece.drawRange(document.getElementById("HGRange").value)
                })
            })
        }else{
            bunkerGroupes.forEach(group=>{
                group.BBpieces.HG.forEach(tier=>{
                    if(tier== null) return
                    tier.forEach(piece=>{
                        piece.drawRange(document.getElementById(`HGRange`).value)
                    })
                })
            })
        }
    }
}
function drawAllTrenches(){
    for(let type in trenches){
        type = trenches[type]
        type.forEach(tier=>{
            tier.forEach(piece=>{
                piece.draw()
            })
        })
    }
}
function updatePartCounts(){
    // console.log('update')
    Array.from(document.getElementsByClassName('reset')).forEach(item=>{
        item.remove()
    })

    // console.log(selectedGroup)
    // console.log(bunkerGroupes.length)
    // update for single group
    if(selectedGroup < bunkerGroupes.length){
        // console.log('group single')
        for(type in bunkerGroupes[selectedGroup].BBpieces){
            if(!document.getElementById(`${type}-nameplate`)){
                let div = document.createElement('div')
                div.classList.add('c1')
                div.classList.add('reset')
                div.id = `${type}-nameplate`
                div.innerText = type
                document.getElementById('bbCount').appendChild(div)
            }
            if(bunkerGroupes[selectedGroup].BBpieces[type][0] !== null){
                if(!document.getElementById(`${type}-1`)){
                    let div = document.createElement('div')
                    div.classList.add('c2')
                    div.classList.add('reset')
                    div.id = `${type}-1`
                    document.getElementById('bbCount').appendChild(div)
                }
                document.getElementById(`${type}-1`).innerText = bunkerGroupes[selectedGroup].BBpieces[type][0].length
            }
            if(bunkerGroupes[selectedGroup].BBpieces[type][1] !== null){
                if(!document.getElementById(`${type}-2`)){
                    let div = document.createElement('div')
                    div.classList.add('c3')
                    div.classList.add('reset')
                    div.id = `${type}-2`
                    document.getElementById('bbCount').appendChild(div)
                }
                document.getElementById(`${type}-2`).innerText = bunkerGroupes[selectedGroup].BBpieces[type][1].length
            }
            if(bunkerGroupes[selectedGroup].BBpieces[type][2] !== null){
                if(!document.getElementById(`${type}-3`)){
                    let div = document.createElement('div')
                    div.classList.add('c4')
                    div.classList.add('reset')
                    div.id = `${type}-3`
                    document.getElementById('bbCount').appendChild(div)
                }
                document.getElementById(`${type}-3`).innerText = bunkerGroupes[selectedGroup].BBpieces[type][2].length
            }
        }
        document.getElementById("totalPieces").innerText = bunkerGroupes[selectedGroup].totalPieces
        document.getElementById("RawHP").innerText = bunkerGroupes[selectedGroup].totalHP
        document.getElementById("SIvalue").innerText = bunkerGroupes[selectedGroup].finalSI
        document.getElementById("TotalHP").innerText = bunkerGroupes[selectedGroup].eHP
        document.getElementById("RepairCost").innerText = bunkerGroupes[selectedGroup].totalRepairCost
        document.getElementById("EhpPerSwing").innerText = bunkerGroupes[selectedGroup].repairEffHP
        document.getElementById("PhpPerSwing").innerText = bunkerGroupes[selectedGroup].repairEffP
        document.getElementById("BCost").innerText = bunkerGroupes[selectedGroup].totalBcost
        document.getElementById("CCost").innerText = bunkerGroupes[selectedGroup].totalCcost
        document.getElementById("rotation").innerText = rotation
    }
    // update for all trenches
    else if(selectedGroup == bunkerGroupes.length){
        // console.log('trenches')
        for(type in trenches){
            if(!document.getElementById(`${type}-nameplate`)){
                let div = document.createElement('div')
                div.classList.add('c1')
                div.classList.add('reset')
                div.id = `${type}-nameplate`
                div.innerText = type
                document.getElementById('bbCount').appendChild(div)
            }
            if(trenches[type][0] !== null){
                if(!document.getElementById(`${type}-1`)){
                    let div = document.createElement('div')
                    div.classList.add('c2')
                    div.classList.add('reset')
                    div.id = `${type}-1`
                    document.getElementById('bbCount').appendChild(div)
                }
                document.getElementById(`${type}-1`).innerText = trenches[type][0].length
            }
            if(trenches[type][1] !== null){
                if(!document.getElementById(`${type}-2`)){
                    let div = document.createElement('div')
                    div.classList.add('c3')
                    div.classList.add('reset')
                    div.id = `${type}-2`
                    document.getElementById('bbCount').appendChild(div)
                }
                document.getElementById(`${type}-2`).innerText = trenches[type][1].length
            }
            if(trenches[type][2] !== null){
                if(!document.getElementById(`${type}-3`)){
                    let div = document.createElement('div')
                    div.classList.add('c4')
                    div.classList.add('reset')
                    div.id = `${type}-3`
                    document.getElementById('bbCount').appendChild(div)
                }
                document.getElementById(`${type}-3`).innerText = trenches[type][2].length
            }
        }
        document.getElementById("totalPieces").innerText = /*trenches.totalPieces */ 'WIP'
        document.getElementById("RawHP").innerText = /*trenches.totalHP*/ 'WIP'
        document.getElementById("SIvalue").innerText = 'N.A.'
        document.getElementById("TotalHP").innerText = 'N.A.'
        document.getElementById("RepairCost").innerText = /*bunkerGroupes[selectedGroup].totalRepairCost*/ 'WIP'
        document.getElementById("EhpPerSwing").innerText = 'N.A.'
        document.getElementById("PhpPerSwing").innerText = 'N.A.'
        document.getElementById("BCost").innerText = /*bunkerGroupes[selectedGroup].totalBcost*/ 'WIP'
        document.getElementById("CCost").innerText = /*bunkerGroupes[selectedGroup].totalCcost*/ 'WIP'
        document.getElementById("rotation").innerText = rotation
    }
    //update for all bunkers
    else if(selectedGroup == bunkerGroupes.length+1){
        // reset all values
        document.getElementById("totalPieces").innerText = 0
        document.getElementById("RawHP").innerText = 0
        document.getElementById("SIvalue").innerText = 0
        document.getElementById("TotalHP").innerText = 0
        document.getElementById("RepairCost").innerText = 0
        document.getElementById("EhpPerSwing").innerText = 0
        document.getElementById("PhpPerSwing").innerText = 0
        document.getElementById("BCost").innerText = 0
        document.getElementById("CCost").innerText = 0
        //loop for all bunker groupes
        // console.log('group all')
        bunkerGroupes.forEach(group=>{
            for(type in group.BBpieces){
                if(!document.getElementById(`${type}-nameplate`)){
                    let div = document.createElement('div')
                    div.classList.add('c1')
                    div.classList.add('reset')
                    div.id = `${type}-nameplate`
                    div.innerText = type
                    document.getElementById('bbCount').appendChild(div)
                }
                if(group.BBpieces[type][0] !== null){
                    if(!document.getElementById(`${type}-1`)){
                        let div = document.createElement('div')
                        div.classList.add('c2')
                        div.classList.add('reset')
                        div.id = `${type}-1`
                        document.getElementById('bbCount').appendChild(div)
                    }
                    let curentvalue
                    if(!isNaN(parseInt(document.getElementById(`${type}-1`).innerText))){
                        curentvalue = parseInt(document.getElementById(`${type}-1`).innerText)
                    }else{
                        curentvalue = 0
                    }
                    document.getElementById(`${type}-1`).innerText = curentvalue + group.BBpieces[type][0].length
                }
                if(group.BBpieces[type][1] !== null){
                    if(!document.getElementById(`${type}-2`)){
                        let div = document.createElement('div')
                        div.classList.add('c3')
                        div.classList.add('reset')
                        div.id = `${type}-2`
                        document.getElementById('bbCount').appendChild(div)
                    }
                    let curentvalue
                    if(!isNaN(parseInt(document.getElementById(`${type}-2`).innerText))){
                        curentvalue = parseInt(document.getElementById(`${type}-2`).innerText)
                    }else{
                        curentvalue = 0
                    }
                    document.getElementById(`${type}-2`).innerText = curentvalue + group.BBpieces[type][1].length
                }
                if(group.BBpieces[type][2] !== null){
                    if(!document.getElementById(`${type}-3`)){
                        let div = document.createElement('div')
                        div.classList.add('c4')
                        div.classList.add('reset')
                        div.id = `${type}-3`
                        document.getElementById('bbCount').appendChild(div)
                    }
                    let curentvalue
                    if(!isNaN(parseInt(document.getElementById(`${type}-3`).innerText))){
                        curentvalue = parseInt(document.getElementById(`${type}-3`).innerText)
                    }else{
                        curentvalue = 0
                    }
                    document.getElementById(`${type}-3`).innerText = curentvalue + group.BBpieces[type][2].length
                }
            }
            //update stat values to include curent groups values
            document.getElementById("totalPieces").innerText = parseInt(document.getElementById("totalPieces").innerText) + group.totalPieces
            document.getElementById("RawHP").innerText =  parseInt(document.getElementById("RawHP").innerText) + group.totalHP
            document.getElementById("SIvalue").innerText = parseFloat(document.getElementById("SIvalue").innerText) + group.finalSI
            document.getElementById("TotalHP").innerText = parseFloat(document.getElementById("TotalHP").innerText) + group.eHP
            document.getElementById("RepairCost").innerText = parseInt(document.getElementById("RepairCost").innerText) + group.totalRepairCost
            document.getElementById("EhpPerSwing").innerText = parseFloat(document.getElementById("EhpPerSwing").innerText) + group.repairEffHP
            document.getElementById("PhpPerSwing").innerText = parseFloat(document.getElementById("PhpPerSwing").innerText) + group.repairEffP
            document.getElementById("BCost").innerText = parseInt(document.getElementById("BCost").innerText) + group.totalBcost
            document.getElementById("CCost").innerText = parseInt(document.getElementById("CCost").innerText) + group.totalCcost
        })
        document.getElementById("SIvalue").innerText = `~ ${parseFloat(document.getElementById("SIvalue").innerText) / bunkerGroupes.length}`
        document.getElementById("PhpPerSwing").innerText = `~ ${parseFloat(document.getElementById("PhpPerSwing").innerText) / bunkerGroupes.length}%`
        document.getElementById("EhpPerSwing").innerText = `~ ${parseFloat(document.getElementById("EhpPerSwing").innerText) / bunkerGroupes.length}`
        document.getElementById("rotation").innerText = rotation
    }
    //update for all pieces
    else if(selectedGroup == bunkerGroupes.length+2){
        // reset all values
        document.getElementById("totalPieces").innerText = 0
        document.getElementById("RawHP").innerText = 0
        document.getElementById("SIvalue").innerText = 0
        document.getElementById("TotalHP").innerText = 0
        document.getElementById("RepairCost").innerText = 0
        document.getElementById("EhpPerSwing").innerText = 0
        document.getElementById("PhpPerSwing").innerText = 0
        document.getElementById("BCost").innerText = 0
        document.getElementById("CCost").innerText = 0
        // console.log('show all')
        //loop for trenches
        for(type in trenches){
            if(!document.getElementById(`${type}-1`)){
                let div = document.createElement('div')
                div.classList.add('c1')
                div.classList.add('reset')
                div.innerText = type
                document.getElementById('bbCount').appendChild(div)
            }
            if(trenches[type][0] !== null){
                if(!document.getElementById(`${type}-1`)){
                    let div = document.createElement('div')
                    div.classList.add('c2')
                    div.classList.add('reset')
                    div.id = `${type}-1`
                    document.getElementById('bbCount').appendChild(div)
                }
                document.getElementById(`${type}-1`).innerText = trenches[type][0].length
            }
            if(trenches[type][1] !== null){
                if(!document.getElementById(`${type}-2`)){
                    let div = document.createElement('div')
                    div.classList.add('c3')
                    div.classList.add('reset')
                    div.id = `${type}-2`
                    document.getElementById('bbCount').appendChild(div)
                }
                document.getElementById(`${type}-2`).innerText = trenches[type][1].length
            }
            if(trenches[type][2] !== null){
                if(!document.getElementById(`${type}-3`)){
                    let div = document.createElement('div')
                    div.classList.add('c4')
                    div.classList.add('reset')
                    div.id = `${type}-3`
                    document.getElementById('bbCount').appendChild(div)
                }
                document.getElementById(`${type}-3`).innerText = trenches[type][2].length
            }
        }
        // loop for bunker groups
        bunkerGroupes.forEach(group=>{
            for(type in group.BBpieces){
                if(!document.getElementById(`${type}-nameplate`)){
                    let div = document.createElement('div')
                    div.classList.add('c1')
                    div.classList.add('reset')
                    div.id = `${type}-nameplate`
                    div.innerText = type
                    document.getElementById('bbCount').appendChild(div)
                }
                if(group.BBpieces[type][0] !== null){
                    if(!document.getElementById(`${type}-1`)){
                        let div = document.createElement('div')
                        div.classList.add('c2')
                        div.classList.add('reset')
                        div.id = `${type}-1`
                        document.getElementById('bbCount').appendChild(div)
                    }
                    let curentvalue
                    if(!isNaN(parseInt(document.getElementById(`${type}-1`).innerText))){
                        curentvalue = parseInt(document.getElementById(`${type}-1`).innerText)
                    }else{
                        curentvalue = 0
                    }
                    document.getElementById(`${type}-1`).innerText = curentvalue + group.BBpieces[type][0].length
                }
                if(group.BBpieces[type][1] !== null){
                    if(!document.getElementById(`${type}-2`)){
                        let div = document.createElement('div')
                        div.classList.add('c3')
                        div.classList.add('reset')
                        div.id = `${type}-2`
                        document.getElementById('bbCount').appendChild(div)
                    }
                    let curentvalue
                    if(!isNaN(parseInt(document.getElementById(`${type}-2`).innerText))){
                        curentvalue = parseInt(document.getElementById(`${type}-2`).innerText)
                    }else{
                        curentvalue = 0
                    }
                    document.getElementById(`${type}-2`).innerText = curentvalue + group.BBpieces[type][1].length
                }
                if(group.BBpieces[type][2] !== null){
                    if(!document.getElementById(`${type}-3`)){
                        let div = document.createElement('div')
                        div.classList.add('c4')
                        div.classList.add('reset')
                        div.id = `${type}-3`
                        document.getElementById('bbCount').appendChild(div)
                    }
                    let curentvalue
                    if(!isNaN(parseInt(document.getElementById(`${type}-3`).innerText))){
                        curentvalue = parseInt(document.getElementById(`${type}-3`).innerText)
                    }else{
                        curentvalue = 0
                    }
                    document.getElementById(`${type}-3`).innerText = curentvalue + group.BBpieces[type][2].length
                }
            }
            //update stat values to include curent groups values
            document.getElementById("totalPieces").innerText = parseInt(document.getElementById("totalPieces").innerText) + group.totalPieces
            document.getElementById("RawHP").innerText =  parseInt(document.getElementById("RawHP").innerText) + group.totalHP
            document.getElementById("SIvalue").innerText = parseFloat(document.getElementById("SIvalue").innerText) + group.finalSI
            document.getElementById("TotalHP").innerText = parseFloat(document.getElementById("TotalHP").innerText) + group.eHP
            document.getElementById("RepairCost").innerText = parseInt(document.getElementById("RepairCost").innerText) + group.totalRepairCost
            document.getElementById("EhpPerSwing").innerText = parseFloat(document.getElementById("EhpPerSwing").innerText) + group.repairEffHP
            document.getElementById("PhpPerSwing").innerText = parseFloat(document.getElementById("PhpPerSwing").innerText) + group.repairEffP
            document.getElementById("BCost").innerText = parseInt(document.getElementById("BCost").innerText) + group.totalBcost
            document.getElementById("CCost").innerText = parseInt(document.getElementById("CCost").innerText) + group.totalCcost
        })
        document.getElementById("SIvalue").innerText = `~ ${parseFloat(document.getElementById("SIvalue").innerText) / bunkerGroupes.length}`
        document.getElementById("PhpPerSwing").innerText = `~ ${parseFloat(document.getElementById("PhpPerSwing").innerText) / bunkerGroupes.length}%`
        document.getElementById("EhpPerSwing").innerText = `~ ${parseFloat(document.getElementById("EhpPerSwing").innerText) / bunkerGroupes.length}`
        document.getElementById("rotation").innerText = rotation
    }
}

