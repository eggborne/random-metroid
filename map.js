function Map() {
	if (!screenVertical) {
		this.cellHeight = viewHeight/mapWidthInScreens
		this.cellWidth = this.cellHeight/(segmentHeight/segmentWidth)
	} else {
		this.cellHeight = (viewHeight-extraY)/mapWidthInScreens
		this.cellWidth = this.cellHeight/(segmentHeight/segmentWidth)
	}
	// console.log("wid " + this.cellWidth)
	// console.log("hei " + this.cellHeight)
	this.cells = []
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.bg.tint = 0x555555
	this.bg.width = viewWidth
	this.bg.height = viewHeight 
	
	this.updateCells = function() {
		for (var r=0;r<mapGrid.length;r++) {
			var row = mapGrid[r]
			if (!this.cells[r]) {
				this.cells[r] = []
			}
			
			for (var c=0;c<row.length;c++) {
				var type = row[c]
				if (this.cells[r][c]) {
					var cell = this.cells[r][c]
				} else {
					var cell = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
					cell.anchor.set(0.5)
					cell.width = this.cellWidth
					cell.height = this.cellHeight
					cell.x = cell.width/2+(this.cellWidth*c)
					cell.y = cell.height/2+(this.cellHeight*r)
					this.cells[r][c] = cell
					cell.scale.x *= 0.9
					cell.scale.y *= 0.9
					cell.origScale = cell.scale.x
					this.container.addChild(cell)
					cell.alpha = 0.15
				}
								
				if (type === 0) {
					var cellTint = 0xaaaaaa
				}
				if (type === 1) {
					var cellTint = 0xff0000
				}
				if (type === 2) {
					var cellTint = 0x00ff00
				}
				if (type === 3) {
					var cellTint = 0xaa00ff
				}
				if (type === 4) {
					var cellTint = 0xffff00
				}
				if (type === 5) {
					var cellTint = 0x00ffff
				}
				cell.tint = cell.origTint = cellTint
				
			}
			
			
		}
	}
	this.removeAllButMarker = function() {
		for (var c=0;c<this.container.children.length;c++) {
			var cell = this.container.children[c]
			if (!cell.oldSpot) {
				cell.visible = false
			}
		}
	}
	this.makeAllVisible = function() {
		for (var c=0;c<this.container.children.length;c++) {
			var cell = this.container.children[c]
			
			cell.visible = true
			
		}
	}
	this.updateCells()

	this.playerMark = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.playerMark.tint = 0xaaffaa
	this.playerMark.alpha = 0.7
	this.screenRatioX = this.cellWidth/(segmentWidth*cellSize)
	this.screenRatioY = this.cellHeight/(segmentHeight*cellSize)
	this.playerMark.width = (cellsPerWidth*cellSize)*this.screenRatioX
	if (!screenVertical) {
		this.playerMark.height = (segmentHeight*cellSize)*this.screenRatioY
	} else {
		this.playerMark.height = (segmentHeight*cellSize)*this.screenRatioY
	}
	this.playerMark.anchor.set(0.5)
	this.playerMark.fullScaleX = this.playerMark.scale.x*1.1
	this.playerMark.fullScaleY = this.playerMark.scale.y*1.1
	this.playerMark.maxScaleX = this.playerMark.scale.x*15
	this.playerMark.maxScaleY = this.playerMark.scale.y*15
	this.playerMark.scale.x = this.playerMark.maxScaleX
	this.playerMark.scale.y = this.playerMark.maxScaleY
	this.playerMark.oldSpot = {}

	this.container.addChild(this.playerMark)
	this.container.visible = true
	this.container.alpha = 0.95
	// this.container.addChild(this.bg)
	
	stage.addChild(this.container)
	
}

function zoom(amount) {
	if (gameContainer.scale.x+amount > 0) {
	var oldW = gameContainer.width
	var oldH = gameContainer.height
	gameContainer.scale.x += amount
	gameContainer.scale.y += amount
	var diffX = oldW-gameContainer.width
	var diffY = oldH-gameContainer.height
	var xMove = diffX
	var yMove = diffY

	// console.log("moving x " + xMove)

	gameContainer.x += (-(startingCellPos.x)*segmentWidth*cellSize)*amount
	gameContainer.y += (-(startingCellPos.y)*segmentHeight*cellSize)*amount
	}
}

function MapOverlay() {
	this.container = new PIXI.Container()
	this.markSegment = function(posX,posY,type) {
		var marker = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
		marker.width = segmentWidth*cellSize
		marker.height = segmentHeight*cellSize
		if (type === 0) {
			marker.tint = 0xaaaaaa
		}
		if (type === 1) {
			marker.tint = 0xff0000
		}
		if (type === 2) {
			marker.tint = 0x00ff00
		}
		if (type === 3) {
			marker.tint = 0xaa00ff
		}
		if (type === 4) {
			marker.tint = 0xffff00
		}
		marker.alpha = 0.25
		marker.x = posX
		marker.y = posY
		this.container.addChild(marker)
	}
	gameContainer.addChild(this.container)
	
}
function cellOfPosition(posX,posY) {
	coords = {}
	coords.x = Math.round(posX/segmentWidth)
	coords.y = Math.round(posX/segmentHeight)
	return coords
}
function mapCoordsOfRoomStart(room) {
	var mapX = (room.posX/segmentWidth)
	var mapY = (room.posY/segmentHeight)+mapHeightInScreens-1
	return {x:mapX,y:mapY}
}
function mapCoordsOfXY(posX,posY) {
	var mapX = Math.floor(posX/(segmentWidth*cellSize))
	var mapY = Math.floor(posY/(segmentHeight*cellSize))
	
	return {x:mapX,y:mapY}
}

function plotHorizontalRoom(startPos,endPos,leftDoor,rightDoor,pitLocations) {
	// horizontal
	rooms.push({
		sectors: [],
		type: "horizontal",
		zone: currentZone,
		style: currentStyle,
		startPos: startPos,
		endPos: endPos,
		leftDoor: leftDoor,
		rightDoor: rightDoor,
		pitLocations: pitLocations,
		enemies:[]
	})
	for (var p=0;p<endPos.x-startPos.x+1;p++) {
		if (p === 0 && p === (endPos.x-startPos.x) && leftDoor === "door" && rightDoor === "door") {
			var type = 4
		} else if (p === (endPos.x-startPos.x) && rightDoor === "door") {
			var type = 3
		} else if (p === 0 && leftDoor === "door") {
			var type = 2
		} else {
			var type = 1
		}
		mapGrid[startingCellPos.y+startPos.y][startingCellPos.x+startPos.x+p] = type
	}
	// createRoomFromIndex(rooms.length-1)
	currentZone.roomIndexes.push(rooms.length-1)
	roomsPlotted++
}
function plotVerticalRoom(startPos,endPos,doorLocations,landing) {
	rooms.push({
		sectors: [],
		type: "vertical",
		zone: currentZone,
		style: currentStyle,
		startPos: startPos,
		endPos: endPos,
		doorLocations: doorLocations,
		landing: landing,
		partner:undefined,
		enemies:[]
	})
	// horizontal
	// console.log(doorLocations)
	for (var p=0;p<startPos.y-endPos.y+1;p++) {
		var left = false
		var right = false
		if (doorLocations[0].indexOf(p) > -1) {
			left = true
			// console.log("LEFT - " + doorLocations[0] + " has a " + p)
		}
		if (doorLocations[1].indexOf(p) > -1) {
			right = true
		}
		if (left && right) {
			var type = 4
		} else if (right) {
			var type = 3
		} else if (left) {
			var type = 2
		} else {
			var type = 1
		}
		mapGrid[startingCellPos.y+startPos.y-p][startingCellPos.x+startPos.x] = type
	}
	
	// var topOne = mapGrid[startingCellPos.y+startPos.y-(startPos.y+Math.abs(endPos.y))][startingCellPos.x]
	// if (topOne === 0) {
	// 	// console.log("MARKING BULK TOP ------------------------------------------------------------------------------")
	// 	// mapGrid[startingCellPos.y+startPos.y-(startPos.y+Math.abs(endPos.y))+1][startingCellPos.x] = 1
	// }
	var bottomOne = mapGrid[startingCellPos.y+startPos.y+1][startingCellPos.x]
	if (bottomOne === 0) {
		// console.log("MARKING BULK BOTTOM ------------------------------------------------------------------------------")
		// mapGrid[startingCellPos.y+startPos.y+1][startingCellPos.x+startPos.x] = 1
	}
	if (landing === "landing") {
		currentZone.landingRoomIndex = rooms.length-1
	}
	currentZone.roomIndexes.push(rooms.length-1)
	// createRoomFromIndex(rooms.length-1)
	roomsPlotted++
}
function plotHallway(startPos,endPos,topThickness,bottomThickness) {
	rooms.push({
		sectors: [],
		type: "hallway",
		zone: currentZone,
		style: currentStyle,
		startPos: startPos,
		endPos: endPos,
		topThickness: topThickness,
		bottomThickness: bottomThickness,
		enemies:[]
	})
	// horizontal
	for (var p=0;p<endPos.x-startPos.x+1;p++) {
		if (p === 0) {
			var type = 2
		} else if (p === (endPos.x-startPos.x)) {
			var type = 3
		} else {
			var type = 1
		}
		if (startPos.x === endPos.x) {
			var type = 4
		}
		mapGrid[startingCellPos.y+startPos.y][startingCellPos.x+startPos.x+p] = type
	}
	// createRoomFromIndex(rooms.length-1)
	currentZone.roomIndexes.push(rooms.length-1)
	roomsPlotted++
}
function plotPreludeRoom(startPos,endPos) {
	rooms.push({
		sectors: [],
		type: "prelude",
		zone: currentZone,
		style: currentStyle,
		startPos: startPos,
		endPos: endPos,
		leftDoor: true,
		rightDoor: true,
		enemies:[]
	})
	// horizontal
	for (var p=0;p<endPos.x-startPos.x+1;p++) {
		if (p === 0) {
			var type = 2
		} else if (p === (endPos.x-startPos.x)) {
			var type = 3
		} else {
			var type = 1
		}
		if (startPos.x === endPos.x) {
			var type = 4
		}
		mapGrid[startingCellPos.y+startPos.y][startingCellPos.x+startPos.x+p] = type
	}
	// createRoomFromIndex(rooms.length-1)
	currentZone.roomIndexes.push(rooms.length-1)
	roomsPlotted++
}
function plotElevatorRoom(startPos,endPos,leftDoor,rightDoor) {
	rooms.push({
		sectors: [],
		type: "elevator",
		zone: currentZone,
		style: currentStyle,
		startPos: startPos,
		endPos: endPos,
		leftDoor: leftDoor,
		rightDoor: rightDoor,
		partner: undefined,
		enemies:[]
	})
	if (leftDoor && rightDoor) {
		type = 4
	} else if (rightDoor) {
		type = 3
	} else if (leftDoor) {
		type = 2
	}
	mapGrid[startingCellPos.y+startPos.y][startingCellPos.x+startPos.x] = type
	for (var p=1;p<endPos.y-startPos.y+1;p++) {
		
		mapGrid[startingCellPos.y+startPos.y+p][startingCellPos.x+startPos.x] = 1
	}
	// createRoomFromIndex(rooms.length-1)
	currentZone.roomIndexes.push(rooms.length-1)
	roomsPlotted++
}
function plotItemRoom(startPos,endPos) {
	rooms.push({
		sectors: [],
		type: "item",
		zone: currentZone,
		style: currentStyle,
		startPos: startPos,
		endPos: endPos,
		enemies:[]
	})
	for (var p=0;p<endPos.y-startPos.y+1;p++) {
		
		mapGrid[startingCellPos.y+startPos.y+p][startingCellPos.x+startPos.x] = 3
	}
	var leftOne = mapGrid[startingCellPos.y+startPos.y][startingCellPos.x+startPos.x-1]
	if (leftOne === 0) {
		// console.log("MARKING BULK LEFT ------------------------------------------------------------------------------")
		// mapGrid[startingCellPos.y+startPos.y][startingCellPos.x+startPos.x-1] = 1
	}
	// createRoomFromIndex(rooms.length-1)
	currentZone.roomIndexes.push(rooms.length-1)
	roomsPlotted++
}

var pitArray = [[0,0]]

function createRoomFromIndex(roomIndex) {
	roomsCreated++
	var roomData = rooms[roomIndex]
	if (roomData.zone) {
		changeCreationZone(roomData.zone,roomData.style)
	}
	if (roomData.type === "horizontal") {
		creatingAt.x = mapOriginX+(roomData.startPos.x*segmentWidth*cellSize)
		creatingAt.y = mapOriginY+(roomData.startPos.y*segmentHeight*cellSize)
		var segmentsWide = (roomData.endPos.x-roomData.startPos.x+1)
		var segmentsHigh = 1
		for (var s=0;s<segmentsWide;s++) {
			var newSegmentContainer = new PIXI.Container()
			currentZone.sectors.push(newSegmentContainer)
			roomData.sectors.push(newSegmentContainer)
			sectorContainers[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+s] = newSegmentContainer
			gameContainer.addChild(newSegmentContainer)
			newSegmentContainer.visible = false
			newSegmentContainer.posX = creatingAt.x+(s*segmentWidth*cellSize)+((segmentWidth/2)*cellSize)
			newSegmentContainer.posY = creatingAt.y+((segmentsHigh/2)*cellSize)
			map.cells[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+s].alpha = 0.9
		}
		var newRoom = new HorizontalRoom(segmentsWide,segmentsHigh,roomData.leftDoor,roomData.rightDoor,roomData.pitLocations)
		
	}
	if (roomData.type === "vertical") {
		creatingAt.x = mapOriginX+(roomData.startPos.x*segmentWidth*cellSize)
		creatingAt.y = mapOriginY+(roomData.startPos.y*segmentHeight*cellSize)
		var segmentsWide = 1
		var segmentsHigh = (roomData.startPos.y-roomData.endPos.y+1)
		for (var s=0;s<segmentsHigh;s++) {
			var newSegmentContainer = new PIXI.Container()
			currentZone.sectors.push(newSegmentContainer)
			roomData.sectors.push(newSegmentContainer)
			sectorContainers[startingCellPos.y+roomData.startPos.y-s][startingCellPos.x+roomData.startPos.x] = newSegmentContainer
			gameContainer.addChild(newSegmentContainer)
			newSegmentContainer.visible = false
			newSegmentContainer.posX = creatingAt.x+((segmentWidth/2)*cellSize)
			newSegmentContainer.posY = creatingAt.y-(s*segmentHeight*cellSize)
			map.cells[startingCellPos.y+roomData.startPos.y-s][startingCellPos.x+roomData.startPos.x].alpha = 0.9
		}
		var newRoom = new VerticalRoom(segmentsWide,segmentsHigh,roomData.doorLocations,roomData.landing)
	}
	if (roomData.type === "hallway") {
		creatingAt.x = mapOriginX+(roomData.startPos.x*segmentWidth*cellSize)
		creatingAt.y = mapOriginY+(roomData.startPos.y*segmentHeight*cellSize)
		var segmentsWide = roomData.endPos.x-roomData.startPos.x+1
		for (s=0;s<segmentsWide;s++) {
			var newSegmentContainer = new PIXI.Container()
			currentZone.sectors.push(newSegmentContainer)
			roomData.sectors.push(newSegmentContainer)
			sectorContainers[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+s] = newSegmentContainer
			gameContainer.addChild(newSegmentContainer)
			newSegmentContainer.posX = creatingAt.x+(s*segmentHeight*cellSize)
			newSegmentContainer.posY = creatingAt.y
			map.cells[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+s].alpha = 0.9
		}
		var newRoom = new Hallway(segmentsWide,roomData.topThickness,roomData.bottomThickness)
	}
	if (roomData.type === "prelude") {
		creatingAt.x = mapOriginX+(roomData.startPos.x*segmentWidth*cellSize)
		creatingAt.y = mapOriginY+(roomData.startPos.y*segmentHeight*cellSize)
		var segmentsWide = roomData.endPos.x-roomData.startPos.x+1
		for (s=0;s<segmentsWide;s++) {
			var newSegmentContainer = new PIXI.Container()
			currentZone.sectors.push(newSegmentContainer)
			roomData.sectors.push(newSegmentContainer)
			sectorContainers[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+s] = newSegmentContainer
			gameContainer.addChild(newSegmentContainer)
			newSegmentContainer.visible = false
			newSegmentContainer.posX = creatingAt.x+(s*segmentHeight*cellSize)+((segmentWidth/2)*cellSize)
			newSegmentContainer.posY = creatingAt.y
			map.cells[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+s].alpha = 0.9
		}
		var newRoom = new PreludeRoom(segmentsWide)
	}
	if (roomData.type === "elevator") {
		creatingAt.x = mapOriginX+(roomData.startPos.x*segmentWidth*cellSize)
		creatingAt.y = mapOriginY+(roomData.startPos.y*segmentHeight*cellSize)
		var segmentsHigh = (roomData.endPos.y-roomData.startPos.y+1)
		for (s=0;s<segmentsHigh;s++) {
			var newSegmentContainer = new PIXI.Container()
			currentZone.sectors.push(newSegmentContainer)
			roomData.sectors.push(newSegmentContainer)
			sectorContainers[startingCellPos.y+roomData.startPos.y+s][startingCellPos.x+roomData.startPos.x] = newSegmentContainer
			gameContainer.addChild(newSegmentContainer)
			newSegmentContainer.visible = false
			newSegmentContainer.posX = creatingAt.x+((segmentWidth/2)*cellSize)
			newSegmentContainer.posY = creatingAt.y+(s*segmentHeight*cellSize)
			map.cells[startingCellPos.y+roomData.startPos.y+s][startingCellPos.x+roomData.startPos.x].alpha = 0.9
		}
		var newRoom = new ElevatorRoom(segmentsHigh,roomData.leftDoor,roomData.rightDoor)
		newRoom.elevator.room = rooms[roomIndex]
		
	}
	if (roomData.type === "item") {
		creatingAt.x = mapOriginX+(roomData.startPos.x*segmentWidth*cellSize)
		creatingAt.y = mapOriginY+(roomData.startPos.y*segmentHeight*cellSize)
		var newSegmentContainer = new PIXI.Container()
		currentZone.sectors.push(newSegmentContainer)
		roomData.sectors.push(newSegmentContainer)
		sectorContainers[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x] = newSegmentContainer
		gameContainer.addChild(newSegmentContainer)
		newSegmentContainer.visible = false
		newSegmentContainer.posX = creatingAt.x+((segmentWidth/2)*cellSize)
		newSegmentContainer.posY = creatingAt.y
		map.cells[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x].alpha = 0.9
		var newRoom = new ItemRoom()
	}

	rooms[roomIndex].roomObject = newRoom
	decorateRoom(rooms[roomIndex])
	addEnemiesToRoom(rooms[roomIndex])
	
	// console.log("gave a room object to room " + roomIndex)
	for (var d=0;d<newRoom.doors.length;d++) {
		var door = newRoom.doors[d]
		door.room = rooms[roomIndex]
		// console.log("assigned a room to door " + d + " of room " + roomIndex)
	}
	// console.log(rooms[roomIndex])
	
}
function changeCreationZone(newZone,newStyle) {
	
    currentZone = newZone
    currentStyle = newStyle
	// console.log("changed to " + currentZone.name + " style " + newStyle)
	
    currentMapSheet = currentZone[currentStyle].mapSheet
}
function fillSectorWithBulk(sector) {
	new BulkArea((startingCellPos.x+sector.x)*segmentWidth*cellSize,(startingCellPos.y+sector.y)*segmentHeight*cellSize,4,4)
}

function addBulkSectors() {
	console.log("ASDADSSAFDSSAGRRA!!!!!!!!!!!")
	var currentIndex = 0
	for (var r=0;r<activeZone.roomIndexes.length;r++) {
		// console.log("checking room " + r)
		var roomData = rooms[activeZone.roomIndexes[currentIndex]]
		currentIndex++
		var roomObject = roomData.roomObject
		if (!roomObject){
			console.log("addbulk found no room object for room " + r)
			continue
		}
		if (roomData.type === "horizontal") {
			changeCreationZone(roomData.zone,roomData.style)
			if (roomData.leftDoor !== "door") {
				if (roomData.leftDoor) {
					if (mapGrid[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x-1] === 0) {
						var newSegmentContainer = new PIXI.Container()
						roomData.zone.sectors.push(newSegmentContainer)
						roomData.sectors.push(newSegmentContainer)
						// newSegmentContainer.visible = false
						gameContainer.addChild(newSegmentContainer)
						
						newSegmentContainer.posX = roomObject.posX-((segmentWidth/2)*cellSize)
						newSegmentContainer.posY = roomObject.ceilingY
						sectorContainers[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x-1] = newSegmentContainer					
						new BulkArea(roomObject.posX-(segmentWidth*cellSize),roomObject.ceilingY,4,4)
						mapGrid[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x-1] = 5
						map.cells[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x-1].alpha = 0.9
					} else if (mapGrid[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x-1] !== 5) {
						new ShaftWall(roomObject.posX,roomObject.ceilingY,currentZone[currentStyle].wallPattern.length,3)
					}
				}
			}
			if (roomData.rightDoor !== "door") {
				if (roomData.rightDoor) {
					if (mapGrid[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+(roomData.endPos.x-roomData.startPos.x+1)] === 0) {
						
						var newSegmentContainer = new PIXI.Container()
						roomData.zone.sectors.push(newSegmentContainer)
						roomData.sectors.push(newSegmentContainer)
						// newSegmentContainer.visible = false
						gameContainer.addChild(newSegmentContainer)
						newSegmentContainer.visible = false
						newSegmentContainer.posX = roomObject.posX+roomObject.width+((segmentWidth/2)*cellSize)
						newSegmentContainer.posY = roomObject.ceilingY
						sectorContainers[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+(roomData.endPos.x-roomData.startPos.x+1)] = newSegmentContainer
						
						new BulkArea(roomObject.posX+roomObject.width,roomObject.ceilingY,4,4)
						mapGrid[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+(roomData.endPos.x-roomData.startPos.x+1)] = 5
						map.cells[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+(roomData.endPos.x-roomData.startPos.x+1)].alpha = 0.9
						
					} else if (mapGrid[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+(roomData.endPos.x-roomData.startPos.x+1)] !== 5) {
						
						new ShaftWall(roomObject.posX+roomObject.width-((currentZone[currentStyle].wallPattern[0].length)*cellSize),roomObject.ceilingY,currentZone[currentStyle].wallPattern.length,3)
					}
				}
			}
		}
		if (roomData.type === "vertical") {
			changeCreationZone(roomData.zone,roomData.style)
			if (roomData.landing === "closed") {
				var roomHeight = roomData.startPos.y-roomData.endPos.y
				if (mapGrid[startingCellPos.y+roomData.startPos.y-roomHeight-1][startingCellPos.x+roomData.startPos.x] === 0) {
					var newSegmentContainer = new PIXI.Container()
					roomData.zone.sectors.push(newSegmentContainer)
					roomData.sectors.push(newSegmentContainer)					
					// newSegmentContainer.visible = false
					sectorContainers[startingCellPos.y+roomData.startPos.y-roomHeight-1][startingCellPos.x+roomData.startPos.x] = newSegmentContainer
					gameContainer.addChild(newSegmentContainer)
					newSegmentContainer.visible = false
					newSegmentContainer.posX = roomObject.posX+((segmentWidth/2)*cellSize)
					newSegmentContainer.posY = roomObject.ceilingY-(segmentHeight*cellSize)
					new BulkArea(roomObject.posX,roomObject.ceilingY-(segmentHeight*cellSize),4,4)
					mapGrid[startingCellPos.y+roomData.startPos.y-roomHeight-1][startingCellPos.x+roomData.startPos.x] = 5
				} else if (mapGrid[startingCellPos.y+roomData.startPos.y-roomHeight-1][startingCellPos.x+roomData.startPos.x] !== 5) {
					currentZone[currentStyle].createCeiling(roomObject.posX+(cellSize*2),roomObject.ceilingY,segmentWidth-2,2)
				}
			}
			if (roomData.landing === "open") {

			}
			if (mapGrid[startingCellPos.y+roomData.startPos.y+1][startingCellPos.x+roomData.startPos.x] === 0) {
				var newSegmentContainer = new PIXI.Container()
				roomData.zone.sectors.push(newSegmentContainer)
				roomData.sectors.push(newSegmentContainer)
				// newSegmentContainer.visible = false
				sectorContainers[startingCellPos.y+roomData.startPos.y+1][startingCellPos.x+roomData.startPos.x] = newSegmentContainer
				gameContainer.addChild(newSegmentContainer)
				newSegmentContainer.visible = false
				newSegmentContainer.posX = roomObject.posX+((segmentWidth/2)*cellSize)
				newSegmentContainer.posY = roomObject.posY+(segmentHeight*cellSize)
				new BulkArea(roomObject.posX,roomObject.posY+(segmentHeight*cellSize),4,4)
				mapGrid[startingCellPos.y+roomData.startPos.y+1][startingCellPos.x+roomData.startPos.x] = 5
			} else if (mapGrid[startingCellPos.y+roomData.startPos.y+1][startingCellPos.x+roomData.startPos.x] !== 5) {
				currentZone[currentStyle].createFloor(roomObject.posX,roomObject.posY+((segmentHeight-2)*cellSize),segmentWidth-2,2,roomObject)
			}
		}
		if (newSegmentContainer) {
			newSegmentContainer.bulk = true
			// console.log("declaring bulk true for sector")
		}
	}
	map.updateCells()
}
function toggleMap() {
	if (!map.container.visible) {
		map.container.visible = true
		if (nesPanel) {
			// stage.setChildIndex(nesPanel.container,stage.children.length-1)
			nesPanel.mapButton.tint = 0x99ff99
		}
	} else {
		map.container.visible = false
		if (nesPanel) {
			// stage.setChildIndex(nesPanel.container,0)
			nesPanel.mapButton.tint = 0xffffff
		}
		map.playerMark.scale.x = map.playerMark.maxScaleX
		map.playerMark.scale.y = map.playerMark.maxScaleY
	}


	// if ((!mapSprite || !mapSprite.visible) && map.container.visible) {
	// 	// turn on sprite map
	// 	map.container.visible = false
	// 	mapSprite.visible = true
	// 	mapMarker.visible = true
	// 	if (nesPanel) {
	// 			nesPanel.mapButton.tint = 0x00ff00
	// 		}

	// } else {
	// 	if (mapSprite && mapSprite.visible) {
	// 		// turn both off
	// 		mapSprite.visible = false
	// 		mapMarker.visible = false
			
	// 		console.log("set scale back")
			// map.playerMark.scale.x = map.playerMark.maxScaleX
			// map.playerMark.scale.y = map.playerMark.maxScaleY
	// 	} else {
			
	// 	}
		
	// }




	// if (!mapSprite || mapSprite.visible === false) {
	// 	// if zoomed in
	
	// 	if (!map.container.visible) {
	// 		map.container.visible = true
	// 	} else {
	// 		map.container.visible = false
	// 		if (!mapSprite) {
	// 			setNewMapImage()
	// 		} else {
	// 			mapSprite.visible = true
	// 		}





			
	// 		// gameContainer.height = gameContainer.height*map.screenRatioX
	// 		// gameContainer.width = gameContainer.width*map.screenRatioY
	// 		// lastCameraPos = {x:gameContainer.x,y:gameContainer.y}
	// 		// gameContainer.x = 0
	// 		// gameContainer.y = 0
	// 		// map.removeAllButMarker()
	// 		// // map.container.visible = true
			
	// 		// // stage.addChild(map.playerMark)
			
	// 		// // map.playerMark.x = -lastCameraPos.x*map.screenRatioX+(map.cellWidthq)
	// 		// // map.playerMark.y = (-lastCameraPos.y*map.screenRatioY)+(map.playerMark.height/2)
	// 		// for (var r=0;r<sectorContainers.length;r++) {
	// 		// 	var row = sectorContainers[r]
	// 		// 	for (var s=0;s<row.length;s++) {
	// 		// 		var cont = row[s]
	// 		// 		if (cont) {
	// 		// 			// cont.visible = true
	// 		// 		}
	// 		// 	}
	// 		// }
	// 	}
	// } else {
	// 	if (!map.container.children[0].visible) {
	// 		mapSprite.visible = false
	// 		// gameContainer.scale.x = gameContainer.scale.y = 1
	// 		// gameContainer.x = lastCameraPos.x
	// 		// gameContainer.y = lastCameraPos.y
	// 		// map.makeAllVisible()
	// 		// map.container.visible = false
	// 		// for (var r=0;r<sectorContainers.length;r++) {
	// 		// 	var row = sectorContainers[r]
	// 		// 	for (var s=0;s<row.length;s++) {
	// 		// 		var cont = row[s]
	// 		// 		if (cont) {
	// 		// 			// cont.visible = false
	// 		// 		}
	// 		// 	}
	// 		// }
	// 	}
	// }
}
function compileActiveCells() {
	activeCells.length = 0
	inactiveCells.length = 0
	for (var r=0;r<cellObjectContainers.length;r++) {
		var row = cellObjectContainers[r]
		if (row.length) {
			for (var c=0;c<row.length;c++) {
				var cellArray = row[c]
				if (cellArray.length) {
					if (sectorContainers[r][c] && sectorContainers[r][c].visible) {
						for (var p=0;p<cellArray.length;p++) {
							var cellObject = cellArray[p]
							if (cellObject.sprite.visible && cellObject.container.visible) {
								activeCells.push(cellObject)
								// cellObject.sprite.tint  = 0xff0000
							}
						}
					}
					
				}
			}
		}
	}

	// debug.text = activeCells.length + " active" 
	// "\n" + inactiveCells.length + " inact"
}
function manageSectors() {
	var changed = false
	for (var r=0;r<currentRoom.sectors.length;r++) {
		var cont = currentRoom.sectors[r]
		// for (var s=0;s<row.length;s++) {
			// var cont = row[s]
			// console.log(cont)
			if (cont && cont.children.length) {
				var xDistance = Math.abs((gameContainer.x-(viewWidth/2))+cont.posX)
				var yDistance = Math.abs((samus.sprite.y-samus.standingHeight/2)-(cont.posY+cont.height/2))
				if (xDistance > preloadLength.x || yDistance > preloadLength.y) {
					if (cont.visible) {
						cont.visible = false
						changed = true
						// map.cells[r][s].tint = map.cells[r][s].origTint
					}
				} else {
					if (!cont.visible) {
						// console.log("made visible")
						cont.visible = true
						changed = true
					}
					// if (xDistance < (segmentWidth*cellSize)/2 && yDistance < (segmentHeight*cellSize)/2) {
					// 	map.cells[r][s].tint = 0x000000
					// } else {
					// 	map.cells[r][s].tint = 0xffffff
					// }
					
				}
				if (cont.visible) {
					sectorsShowing++
				}
					
				// 	map.cells[r][s].tint = 0xffffff
				// } else {
				// 	map.cells[r][s].tint = map.cells[r][s].origTint
				// }
				if (changed) {
					compileActiveCells()
				}
			// }				
		}
				
	}
	// debug.text = sectorsShowing + " sectors visible / " + currentRoom.sectors.length + "\n" + roomsCreated + " rooms built" +
	// "\n activeCells " + activeCells.length + 
	// "\nzone: " + activeZone.name +
	// "\n Room " + rooms.indexOf(currentRoom) +
	// "\n type: " + currentRoom.type
	sectorsShowing = 0
}
function setRoomVisibility(roomIndex) {
	var roomData = rooms[roomIndex]
	if (roomData.type === "vertical") {
		var roomHeight = roomData.startPos.y-roomData.endPos.y+1
		if (mapGrid[startingCellPos.y+roomData.startPos.y+1][startingCellPos.x+roomData.startPos.x] === 5) {
			var lowerBulk = sectorContainers[startingCellPos.y+roomData.startPos.y+1][startingCellPos.x+roomData.startPos.x]
			lowerBulk.visible = true
		}
		if (mapGrid[startingCellPos.y+roomData.endPos.y-1][startingCellPos.x+roomData.startPos.x] === 5) {
			var upperBulk = sectorContainers[startingCellPos.y+roomData.endPos.y-1][startingCellPos.x+roomData.startPos.x]
			upperBulk.visible = true
		}
		for (var s=0;s<roomHeight;s++) {
			var sectorContainer = sectorContainers[startingCellPos.y+roomData.startPos.y-s][startingCellPos.x+roomData.startPos.x]
			sectorContainer.visible = true
		}
	} else {
		var roomWidth = roomData.endPos.x-roomData.startPos.x+1
		if (mapGrid[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x-1] === 5) {
			var leftbulk = sectorContainers[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x-1]
			leftbulk.visible = true
		}
		if (mapGrid[startingCellPos.y+roomData.endPos.y][startingCellPos.x+roomData.endPos.x+1] === 5) {
			var rightBulk = sectorContainers[startingCellPos.y+roomData.endPos.y][startingCellPos.x+roomData.endPos.x+1]
			rightBulk.visible = true

		}
		for (var s=0;s<roomWidth;s++) {
			var sectorContainer = sectorContainers[startingCellPos.y+roomData.startPos.y][startingCellPos.x+roomData.startPos.x+s]
			sectorContainer.visible = true
		}
	}
	// addBulkSectors()
}
function getRoomFromSectorCoords(sectorCoords) {
	for (var r=0;r<rooms.length;r++) {
		var room = rooms[r]
		if (room.type === "vertical") {
			if (sectorCoords.x === room.startPos.x && sectorCoords.y <= room.startPos.y && sectorCoords.y >= room.endPos.y) {
				return room
			}
		} else {
			if (sectorCoords.x >= room.startPos.x && sectorCoords.x <= room.endPos.x && sectorCoords.y === room.startPos.y) {
				return room
			}
		}
	}
	console.log("NO ROOM FOUND AT " + sectorCoords.x + ", " + sectorCoords.y)
}
function getRoomIndexFromPos(posX,posY) {

}
function pairDoors() {
	for (var d=0;d<doorArray.length;d++) {
		var door = doorArray[d]
		for (var p=0;p<doorArray.length;p++) {
			var possiblePair = doorArray[p]
			if (!door.partner && !possiblePair.partner && possiblePair !== door && Math.round(door.sprite.y) === Math.round(possiblePair.sprite.y) && Math.round(Math.abs(possiblePair.sprite.x-door.sprite.x)) === Math.round((cellSize*3))) {
				door.partner = possiblePair
				possiblePair.partner = door
				// console.log("paired " + d + " with " + p)
				continue
			} else {
				// console.log("door dist d to p " + Math.round(Math.abs(possiblePair.sprite.x-door.sprite.x)))
				// console.log("targdistance " + Math.round((cellSize*3)))
			}
			
		}
		if (!door.partner) {
			// codnsole.log("door " + d + " no partner :(")
		}
	}
}

function shiftScreen(direction,newRoom) {
	if (samus.injured) {
		samus.injured = false
		samus.sprite.tint = 0xffffff
	}
	samus.velocity.x = 0
	samus.velocity.y = 0
	var samusMoveFrames = 30
	var samusMoveX = (cellSize*4)/samusMoveFrames
	if (direction === "right") {
		if (counter-lastScreenShift < samusMoveFrames) {
			samus.sprite.x += samusMoveX
		}
		var roomWidth = newRoom.endPos.x-newRoom.startPos.x+1
		if (roomWidth === 1) {
			var goalX = -(newRoom.roomObject.posX-(viewWidth-(segmentWidth*cellSize))/2)+(extraXSpace/2)
		} else {
			var goalX = -(newRoom.roomObject.posX-(extraXSpace/2))
		}
		if (newRoom.type !== "vertical") {
			var goalY = xPosForHorizontalRoom(newRoom)
		}
		// console.log("game cont y at " + gameContainer.y + " - goalY at " + goalY + " - shiftCorrection " + shiftCorrectionY)
		if (gameContainer.x-shiftSpeed >= goalX) {
			gameContainer.x -= shiftSpeed
		} else {
			gameContainer.x = goalX
		}
		if (shiftCorrectionY > 0) {
			if (gameContainer.y+(shiftCorrectionY/10) < goalY) {
				gameContainer.y += shiftCorrectionY/10
			} else {
				gameContainer.y = goalY
			}
		} else if (shiftCorrectionY < 0) {
			if (gameContainer.y+(shiftCorrectionY/10) > goalY) {
				gameContainer.y += shiftCorrectionY/10
			} else {
				gameContainer.y = goalY
			}
		}
		if (gameContainer.x === goalX) {
			screenShifting = false
			for (var s=0;s<lastRoom.sectors.length;s++) {
				// lastRoom.sectors[s].alpha = 1
				lastRoom.sectors[s].visible = false
			}
			shiftCorrectionY = 0
			compileActiveCells()
		}
		
	}
	if (direction === "left") {
		if (counter-lastScreenShift < samusMoveFrames) {
			samus.sprite.x -= samusMoveX
		}
		var roomWidth = newRoom.endPos.x-newRoom.startPos.x+1
		if (roomWidth === 1) {
			var goalX = -(newRoom.roomObject.posX-(viewWidth-(segmentWidth*cellSize))/2)+(extraXSpace/2)
		} else {
			var goalX = -(newRoom.roomObject.posX+(newRoom.roomObject.width-viewWidth)-(extraXSpace/2))
		}
		if (newRoom.type !== "vertical") {
			var goalY = xPosForHorizontalRoom(newRoom)
		}
		if (gameContainer.x+shiftSpeed <= goalX) {
			gameContainer.x += shiftSpeed
		} else {
			gameContainer.x = goalX
			
		}
		if (shiftCorrectionY > 0) {
			if (gameContainer.y+(shiftCorrectionY/10) < goalY) {
				gameContainer.y += shiftCorrectionY/10
			} else {
				gameContainer.y = goalY
			}
		} else if (shiftCorrectionY < 0) {
			if (gameContainer.y+(shiftCorrectionY/10) > goalY) {
				gameContainer.y += shiftCorrectionY/10
			} else {
				gameContainer.y = goalY
			}
		}
		if (gameContainer.x === goalX) {
			screenShifting = false
			for (var s=0;s<lastRoom.sectors.length;s++) {
				// lastRoom.sectors[s].alpha = 1
				lastRoom.sectors[s].visible = false
			}
			compileActiveCells()
			shiftCorrectionY = 0
			
		}
		
	}
	if (gameContainer.x === goalX) {
		// gameContainer.removeChild(samus.sprite)
		// gameContainer.addChildAt(samus.sprite,gameContainer.children.length-1)
	}
	
	
}
function cameraToSector(secX,secY) {

}
function screenCenter() {
	var centerX = -(gameContainer.x-(viewWidth/2))
	var centerY = -(gameContainer.y)+(viewHeight/2)+cellSize
	return {x:centerX,y:centerY}
}

function samusToRoomStart(room) {
	gameContainer.x = -room.roomObject.posX
	gameContainer.y = -room.roomObject.posY
}
function changeActiveZone(newZone) {
	zoneLoaded = false
	var oldZone = activeZone
	activeZone = newZone
	if (zonesCreated.indexOf(newZone) === -1) {
		roomsCreatedThisZone = 1
	} else {
		roomsCreatedThisZone = newZone.roomIndexes.length
	}
}
function setNewMapImage() {
	gameContainer.height = gameContainer.height*map.screenRatioX
	gameContainer.width = gameContainer.width*map.screenRatioY
	lastCameraPos = {x:gameContainer.x,y:gameContainer.y}
	gameContainer.x = 0
	gameContainer.y = 0
	for (var r=0;r<sectorContainers.length;r++) {
		var row = sectorContainers[r]
		for (var s=0;s<row.length;s++) {
			var cont = row[s]
			if (cont) {
				cont.visible = true
			}
		}
	}
	if (mapSprite) {
		mapSprite.destroy(true,true,true)
	}
	renderer.render(gameContainer)
	mapSprite = new PIXI.Sprite.fromImage(renderer.view.toDataURL('image/jpeg', 1))
	stage.addChild(mapSprite)
	for (var r=0;r<sectorContainers.length;r++) {
		var row = sectorContainers[r]
		for (var s=0;s<row.length;s++) {
			var cont = row[s]
			if (cont) {
				cont.visible = false
			}
		}
	}
	mapSprite.visible = false
	if (!mapMarker) {
		mapMarker = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
		mapMarker.scale.x = mapMarker.scale.y = map.playerMark.fullScale
		mapMarker.tint = map.playerMark.tint
		mapMarker.alpha = map.playerMark.alpha
		mapMarker.anchor = map.playerMark.anchor
		mapMarker.x = map.playerMark.y
		mapMarker.y = map.playerMark.y		
	}
	mapMarker.visible = false
	gameContainer.scale.x = gameContainer.scale.y = 1
	gameContainer.x = lastCameraPos.x
	gameContainer.y = lastCameraPos.y
}
function changeRoom(newRoom,leaveOld) {
	lastRoom = currentRoom
	if (!leaveOld) {
		for (var s=0;s<currentRoom.sectors.length;s++) {
			currentRoom.sectors[s].visible = false
		}
	}
	currentRoom = newRoom
}

function xPosForHorizontalRoom(room) {
	return -((startingCellPos.y+room.startPos.y)*segmentHeight*cellSize)+(extraYSpace/2)
}

function LoadingScreen() {
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.bg.tint = 0x000000
	this.bg.width = window.innerWidth+cellSize*2
	this.bg.height = window.innerHeight+cellSize*2
	this.bg.x -= cellSize
	this.bg.y -= cellSize
	this.bar = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.bar.anchor.set(0.5)
	this.bar.tint = 0xffffaa
	this.bar.x = Math.round(window.innerWidth/2)
	this.bar.y = Math.round(window.innerHeight/2)
	
	this.bar.maxWidth = viewWidth*0.8
	this.bar.width = 0
	
	this.bar.height = cellSize*1.5
	this.bar.alpha = 0.1

	this.barBG = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.barBG.anchor.set(0.5)
	this.barBG.tint = 0x774444
	this.barBG.x = this.bar.x
	this.barBG.y = this.bar.y
	this.barBG.width = this.bar.maxWidth
	this.barBG.maxHeight = cellSize
	this.barBG.height = cellSize/6
	
	this.status = new PIXI.Text("",messageStyle)
	this.status.anchor.set(0.5)
	this.status.x = this.bar.x
	this.status.y = Math.round(this.bar.y-cellSize*3.5)
	
	this.progress = new PIXI.Text("",startStyle)
	this.progress.anchor.set(0.5)
	this.progress.x = this.bar.x
	this.progress.y = this.bar.y
	// this.progress.height = Math.round(this.bar.height*0.9)

	this.metroid = new PIXI.Sprite(PIXI.utils.TextureCache["metroidgreen1.png"])
	this.metroid.anchor.set(0.5)
	this.metroid.width = this.metroid.height = this.barBG.maxHeight*3.5
	this.metroid.x = this.barBG.x
	this.metroid.y = this.barBG.y
	
	this.container.addChild(this.bg)
	this.container.addChild(this.barBG)
	this.container.addChild(this.bar)
	this.container.addChild(this.metroid)
	// this.container.addChild(this.progress)
	this.container.addChild(this.status)
	this.container.x = Math.round(this.container.x)
	this.container.y = Math.round(this.container.y)
	
	stage.addChild(this.container)
	this.container.visible = false
	
	this.operate = function() {
		console.log("loading screen operating")
		var incrementSize = this.bar.maxWidth/(activeZone.numberOfRooms-2)
		var incrementSize2 = this.barBG.maxHeight/(activeZone.numberOfRooms-2)
		this.bar.width = roomsCreatedThisZone*incrementSize
		this.barBG.height = roomsCreatedThisZone*incrementSize2
		this.bar.alpha += 0.8/(activeZone.numberOfRooms-2)
		if (roomsCreatedThisZone % 6 === 0) {
			if (this.metroid.texture === PIXI.utils.TextureCache["metroidgreen1.png"]) {
				this.metroid.texture = PIXI.utils.TextureCache["metroidgreen2.png"]
			} else {
				this.metroid.texture = PIXI.utils.TextureCache["metroidgreen1.png"]
			}
		}
		if (counter % 20 < 10) {
			this.metroid.width += newPixelSize
			this.metroid.height += newPixelSize
		} else {
			this.metroid.width -= newPixelSize
			this.metroid.height -= newPixelSize
		}
		// this.status.text = "Entering\n" + currentZone.printName
		
		// this.status.text.x = Math.round(this.status.text.x)
		// this.status.text.y = Math.round(this.status.text.y)
		// this.status.text = "loading room " + (roomsCreatedThisZone+2) + " of " + activeZone.numberOfRooms
		// this.progress.text = Math.round(((roomsCreatedThisZone+2)/activeZone.numberOfRooms)*100) + "%"
		// this.progress.HWRatio = this.progress.height/this.progress.width
		// this.progress.height = this.bar.height*0.9
		// this.progress.width = this.progress.height/this.progress.HWRatio
	}
}
function TitleScreen() {
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.bg.width = window.innerWidth
	this.bg.height = window.innerHeight
	this.bg.tint = 0x000000
	this.container.addChild(this.bg)
	this.logo = new PIXI.Sprite(PIXI.utils.TextureCache["logo.png"])
	this.logo.HWRatio = this.logo.height/this.logo.width
	this.logo.width = this.bg.width*0.7
	this.logo.height = this.logo.width*this.logo.HWRatio
	if (this.logo.height > viewHeight/2.5) {
		this.logo.height = viewHeight/2.5
		this.logo.width = this.logo.height/this.logo.HWRatio
	}
	this.logo.anchor.set(0.5)
	this.logo.x = window.innerWidth/1.95
	this.foreground = []
	this.starfield = []
	this.groundTextures = [
		"titleforeground1.png",
		"titleforeground2.png",
		"titleforeground3.png",
		"titleforeground4.png",
		"titleforeground5.png",
		"titleforeground6.png",
	]

	this.logo.y = viewHeight/3.5
	var numberOfStars = ((this.bg.width/cellSize)*(this.bg.height/cellSize))/9
	for (var s=0;s<numberOfStars;s++) {
		if (true) {
			var star = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
			star.width = newPixelSize
			star.height = newPixelSize
			var rando = randomInt(0,3)
			if (rando <= 1) {
				star.tint = 0xffffff
			}
			if (rando === 2) {
				star.tint = 0x0000a8
			}
			if (rando === 3) {
				star.tint = 0x747474
			}
			star.scrollSpeed = 0.2+(randomInt(-1,1)/24)
			star.x = randomInt(0,this.bg.width)
			star.y = randomInt(0,this.bg.height)
			this.starfield.push(star)
			this.container.addChild(star)
		}
	}
	if (screenVertical) {
		var mult = 2
	} else {
		var mult = 1
	}
	this.foregroundHeight = PIXI.utils.TextureCache["titleforegroundbg.png"].height*newPixelSize*mult
	this.foregroundWidth = PIXI.utils.TextureCache["titleforegroundbg.png"].width*newPixelSize*mult	

	var groundNeeded = Math.ceil(window.innerWidth/this.foregroundWidth)
	for (var g=0;g<groundNeeded+1;g++) {
		var bg = new PIXI.Sprite(PIXI.utils.TextureCache["titleforegroundbg.png"])
		bg.width = this.foregroundWidth
		bg.height = this.foregroundHeight
		bg.x = bg.width*g
		bg.y = window.innerHeight-this.foregroundHeight
		this.container.addChild(bg)
	}
	for (var t=0;t<this.groundTextures.length;t++) {
		for (var g=0;g<groundNeeded+1;g++) {
			var ground = new PIXI.Sprite(PIXI.utils.TextureCache[this.groundTextures[t]])
			ground.width = ground.width*newPixelSize*mult
			ground.height = ground.height*newPixelSize*mult
			ground.x = (ground.width*g)-ground.width
			// console.log("length is " + this.foreground.length + " x is " + ground.x)
			ground.y = window.innerHeight-this.foregroundHeight
			ground.scrollSpeed = 1-(0.1*t)
			if (screenVertical) {
				ground.scrollSpeed *= 0.5
			}
			this.foreground.push(ground)
			this.container.addChild(ground)
		}
	}
	if (!screenVertical) {
		this.instruction = new PIXI.Sprite(PIXI.utils.TextureCache["clickstart.png"])
	} else {
		this.instruction = new PIXI.Sprite(PIXI.utils.TextureCache["tapstart.png"])
	}
	this.instruction.width *= newPixelSize/1.5
	this.instruction.height *= newPixelSize/1.5
	this.instruction.tint = 0xA8E4FC
	this.instruction.anchor.set(0.5)
	this.instruction.x = Math.round(this.bg.width/2)
	this.instruction.y =  Math.round(this.foreground[0].y-(this.foreground[0].y-(this.logo.y+(this.logo.height/2)))/2)
	this.container.addChild(this.instruction)
	this.container.addChild(this.logo)
	this.container.interactive = true
	
	this.container.on("pointerdown",function(){
		gameInitiated = true
		this.visible = false
	})
	this.container.on("touchstart",function(){
		gameInitiated = true
		this.visible = false
	})
	this.animate = function() {
		for (var g=0;g<this.foreground.length;g++) {
			var ground = this.foreground[g]
			ground.x -= ground.scrollSpeed
			if (ground.x <= this.bg.x-ground.width) {
				ground.x += (groundNeeded+1)*ground.width
			}
		}
		for (var s=0;s<this.starfield.length;s++) {
			var star = this.starfield[s]
			star.x -= star.scrollSpeed
			if (star.x <= this.bg.x-star.width) {
				star.x += this.bg.width
			}
			if (!randomInt(0,96)) {
				star.alpha = (randomInt(0,10)*0.1)
			}
		}
		if (precounter > 0 && precounter % 50 === 0) {
			if (this.instruction.visible) {
				this.instruction.visible = false
			} else {
				this.instruction.visible = true
			}
		}
	}

	this.width = Math.round(this.width)
	this.height = Math.round(this.height)
	this.container.alpha = 0
	// this.container.visible = false
	stage.addChild(this.container)
}
function fadeRoom(room,amount) {
	// console.log("FADING BY " + amount + " AT " + counter + ". alpha before " + room.sectors[0].alpha)
	for (var s=0;s<room.sectors.length;s++) {
		var sector = room.sectors[s]
		sector.visible = false
		// var newAlpha = sector.alpha+amount
		// if (newAlpha > 0) {
		// 	sector.alpha += amount
		// 	// console.log("FADED BY " + amount + " AT " + counter + ". alpha after " + room.sectors[0].alpha)
		// } else {			
		// 	sector.alpha = 0
		// 	// console.log("setting sector to alpha 0")
		// }
	}
}
function plotMap() {
	changeActiveZone(brinstar)
	plotZone(brinstar)
	plotZone(norfair)
	plotZone(ripleyHideout)
	plotZone(kraidHideout)
	plotZone(tourian)
	attachElevators()
	map.updateCells()
}