function NESPanel() {
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.bg.tint = nesBGColor
	// this.bg.visible = false
	// this.bg.alpha = 0
	this.bg.width = window.innerWidth
	this.bg.height = window.innerHeight-gameHeight
	// this.bg.x = 0
	this.bg.y = cellSize*(cellsPerHeight)
	this.upButton = new PIXI.Sprite(PIXI.utils.TextureCache["nesup.png"])
	this.downButton = new PIXI.Sprite(PIXI.utils.TextureCache["nesdown.png"])
	this.leftButton = new PIXI.Sprite(PIXI.utils.TextureCache["nesleft.png"])
	this.rightButton = new PIXI.Sprite(PIXI.utils.TextureCache["nesright.png"])
	this.centerPiece = new PIXI.Sprite(PIXI.utils.TextureCache["nescenter.png"])
	this.upLeftButton = new PIXI.Sprite(PIXI.utils.TextureCache["nescenter.png"])
	this.upRightButton = new PIXI.Sprite(PIXI.utils.TextureCache["nescenter.png"])
	this.downLeftButton = new PIXI.Sprite(PIXI.utils.TextureCache["nescenter.png"])
	this.downRightButton = new PIXI.Sprite(PIXI.utils.TextureCache["nescenter.png"])
	this.aButton = new PIXI.Sprite(PIXI.utils.TextureCache["nesbutton.png"])
	this.bButton = new PIXI.Sprite(PIXI.utils.TextureCache["nesbutton.png"])
	this.aLabel = new PIXI.Sprite(PIXI.utils.TextureCache["nesa.png"])
	this.bLabel = new PIXI.Sprite(PIXI.utils.TextureCache["nesb.png"])
	this.dPadPieces = [this.upButton,this.downButton,this.leftButton,this.rightButton,this.upLeftButton,this.upRightButton,this.downLeftButton,this.downRightButton,this.centerPiece]
	var pieceSize = Math.round(cellSize*2)
	for (var p=0;p<this.dPadPieces.length;p++) {
		var piece = this.dPadPieces[p]
		piece.width = piece.height = pieceSize
		piece.interactive = true
	}
	this.upLeftButton.alpha = 0
	this.upRightButton.alpha = 0
	this.downLeftButton.alpha = 0
	this.downRightButton.alpha = 0
	
	this.centerPiece.x = cellSize*3
	if (!landscape) {
		this.centerPiece.y = viewHeight+this.bg.height-(cellSize*8)
	} else {
		this.centerPiece.y = viewHeight+this.bg.height-(cellSize*4.5)
		this.container.alpha = 0.5
	}
	this.upButton.x = this.centerPiece.x
	this.upButton.y = this.centerPiece.y-pieceSize
	this.downButton.x = this.centerPiece.x
	this.downButton.y = this.centerPiece.y+pieceSize
	this.leftButton.x = this.centerPiece.x-pieceSize
	this.leftButton.y = this.centerPiece.y
	this.rightButton.x = this.centerPiece.x+pieceSize
	this.rightButton.y = this.centerPiece.y
	this.upRightButton.x = this.rightButton.x
	this.upRightButton.y = this.upButton.y
	this.upLeftButton.x = this.leftButton.x
	this.upLeftButton.y = this.upButton.y
	this.downRightButton.x = this.rightButton.x
	this.downRightButton.y = this.downButton.y
	this.downLeftButton.x = this.leftButton.x
	this.downLeftButton.y = this.downButton.y
	this.aButton.interactive = this.bButton.interactive = true
	this.aButton.width = this.aButton.height = this.bButton.width = this.bButton.height = Math.round(cellSize*3)
	this.aLabel.width = this.aLabel.height = this.bLabel.width = this.bLabel.height = Math.round(cellSize*0.75)
	this.aButton.x = viewWidth-(cellSize)-this.aButton.width
	this.bButton.x = this.aButton.x-(this.aButton.width*1.25)
	this.aButton.y = this.bButton.y = this.centerPiece.y
	this.bLabel.x = this.bButton.x+this.bButton.width-this.bLabel.width
	this.bLabel.y = this.aLabel.y = this.bButton.y+(this.bButton.height*1.1)
	this.aLabel.x = this.aButton.x+this.aButton.width-this.aLabel.width

	this.mapButton = new PIXI.Sprite(PIXI.utils.TextureCache["mapbutton.png"])
	this.mapButton.width = cellSize*3
	this.mapButton.height = this.mapButton.width/2
	this.mapButton.x = this.aButton.x
	this.mapButton.y = this.bg.y+((this.aButton.y-this.bg.y)/2)-(this.mapButton.height/2)
	this.mapButton.interactive = true
	this.mapButton.on("touchstart",function(){
		toggleMap()
	})
	
	this.container.addChild(this.bg)
	this.container.addChild(this.centerPiece)
	this.container.addChild(this.upButton)
	this.container.addChild(this.downButton)
	this.container.addChild(this.leftButton)
	this.container.addChild(this.rightButton)
	this.container.addChild(this.upLeftButton)
	this.container.addChild(this.upRightButton)
	this.container.addChild(this.downLeftButton)
	this.container.addChild(this.downRightButton)
	this.container.addChild(this.mapButton)
	this.container.addChild(this.bButton)
	this.container.addChild(this.aButton)
	this.container.addChild(this.bLabel)
	this.container.addChild(this.aLabel)
	

	this.container.visible = false
	
	this.listenForTouchInput = function(touchIndex) {
		if (fingerOnScreen) {
			// console.log("finger is on...")
			var cursor = {x:touches[touchIndex].pos.x,y:touches[touchIndex].pos.y}
			var center = {x:this.centerPiece.x+(pieceSize/2),y:nesPanel.container.y+this.centerPiece.y+(pieceSize/2)}
			var xDistance = cursor.x-center.x
			var yDistance = cursor.y-center.y
			var angle = radToDeg(angleOfPointABFromXY(cursor.x,cursor.y,center.x,center.y))
			if (Math.abs(xDistance) < pieceSize*1.5 && Math.abs(yDistance) < pieceSize*1.5) {
				if (angle > 110 || angle < -110) {
					if (!pressingLeft) {
						pressingLeft = true
						this.leftButton.tint = 0x00ff00
					}
				} else if (pressingLeft) {
					stopPressing("left")
					this.leftButton.tint = 0xffffff
				}
				if (angle > -70 && angle < 70) {
					if (!pressingRight) {
						pressingRight = true
						this.rightButton.tint = 0x00ff00
					}
				} else if (pressingRight) {
					stopPressing("right")
					this.rightButton.tint = 0xffffff
				}
				if (angle > 20 && angle < 160) {
					if (!pressingDown) {
						pressingDown = true
						pressedDownAt = counter
						this.downButton.tint = 0x00ff00
					}
				} else if (pressingDown) {
					stopPressing("down")
					this.downButton.tint = 0xffffff
				}
				if (angle > -160 && angle < -20) {
					if (!pressingUp) {
						pressingUp = true
						pressedupAt = counter				
						this.upButton.tint = 0x00ff00
					}
				} else if (pressingUp) {
					stopPressing("up")
					this.upButton.tint = 0xffffff
				}
			} else {
				if (Math.abs(xDistance) < pieceSize*2) {
					stopPressing("up")
					stopPressing("down")
					stopPressing("left")
					stopPressing("right")
				}
			}
			if (!pressingShoot && cursor.x >= this.bButton.x && cursor.x <= this.bButton.x+this.bButton.width && cursor.y >= this.bButton.y && cursor.y <= this.bButton.y+this.bButton.height) {
				pressingShoot = true
				pressedShootAt = counter
				this.bButton.tint = 0x00ff00
			} else if ((cursor.x > this.bButton.x+this.bButton.width || cursor.x < this.bButton.x || cursor.y < this.bButton.y || cursor.y > this.bButton.y+this.bButton.height)
			 && pressingShoot) {
				// pressingShoot = false
				// this.bButton.tint = 0xffffff
			}
			if (!pressingJump && cursor.x >= this.aButton.x && cursor.x <= this.aButton.x+this.aButton.width && cursor.y >= this.aButton.y && cursor.y <= this.aButton.y+this.aButton.height) {
				pressingJump = true
				pressedJumpAt = counter
				this.aButton.tint = 0x00ff00
			} else if ((cursor.x > this.aButton.x+this.aButton.width || cursor.x < this.aButton.x || cursor.y < this.aButton.y || cursor.y > this.aButton.y+this.aButton.height)
			&& pressingJump
			) {
				// pressingJump = false
				// releasedJumpAt = counter
				// this.aButton.tint = 0xffffff
				// console.log("releasing now " + cursor.y + " cur y and " + this.aButton.y + " buttonY")
			}
		}
	}
	
	stage.addChild(this.container)
	
	// this.upLeftButton.on('touchstart',function() {
	// 	pressingUp = true
	// 	pressingLeft = true
	// 	nesPanel.upButton.tint = 0xff0000
	// 	nesPanel.leftButton.tint = 0xff0000
	// })
	this.upLeftButton.on('touchend',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		pressingLeft = false
		nesPanel.upButton.tint = 0xffffff
		nesPanel.leftButton.tint = 0xffffff
	})
	this.upLeftButton.on('touchendoutside',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		pressingLeft = false
		nesPanel.upButton.tint = 0xffffff
		nesPanel.leftButton.tint = 0xffffff
	})
	// this.upRightButton.on('touchstart',function() {
	// 	pressingUp = true
	// 	pressingRight = true
	// 	nesPanel.upButton.tint = 0xff0000
	// 	nesPanel.rightButton.tint = 0xff0000
	// })
	this.upRightButton.on('touchend',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		pressingRight = false
		nesPanel.upButton.tint = 0xffffff
		nesPanel.rightButton.tint = 0xffffff
	})
	this.upRightButton.on('touchendoutside',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		pressingRight = false
		nesPanel.upButton.tint = 0xffffff
		nesPanel.rightButton.tint = 0xffffff
	})
	this.downLeftButton.on('touchend',function() {
		pressingLeft = false
		nesPanel.downButton.tint = 0xffffff
		nesPanel.leftButton.tint = 0xffffff
	})
	this.downLeftButton.on('touchendoutside',function() {
		pressingLeft = false
		nesPanel.downButton.tint = 0xffffff
		nesPanel.leftButton.tint = 0xffffff
	})
	this.downRightButton.on('touchend',function() {
		pressingRight = false
		nesPanel.downButton.tint = 0xffffff
		nesPanel.rightButton.tint = 0xffffff
	})
	this.downRightButton.on('touchendoutside',function() {
		pressingRight = false
		nesPanel.downButton.tint = 0xffffff
		nesPanel.rightButton.tint = 0xffffff
	})
	// this.upButton.on('touchstart',function() {
	// 	pressingUp = true
	// 	this.tint = 0xff0000
	// })
	this.upButton.on('touchend',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		this.tint = 0xffffff
	})
	this.upButton.on('touchendoutside',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		this.tint = 0xffffff
	})
	// this.downButton.on('touchstart',function() {
	// 	pressingDown = true
	// 	this.tint = 0xff0000
	// })
	this.downButton.on('touchend',function() {
		pressingDown = false
		this.tint = 0xffffff
	})
	this.downButton.on('touchendoutside',function() {
		pressingDown = false
		this.tint = 0xffffff
	})
	// this.leftButton.on('touchstart',function() {
	// 	pressingLeft = true
	// 	this.tint = 0xff0000
	// })
	this.leftButton.on('touchend',function() {
		pressingLeft = false
		this.tint = 0xffffff
	})
	this.leftButton.on('touchendoutside',function() {
		pressingLeft = false
		this.tint = 0xffffff
	})
	// this.rightButton.on('touchstart',function() {
	// 	pressingRight = true
	// 	this.tint = 0xff0000
	// })
	this.rightButton.on('touchend',function() {
		pressingRight = false
		this.tint = 0xffffff
	})
	// this.rightButton.on('touchendoutside',function() {
	// 	pressingRight = false
	// 	this.tint = 0xffffff
	// })
	// this.aButton.on('touchstart',function() {
	// 	pressedJumpAt = counter
	// 	pressingJump = true
	// 	this.tint = 0x0000ff
	// })
	this.aButton.on('touchend',function() {
		releasedJumpAt = counter
		pressingJump = false
		this.tint = 0xffffff
	})
	this.aButton.on('touchendoutside',function() {
		releasedJumpAt = counter
		pressingJump = false
		this.tint = 0xffffff
	})
	// this.bButton.on('touchstart',function() {
	// 	pressedShootAt = counter
	// 	pressingShoot = true
	// 	this.tint = 0x0000ff
	// })
	this.bButton.on('touchend',function() {
		releasedShootAt = counter
		pressingShoot = false
		this.tint = 0xffffff
	})
	this.bButton.on('touchendoutside',function() {
		releasedShootAt = counter
		pressingShoot = false
		this.tint = 0xffffff
	})
}



function Joystick(rootX,rootY) {
	this.maxLean = viewHeight/10
	this.deadZoneSize = 0
	this.container = new PIXI.Container()
	this.root = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.root.anchor.set(0.5)
	this.root.width = this.root.height = cellSize*3
	this.root.tint = 0x34571f
	this.root.x = rootX
	this.root.y = rootY
	this.root.alpha = 0
	this.arrows = []
	
	this.samusPosition = {x:samus.sprite.x,y:samus.sprite.y}
		
	for (var d=0;d<8;d++) {
		var arrow = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
		arrow.anchor.x = 0
		arrow.anchor.y = 0.5
		arrow.width = arrow.height = cellSize*2
		var placementAngle = d*(degToRad(360/8))
	    var placementPoint = pointAtAngle(this.root.x,this.root.y,placementAngle,this.maxLean*1.75)
		arrow.x = placementPoint.x
		arrow.y = placementPoint.y
		arrow.tint = 0x1d2e12
		arrow.alpha = 0
		arrow.rotation = placementAngle
		this.arrows.push(arrow)
		this.container.addChild(arrow)
	}
	this.lastReleased = 0
	this.thumbpad = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.thumbpad.anchor.set(0.5)
	this.thumbpad.width = this.thumbpad.height = cellSize*8.5
	this.thumbpad.tint = 0x2a4b16
	this.thumbpad.x = rootX
	this.thumbpad.y = rootY
	this.thumbpad.alpha = 1
	this.thumbpad.lastPosition = {x:this.thumbpad.x,y:this.thumbpad.y}
	this.halo = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.halo.anchor.set(0.5)
	this.halo.width = this.halo.height = this.maxLean*2.5
	this.halo.tint = 0x1d2e12
	this.halo.x = rootX
	this.halo.y = rootY
	this.halo.alpha = 0
	
	this.stick = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.stick.anchor.x = 0
	this.stick.anchor.y = 0.5
	this.stick.width = cellSize
	this.stick.height = cellSize*2
	this.stick.tint = 0x777777
	this.stick.x = rootX
	this.stick.y = rootY
	this.stick.alpha = 1
	
	this.fading = undefined
	
	this.container.addChild(this.halo)
	this.container.addChild(this.root)
	// this.container.addChild(this.stick)
	
	this.container.addChild(this.thumbpad)		
	
	this.leanDistance = function(source) {
		return distanceFromABToXY(this.root.x,this.root.y,source.x,source.y)
	}
	
	if (!landscape || !isTouchDevice) {
		stage.addChild(this.container)
	} else {
		this.maxLean /= 2
	}
	
	this.followThumb = function() {
		var touch = touches[touches.length-1].pos
		var angleAway = angleOfPointABFromXY(touch.x,touch.y,this.root.x,this.root.y)
		var distance = this.leanDistance(touch)
		// if (!tyson || counter > tyson.landedPunchAt+10) {
		this.thumbpad.x = touch.x
		this.thumbpad.y = touch.y
		this.stick.width = distance
		this.stick.rotation = angleAway
		// }
		
		
	}
	
	this.moveWithThumb = function() {
		var touch = touches[touches.length-1].pos
		
		var angleAway = angleOfPointABFromXY(touch.x,touch.y,this.root.x,this.root.y)
		var distance = this.leanDistance(touch)
		
		if (distance < this.maxLean) {
			this.thumbpad.x = touch.x
			this.thumbpad.y = touch.y
		} else {
			var newPoint = pointAtAngle(this.root.x,this.root.y,angleAway,this.maxLean)
			this.thumbpad.x = newPoint.x
			this.thumbpad.y = newPoint.y
			distance = this.maxLean
		}
		this.stick.width = distance
		this.stick.rotation = angleAway
		
	}
	
	this.monitorForStickInput = function() {
		var directions = []
		var angle = this.stick.rotation
		var distance = this.stick.width
		var lockZoneWidth = degToRad(15)
		if (distance > this.deadZoneSize) {		
			var xDistance = (this.thumbpad.x-this.root.x)/this.maxLean
			var yDistance = (this.thumbpad.y-this.root.y)/this.maxLean
			var xAmount = xDistance*samus.speed
			var yAmount = yDistance*samus.speed
			if (!samus.knockedAt) {
				samus.velocity.x = xAmount
				samus.velocity.y = yAmount
			}
		} else {
			// stopPressing(pressingDirections[pressingDirections.length-1])
			// if (pressingDirections.length > 0) {
				// stopPressing(pressingDirections[0])
			// }
		}
		
	
	}
	this.monitorForTouchInput = function() {
		var directions = []
		var angle = this.stick.rotation
		var distance = this.stick.width
		var lockZoneWidth = degToRad(15)
		if (distance > this.deadZoneSize) {
			if (angle > degToRad(-180) && angle < 0) {
				pressingUp = true
			} else {
				stopPressing("up")
			}
			if (angle > 0 && angle < degToRad(180)) {
				pressingDown = true
			} else {
				stopPressing("down")
			}
			if (angle > degToRad(90) || angle < degToRad(-90)) {
				pressingLeft = true
			} else {
				stopPressing("left")
			}
			if (angle > degToRad(-90) || angle < degToRad(90)) {
				pressingRight = true
			} else {
				stopPressing("right")
			}
			var fromNorth = Math.abs(degToRad(-90)-(angle))
			var fromSouth = Math.abs(degToRad(90)-(angle))
			var fromWest = Math.abs(degToRad(-180)-(angle))
			var fromEast = Math.abs(degToRad(0)-(angle))
			if (fromNorth < lockZoneWidth) {
				stopPressing("left")
				stopPressing("right")
			}
			if (fromSouth < lockZoneWidth) {
				stopPressing("left")
				stopPressing("right")
			}
			if (fromWest < lockZoneWidth) {
				stopPressing("up")
				stopPressing("down")
				stopPressing("right")
			}
			if (fromEast < lockZoneWidth) {
				stopPressing("up")
				stopPressing("down")
			}
		} else {
			stopPressing(pressingDirections[pressingDirections.length-1])
			if (pressingDirections.length > 0) {
				stopPressing(pressingDirections[0])
			}
		}
	
	}
	this.monitorForInput = function() {
		var directions = []
		var angle = this.stick.rotation
		var distance = this.stick.width
		var lockZoneWidth = degToRad(15)
		if (distance > this.deadZoneSize) {
			if (angle > degToRad(-180) && angle < 0) {
				pressingUp = true
			} else {
				stopPressing("up")
			}
			if (angle > 0 && angle < degToRad(180)) {
				pressingDown = true
			} else {
				stopPressing("down")
			}
			if (angle > degToRad(90) || angle < degToRad(-90)) {
				pressingLeft = true
			} else {
				stopPressing("left")
			}
			if (angle > degToRad(-90) || angle < degToRad(90)) {
				pressingRight = true
			} else {
				stopPressing("right")
			}
			var fromNorth = Math.abs(degToRad(-90)-(angle))
			var fromSouth = Math.abs(degToRad(90)-(angle))
			var fromWest = Math.abs(degToRad(-180)-(angle))
			var fromEast = Math.abs(degToRad(0)-(angle))
			if (fromNorth < lockZoneWidth) {
				stopPressing("left")
				stopPressing("right")
			}
			if (fromSouth < lockZoneWidth) {
				stopPressing("left")
				stopPressing("right")
			}
			if (fromWest < lockZoneWidth) {
				stopPressing("up")
				stopPressing("down")
				stopPressing("right")
			}
			if (fromEast < lockZoneWidth) {
				stopPressing("up")
				stopPressing("down")
			}
		} else {
			stopPressing(pressingDirections[pressingDirections.length-1])
			if (pressingDirections.length > 0) {
				stopPressing(pressingDirections[0])
			}
		}
		
	
	}
	this.destroy = function() {
		stage.removeChild(this.container)
		stopPressing(pressingDirections[pressingDirections.length-1])
		if (pressingDirections.length > 0) {
			stopPressing(pressingDirections[0])
		}
		pressingUp = pressingDown = pressingLeft = pressingRight = false
		joystick = undefined
	}
}

function touchingJoystickArea() {
	var touching = false
	// for (var t=0;t<touches.length;t++) {
		var touch = touches[touches.length-1]
		if (landscape && isTouchDevice) {
			if (touch.pos.x > 0 &&
				touch.pos.x < (viewWidth/2)) {
				touching = true
			}
		} else {
			if (touch.pos.y > (controlPanel.container.y) &&
				touch.pos.y < (controlPanel.container.y+controlPanel.container.height)) {
				touching = true
			}
		}
	// }
	
	return touching
}
function extendAdjunctsForXPosition(posX) {
	if (posX > viewWidth*(1/2)) {
		controlPanel.jumpAdjuncts[0].extend(1)
		controlPanel.duckAdjuncts[0].extend(1)
	} else if (posX <= viewWidth*(1/2)) {
		controlPanel.jumpAdjuncts[1].extend(1)
		controlPanel.duckAdjuncts[1].extend(1)
	}
}
function retractAdjuncts() {
	controlPanel.jumpAdjuncts[0].extend(-1)
	controlPanel.duckAdjuncts[0].extend(-1)
	controlPanel.jumpAdjuncts[1].extend(-1)
	controlPanel.duckAdjuncts[1].extend(-1)
}

window.addEventListener("wheel", zoomWithWheel);

function zoomWithWheel(data) {
    if (data.deltaY > 0) {
		zoom(-0.015)
	} else {
		zoom(0.015)
	}
	// stage.x = viewWidth/4
	// stage.y = viewHeight*0.7
}

function scrollWithWASD(direction) {
	if (direction === "vertical") {
		if (pressingUp) {
			gameContainer.y += scrollSpeed
			// samus.velocity.y -= 0.1
		}
		if (pressingDown) {
			gameContainer.y -= scrollSpeed
		}
	} else {
		if (pressingLeft) {
			gameContainer.x += scrollSpeed
		}
		if (pressingRight) {
			gameContainer.x -= scrollSpeed
		}
	}
	
	if (pressingE || pressingShoot) {
		// zoom(0.015)
	}
	if (pressingJump) {
		// zoom(-0.015)
	}
	// if (stage.x < (currentRoom.posX+(currentRoom.width))*-1) {
	// 	// currentRoom = currentRoom.neighbor.right
	// }
}
function handleInputs() {
	if (pressingUp) {
		newDirection = "up"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
			if (!pressedUpAt) {
				pressedUpAt = counter
			}
		}
	}
	if (pressingDown) {
		newDirection = "down"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
			if (!pressedDownAt) {
				pressedDownAt = counter
			}
		}
	}
	if (pressingLeft) {
		newDirection = "left"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
			pressedLeftAt = counter
		}
	}
	if (pressingRight) {
		newDirection = "right"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
			pressedRightAt = counter
		}
	}	
	// console.log(pressingDirections[0])
	// console.log(pressingDirections[1])
}

function stopPressing(direction) {
	if (direction === "up") {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		if (nesPanel) {
			nesPanel.upButton.tint = 0xffffff
		}
	}
	if (direction === "down") {
		pressingDown = false
		pressedDownAt = 0
		if (nesPanel) {
			nesPanel.downButton.tint = 0xffffff
		}
	}
	if (direction === "left") {
		pressingLeft = false
		if (nesPanel) {
			nesPanel.leftButton.tint = 0xffffff
		}
	}
	if (direction === "right") {
		pressingRight = false
		if (nesPanel) {
			nesPanel.rightButton.tint = 0xffffff
		}
	}
	lastLiftedDirection = direction
	stoppedPressing = counter
	pressingDirections.splice(pressingDirections.indexOf(direction),1)
}
function setInputs() {
	// document.onmousedown = function(event) {
	// 	if (event.button === 0) {
	// 		LMBDown = true
	// 		clickedAt = counter
	// 		// pressedShootAt = counter
	// 		// pressingShoot = true
	// 	}
	// 	if (event.button === 2) {
	// 		RMBDown = true
	// 		rightClickedAt = counter
			
	// 	}
	// }
	// document.onmousemove = function(event) {
	// 	cursor.x = event.clientX
	// 	cursor.y = event.clientY
	// }
	
	// document.onmouseup = function(event) {
	// 	if (event.button === 0) {
	// 		LMBDown = false
	// 		releasedShootAt = counter
	// 		// pressingShoot = false
	// 	}
	// 	if (event.button === 2) {
	// 		RMBDown = false
	// 		if (samus.ducking) {
	// 			samus.ducking = false
	// 		}
			
	// 	}
	// }
	document.onkeydown = function(event) {
		if (event.keyCode == 16) {
			pressedShiftAt = counter
		};
		if (event.keyCode == 9) {
			pressedTabAt = counter
		};
		if (event.keyCode == 49) {
			pressed1At = counter
		};
		if (event.keyCode == 50) {
			pressed2At = counter
		};
		if (event.keyCode == 51) {
			pressed3At = counter
		};
		if (event.keyCode == 52) {
			pressed4At = counter
		};
		if (event.keyCode == 53) {
			pressed5At = counter
		};

		if (event.keyCode == 69) {
			pressingE = true
			pressedEAt = counter
			pressedShootAt = counter
		};
		if (event.keyCode == 81) {
			pressingQ = true
			pressedQAt = counter
		};
		
		if (pressingDirections.length < 2) {
			if (event.keyCode == 87 || event.keyCode == 38) {
				pressingUp = true
			};
			if (event.keyCode == 83 || event.keyCode == 40) {
				pressingDown = true
				
			};
			if (pressingRight === false && event.keyCode == 65 || event.keyCode == 37) {
				pressingLeft = true
				
			};
			if (pressingLeft === false && event.keyCode == 68 || event.keyCode == 39) {
				pressingRight = true
				
			};		
		}
		if (!pressingSpace && event.keyCode == 32) {
			pressingSpace = true
			pressedJumpAt = counter
			pressingJump = true		
		};
	};
    document.onkeyup = function(event) {		
		if (event.keyCode == 69) {
			pressingE = false
			releasedShootAt = counter
			pressingShoot = false
		};
		if (event.keyCode == 81) {
			pressingQ = false
		};
		if (event.keyCode == 87 || event.keyCode == 38) {
			stopPressing("up")
		};
		if (event.keyCode == 83 || event.keyCode == 40) {
			stopPressing("down")
		};
		if (event.keyCode == 65 || event.keyCode == 37) {
			stopPressing("left")
		};
		if (event.keyCode == 68 || event.keyCode == 39) {
			stopPressing("right")
		};
		if (event.keyCode == 32) {
			pressingSpace = false
			pressingJump = false
			releasedJumpAt = counter
		}		
    };
	stage.interactive = true
	stage.onDragStart = function(event)
    {	
		var e = event || window.event;
        this.data = e.data;
		if (true) {
			fingerOnScreen = true
			var touch = {
				id: this.data.identifier || 0,
				pos: this.data.getLocalPosition(this)
			}
			if (touches.indexOf(touch) === -1) {
				touches.push(touch);
			}
			touchedAt = counter
		}
        
	}
    stage.onDragMove = function(event)
    {
        var e = event || window.event;
        this.data = e.data;
        for (var i=0; i < touches.length; i++) {
            if(touches[i].id === (this.data.identifier || 0)) {
                touches[i].pos = this.data.getLocalPosition(this)
            }
        };
    }
    stage.onDragEnd = function(event)
    {
		var e = event || window.event;
        this.data = e.data;
		for (var i=0;i<touches.length;i++) {
			if (touches[i].id === (this.data.identifier || 0)) {
				touches.splice(i,1);
			}
		};
		if (touches.length === 0) {
			pressingDirections = []
			fingerOnScreen = false
		}
    }
    stage.on("touchstart",stage.onDragStart)
    stage.on("touchmove",stage.onDragMove)
    stage.on("touchend",stage.onDragEnd)
    stage.on("touchendoutside",stage.onDragEnd)
}
function ControlPanel() {
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.container.y = viewHeight
	this.bg.width = window.innerWidth
	this.bg.height = window.innerHeight-viewHeight
	if (landscape) {
		this.bg.width = viewWidth/2
		this.bg.height = viewHeight
	}
	this.bg.tint = 0x333333
	// this.bg.alpha = 0.2
	this.container.addChild(this.bg)
	this.instructions = new PIXI.Text("TOUCH TO MOVE",buttonStyle)
	this.jumpLabel = new PIXI.Text("JUMP",startStyle)
	this.duckLabel = new PIXI.Text("DUCK",startStyle)
	this.instructions.tint = this.jumpLabel.tint = this.duckLabel.tint = 0x888888
	this.instructions.anchor.x = 0.5
	this.instructions.x = this.container.width/2
	this.instructions.y = this.container.height/2-(this.instructions.height/2)
	this.instructions.alpha = 0.5
	this.jumpLabel.alpha = this.duckLabel.alpha = 1
	this.jumpArea = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.duckArea = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	this.jumpArea.tint = this.jumpAreaColor = 0x660000
	this.duckArea.tint = this.duckAreaColor = 0x440000
	this.jumpArea.width = this.duckArea.width = this.container.width*0.9
	this.jumpArea.height = this.duckArea.height = this.container.height/4.75
	this.jumpArea.anchor.x = this.duckArea.anchor.x = this.jumpLabel.anchor.x = this.duckLabel.anchor.x = 0.5
	this.jumpArea.x = this.duckArea.x = Math.round(this.container.width/2)
	this.jumpArea.y = Math.round(this.container.width*0.08)
	this.duckArea.y = Math.round(this.container.height-this.duckArea.height-(this.container.width*0.08))
	this.duckArea.interactive = true
	this.duckLabel.interactive = true
	this.jumpArea.interactive = true
	this.jumpLabel.interactive = true
	this.jumpAdjuncts = []
	this.duckAdjuncts = []
	
	this.jumpLabel.anchor.y = 0.5
	this.duckLabel.anchor.y = 0.5
	
	if (landscape && isTouchDevice) {
		this.container.x = this.container.y = 0
		// this.instructions.visible = false
		this.jumpArea.width = this.duckArea.width = viewWidth*0.4
		this.jumpArea.x = this.duckArea.x = viewWidth-(this.jumpArea.width/2)
		this.jumpArea.height = viewHeight/2.5
		this.duckArea.height = viewHeight/2.5
		this.jumpArea.y = 0
		this.duckArea.y = viewHeight-this.duckArea.height
		
		this.jumpLabel.y += this.jumpArea.y+(this.jumpArea.height/2)-(this.jumpLabel.height/2)
		this.duckLabel.y += this.duckArea.y+(this.duckArea.height/2)-(this.duckLabel.height/2)
		this.jumpLabel.x = this.jumpArea.x
		this.duckLabel.x = this.duckArea.x
		
	} else {
		this.jumpLabel.x = this.jumpArea.x
		this.jumpLabel.y = this.jumpArea.y+(this.jumpArea.height/2)-(this.jumpLabel.height/2)
		this.duckLabel.x = this.duckArea.x
		this.duckLabel.y = this.duckArea.y+(this.duckArea.height/2)-(this.duckLabel.height/2)
	}
		this.container.addChild(this.instructions)

	if (landscape) {
		
	}

	this.jumpLabel.y += this.jumpLabel.height/2
	this.duckLabel.y += this.jumpLabel.height/2
	
	this.container.addChild(this.jumpArea)
	this.container.addChild(this.duckArea)
	
	if(!landscape || !isTouchDevice) {
		this.container.addChild(this.jumpLabel)
		this.container.addChild(this.duckLabel)
	} else {
		this.container.addChild(this.jumpLabel)
		this.container.addChild(this.duckLabel)
		// this.jumpArea.alpha = 0
		// this.duckArea.alpha = 0
		// this.bg.alpha = 0
	}
	
	
	for (var a=0;a<4;a++) {
		var newAdjunct = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
		if (!landscape && isTouchDevice) {
			this.container.addChild(newAdjunct)
		}
		newAdjunct.interactive = true
		newAdjunct.width = this.duckArea.width/3
		newAdjunct.height = this.duckArea.height/1.25
		
		newAdjunct.alpha = 1
		if (a === 0) {
			newAdjunct.anchor.y = 0
			newAdjunct.x = this.jumpArea.x-(this.jumpArea.width/2)
			newAdjunct.y = this.jumpArea.y+this.jumpArea.height
			newAdjunct.tint = this.jumpArea.tint
			this.jumpAdjuncts.push(newAdjunct)
		} else if (a === 1) {
			newAdjunct.anchor.y = 0
			newAdjunct.x = this.jumpArea.x+(this.jumpArea.width/2)-newAdjunct.width
			newAdjunct.y = this.jumpArea.y+this.jumpArea.height
			newAdjunct.tint = this.jumpArea.tint
			this.jumpAdjuncts.push(newAdjunct)
		} else if (a === 2) {
			newAdjunct.anchor.y = 1
			newAdjunct.x = this.duckArea.x-(this.duckArea.width/2)
			newAdjunct.y = this.duckArea.y
			newAdjunct.tint = this.duckArea.tint
			this.duckAdjuncts.push(newAdjunct)
		} else if (a === 3) {
			newAdjunct.anchor.y = 1
			newAdjunct.x = this.duckArea.x+(this.duckArea.width/2)-newAdjunct.width
			newAdjunct.y = this.duckArea.y
			newAdjunct.tint = this.duckArea.tint
			this.duckAdjuncts.push(newAdjunct)
		}
		if (a < 2) {
			function jumpButtonAction(){
				if (true) {
					samus.jump()					
				} else {
					if (samus.dead && counter-samus.diedAt > 5) {
						transitionScreen.summon(true)
					}
				}
				if (!this.text) {
					this.tint = controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = 0x880000
				}
				controlPanel.jumpArea.tint = 0x880000
			}
			
			newAdjunct.on("touchstart",jumpButtonAction)
			newAdjunct.on("touchend",function(){
				controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
				controlPanel.jumpArea.tint = controlPanel.jumpAreaColor
			})
			newAdjunct.on("touchendoutside",function(){
				controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
				controlPanel.jumpArea.tint = controlPanel.jumpAreaColor
			})
		} else {
			newAdjunct.on("touchstart",function(){
			samus.startDucking()
			controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = 0x880000
			controlPanel.duckArea.tint = 0x880000
			})
			newAdjunct.on("touchend",function(){
				samus.ducking = false
				controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
				controlPanel.duckArea.tint = controlPanel.duckAreaColor
			})
			newAdjunct.on("touchendoutside",function(){
				samus.ducking = false
				controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
				controlPanel.duckArea.tint = controlPanel.duckAreaColor
			})
		}
		// newAdjunct.tint = 0x00ff00
		newAdjunct.extending = false
		newAdjunct.origScaleY = newAdjunct.scale.y
		newAdjunct.scale.y = 0
		newAdjunct.extend = function(direction) {
			this.scale.y += direction*this.origScaleY/8
			if (direction > 0) {
				if (this.scale.y > this.origScaleY) {
					this.scale.y = this.origScaleY
					this.extending = false
				}
			} else {
				if (this.scale.y < 0) {
					this.scale.y = 0
					this.extending = false
				}
			}
		}
	}
	this.duckArea.on("touchstart",function(){
		samus.startDucking()
		this.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = 0x880000
	})
	this.duckArea.on("touchend",function(){
		samus.ducking = false
		this.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
	})
	this.duckArea.on("touchendoutside",function(){
		samus.ducking = false
		this.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
	})
	this.duckLabel.on("touchstart",function(){
		samus.startDucking()
		controlPanel.duckArea.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = 0x880000
	})
	this.duckLabel.on("touchend",function(){
		samus.ducking = false
		controlPanel.duckArea.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
	})
	this.duckLabel.on("touchendoutside",function(){
		samus.ducking = false
		controlPanel.duckArea.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
	})
	this.jumpArea.on("touchstart",jumpButtonAction)
	this.jumpArea.on("touchend",function(){
		this.tint = controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
	})
	this.jumpArea.on("touchendoutside",function(){
		this.tint = controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
	})
	this.jumpLabel.on("touchstart",jumpButtonAction)
	this.jumpLabel.on("touchend",function(){
		controlPanel.jumpArea.tint = controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
	})
	this.jumpLabel.on("touchendoutside",function(){
		controlPanel.jumpArea.tint = controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
	})
	
	this.monitorInputs = function() {
		if (touches.length) {
			if (touchingJoystickArea()) {
				
				if (touchedAt === counter) {
					if (!joystick) {
						joystick = new Joystick(touches[touches.length-1].pos.x,touches[touches.length-1].pos.y)
						
					} else {
						joystick.destroy()
						joystick = new Joystick(touches[0].pos.x,touches[0].pos.y)
					}
				}
				if (controlPanel.instructions.alpha > 0) {
					controlPanel.instructions.alpha -= 0.05
				}
				if (joystick && joystick.container.alpha < 1) {
					joystick.container.alpha += 0.04
				}
			
			}
			if (joystick) {
				joystick.moveWithThumb()
				
			}
		} else {
			retractAdjuncts()
			if (joystick) {
				if (joystick.container.alpha > 0) {
					joystick.container.alpha -= 0.5
				}
				if (joystick.container.alpha <= 0) {
					joystick.destroy()
					joystickKilledAt = counter
				}
			}
			if (counter-joystickKilledAt > 30 && !joystick && controlPanel && controlPanel.instructions.alpha < 0.5) {
				// controlPanel.instructions.alpha += 0.1
			}
			
			
		}
	}
	stage.addChild(this.container)
	if (landscape && isTouchDevice) {
		this.container.alpha = 0.9
	}
}
function setStyles() {
	buttonFontSize = Math.round(cellSize)
	messageFontSize = Math.round(cellSize/2.5)
	numeralTextures = ["zero.png","one.png","two.png","three.png","four.png","five.png","six.png","seven.png","eight.png","nine.png"]
	buttonStyle = {
		align: 'left',
		font : '  ' + messageFontSize +'px Helvetica',
		fill : '#efefef',
		dropShadow : true,
		dropShadowColor : '#000000',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : messageFontSize/12
	};
	labelStyle = {
		align: 'left',
		font : '  ' + messageFontSize/1.9 +'px Helvetica',
		fill : '#efefef',
		dropShadow : true,
		dropShadowColor : '#000000',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : messageFontSize/12
	};
	messageStyle = {
		align: 'center',
		fontFamily : 'Pixel Emulator',
		fontSize : Math.round(cellSize) + 'px',
		// fontStyle : 'italic',
		// fontWeight : 'bold',
		fill : '#F7EDCA',
		// stroke : '#000000',
		// strokeThickness : messageFontSize/6,
		// dropShadow : true,
		// dropShadowColor : '#000000',
		// dropShadowAngle : Math.PI / 6,
		// dropShadowDistance : messageFontSize/7,
		// wordWrap : true,
		// wordWrapWidth : (viewWidth)
	};
	startStyle = {
		align: 'center',
		font : ' bold ' + Math.round(cellSize*1.5) +'px Helvetica',
		fill : '#ffffff',
		fontSize : (cellSize*1.5) + "px",
		stroke : '#000000',
		strokeThickness : cellSize/6
	};
	// scoreStyle = {
		// align: 'right',
		// font : ' bold ' + (cellSize*1.5) +'px Silkworm, Helvetica',
		// fill : '#79ceec',
	// };
}