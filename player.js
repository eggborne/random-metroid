function Samus() {
	this.container = new PIXI.Container()
	this.blocked = {
		"up":false,
		"left":false,
		"right":false
	}
	this.ascending = false
	this.morphing = false
	this.beganMorphAt = -99
	this.xAnchor = 0.5
	this.room = undefined
	this.stance = "neutral"
	this.previousStance = "neutral"
	this.previousFrame = undefined
	this.aimingUp = false
	this.flipping = false
	this.firing = false
	this.stuckOnCell = undefined
	this.gunRetracted = false
	var texture = PIXI.utils.TextureCache["samusneutral.png"]
	this.sprite = preparedSprite(texture,this.xAnchor,1)
	// this.gunMask = preparedSprite(PIXI.utils.TextureCache["gunmask.png"],this.xAnchor,1)
	// this.gunMask.tint = 0x00ff00
	this.standingHeight = cellSize*2
	this.jumpedAt = -99
	this.phasedIn = false
	this.hitGroundAt = -99
	this.hp = 99
	this.missiles = 30
	this.maxMissiles = 50
	this.maxTanks = 1
	this.fullTanks = 1
	this.lavaDefense = 4
	this.weapons = ["normal","ice","wave"]
	this.gunType = "ice"
	this.previousGun = "normal"
	this.injured = false
	this.injuredAt = -99
	this.bouncing = false
	this.chainLinks = []
	this.chainExtended = false
	// this.sprite.x = Math.round((viewWidth/2)+(this.sprite.width/2))
	// this.sprite.y = Math.round(currentFloor)
	this.jumpReach = 5
	this.runSpeed = Math.round(cellSize/2.25)
	this.jumpForce = Math.round((cellSize/4))
	this.velocity = {x:0,y:0}
	this.startedRunning = 0
	this.previousPosition = {x:this.sprite.x,y:this.sprite.y}
	this.runFrames = {
		"neutral":["samusneutralrun1.png","samusneutralrun2.png","samusneutralrun3.png","samusneutral.png","samusjump.png"],
		"shooting":["samusshootrun1.png","samusshootrun2.png","samusshootrun3.png","samusneutral.png","samusshootjump.png","samusshootupjump.png","samusshootupneutral.png"],
		"aimingUp":["samusuprun1.png","samusuprun2.png","samusuprun3.png","samusupneutral.png","samusupjump.png"],
		"ball":["samusball1.png","samusball2.png","samusball3.png","samusball4.png"]
	}
	this.flipFrames = ["samusflip1.png","samusflip2.png","samusflip3.png","samusflip4.png"]
	this.frontFrames = ["samusfront1.png","samusfront2.png","samusfront3.png","samusfront4.png","samusfront5.png"]
	this.runIndex = 3
	this.previousIndex = 3
	this.maxFallSpeed = cellSize/2.75

	this.sprite.visible = false

	// gameContainer.addChild(this.sprite)
	// this.container.addChild(this.sprite)
	// this.container.addChild(this.gunMask)
	gameContainer.addChildAt(this.container,0)

	// this.onGround = false
	
	// this.sprite.hitbox = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	// this.sprite.hitbox.width = cellSize
	// this.sprite.hitbox.height = cellSize*2
	// this.sprite.hitbox.anchor.x = 0.5
	// this.sprite.hitbox.anchor.y = 1
	// this.sprite.hitbox.alpha = 0.5
	// this.sprite.hitbox.tint = 0x6666ff
	// this.sprite.hitbox.x = this.sprite.x
	// this.sprite.hitbox.y = this.sprite.y
	// this.sprite.addChild(this.sprite.hitbox)
	// console.log(this.sprite.children)
	this.placeInRoom = function(room) {
		currentRoom = room
		if (rooms.indexOf(currentRoom) === 0) {
			console.log("room start!")
			gameContainer.x = -((startingCellPos.x*segmentWidth*cellSize)+(24.5*cellSize)-(viewWidth/2))
			gameContainer.y = -(startingCellPos.y*segmentHeight*cellSize)+(extraYSpace/2)
			this.sprite.x = Math.round(screenCenter().x)
			this.sprite.y = Math.round(currentRoom.roomObject.posY+((segmentHeight-3)*cellSize))
		} else {
			gameContainer.x = -(((startingCellPos.x+room.startPos.x)*segmentWidth*cellSize)+((segmentWidth/2)*cellSize)-(viewWidth/2))
			gameContainer.y = -((startingCellPos.y+room.startPos.y)*segmentHeight*cellSize)+(extraYSpace/2)
			this.sprite.x = Math.round(screenCenter().x)
			this.sprite.y = Math.round((currentRoom.roomObject.posY+((segmentHeight-3))*cellSize))
		}
		
		this.changeFrame("samusfront1.png")
		this.sprite.visible = false
	}

	this.centerX = function() {
		var centerX = 0
		if (this.sprite.scale.x > 0) {
			centerX = this.sprite.x-(this.sprite.width/2)
		} else {
			centerX = this.sprite.x+(this.sprite.width/2)
		}
		if (this.flipping) {
			centerX = this.sprite.x
		}
		return this.sprite.x
	}
	this.takeDamage = function(attacker,amount) {
		this.rebound(attacker)
		this.hp -= amount
		this.injured = true
		this.injuredAt = counter
		energyDisplay.updateDisplay()
	}
	this.rebound = function(attacker) {
		if (Math.abs(playerMovedX) >= this.runSpeed/4) {
			this.velocity.x *= -1
		} else {
			if (playerMovedX > 0) {
				this.velocity.x = this.runSpeed/4
			} else if (playerMovedX < 0) {
				this.velocity.x = -this.runSpeed/4
			} else if (!this.onGround) {
				if (this.sprite.x < attacker.sprite.x) {
					
					this.velocity.x = -this.runSpeed/2
				} else {
					
					this.velocity.x = this.runSpeed/2
				}
			}
		}
		if (this.onGround) {
			if (this.stance === "ball") {
				this.velocity.y = -this.maxFallSpeed
			} else {
				this.beginJump()
			}
			if (this.sprite.x < attacker.sprite.x) {
				console.log("attacker on right!")
				this.velocity.x = -this.runSpeed/2
			} else {
				console.log("attacker on left!")
				this.velocity.x = this.runSpeed/2
			}
		} else {
			if (playerMovedY > 0) {
				this.velocity.y *= -1
			}
		}
		
		if (this.velocity.y > this.maxFallSpeed) {
			this.velocity.y = this.maxFallSpeed
		}
	}
	this.phaseIn = function(phaseStart) {
		var timeSince = counter-phaseStart
		var frameIndex = this.frontFrames.indexOf(this.sprite.texture.textureCacheIds[0])
		if (timeSince > 0 && timeSince % 6 === 0) {
			if (!this.sprite.visible) {
				this.sprite.visible = true
			} else {
				if (this.frontFrames[frameIndex+1]) {
					this.changeFrame(this.frontFrames[frameIndex+1])
				} else {
					this.phasedIn = true
				}
			}
			
		}
	}
	this.changeGun = function(newGun) {
		this.previousGun = this.gunType
		this.gunType = newGun
		if (newGun === "missile") {
			energyDisplay.missileDigit1.tint = 0x00ff00
			energyDisplay.missileDigit2.tint = 0x00ff00
			energyDisplay.missileDigit3.tint = 0x00ff00
			energyDisplay.missileHighlight.tint = 0x00ff00
			for (var w=0;w<energyDisplay.weaponLabels.length;w++) {
				var label = energyDisplay.weaponLabels[w]
				label.buttonHighlight.tint = 0x444444
			}
		}
		if (this.previousGun === "missile") {
			energyDisplay.missileDigit1.tint = 0xffffff
			energyDisplay.missileDigit2.tint = 0xffffff
			energyDisplay.missileDigit3.tint = 0xffffff
			energyDisplay.missileHighlight.tint = 0x444444
		}
		for (var w=0;w<energyDisplay.weaponLabels.length;w++) {
			var label = energyDisplay.weaponLabels[w]
			if (label.type === newGun) {
				label.buttonHighlight.tint = 0x00ff00
			} else {
				label.buttonHighlight.tint = 0x444444
			}
		}

	}
	this.morph = function(endStance) {
		if (this.stance !== endStance) {
			
			if (endStance === "ball" && !this.onGround) {
				this.sprite.y -= cellSize
			}
			if (endStance !== "ball" && !this.onGround) {
				this.sprite.y += cellSize
			}
			this.changeStance(endStance)
			this.changeFrame("samusball0.png")
			
		} else {
			// console.log("still morph while count " + counter + " pressed at " + samus.beganMorphAt)
			if (counter-samus.beganMorphAt === 3) {
				if (endStance === "ball") {
					this.changeFrame("samusball1.png")
				} else {
					samus.changeFrame(samus.runFrames[samus.stance][samus.runIndex])
				}
				
				this.morphing = false
				// console.log("done morph")
			}
			
		}
	}
	this.dropBomb = function() {
		var bomb = new Bomb()
		bomb.sprite.x = this.sprite.x
		bomb.sprite.y = this.sprite.y-(bomb.sprite.height/2)
	}
	this.changeFrame = function(texture) {
		var pos = {x:this.sprite.x,y:this.sprite.y}
		if (this.sprite.scale.x < 0) {
			var flip = -1
		} else {
			var flip = 1
		}
		this.previousFrame = this.sprite.texture.textureCacheIds[0]
		
		this.container.removeChild(this.sprite)
		var oldAnchorY = this.sprite.anchor.y
		var yAnchor = 1
		var texture = PIXI.utils.TextureCache[texture]
		this.sprite = preparedSprite(texture,this.xAnchor,yAnchor)
		this.sprite.scale.x *= flip
		this.sprite.x = pos.x
		this.sprite.y = pos.y
		var stance = this.stance
		// this.runIndex = this.runFrames[stance].indexOf(texture)
		this.container.addChildAt(this.sprite,0)
		if (this.sprite.height > 40*(cellSize/16)) {
			// this.sprite.tint = 0xff0000
			this.sprite.width = 24*(cellSize/16)
			this.sprite.height = 40*(cellSize/16)
		}
		
		// this.sprite.height =  Math.floor(this.sprite.height)
		
		if (this.stance !== "ball") {
			this.standingHeight = cellSize*2
		} else {
			this.standingHeight = cellSize
		}
		if (this.previousFrame === "aimingUp" && this.aimingUp) {
			this.aimingUp = false
		}
	}
	this.roll = function() {
		if (this.sprite.scale.x > 0) {
			var flip = 1
		} else {
			var flip = -1
		}
		var frameIndex = this.runFrames["ball"].indexOf(this.sprite.texture.textureCacheIds[0])
		// console.log("frame index " + frameIndex)
		if (!screenShifting && counter % 4 === 0) {
			if (this.runFrames["ball"][frameIndex+1]) {
				this.changeFrame(this.runFrames["ball"][frameIndex+1])
			} else {
				this.changeFrame(this.runFrames["ball"][0])
			}
		}
	}
	this.run = function(direction,shooting) {
		if (!this.startedRunning) {
			this.startedRunning = counter
		}
		if (direction === 1 && this.sprite.scale.x < 0) {
			this.sprite.scale.x *= -1
		}
		if (direction === -1 && this.sprite.scale.x > 0) {
			this.sprite.scale.x *= -1
		}
		var modifier = 1
		// if (!this.onGround) {
		// 	modifier = 0.8
		// }
		if (this.velocity.x+(Math.round((this.runSpeed/10)*direction) < this.runSpeed)) {
			this.velocity.x += Math.round((this.runSpeed/10)*direction)
		} else {
			this.velocity.x = this.runSpeed*direction
		}
		if (this.stance !== "ball") {
			if (this.onGround && !shooting) {
				this.cycleLegs(direction)	
			}
		} else {
			// if (this.onGround) {
				this.roll(direction)
			// }
		}
		
		if (direction === -1 && this.blocked["right"]) {
			this.blocked["right"].blocking = false
			this.blocked["right"] = false
		}
		if (direction === 1 && this.blocked["left"]) {
			this.blocked["left"].blocking = false
			this.blocked["left"] = false
		}
	}
	this.shoot = function() {
		if (this.stance !== "shooting") {
			this.previousIndex = this.runIndex
			if (!this.aimingUp) {
				this.changeStance("shooting")
			}
			if (!this.onGround) {
				if (this.flipping) {
					this.flipping = false
				}
				if (this.aimingUp) {
					// this.runIndex = 5
				} else {
					this.runIndex = 4
				}
			}
			this.changeFrame(this.runFrames[this.stance][this.runIndex])
		}
		if (this.gunType !== "missile" || (this.gunType === "missile" && this.missiles > 0)) {
			var bullet = new Bullet(this.gunType)
			if (this.gunType === "missile") {
				this.missiles--
				energyDisplay.updateDisplay()
			}
		}
		if (this.gunType === "missile" && this.missiles === 0) {
			this.changeGun(this.previousGun)
		}
		
		if (this.onGround && Math.abs(this.velocity.x) === 0 && !this.gunRetracted) { // not running
			if (this.aimingUp) {
				// this.previousIndex = this.runIndex
				this.runIndex = 6
			}
			this.gunRetracted = true
			this.changeFrame(this.runFrames["shooting"][this.runIndex])
			setTimeout(function(){
				// // samus.stance = samus.previousStance
				// samus.runIndex = samus.previousIndex
				// samus.gunRetracted = false
				// samus.runIndex = 3
				// samus.changeFrame(samus.runFrames[samus.stance][samus.runIndex])
			},100)
		} else {
			
		}
	}
	this.cycleLegs = function() {
		var sinceStarted = counter-this.startedRunning
		var currentStance = this.stance
		if (sinceStarted === 1) {
			if (this.aimingUp) {
				currentStance = "aimingUp"
			}
				
			this.runIndex = 0
			this.changeFrame(this.runFrames[currentStance][this.runIndex])
			// console.log("SYCSKE " + this.runIndex + " AT " + counter + " and sincest " + sinceStarted)
		}
		if (sinceStarted % 5 === 0) {
			
			if (this.stance === "shooting") {
				if (!this.aimingUp) {
					var excludedFrames = 5
				} else {
					var excludedFrames = 3
					currentStance = "aimingUp"
				}
			} else {
				var excludedFrames = 3
			}
			
			
			
			if (this.runIndex >= this.runFrames[currentStance].length-excludedFrames) {
				this.runIndex = 0
			} else {
				this.runIndex = this.runIndex+1
			}
			this.changeFrame(this.runFrames[currentStance][this.runIndex])
			// console.log("SYCSKE " + this.runIndex + " AT " + counter + " and sincest " + sinceStarted)
			
		}
	}
	this.beginJump = function() {
		this.jumpedAt = counter
		this.ascending = true
		// this.velocity.y += -this.jumpForce
		this.onGround = false
		// if (Math.abs(this.velocity.x) < (cellSize/10)) {
			this.runIndex = 4
			this.changeFrame(this.runFrames[this.stance][this.runIndex])
			
		// } else {
			// this.flipping = true
			// var oldHeight = this.sprite.height
			// this.changeFrame("samusflip.png")
			// this.runIndex = 99
			// this.sprite.anchor.set(0.5)
			// this.sprite.y -= oldHeight/2
		// }
		
	}
	this.startFlipping = function() {
		this.flipping = true
		this.changeFrame(this.flipFrames[0])
	}
	this.flip = function() {
		var sinceJumped = counter-this.jumpedAt
		var frameIndex = this.flipFrames.indexOf(this.sprite.texture.textureCacheIds[0])
		if (sinceJumped > 0 && sinceJumped % 3 === 0) {
			if (this.flipFrames[frameIndex+1]) {
				this.changeFrame(this.flipFrames[frameIndex+1])
			} else {
				this.changeFrame(this.flipFrames[0])
			}
		}
	}
	this.ascend = function() {
		if (this.onGround) {
			
		}
		
		var sincePressed = counter-this.jumpedAt+1
		if (this.stance !== "aimingUp" && !this.stuckOnCell && this.stance !== "shooting" && !this.flipping && sincePressed > 6 && Math.abs(this.velocity.x) > this.runSpeed/3) {
			this.startFlipping()
		}
		// console.log("counter is " + counter + " jumpat " + pressedJumpAt)
		if (sincePressed === 1) {
			if (this.sprite.scale.x < 0) {
				var flip = -1
			} else {
				var flip = 1
			}
			this.velocity.y = -this.jumpForce
		} else {
			var appliedJumpForce = this.jumpForce
			if (this.stuckOnCell) {
				appliedJumpForce *= 0.9
			}
			if (!this.blocked["up"] && pressingJump) {
				var boost = (appliedJumpForce/(sincePressed))
				if (this.velocity.y+boost > -this.maxFallSpeed && boost >= 1 && sincePressed < 5) {
					this.velocity.y -= boost
				}
			}
		}
		if (releasedJumpAt > this.jumpedAt) {
			this.velocity.y = 0
			this.ascending = false
		}
		// if (!this.flipping && sincePressed > 6 && Math.abs(this.velocity.x) > cellSize/10) {
		// 	this.flipping = true
			
		// 	this.changeFrame("samusflip.png")
		// 	this.runIndex = 99		
		// }
		
		// this.sprite.scale.x *= flip
	}
	this.applyVelocity = function() {
		if (this.velocity.x > 1) {
			var appliedVelocityX = Math.round(this.velocity.x)
		} else {
			var appliedVelocityX = Math.round(this.velocity.x)
		}
		if (this.velocity.y > 1) {
			var appliedVelocityY = Math.round(this.velocity.y)
			if (this.stance === "ball") {
				// console.log("applying Y velocity " + Math.round(appliedVelocityY) + " at " + counter)
			}
		} else {
			var appliedVelocityY = Math.round(this.velocity.y)
			// this.velocity.y = Math.round(this.velocity.y)
		}
		if (appliedVelocityX < 0 && samus.blocked["left"] || appliedVelocityX > 0 && samus.blocked["right"]) {
			appliedVelocityX = 0
		}
		if (appliedVelocityX > this.runSpeed) {
			appliedVelocityX = this.runSpeed
		}
		if (appliedVelocityX < -this.runSpeed) {
			appliedVelocityX = -this.runSpeed
		}
		if (this.stuckOnCell) {
			appliedVelocityX *= 0.2
			if (this.velocity.y > 0) {
				appliedVelocityY *= 0.1
			} else {
				appliedVelocityY *= 0.3
			}
			appliedVelocityX = Math.round(appliedVelocityX)
			// appliedVelocityY = Math.round(appliedVelocityY)
		}
		this.sprite.x += appliedVelocityX
		this.sprite.y += appliedVelocityY
		if (Math.abs(this.velocity.x)) {
			this.velocity.x *= 0.775
		}
		
		// this.velocity.y *= 0.9
		if (this.velocity.x !== 0 && Math.abs(this.velocity.x) < 0.05) {
			this.velocity.x = 0
			if (this.stance !== "ball" && this.stance !== "aimingUp") {
				this.changeStance("neutral")
			}
		}
	}
	this.applyGravity = function() { 
		// console.log("app gravv")
		if (this.blocked["up"]) {
			// this.blocked["up"].blocking = undefined
			// this.blocked["up"] = undefined
		}
		var appliedGravity = gravityPower
		if (!this.onGround) {
			if (this.velocity.y+(appliedGravity) < this.maxFallSpeed) {
				this.velocity.y += appliedGravity
				// console.log("grav")
			} else {
				this.velocity.y = this.maxFallSpeed
			}	
			
		}
	}
	this.checkForBlockingCells = function() {
		this.onGround = false
		this.standingOnCell = false
		for (var f=0;f<vicinityCells.length;f++) {
			var vicinityCell = vicinityCells[f]
			if (this.stance !== "ball") {
				var diffY = Math.round((vicinityCell.sprite.y+(vicinityCell.sprite.height/2))-((this.sprite.y-(cellSize))))
			} else {
				var diffY = Math.round((vicinityCell.sprite.y+(vicinityCell.sprite.height/2))-((this.sprite.y-cellSize))-(cellSize/2))
			}
			var diffX = Math.abs((vicinityCell.sprite.x+(cellSize/2))-this.sprite.x)
			var equalXDist = Math.round(Math.abs((vicinityCell.sprite.x+cellSize/2)-this.sprite.x))
			if (!vicinityCell.vanished && equalXDist < cellSize-(newPixelSize*2) && vicinityCell.sprite.y >= this.sprite.y-cellSize) {
				// cell under samus
				if (vicinityCell.type !== "quicksand") {
					if (diffY-cellSize < cellSize) {
					
						if (!this.standingOnCell && !this.onGround) {
							if (!this.ascending) {
								this.standingOnCell = vicinityCell
								this.sprite.y = this.standingOnCell.sprite.y
								this.land()
							}
						}
					}
				} else if (!this.stuckOnCell) {
					if (Math.abs(diffY-cellSize) < cellSize/2) {
						this.stuckOnCell = vicinityCell
						this.runIndex = 4
						this.changeFrame(this.runFrames[this.stance][this.runIndex])
						this.flipping = false
						
					}
				}
			}

			if (!vicinityCell.vanished && diffX <= this.sprite.width/2 && this.sprite.y >= vicinityCell.sprite.y+vicinityCell.sprite.height && this.sprite.y <= vicinityCell.sprite.y+vicinityCell.sprite.height+this.standingHeight) {
				// cell over samus
				if (vicinityCell.type !== "quicksand") {
					if (this.stance === "ball" && this.velocity.y < 0) {
						var distanceToSamusBottom = cellSize*0.8
					} else {
						var distanceToSamusBottom = this.standingHeight
					}
					this.blocked["up"] = vicinityCell
					vicinityCell.blocking = "up"
					this.sprite.y = vicinityCell.sprite.y+(cellSize)+distanceToSamusBottom
					if (this.velocity.y < 0) {
						this.velocity.y = 0
					}
				} else if (Math.abs(diffY-cellSize) < cellSize*1.5) {
					this.stuckOnCell = vicinityCell
				}
			}
			if (!vicinityCell.vanished && Math.round(Math.abs(diffY)) < this.standingHeight/2 && equalXDist < (cellSize/2)+(this.sprite.width/2)-(newPixelSize*4)) {
				// blocking from left or right
				if (vicinityCell.type !== "quicksand") {
					if (this.sprite.x > vicinityCell.sprite.x+(this.sprite.width/2)) {
						this.blocked["left"] = vicinityCell
						vicinityCell.blocking = "left"
						this.sprite.x = Math.round((vicinityCell.sprite.x+cellSize)+((this.sprite.width/2)-(newPixelSize*4)))
					} else {
						this.blocked["right"] = vicinityCell
						vicinityCell.blocking = "right"
						this.sprite.x = Math.round((vicinityCell.sprite.x)-((this.sprite.width/2)-(newPixelSize*4)))					
					}
				} else if (Math.abs(diffY-cellSize) < cellSize*1.5) {
					this.stuckOnCell = vicinityCell
				}
			}

			if (vicinityCell.blocking) {
				var limitY = cellSize
				if (Math.abs(diffY) >= limitY || equalXDist > (cellSize/2)+(this.sprite.width/2)-(newPixelSize*3)) {
					if (this.blocked["left"] === vicinityCell) {
						this.blocked["left"] = false
						vicinityCell.blocking = false
					}
					if (this.blocked["right"] === vicinityCell) {
						this.blocked["right"] = false
						vicinityCell.blocking = false
					}
				}
				if (vicinityCell.blocking === "up") {
					if (diffY > 0 || this.velocity.y > 0 || equalXDist >= (cellSize/2)+(this.sprite.width/2)-(newPixelSize*4)) {
						this.blocked["up"] = false
						vicinityCell.blocking = false
						// vicinityCell.sprite.tint = 0xffffff
					}
				}
			}
			if (vicinityCell === this.stuckOnCell) {
				if (equalXDist >= (cellSize/2)+(this.sprite.width/2) || this.sprite.y < vicinityCell.sprite.y-(cellSize/4)) {
					this.stuckOnCell = undefined
				}
			}
			
		}
	}
	this.land = function() {
		// console.log("land at " + counter)
		// this.ascending = false
		
		if (this.stance !== "ball" && this.runIndex === 4) {
			this.runIndex = 3
			this.changeFrame(this.runFrames[this.stance][this.runIndex])
		}
		
		// if (!pressingShoot && this.stance === "shooting") {
		// 	this.changeStance(this.previousStance)
		// }
		
		if (this.sprite.scale.x < 0) {
			var flip = -1
		} else {
			var flip = 1
		}
		
		if (playerMovedY > cellSize/6 && this.velocity.y > 0 && this.stance === "ball") {
			if (!this.bouncing) {
				this.bouncing = true
				this.ascending = true
				this.velocity.y *= -0.6
				this.velocity.y = Math.floor(this.velocity.y)
			} else {
				if (playerMovedY > 1) {
					this.velocity.y *= -0.6
					this.velocity.y = Math.floor(this.velocity.y)
					this.ascending = true
				} else {
					this.bouncing = false
					this.velocity.y = 0
					this.ascending = false
					this.onGround = true
				}
			}
		} else {
			this.velocity.y = 0
			this.onGround = true
		}
		
		// console.log("ball velocY " + this.velocity.y + " at " + counter)
		
		// if (this.stance !== "ball") {
		// 	// this.changeFrame(this.runFrames[this.stance][3])
		// 	this.velocity.y = 0
		// } else {
		// 	console.log("hot to bounce")
		// 	this.velocity.y = 0
		// 	this.bouncing = true
		// 	this.velocity.y *= -0.4
		// 	if (this.velocity.y > -2) {
		// 		this.bouncing = false
		// 		this.velocity.y = 0
		// 	}
		// }
		
		// this.sprite.scale.x *= flip
		if (this.flipping) {
			this.flipping = false
		}
		// this.onGround = true
		
	}
	this.changeStance = function(newStance) {
		this.previousStance = this.stance
		this.stance = newStance
		if (this.previousStance === "aimingUp") {
			this.aimingUp = false
		}
		if (this.stance === "aimingUp") {
			this.aimingUp = true
		}
	}

	this.checkForBombs = function() {
		for (var b=0;b<bombs.length;b++) {
			var bomb = bombs[b]
			if (bomb.detonated) {
				var xDist = samus.sprite.x-bomb.sprite.x
				var yDist = (samus.sprite.y-(samus.standingHeight/2))-(bomb.sprite.y)
				var actualDistance = distanceFromABToXY(samus.sprite.x,samus.sprite.y-(samus.standingHeight/2),bomb.sprite.x,bomb.sprite.y)
				if (actualDistance < (bomb.sprite.width/2)+(cellSize/2)) {
					var baseKick = cellSize/24
					if (Math.abs(xDist)<cellSize/4) {
						samus.velocity.y -= baseKick-(yDist/48)
					}
					samus.velocity.x += (xDist/60)*newPixelSize
					samus.ascending = true
				}
			}
		}
	}

	this.emitChain = function() {
		var chainLink = new ChainLink()		
	}
	this.advanceChain = function() {
		
		for (var c=0;c<this.chainLinks.length;c++) {
			var chainLink = this.chainLinks[c]
			var moveX = (cellSize*0.5*chainLink.launchDirection)+playerMovedX
			
			
			if (c === 0 && Math.abs((chainLink.sprite.x+moveX)-samus.sprite.x) > (chainLink.sprite.width*2)) {
				var newLink = new ChainLink()
				if (this.chainLinks.length % 2 === 0) {
					newLink.sprite.tint = 0x222222
				}
				if (this.chainLinks.length === 18) {
					this.chainExtended = true
				}
			} else {
				chainLink.sprite.x += moveX
			}
		}
	}
	this.retractChain = function() {
		
		for (var c=0;c<this.chainLinks.length;c++) {
			var chainLink = this.chainLinks[c]
			var moveX = cellSize*0.5*chainLink.launchDirection*-1
			
			
			if (c === 0 && Math.abs((chainLink.sprite.x+moveX)-this.sprite.x) < (chainLink.sprite.width)) {
				this.chainLinks.splice(c,1)
				gameContainer.removeChild(chainLink.sprite)
				c--
				if (!this.chainLinks.length) {
					this.chainExtended = false
				}
			} else {
				chainLink.sprite.x += moveX
			}
		}
	}
	this.probeWithChain = function() {
		var probingLink = this.chainLinks[this.chainLinks.length-1]
		probingLink.tint = 0xff9999
		for (var g=0;g<cells.length;g++) {
			var activeCell = cells[g]
			
			var xDistance = Math.abs(probingLink.sprite.x-(activeCell.sprite.x+(activeCell.sprite.width/2)))
			var yDistance = Math.abs(probingLink.sprite.y-activeCell.sprite.y)
			if (!activeCell.vanished && xDistance < (cellSize/1.5) && yDistance <= this.velocity.y) {
				activeCell.vanished = true
				activeCell.sprite.tint = 0xff0000
			}
		}
	}
	this.adjustChain = function() {
		for (var c=0;c<this.chainLinks.length;c++) {
			if (c === 0) {
				
			}
			var chainLink = this.chainLinks[c]
			var rearNeighbor = this.chainLinks[c-1]
			var frontNeighbor = this.chainLinks[c+1]
		}
	}
	
	// this.land()
}
function Bullet(type) {
	
	this.speed = Math.round(cellSize/2)
	if (type === "normal" && !samus.longBeam) {
		this.range = (segmentHeight*cellSize)/3
	} else {
		this.range = viewWidth
	}
	this.ySkew = 0
	this.sprite = preparedSprite(PIXI.utils.TextureCache[type + ".png"],0.5,0.5)
	this.bornAt = counter
	this.fireAngle = undefined
	this.doomed = false
	this.type = type
	this.blewAt = undefined
	this.damage = 10
	if (type === "missile") {
		this.damage = 40
	}
	if (type === "wave") {
		this.fireAngle = 0
	}
	
	if (this.type !== "missile") {
		// this.sprite.rotation = degToRad(randomInt(0,359))
	}
	this.launchDirection = {x:0,y:0}
	if (samus.aimingUp) {
		// if (this.type === "missile") {
			this.sprite.rotation = -Math.PI/2
		// }
		this.launchDirection.x = 0
		this.launchDirection.y = -1
		this.origin = {x:samus.centerX()+samus.velocity.x,y:samus.sprite.y-samus.standingHeight-(this.sprite.height)+samus.velocity.y}
	} else {
		if (samus.sprite.scale.x < 0) {
			this.sprite.scale.x *= -1
			this.launchDirection.x = -1
		} else {
			this.launchDirection.x = 1
		}
		this.launchDirection.y = 0
		this.origin = {x:samus.centerX()+samus.velocity.x+((samus.sprite.width/2)*this.launchDirection.x),y:samus.sprite.y-(samus.standingHeight*0.665)+samus.velocity.y}
	}
	this.fly = function() {
		
		var newX = this.sprite.x+(this.speed*this.launchDirection.x)
		var newY = this.sprite.y+(this.speed*this.launchDirection.y)
		var newDistX = Math.abs(newX-this.origin.x)
		var newDistY = Math.abs(newY-this.origin.y)
		if (newDistX < this.range && newDistY < this.range) {
			this.sprite.x = newX
			this.sprite.y = newY
			if (this.type !== "missile") {
				// this.sprite.rotation += degToRad(6)
			}
			if (this.type === "wave") {
				var sinceFired = counter-this.bornAt
				if (this.launchDirection.y === 0) {
					var lineX = this.origin.x+(sinceFired*this.speed)
					var waveSpot = pointAtAngle(lineX,this.sprite.y,degToRad(this.fireAngle+(sinceFired*45)),(cellSize/2)-(newPixelSize))
					this.sprite.y = waveSpot.y
				} else {
					var lineY = this.origin.y-(sinceFired*this.speed)
					var waveSpot = pointAtAngle(this.sprite.x,lineY,degToRad(this.fireAngle+(sinceFired*45)),cellSize/2)
					this.sprite.x = waveSpot.x
				}
			}
		} else {
			this.doomed = true
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
			this.doomed = true
		}
	}
	this.checkForBlocks = function() {
		for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
			if (this.launchDirection.y !== 0) {
				if (cell.sprite.alpha === 1 && cell.type !== "breakable" && cell.sprite.y < this.sprite.y && Math.abs((cell.sprite.x+cell.sprite.width/2)-this.sprite.x) < cellSize/2) {
					var yDist = this.sprite.y-(cell.sprite.y+(cell.sprite.height/2))
					var collisionY = (cell.sprite.height/2)+(this.sprite.height/2)
					if (yDist < collisionY) {
						this.sprite.y = cell.sprite.y+cell.sprite.height+(this.sprite.height/2)
						if (this.type !== "missile") {
							this.doomed = true
						} else {
							this.blewAt = counter
						}
					}
				}
			}
			if (this.launchDirection.x !== 0) {
				if (cell.sprite.alpha === 1 && cell.type !== "breakable" && Math.abs((cell.sprite.y+cell.sprite.height/2)-this.sprite.y) < cellSize/2) {
					var xDist = this.sprite.x-(cell.sprite.x+(cell.sprite.width/2))
					var collisionX = (cell.sprite.width/2)+(this.sprite.width/2)
					if (Math.abs(xDist) < collisionX) {
						if (xDist < 0) {
							this.sprite.x = cell.sprite.x-(this.sprite.width/2)
						} else {
							this.sprite.x = cell.sprite.x+(cell.sprite.width)+(this.sprite.width/2)
						}
						if (this.type !== "missile") {
							this.doomed = true
						} else {
							this.blewAt = counter
						}
					}
				}
			}
		}
	}
	
	this.sprite.x = this.origin.x
	this.sprite.y = this.origin.y
	bullets.push(this)
	gameContainer.addChild(this.sprite)
	
}
function ChainLink() {
	this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
	if (samus.sprite.scale.x < 0) {
		this.launchDirection = -1
	} else {
		this.launchDirection = 1
	}
	this.sprite.anchor.set(0.5)
	this.sprite.width = cellSize/2
	this.sprite.height = cellSize/8
	this.sprite.tint = 0xaaaaaa
	this.origin = {x:0,y:0}
	this.sprite.x = this.origin.x = samus.sprite.x+(cellSize*0.75*this.launchDirection)
	this.sprite.y = this.origin.y = samus.sprite.y-(samus.standingHeight*0.665)+samus.velocity.y
	samus.chainLinks.unshift(this)
	gameContainer.addChildAt(this.sprite,stage.children.indexOf(samus.sprite)-1)
}