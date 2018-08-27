function MissileSector(startX,startY) {
    this.posX = startX
    this.posY = startY
    this.itemSpot = {x:startX+(cellSize*4.5),y:startY+(cellSize*3)}
    var oldSheet = currentMapSheet
    currentMapSheet = "techmap.png"
    for (var w=0;w<segmentWidth;w++) {
        new Cell(2,0,startX+(w*cellSize),startY)
        if (w===0) {
            new Post(0,1,1,0,startX,startY+cellSize,4)
            new Post(0,1,1,0,startX,startY+(cellSize*9),4)
        }
        if (w===4) {
            new Post(0,1,1,0,startX+(cellSize*4),startY+(cellSize*4),4)
        }
        if (w===8) {
            new Post(0,1,1,0,startX+(cellSize*8),startY+(cellSize*9),4)
        }
        if (w===10) {
            new Post(0,1,1,1,startX+(cellSize*11),startY+(cellSize*11),3)
        }
        if (w>=1 && w<=8) {
            new Cell(2,0,startX+(cellSize*w),startY+(cellSize*8))
        }
        if (w>=14) {
            new Cell(2,0,startX+(cellSize*w),startY+(cellSize*10))
        }
    
    }
    
    currentMapSheet = oldSheet
    new Pit(startX,startY,segmentWidth)
}
function addEnemiesToRoom(room) {
    if (room.type === "horizontal") {
        for (var s=0;s<room.sectors.length;s++) {
            var sector = room.sectors[s]
            var secLeft = sector.posX-((segmentWidth/2)*cellSize)
            var secTop = sector.posY-(cellSize/2)
            for (var g=0;g<sector.ledges.length;g++) {
                var ledge = sector.ledges[g]
            }
            for (var p=0;p<sector.enemyPipes.length;p++) {
                var pipe = sector.enemyPipes[p]
                pipe.flyer = new PipeFlyer(pipe.posX+cellSize,pipe.posY,room,pipe)
            }
            if (!(rooms.indexOf(room) === 0 && s < 2) && randomInt(1,1) && room.zone.enemyTextures.waver) {
                new Waver(secLeft+(cellSize*(randomInt(4,7))),secTop+(cellSize*((randomInt(5,8)+0.5))),room)
            }
        }
        
    }
    if (room.type === "vertical") {
        
        for (var s=0;s<room.sectors.length;s++) {
            var sector = room.sectors[s]
            var secLeft = sector.posX-((segmentWidth/2)*cellSize)
            var secTop = sector.posY-(cellSize/2)
            for (var g=0;g<sector.ledges.length;g++) {
                var ledge = sector.ledges[g]
                var includeRipper = randomInt(0,10) < 2
                if (includeRipper) {
                    if (ledge.posX > room.roomObject.posX+(cellSize*6)) {
                        var startX = ledge.posX-(cellSize)
                        new Ripper(startX,ledge.posY,room)
                        
                    } else {
                        var startX = ledge.posX+(cellSize*ledge.length)
                        new Ripper(startX,ledge.posY,room)
                    }
                }
                
            }
            
        }
        
    }
    if (room.type === "prelude") {
        for (var s=0;s<room.sectors.length;s++) {
            var sector = room.sectors[s]
            var secLeft = sector.posX-((segmentWidth/2)*cellSize)
            var secTop = sector.posY-(cellSize/2)
            var randCeiling = randomInt(0,2)
            if (randCeiling === 0) {
                if (room.zone.enemyTextures.bomber) {
                    var bomber = new Bomber(secLeft+(cellSize*randomInt(2,segmentWidth-2)+(cellSize/2)),secTop+((6)*cellSize),room)
                }
            } else if (randCeiling === 1) {
                if (room.zone.enemyTextures.diver) {
                    var diver = new Diver(secLeft+(cellSize*randomInt(2,segmentWidth-2)+(cellSize/2)),secTop+((6)*cellSize),room)
                }
            } else if (randCeiling === 2) {
                if (room.zone.enemyTextures.swooper) {
                    new Swooper(secLeft+(cellSize*randomInt(2,segmentWidth-2)+(cellSize/2)),secTop+((6)*cellSize),room)
                }
            }
            new Crawler(secLeft+(randomInt(4,segmentWidth-4)*cellSize),secTop+((segmentHeight-2)*cellSize),room)
        }
    }
}
function decorateRoom(room) {
    var lastFloorHeight = randomInt(2,4)
    var lastCeilingHeight = randomInt(2,4)
    var lastFloorStyle = "floor"
    if (room.type === "horizontal") {
        for (var s=0;s<room.sectors.length;s++) {
            var xProgress = 0
            var sector = room.sectors[s]
            sector.ledges = []
            sector.enemyPipes = []
            var secLeft = sector.posX-((segmentWidth/2)*cellSize)
            var secTop = sector.posY-(cellSize/2)
            var randoVert = randomInt(0,1)
            var leftDoorSector = (s === 0 && room.leftDoor === "door")
            var rightDoorSector = (s === room.sectors.length-1 && room.rightDoor === "door")
            var leftEnd = (s===0)
            var rightEnd = (s===room.sectors.length-1)	
            sector.leftDoor = leftDoorSector
            sector.rightDoor = rightDoorSector
            var wallThickness = currentZone[currentStyle].wallPattern[0].length

            if (!leftEnd && !rightEnd && randomInt(10,10) < currentZone.missileLikelihood && (s > 0 || !leftDoorSector) && (s < room.sectors.length-1 || !rightDoorSector) && !(currentZone === brinstar && currentStyle === "blue")) {
                var missileSector = new MissileSector(secLeft,secTop)
                if (randomInt(0,1)) {
                    var randUpgrade = "tank"
                } else {
                    var randUpgrade = "missile"
                }
                new Upgrade(randUpgrade,missileSector.itemSpot.x,missileSector.itemSpot.y,room)
            } else {
                var ceilingHeight = randomInt(lastCeilingHeight-1,lastCeilingHeight+1)
                if (ceilingHeight < 2 || (rooms.indexOf(room) === 0 && s < 2)) {
                    ceilingHeight = 2
                }
                if (segmentHeight-(ceilingHeight+floorHeight) < 3) {
                    ceilingHeight = lastCeilingHeight-1
                }
                if ((leftDoorSector || rightDoorSector) && ceilingHeight > 5) {
                    ceilingHeight = 5
                }
                currentZone[currentStyle].createCeiling(secLeft,secTop,segmentWidth,ceilingHeight)
                lastCeilingHeight = ceilingHeight


                if (!(rooms.indexOf(room) === 0 && s < 2) && currentZone.enemyTextures.diver) {
                    var randCeiling = randomInt(0,4)
                    if (randCeiling === 0) {
                        if (room.zone.enemyTextures.bomber) {
                            var bomber = new Bomber(secLeft+(cellSize*randomInt(2,segmentWidth-2)+(cellSize/2)),secTop+((ceilingHeight+4)*cellSize),room)
                        }
                    } else if (randCeiling === 1) {
                        if (room.zone.enemyTextures.diver) {
                            var diver = new Diver(secLeft+(cellSize*randomInt(2,6)+(cellSize/2)),secTop+((ceilingHeight+4)*cellSize),room)
                            var diver2 = new Diver(secLeft+(cellSize*randomInt(7,segmentWidth-2)+(cellSize/2)),secTop+((ceilingHeight+4)*cellSize),room)

                        }
                    } else if (randCeiling === 2) {
                        if (room.zone.enemyTextures.swooper) {
                            new Swooper(secLeft+(cellSize*randomInt(2,segmentWidth-2)+(cellSize/2)),secTop+((ceilingHeight+4)*cellSize),room)
                        }
                    }
                    
                }
                 // new BreakableArea(secLeft,secTop,1,3)
                // new BreakableArea(secLeft+((segmentWidth-1)*cellSize),secTop,1,3)
                if (room.sectors.length > 1 && !(rooms.indexOf(room) === 0 && s < 2)) {
                    if (leftDoorSector || leftEnd) {
                        var startX = secLeft+(randomInt(segmentWidth/2,segmentWidth-4)*cellSize)
                    } else if (rightDoorSector || rightEnd) {
                        var startX = secLeft+(randomInt(2,segmentWidth/2)*cellSize)
                    } else {
                        var startX = secLeft+(randomInt(2,segmentWidth-4)*cellSize)
                    }
                    if (!leftDoorSector && !rightDoorSector && randoVert === -1) {
                        // new BreakableArea(startX,secTop+(cellSize*randomInt(ceilingHeight,ceilingHeight+2)),randomInt(1,6),randomInt(1,5))
                    } else if (!leftDoorSector && !rightDoorSector && randoVert === 1) {
                        var shrubWidth = randomInt(1,3)
                        var shrubHeight = randomInt(1,1)
                        var xSpan = shrubWidth*4
                        startX = secLeft+(randomInt(2,(segmentWidth-xSpan))*cellSize)
                        new Shrubbery(startX,sector.posY-(cellSize/2),shrubWidth,shrubHeight)
                    } else if (randoVert === 2) {
                        var clusters = randomInt(1,3)
                        var spaceX = randomInt(2,4)
                        var spaceY = randomInt(0,1)
                        var xSpan = 4+((spaceX)*(clusters-1))
                        if (leftDoorSector) {
                            startX = secLeft+(randomInt(4,(segmentWidth-xSpan))*cellSize)
                        } else if (rightDoorSector) {
                            startX = secLeft+(randomInt(2,(segmentWidth-xSpan-6))*cellSize)
                        } else {
                            startX = secLeft+(randomInt(2,(segmentWidth-xSpan))*cellSize)
                        }
                        
                        new BulkCluster(startX,sector.posY-(cellSize/2),clusters,spaceX,spaceY,1)
                
                    }
                }
                
                if (room.startPos.x === room.endPos.x) {
                    console.log("room " + room.startPos.x + " " + room.endPos.x + " " + room.startPos.y + " " + room.endPos.y + " one width")
                    var startX = secLeft+(cellSize*wallThickness)
                    var floorLength = segmentWidth-(wallThickness*2)
                } else {
                    if (leftDoorSector || leftEnd) {
                        var startX = secLeft+(cellSize*wallThickness)
                        var floorLength = segmentWidth-wallThickness
                    } else if (rightDoorSector || rightEnd) {
                        var startX = secLeft
                        var floorLength = segmentWidth-wallThickness
                    } else {
                        var startX = secLeft
                        var floorLength = segmentWidth
                    }
                }
                if (!(rooms.indexOf(room) === 0 && s <= 2) && randomInt(0,10) < currentZone.pitLikelihood) {
                    new Pit(startX,sector.posY-(cellSize/2),floorLength)
                    if (room.zone.enemyTextures.dragon) {
                        new Dragon(startX+(cellSize*3),sector.posY+(segmentHeight*cellSize)-(cellSize*2),room)
                    }
                    if (room.zone.enemyTextures.squeept) {
                        new Squeept(startX+(cellSize*8),sector.posY+((segmentHeight)*cellSize)-(cellSize*2),room)
                    }
                    if (lastFloorStyle === "pit") {
                        if (!leftDoorSector) {
                            var randWidth1 = randomInt(4,7)
                            var ledge = new Ledge(secLeft+(randomInt(0,2)*cellSize),secTop+((segmentHeight-randomInt(3,5))*cellSize),randWidth1)
                            sector.ledges.push(ledge)
                        }
                        if (!rightDoorSector) {
                            var randWidth2 = randomInt(4,7)
                            if (randomInt(0,1)) {
                                if (randomInt(0,1)) {
                                    var postStyle = [0,7,7,0]
                                } else {
                                    var postStyle = [0,9,9,9]
                                }
                                new Post(postStyle[0],postStyle[1],postStyle[2],postStyle[3],secLeft+(Math.round(segmentWidth-randWidth2)*cellSize),secTop+((segmentHeight-randomInt(randWidth2+4,randWidth2+6))*cellSize),randWidth2)
                            } else {
                                var ledge = new Ledge(secLeft+(Math.round(segmentWidth-randWidth2-2)*cellSize),secTop+((segmentHeight-randomInt(3,4))*cellSize),randWidth2)
                                sector.ledges.push(ledge)
                            }
                        }
                    } else {
                        var randWidth1 = randomInt(4,7)
                        var ledge = new Ledge(secLeft+(Math.round(segmentWidth-randomInt(randWidth1+2,randWidth1+6))*cellSize),secTop+((segmentHeight-randomInt(3,5))*cellSize),randWidth1)
                        if (randomInt(0,1)) {
                            new Crawler(ledge.posX+(cellSize/2),ledge.posY-(cellSize/2),room,ledge)
                        }
                        sector.ledges.push(ledge)
                    }
                    lastFloorHeight = 0
                    lastFloorStyle = "pit"
                } else {
                    if (!(rooms.indexOf(room) === 0 && s < 2)) {
                        var floorHeight = lastFloorHeight+randomInt(-2,2)
                        if (floorHeight === lastFloorHeight) {
                            floorHeight++
                        }
                        if (floorHeight < 2) {
                            floorHeight = 2
                        }
                        if (floorHeight > segmentHeight-5) {
                            floorHeight = segmentHeight-5
                        }
                        if ((leftDoorSector || rightDoorSector) && floorHeight > 7) {
                            floorHeight = 7
                        }
                        
                    } else {
                        var floorHeight = 2
                    }
                    var floorRand = randomInt(0,10)
                    if (leftDoorSector || rightDoorSector || floorRand < 2 || (rooms.indexOf(room) === 0 && s < 2)) {
                        // floor only
                        new Crawler(secLeft+(cellSize*randomInt(1,segmentWidth-2)+newPixelSize),secTop+((segmentHeight-floorHeight)*cellSize)-(cellSize/2),room)
                        currentZone[currentStyle].createFloor(startX,Math.floor(secTop+((segmentHeight-2)-(floorHeight-2))*cellSize),floorLength,floorHeight)
                    } else {
                        // enemy pipes
                        var pipes = 0
                        var pipeDepth = randomInt(0,(floorHeight-2))
                        var pipeXPos = randomInt(2,segmentWidth-(4+(wallThickness)))
                        var pipeX = secLeft+(pipeXPos*cellSize)
                        var pipeY = Math.floor((secTop+((segmentHeight-2)-(floorHeight-2))*cellSize)+(pipeDepth*cellSize))
                        var pipeRand = randomInt(0,2)
                        if (pipeRand === 0) {
                            var pipe = new EnemyPipe(pipeX,pipeY)
                            pipe.depth = pipeDepth
                            sector.enemyPipes.push(pipe)
                            pipes = 1
                        } else if (pipeRand === 1) {
                            pipeX = pipeX+(cellSize*2)
                            pipeXPos += 2
                            var pipe = new EnemyPipe(pipeX,pipeY)
                            pipe.depth = pipeDepth
                            sector.enemyPipes.push(pipe)
                            pipes = 1
                        } else {
                            var pipe = new EnemyPipe(pipeX,pipeY)
                            sector.enemyPipes.push(pipe)
                            pipe.depth = pipeDepth
                            pipes = 1
                            if (!randomInt(0,2)) {
                                var pipe = new EnemyPipe(pipeX+(cellSize*2),pipeY)
                                pipe.depth = pipeDepth
                                sector.enemyPipes.push(pipe)
                                pipes = 2
                            }
                            
                        }
                        currentZone[currentStyle].createFloor(secLeft,Math.floor(secTop+((segmentHeight-2)-(floorHeight-2))*cellSize),pipeXPos,floorHeight)
                        currentZone[currentStyle].createFloor(pipeX,Math.floor(secTop+((segmentHeight-2)-(floorHeight-3))*cellSize+(pipeDepth*cellSize)),pipes*2,floorHeight-pipeDepth)
                        currentZone[currentStyle].createFloor(pipeX+(pipes*(cellSize*2)),Math.floor(secTop+((segmentHeight-2)-(floorHeight-2))*cellSize),segmentWidth-pipeXPos-(pipes*2),floorHeight)
                    
                    }
                    if (floorRand < 2 && !(rooms.indexOf(room) === 0 && s < 2)) {
                        var ledge = new Ledge(secLeft+(cellSize*4),secTop+((segmentHeight-floorHeight-3)*cellSize),8)
                        new Crawler(ledge.posX+(cellSize/2),ledge.posY-(cellSize/2),room,ledge)
                    }
                    
                    lastFloorHeight = floorHeight
                    lastFloorStyle = "floor"
                }
            }
        }
    }
    if (room.type === "vertical") {
        var lastXPos = 0
        var lastYPos = 0
        var lastWidth = 0
        var wallThickness = currentZone[currentStyle].wallPattern[0].length
        for (var s=0;s<room.sectors.length;s++) {
            var xProgress = 0
            var sector = room.sectors[s]
            sector.ledges = []
            var leftEdge = sector.posX-((segmentWidth/2)*cellSize)+(cellSize*wallThickness)
            var rightEdge = sector.posX+((segmentWidth/2)-wallThickness)*cellSize
            var secTop = sector.posY
            var randoVert = randomInt(0,2)
            var leftDoorSector = (room.doorLocations[0].indexOf(s) !== -1)
            var rightDoorSector = (room.doorLocations[1].indexOf(s) !== -1)
            sector.leftDoor = leftDoorSector
            sector.rightDoor = rightDoorSector
            if (leftDoorSector) {
                new Ledge(leftEdge,secTop+(cellSize*8),3)
            }
            if (rightDoorSector) {
                new Ledge(rightEdge-(cellSize*3),secTop+(cellSize*8),3)
            }
            var numberOfLedges = randomInt(3,5)
            if (leftDoorSector && rightDoorSector) {
                numberOfLedges = randomInt(2,3)
            }
            if (!(s===room.sectors.length-1 && room.landing === "landing")) {
                for (var g=0;g<numberOfLedges;g++) {
                    var randWidth = randomInt(currentZone.ledgeRange.min,currentZone.ledgeRange.max)
                    // if (leftDoorSector && rightDoorSector) {
                    //     var xPos = rightEdge-(randomInt(randWidth+3,segmentWidth-7)*cellSize)
                    // } else if (leftDoorSector) {
                    //     var xPos = rightEdge-(randomInt(randWidth,segmentWidth-7)*cellSize)
                    // } else if (rightDoorSector) {
                    //     var xPos = rightEdge-(randomInt(randWidth+3,segmentWidth-4)*cellSize)
                    // } else {
                    //     var xPos = rightEdge-(randomInt(randWidth,segmentWidth-4)*cellSize)
                    // }
                    if (g % 2 === 0) {
                        if (!leftDoorSector) {
                            var xPos = leftEdge
                        } else {
                            var xPos = leftEdge+(Math.floor((segmentWidth-4-(randWidth/2))/2)*cellSize)
                        }
                    } else {
                        if (!rightDoorSector) {
                            var xPos = rightEdge-(randWidth*cellSize)
                        } else {
                            var xPos = leftEdge+(Math.floor((segmentWidth-4-(randWidth/2))/2)*cellSize)
                        }
                    }
                    if (g % 4 === 0) {
                        var xPos = leftEdge+(Math.floor((segmentWidth-4-(randWidth/2))/2)*cellSize)
                    }
                    
                    var yPos = secTop+(Math.floor(segmentHeight/numberOfLedges)*(g)*cellSize)
                    
                    if (g > 0 && xPos === lastXPos && randWidth === lastWidth) {
                        if (!leftDoorSector) {
                            var xPos = leftEdge
                        } else if (!rightDoorSector) {
                            var xPos = rightEdge-(randWidth*cellSize)
                        }
                    }
                    var ledge = new Ledge(xPos,yPos,randWidth)
                    sector.ledges.push(ledge)
                    if (!randomInt(0,2)) {
                        new Crawler(ledge.posX+(cellSize/2)+newPixelSize,ledge.posY-(cellSize/2),room,ledge)
                    }
                    lastWidth = randWidth
                    lastXPos = xPos
                    lasyYPos = yPos
                }
            }
            
        }
    }
}


function ItemRoom(item) {
    var prevMapSheet = currentMapSheet
    currentMapSheet = "techmap.png"
    this.width = segmentWidth
    this.height = segmentHeight
    this.posX = creatingAt.x
	this.posY = creatingAt.y
    this.doors = []
    var blockFloorIndexes = [0,2,4,6,7,9,11,13]
    var blockTubeIndexes = [1,5,8,12]
    for (var c=0;c<segmentWidth;c++) {
        var currentX = creatingAt.x+(c*cellSize)
        new Cell(2,0,currentX,creatingAt.y)
        new Cell(2,0,currentX,creatingAt.y+(cellSize*8))
        if (c < 8) {
            new Cell(2,0,currentX,creatingAt.y+(cellSize*5))
            new Cell(2,0,currentX,creatingAt.y+(cellSize*6))
            new Cell(3,0,currentX,creatingAt.y+(cellSize*7))
        }
        if (c===1||c===5||c===10||c===14) {
            new Cell(2,0,currentX,creatingAt.y+(cellSize*8))
        }
        if (c===0||c===4) {
            new Post(0,0,1,1,currentX,creatingAt.y+cellSize,4)
            new Post(0,0,1,1,currentX,creatingAt.y+cellSize,4)
        }
        if (c===3||c===12) {
            new Post(0,0,1,1,currentX,creatingAt.y+(cellSize*11),4)
            new Post(0,0,1,1,currentX,creatingAt.y+(cellSize*11),4)
        }
        if (c<7||c>8) {
            new Cell(0,0,currentX,creatingAt.y+(cellSize*9))
            if (c<7) {
                if (blockFloorIndexes.indexOf(c) > -1) {
                    var lowerBlockIndex = 0
                } else if (blockTubeIndexes.indexOf(c) > -1) {
                    var lowerBlockIndex = 2
                } else {
                    var lowerBlockIndex = 18
                }
            } else {                if (blockFloorIndexes.indexOf(c-2) > -1) {
                    var lowerBlockIndex = 0
                } else if (blockTubeIndexes.indexOf(c-2) > -1) {
                    var lowerBlockIndex = 2
                } else {
                    var lowerBlockIndex = 18
                }
            }
        
            new Cell(lowerBlockIndex,0,currentX,creatingAt.y+(cellSize*10))
        
        }
        if (c===8||c===9) {
            new Cell(0,0,currentX,creatingAt.y+(cellSize*5))
        }

        
    }
    new Jockey(creatingAt.x+(cellSize*5),creatingAt.y+(cellSize*2))
    new Post(0,1,1,0,creatingAt.x+(cellSize*(segmentWidth-1)),creatingAt.y+cellSize,4)
    currentZone[currentStyle].createDoorWall(creatingAt.x+(cellSize*(segmentWidth-2)),creatingAt.y,"right",this,true,false)
    
    currentMapSheet = prevMapSheet
    // for (var b=0;b<4;b++) {
    //     var posX = creatingAt.x-(cellSize*4)-(cellSize*4*b)
    //     new BulkPiece(posX,creatingAt.y)
    //     new BulkPiece(posX,creatingAt.y+(4*cellSize))
    //     new BulkPiece(posX,creatingAt.y+(8*cellSize))
    //     new BulkPiece(posX,creatingAt.y+(12*cellSize),1)
    // }
}
function ElevatorRoom(segmentsHigh,leftDoor,rightDoor) {
    var prevMapSheet = currentMapSheet
    var cellsWide = segmentWidth
    var cellsHigh = segmentsHigh*segmentWidth
    this.doors = []
    this.width = segmentWidth*cellSize
	this.height = cellsHigh*cellSize
    this.posX = creatingAt.x
	this.posY = creatingAt.y
    currentMapSheet = "techmap.png"
    var blockFloorIndexes = [0,2,4,6,7,9,11,13]
    var blockTubeIndexes = [1,5,8,12]
    for (var c=0;c<cellsWide-2;c++) {
        if (blockFloorIndexes.indexOf(c) > -1) {
            var lowerBlockIndex = 0
        } else if (blockTubeIndexes.indexOf(c) > -1) {
            var lowerBlockIndex = 2
        } else {
            var lowerBlockIndex = 18
        }
        
            new Cell(0,0,creatingAt.x+((c+1)*cellSize),creatingAt.y)
            new Cell(lowerBlockIndex,0,creatingAt.x+((c+1)*cellSize),creatingAt.y+cellSize)
        if (c < 6 || c > 7) {
            if (c===1||c===3||c===5||c===8||c===10||c===12) {
                lowerBlockIndex = 0
            } else if (c===0||c===4||c===9||c===13) {
                lowerBlockIndex = 2
            } else {
                lowerBlockIndex = 18
            }
            new Cell(0,0,creatingAt.x+((c+1)*cellSize),creatingAt.y+(cellSize*8))
            new Cell(lowerBlockIndex,0,creatingAt.x+((c+1)*cellSize),creatingAt.y+(cellSize*9))
        }
    }
    
    // var blockWallIndexes = [0,1,4,8,9]
    // for (var c=0;c<segmentHeight;c++) {
    //     if (c < 5 || c > 7) {
    //         if (blockWallIndexes.indexOf(c) > -1) {
    //             new Cell(0,0,creatingAt.x,creatingAt.y+(c*cellSize))
    //             new Cell(0,0,creatingAt.x+((segmentWidth*1-1)*cellSize),creatingAt.y+(c*cellSize))
    //         } else if (c === 2 || c=== 3) {
    //             new Cell(1,0,creatingAt.x,creatingAt.y+(c*cellSize))
    //             new Cell(1,0,creatingAt.x+((segmentWidth*1-1)*cellSize),creatingAt.y+(c*cellSize))
    //         }
    //     }
    // }
    new Post(0,0,1,0,creatingAt.x,creatingAt.y,5)
    new Post(0,0,1,0,creatingAt.x+((segmentWidth-1)*cellSize),creatingAt.y,5)
    new Post(0,0,0,0,creatingAt.x,creatingAt.y+(cellSize*8),2)
    new Post(0,0,0,0,creatingAt.x+((segmentWidth-1)*cellSize),creatingAt.y+(cellSize*8),2)

    if (!leftDoor) {
        new Post(0,1,1,1,creatingAt.x,creatingAt.y+(cellSize*5),3)
    }
    if (!rightDoor) {
        new Post(0,1,1,1,creatingAt.x+((segmentWidth-1)*cellSize),creatingAt.y+(cellSize*5),3)
    }
    
    
    var shaftNeeded = (cellsPerHeight-8)+(cellsPerHeight*(segmentsHigh-1))
    for (var e=0;e<shaftNeeded;e++) {
        new Cell(7,0,creatingAt.x+(cellSize*7),creatingAt.y+(cellSize*8)+(cellSize*e))
        new Cell(8,0,creatingAt.x+(cellSize*8),creatingAt.y+(cellSize*8)+(cellSize*e))
    }
    currentMapSheet = prevMapSheet
    if (leftDoor) {
        this.doorWallLeft = currentZone[currentStyle].createDoorWall(creatingAt.x,creatingAt.y,"left",this,true)
    }
    if (rightDoor) {
	    this.doorWallRight = currentZone[currentStyle].createDoorWall(creatingAt.x+((cellsWide-2)*cellSize),creatingAt.y,"right",this,true)
    }
    this.elevator = new Elevator(creatingAt.x+(cellSize*7),creatingAt.y+(cellSize*8)-(newPixelSize))
    // this.elevator.sprite.x = Math.round(this.elevator.sprite.x)
    // this.elevator.sprite.y = Math.floor(this.elevator.sprite.y)
    // console.log(this.doors)
    // console.log("is elev doors")
}
function PreludeRoom(segmentsWide) {
    var prevMapSheet = currentMapSheet
   
    var cellsWide = segmentsWide*segmentWidth
    this.doors = []
    this.width = cellsWide*cellSize
	this.height = segmentHeight*cellSize
    this.posX = creatingAt.x
	this.posY = creatingAt.y
    currentMapSheet = "techmap.png"
    for (var c=0;c<cellsWide;c++) {
        new Cell(19,0,creatingAt.x+(c*cellSize),creatingAt.y)
        new Cell(19,0,creatingAt.x+(c*cellSize),creatingAt.y+cellSize)

        if (c % 2 === 0 && c > 5 && c < cellsWide-8) {
            if (!randomInt(0,3)) {
                new Bush(creatingAt.x+(c*cellSize),creatingAt.y+(cellSize*(segmentHeight-3)))
            }
        }

        new Cell(19,0,creatingAt.x+(c*cellSize),creatingAt.y+(cellSize*(segmentHeight-2)))
        new Cell(19,0,creatingAt.x+(c*cellSize),creatingAt.y+(cellSize*(segmentHeight-1)))
    }
    for (var p=0;p<9;p++) {
        new Cell(2,0,creatingAt.x+(p*cellSize),creatingAt.y+(cellSize*8))
        new Cell(2,0,creatingAt.x+((cellsWide-1)*cellSize)-(p*cellSize),creatingAt.y+(cellSize*8))
    }
    new Cell(0,0,creatingAt.x+(cellSize*5),creatingAt.y+(cellSize*9))
    new Cell(0,0,creatingAt.x+(cellSize*5),creatingAt.y+(cellSize*10))
    new Cell(1,0,creatingAt.x+(cellSize*5),creatingAt.y+(cellSize*11))
    new Cell(1,0,creatingAt.x+(cellSize*5),creatingAt.y+(cellSize*12))
    new Cell(0,0,creatingAt.x+((cellsWide-6)*cellSize),creatingAt.y+(cellSize*9))
    new Cell(0,0,creatingAt.x+((cellsWide-6)*cellSize),creatingAt.y+(cellSize*10))
    new Cell(1,0,creatingAt.x+((cellsWide-6)*cellSize),creatingAt.y+(cellSize*11))
    new Cell(1,0,creatingAt.x+((cellsWide-6)*cellSize),creatingAt.y+(cellSize*12))
    for (var c=0;c<segmentHeight;c++) {
        if (c < 5 || c > 8) {
            new Cell(19,0,creatingAt.x,creatingAt.y+(c*cellSize))
            new Cell(19,0,creatingAt.x+((segmentWidth*segmentsWide-1)*cellSize),creatingAt.y+(c*cellSize))
        }
    }

    currentMapSheet = prevMapSheet
    this.doorWallLeft = currentZone[currentStyle].createDoorWall(creatingAt.x,creatingAt.y,"left",this,true)
	this.doorWallRight = currentZone[currentStyle].createDoorWall(creatingAt.x+((cellsWide-2)*cellSize),creatingAt.y,"right",this,true)
    
}

function Hallway(segmentsWide,topThickness,bottomThickness) {
    var cellsWide = segmentsWide*segmentWidth
    // console.log("hall wid " + cellsWide)
    this.cellsSpanned = []
    this.startCoords = mapCoordsOfXY(creatingAt.x,creatingAt.y)
	this.neighbor = {left:undefined,right:undefined}
	this.doors = []
	this.width = cellsWide*cellSize
	this.height = 5*cellSize
	this.posX = creatingAt.x
	this.posY = creatingAt.y
	this.doorWallLeft = currentZone[currentStyle].createDoorWall(creatingAt.x,creatingAt.y,"left",this,true)
	this.doorWallRight = currentZone[currentStyle].createDoorWall(creatingAt.x+((cellsWide-2)*cellSize),creatingAt.y,"right",this,true)

	for (var w=0;w<cellsWide;w++) {
        for (var t=0;t<topThickness;t++) {
		    new Cell(16,0,creatingAt.x+(w*cellSize),creatingAt.y+cellSize*(4-t))
        }
        for (var b=0;b<bottomThickness;b++) {
		    new Cell(16,0,creatingAt.x+(w*cellSize),creatingAt.y+(cellSize*(8+b)))
        }
	}
    
	// rooms.push(this)
}
function HorizontalRoom(segmentsWide,segmentsHigh,leftEnd,rightEnd,pitLocations) {
    var cellsWide = segmentsWide*segmentWidth
    var cellsHigh = segmentsHigh*segmentHeight
    
    this.width = cellsWide*cellSize
    this.height = cellsHigh*cellSize
	this.cellsSpanned = []
    this.startCoords = mapCoordsOfXY(creatingAt.x,creatingAt.y)
    
	this.neighbor = {"left":undefined,"right":undefined}
	this.doors = []
    this.ceilingY = creatingAt.y-cellSize*(cellsHigh-15)
	var ceilingY = -cellSize*(cellsHigh-15)
    var floorY = creatingAt.y+((cellsHigh-2)*cellSize)
	// var ceiling = new Ceiling(creatingAt.x+(cellSize*2),creatingAt.y+ceilingY,cellsWide-2)
	// var floor = new Floor(creatingAt.x,creatingAt.y+((cellsHigh-2)*cellSize),cellsWide,1)
    
    
    if (rooms.length === 1) {
        var oldZone = currentZone
        var oldStyle = currentStyle
        changeCreationZone(brinstar,"blue")
        new MaruMariPedestal(creatingAt.x+(3*cellSize),creatingAt.y+((segmentHeight-5)*cellSize))
        var bulkCluster = new BulkCluster(creatingAt.x+(10*cellSize),creatingAt.y+(3*cellSize),3,1,2,1)
        new LandingPad(creatingAt.x+(21*cellSize),creatingAt.y+((segmentHeight-3)*cellSize))
        changeCreationZone(oldZone,oldStyle)
    }
    // var mound = randomInt(1,1)
    // if (mound) {
    //     var width = randomInt(2,5)
    //     var height = randomInt(2,5)
    //     currentZone[currentStyle].createFloor(creatingAt.x+(cellSize*37),floorY-(cellSize*height),width,height)
    //     if (randomInt(1,1)) {
    //         var pipe = new EnemyPipe(creatingAt.x+(cellSize*(36+Math.floor(width/2))),floorY-(cellSize*(height+1)))
    //     }
    // }

    // currentZone[currentStyle].createFloor(creatingAt.x+(cellSize*37),floorY-(cellSize*4),5,4)
    // var pipe = new EnemyPipe(creatingAt.x+(cellSize*39),floorY-(cellSize*5))
   
    this.width = cellsWide*cellSize
	this.height = cellsHigh*cellSize
	this.posX = creatingAt.x
	this.posY = creatingAt.y
	if (leftEnd === "door") {
        currentZone[currentStyle].createDoorWall(creatingAt.x,creatingAt.y,"left",this)
        var newDoor = this.doors[this.doors.length-1]
        var ledgeWidth = randomInt(3,4)
        new Ledge(newDoor.sprite.x+cellSize,newDoor.sprite.y+(cellSize*3),ledgeWidth)
    } else {
        new ShaftWall(creatingAt.x,creatingAt.y,currentZone[currentStyle].wallPattern.length,3)
					
    }
	if (rightEnd === "door") {  
        currentZone[currentStyle].createDoorWall(creatingAt.x+((cellsWide-2)*cellSize),creatingAt.y,"right",this)
        var newDoor = this.doors[this.doors.length-1]
        var ledgeWidth = randomInt(3,4)
        new Ledge(newDoor.sprite.x-(cellSize*ledgeWidth),newDoor.sprite.y+(cellSize*3),ledgeWidth)
	} else {
        new ShaftWall(creatingAt.x+((cellsWide-2)*cellSize),creatingAt.y,currentZone[currentStyle].wallPattern.length,3)
					
    }
	
	// var ledge1 =  new Ledge(creatingAt.x+(cellSize*randomInt(31,32)),floorY-(cellSize*2),randomInt(5,8))
    // var bulkCluster = new BulkCluster(creatingAt.x+(18*cellSize),creatingAt.y+(3*cellSize),3,2,2,1)
	// var shrubbery = new Shrubbery(creatingAt.x+(cellSize*44),creatingAt.y,2,3)
	// var breakable = new BreakableArea(creatingAt.x+(cellSize*32),creatingAt.y+(cellSize*8),7,4)
    // var post = new Post(0,9,9,0,creatingAt.x+(cellSize*54),creatingAt.y+(cellSize*4),5)

    // console.log("ROOM " + rooms.length + " at " + this.posX + ", " + this.posY)
    // console.log("ROOM COORDS " + this.startCoords.x + ", " + this.startCoords.y)

	// rooms.push(this)
	
}

function VerticalRoom(segmentsWide,segmentsHigh,doorLocationArray,topStyle) {
    var cellsWide = segmentsWide*segmentWidth
    var cellsHigh = segmentsHigh*segmentHeight
    this.width = cellsWide*cellSize
    this.height = cellsHigh*cellSize
    this.cellsSpanned = []
	this.connectedRooms = []
    this.startCoords = mapCoordsOfXY(creatingAt.x,creatingAt.y)
    // console.log("room2 start at " + this.startCoords.x + ", " + this.startCoords.y)
    // mapGrid[this.startCoords.y][this.startCoords.x] = 2
    
	this.doors = []
    this.ceilingY =  creatingAt.y-(cellSize*(cellsHigh-15))
	var ceilingY = creatingAt.y-(cellSize*(cellsHigh-15))
	var floorY = creatingAt.y+((cellsPerHeight-2)*cellSize)

    // currentZone[currentStyle].createFloor(creatingAt.x,creatingAt.y+((segmentHeight-2)*cellSize),cellsWide,2,this)
    // for (var b=0;b<4;b++) {
    //     if (b === 3) {
    //         var trim = 1
    //     } else {
    //         var trim = 0
    //     }
    //     new BulkPiece(creatingAt.x,creatingAt.y+(segmentHeight*cellSize)+(b*4*cellSize),trim)
    //     new BulkPiece(creatingAt.x+(cellSize*4),creatingAt.y+(segmentHeight*cellSize)+(b*4*cellSize),trim)
    //     new BulkPiece(creatingAt.x+(cellSize*8),creatingAt.y+(segmentHeight*cellSize)+(b*4*cellSize),trim)
    //     new BulkPiece(creatingAt.x+(cellSize*12),creatingAt.y+(segmentHeight*cellSize)+(b*4*cellSize),trim)
    // }

	var floorY = creatingAt.y+(13*cellSize)
	this.width = cellsWide*cellSize
	this.height = cellsHigh*cellSize
	this.posX = creatingAt.x
	this.posY = creatingAt.y
	
	var leftWallNeeded = cellsHigh/5
	var rightWallNeeded = cellsHigh/5
	// var rightWall = new ShaftWall(creatingAt.x+((cellsWide-2)*cellSize),creatingAt.y-((cellsHigh-15)*cellSize),rightWallNeeded)
	
	for (var s=0;s<doorLocationArray.length;s++) {
		
		var currentSideArray = doorLocationArray[s]
		for (var d=0;d<currentSideArray.length;d++) {
			var doorY = currentSideArray[d]
			// new ShaftWall(creatingAt.x,creatingAt.y-((cellsHigh-15)*cellSize),doorY)
				
			if (s === 0) {
				if (currentZone[currentStyle].shrubbedWalls) {
                    var shrubs = "right"
                } else {
                    var shrubs = false
                }
				if (doorY > 0) {
					currentZone[currentStyle].createDoorWall(creatingAt.x,creatingAt.y-(doorY*(cellsPerHeight)*cellSize),"left",this,false,true)
					/// create wall under
					if (d > 0) {
						// go to top of previous door
						var prevDoorY = currentSideArray[d-1]
                        // console.log(doorY + " doorY")
                        // console.log(prevDoorY + " prevDoorY")
						var wallLength = (doorY-prevDoorY)-1
                        // console.log("building wal length " + wallLength + " under door")
                        
						var leftWall = new ShaftWall(creatingAt.x,creatingAt.y-(doorY*cellsPerHeight*cellSize)+(cellsPerHeight*cellSize),2,wallLength*3,false,shrubs)
                        
                    }

				} else { 
					currentZone[currentStyle].createDoorWall(creatingAt.x,creatingAt.y-(doorY*(cellsPerHeight)*cellSize),"left",this)
                    
                }
				if (d+1 === currentSideArray.length) {
                    // complete wall from ceiling
                    var ceiling = creatingAt.y-(cellsHigh*cellSize)+(15*cellSize)
                    var gapSize = (cellsHigh*cellSize)-((doorY+1)*(cellSize*15))
                    var unitsNeeded = gapSize/(cellSize*5)
                    // console.log("need " + unitsNeeded)
                    
                    var topLeftWall = new ShaftWall(creatingAt.x,ceiling,currentZone[currentStyle].wallPattern.length,unitsNeeded,false,shrubs)
                            
                }
                
				
	
			} else {
                if (currentZone[currentStyle].shrubbedWalls) {
                    var shrubs = "left"
                } else {
                    var shrubs = false
                }
				if (doorY > 0) {
					var doorX = (cellsWide-2)*cellSize
					currentZone[currentStyle].createDoorWall(creatingAt.x+doorX,creatingAt.y-(doorY*cellsPerHeight*cellSize),"right",this,false,true)
                    if (d > 0) {
                        var prevDoorY = currentSideArray[d-1]
					    var wallLength = (doorY-prevDoorY)-1
                        var addedGap = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                        
                        var rightWall = new ShaftWall(creatingAt.x+doorX-addedGap,creatingAt.y-(doorY*cellsPerHeight*cellSize)+(cellsPerHeight*cellSize),2,wallLength*3,false,shrubs)
                        
                    }
					
				} else {
					var doorX = (cellsWide-2)*cellSize
					currentZone[currentStyle].createDoorWall(creatingAt.x+doorX,creatingAt.y-(doorY*cellsPerHeight*cellSize),"right",this)
				}
                if (d+1 === currentSideArray.length) {
                    // complete wall from ceiling
                    var ceiling = creatingAt.y-(cellsHigh*cellSize)+(15*cellSize)
                    var gapSize = (cellsHigh*cellSize)-((doorY+1)*(cellSize*15))
                    var unitsNeeded = gapSize/(cellSize*5)
                    // console.log("need " + unitsNeeded)
                    var addedGap = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                    
                    var topRightWall = new ShaftWall(creatingAt.x+doorX-addedGap,ceiling,currentZone[currentStyle].wallPattern.length,unitsNeeded,false,shrubs)
                            
                    
                }
			}
            
			
			
		}
        
        
	}
    if (doorLocationArray[0].indexOf(0) === -1) {
        if (currentZone[currentStyle].shrubbedWalls) {
            var shrubs = "right"
        } else {
            var shrubs = false
        }
        var addedGap = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
        if (doorLocationArray[0].length > 0) {
            var wallNeeded = doorLocationArray[0][0]*3
            var wallStartY = ceilingY+(segmentsHigh-doorLocationArray[0][0])*segmentHeight*cellSize
        } else {
            var wallNeeded = cellsHigh/5
            var wallStartY = ceilingY
        }
        
        var lowLeftWall = new ShaftWall(creatingAt.x,wallStartY,currentZone[currentStyle].wallPattern.length,wallNeeded,false,shrubs)          
    }
    if (doorLocationArray[1].indexOf(0) === -1) {
        if (currentZone[currentStyle].shrubbedWalls) {
            var shrubs = "left"
        } else {
            var shrubs = false
        }
        var doorX = (cellsWide-2)*cellSize
        var addedGap = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
        if (doorLocationArray[1].length > 0) {
            var wallNeeded = doorLocationArray[1][0]*3
            var wallStartY = ceilingY+(segmentsHigh-doorLocationArray[1][0])*segmentHeight*cellSize
        } else {
            var wallNeeded = cellsHigh/5
            var wallStartY = ceilingY
        }
        var lowRightWall = new ShaftWall(creatingAt.x+doorX-addedGap,wallStartY,currentZone[currentStyle].wallPattern.length,wallNeeded,false,shrubs)          
    }
	// if (leftDoor) {
	// 	doorWall = new DoorWall(creatingAt.x,creatingAt.y,"left",this)
	// 	leftWallNeeded -= 3
	// } else {
	// 	leftWall = new BulkArea(creatingAt.x-cellSize*2,creatingAt.y,1,4)
	// }
	// if (rightDoor) {
	// 	doorWall2 = new DoorWall(creatingAt.x+((cellsWide-2)*cellSize),creatingAt.y,"right",this)
	// 	rightWallNeeded -= 3
	// } else {
	// 	rightWall = new BulkArea(creatingAt.x+(cellsWide*cellSize),creatingAt.y,1,4)
	// }
    var wallThickness = currentZone[currentStyle].wallPattern[0].length
    currentZone[currentStyle].createFloor(creatingAt.x+(cellSize*wallThickness),floorY,segmentWidth-wallThickness,2)
    currentZone[currentStyle].createCeiling(creatingAt.x+(cellSize*wallThickness),ceilingY,segmentWidth-wallThickness,2)
                
	
    
	// var yReached = floorY-(cellSize*5)
	// var lastX = undefined
	// var ledgesMade = 0
	// // for (var p=0;p<numberOfPlatforms;p++) {
    // if (topStyle === "closed") {
    //     var upperLimit = (cellSize*10)
    // } 
    if (topStyle === "landing") {
        var upperLimit = (cellSize*18)
        
        currentZone.createLanding(creatingAt.x+(cellSize*4),ceilingY+(cellSize*9))
    }
	// while (yReached-upperLimit > ceilingY) {
	// 	ledgesMade++
	// 	var randomWidth = randomInt(3,4)
	// 	var randomX = creatingAt.x+(randomInt(2,(cellsWide-randomWidth-2))*cellSize)
	// 	while (randomX === lastX) {
	// 		randomX = creatingAt.x+(randomInt(2,(cellsWide-randomWidth-2))*cellSize)
	// 	}
	// 	if (randomInt(0,1) && ledgesMade % 2 === 0) {
	// 		randomX = creatingAt.x+(cellSize*(randomInt(-1,1)+Math.round(cellsWide/2)-Math.round(randomWidth/2)))
	// 	}
	// 	lastX = randomX
	// 	var randomY = yReached-(randomInt(3,5)*cellSize)
	// 	var platform = new Ledge(randomX,randomY,randomWidth)
	// 	yReached = randomY
	// }


    // new HorizontalBarrier(this.posX,this.ceilingY+(cellSize*8))
    
	// rooms.push(this)
}