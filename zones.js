brinstar = {
    sectors:[],
    roomIndexes: [],
    landingRoomIndex: undefined,
    name:"brinstar",
	printName: "Brinstar",
	pitType: "sand",
	pitLikelihood: 4,
	ledgeRange: {min:3,max:4},
	missileLikelihood: 2,
	enemyTextures: {
		ripper:[["ripperfrozen.png"],["ripperbrinstaryellow.png"],["ripperbrinstarorange.png"],["ripperbrinstarred.png"]],
		pipeFlyer:[["zebfrozen1.png","zebfrozen2.png"],["zebyellow1.png","zebyellow2.png"],["zeborange1.png","zeborange2.png"],["zebred1.png","zebred2.png"]],
		crawler:["crawlerfrozen.png","crawlerbrinstaryellow.png","crawlerbrinstarorange.png","crawlerbrinstarred.png"],
		diver:[["skreefrozen1.png","skreefrozen2.png","skreefrozen3.png"],["brinstarskreeyellow1.png","brinstarskreeyellow2.png","brinstarskreeyellow3.png"],["brinstarskreeorange1.png","brinstarskreeorange2.png","brinstarskreeorange3.png"]],
		waver:[["waverfrozen1.png","waverfrozen2.png","waverfrozen3.png"],["brinstarwavergreen1.png","brinstarwavergreen2.png","brinstarwavergreen3.png"],["brinstarwaverblue1.png","brinstarwaverblue2.png","brinstarwaverblue3.png"]],
		swooper:[["riofrozen1.png","riofrozen2.png"],["brinstarrioyellow1.png","brinstarrioyellow2.png","brinstarrioyellow3.png"],["brinstarrioorange1.png","brinstarrioorange2.png","brinstarrioorange3.png"],["brinstarriored1.png","brinstarriored2.png"]],
		bomber:[["mellowfrozen1.png","mellowfrozen2.png"],["brinstarmellow1.png","brinstarmellow2.png"]],
		squeept:[["squeeptfrozen1.png","squeeptfrozen2.png","squeeptfrozen3.png"],["norfairsqueeptpink1.png","norfairsqueeptpink2.png","norfairsqueeptpink3.png"],["norfairsqueeptred1.png","norfairsqueeptred2.png","norfairsqueeptred3.png"]],
		dragon:[["dragonfrozen1.png","dragonfrozen2.png"],["norfairdragonpink1.png","norfairdragonpink2.png"],["norfairdragonblue1.png","norfairdragonblue2.png"]],
	},
    createLanding: function(posX,posY) {
		console.log("creating brinstar landing")
        // new Ledge(posX,posY,8)
        new ShaftWall(posX,posY-(cellSize*7),2,1)
        new ShaftWall(posX+(cellSize*6),posY-(cellSize*7),2,1)
        for (var c=0;c<8;c++) {
            var currentX = posX+(c*cellSize)
            new Cell(10,0,currentX,posY)
            if (c===0|c===7) {
                new Cell(20,0,currentX,posY-(cellSize*9))
                new Cell(19,0,currentX,posY-(cellSize*8))
            }
        }
		currentMapsheet = oldSheet
    },
	blue:{
		name:"blue",
		mapSheet: "brinstarblue.png",
		wallPattern:[[3,3],[2,0],[0,7],[7,7],[0,0]],
		bulkPattern:[0,8,0,0,0,2,0,7,7,0,0,0,0,0,2,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,8,0],
		createFloor: function(startX,startY,width,height){
			var last1 = undefined
			var last2 = undefined
			for (var c=0;c<width;c++) {
				if (randomInt(0,1)) {
					var rando1 = 0
				} else {
					var rando1 = 1
				}
				last1 = rando1
				var cell1 = new Cell(rando1,0,startX+(cellSize*c),startY)				
				for (var g=0;g<height-1;g++) {
					if (randomInt(0,1)) {
						var rando2 = 0
					} else {
						if (last2 === 2) {
							if (!randomInt(0,6)) {
								var rando2 = 2
							} else {
								rando2 = 0
							}
						} else {
							var rando2 = 2
						}
					}
					last2 = rando2
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(rando2,0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
					
				}
			}
		},
		createCeiling: function(startX,startY,width,height) {
			var last1 = undefined
			var last2 = undefined
			var bottomStartY = (height-2)*cellSize
			
			for (var c=0;c<width;c++) {

				if (height > 2) {
					for (var h=0;h<height-2;h++) {
						var rando = randomInt(0,2)
						new Cell(rando,0,startX+(c*cellSize),startY+(h*cellSize))
					}
				}

				if (last1 === 0 && last2 !== 4 && !randomInt(0,4)) {
					var rando1 = 5
				} else {
					if (last1 !== 4 && !randomInt(0,5)){
						var rando1 = 2
					} else {
						if (randomInt(0,1)) {
							var rando1 = 0
						} else {
							var rando1 = 1
						}
					}
				}
				last1 = rando1
				var posX = startX+(cellSize*c)
				var posY = startY+bottomStartY
				var cell1 = new Cell(rando1,0,posX,posY)
				if (last1 === 5 || last2 === 5) {
					if (last1 === 5) {
						rando2 = "blank"
					} else {
						if (last1 !== 2 && !randomInt(0,1)) {
							rando2 = 4
						} else {
							rando2 = "blank"
						}
					}
				} else {
					if (last2 === 4 && !randomInt(0,2)) {
						var rando2 = 5
					} else if (last1 !== 2 && last2 === 0 && !randomInt(0,3)) {
						var rando2 = 5
					} else if (last1 !== 2 && last2 !== 4 && last2 !== "blank" && !randomInt(0,4)){
						var rando2 = 2
					} else {
						if (last2 !== 4 && !randomInt(0,4)) {
							var rando2 = 4
						} else {
							var rando2 = 0
						}
					}
					
				}
				last2 = rando2
				
				if (rando2 !== "blank") {
					var cell2 = new Cell(rando2,0,cell1.sprite.x,startY+cellSize+bottomStartY)
				}
				if (last2 === 0 && !randomInt(0,12)) {
					var cell3 = new Cell(0,0,cell1.sprite.x,startY+(cellSize*2)+bottomStartY)
				}
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
				new ShaftWall(startX,startY,2,1)
				new ShaftWall(startX,startY+(cellSize*8),2,1,true)
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
			if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
            this.door = new Door(doorX,doorY,side)
			room.doors.push(this.door)
			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			// if (!noFrame) {
			// 	var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	if (side === "left") {
			// 		new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
			// 	} else {
			// 		new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
			// 	}
			// }
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
	},
	orange:{
		name:"orange",
		mapSheet: "brinstarorange.png",
		wallPattern:[[3,3],[2,0],[0,7],[7,7],[0,0]],
		bulkPattern:[0,8,0,0,0,2,0,7,7,0,0,0,0,0,2,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,8,0],
        postPattern:[],
		createFloor: function(startX,startY,width,height){
			var last1 = undefined
			var last2 = undefined
			for (var c=0;c<width;c++) {
				if (randomInt(0,1)) {
					var rando1 = 0
				} else {
					var rando1 = 1
				}
				last1 = rando1
				var cell1 = new Cell(rando1,0,startX+(cellSize*c),startY)
				for (var g=0;g<height-1;g++) {
					if (randomInt(0,1)) {
						var rando2 = 0
					} else {
						if (last2 === 2) {
							if (!randomInt(0,6)) {
								var rando2 = 2
							} else {
								rando2 = 0
							}
						} else {
							var rando2 = 2
						}
					}
					last2 = rando2
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(rando2,0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
			}
		},
		createCeiling: function(startX,startY,width,height) {
			var last1 = undefined
			var last2 = undefined
			var bottomStartY = (height-2)*cellSize
			for (var c=0;c<width;c++) {
				if (height > 2) {
					for (var h=0;h<height-2;h++) {
						var rando = randomInt(0,2)
						new Cell(rando,0,startX+(c*cellSize),startY+(h*cellSize))
					}
				}
				if (last1 === 0 && last2 !== 4 && !randomInt(0,4)) {
					var rando1 = 5
				} else {
					if (last1 !== 4 && !randomInt(0,5)){
						var rando1 = 2
					} else {
						if (randomInt(0,1)) {
							var rando1 = 0
						} else {
							var rando1 = 1
						}
					}
				}
				last1 = rando1
				var posX = startX+(cellSize*c)
				var posY = startY+bottomStartY
				var cell1 = new Cell(rando1,0,posX,posY)
				if (last1 === 5 || last2 === 5) {
					if (last1 === 5) {
						rando2 = "blank"
					} else {
						if (last1 !== 2 && !randomInt(0,1)) {
							rando2 = 4
						} else {
							rando2 = "blank"
						}
					}
				} else {
					if (last2 === 4 && !randomInt(0,2)) {
						var rando2 = 5
					} else if (last1 !== 2 && last2 === 0 && !randomInt(0,3)) {
						var rando2 = 5
					} else if (last1 !== 2 && last2 !== 4 && last2 !== "blank" && !randomInt(0,4)){
						var rando2 = 2
					} else {
						if (last2 !== 4 && !randomInt(0,4)) {
							var rando2 = 4
						} else {
							var rando2 = 0
						}
					}
					
				}
				last2 = rando2
				
				if (rando2 !== "blank") {
					var cell2 = new Cell(rando2,0,cell1.sprite.x,startY+cellSize)
				}
				if (last2 === 0 && !randomInt(0,12)) {
					var cell3 = new Cell(0,0,cell1.sprite.x,startY+(cellSize*2))
				}
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
				new ShaftWall(startX,startY,2,1)
				new ShaftWall(startX,startY+(cellSize*8),2,1,true)
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
			
			if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
            this.door = new Door(doorX,doorY,side)
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			// if (!noFrame) {
			// 	var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)	
			// 	if (side === "left") {
			// 		new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
			// 	} else {
			// 		new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
			// 	}
			// }
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
	},
	green:{
		name:"green",
		mapSheet: "brinstargreen.png",
		wallPattern:[[0,0,2],[0,2,0],[0,0,0],[2,0,0],[0,0,2]],
		bulkPattern:[0,0,2,0,0,0,0,0,2,0,0,0,0,0,2,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,8,0],
		createFloor: function(startX,startY,width,height){
			var last1 = undefined
			var last2 = undefined
			for (var c=0;c<width;c++) {
				if (randomInt(0,8)) {
					var rando1 = 0
				} else {
					var rando1 = 2
				}
				if (last1 === 2 && !randomInt(0,6)) {
					rando1 = 2
				}
				last1 = rando1
				var cell1 = new Cell(rando1,0,startX+(cellSize*c),startY)
				// groundCells.push(cell1)
				for (var g=0;g<height-1;g++) {
					if (randomInt(0,8)) {
						var rando2 = 0
					} else {
						var rando2 = 2
					}
					if (last2 === 2 && !randomInt(0,6)) {
						rando2 = 2
					}
					last2 = rando2
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(rando2,0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
                if (c > 0 && c < width-2 && c % 2 === 0 && !randomInt(0,5)) {
                    new Bush(startX+(cellSize*c),startY-cellSize)
                }
			}
			
		},
		createCeiling: function(startX,startY,width,height) {
			var bottomStartY = (height-2)*cellSize
			for (var c=0;c<width;c++) {
				var posX = startX+(cellSize*c)
				var posY = startY
				for (var h=0;h<height;h++) {
					new Cell(0,0,posX,posY+(h*cellSize))
				}		
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                    new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			room.doors.push(this.door)
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
	},
    purple:{
		name:"purple",
		mapSheet: "brinstarpurple.png",
		wallPattern:[[20,20],[20,20],[20,20],[20,20],[20,20]],
		bulkPattern:[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[20,20,20],
        postPattern:[],
        createFloor: function(startX,startY,width,height){
			var last1 = undefined
			var last2 = undefined
			for (var c=0;c<width;c++) {
				var cell1 = new Cell(20,0,startX+(cellSize*c),startY)
				// groundCells.push(cell1)
				for (var g=0;g<height-1;g++) {
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(20,0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
                
			}
			
		},
		createCeiling: function(startX,startY,width,height) {
			
			var last1 = undefined
			var last2 = undefined
			var bottomStartY =  (height-2)*cellSize
			for (var c=0;c<width;c++) {
				var posX = startX+(cellSize*c)
				var posY = startY
				for (var h=0;h<height-1;h++) {
					new Cell(20,0,posX,posY+(h*cellSize))
				}
                if (c===2) {
                    new Cell(21,0,posX,posY+cellSize+bottomStartY)
                } else if (c<width-2 && !randomInt(0,4)) {
                    for (var p=0;p<3;p++) {
                        new Cell(20,0,posX+cellSize,posY+bottomStartY)
                        new Cell(20,0,posX,posY+cellSize+bottomStartY)
                        new Cell(21,0,posX+cellSize,posY+cellSize+bottomStartY)
                    }
                    // c++
                } else if (!randomInt(0,4)) {
                    new Cell(21,0,posX,posY+cellSize+bottomStartY)
                }
				
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,2,1)
				    new ShaftWall(startX,startY+(cellSize*8),2,1,true)
                } else {
                    new ShaftWall(startX,startY,2,1)
				    new ShaftWall(startX,startY+(cellSize*8),2,1,true)
                }
				
			}
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
            // if (!noFrame) {
			// 	var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	if (side === "left") {
			// 		new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
			// 	} else {
			// 		new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
			// 	}
			// }
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    }
}
norfair = {
    sectors:[],
    roomIndexes: [],
    landingRoomIndex: undefined,
    name:"norfair",
	printName: "Norfair",
	pitType: "lava",
	pitLikelihood: 8,
	ledgeRange: {min:3,max:4},
	missileLikelihood: 5,
	enemyTextures: {
		ripper:[["ripper2frozen1.png","ripper2frozen2.png"],["norfairripper21.png","norfairripper22.png"]],
		pipeFlyer:[["gametfrozen1.png","gametfrozen2.png"],["norfairgametpurple1.png","norfairgametpurple2.png"],["norfairgametred1.png","norfairgametred2.png"]],
		crawler:["novafrozen.png","norfairnovablue.png","norfairnovaorange.png"],
		dragon:[["dragonfrozen1.png","dragonfrozen2.png"],["norfairdragonpink1.png","norfairdragonpink2.png"],["norfairdragonblue1.png","norfairdragonblue2.png"]],
		squeept:[["squeeptfrozen1.png","squeeptfrozen2.png","squeeptfrozen3.png"],["norfairsqueeptpink1.png","norfairsqueeptpink2.png","norfairsqueeptpink3.png"],["norfairsqueeptred1.png","norfairsqueeptred2.png","norfairsqueeptred3.png"]]
	},
    createLanding: function(posX,posY) {
        new BulkPiece(posX-(cellSize*4),posY-(cellSize*9))
        new BulkPiece(posX+(cellSize*8),posY-(cellSize*9))
        new Ledge(posX,posY+cellSize,8)
        for (var c=0;c<8;c++) {
            new Cell(0,0,posX+(c*cellSize),posY-(cellSize*9))
            if (c>1&&c<6) {
                new Cell(3,0,posX+(c*cellSize),posY)
            }
            if (c===2) {
                new Statue(posX+(c*cellSize),posY-(cellSize*2))
            }
            if (c===3) {
                new Cell(19,0,posX+(c*cellSize),posY+(cellSize*2))
                new Cell(20,0,posX+(c*cellSize),posY+(cellSize*3))
            }
            if (c===4||c===6) {
                new Cell(20,0,posX+(c*cellSize),posY+(cellSize*2))
            }
            if (c===5) {
                new Cell(21,0,posX+(c*cellSize),posY+(cellSize*2))
                new Statue(posX+(c*cellSize),posY-(cellSize*2))
            }
        }

    },
    purple:{
		name:"purple",
		mapSheet: "norfairpurple.png",
		wallPattern:[[4,1],[0,1],[1,4],[0,1],[4,0]],
		bulkPattern:[4,1,1,0,0,4,0,1,1,4,1,0,4,1,1,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,0,0],
        postPattern:[],
        createFloor: function(startX,startY,width,height){
			var last1 = undefined
			var last2 = undefined
            var randomSelections = [0,1,4]
            var selection = 0
			for (var c=0;c<width;c++) { 
				var cell1 = new Cell(randomSelections[randomInt(0,2)],0,startX+(cellSize*c),startY)
				for (var g=0;g<height-1;g++) {
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}	
                    var cell2 = new Cell(randomSelections[randomInt(0,2)],0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
					// var cell2 = new Cell(randomSelections[randomInt(0,2)],0,startX+(cellSize*c),startY+cellSize)
				}
                selection++
                if (selection === 4) {
                    selection = 0
                }
                
			}
			
		},
        createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
				
				var posX = startX+(cellSize*c)
				var posY = startY
                if (!randomInt(0,2)) {
                    var cell1 = new Cell(4,0,posX,posY)
                } else {
                    var cell1 = new Cell(randomInt(0,1),0,posX,posY)
                }
				 if (!randomInt(0,2)) {
                    var cell2 = new Cell(4,0,cell1.sprite.x,startY+cellSize)
                } else {
				    var cell2 = new Cell(randomInt(0,1),0,cell1.sprite.x,startY+cellSize)
                }

				
			}
		},
        createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,2,1)
				    new ShaftWall(startX,startY+(cellSize*8),2,1,true)
                } else {
                    new ShaftWall(startX,startY,2,1)
				    new ShaftWall(startX,startY+(cellSize*8),2,1,true)
                }
				
			}
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
            if (!noFrame) {
				var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
				var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
				if (side === "left") {
					new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
				} else {
					new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
				}
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    green:{
		name:"green",
		mapSheet: "norfairgreen.png",
		wallPattern:[[4,1],[0,1],[1,4],[0,1],[4,0]],
		bulkPattern:[4,1,1,0,0,4,0,1,1,4,1,0,4,1,1,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,0,0],
        postPattern:[],
        createFloor: function(startX,startY,width,height){
			var last1 = undefined
			var last2 = undefined
            var randomSelections = [0,1,4]
            var selection = 0
			for (var c=0;c<width;c++) { 
				var cell1 = new Cell(randomSelections[randomInt(0,2)],0,startX+(cellSize*c),startY)
				// groundCells.push(cell1)
				for (var g=0;g<height-1;g++) {	
                    if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(randomSelections[randomInt(0,2)],0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
                selection++
                if (selection === 4) {
                    selection = 0
                }
                
			}
			
		},
        createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
				
				var posX = startX+(cellSize*c)
				var posY = startY
                if (!randomInt(0,2)) {
                    var cell1 = new Cell(4,0,posX,posY)
                } else {
                    var cell1 = new Cell(randomInt(0,1),0,posX,posY)
                }
				 if (!randomInt(0,2)) {
                    var cell2 = new Cell(4,0,cell1.sprite.x,startY+cellSize)
                } else {
				    var cell2 = new Cell(randomInt(0,1),0,cell1.sprite.x,startY+cellSize)
                }

				
			}
		},
        createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,2,1)
				    new ShaftWall(startX,startY+(cellSize*8),2,1,true)
                } else {
                    new ShaftWall(startX,startY,2,1)
				    new ShaftWall(startX,startY+(cellSize*8),2,1,true)
                }
				
			}
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
            if (!noFrame) {
				var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
				var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
				if (side === "left") {
					new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
				} else {
					new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
				}
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    orange:{
        name:"orange",
		mapSheet: "norfairorange.png",
		wallPattern:[[0,0],[0,0],[0,0],[0,0],[0,0]],
		bulkPattern:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[19,20,21],
        postPattern:[],
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
				var cell1 = new Cell(0,0,startX+(cellSize*c),startY)
				for (var g=0;g<height-1;g++) {
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(0,0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                if (c<width-3 && !randomInt(0,8)) {
                    if (randomInt(0,1)) {
                        var posX = startX+(cellSize*c)
                        var posY = startY
                        var cell1 = new Cell(14,0,posX,posY)
                        var cell2 = new Cell(0,0,posX,startY+cellSize)
                        var cell3 = new Cell(14,0,posX+cellSize,posY)
                        var cell4 = new Cell(0,0,posX+cellSize,posY+cellSize)
                        var cell5 = new Cell(14,0,posX+(cellSize*2),posY)
                        var cell5 = new Cell(0,0,posX+(cellSize*2),posY+cellSize)
                        c+=2
                    } else {
                        var posX = startX+(cellSize*c)
                        var posY = startY
                        var cell1 = new Cell(0,0,posX,posY)
                        var cell2 = new Cell(14,0,posX,startY+cellSize)
                        var cell3 = new Cell(0,0,posX+cellSize,posY)
                        var cell4 = new Cell(14,0,posX+cellSize,posY+cellSize)
                        var cell5 = new Cell(0,0,posX+(cellSize*2),posY)
                        var cell5 = new Cell(14,0,posX+(cellSize*2),posY+cellSize)
                        c+=2
                    }
                    
                } else {
                    var posX = startX+(cellSize*c)
                    var posY = startY
                    var cell1 = new Cell(0,0,posX,posY)
                    var cell2 = new Cell(0,0,cell1.sprite.x,startY+cellSize)
                }
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                     new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
		
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    redBrick:{
        name:"redBrick",
		mapSheet: "norfairredbrick.png",
		wallPattern:[[0,0],[0,0],[0,0],[0,0],[0,0]],
		bulkPattern:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,0,0],
        postPattern:[],
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
				var cell1 = new Cell(0,0,startX+(cellSize*c),startY)
				for (var g=0;g<height-1;g++) {
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(0,0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                if (c>1 && c<width-4 && !randomInt(0,9)) {
                    if (randomInt(0,1)) {
                        var posX = startX+(cellSize*c)
                        var posY = startY
                        var cell1 = new Cell(1,0,posX,posY)
                        var cell2 = new Cell(0,0,posX,startY+cellSize)
                        var cell3 = new Cell(1,0,posX+cellSize,posY)
                        var cell4 = new Cell(0,0,posX+cellSize,posY+cellSize)
                        var cell5 = new Cell(1,0,posX+(cellSize*2),posY)
                        var cell6 = new Cell(0,0,posX+(cellSize*2),posY+cellSize)
                        var cell5 = new Cell(1,0,posX+(cellSize*3),posY)
                        var cell6 = new Cell(0,0,posX+(cellSize*3),posY+cellSize)
                        c+=3
                    } else {
                        var posX = startX+(cellSize*c)
                        var posY = startY
                        var cell1 = new Cell(0,0,posX,posY)
                        var cell2 = new Cell(1,0,posX,startY+cellSize)
                        var cell3 = new Cell(0,0,posX+cellSize,posY)
                        var cell4 = new Cell(1,0,posX+cellSize,posY+cellSize)
                        var cell5 = new Cell(0,0,posX+(cellSize*2),posY)
                        var cell6 = new Cell(1,0,posX+(cellSize*2),posY+cellSize)
                        var cell5 = new Cell(0,0,posX+(cellSize*3),posY)
                        var cell6 = new Cell(1,0,posX+(cellSize*3),posY+cellSize)
                        c+=3
                    }
                    
                } else {
                    var posX = startX+(cellSize*c)
                    var posY = startY
                    var cell1 = new Cell(0,0,posX,posY)
                    var cell2 = new Cell(0,0,cell1.sprite.x,startY+cellSize)
                }
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                     new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    purpleShrub: {
        name:"purpleShrub",
		mapSheet: "norfairpurple.png",
		wallPattern:[[6,6,6,6],[6,2,2,6],[2,6,2,2],[6,2,6,6],[6,6,2,6]],
		bulkPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[6,2,6],
        postPattern:[],
        createFloor: function(startX,startY,width,height){
            var choices = [2,6]
			for (var c=0;c<width;c++) {
				var cell1 = new Cell(choices[randomInt(0,1)],0,startX+(cellSize*c),startY)
				// groundCells.push(cell1)
				for (var g=0;g<height-1;g++) {
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(choices[randomInt(0,1)],0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
                
			}
			
		},
		createCeiling: function(startX,startY,width,height) {
			
			var last1 = undefined
			var last2 = undefined
            var pieces = Math.floor(width/4)
            var leftOver = width-(pieces*4)

			for (var c=0;c<pieces;c++) {
				new Shrub(startX+(c*cellSize*4),startY)
			}
            if (leftOver) {
                var choices = [2,6]
                for (var p=0;p<leftOver-1;p++) {
                    new Cell(choices[randomInt(0,1)],0,startX+(pieces*4*cellSize)+(leftOver*cellSize),startY)
                    new Cell(choices[randomInt(0,1)],0,startX+(pieces*4*cellSize)+(leftOver*cellSize),startY+cellSize)
                    new Cell(choices[randomInt(0,1)],0,startX+(pieces*4*cellSize)+(leftOver*cellSize),startY+(cellSize*2))
                    new Cell(choices[randomInt(0,1)],0,startX+(pieces*4*cellSize)+(leftOver*cellSize),startY+(cellSize*3))
                }
            }
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,2,1)
				    new ShaftWall(startX,startY+(cellSize*8),2,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                    new ShaftWall(startX-startLeftBy,startY,2,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),2,1,true)
                }
				
			}
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
            if (!noFrame) {
				var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
				var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
				if (side === "left") {
					// new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
				} else {
					// new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
				}
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    greenEyeballs:{
        name:"greenEyeballs",
		mapSheet: "norfairgreeneyeballs.png",
		wallPattern:[[1,0],[0,1],[1,0],[0,1],[1,1]],
		bulkPattern:[0,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[1,0,1],
        postPattern:[],
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
				var cell1 = new Cell(randomInt(0,1),0,startX+(cellSize*c),startY)
				for (var g=0;g<height-1;g++) {
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(randomInt(0,1),0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
            var choices = [19,20,21]
			for (var c=0;c<width;c++) {
                posX = startX+(cellSize*c)
                posY = startY
                var cell1 = new Cell(randomInt(0,1),0,posX,posY)
                if (!randomInt(0,5)) {
                    var rando = choices[randomInt(0,2)]
                    var slime = new Cell(rando,0,posX,posY+cellSize)
                    if (rando === 19) {
                        var slime2 = new Cell(20,0,posX,posY+(cellSize*2))
                    }
                }
                // var cell2 = new Cell(randomInt(0,1),0,cell1.sprite.x,startY+cellSize)
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                     new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
		
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    purpleEyeballs:{
        name:"purpleEyeballs",
		mapSheet: "norfairpurpleeyeballs.png",
		wallPattern:[[1,0],[0,1],[1,0],[0,1],[1,1]],
		bulkPattern:[0,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[1,0,1],
        postPattern:[],
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
				var cell1 = new Cell(randomInt(0,1),0,startX+(cellSize*c),startY)
				for (var g=0;g<height-1;g++) {
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(randomInt(0,1),0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
            var choices = [19,20,21]
			for (var c=0;c<width;c++) {
                posX = startX+(cellSize*c)
                posY = startY
                var cell1 = new Cell(randomInt(0,1),0,posX,posY)
                if (!randomInt(0,5)) {
                    var rando = choices[randomInt(0,2)]
                    var slime = new Cell(rando,0,posX,posY+cellSize)
                    if (rando === 19) {
                        var slime2 = new Cell(20,0,posX,posY+(cellSize*2))
                    }
                }
                // var cell2 = new Cell(randomInt(0,1),0,cell1.sprite.x,startY+cellSize)
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                     new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    }
}
ripleyHideout = {
    sectors:[],
    roomIndexes: [],
    landingRoomIndex: undefined,
    name:"ripleyHideout",
	printName: "Ridley's Hideout",
	pitType: "lavapink",
	pitLikelihood: 7,
	ledgeRange: {min:3,max:4},
	missileLikelihood: 3,
	enemyTextures: {
		ripper:[["ripperfrozen.png"],["ripperbrinstaryellow.png"],["ripperbrinstarorange.png"],["ripperbrinstarred.png"]],
		pipeFlyer:[["zebbofrozen1.png","zebbofrozen2.png"],["zebboridleygreen1.png","zebboridleygreen2.png"],["zebboridleyorange1.png","zebboridleyorange2.png"]],
		crawler:["crawlerfrozen.png","crawlerbrinstaryellow.png","crawlerbrinstarorange.png","crawlerbrinstarred.png"]
	},
    createLanding: function(posX,posY) {
        new BulkPiece(posX-(cellSize*3),posY-(cellSize*9))
        new BulkPiece(posX+(cellSize*7),posY-(cellSize*9))
        new Ledge(posX+(cellSize*2),posY-(cellSize*9),4)
        new Ledge(posX+(cellSize*2),posY,4)
        for (var c=0;c<segmentWidth-3;c++) {
            var currentX = posX-(cellSize*2)+(c*cellSize)
            if (c<4||c>7) {
                new Cell(0,0,currentX,posY+(cellSize*5))
            }
            
           
        }
        var oldMapSheet = currentMapSheet
        currentMapSheet = "ridleywhite.png"
        new Post(4,7,7,4,posX-(cellSize),posY,5)
        new Post(4,7,7,4,posX+(cellSize*8),posY,5)
        currentMapSheet = oldMapSheet
    },
    pink: {
        name:"pink",
		mapSheet: "ridleypink.png",
		wallPattern:[[0,0],[0,7],[1,0],[0,0],[7,0]],
		bulkPattern:[0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,1,0],
        shrubbedWalls:true,
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
                var posX = startX+(cellSize*c)
                var posY = startY
                
				var cell1 = new Cell(0,0,posX,posY)
				for (var g=0;g<height-1;g++) {
                    if (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1) {
                        var rando2 = 0
                    } else {
                        var rando2 = 1
                    }
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(rando2,0,posX,posY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                posX = startX+(cellSize*c)
                posY = startY
                if (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1) {
                    var middleIndex = 0
                } else {
                    var middleIndex = 1
                }
                var cell1 = new Cell(0,0,posX,posY)
                var cell2 = new Cell(middleIndex,0,posX,posY+cellSize)
                var cell3 = new Cell(0,0,posX,posY+(cellSize*2))
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
				new ShaftWall(startX,startY,2,1)
				new ShaftWall(startX,startY+(cellSize*8),2,1,true)
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			// if (!noFrame) {
			// 	var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	if (side === "left") {
			// 		new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
			// 	} else {
			// 		new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
			// 	}
			// }
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
        
    },
    green: {
        name:"green",
		mapSheet: "ridleygreen.png",
		wallPattern:[[0,0],[0,7],[1,0],[0,0],[7,0]],
		bulkPattern:[0,0,0,0,0,7,7,0,0,7,7,0,0,0,0,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,0,0],
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
                var posX = startX+(cellSize*c)
                var posY = startY
                
				var cell1 = new Cell(0,0,posX,posY)
				for (var g=0;g<height-1;g++) {
                    if (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1) {
                        var rando2 = 0
                    } else {
                        var rando2 = 1
                    }
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(rando2,0,posX,posY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                posX = startX+(cellSize*c)
                posY = startY
                if (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1) {
                    var middleIndex = 0
                } else {
                    var middleIndex = 1
                }
                var cell1 = new Cell(0,0,posX,posY)
                var cell2 = new Cell(middleIndex,0,posX,posY+cellSize)
                var cell3 = new Cell(0,0,posX,posY+(cellSize*2))
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
				new ShaftWall(startX,startY,2,1)
				new ShaftWall(startX,startY+(cellSize*8),2,1,true)
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
		
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			// if (!noFrame) {
			// 	var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	if (side === "left") {
			// 		new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
			// 	} else {
			// 		new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
			// 	}
			// }
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    purple: {
        name:"purple",
		mapSheet: "ridleypurple.png",
		wallPattern:[[0,0,0],[0,1,0],[0,1,0],[0,1,0],[0,0,0]],
		bulkPattern:[0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,0,0],
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
                var posX = startX+(cellSize*c)
                var posY = startY
                
				var cell1 = new Cell(0,0,posX,posY)
				for (var g=0;g<height-1;g++) {
                    if ((width < segmentWidth/2) || (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1)) {
                        var rando2 = 0
                    } else {
                        var rando2 = 1
                    }
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(rando2,0,posX,posY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                posX = startX+(cellSize*c)
                posY = startY
                if (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1) {
                    var middleIndex = 0
                } else {
                    var middleIndex = 1
                }
                var cell1 = new Cell(0,0,posX,posY)
                var cell2 = new Cell(middleIndex,0,posX,posY+cellSize)
                var cell3 = new Cell(0,0,posX,posY+(cellSize*2))
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
				if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                     new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
            if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
		
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (!noFrame) {
				// var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
				// var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
				// if (side === "left") {
				// 	// new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
				// } else {
				// 	new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
				// }
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    white: {
        name:"white",
		mapSheet: "ridleywhite.png",
		wallPattern:[[0,0],[0,7],[1,0],[0,0],[7,0]],
		bulkPattern:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[4,8,4],
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
                var posX = startX+(cellSize*c)
                var posY = startY
				var cell1 = new Cell(0,0,posX,posY)
				for (var g=0;g<height-1;g++) {
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(0,0,posX,posY+(cellSize*(g+1)),noCollision)
				}
				
			    
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                posX = startX+(cellSize*c)
                var cell1 = new Cell(0,0,posX,startY)
                for (var r=0;r<height;r++) {
                    posY = startY+(cellSize*r)
                    var cell2 = new Cell(0,0,posX,posY)
                }
                
                
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
				new ShaftWall(startX,startY,2,1)
				new ShaftWall(startX,startY+(cellSize*8),2,1,true)
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
			if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			// if (!noFrame) {
			// 	var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
			// 	if (side === "left") {
			// 		new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
			// 	} else {
			// 		new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
			// 	}
			// }
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
        
    }
}
kraidHideout = {
    sectors:[],
    roomIndexes: [],
    landingRoomIndex: undefined,
    name:"kraidHideout",
	printName: "Kraid's Hideout",
	pitType: "sandred",
	pitLikelihood: 6,
	ledgeRange: {min:3,max:5},
	missileLikelihood: 4,
	enemyTextures: {
		ripper:[["ripperfrozen.png"],["ripperkraidbrown.png"],["ripperkraidred.png"]],
		pipeFlyer:[["geegafrozen1.png","geegafrozen2.png"],["kraidgeegabrown1.png","kraidgeegabrown2.png"],["kraidgeegared1.png","kraidgeegared2.png"]],
		crawler:["zeelafrozen.png","kraidzeelayellow.png","kraidzeelablue.png"],
		diver:[["skreefrozen1.png","skreefrozen2.png","skreefrozen3.png"],["kraidskreegreen1.png","kraidskreegreen2.png","kraidskreegreen3.png"],["kraidskreepurple1.png","kraidskreepurple2.png","kraidskreepurple3.png"]]
	
	},
    createLanding: function(posX,posY) {
        new Ledge(posX+(cellSize*2),posY,4)
        new Ledge(posX-(cellSize*2),posY+(cellSize*5),3)
        new Ledge(posX+(cellSize*7),posY+(cellSize*5),3)
        new Post(4,7,7,4,posX-(cellSize*2),posY,5)
        new Post(4,7,7,4,posX+(cellSize*9),posY,5)
        new Post(4,7,7,4,posX+(cellSize),posY-(cellSize*2),5)
        new Post(4,7,7,4,posX+(cellSize*6),posY-(cellSize*2),5)

        new BulkArea(posX-(cellSize*2),posY-(cellSize*8),3,1)

    },
    white: {
        name:"white",
		mapSheet: "kraidwhite.png",
		wallPattern:[[7,0],[0,0],[2,7],[0,0],[7,2]],
		bulkPattern:[2,0,0,0,0,0,2,0,2,2,2,0,0,0,0,2],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,0,0],
        shrubbedWalls: true,
		createFloor: function(startX,startY,width,height){
			var last1 = undefined
			var last2 = undefined
			for (var c=0;c<width;c++) {
				if (randomInt(0,8)) {
					var rando1 = 0
				} else {
					var rando1 = 2
				}
				if (last1 === 2 && !randomInt(0,6)) {
					rando1 = 2
				}
				last1 = rando1
				var cell1 = new Cell(rando1,0,startX+(cellSize*c),startY)
				// groundCells.push(cell1)
				for (var g=0;g<height-1;g++) {
					if (randomInt(0,8)) {
						var rando2 = 0
					} else {
						var rando2 = 2
					}
					if (last2 === 2 && !randomInt(0,6)) {
						rando2 = 2
					}
					last2 = rando2
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(rando2,0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
                if (c > 0 && c < width-2 && c % 2 === 0 && !randomInt(0,5)) {
                    new Bush(startX+(cellSize*c),startY-cellSize)
                }
			}
			
		},
		createCeiling: function(startX,startY,width,height) {
			
			for (var c=0;c<width;c++) {
				
				var posX = startX+(cellSize*c)
				var posY = startY
				var cell1 = new Cell(0,0,posX,posY)
				var cell2 = new Cell(0,0,cell1.sprite.x,startY+cellSize)
			
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                    new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
			if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    
    blueBrick: {
        name:"blueBrick",
		mapSheet: "kraidblue.png",
		wallPattern:[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
		bulkPattern:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[5,5,5],
        shrubbedWalls: true,
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
				var cell1 = new Cell(0,0,startX+(cellSize*c),startY)
				for (var g=0;g<height-1;g++) {
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(0,0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                
                for (var h=0;h<height;h++) {
					if (randomInt(0,1)) {
                    	var rando1 = 8
					} else {
						var rando1 = 13
					}
                	new Cell(rando1,0,startX+(c*cellSize),startY+(h*cellSize))
				}
               
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                     new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
			if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    blueBalls : {
        name:"blueBalls",
		mapSheet: "kraidblue.png",
		wallPattern:[[1,1],[1,1],[1,1],[1,1],[1,1]],
		bulkPattern:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[5,5,5],
        shrubbedWalls: true,
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
				var cell1 = new Cell(0,0,startX+(cellSize*c),startY)
				for (var g=0;g<height-1;g++) {
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(0,0,startX+(cellSize*c),startY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                new Cell(1,0,startX+(c*cellSize),startY)
                new Cell(1,0,startX+(c*cellSize),startY+cellSize)
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
                if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                     new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
			if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    green: {
        name:"green",
		mapSheet: "kraidgreen.png",
		wallPattern:[[0,0,0],[0,1,0],[0,1,0],[0,1,0],[0,0,0]],
		bulkPattern:[0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,0,0],
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
                var posX = startX+(cellSize*c)
                var posY = startY
                
				var cell1 = new Cell(0,0,posX,posY)
				for (var g=0;g<height-1;g++) {
                    if ((width < segmentWidth/2) || (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1)) {
                        var rando2 = 0
                    } else {
                        var rando2 = 1
                    }
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(rando2,0,posX,posY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                posX = startX+(cellSize*c)
                posY = startY
                if (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1) {
                    var middleIndex = 0
                } else {
                    var middleIndex = 1
                }
                var cell1 = new Cell(0,0,posX,posY)
                var cell2 = new Cell(middleIndex,0,posX,posY+cellSize)
                var cell3 = new Cell(0,0,posX,posY+(cellSize*2))
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
				if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                     new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
			if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (!noFrame) {
				// var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
				// var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
				// if (side === "left") {
				// 	// new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
				// } else {
				// 	new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
				// }
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    }
}
tourian = {
    sectors:[],
    roomIndexes: [],
    landingRoomIndex: undefined,
    name:"tourian",
	printName: "Tourian",
	pitType: "lavawhite",
	pitLikelihood: 6,
	missileLikelihood: 0,
	enemyTextures: {
		ripper:[["ripperfrozen.png"],["ripperbrinstaryellow.png"],["ripperbrinstarorange.png"],["ripperbrinstarred.png"]],
		pipeFlyer:[["zebfrozen1.png","zebfrozen2.png"],["zebyellow1.png","zebyellow2.png"],["zeborange1.png","zeborange2.png"],["zebred1.png","zebred2.png"]],
		crawler:["crawlerfrozen.png","crawlerbrinstaryellow.png","crawlerbrinstarorange.png","crawlerbrinstarred.png"]
	},
	ledgeRange: {min:1,max:2},
    createLanding: function(posX,posY) {
        new Cell(0,0,posX+(cellSize*2),posY,4)
        new Cell(0,0,posX+(cellSize*3),posY,4)
        new Cell(0,0,posX+(cellSize*4),posY,4)
        new Cell(0,0,posX+(cellSize*5),posY,4)

        new Cell(11,0,posX+(cellSize*2),posY-cellSize)
        new Cell(11,0,posX+(cellSize*5),posY-cellSize)
           

    },
    white: {
        name:"white",
		mapSheet: "tourianwhite.png",
		wallPattern:[[0,20],[0,7],[0,7],[0,7],[0,7]],
		bulkPattern:[20,20,20,20,7,7,7,7,7,7,7,7,7,7,7,7],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[2,6,3],
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
                var posX = startX+(cellSize*c)
                var posY = startY
                
				var cell1 = new Cell(0,0,posX,posY)
				for (var g=0;g<height-1;g++) {
                    if ((width < segmentWidth/2) || (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1)) {
                        var rando2 = 0
                    } else {
                        var rando2 = 1
                    }
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(rando2,0,posX,posY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                posX = startX+(cellSize*c)
                posY = startY
                if (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1) {
                    var middleIndex = 0
                } else {
                    var middleIndex = 1
                }
                var cell1 = new Cell(middleIndex,0,posX,posY)
                var cell2 = new Cell(0,0,posX,posY+cellSize)
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
				if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                     new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
			if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (!noFrame) {
				// var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
				// var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
				// if (side === "left") {
				// 	// new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
				// } else {
				// 	new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
				// }
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    blue: {
        name:"blue",
		mapSheet: "tourianblue.png",
		wallPattern:[[0,20],[0,7],[0,7],[0,7],[0,7]],
		bulkPattern:[20,20,20,20,7,7,7,7,7,7,7,7,7,7,7,7],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[2,6,3],
        createFloor: function(startX,startY,width,height){
			for (var c=0;c<width;c++) {
                var posX = startX+(cellSize*c)
                var posY = startY
                
				var cell1 = new Cell(1,0,posX,posY)
				for (var g=0;g<height-1;g++) {
                    if (randomInt(0,2)) {
                        var rando2 = 5
                    } else {
                        var rando2 = 1
                    }
					if (c > 0 && c < width-1) {
						var noCollision = "noCollision"
					} else {
						var noCollision = false
					}
					var cell2 = new Cell(rando2,0,posX,posY+(cellSize*(g+1)),noCollision)
				}
			}	
		},
		createCeiling: function(startX,startY,width,height) {
			for (var c=0;c<width;c++) {
                posX = startX+(cellSize*c)
                posY = startY
                if (c % (segmentWidth/2) === 0 || c % (segmentWidth/2) === 1) {
                    var middleIndex = 20
                } else {
                    var middleIndex = 21
                }
                var cell1 = new Cell(1,0,posX,posY)
                var cell2 = new Cell(middleIndex,0,posX,posY+cellSize)
			}
		},
		createDoorWall: function(startX,startY,side,room,noFrame,includeFloor) {
			if (!noFrame) {
				if (side === "left") {
                    new ShaftWall(startX,startY,3,1)
				    new ShaftWall(startX,startY+(cellSize*8),3,1,true)
                } else {
                    var startLeftBy = (currentZone[currentStyle].wallPattern[0].length-2)*cellSize
                     new ShaftWall(startX-startLeftBy,startY,3,1)
				    new ShaftWall(startX-startLeftBy,startY+(cellSize*8),3,1,true)
                }
			}
			// if (side === "left") {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorright.png"],0,0)
			// } else {
				// this.door = preparedSprite(PIXI.utils.TextureCache["doorleft.png"],0,0)
			// }
			if (side === "left") {
				var doorX = startX+cellSize
			} else {
                var doorX = startX
            }
			var doorY = startY+(cellSize*5)
			this.door = new Door(doorX,doorY,side)
			room.doors.push(this.door)
			
			// gameContainer.addChild(this.door.sprite)

			for (var s=0;s<3;s++) {
				if (side === "left") {
					var posX = startX
				} else {
					var posX = startX+cellSize
				}
				var cell = new Cell(15,0,posX,this.door.sprite.y+(s*cellSize),"noCollision")
			}
			if (!noFrame) {
				// var ledgeWidth1 = randomInt(doorLedgeMin,doorLedgeMax)
				// var ledgeWidth2 = randomInt(doorLedgeMin,doorLedgeMax)
				// if (side === "left") {
				// 	// new Ledge(this.door.sprite.x+cellSize,this.door.sprite.y+(cellSize*3),ledgeWidth2)
				// } else {
				// 	new Ledge(this.door.sprite.x-(cellSize*ledgeWidth1),this.door.sprite.y+(cellSize*3),ledgeWidth1)
				// }
			}
			if (includeFloor) {
				if (side === "left") {
					currentZone[currentStyle].createFloor(this.door.sprite.x-cellSize,this.door.sprite.y+(cellSize*8),2,2)
				} else {
					currentZone[currentStyle].createFloor(this.door.sprite.x,this.door.sprite.y+(cellSize*8),2,2)
				}
				
			}
		}
    },
    tubes: {
        name:"tubes",
		mapSheet: "touriantubes.png",
		wallPattern:[[3,3],[2,0],[0,7],[7,7],[0,0]],
		bulkPattern:[0,8,0,0,0,2,0,7,7,0,0,0,0,0,2,0],
		shrubberyPattern:[6,6,6,6,6,2,2,6,2,6,2,2,6,2,6,6],
        ledgePattern:[0,8,0]
    }
}

