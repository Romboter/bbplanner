// bunker group class
class BunkerGroup{
    constructor(){
        // bunker pieces
        this.BBpieces = {
            'BoB':   [[]     ,[]     ,[]],
            'BS':    [[]     ,[]     ,[]],
            'BC':    [[]     ,[]     ,[]],
            'BR':    [[]     ,[]     ,[]],
            'RG':    [[]     ,[]     ,[]],
            'MGG':   [[]     ,[]     ,[]],
            'OB':    [null   ,[]     ,[]],
            'EB':    [null   ,[]     ,[]],
            'ATG':   [null   ,[]     ,[]],
            'HG':    [null   ,null   ,[]],
            'AB':    [null   ,null   ,[]],
            'IC':    [null   ,null   ,[]],
            'SC':    [null   ,null   ,[]],
        }
        // additive stats
        this.totalPieces
        this.totalHP
        this.totalRepairCost
        this.totalBcost
        this.totalCcost
        // SI reletaive stats
        this.finalSI
        this.repairEffHP
        this.tepairEffP
        this.eHP
        // area stats
        this.maxX
        this.minX
        this.maxY
        this.minY
        this.surfaceHP
    }
    calculateStats(){
        this.totalPieces = 0
        this.totalHP = 0
        this.totalBcost = 0
        this.totalCcost = 0
        this.totalRepairCost = 0
        this.finalSI = 1
        for(let type in this.BBpieces){
            this.BBpieces[type].forEach(tier=>{
                //console.log(tier)
                if(tier){
                    tier.forEach(piece=>{
                        this.totalPieces ++
                        this.totalHP += piece.hp
                        this.totalRepairCost+= piece.rCost
                        this.totalBcost += piece.buildTb
                        this.totalCcost += piece.buildTc
                        if(piece.p1[0]<this.minX)this.minX=piece.p1[0]
                        if(piece.p1[0]>this.maxX)this.maxX=piece.p1[0]
                        if(piece.p1[1]<this.minY)this.minY=piece.p1[1]
                        if(piece.p1[1]>this.maxY)this.maxY=piece.p1[1]
                        if(piece.p2[0]<this.minX)this.minX=piece.p2[0]
                        if(piece.p2[0]>this.maxX)this.maxX=piece.p2[0]
                        if(piece.p2[1]<this.minY)this.minY=piece.p2[1]
                        if(piece.p2[1]>this.maxY)this.maxY=piece.p2[1]
                        if(piece.p3[0]<this.minX)this.minX=piece.p3[0]
                        if(piece.p3[0]>this.maxX)this.maxX=piece.p3[0]
                        if(piece.p3[1]<this.minY)this.minY=piece.p3[1]
                        if(piece.p3[1]>this.maxY)this.maxY=piece.p3[1]
                        if(piece.p4[0]<this.minX)this.minX=piece.p4[0]
                        if(piece.p4[0]>this.maxX)this.maxX=piece.p4[0]
                        if(piece.p4[1]<this.minY)this.minY=piece.p4[1]
                        if(piece.p4[1]>this.maxY)this.maxY=piece.p4[1]
                        if(piece.type == "BC"){
                            if(piece.p5[0]<this.minX)this.minX=piece.p5[0]
                            if(piece.p5[0]>this.maxX)this.maxX=piece.p5[0]
                            if(piece.p5[1]<this.minY)this.minY=piece.p5[1]
                            if(piece.p5[1]>this.maxY)this.maxY=piece.p5[1]
                        }
                    })
                }
                if(tier && tier[0]){
                    this.finalSI = this.finalSI*Math.pow(tier[0].si,tier.length)
                }
            })
        }
        if(this.totalPieces<2) this.finalSI = 1
        this.repairEffHP = Math.round((this.totalHP*this.finalSI)/this.totalRepairCost*100)/100 
        this.repairEffP = Math.round(this.totalHP / this.totalRepairCost / this.totalHP * 1000000)/10000
        this.eHP = Math.round(this.totalHP*this.finalSI *100)/100
        this.finalSI = Math.round(this.finalSI*10000)/10000
        this.surfaceHP = Math.round(this.eHP / ((this.maxX - this.minX) * (this.maxY - this.minY)) * 10000 ) / 10000
    }
    highlightBunkerGroup(){
        for(let type in this.BBpieces){
            for(let tier in this.BBpieces[type]){
                for(let piece in this.BBpieces[type][tier]){
                    this.BBpieces[type][tier][piece].highlight('#F00')
                }
            }
        }
    }
}

// basic bunker classes
class BC{
    constructor(origin,ox,oy,direction,type,tier){
        this.start = this.calcStartOffset([ox,oy],direction)
        if(origin == 1){
            this.p3 = this.calcHalfLong(this.start,direction-90)
            this.p4 = this.calcLong(this.p3,direction)
            this.ap2 = {'x':this.p3[0]+(this.p4[0]-this.p3[0])/2,'y':this.p3[1]+(this.p4[1]-this.p3[1])/2,'direction':(360+direction-90)%360}
            this.p5 = this.calcshort(this.p4,direction+90)
            this.p1 = this.calcLong(this.p5,direction+135)
            this.ap3 = {'x':this.p5[0]+(this.p1[0]-this.p5[0])/2,'y':this.p5[1]+(this.p1[1]-this.p5[1])/2,'direction':(360+direction+45)%360}
            this.p2 = this.calcshort(this.p1,direction+180)
            this.ap1 = {'x':this.p2[0]+(this.p3[0]-this.p2[0])/2,'y':this.p2[1]+(this.p3[1]-this.p2[1])/2,'direction':(360+direction+180)%360}
        }else if(origin == 2){
            this.p4 = this.calcHalfLong(this.start,direction-90)
            this.p5 = this.calcshort(this.p4,direction)
            this.p1 = this.calcLong(this.p5,direction+45)
            this.ap3 = {'x':this.p5[0]+(this.p1[0]-this.p5[0])/2,'y':this.p5[1]+(this.p1[1]-this.p5[1])/2,'direction':(360+direction-45)%360}
            this.p2 = this.calcshort(this.p1,direction+90)
            this.p3 = this.calcLong(this.p2,direction+180)
            this.ap1 = {'x':this.p2[0]+(this.p3[0]-this.p2[0])/2,'y':this.p2[1]+(this.p3[1]-this.p2[1])/2,'direction':(360+direction+90)%360}
            this.ap2 = {'x':this.p3[0]+(this.p4[0]-this.p3[0])/2,'y':this.p3[1]+(this.p4[1]-this.p3[1])/2,'direction':(360+direction+180)%360}
        }else{
            this.p1 = this.calcHalfLong(this.start,direction-90)
            this.p2 = this.calcshort(this.p1,direction-45)
            this.p3 = this.calcLong(this.p2,direction+45)
            this.ap1 = {'x':this.p2[0]+(this.p3[0]-this.p2[0])/2,'y':this.p2[1]+(this.p3[1]-this.p2[1])/2,'direction':(360+direction-45)%360}
            this.p4 = this.calcLong(this.p3,direction+135)
            this.ap2 = {'x':this.p3[0]+(this.p4[0]-this.p3[0])/2,'y':this.p3[1]+(this.p4[1]-this.p3[1])/2,'direction':(360+direction+45)%360}
            this.p5 = this.calcshort(this.p4,direction+225)
            this.ap3 = {'x':this.p5[0]+(this.p1[0]-this.p5[0])/2,'y':this.p5[1]+(this.p1[1]-this.p5[1])/2,'direction':(360+direction+180)%360}
        }
        this.type = type
        this.tier = tier
        if(tier == 0){
            this.hp = 1500
            this.si = 0.85
            this.rCost = 75
            this.buildTb = 0
            this.buildTc = 0 
        }else if (tier == 1){
            this.hp = 1850
            this.si = 0.95
            this.rCost = 75
            this.buildTb = 75
            this.buildTc = 0 
        }else if(tier == 2){
            this.hp = 2000
            this.si = 0.99
            this.rCost = 120
            this.buildTb = 75
            this.buildTc = 30
        }
        this.center = [(this.p1[0]+this.p2[0]+this.p3[0]+this.p4[0]+this.p5[0])/5,(this.p1[1]+this.p2[1]+this.p3[1]+this.p4[1]+this.p5[1])/5]
    }
    calcStartOffset(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * 0.25 * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * 0.25 * scale;
        return out
    }
    calcLong(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * 5 * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * 5 * scale;
        return out
    }
    calcHalfLong(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * 2.5 * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * 2.5 * scale;
        return out
    }
    calcshort(cur,angle){
        var out = [0,0]
        length = Math.sqrt(Math.pow((Math.sqrt(50)-5)/2,2)*2)
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * length * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * length * scale;
        return out
    }
    draw(lockColor){
        /** @type {CanvasRenderingContext2D} */
        ctx.beginPath()
        ctx.lineWidth = 0.5*scale
        ctx.moveTo(this.p1[0],this.p1[1])
        ctx.lineTo(this.p2[0],this.p2[1])
        ctx.lineTo(this.p3[0],this.p3[1])
        ctx.lineTo(this.p4[0],this.p4[1])
        ctx.lineTo(this.p5[0],this.p5[1])
        ctx.closePath()
        if(this.tier==0 && !lockColor){
            ctx.strokeStyle = "#32a852"
        }else if(this.tier==1 && !lockColor){
            ctx.strokeStyle = "#916c3c"
        }else if(this.tier == 2 && !lockColor){
            ctx.strokeStyle = "#949494"
        }else if(!lockColor){
            ctx.strokeStyle = "#000"
            //console.log("invalid tier on black colored piece")
        }
        ctx.stroke()
        ctx.strokeStyle = "#000"
        ctx.fillStyle = "#fff"
        ctx.fill()
        ctx.lineWidth = 1
        
    }
    highlight(color){
        ctx.lineWidth = 0.5*scale
        ctx.strokeStyle = color
        this.draw(true)
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
    }
}
class BS{
    constructor(ox,oy,direction,type,tier){
        this.start = this.calcStartOffset([ox,oy],direction)
        this.p1 = this.calcHalfLong(this.start,direction-90)
        this.p2 = this.calcLong(this.p1,direction)
        this.ap1= {'x':this.p1[0]+(this.p2[0]-this.p1[0])/2,'y':this.p1[1]+(this.p2[1]-this.p1[1])/2,'direction':(360+direction-90)%360}
        this.p3 = this.calcLong(this.p2,direction+90)
        this.ap2= {'x':this.p2[0]+(this.p3[0]-this.p2[0])/2,'y':this.p2[1]+(this.p3[1]-this.p2[1])/2,'direction':(360+direction)%360}
        this.p4 = this.calcLong(this.p3,direction+180)
        this.ap3= {'x':this.p3[0]+(this.p4[0]-this.p3[0])/2,'y':this.p3[1]+(this.p4[1]-this.p3[1])/2,'direction':(360+direction+90)%360}
        this.ap4= {'x':this.p4[0]+(this.p1[0]-this.p4[0])/2,'y':this.p4[1]+(this.p1[1]-this.p4[1])/2,'direction':(360+direction+180)%360}
        this.type = type
        this.tier = tier
        this.center = [(this.p1[0]+this.p2[0]+this.p3[0]+this.p4[0])/4,(this.p1[1]+this.p2[1]+this.p3[1]+this.p4[1])/4]
        
        // tiers offset by -1 ie(0=1 1=2 2=3)
        if(tier == 0){
            this.hp = 1500
            this.si = 0.85
            this.rCost = 75
            this.buildTb = 0
            this.buildTc = 0 
        }else if (tier == 1){
            this.hp = 1850
            this.si = 0.95
            this.rCost = 75
            this.buildTb = 75
            this.buildTc = 0 
        }else if(tier == 2){
            this.hp = 2000
            this.si = 0.99
            this.rCost = 120
            this.buildTb = 75
            this.buildTc = 30
        }
    }
    calcStartOffset(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * 0.25 * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * 0.25 * scale;
        return out
    }
    calcLong(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * 5 * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * 5 * scale;
        return out
    }
    calcHalfLong(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * 2.5 * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * 2.5 * scale;
        return out
    }
    
    draw(lockColor){
        /** @type {CanvasRenderingContext2D} */
        ctx.beginPath()
        // console.log('draw BS')
        ctx.lineWidth = 0.5*scale
        ctx.moveTo(this.p1[0],this.p1[1])
        ctx.lineTo(this.p2[0],this.p2[1])
        ctx.lineTo(this.p3[0],this.p3[1])
        ctx.lineTo(this.p4[0],this.p4[1])
        ctx.closePath()
        if(this.tier==0 && !lockColor){
            ctx.strokeStyle = "#32a852"
        }else if(this.tier==1 && !lockColor){
            ctx.strokeStyle = "#916c3c"
        }else if(this.tier == 2 && !lockColor){
            ctx.strokeStyle = "#949494"
        }else if(!lockColor){
            ctx.strokeStyle = "#000"
            //console.log("invalid tier on black colored piece")
        }
        ctx.stroke()
        ctx.strokeStyle = "#000"
        ctx.fillStyle = "#fff"
        ctx.fill()
        ctx.lineWidth = 1
        if(this.drawDetails)this.drawDetails()
    }
    highlight(color){
        ctx.strokeStyle = color
        this.draw(true)
        ctx.strokeStyle = "#000"
    }
}
// bunker garison classes
class RG extends BS{
    constructor(ox,oy,direction,facing,type,tier){
        super(ox,oy,direction,type,tier)
        this.facing = direction+facing
        this.angleOfAttack = 360
        
        this.range = 50
        if(tier == 0){
            this.hp = 1500
            this.si = 0.65
            this.rCost = 50
            this.buildTb = 50
            this.buildTc = 0 
        }else if (tier == 1){
            this.hp = 1850
            this.si = 0.85
            this.rCost = 75
            this.buildTb = 125
            this.buildTc = 0 
        }else if(tier == 2){
            this.hp = 2250
            this.si = 0.96
            this.rCost = 120
            this.buildTb = 125
            this.buildTc = 30
        }
    }
    drawDetails(){
        ctx.font = `${2.5*scale}px Arial`;
        ctx.fillStyle = "#000"
        ctx.fillText("R",this.center[0] - ctx.measureText("R").width/2,this.center[1]+scale)
    }
    drawRange(range){
        let curentAngle = this.angleOfAttack/2 - this.angleOfAttack
        let nextAngle = curentAngle+1
        let curentAngleClosestIntercect = 1
        let nextAngleClosestIntersect = undefined
        //get the intersect for the initial curent angle
        for(let r = 2.5; r < range; r++){
            let targetPosition = [
                this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * r * scale,
                this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * r * scale
            ]
            let pieceAlongPathData = findClosestBunkerPieceToPosition(targetPosition[0],targetPosition[1])
            let pieceAlongPath = undefined
            if(pieceAlongPathData && pieceAlongPathData.group !== 'trenches'){
                pieceAlongPath = bunkerGroupes[pieceAlongPathData.group].BBpieces[pieceAlongPathData.type][pieceAlongPathData.tier][pieceAlongPathData.piece]
            }
            if(pieceAlongPath && ["BoB","RG","MMG","ATG","HG","SC","IC","OB"].includes(pieceAlongPath.type) && this !== pieceAlongPath){
                let intersectTest 
                for(let p = 0; p < 4; p ++){
                    intersectTest = intersects(
                        this.center[0],
                        this.center[1],
                        this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * range * scale,
                        this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * range * scale,
                        pieceAlongPath[`p${p % 4 + 1}`][0],
                        pieceAlongPath[`p${p % 4 + 1}`][1],
                        pieceAlongPath[`p${(p+1) % 4 + 1}`][0],
                        pieceAlongPath[`p${(p+1) % 4 + 1}`][1]
                    )
                    if(curentAngleClosestIntercect > intersectTest) curentAngleClosestIntercect = intersectTest
                }
            }
        }
        // get the inersect for all next angle's
        for(let i = 0; i < this.angleOfAttack;i++){
            if(nextAngleClosestIntersect !== undefined){
                curentAngle = nextAngle
                curentAngleClosestIntercect = nextAngleClosestIntersect
                nextAngle ++
            }
            nextAngleClosestIntersect = 1
            for(let r = 2.5; r < range; r++){
                let targetPosition = [
                    this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * r * scale,
                    this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * r * scale
                ]
                let pieceAlongPathData = findClosestBunkerPieceToPosition(targetPosition[0],targetPosition[1])
                let pieceAlongPath = undefined
                if(pieceAlongPathData && pieceAlongPathData.group !== 'trenches'){
                    pieceAlongPath = bunkerGroupes[pieceAlongPathData.group].BBpieces[pieceAlongPathData.type][pieceAlongPathData.tier][pieceAlongPathData.piece]
                }
                if(pieceAlongPath && ["BoB","RG","MGG","ATG","HG","SC","IC","OB"].includes(pieceAlongPath.type) && this !== pieceAlongPath){
                    let intersectTest 
                    for(let p = 0; p < 4; p ++){
                        intersectTest = intersects(
                            this.center[0],
                            this.center[1],
                            this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * range * scale,
                            this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * range * scale,
                            pieceAlongPath[`p${p % 4 + 1}`][0],
                            pieceAlongPath[`p${p % 4 + 1}`][1],
                            pieceAlongPath[`p${(p+1) % 4 + 1}`][0],
                            pieceAlongPath[`p${(p+1) % 4 + 1}`][1]
                        )
                        if(nextAngleClosestIntersect > intersectTest) nextAngleClosestIntersect = intersectTest
                    }
                }
            }
            ctx.fillStyle = "#0f06"
            ctx.beginPath()
            ctx.moveTo(this.center[0],this.center[1])
            ctx.lineTo(this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * range * curentAngleClosestIntercect * scale,
            this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * range * curentAngleClosestIntercect * scale)
            ctx.lineTo(this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * range * nextAngleClosestIntersect * scale,
            this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * range * nextAngleClosestIntersect * scale)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = "#000"
            ctx.globalCompositeOperation = 'destination-over';

        }
    }
}
class MGG extends BS{
    constructor(ox,oy,direction,facing,type,tier){
        super(ox,oy,direction,type,tier)
        this.facing = direction+facing
        this.angleOfAttack = 90
        
        this.range = 50
        
        if(tier == 0){
            this.hp = 1650
            this.si = 0.65
            this.rCost = 75
            this.buildTb = 75
            this.buildTc = 0
        }else if (tier == 1){
            this.hp = 2150
            this.si = 0.85
            this.rCost = 100
            this.buildTb = 175
            this.buildTc = 0 
        }else if(tier == 2){
            this.hp = 3000
            this.si = 0.96
            this.rCost = 120
            this.buildTb = 175
            this.buildTc = 30
        }
    }
    drawDetails(){
        ctx.font = `${2.5*scale}px Arial`;
        ctx.fillStyle = "#000"
        ctx.fillText("MG",this.center[0] - ctx.measureText("MG").width/2,this.center[1]+scale)
    }
    drawRange(range){
        let curentAngle = this.angleOfAttack/2 - this.angleOfAttack
        let nextAngle = curentAngle+1
        let curentAngleClosestIntercect = 1
        let nextAngleClosestIntersect = undefined
        //get the intersect for the initial curent angle
        for(let r = 2.5; r < range; r++){
            let targetPosition = [
                this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * r * scale,
                this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * r * scale
            ]
            let pieceAlongPathData = findClosestBunkerPieceToPosition(targetPosition[0],targetPosition[1])
            let pieceAlongPath = undefined
            if(pieceAlongPathData && pieceAlongPathData.group !== 'trenches'){
                pieceAlongPath = bunkerGroupes[pieceAlongPathData.group].BBpieces[pieceAlongPathData.type][pieceAlongPathData.tier][pieceAlongPathData.piece]
            }
            if(pieceAlongPath && ["BoB","RG","MMG","ATG","HG","SC","IC","OB"].includes(pieceAlongPath.type) && this !== pieceAlongPath){
                let intersectTest 
                for(let p = 0; p < 4; p ++){
                    intersectTest = intersects(
                        this.center[0],
                        this.center[1],
                        this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * range * scale,
                        this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * range * scale,
                        pieceAlongPath[`p${p % 4 + 1}`][0],
                        pieceAlongPath[`p${p % 4 + 1}`][1],
                        pieceAlongPath[`p${(p+1) % 4 + 1}`][0],
                        pieceAlongPath[`p${(p+1) % 4 + 1}`][1]
                    )
                    if(curentAngleClosestIntercect > intersectTest) curentAngleClosestIntercect = intersectTest
                }
            }
        }
        // get the inersect for all next angle's
        for(let i = 0; i < this.angleOfAttack;i++){
            if(nextAngleClosestIntersect !== undefined){
                curentAngle = nextAngle
                curentAngleClosestIntercect = nextAngleClosestIntersect
                nextAngle ++
            }
            nextAngleClosestIntersect = 1
            for(let r = 2.5; r < range; r++){
                let targetPosition = [
                    this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * r * scale,
                    this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * r * scale
                ]
                let pieceAlongPathData = findClosestBunkerPieceToPosition(targetPosition[0],targetPosition[1])
                let pieceAlongPath = undefined
                if(pieceAlongPathData && pieceAlongPathData.group !== 'trenches'){
                    pieceAlongPath = bunkerGroupes[pieceAlongPathData.group].BBpieces[pieceAlongPathData.type][pieceAlongPathData.tier][pieceAlongPathData.piece]
                }
                if(pieceAlongPath && ["BoB","RG","MGG","ATG","HG","SC","IC","OB"].includes(pieceAlongPath.type) && this !== pieceAlongPath){
                    let intersectTest 
                    for(let p = 0; p < 4; p ++){
                        intersectTest = intersects(
                            this.center[0],
                            this.center[1],
                            this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * range * scale,
                            this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * range * scale,
                            pieceAlongPath[`p${p % 4 + 1}`][0],
                            pieceAlongPath[`p${p % 4 + 1}`][1],
                            pieceAlongPath[`p${(p+1) % 4 + 1}`][0],
                            pieceAlongPath[`p${(p+1) % 4 + 1}`][1]
                        )
                        if(nextAngleClosestIntersect > intersectTest) nextAngleClosestIntersect = intersectTest
                    }
                }
            }
            ctx.fillStyle = "#ff06"
            ctx.beginPath()
            ctx.moveTo(this.center[0],this.center[1])
            ctx.lineTo(this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * range * curentAngleClosestIntercect * scale,
            this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * range * curentAngleClosestIntercect * scale)
            ctx.lineTo(this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * range * nextAngleClosestIntersect * scale,
            this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * range * nextAngleClosestIntersect * scale)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = "#000"
            ctx.globalCompositeOperation = 'destination-over';

        }
    }
}
class ATG extends BS{
    constructor(ox,oy,direction,facing,type,tier){
        super(ox,oy,direction,type,tier)
        this.facing = direction+facing
        this.angleOfAttack = 180
        this.range = 50
        if(tier == 0){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null
        }else if (tier == 1){
            this.hp = 1650
            this.si = 0.82
            this.rCost = 150
            this.buildTb = 225
            this.buildTc = 0
        }else if(tier == 2){
            this.hp = 1750
            this.si = 0.93
            this.rCost = 170
            this.buildTb = 225
            this.buildTc = 40
        }
    }
    drawDetails(){
        ctx.font = `${2.5*scale}px Arial`;
        ctx.fillStyle = "#000"
        ctx.fillText("AT",this.center[0] - ctx.measureText("AT").width/2,this.center[1]+scale)
    }
    drawRange(range){
        // console.log('draw AT range ',range)
        let curentAngle = this.angleOfAttack/2 - this.angleOfAttack
        let nextAngle = curentAngle+1
        let curentAngleClosestIntercect = 1
        let nextAngleClosestIntersect = undefined
        //get the intersect for the initial curent angle
        for(let r = 2.5; r < range; r++){
            let targetPosition = [
                this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * r * scale,
                this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * r * scale
            ]
            let pieceAlongPathData = findClosestBunkerPieceToPosition(targetPosition[0],targetPosition[1])
            let pieceAlongPath = undefined
            if(pieceAlongPathData && pieceAlongPathData.group !== 'trenches'){
                pieceAlongPath = bunkerGroupes[pieceAlongPathData.group].BBpieces[pieceAlongPathData.type][pieceAlongPathData.tier][pieceAlongPathData.piece]
            }
            if(pieceAlongPath && ["BoB","RG","MMG","ATG","HG","SC","IC","OB"].includes(pieceAlongPath.type) && this !== pieceAlongPath){
                let intersectTest 
                for(let p = 0; p < 4; p ++){
                    intersectTest = intersects(
                        this.center[0],
                        this.center[1],
                        this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * range * scale,
                        this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * range * scale,
                        pieceAlongPath[`p${p % 4 + 1}`][0],
                        pieceAlongPath[`p${p % 4 + 1}`][1],
                        pieceAlongPath[`p${(p+1) % 4 + 1}`][0],
                        pieceAlongPath[`p${(p+1) % 4 + 1}`][1]
                    )
                    if(curentAngleClosestIntercect > intersectTest) curentAngleClosestIntercect = intersectTest
                }
            }
        }
        // get the inersect for all next angle's
        for(let i = 0; i < this.angleOfAttack;i++){
            if(nextAngleClosestIntersect !== undefined){
                curentAngle = nextAngle
                curentAngleClosestIntercect = nextAngleClosestIntersect
                nextAngle ++
            }
            nextAngleClosestIntersect = 1
            for(let r = 2.5; r < range; r++){
                let targetPosition = [
                    this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * r * scale,
                    this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * r * scale
                ]
                let pieceAlongPathData = findClosestBunkerPieceToPosition(targetPosition[0],targetPosition[1])
                let pieceAlongPath = undefined
                if(pieceAlongPathData && pieceAlongPathData.group !== 'trenches'){
                    pieceAlongPath = bunkerGroupes[pieceAlongPathData.group].BBpieces[pieceAlongPathData.type][pieceAlongPathData.tier][pieceAlongPathData.piece]
                }
                if(pieceAlongPath && ["BoB","RG","MGG","ATG","HG","SC","IC","OB"].includes(pieceAlongPath.type) && this !== pieceAlongPath){
                    let intersectTest 
                    for(let p = 0; p < 4; p ++){
                        intersectTest = intersects(
                            this.center[0],
                            this.center[1],
                            this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * range * scale,
                            this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * range * scale,
                            pieceAlongPath[`p${p % 4 + 1}`][0],
                            pieceAlongPath[`p${p % 4 + 1}`][1],
                            pieceAlongPath[`p${(p+1) % 4 + 1}`][0],
                            pieceAlongPath[`p${(p+1) % 4 + 1}`][1]
                        )
                        if(nextAngleClosestIntersect > intersectTest) nextAngleClosestIntersect = intersectTest
                    }
                }
            }
            ctx.fillStyle = "#f006"
            ctx.beginPath()
            ctx.moveTo(this.center[0],this.center[1])
            ctx.lineTo(this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * range * curentAngleClosestIntercect * scale,
            this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * range * curentAngleClosestIntercect * scale)
            ctx.lineTo(this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * range * nextAngleClosestIntersect * scale,
            this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * range * nextAngleClosestIntersect * scale)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = "#000"
            ctx.globalCompositeOperation = 'destination-over';

        }
    }
}
class HG extends BS{
    constructor(ox,oy,direction,facing,type,tier){
        super(ox,oy,direction,type,tier)
        this.facing = direction+facing
        this.angleOfAttack = 120
        this.range = 25
        if(tier == 0){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null
        }else if (tier == 1){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null 
        }else if(tier == 2){
            this.hp = 1750
            this.si = 0.93
            this.rCost = 160
            this.buildTb = 75
            this.buildTc = 70
        }
    }
    drawDetails(){
        ctx.font = `${2.5*scale}px Arial`;
        ctx.fillStyle = "#000"
        ctx.fillText("H",this.center[0] - ctx.measureText("H").width/2,this.center[1]+scale)
    }
    drawRange(range){
        // console.log('draw HG range', range)
        let curentAngle = this.angleOfAttack/2 - this.angleOfAttack
        let nextAngle = curentAngle+1
        let curentAngleClosestIntercect = 1
        let nextAngleClosestIntersect = undefined
        //get the intersect for the initial curent angle
        for(let r = 2.5; r < range; r++){
            let targetPosition = [
                this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * r * scale,
                this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * r * scale
            ]
            let pieceAlongPathData = findClosestBunkerPieceToPosition(targetPosition[0],targetPosition[1])
            let pieceAlongPath = undefined
            if(pieceAlongPathData && pieceAlongPathData.group !== 'trenches'){
                pieceAlongPath = bunkerGroupes[pieceAlongPathData.group].BBpieces[pieceAlongPathData.type][pieceAlongPathData.tier][pieceAlongPathData.piece]
            }
            if(pieceAlongPath && [].includes(pieceAlongPath.type) && this !== pieceAlongPath){
                let intersectTest 
                for(let p = 0; p < 4; p ++){
                    intersectTest = intersects(
                        this.center[0],
                        this.center[1],
                        this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * range * scale,
                        this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * range * scale,
                        pieceAlongPath[`p${p % 4 + 1}`][0],
                        pieceAlongPath[`p${p % 4 + 1}`][1],
                        pieceAlongPath[`p${(p+1) % 4 + 1}`][0],
                        pieceAlongPath[`p${(p+1) % 4 + 1}`][1]
                    )
                    if(curentAngleClosestIntercect > intersectTest) curentAngleClosestIntercect = intersectTest
                }
            }
        }
        // get the inersect for all next angle's
        for(let i = 0; i < this.angleOfAttack;i++){
            if(nextAngleClosestIntersect !== undefined){
                curentAngle = nextAngle
                curentAngleClosestIntercect = nextAngleClosestIntersect
                nextAngle ++
            }
            nextAngleClosestIntersect = 1
            for(let r = 2.5; r < range; r++){
                let targetPosition = [
                    this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * r * scale,
                    this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * r * scale
                ]
                let pieceAlongPathData = findClosestBunkerPieceToPosition(targetPosition[0],targetPosition[1])
                let pieceAlongPath = undefined
                if(pieceAlongPathData && pieceAlongPathData.group !== 'trenches'){
                    pieceAlongPath = bunkerGroupes[pieceAlongPathData.group].BBpieces[pieceAlongPathData.type][pieceAlongPathData.tier][pieceAlongPathData.piece]
                }
                if(pieceAlongPath && [].includes(pieceAlongPath.type) && this !== pieceAlongPath){
                    let intersectTest 
                    for(let p = 0; p < 4; p ++){
                        intersectTest = intersects(
                            this.center[0],
                            this.center[1],
                            this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * range * scale,
                            this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * range * scale,
                            pieceAlongPath[`p${p % 4 + 1}`][0],
                            pieceAlongPath[`p${p % 4 + 1}`][1],
                            pieceAlongPath[`p${(p+1) % 4 + 1}`][0],
                            pieceAlongPath[`p${(p+1) % 4 + 1}`][1]
                        )
                        if(nextAngleClosestIntersect > intersectTest) nextAngleClosestIntersect = intersectTest
                    }
                }
            }
            ctx.fillStyle = "#00f6"
            ctx.beginPath()
            ctx.moveTo(this.center[0],this.center[1])
            ctx.lineTo(this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * range * curentAngleClosestIntercect * scale,
            this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * range * curentAngleClosestIntercect * scale)
            ctx.lineTo(this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * range * nextAngleClosestIntersect * scale,
            this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * range * nextAngleClosestIntersect * scale)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = "#000"
            ctx.globalCompositeOperation = 'destination-over';

        }
    }
}
// aditional bunker classes
class BoB extends BS{
    constructor(ox,oy,direction,type,tier){
        super(ox,oy,direction,type,tier)
        this.facing = 0
        this.RampExtention = getPiece(this[`ap${((Math.ceil(this.facing/90) + 1) % 4) + 1}`].x,this[`ap${((Math.ceil(this.facing/90) + 1) % 4) + 1}`].y,this[`ap${((Math.ceil(this.facing/90) + 1) % 4) + 1}`].direction,'BR',0)
        this.innerRect = this.getInnerRect(direction)
        
        this.angleOfAttack = 360
        this.range = 80

        if(tier == 0){
            this.hp = 1750
            this.si = 0.65
            this.rCost = 300
            this.buildTb = 300
            this.buildTc = 0
        }else if (tier == 1){
            this.hp = 2000
            this.si = 0.70
            this.rCost = 100
            this.buildTb = 400
            this.buildTc = 0 
        }else if(tier == 2){
            this.hp = 3500
            this.si = 0.75
            this.rCost = 200
            this.buildTb = 400
            this.buildTc = 50
        }
    }
    getInnerRect(direction){
        let out = {'p1':{'x':0,'y':0,'direction':0},'p2':{'x':0,'y':0,'direction':0},'p3':{'x':0,'y':0,'direction':0},'p4':{'x':0,'y':0,'direction':0}}
        let length = Math.sqrt(50)*0.2
        let angle = direction
        for(let p in out){
            angle += 45
            out[p].x = this[p][0] + Math.cos(Math.PI * angle / 180) * length * scale;
            out[p].y = this[p][1] + Math.sin(Math.PI * angle / 180) * length * scale;
            out[p].direction = angle % 360
            angle += 45
        }
        return out
    }
    drawDetails(){
        ctx.beginPath()
        ctx.moveTo(this.innerRect.p1.x,this.innerRect.p1.y)
        ctx.lineTo(this.innerRect.p2.x,this.innerRect.p2.y)
        ctx.lineTo(this.p2[0],this.p2[1])
        ctx.moveTo(this.innerRect.p2.x,this.innerRect.p2.y)
        ctx.lineTo(this.innerRect.p3.x,this.innerRect.p3.y)
        ctx.lineTo(this.p3[0],this.p3[1])
        ctx.moveTo(this.innerRect.p3.x,this.innerRect.p3.y)
        ctx.lineTo(this.innerRect.p4.x,this.innerRect.p4.y)
        ctx.lineTo(this.p4[0],this.p4[1])
        ctx.moveTo(this.innerRect.p4.x,this.innerRect.p4.y)
        ctx.lineTo(this.innerRect.p1.x,this.innerRect.p1.y)
        ctx.lineTo(this.p1[0],this.p1[1])
        ctx.moveTo(this.innerRect.p1.x,this.innerRect.p1.y)
        ctx.closePath()
        ctx.stroke()
    }
    drawRange(range){
        let curentAngle = this.angleOfAttack/2 - this.angleOfAttack
        let nextAngle = curentAngle+1
        let curentAngleClosestIntercect = 1
        let nextAngleClosestIntersect = undefined
        //get the intersect for the initial curent angle
        for(let r = 2.5; r < range; r++){
            let targetPosition = [
                this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * r * scale,
                this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * r * scale
            ]
            let pieceAlongPathData = findClosestBunkerPieceToPosition(targetPosition[0],targetPosition[1])
            let pieceAlongPath = undefined
            if(pieceAlongPathData && pieceAlongPathData.group !== 'trenches'){
                pieceAlongPath = bunkerGroupes[pieceAlongPathData.group].BBpieces[pieceAlongPathData.type][pieceAlongPathData.tier][pieceAlongPathData.piece]
            }
            if(pieceAlongPath && ["BoB","RG","MMG","ATG","HG","SC","IC"].includes(pieceAlongPath.type) && this !== pieceAlongPath){
                let intersectTest 
                for(let p = 0; p < 4; p ++){
                    intersectTest = intersects(
                        this.center[0],
                        this.center[1],
                        this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * range * scale,
                        this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * range * scale,
                        pieceAlongPath[`p${p % 4 + 1}`][0],
                        pieceAlongPath[`p${p % 4 + 1}`][1],
                        pieceAlongPath[`p${(p+1) % 4 + 1}`][0],
                        pieceAlongPath[`p${(p+1) % 4 + 1}`][1]
                    )
                    if(curentAngleClosestIntercect > intersectTest) curentAngleClosestIntercect = intersectTest
                }
            }
        }
        // get the inersect for all next angle's
        for(let i = 0; i < this.angleOfAttack;i++){
            if(nextAngleClosestIntersect !== undefined){
                curentAngle = nextAngle
                curentAngleClosestIntercect = nextAngleClosestIntersect
                nextAngle ++
            }
            nextAngleClosestIntersect = 1
            for(let r = 2.5; r < range; r++){
                let targetPosition = [
                    this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * r * scale,
                    this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * r * scale
                ]
                let pieceAlongPathData = findClosestBunkerPieceToPosition(targetPosition[0],targetPosition[1])
                let pieceAlongPath = undefined
                if(pieceAlongPathData && pieceAlongPathData.group !== 'trenches'){
                    pieceAlongPath = bunkerGroupes[pieceAlongPathData.group].BBpieces[pieceAlongPathData.type][pieceAlongPathData.tier][pieceAlongPathData.piece]
                }
                if(pieceAlongPath && [].includes(pieceAlongPath.type) && this !== pieceAlongPath){
                    let intersectTest 
                    for(let p = 0; p < 4; p ++){
                        intersectTest = intersects(
                            this.center[0],
                            this.center[1],
                            this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * range * scale,
                            this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * range * scale,
                            pieceAlongPath[`p${p % 4 + 1}`][0],
                            pieceAlongPath[`p${p % 4 + 1}`][1],
                            pieceAlongPath[`p${(p+1) % 4 + 1}`][0],
                            pieceAlongPath[`p${(p+1) % 4 + 1}`][1]
                        )
                        if(nextAngleClosestIntersect > intersectTest) nextAngleClosestIntersect = intersectTest
                    }
                }
            }
            ctx.fillStyle = "#0f06"
            ctx.beginPath()
            ctx.moveTo(this.center[0],this.center[1])
            ctx.lineTo(this.center[0] + Math.cos(Math.PI * (this.facing+curentAngle) / 180) * range * curentAngleClosestIntercect * scale,
            this.center[1] + Math.sin(Math.PI * (this.facing+curentAngle) / 180) * range * curentAngleClosestIntercect * scale)
            ctx.lineTo(this.center[0] + Math.cos(Math.PI * (this.facing+nextAngle) / 180) * range * nextAngleClosestIntersect * scale,
            this.center[1] + Math.sin(Math.PI * (this.facing+nextAngle) / 180) * range * nextAngleClosestIntersect * scale)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = "#000"
            ctx.globalCompositeOperation = 'destination-over';

        }
}
}
class BR extends BS{
    constructor(ox,oy,direction,facing,type,tier){
        super(ox,oy,direction,type,tier)
        if(facing == 90){
            let temp = this.p1
            this.p1 = this.p2
            this.p2 = this.p3
            this.p3 = this.p4
            this.p4 = temp
        }else if(facing == 180){
            let temp = this.p1
            this.p1 = this.p3
            this.p3 = temp
            temp = this.p2
            this.p2 = this.p4
            this.p4 = temp
        }else if (facing == 270){
            let temp = this.p1
            this.p1 = this.p4
            this.p4 = this.p3
            this.p3 = this.p2
            this.p2 = temp
        }
        this.detailPoints = this.getDetailPoints(direction+facing)
        
        if(tier == 0){
            this.hp = 1500
            this.si = 0.85
            this.rCost = 50
            this.buildTb = 50
            this.buildTc = 0 
        }else if (tier == 1){
            this.hp = 1850
            this.si = 0.95
            this.rCost = 50
            this.buildTb = 100
            this.buildTc = 0 
        }else if(tier == 2){
            this.hp = 2000
            this.si = 0.99
            this.rCost = 80
            this.buildTb = 100
            this.buildTc = 20
        }
    }
    getDetailPoints(facing){
        let out = {'p1':{'x':0,'y':0},'p2':{'x':0,'y':0},'p3':{'x':0,'y':0},'p4':{'x':0,'y':0}}
        let length = Math.sqrt(50)*0.45
        let angle = facing + 155
        out.p1.x = this.p2[0] + Math.cos(Math.PI * angle / 180) * length * scale;
        out.p1.y = this.p2[1] + Math.sin(Math.PI * angle / 180) * length * scale;
        angle += 25
        out.p2.x = this.p2[0] + Math.cos(Math.PI * angle / 180) * length * scale;
        out.p2.y = this.p2[1] + Math.sin(Math.PI * angle / 180) * length * scale;
        
        angle = facing + 205
        out.p3.x = this.p3[0] + Math.cos(Math.PI * angle / 180) * length * scale;
        out.p3.y = this.p3[1] + Math.sin(Math.PI * angle / 180) * length * scale;
        angle -= 25
        out.p4.x = this.p3[0] + Math.cos(Math.PI * angle / 180) * length * scale;
        out.p4.y = this.p3[1] + Math.sin(Math.PI * angle / 180) * length * scale;
        return out
    }
    
    drawDetails(){
        ctx.beginPath()
        ctx.moveTo(this.p2[0],this.p2[1])
        ctx.lineTo(this.detailPoints.p1.x,this.detailPoints.p1.y)
        ctx.lineTo(this.detailPoints.p2.x,this.detailPoints.p2.y)
        ctx.moveTo(this.detailPoints.p1.x,this.detailPoints.p1.y)
        ctx.lineTo(this.detailPoints.p3.x,this.detailPoints.p3.y)
        ctx.lineTo(this.detailPoints.p4.x,this.detailPoints.p4.y)
        ctx.moveTo(this.detailPoints.p3.x,this.detailPoints.p3.y)
        ctx.lineTo(this.p3[0],this.p3[1])
        ctx.closePath()
        ctx.stroke()
    }
}
// work in progress classes
class AB extends BS{
    constructor(ox,oy,direction,type,tier){
        super(ox,oy,direction,type,tier)
        this.center = this.getCore(direction)
        if(tier == 0){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null 
        }else if (tier == 1){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null 
        }else if(tier == 2){
            this.hp = 2000
            this.si = 0.95
            this.rCost = 200
            this.buildTb = 75
            this.buildTc = 40
        }
    }
    getCore(direction){
        let out = [0,0]
        let angle = direction+45
        let length = Math.sqrt(50)/2
        out[0] = this.p1[0] + Math.cos(Math.PI * angle / 180) * length * scale;
        out[1] = this.p1[1] + Math.sin(Math.PI * angle / 180) * length * scale;
        return out
    }
    drawDetails(){
        ctx.font = `${2.5*scale}px Arial`;
        ctx.fillStyle = "#000"
        ctx.fillText("AB",this.center[0] - ctx.measureText("AB").width/2,this.center[1]+scale)
    }
}
class EB extends BS{
    constructor(ox,oy,direction,type,tier){
        super(ox,oy,direction,type,tier)
        this.center = this.getCore(direction)
        if(tier == 0){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null
        }else if (tier == 1){
            this.hp = 1350
            this.si = 0.75
            this.rCost = 120
            this.buildTb = 225
            this.buildTc = 0 
        }else if(tier == 2){
            this.hp = 1500
            this.si = 0.85
            this.rCost = 120
            this.buildTb = 225
            this.buildTc = 50
        }
        
    }
    getCore(direction){
        let out = [0,0]
        let angle = direction+45
        let length = Math.sqrt(50)/2
        out[0] = this.p1[0] + Math.cos(Math.PI * angle / 180) * length * scale;
        out[1] = this.p1[1] + Math.sin(Math.PI * angle / 180) * length * scale;
        return out
    }
    drawDetails(){
        ctx.font = `${2.5*scale}px Arial`;
        ctx.fillStyle = "#000"
        ctx.fillText("EB",this.center[0] - ctx.measureText("EB").width/2,this.center[1]+scale)
    }
}
class OB extends BS{
    constructor(ox,oy,direction,type,tier){
        super(ox,oy,direction,type,tier)
        this.center = this.getCore(direction)
        if(tier == 0){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null
        }else if (tier == 1){
            this.hp = 1650
            this.si = 0.82
            this.rCost = 150
            this.buildTb = 200
            this.buildTc = 0 
        }else if(tier == 2){
            this.hp = 1850
            this.si = 0.93
            this.rCost = 160
            this.buildTb = 200
            this.buildTc = 20
        }
    }
    getCore(direction){
        let out = [0,0]
        let angle = direction+45
        let length = Math.sqrt(50)/2
        out[0] = this.p1[0] + Math.cos(Math.PI * angle / 180) * length * scale;
        out[1] = this.p1[1] + Math.sin(Math.PI * angle / 180) * length * scale;
        return out
    }
    drawDetails(){
        ctx.font = `${2.5*scale}px Arial`;
        ctx.fillStyle = "#000"
        ctx.fillText("OB",this.center[0] - ctx.measureText("OB").width/2,this.center[1]+scale)
    }
}
class IC extends BS{
    constructor(ox,oy,direction,type,tier){
        super(ox,oy,direction,type,tier)
        this.center = this.getCore(direction)
        if(tier == 0){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null
        }else if (tier == 1){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null
        }else if(tier == 2){
            this.hp = 2550
            this.si = 0.65
            this.rCost = 1200
            this.buildTb = 75
            this.buildTc = 280
        }
    }
    getCore(direction){
        let out = [0,0]
        let angle = direction+45
        let length = Math.sqrt(50)/2
        out[0] = this.p1[0] + Math.cos(Math.PI * angle / 180) * length * scale;
        out[1] = this.p1[1] + Math.sin(Math.PI * angle / 180) * length * scale;
        return out
    }
    drawDetails(){
        ctx.font = `${2.5*scale}px Arial`;
        ctx.fillStyle = "#000"
        ctx.fillText("IC",this.center[0] - ctx.measureText("IC").width/2,this.center[1]+scale)
    }
}
class SC extends BS{
    constructor(ox,oy,direction,type,tier){
        super(ox,oy,direction,type,tier)
        this.center = this.getCore(direction)
        if(tier == 0){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null
        }else if (tier == 1){
            this.hp = null
            this.si = null
            this.rCost = null
            this.buildTb = null
            this.buildTc = null
        }else if(tier == 2){
            this.hp = 2250
            this.si = 0.65
            this.rCost = 1600
            this.buildTb = 75
            this.buildTc = 430
        }
    }
    getCore(direction){
        let out = [0,0]
        let angle = direction+45
        let length = Math.sqrt(50)/2
        out[0] = this.p1[0] + Math.cos(Math.PI * angle / 180) * length * scale;
        out[1] = this.p1[1] + Math.sin(Math.PI * angle / 180) * length * scale;
        return out
    }
    drawDetails(){
        ctx.font = `${2.5*scale}px Arial`;
        ctx.fillStyle = "#000"
        ctx.fillText("SC",this.center[0] - ctx.measureText("SC").width/2,this.center[1]+scale)
    }
}
class TS{
    constructor(origin,ox,oy,direction,type,tier){
        this.start = this.calcStartOffset([ox,oy],direction)
        if(origin == 1){
            this.p1 = this.calcHalfLong(this.start,direction-90)
            this.p2 = this.calcLong(this.p1,direction)
            this.p3 = this.calcLong(this.p2,direction)
            this.ap1= {'x':this.p2[0]+(this.p3[0]-this.p2[0])/2,'y':this.p2[1]+(this.p3[1]-this.p2[1])/2,'direction':(360+direction-90)%360}
            this.p4 = this.calcLong(this.p3,direction)
            this.p5 = this.calcLong(this.p4,direction+90)
            this.ap2= {'x':this.p4[0]+(this.p5[0]-this.p4[0])/2,'y':this.p4[1]+(this.p5[1]-this.p4[1])/2,'direction':(360+direction)%360}
            this.p6 = this.calcLong(this.p5,direction+180)
            this.p7 = this.calcLong(this.p6,direction+180)
            this.ap3= {'x':this.p6[0]+(this.p7[0]-this.p6[0])/2,'y':this.p6[1]+(this.p7[1]-this.p6[1])/2,'direction':(360+direction+90)%360}
            this.p8 = this.calcLong(this.p7,direction+180)
            this.ap4= {'x':this.p8[0]+(this.p1[0]-this.p8[0])/2,'y':this.p8[1]+(this.p1[1]-this.p8[1])/2,'direction':(360+direction+180)%360}
        }else{
            this.p3 = this.calcHalfLong(this.start,direction-90)
            this.p4 = this.calcLong(this.p3,direction-90)
            this.p5 = this.calcLong(this.p4,direction)
            this.ap2= {'x':this.p4[0]+(this.p5[0]-this.p4[0])/2,'y':this.p4[1]+(this.p5[1]-this.p4[1])/2,'direction':(360+direction-90)%360}
            this.p6 = this.calcLong(this.p5,direction+90)
            this.p7 = this.calcLong(this.p6,direction+90)
            this.ap3= {'x':this.p6[0]+(this.p7[0]-this.p6[0])/2,'y':this.p6[1]+(this.p7[1]-this.p6[1])/2,'direction':(360+direction)%360}
            this.p8 = this.calcLong(this.p7,direction+90)
            this.p1 =  this.calcLong(this.p8,direction+180)
            this.ap4= {'x':this.p8[0]+(this.p1[0]-this.p8[0])/2,'y':this.p8[1]+(this.p1[1]-this.p8[1])/2,'direction':(360+direction+90)%360}
            this.p2 = this.calcLong(this.p1,direction+270)
            this.ap1= {'x':this.p2[0]+(this.p3[0]-this.p2[0])/2,'y':this.p2[1]+(this.p3[1]-this.p2[1])/2,'direction':(360+direction+180)%360}
        }
        this.type = type
        this.tier = tier
        this.center = [(this.p1[0]+this.p2[0]+this.p3[0]+this.p4[0]+this.p5[0]+this.p6[0]+this.p7[0]+this.p8[0])/8,
                       (this.p1[1]+this.p2[1]+this.p3[1]+this.p4[1]+this.p5[1]+this.p6[1]+this.p7[1]+this.p8[1])/8]
        
        if(tier == 0){
            this.hp = 1500
            this.si = 1
            this.rCost = 100
            this.buildTb = 0
            this.buildTc = 0 
        }else if (tier == 1){
            this.hp = 1850
            this.si = 1
            this.rCost = 100
            this.buildTb = 30
            this.buildTc = 0 
        }else if(tier == 2){
            this.hp = 2000
            this.si = 1
            this.rCost = 100
            this.buildTb = 30
            this.buildTc = 20
        }
    }
    calcStartOffset(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * 0.25 * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * 0.25 * scale;
        return out
    }
    calcLong(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * (10/3) * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * (10/3) * scale;
        return out
    }
    calcHalfLong(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * (10/6) * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * (10/6) * scale;
        return out
    }
    draw(lockColor){
        /** @type {CanvasRenderingContext2D} */
        // normal
        ctx.beginPath()
        // console.log('draw TS')
        ctx.lineWidth = 2
        ctx.moveTo(this.p1[0],this.p1[1])
        ctx.lineTo(this.p2[0],this.p2[1])
        ctx.lineTo(this.p3[0],this.p3[1])
        ctx.lineTo(this.p4[0],this.p4[1])
        ctx.lineTo(this.p5[0],this.p5[1])
        ctx.lineTo(this.p6[0],this.p6[1])
        ctx.lineTo(this.p7[0],this.p7[1])
        ctx.lineTo(this.p8[0],this.p8[1])
        ctx.closePath()
        if(this.tier==0 && !lockColor){
            ctx.strokeStyle = "#32a852"
        }else if(this.tier==1 && !lockColor){
            ctx.strokeStyle = "#916c3c"
        }else if(this.tier == 2 && !lockColor){
            ctx.strokeStyle = "#949494"
        }else if(!lockColor){
            ctx.strokeStyle = "#000"
            //console.log("invalid tier on black colored piece")
        }
        ctx.stroke()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        if(this.drawDetails)this.drawDetails()
    }
    highlight(color){
        // console.log(color)
        ctx.strokeStyle = color
        // console.log(ctx.strokeStyle)
        this.draw(true)
        ctx.strokeStyle = "#000"
    }
}
class TO{
    constructor(ox,oy,direction,type,tier){
        this.start = this.calcStartOffset([ox,oy],direction)
        this.p1 = this.calcHalfLong(this.start,direction-90)
        this.p2 = this.calcLong(this.p1,direction-45)
        this.p3 = this.calcLong(this.p2,direction)
        this.p4 = this.calcLong(this.p3,direction+45)
        this.p5 = this.calcLong(this.p4,direction+90)
        this.p6 = this.calcLong(this.p5,direction+135)
        this.p7 = this.calcLong(this.p6,direction+180)
        this.p8 = this.calcLong(this.p7,direction+225)
        this.ap1= {'x':this.p1[0]+(this.p2[0]-this.p1[0])/2,'y':this.p1[1]+(this.p2[1]-this.p1[1])/2,'direction':(360+direction-135)%360}
        this.ap2= {'x':this.p2[0]+(this.p3[0]-this.p2[0])/2,'y':this.p2[1]+(this.p3[1]-this.p2[1])/2,'direction':(360+direction-90)%360}
        this.ap3= {'x':this.p3[0]+(this.p4[0]-this.p3[0])/2,'y':this.p3[1]+(this.p4[1]-this.p3[1])/2,'direction':(360+direction-45)%360}
        this.ap4= {'x':this.p4[0]+(this.p5[0]-this.p4[0])/2,'y':this.p4[1]+(this.p5[1]-this.p4[1])/2,'direction':(360+direction)%360}
        this.ap5= {'x':this.p5[0]+(this.p6[0]-this.p5[0])/2,'y':this.p5[1]+(this.p6[1]-this.p5[1])/2,'direction':(360+direction+45)%360}
        this.ap6= {'x':this.p6[0]+(this.p7[0]-this.p6[0])/2,'y':this.p6[1]+(this.p7[1]-this.p6[1])/2,'direction':(360+direction+90)%360}
        this.ap7= {'x':this.p7[0]+(this.p8[0]-this.p7[0])/2,'y':this.p7[1]+(this.p8[1]-this.p7[1])/2,'direction':(360+direction+135)%360}
        this.ap8= {'x':this.p8[0]+(this.p1[0]-this.p8[0])/2,'y':this.p8[1]+(this.p1[1]-this.p8[1])/2,'direction':(360+direction+180)%360}
        this.type = type
        this.tier = tier
        this.center = [(this.p1[0]+this.p2[0]+this.p3[0]+this.p4[0]+this.p5[0]+this.p6[0]+this.p7[0]+this.p8[0])/8,
                       (this.p1[1]+this.p2[1]+this.p3[1]+this.p4[1]+this.p5[1]+this.p6[1]+this.p7[1]+this.p8[1])/8]

        if(tier == 0){
            this.hp = 1500
            this.si = 0.85
            this.rCost = 100
            this.buildTb = 0
            this.buildTc = 0 
        }else if (tier == 1){
            this.hp = 1850
            this.si = 0.95
            this.rCost = 100
            this.buildTb = 50
            this.buildTc = 0 
        }else if(tier == 2){
            this.hp = 2000
            this.si = 0.99
            this.rCost = 100
            this.buildTb = 50
            this.buildTc = 20
        }
    }
    calcStartOffset(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * 0.25 * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * 0.25 * scale;
        return out
    }
    calcLong(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * (10/3) * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * (10/3) * scale;
        return out
    }
    calcHalfLong(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * (10/6) * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * (10/6) * scale;
        return out
    }
    draw(lockColor){
        /** @type {CanvasRenderingContext2D} */
        // normal
        ctx.beginPath()
        ctx.lineWidth = 0.5*scale
        ctx.moveTo(this.p1[0],this.p1[1])
        ctx.lineTo(this.p2[0],this.p2[1])
        ctx.lineTo(this.p3[0],this.p3[1])
        ctx.lineTo(this.p4[0],this.p4[1])
        ctx.lineTo(this.p5[0],this.p5[1])
        ctx.lineTo(this.p6[0],this.p6[1])
        ctx.lineTo(this.p7[0],this.p7[1])
        ctx.lineTo(this.p8[0],this.p8[1])
        ctx.closePath()
        if(this.tier==0 && !lockColor){
            ctx.strokeStyle = "#32a852"
        }else if(this.tier==1 && !lockColor){
            ctx.strokeStyle = "#916c3c"
        }else if(this.tier == 2 && !lockColor){
            ctx.strokeStyle = "#949494"
        }else if(!lockColor){
            ctx.strokeStyle = "#000"
            //console.log("invalid tier on black colored piece")
        }
        ctx.stroke()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        if(this.drawDetails)this.drawDetails()
    }
    highlight(color){
        ctx.strokeStyle = color
        this.draw()
        ctx.strokeStyle = "#000"
    }

}
class TC{
    constructor(sAT,eAT,type,tier){
        this.start = this.calcStartOffset([sAT.x,sAT.y],sAT.direction)
        this.p1 = this.calcHalfLong(this.start,sAT.direction-90)
        this.p4 = this.calcHalfLong(this.start,sAT.direction+90)
        this.ap1= {'x':this.p4[0]+(this.p1[0]-this.p4[0])/2,'y':this.p4[1]+(this.p1[1]-this.p4[1])/2,'direction':(360+sAT.direction+180)%360}
        this.end = this.calcStartOffset([eAT.x,eAT.y],eAT.direction)
        this.p2 = this.calcHalfLong(this.end,eAT.direction+90)
        this.p3 = this.calcHalfLong(this.end,eAT.direction-90)
        this.ap3= {'x':this.p2[0]+(this.p3[0]-this.p2[0])/2,'y':this.p2[1]+(this.p3[1]-this.p2[1])/2,'direction':(360+eAT.direction+180)%360}
        this.type = type
        this.tier = tier
        this.center = [(this.p1[0]+this.p2[0]+this.p3[0]+this.p4[0])/4,
                       (this.p1[1]+this.p2[1]+this.p3[1]+this.p4[1])/4]
    }
    calcStartOffset(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * 0.25 * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * 0.25 * scale;
        return out
    }
    calcHalfLong(cur,angle){
        var out = [0,0]
        out[0] = cur[0] + Math.cos(Math.PI * angle / 180) * (10/6) * scale;
        out[1] = cur[1] + Math.sin(Math.PI * angle / 180) * (10/6) * scale;
        return out
    }
    draw(lockColor){
        /** @type {CanvasRenderingContext2D} */
        // normal
        ctx.beginPath()
        ctx.lineWidth = 0.5*scale
        ctx.moveTo(this.p1[0],this.p1[1])
        ctx.lineTo(this.p2[0],this.p2[1])
        ctx.lineTo(this.p3[0],this.p3[1])
        ctx.lineTo(this.p4[0],this.p4[1])
        ctx.closePath()
        if(this.tier==0 && !lockColor){
            ctx.strokeStyle = "#32a852"
        }else if(this.tier==1 && !lockColor){
            ctx.strokeStyle = "#916c3c"
        }else if(this.tier == 2 && !lockColor){
            ctx.strokeStyle = "#949494"
        }else if(!lockColor){
            ctx.strokeStyle = "#000"
            //console.log("invalid tier on black colored piece")
        }
        ctx.stroke()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        if(this.drawDetails)this.drawDetails()
    }
    highlight(color){
        ctx.strokeStyle = color
        this.draw()
        ctx.strokeStyle = "#000"
    }
}

//TODO custom shape for obstructions
// class CS{

// }
