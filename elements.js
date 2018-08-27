function Cell(column,row,posX,posY,special) {
	
	this.textureSheet = PIXI.utils.TextureCache[currentMapSheet].clone()
	this.currentColumn = column
	this.currentRow = row
    this.textureSheet.frame = new PIXI.Rectangle(this.textureSheet.frame.x+this.currentColumn*16,this.textureSheet.frame.y+this.currentRow*16,16,16)
	this.sprite = new preparedSprite(this.textureSheet,0,0)
	// this.sprite = new PIXI.Sprite(this.textureSheet)
	this.sprite.height = this.sprite.width = cellSize
	this.sprite.x = posX
	this.sprite.y = posY
	this.home = undefined
	this.vanished = 0
	this.respawnTime = 180
	this.blocking = undefined
	this.ignored = false
	this.hasCrawler = false
	
	// this.sprite.width = this.sprite.height = cellSize
	if (special) {
		this.type = special
	} else {
		this.type = "normal"
	}
	// this.sprite.alpha = 0.3
	var checkSpot = {x:posX+(cellSize/2),y:posY+(cellSize/2)}
	var xIndex = mapCoordsOfXY(checkSpot.x,checkSpot.y).x
	var yIndex = mapCoordsOfXY(checkSpot.x,checkSpot.y).y
	
	var container = sectorContainers[yIndex][xIndex]
	if (container) {
 		container.addChild(this.sprite)
		this.sectorCoords = {x:xIndex,y:yIndex}
		this.container = container
	} else {
		container = new PIXI.Container()
		sectorContainers[yIndex][xIndex] = container
		container.addChild(this.sprite)
		this.sectorCoords = {x:xIndex,y:yIndex}
		this.container = container
	}
	
	// gameContainer.addChild(this.sprite)
	// console.log("pushing to " + xIndex + ", " + yIndex)
	// console.log(cellObjectContainers[yIndex])
	cellObjectContainers[yIndex][xIndex].push(this)
}
Cell.prototype.goRed = function() {
	this.sprite.tint = 0xff0000
}
Cell.prototype.checkForContact = function() {
	var distX = Math.abs((this.sprite.x+(this.sprite.width/2))-samus.sprite.x)
	var distY = this.sprite.y-samus.sprite.y
	if (distX < (this.sprite.width/2) && distY <= 0) {
		// this.sprite.tint = 0xff0000
	} else {
		// this.sprite.tint = 0xffffff
	}
}
Cell.prototype.checkForProximity = function() {
		var distance = distanceFromABToXY(samus.centerX(),samus.sprite.y-(samus.sprite.height/2),this.sprite.x+(this.sprite.width/2),this.sprite.y+(this.sprite.height/2))
		if (samus.flipping) {
			var samusBottom = samus.sprite.y+(cellSize/2)
		} else {
			var samusBottom = samus.sprite.y
		}
		if (this.blocking || this.sprite.y < samusBottom+cellSize && distance < cellSize*2) {
			if (this.blocking) {
				// console.log("pushed blcoer ")
			}
			activeCells.push(this)
			// this.sprite.alpha = 1
			// this.sprite.tint = 0x00ff00
		} else {
			if (activeCells.indexOf(this) > -1) {
				activeCells.splice(activeCells.indexOf(this),1)
				// this.sprite.alpha = 0.3
				// this.sprite.tint = 0xffffff
			}
		}
	}
Cell.prototype.checkForPlayer = function() {
	if (this.type !== "noCollision") {
		var samusTopY = Math.round((samus.sprite.y)-(samus.standingHeight))
		var samusMidY = Math.round((samus.sprite.y)-(samus.standingHeight/2))
		var samusHalfWidth = samus.sprite.width/2
		var xDistance = (samus.centerX()+samus.velocity.x)-(this.sprite.x+(cellSize/2))
		var yDistance = Math.round((samusMidY)-(this.sprite.y+(cellSize/2)))
		var collisionDistanceX = (samusHalfWidth)+(this.sprite.width/2)
		var collisionDistanceY = (samus.standingHeight/2)+(cellSize/2)
		if (this.sprite.visible && Math.abs(xDistance) <= collisionDistanceX*1.5 && Math.abs(yDistance) <= collisionDistanceY*1.5 ) {
			// if (yDistance >= -collisionDistanceY) {
				// in vicinity (could touch after movement)
				if (vicinityCells.indexOf(this) === -1) {
					vicinityCells.push(this)
				}
			// }
			// if (Math.abs(xDistance) <= collisionDistanceX && Math.abs(yDistance) <= collisionDistanceY ) {
			// 	// touching from any direction
			// 	// this.sprite.tint = 0xff0000
			// }
			// if (yDistance > -(collisionDistanceY*4) && yDistance <= -collisionDistanceY && Math.abs(xDistance) <= collisionDistanceX) { 
			// 	// under samus
			// 	// if (vicinityCells.indexOf(this) === -1) {
			// 	// 	vicinityCells.push(this)
			// 	// }
			// }
			
		} else {
			// this.sprite.tint = 0xffffff
		}
	} else {
		
	}
	
}

Cell.prototype.checkForBullets = function() {
	var centerX = this.sprite.x+(this.sprite.width/2)
	var centerY = this.sprite.y+(this.sprite.height/2)
	for (var b=0;b<bullets.length;b++) {
		var bullet = bullets[b]
		var xDistance = Math.abs(bullet.sprite.x-centerX)
		var yDistance = Math.abs(bullet.sprite.y-centerY)
		if (bullet.type === "wave") {
			xDistance *= 0.8
			yDistance *= 0.8
		}
		if (!this.vanished && xDistance < cellSize/2 && yDistance < cellSize/2) {
			if (bullet.type === "missile") {
				bullet.blewAt = counter
			} else if (bullet.type !== "wave") {
				bullet.doomed = true
				
			}
			this.vanished = counter
			samus.checkForBlockingCells()
			if (this.blocking) {
				samus.blocked[this.blocking] = false
				this.blocking = false
			}
		}
	}
}
Cell.prototype.checkForBombs = function() {
	var centerX = this.sprite.x+(this.sprite.width/2)
	var centerY = this.sprite.y+(this.sprite.height/2)
	for (var b=0;b<bombs.length;b++) {
		var bomb = bombs[b]
		if (counter-bomb.blewAt > 0 && counter-bomb.blewAt <= 6) {
			var xDistance = Math.abs(bomb.sprite.x-centerX)
			var yDistance = Math.abs(bomb.sprite.y-centerY)
			if (!this.vanished && xDistance < cellSize && yDistance < cellSize) {
				this.vanished = counter
				samus.checkForBlockingCells()
				if (this.blocking) {
					samus.blocked[this.blocking] = false
					this.blocking = false
				}
			}
		}
	}
}

function WallShrub(posX,posY,side) {
	var top = new Cell(3,0,posX,posY,"noCollision")
	var bottom = new Cell(3,0,posX,posY+cellSize,"noCollision")
	if (side === "left") {
		top.sprite.scale.x *= -1
		bottom.sprite.scale.x *= -1
	} else {
		top.sprite.x += currentZone[currentStyle].wallPattern[0].length*cellSize
		bottom.sprite.x += currentZone[currentStyle].wallPattern[0].length*cellSize
	}
	
}
function LandingPad(posX,posY) {
	
	new ShaftWall(posX,posY-(cellSize*7),2,1)
	new ShaftWall(posX+(cellSize*5),posY-(cellSize*7),2,1)
	for (var c=0;c<7;c++) {
		var currentX = posX+(c*cellSize)
		new Cell(10,0,currentX,posY)
		if (c===0|c===6) {
			new Cell(20,0,currentX,posY-(cellSize*9))
			new Cell(19,0,currentX,posY-(cellSize*8))
		}
	}
}
function MaruMariPedestal(posX,posY) {
	for (var c=0;c<7;c++) {
		if (c==0||c===1||c==5||c==6) {
			new Cell(10,0,posX+(c*cellSize),posY+(cellSize*2))
			if (c===0||c===6) {
				new Cell(20,0,posX+(c*cellSize),posY+(cellSize))
			}
		}
		if (c===3) {
			new Cell(10,0,posX+(c*cellSize),posY)
			new Cell(10,0,posX+(c*cellSize),posY+cellSize)
			new Cell(21,0,posX+(c*cellSize),posY+(cellSize*2))
		}
	}
}

function Pit(startX,startY,length) {
	var fullText = PIXI.utils.TextureCache[currentZone.pitType + "full.png"]
	var halfText = PIXI.utils.TextureCache[currentZone.pitType + "half.png"]
	for (var c=0;c<length;c++) {
		var bottom = new Cell(0,0,startX+(c*cellSize),startY+((segmentHeight*cellSize)-cellSize))
		bottom.sprite.anchor.y = 1
		bottom.sprite.y+= cellSize*1.4
		bottom.sprite.visible = false
		var half = new Cell(0,0,startX+(c*cellSize),startY+((segmentHeight-2)*cellSize),"noCollision")
		var full = new Cell(0,0,startX+(c*cellSize),startY+((segmentHeight-1)*cellSize),"quicksand")
		half.sprite.texture = halfText
		full.sprite.texture = fullText
	}
	
}

function ShaftWall(startX,startY,width,height,base,side) {
	for (var s=0;s<height;s++) {
		// console.log("building segment5 " + s + " of " + height)
		for (var c=0;c<currentZone[currentStyle].wallPattern.length;c++) {
			var row = currentZone[currentStyle].wallPattern[c]
			for (var d=0;d<row.length;d++) {
				var currentIndex = row[d]
				var posX = startX+(d*cellSize)
				var posY = startY+(c*cellSize)+(s*(currentZone[currentStyle].wallPattern.length*cellSize))
				var cell = new Cell(currentIndex,0,posX,posY)
			}
			// var cell = new Cell(currentIndex,0,startX+((c%width)*cellSize),startY+(s*(currentZone[currentStyle].wallPattern.length/2)*cellSize)+(Math.floor(c/width)*cellSize))
			if (base) {
				// new Floor(startX,startY+(height*cellSize*5),2,1)
				currentZone[currentStyle].createFloor(startX,startY+(height*cellSize*5),currentZone[currentStyle].wallPattern[0].length,2)
			}
		}
		if (side && s < height-2) {
			// console.log("shrub " + side + " wall thickness " + currentZone[currentStyle].wallPattern[0].length)
			new WallShrub(startX,startY+(s*randomInt(3,6)*cellSize),side)
		}
		
	}
}
function Post(knobIndex,topIndex,staffIndex,bottomIndex,startX,startY,length) {
	if (staffIndex === 9) {
		var special = "breakable"
	} else {
		var special = false
	}
	var knob = new Cell(knobIndex,0,startX,startY)
	var top = new Cell(topIndex,0,startX,startY+cellSize)
	for (var s=0;s<length-2;s++) {
		var staffPiece = new Cell(staffIndex,0,startX,startY+(cellSize*(2+s)),special)
	}
	var bottom = new Cell(bottomIndex,0,startX,startY+(cellSize*(length-1)),special)
}
function Statue(posX,posY) {
	this.sprite = preparedSprite(PIXI.utils.TextureCache["norfairstatue.png"],0,0)
	this.sprite.width = cellSize
	this.sprite.height = cellSize*2
	this.sprite.x = posX
	this.sprite.y = posY
	var container = sectorContainers[mapCoordsOfXY(posX,posY).y][mapCoordsOfXY(posX,posY).x]
	container.addChild(this.sprite)
}
function Jockey(posX,posY) {
	this.sprite = preparedSprite(PIXI.utils.TextureCache["jockey.png"],0,0)
	this.sprite.width = cellSize*3
	this.sprite.height = cellSize*3
	this.sprite.x = posX
	this.sprite.y = posY
	var container = sectorContainers[mapCoordsOfXY(posX,posY).y][mapCoordsOfXY(posX,posY).x]
	container.addChild(this.sprite)
}

function Bush(startX,startY) {
	var prevMapSheet = currentMapSheet
	currentMapSheet = "techmap.png"
	new Cell(20,0,startX,startY,"noCollision")
    new Cell(21,0,startX+cellSize,startY,"noCollision")
	currentMapSheet = prevMapSheet
}

function Door(posX,posY,side) {
	this.side = side
	this.room = ""
	this.openedAt = 0
	this.partner = undefined
	this.shotsAbsorbed = 0
	
	if (randomInt(0,16)) {
		this.type = "normal"
		this.sprite = preparedSprite(PIXI.utils.TextureCache[this.type + "door" + this.side + ".png"],0,0)
	} else {
		this.type = "missile"
		this.sprite = preparedSprite(PIXI.utils.TextureCache[this.type + "door" + this.side + ".png"],0,0)
	}
	this.sprite.width = cellSize
	this.sprite.height = cellSize*3
	this.sprite.x = posX
	this.sprite.y = posY
	this.sprite.interactive = true
	this.sprite.owner = this
	
	doorArray.push(this)
	this.sprite.on("pointerdown",function() {
		this.owner.trigger()
	})
	var sector = mapCoordsOfXY(posX,posY)
	var container = sectorContainers[sector.y][sector.x]
	this.container = container
	if (container) {
		container.addChild(this.sprite)
	} else {
		console.log("no door cont " + sector.x + ", " + sector.y)
	}

}
Door.prototype.checkForEntry = function() {
	if (this.side === "right") {
		if (!screenShifting && playerMovedX > 0 && samus.sprite.x >= this.sprite.x+(cellSize/2)) {
			samus.velocity.x = 0
			samus.velocity.y = 0
			screenShifting = this.side
			lastScreenShift = counter
			if (this.partner.room.type !== "vertical" && gameContainer.y !== xPosForHorizontalRoom(this.partner.room)) {
				shiftCorrectionY = (-gameContainer.y)-this.partner.room.roomObject.posY
			}
			// currentRoom = this.partner.room
			// console.log("newRoom set to ")
			// console.log(this.partner.room)
			clearGibs(this.room)
			reviveEnemies(this.partner.room)
			changeRoom(this.partner.room,true)
			this.partner.openedAt = counter
			this.partner.sprite.visible = false
			
			// gameContainer.removeChild(samus.sprite)
			// gameContainer.addChildAt(samus.sprite,0)
		}
	} else if (this.side === "left"){
		if (!screenShifting && playerMovedX < 0 && samus.sprite.x <= this.sprite.x+(cellSize/2)) {
			screenShifting = this.side
			lastScreenShift = counter
			if (this.partner.room.type !== "vertical" && gameContainer.y !== xPosForHorizontalRoom(this.partner.room)) {
				shiftCorrectionY = (-gameContainer.y)-this.partner.room.roomObject.posY
			}
			// currentRoom = this.partner.room
			// console.log("newRoom set to ")
			// console.log(this.partner.room)
			reviveEnemies(this.partner.room)
			changeRoom(this.partner.room,true)
			this.partner.openedAt = counter
			this.partner.sprite.visible = false
			// gameContainer.removeChild(samus.sprite)
			// gameContainer.addChildAt(samus.sprite,0)
		}
	}
}
Door.prototype.trigger = function() {
	this.openedAt = counter
	if (!screenShifting) {
		// this.partner.sprite.tint = 0xff0000
		// this.partner.sprite.visible = false
		// console.log("triggering door " + doorArray.indexOf(this))	
		// console.log("partner " + doorArray.indexOf(this.partner))	
	}
	if (samus.blocked["right"] === this) {
		samus.blocked["right"] = false
	}
	if (samus.blocked["left"] === this) {
		samus.blocked["left"] = false
	}
	
}
Door.prototype.checkForBullets = function() {
	if (this.side === "left") {
		var doorFrontX = this.sprite.x+(cellSize/2)
	} else {
		var doorFrontX = this.sprite.x+(cellSize/2)
	}
	for (var b=0;b<bullets.length;b++) {
		var bullet = bullets[b]
		var xDistance = Math.abs(bullet.sprite.x-doorFrontX)-bullet.speed
		var yDistance = Math.abs(bullet.sprite.y-(this.sprite.y+this.sprite.height/2))
		if (yDistance < this.sprite.height/2) {
			if (xDistance < bullet.sprite.width/2) {
				if (this.type === "normal") {
					this.trigger()
					if (this.side === "left") {
						bullet.sprite.x = this.sprite.x+(cellSize/2)+(bullet.sprite.width/2)
					} else {
						bullet.sprite.x = this.sprite.x+(cellSize/2)-(bullet.sprite.width/2)
					}
				} else if (counter === bullet.blewAt+1) {
					this.shotsAbsorbed++
					if (this.shotsAbsorbed === 5) {
						this.trigger()
						this.shotsAbsorbed = 0
					}
				}
				if (bullet.type !== "missile") {
					bullet.doomed = true
				} else if (!bullet.blewAt) {
					bullet.blewAt = counter
				}
			}
		}
	}
}
Door.prototype.checkForBombs = function() {
		for (var b=0;b<bombs.length;b++) {
			var bomb = bombs[b]
			if (bomb.detonated) {
				var xDist = Math.abs((this.sprite.x+(cellSize/2))-bomb.sprite.x)
				var yDist = (this.sprite.y-(cellSize))-bomb.sprite.y
				// console.log("dist " + xDist + " goal " + ((cellSize/2)+(bomb.sprite.width/2)))
				if (!this.triggered && yDist < this.sprite.height/2 && xDist < bomb.sprite.width/1.9) {
					this.trigger()
				}
			}
		}
	}
Door.prototype.checkForPlayer = function() {
	if (this.side === "left") {
		var doorFrontX = this.sprite.x+(samus.sprite.width/2)
	} else {
		var doorFrontX = this.sprite.x
	}
	var xDistance = samus.sprite.x-doorFrontX
	var yDistance = (samus.sprite.y-samus.standingHeight)-(this.sprite.y+(this.sprite.height/2))
	
	if (Math.abs(xDistance) <= cellSize/2
		&& Math.abs(yDistance) < cellSize*2) {
		if (samus.sprite.scale.x < 0 && !samus.blocked["left"] && this.sprite.x < samus.centerX()) {
			samus.blocked["left"] = this
			samus.velocity.x = 0
			samus.sprite.x = this.sprite.x+(cellSize/2)+(samus.sprite.width/2)
			// this.sprite.tint = 0xff0000
		}
		if (samus.sprite.scale.x > 0 && !samus.blocked["right"] && this.sprite.x > samus.centerX()) {
			samus.blocked["right"] = this
			samus.velocity.x = 0
			samus.sprite.x = this.sprite.x+(cellSize/2)-(samus.sprite.width/2)
			// this.sprite.tint = 0xff0000
		}
			
	} else {
		// this.sprite.tint = 0xffffff
	}
}
Door.prototype.engage = function() {
	var sinceOpened = counter-this.openedAt
	if (sinceOpened === 0) {
		this.sprite.texture = PIXI.utils.TextureCache[this.type + "door" + this.side + "open1.png"]
	}
	if (sinceOpened === 5) {
		this.sprite.texture = PIXI.utils.TextureCache[this.type + "door" + this.side + "open2.png"]
	}
	if (sinceOpened === 10) {
		this.sprite.texture = PIXI.utils.TextureCache[this.type + "door" + this.side + "open3.png"]
	}
	if (sinceOpened === 15) {
		this.sprite.visible = false
	}
	if (sinceOpened === 105) {
		this.sprite.visible = true
		this.sprite.texture = PIXI.utils.TextureCache[this.type + "door" + this.side + "open3.png"]
	}
	if (sinceOpened === 110) {
		this.sprite.texture = PIXI.utils.TextureCache[this.type + "door" + this.side + "open2.png"]
	}
	if (sinceOpened === 115) {
		this.sprite.texture = PIXI.utils.TextureCache[this.type + "door" + this.side + "open1.png"]
	}
	if (sinceOpened === 120) {
		this.sprite.texture = PIXI.utils.TextureCache[this.type + "door" + this.side + ".png"]
		this.openedAt = 0
	}
}

Door.prototype.spawnRoom = function(size,roomFunc) {
	
	if (this.side === "right") {
		// console.log("spawning room to right")
		creatingAt.x = this.sprite.x+(cellSize*2)
		creatingAt.y = this.sprite.y-(cellSize*5)
		roomFunc()
	} else {
		// console.log("spawning room to left")
		creatingAt.x = this.sprite.x-(cellSize)-(size*cellSize)
		creatingAt.y = this.sprite.y-(cellSize*5)
		roomFunc()
	}
	
	
}

function Ledge(startX,startY,width) {
	this.cells = []
	this.posX = startX
	this.posY = startY
	this.length = width
	var leftEnd = new Cell(currentZone[currentStyle].ledgePattern[0],0,startX,startY)
	var rightEnd = new Cell(currentZone[currentStyle].ledgePattern[2],0,startX+((width-1)*cellSize),startY)
	this.cells.push(leftEnd)
	this.cells.push(rightEnd)
	for (var s=0;s<width-2;s++) {
		var segment = new Cell(currentZone[currentStyle].ledgePattern[1],0,startX+cellSize+(s*cellSize),startY)
		this.cells.push(segment)
		// groundCells.push(segment)
	}
	// groundCells.push(leftEnd)
	// groundCells.push(rightEnd)
}
function Shrub(startX,startY) {
	for (var c=0;c<currentZone[currentStyle].shrubberyPattern.length;c++) {
		var currentIndex = currentZone[currentStyle].shrubberyPattern[c]
		var posX = startX+((c%4)*cellSize)
		var posY = startY+(Math.floor(c/4)*cellSize)
		var cell = new Cell(currentIndex,0,posX,posY)
		
	}
}
function BreakableArea(startX,startY,width,height) {
	for (var r=0;r<height;r++) {
		for (var c=0;c<width;c++) {
			var cell = new Cell(9,0,startX+(c*(cellSize)),startY+(r*(cellSize)),"breakable")
			// console.log("tyepe " + cell.type)
			// console.log("van " + cell.vanished)
			// groundCells.push(cell)
		}
	}
}
function HorizontalBarrier(startX,startY) {
	new BulkPiece(startX,startY)
	new BulkPiece(startX+(segmentWidth*cellSize)-(cellSize*4),startY)
	new BreakableArea(startX+(cellSize*4),startY,8,1)
	new BreakableArea(startX+(cellSize*6),startY+(cellSize*3),4,1)
}
function BulkPiece(startX,startY,trimBottom) {
	for (var c=0;c<currentZone[currentStyle].bulkPattern.length;c++) {
		var currentIndex = currentZone[currentStyle].bulkPattern[c]
		var column = (c%4)
		var row = Math.floor(c/4)
		if (trimBottom && row > 3-(trimBottom)) {
			// console.log("didn't on " + row)

		} else {
			var cell = new Cell(currentIndex,0,startX+(column*cellSize),startY+(row*cellSize))
		}
		
		
		if (c < 4) {
			// groundCells.push(cell)
		}
	}
}
function BulkCluster(startX,startY,clusters,spacingX,spacingY,direction) {
	var movedX = 0
	var movedY = 0
	for (var c=0;c<clusters;c++) {
		var bulkPiece = new BulkPiece(startX+movedX,startY+movedY)
		movedX += (spacingX*cellSize)
		movedY += (spacingY*cellSize)
	}
}
function Shrubbery(startX,startY,width,height) {
	for (var r=0;r<height;r++) {
		for (var s=0;s<width;s++) {
			var shrub = new Shrub(startX+(s*(cellSize*4)),startY+(r*(cellSize*4)))
		}
	}
}
function BulkArea(startX,startY,width,height) {
	for (var r=0;r<height;r++) {
		for (var s=0;s<width;s++) {
			var pieceHeight = startY+(r*4*cellSize)
			if (r === height-1) {
				pieceHeight = startY+(((r*4)-1)*cellSize)
			}
			var bulkPiece = new BulkPiece(startX+(s*(cellSize*4)),pieceHeight)
		}
	}
}
function TechPedestal(startX,startY,width,height) {
	var oldMapSheet = currentMapSheet
	new ShaftWall(startX,startY,2,5,true)
	currentMapSheet = "techmap.png"

	currentMapSheet = oldMapSheet
}
function EnemyPipe(startX,startY,depth) {
	this.posX = startX
	this.posY = startY
	this.depth = undefined
	this.flyer = undefined
	var left = new Cell(17,0,startX,startY+(cellSize/2))
	var right = new Cell(18,0,startX+cellSize,startY+(cellSize/2))
	left.sprite.anchor.y = 0.5
	right.sprite.anchor.y = 0.5
}

var elevatorSpeed = Math.round(cellSize/5)
function Elevator(posX,posY) {
	
	this.sprite = preparedSprite(PIXI.utils.TextureCache["elevator.png"],0,0)
	this.sprite.width = cellSize*2
	this.sprite.height = cellSize
	this.sprite.x = this.homeX = posX
	this.sprite.y = this.homeY = posY
	this.destX = posX
	this.destY = this.homeY+segmentHeight*cellSize*2
	this.destRoom = undefined
	this.triggered = false
	this.sprite.interactive = true
	this.sprite.owner = this
	this.zone = currentZone
	this.room = undefined
	this.lastTriggered = -99
	
	elevatorArray.push(this)

	this.sprite.on("pointerdown",function(){
		
		this.owner.trigger()
	})
	this.checkForPlayer = function() {
		var xDistance = Math.abs((samus.sprite.x)-(this.sprite.x+cellSize))
		var yDistance = (this.sprite.y+(newPixelSize))-samus.sprite.y
		// console.log("x " + xDistance)
		// console.log("y " + yDistance)
		if (xDistance < cellSize/2 && yDistance >= 0 && yDistance <= samus.velocity.y) {
			this.trigger()
		}

	}
	this.trigger = function() {
		this.lastTriggered = counter
		samus.changeFrame("samusfront.png")
		if (zonesCreated.indexOf(this.room.partner.zone) === -1) {
			createRoomFromIndex(this.room.partner.zone.landingRoomIndex)
		}
		samus.velocity.x = samus.velocity.y = 0
		samus.sprite.x = this.sprite.x+cellSize
		samus.sprite.y = this.sprite.y
		// gameContainer.setChildIndex(samus.sprite,gameContainer.children.length-1)
		if (this.sprite.y === this.homeY) {
			this.connectingSector = sectorContainers[startingCellPos.y+this.room.endPos.y][startingCellPos.x+this.room.startPos.x]
			this.connectingSector.visible = true
			this.triggered = "down"
			changeRoom(this.room.partner,true)
			changeActiveZone(this.room.partner.zone)
		} else {
			this.connectingSector = sectorContainers[startingCellPos.y+this.room.partner.endPos.y][startingCellPos.x+this.room.partner.startPos.x]
			this.connectingSector.visible = true
			this.triggered = "up"
			changeRoom(this.room,true)
			changeActiveZone(this.room.zone)
		}
		screenShifting = true	
		
		
	}
	this.operate = function() {
		var oldRoom = currentRoom
		if (this.triggered === "down") {
			if (this.sprite.y+(elevatorSpeed) < this.destY) {
				this.sprite.y += elevatorSpeed
				samus.sprite.y += elevatorSpeed
				gameContainer.y -= elevatorSpeed
			} else {
				for (var s=0;s<lastRoom.sectors.length;s++) {
					lastRoom.sectors[s].visible = false
				}
				samus.sprite.y = this.destY
				this.sprite.y = this.destY
				this.triggered = false				
				screenShifting = false
				this.connectingSector.visible = false
			}
		} else {
			if (this.sprite.y-(elevatorSpeed) > this.homeY) {
				this.sprite.y -= elevatorSpeed
				samus.sprite.y -= elevatorSpeed
				gameContainer.y += elevatorSpeed
			} else {
				for (var s=0;s<lastRoom.sectors.length;s++) {
					lastRoom.sectors[s].visible = false
				}
				samus.sprite.y = this.homeY
				this.sprite.y = this.homeY
				this.triggered = false
				screenShifting = false
				this.connectingSector.visible = false
			}
		}
	}
	this.container = sectorContainers[mapCoordsOfXY(posX,posY).y][mapCoordsOfXY(posX,posY).x]
	gameContainer.addChild(this.sprite)
	this.sprite.visible = false
}

function Bomb() {
	this.sprite = preparedSprite(PIXI.utils.TextureCache["bombon.png"],0.5,0.5)
	this.laidAt = counter
	this.timer = 30
	this.blewAt = this.laidAt+this.timer
	this.detonated = false
	this.damage = 50
	gameContainer.addChild(this.sprite)
	this.tick = function() {
		var sinceLaid = counter-this.laidAt
		if (sinceLaid < this.timer) {
			if ((sinceLaid+1) % 6 === 0) {
				if (this.sprite.texture === PIXI.utils.TextureCache["bombon.png"]) {
					this.sprite.texture = PIXI.utils.TextureCache["bomboff.png"]
				} else {
					this.sprite.texture = PIXI.utils.TextureCache["bombon.png"]
				}
			}
		} else {
			this.detonated = true
		}
	}
	this.explode = function() {
		var sinceBlew = counter-this.blewAt
		this.sprite.width += Math.round(cellSize/12)
		this.sprite.height += Math.round(cellSize/12)
		if (sinceBlew === 1) {
			this.sprite.texture = PIXI.utils.TextureCache["bombexplode1.png"]
		}
		if (sinceBlew === 4) {
			this.sprite.texture = PIXI.utils.TextureCache["bombexplode2.png"]
		}
		if (sinceBlew === 6) {
			this.sprite.visible = false
		}
	}
	bombs.push(this)
}

function transitionScreen(newRoom) {
	screenTransitioning = true
	samus.room = newRoom
	// stage.x = -newRoom.posX
	
}

function preparedSprite(texture,anchorX,anchorY) {
	spritesCreated++
	var sprite = new PIXI.Sprite(texture)
	sprite.anchor.x = anchorX
	sprite.anchor.y = anchorY
	sprite.width = Math.round(sprite.width*newPixelSize)
	sprite.height = Math.round(sprite.height*newPixelSize)
	// console.log(spritesCreated)
	return sprite
	
}
function EnergyDisplay() {
	this.container = new PIXI.Container()
	
	this.energyLabel = preparedSprite(PIXI.utils.TextureCache["energylabel.png"],0,0)
	this.missileLabel = preparedSprite(PIXI.utils.TextureCache["missile.png"],1,0)
	this.missileLabel.scale.x *= -1
	if (!screenVertical) {
		this.missileLabel.y = Math.round(this.energyLabel.height+(newPixelSize*10))
	} else {
		this.missileLabel.y = Math.round(((segmentHeight-1)*cellSize))+(cellSize/2)
	}
	this.missileLabelContainer = new PIXI.Container()
	this.missileBack = preparedSprite(PIXI.utils.TextureCache["pixel.bmp"],0.5,0.5)
	if (!nesPanel) {
		this.missileBack.width = cellSize*1.1
		this.missileBack.height = cellSize*0.8
	} else {
		this.missileBack.width = cellSize*1.5
		this.missileBack.height = cellSize*1.2
	}
	this.missileBack.tint = 0x000000
	this.missileBack.alpha = 0.4
	this.missileBack.x = this.missileLabel.x+(this.missileLabel.width/2)
	this.missileBack.y = this.missileLabel.y+(this.missileLabel.height/2)
	this.missileHighlight = preparedSprite(PIXI.utils.TextureCache["buttonhighlight.png"],0.5,0.5)
	this.missileHighlight.width = this.missileBack.width*1.15
	this.missileHighlight.height = this.missileBack.height*1.2
	this.missileHighlight.tint = 0x444444
	this.missileHighlight.x = this.missileBack.x
	this.missileHighlight.y = this.missileBack.y
	this.missileText = new PIXI.Text("SHIFT",labelStyle)
	this.missileText.anchor.y = 0.5
	this.missileText.tint = 0xaaaaaa
	this.missileText.x = this.missileHighlight.x-(this.missileHighlight.width/2)-this.missileText.width-newPixelSize
	this.missileText.y = this.missileBack.y
	var digitSize = Math.round(this.energyLabel.height-newPixelSize)
	this.healthDigit1 = preparedSprite(PIXI.utils.TextureCache["nine.png"],0,0)
	this.healthDigit2 = preparedSprite(PIXI.utils.TextureCache["nine.png"],0,0)
	this.healthDigit1.x = Math.round(this.energyLabel.width+(newPixelSize*2))
	this.healthDigit2.x = Math.round(this.healthDigit1.x+digitSize+newPixelSize)
	this.missileDigit1 = preparedSprite(PIXI.utils.TextureCache["zero.png"],0,0)
	this.missileDigit2 = preparedSprite(PIXI.utils.TextureCache["zero.png"],0,0)
	this.missileDigit3 = preparedSprite(PIXI.utils.TextureCache["zero.png"],0,0)
	this.healthDigit1.width = this.healthDigit1.height = this.healthDigit2.width = this.healthDigit2.height = this.missileDigit1.width = this.missileDigit1.height = this.missileDigit2.width = this.missileDigit2.height = this.missileDigit3.width = this.missileDigit3.height = digitSize
	if (!screenVertical && !isTouchDevice) {
		this.missileDigit1.x = Math.round(this.missileBack.width+(newPixelSize))
		this.missileDigit1.y = this.missileDigit2.y = this.missileDigit3.y = Math.round(this.missileLabel.y)
	} else {
		this.missileDigit1.x = Math.round(this.missileBack.x-(digitSize*1.5))
		this.missileDigit1.y = this.missileDigit2.y = this.missileDigit3.y = Math.round(this.missileHighlight.y+(this.missileHighlight.height/2)+newPixelSize*3)
	}
	this.missileDigit2.x = Math.round(this.missileDigit1.x+digitSize+newPixelSize)
	this.missileDigit3.x = Math.round(this.missileDigit2.x+digitSize+newPixelSize)
	this.container.addChild(this.energyLabel)
	this.missileLabelContainer.addChild(this.missileBack)
	this.missileLabelContainer.addChild(this.missileHighlight)
	this.missileLabelContainer.addChild(this.missileLabel)
	this.container.addChild(this.missileLabelContainer)
	if (!screenVertical && !isTouchDevice) {
		this.container.addChild(this.missileText)
	}
	this.container.addChild(this.healthDigit1)
	this.container.addChild(this.healthDigit2)
	this.container.addChild(this.missileDigit1)
	this.container.addChild(this.missileDigit2)
	this.container.addChild(this.missileDigit3)
	this.missileLabelContainer.interactive = true
	this.missileLabelContainer.owner = this
	this.missileLabelContainer.on('pointerdown',function(){
		samus.changeGun("missile")
		this.owner.missileHighlight.tint = 0x00ff00
		for (var w=0;w<this.owner.weaponLabels.length;w++) {
			var label = this.owner.weaponLabels[w]
			label.buttonHighlight.tint = 0x444444
		}
	})
	this.tankLabels = []
	this.weaponLabels = []
	this.updateDisplay = function() {
		var tanksAtStart = samus.fullTanks
		if (samus.hp > 99) {
			if (samus.fullTanks < samus.maxTanks) {
				samus.fullTanks++
				samus.hp -= 99
			}
		} else if (samus.hp > 0) {
			var healthString = samus.hp.toString()
			var missileString = samus.missiles.toString()
			if (missileString.length < 3) {
				if (missileString.length === 2) {
					missileString = "0" + missileString
				} else {
					missileString = "00" + missileString
				}
			}
			if (healthString.length < 2) {
				healthString = "0" + healthString
			}
			this.healthDigit1.texture = PIXI.utils.TextureCache[numeralTextures[healthString[0]]]
			this.healthDigit2.texture = PIXI.utils.TextureCache[numeralTextures[healthString[1]]]
			this.missileDigit1.texture = PIXI.utils.TextureCache[numeralTextures[missileString[0]]]
			this.missileDigit2.texture = PIXI.utils.TextureCache[numeralTextures[missileString[1]]]
			this.missileDigit3.texture = PIXI.utils.TextureCache[numeralTextures[missileString[2]]]
		} else if (samus.hp <= 0) {
			if (samus.fullTanks === 0) {
				this.healthDigit1.texture = PIXI.utils.TextureCache["zero.png"]
				this.healthDigit2.texture = PIXI.utils.TextureCache["zero.png"]
				// dead
			} else {
				samus.fullTanks--
				samus.hp += 99
				var healthString = samus.hp.toString()
				this.healthDigit1.texture = PIXI.utils.TextureCache[numeralTextures[healthString[0]]]
				this.healthDigit2.texture = PIXI.utils.TextureCache[numeralTextures[healthString[1]]]
			}
		}
		if (samus.maxTanks > this.tankLabels.length) {
			for (var t=this.tankLabels.length;t<samus.maxTanks;t++) {
				if (t < samus.fullTanks) {
					var tankLabel = preparedSprite(PIXI.utils.TextureCache["fulltank.png"],0,0)
				} else {
					var tankLabel = preparedSprite(PIXI.utils.TextureCache["emptytank.png"],0,0)
				}
				this.container.addChild(tankLabel)
				tankLabel.x = this.healthDigit2.x+tankLabel.width-((tankLabel.width+(newPixelSize*2))*this.tankLabels.length)
				tankLabel.y = this.healthDigit1.y-(this.energyLabel.height+(newPixelSize*3))
				this.tankLabels.push(tankLabel)
			}
		}
		for (var t=0;t<this.tankLabels.length;t++) {
			var tankLabel = this.tankLabels[t]
			if (t < samus.fullTanks) {
				tankLabel.texture = PIXI.utils.TextureCache["fulltank.png"]
			} else {
				tankLabel.texture = PIXI.utils.TextureCache["emptytank.png"]
			}
		}
		if (samus.weapons.length > this.weaponLabels.length) {
			for (var w=this.weaponLabels.length;w<samus.weapons.length;w++) {
				var type = samus.weapons[w]
				var labelContainer = new PIXI.Container()
				
				labelContainer.buttonBack = preparedSprite(PIXI.utils.TextureCache["pixel.bmp"],0.5,0.5)
				labelContainer.buttonBack.width = this.missileBack.width
				labelContainer.buttonBack.height = this.missileBack.height
				labelContainer.buttonBack.tint = 0x000000
				labelContainer.buttonBack.alpha = 0.4
				labelContainer.buttonHighlight = preparedSprite(PIXI.utils.TextureCache["buttonhighlight.png"],0.5,0.5)
				labelContainer.buttonHighlight.width = this.missileHighlight.width
				labelContainer.buttonHighlight.height = this.missileHighlight.height
				labelContainer.buttonHighlight.tint = 0x444444
				if (type === samus.gunType) {
					labelContainer.buttonHighlight.tint = 0x00ff00
				}
				labelContainer.buttonHighlight.alpha = 1
				
				
				var label = preparedSprite(PIXI.utils.TextureCache[type +".png"],0.5,0.5)
				labelContainer.type = type
				
				label.scale.x *= 1.25
				label.scale.y *= 1.25
				if (!screenVertical) {
					labelContainer.buttonHighlight.x = labelContainer.buttonBack.x = label.x = this.missileLabel.x+(this.missileLabel.width/2)
					labelContainer.buttonHighlight.y = labelContainer.buttonBack.y = label.y = (this.missileHighlight.y+this.missileHighlight.height)+(w*this.missileHighlight.height)
				} else {
					labelContainer.buttonHighlight.x = labelContainer.buttonBack.x = label.x = this.missileHighlight.x+(this.missileHighlight.width*1.1)+(w*(this.missileHighlight.width*1.1))
					labelContainer.buttonHighlight.y = labelContainer.buttonBack.y = label.y = (this.missileBack.y)
				}
				labelContainer.labelText = new PIXI.Text((w+1).toString(),buttonStyle)
				labelContainer.labelText.anchor.y = 0.5
				labelContainer.labelText.tint = 0xaaaaaa
				labelContainer.labelText.x = labelContainer.buttonBack.x-(cellSize)
				labelContainer.labelText.y = labelContainer.buttonBack.y
				labelContainer.addChild(labelContainer.buttonHighlight)
				labelContainer.addChild(labelContainer.buttonBack)
				labelContainer.addChild(label)
				if (!screenVertical && !isTouchDevice) {
					labelContainer.addChild(labelContainer.labelText)
				}
				this.container.addChild(labelContainer)
				this.weaponLabels.push(labelContainer)
				labelContainer.owner = this
				labelContainer.interactive = true
				labelContainer.on('pointerdown',function(){
					samus.changeGun(this.type)
					this.buttonHighlight.tint = 0x00ff00
					for (var w=0;w<this.owner.weaponLabels.length;w++) {
						var label = this.owner.weaponLabels[w]
						if (label && label !== this) {
							label.buttonHighlight.tint = 0x444444
						}
					}
					this.owner.missileHighlight.tint = 0x444444
				})
			}
		}
		if (samus.fullTanks !== tanksAtStart) {
			for (var t=0;t<this.tankLabels.length;t++) {
				var tankLabel = this.tankLabels[t]
				if (t < samus.fullTanks) {
					tankLabel.texture = PIXI.utils.TextureCache["fulltank.png"]
				} else {
					tankLabel.texture = PIXI.utils.TextureCache["emptytank.png"]
				}
			}
		}
	}
	
	this.updateDisplay()
	this.container.visible = false
}

function Powerup(posX,posY,type) {
	this.type = type
	this.sprite = preparedSprite(PIXI.utils.TextureCache[this.type + "red.png"],0.5,0.5)
	this.sprite.x = posX
	this.sprite.y = posY
	this.longevity = 180
	this.bornAt = counter
	powerups.push(this)
	gameContainer.addChild(this.sprite)
	this.flash = function() {
		if (this.sprite.texture === PIXI.utils.TextureCache[this.type + "red.png"]) {
			this.sprite.texture = PIXI.utils.TextureCache[this.type + "blue.png"]
		} else {
			this.sprite.texture = PIXI.utils.TextureCache[this.type + "red.png"]
		}
	}
	this.checkForSamus = function() {
		var diffX = Math.abs(samus.sprite.x-this.sprite.x)
		var diffY = Math.abs((samus.sprite.y-(samus.standingHeight/2))-this.sprite.y)
		var collisionX = (this.sprite.width/2)+(cellSize/2)
		var collisionY = (this.sprite.height/2)+(samus.standingHeight/2)
		if (diffX <= collisionX && diffY <= collisionY) {
			if (type === "health") {
				samus.hp += 15
			}
			if (type === "missile") {
				samus.missiles += 5
				if (samus.missiles > samus.maxMissiles) {
					samus.missiles = samus.maxMissiles
				}
			}
			energyDisplay.updateDisplay()
			// powerups.splice(powerups.indexOf(this,1))
			this.sprite.visible = false
			// gameContainer.removeChild(this.sprite)
		}
	}
}
function Upgrade(type,posX,posY,room) {
	this.type = type
	this.room = room
	this.sprite = preparedSprite(PIXI.utils.TextureCache[this.type + "upgrade.png"],0.5,0)
	this.sprite.x = posX
	this.sprite.y = posY
	this.collected = false
	upgrades.push(this)
	gameContainer.addChild(this.sprite)
	this.sprite.visible = false
	this.checkForSamus = function() {
		var diffX = Math.abs(samus.sprite.x-this.sprite.x)
		var diffY = Math.abs((samus.sprite.y-(samus.standingHeight/2))-(this.sprite.y+(this.sprite.height/2)))
		var collisionX = (this.sprite.width/2)+(cellSize/2)
		var collisionY = (this.sprite.height/2)+(samus.standingHeight/2)
		if (diffX <= collisionX && diffY <= collisionY) {
			if (type === "tank") {
				samus.maxTanks++
				samus.fullTanks = samus.maxTanks
				samus.hp = 99
			}
			if (type === "missile") {
				samus.maxMissiles += 5
				samus.missiles = samus.maxMissiles
			}
			this.collected = true
			energyDisplay.updateDisplay()
			this.sprite.visible = false
			// gameContainer.removeChild(this.sprite)
		}
	}
}