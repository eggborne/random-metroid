HWRatioY = 15
HWRatioX = 16
HWRatio = HWRatioY/HWRatioX
isTouchDevice = 'ontouchstart' in document.documentElement;
PIXI.settings.RESOLUTION = window.devicePixelRatio
if (window.innerWidth > window.innerHeight) {
	landscape = true
	screenVertical = false
	viewWidth = window.innerWidth;
	viewHeight = window.innerHeight;
	
} else {
	landscape = false
	screenVertical = true
	viewWidth = window.innerWidth
	viewHeight = viewWidth/HWRatio
}
renderer = PIXI.autoDetectRenderer({ 
	width:window.innerWidth,
	height:window.innerHeight,
	autoResize: true,
	powerPreference: 'high-performance',
	roundPixels: true
});
renderer.plugins.interaction.interactionFrequency = 1;
renderer.backgroundColor = 0x000000

// renderer.resize(window.innerWidth,window.innerHeight)

document.body.appendChild(renderer.view);
// document.getElementsByTagName("canvas")[0].style['imageRendering'] = ""

if (screenVertical) {
	if (viewWidth % 16 !== 0) {
		extraXSpace = viewWidth % 16
		viewWidth -= (viewWidth % 16)		
		extraYSpace = 0
	} else {
		extraYSpace = 0
		extraXSpace = 0
	}
	cellSize = viewWidth/16
} else {
	if (viewHeight % 16 !== 0) {
		extraYSpace = viewHeight % 16
		viewHeight -= (viewHeight % 16)
		extraXSpace = 0
		
	} else {
		extraYSpace = 0
		extraXSpace = 0
	}
	cellSize = viewHeight/15
	
}
// console.log("cellSize " + cellSize)
// console.log("extraX " + extraXSpace)
// console.log("extraY " + extraYSpace)

var spritesCreated = 0
var cellTextures = []
var scrollSpeed = Math.round(cellSize/3)

newPixelSize = cellSize/16

if (newPixelSize <= 2) {
	// newPixelSize = Math.round(cellSize/4)/4
	// cellSize = newPixelSize*16
}
// cellSize = newPixelSize*16

extraY = viewHeight-(cellSize*15)

if (screenVertical) {
	cellsPerWidth = 16
	cellsPerHeight = 15
} else {
	cellsPerWidth = viewWidth/cellSize
	cellsPerHeight = 15
}

gameHeight = cellsPerHeight*cellSize

nesBGColor = 0x1a1a1a
fingerOnScreen = false;
soundOn = true
fullscreen = false
nesPanel = undefined
joystick = undefined
touchingAt = undefined
lastLiftedDirection = undefined
stoppedPressing = -99
touchedAt = -99
clickedAt = rightClickedAt = pressedShiftAt = pressed1At = pressed2At = pressed3At = pressed4At = pressed5At = pressedTabAt = pressedUpAt = pressedLeftAt = pressedRightAt = pressedQAt = pressedEAt = -99
pressedDownAt = 0
LMBDown = RMBDown = pressingUp = pressingSpace = pressingDown = pressingLeft = pressingRight = pressingE = pressingQ = false
pressingDirections = []
cursor = {x:0,y:0}
touches = []

counter = 0
precounter = 0

creatingAt = {x:0,y:0}
pressedJumpAt = pressedShootAt = releasedJumpAt = releasedShootAt = releasedUpAt = -99
pressingJump = false
pressingShoot = false
gameStarted = true
screenTransitioning = false
lastScrollDirection = 0

gravityPower = cellSize/56
playerMovedX = 0
playerMovedY = 0
zoneLoaded = false
gameInitiated = false

function setVariables() {
	enemies = []
	gameStarted = -99
	gameInitiated = -99
	
	rightClickedAt = clickedAt = -99
	gravityPower = 180
	gapDropped = 0
	changingSpeedDuration = 0
	speedAdjustment = 0
	counter = 0
	padding = 10
	scrollSpeed = 0
	pillarsPending = 0
	totalDistance = 0
	gapPlanned = false
	sendingMines = false
	minesSent = 0
	alienHeadsAttacking = 0
	lastMine = 0
	lastGap = 0
}

// var music = new Howl({
  // src: ['assets/turbotlow.ogg'],
  // volume:0.6,
  // loop:true
// })

lastCursor = {x:0,y:0}

function setupSprites() {
	// pixelText = PIXI.utils.TextureCache["pixel.bmp"]
	
}

currentFloor = cellSize*13

stage = new PIXI.Container();
gameContainer = new PIXI.Container()
stage.addChild(gameContainer)
// stage.y = -extraY/2

stage.scroll = function() {
	var newPosX = samus.centerX()-samus.velocity.x
	var newPosY = samus.sprite.y-(samus.sprite.height/2)-samus.velocity.y
	if (samus.room.height > gameHeight) {
		var bottomLimit = samus.room.posY+(gameHeight*2)
		var topLimit = samus.room.posY
		if (newPosY < bottomLimit && newPosY > topLimit) {
			this.y -= playerMovedY
			if (nesPanel) {
				// nesPanel.container.y += playerMovedY
			}
		} else {
			if (newPosY < topLimit) {
				this.y = -topLimit+(gameHeight/2)
				samus.sprite.tint = 0xff0000
			} else {
				this.y = samus.room.posY+(samus.room.height/2)
				
			}
			// console.log(newPosY)
			// console.log("tlim " + topLimit)
		}
	} else {
		var leftLimit = samus.room.posX+(viewWidth/2)
		var rightLimit = (room4.posX-(viewWidth/2))
	
	
		if (newPosX > leftLimit && newPosX < rightLimit) {
			
			
			if (playerMovedX < 0) {
				
				lastScrollDirection = 1
			} else {
				
				lastScrollDirection = -1
			}
			this.x -= playerMovedX
		} else if (!screenTransitioning) {
			if (newPosX < rightLimit) {
				this.x = -samus.room.posX
			} else {
				this.x = samus.room.posX-(samus.room.width-viewWidth)
				// samus.sprite.tint = 0xff0000
			}
			
		}	
	}
	if (nesPanel) {
		nesPanel.container.x = -stage.x
		nesPanel.container.y = -stage.y
	}
	// debug.x = -stage.x
	// debug.y = -stage.y

}

setInputs()
setStyles()
controlPanel = undefined
joystickKilledAt = -99

cells = []
groundCells = []
activeCells = []
inactiveCells = []
rooms = []
doors = []
bullets = []
bombs = []
missiles = []

doorArray = []
elevatorArray = []

currentRoom = undefined

segmentWidth = HWRatioX
segmentHeight = HWRatioY

mapWidthInScreens = 36
mapHeightInScreens = 36

roomsFinishedAt = undefined
roomCreatingUpTo = undefined
roomsCreatedThisZone = 0
zonesCreated = []
mapSprite = undefined
mapMarker = undefined

var mapGrid = []
var sectorContainers = []
var cellObjectContainers = []
for (var e=0;e<mapHeightInScreens;e++) {
	var row = new Array(mapWidthInScreens)
	row.fill(0)
	mapGrid.push(row)
	sectorContainers.push([])
}

for (var c=0;c<mapHeightInScreens;c++) {
	var row = new Array(mapWidthInScreens)
	cellObjectContainers.push(row)
	row.fill([])
}

var zoneList = [brinstar,norfair,ripleyHideout,kraidHideout,tourian]
var screenShifting = false
var shiftSpeed = cellSize/2
lastScreenShift = -99
shiftCorrectionY = 0

roomsPlotted = roomsCreated = 0
activeZone = undefined
sectorsShowing = 0
fadingSectors = []
mapImage = undefined
lastRoom = undefined
floorCells = []
vicinityCells = []
doorLedgeMin = 3
doorLedgeMax = 3

normalDoorColor = 0x233bef
missileDoorColor = 0xd82800

rippers = []
pipeFlyers = []
crawlers = []
swoopers = []
flyers = []
divers = []
wavers = []
swoopers = []
bombers = []
dragons = []
squeepts = []
dragonFireballs = []
squeepts = []

powerups = []
upgrades = []

startingCellPos = {x:3,y:15}
function init() {
	bg = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	bg.width = cellSize*segmentWidth*mapGrid[0].length
	bg.height = cellSize*segmentHeight*mapGrid.length
	bg.tint = 0x000000
	bg.alpha = 1
	bg.x = 0
	bg.y = 0

	mapOriginX = (startingCellPos.x*segmentWidth*cellSize)
	mapOriginY = (startingCellPos.y*segmentHeight*cellSize)
	
	map = new Map()
	map.container.visible = false

	plotMap()
	samus = new Samus()
	samus.placeInRoom(rooms[0])
	
	lastCameraPos = {x:gameContainer.x,y:gameContainer.y}

	loadingScreen = new LoadingScreen()
	titleScreen = new TitleScreen()
	// gameInitiated = true

	if (screenVertical || isTouchDevice) {
		nesPanel = new NESPanel()
		// energyDisplay.container.y = (segmentHeight*cellSize)+cellSize
		// energyDisplay.container.x = cellSize
		// stage.setChildIndex(energyDisplay.container,stage.children.length-1)
	}
	energyDisplay = new EnergyDisplay()
	stage.addChild(energyDisplay.container)
	energyDisplay.container.x = cellSize*1.5
	energyDisplay.container.y = cellSize*1.5

	samus.changeGun("wave")

	// renderer.resize(viewWidth,viewHeight)
	debug = new PIXI.Text("",buttonStyle)
	stage.addChild(debug)
    requestAnimationFrame(update);
};