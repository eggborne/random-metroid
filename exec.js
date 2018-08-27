
var preloadLength = {}
preloadLength.x = (viewWidth)+extraXSpace
preloadLength.y = (segmentHeight*cellSize*1.5)
var viewPosition = {}
var cellTester = 0
var zoneLoaded = 0
var loadRate = 1
var currentCamera = 0
var doneLoadingAt = undefined

function update() {
	if (gameInitiated) {

// GAME STARTED
	if (roomsCreatedThisZone < activeZone.roomIndexes.length) {
		if (!loadingScreen.container.visible) {
			loadingScreen.container.visible = true
			
		}
		if (nesPanel) {
			nesPanel.container.visible = false
		}
		loadingScreen.operate()
	}
	
	if (pressedQAt === counter) {
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
		// toggleMap()
		// if (!mapSprite.visible) {
		// 	mapSprite.visible = true
		// } else {
		// 	mapSprite.visible = false
		// }
		
		// mapSprite.visible = true
		// if (rooms[currentCamera].roomObject) {
		// 	samusToRoomStart(rooms[currentCamera])
		// 	samus.sprite.x = rooms[currentCamera].roomObject.posX+(viewWidth/2)
		// 	samus.sprite.y = rooms[currentCamera].roomObject.posY+(viewHeight/2)
		// 	currentRoom = rooms[currentCamera]
		// 	activeZone = currentRoom.zone
		// 	currentCamera++
		// }	
	}
	// debug.text = 
	// "\nstance: " + samus.stance +
	// "\naimingUp: " + samus.aimingUp +
	// "\npressingUp: " + pressingUp
	if (pressedEAt === counter) {
		
	}
	var viewPosition = {x:-gameContainer.x,y:-gameContainer.y}
	if (nesPanel) {
		for (var t=0;t<touches.length;t++) {
			nesPanel.listenForTouchInput(t)
		}
		if (touches.length === 0) {
			if (pressingDirections.length) {
				stopPressing(pressingDirections[pressingDirections.length-1])
				if (pressingDirections.length) {
					stopPressing(pressingDirections[0])
				}
			}
			if (pressingShoot) {
				pressingShoot = false
				nesPanel.bButton.tint = 0xffffff
			}
			if (pressingJump) {
				pressingJump = false
				releasedJumpAt = counter
				nesPanel.aButton.tint = 0xffffff
			}
		}
	}
	
	handleInputs()
	
	// if (clickedAt === counter) {
	// 	samus.shoot()
	// }
	
	if (counter % loadRate === 0 && roomsCreatedThisZone < activeZone.roomIndexes.length) {
		createRoomFromIndex(activeZone.roomIndexes[roomsCreatedThisZone])
		roomsCreatedThisZone++
		if (roomsCreatedThisZone === activeZone.roomIndexes.length) {
			pairDoors()
			// addBulkSectors()
			zonesCreated.push(activeZone)
			loadingScreen.container.visible = false
			energyDisplay.container.visible = true
			
			// setNewMapImage()
			// samus.sprite.visible = true
			if (nesPanel) {
				nesPanel.container.visible = true
			}
			if (zonesCreated.length === 1) {
				doneLoadingAt = counter
				
				// toggleMap()
			}
			// zoneLoaded = true
			for (var r=0;r<sectorContainers.length;r++) {
				var row = sectorContainers[r]
				for (var s=0;s<row.length;s++) {
					var cont = row[s]
					if (cont) {
						cont.visible = false
					}
				}
			}
		}
		
	}
	if (!samus.phasedIn && doneLoadingAt) {
		samus.phaseIn(doneLoadingAt)
	}
	if (bombs.length) {
		samus.checkForBombs()
	}

	// debug.text = 
	// "\npressB: " + pressingShoot +
	// "\npressA: " + pressingJump +
	// "\nblockedL: " + samus.blocked["left"] +
	// "\nblockedR: " + samus.blocked["right"] +
	// "\nblockedUP: " + samus.blocked["up"] +
	// // "\nvelocX: " + samus.velocity.x + 
	// // "\nvelocY: " + samus.velocity.y + 
	// "\nonGround: " + samus.onGround + 
	// "\nbouncing: " + samus.bouncing + 
	// "\nascending: " + samus.ascending +
	// "\nstance: " + samus.stance +
	// "\nvelY: " + samus.velocity.y +
	// "\nmovedY: " + playerMovedY

 	if ((playerMovedX !== 0 || playerMovedY !== 0) && counter % 2 === 0 && !loadingScreen.container.visible) {
		manageSectors()
	}
	if (samus.phasedIn && !screenShifting && !loadingScreen.container.visible) {
		if (counter === pressedShiftAt) {
			if (samus.gunType !== "missile") {
				samus.changeGun("missile")
			} else {
				samus.changeGun(samus.previousGun)
			}
		}
		if (counter === pressed1At) {
			samus.changeGun(samus.weapons[0])
		}
		if (counter === pressed2At && samus.weapons[1]) {
			samus.changeGun(samus.weapons[1])
		}
		if (counter === pressed3At && samus.weapons[2]) {
			samus.changeGun(samus.weapons[2])
		}
		if (counter === pressed4At && samus.weapons[3]) {
			samus.changeGun(samus.weapons[3])
		}
		if (counter === pressed5At && samus.weapons[4]) {
			samus.changeGun(samus.weapons[4])
		}

		if (samus.injured) {
			var sinceInjured = counter-samus.injuredAt
			if (sinceInjured % 4 === 0) {
				samus.sprite.tint = 0x550000
			} else if (sinceInjured % 2 === 0) {
				samus.sprite.tint = 0xffffff
			}
			if (sinceInjured === 45) {
				samus.sprite.tint = 0xffffff
				samus.injured = false
			}
		}

		if (pressingRight && !samus.blocked["right"]) {
			samus.run(1,false)
		} else if (samus.stance !== "shooting" && samus.stance !== "ball" && samus.runIndex !== 3 && samus.onGround && samus.velocity.x < 0.75 && samus.sprite.scale.x > 0) {
			// samus.stance = "neutral"
			// console.log("setting neutral due to no RIGHT")
			samus.runIndex = 3
			samus.changeFrame(samus.runFrames[samus.stance][samus.runIndex])
			samus.startedRunning = 0
		}
		
		if (pressingLeft && !samus.blocked["left"]) {
			samus.run(-1,false)
		} else if (samus.stance !== "shooting" && samus.stance !== "ball" && samus.runIndex !== 3 && samus.onGround && samus.velocity.x > -0.75 && samus.sprite.scale.x < 0) {

			samus.runIndex = 3
			samus.changeFrame(samus.runFrames[samus.stance][samus.runIndex])
			samus.startedRunning = 0
			
		}	
		if (pressedUpAt === counter) {
			if (samus.stance !== "aimingUp") {
				if (samus.stance !== "ball") {
					samus.changeStance("aimingUp")
					if (samus.flipping) {
						samus.flipping = false
					}
					samus.changeFrame(samus.runFrames[samus.stance][samus.runIndex])
				} else {
					if (samus.stance === "ball" && !samus.blocked["up"]) {
						samus.morphing = "neutral"
						samus.beganMorphAt = counter
					}
				}  
			}
		} else if (releasedUpAt === counter) {
			if (samus.stance === "aimingUp") {
				samus.changeStance("neutral")
				samus.changeFrame(samus.runFrames[samus.stance][samus.runIndex])
			}
		}
		if (pressedDownAt === counter) {
			if (samus.flipping) {
				samus.flipping = false
			}
			samus.morphing = "ball"
			samus.beganMorphAt = counter
			if (samus.blocked["up"]) {
				samus.blocked["up"].blocking = false
				samus.blocked["up"] = false
			}
		}
		if (samus.morphing) {
			samus.morph(samus.morphing)
		}
		if (samus.stance === "shooting" && counter-pressedShootAt > 20) {
			samus.changeStance("neutral")
		}
		if (samus.flipping) {
			samus.flip()
		}
	}
	
	for (var b=0;b<bullets.length;b++) {
		var bullet = bullets[b]
		if (counter > bullet.bornAt) {
			if (bullet.doomed) {
				stage.removeChild(bullet.sprite)
				bullet.sprite.destroy()
				bullets.splice(b,1)
				b--
			} else if (bullet.blewAt) {
				bullet.explode()
			} else {
				bullet.fly()
				if (bullet.type !== "wave") {
					bullet.checkForBlocks()
				}
			}
			
		}
	}
	// debug.text = bullets.length
	for (var b=0;b<bombs.length;b++) {
		var bomb = bombs[b]
		bomb.tick()
		if (bomb.detonated) {
			bomb.explode()
		}
		if (!bomb.sprite.visible) {
			stage.removeChild(bomb.sprite)
			bombs.splice(b,1)
			b--
		}


	}
	for (var d=0;d<doorArray.length;d++) {
		
		var door = doorArray[d]
		if (door.room === currentRoom) {
			var xDiff = Math.abs(door.sprite.x-samus.sprite.x)
			var yDiff = Math.abs(door.sprite.y-samus.sprite.y)
			if (xDiff < viewWidth && yDiff < (segmentHeight*cellSize)) {
				if (!door.openedAt && !door.sprite.visible) {
					door.sprite.visible = true
				}
				// console.log("door " + d + " checking")
				if (Math.abs(playerMovedX) > 0 && counter-lastScreenShift > 30 && Math.abs(samus.sprite.x-door.sprite.x) < cellSize && !screenShifting && door.openedAt) {
					door.checkForEntry()
				}
				if (!door.openedAt) {
					door.checkForPlayer()
				}
				if (door.openedAt) {
					door.engage()
				} else {
					if (bullets.length) {
						door.checkForBullets()
					}
					if (bombs.length) {
						door.checkForBombs()
					}
				}
			} else {
				if (door.sprite.visible) {
				door.sprite.visible = false
			}
			}
		} else {
			if (door.sprite.visible) {
				door.sprite.visible = false
			}
		}
	}
	for (var e=0;e<elevatorArray.length;e++) {
		var elev = elevatorArray[e]
		if (elev.room === currentRoom && Math.abs(samus.sprite.x-elev.sprite.x) < cellSize*(segmentWidth/2) &&  Math.abs(samus.sprite.y-elev.sprite.y) < cellSize*(segmentHeight/2)) {
			if (counter-elev.lastTriggered > 300 && !elev.triggered) {
				elev.checkForPlayer()
			}
			if (!elev.sprite.visible) {
				elev.sprite.visible = true
			}
			
		} else {
			if (!elev.triggered && elev.sprite.visible) {
				if (elev.sprite.y !== elev.destY) {
					elev.sprite.visible = false
				} else if (counter-elev.lastTriggered > 300) {
					elev.checkForPlayer()
					if (!elev.sprite.visible) {
						elev.sprite.visible = true
					}
				}
			}
		}
		if (elev.triggered) {
			elev.operate()
		}
	}

	for (var f=0;f<fadingSectors.length;f++) {
		var sector = fadingSectors[f]
		if (sector.fading === 1) {
			if (sector.alpha+0.02 <= 1) {
				sector.alpha += 0.02
			} else {
				sector.alpha = 1
				sector.visible = true
			}
		} else if (sector.fading === -1) {
			if (sector.alpha-0.02 >= 0) {
				sector.alpha -= 0.02
			} else {
				sector.alpha = 0
				sector.visible = false
			}
		}
	}
	

	if (map.container.visible) {
		map.playerMark.x = ((viewPosition.x)*map.screenRatioX)+(map.cells[0][0].width/2)
		map.playerMark.y = (viewPosition.y*map.screenRatioY)+(map.cells[0][0].height/2)
		if (map.playerMark.scale.x*0.875 > map.playerMark.fullScaleX) {
			map.playerMark.scale.x *= 0.875
			map.playerMark.scale.y *= 0.875
		} else if (map.playerMark.scale.x !== map.playerMark.fullScaleX) {
			map.playerMark.scale.x = map.playerMark.fullScaleX
			map.playerMark.scale.y = map.playerMark.fullScaleY
		}
	}
	// debug.text = activeCells.length
	if (!loadingScreen.container.visible) {
		// floorCells.length = 0
		vicinityCells.length = 0
		for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
			if (playerMovedX || playerMovedY) {
				cell.checkForPlayer()
				
			}
			if (cell.type === "breakable") {
				if (!cell.vanished) {
					if (bullets.length) {
						cell.checkForBullets()
					}
					if (bombs.length) {
						cell.checkForBombs()
					}
				} else {
					var sinceVanished = counter-cell.vanished
					if (sinceVanished === cell.respawnTime) {
						cell.vanished = 0
						
					} else if (sinceVanished > cell.respawnTime-10) {
						cell.sprite.alpha += 0.1
						if (cell.sprite.alpha > 1) {
							cell.sprite.alpha = 1
						}
					} else if (sinceVanished <= 10) {
						cell.sprite.alpha -= 0.1
						if (cell.sprite.alpha < 0) {
							cell.sprite.alpha = 0
						}
					}
				}
			
			}
		}
		for (var w=0;w<wavers.length;w++) {
			var waver = wavers[w]
			if (waver.frozen) {
				var sinceFrozen = counter-waver.frozenAt
				if (sinceFrozen >= 200) {
					if (sinceFrozen % 6 === 0) {
						waver.sprite.texture = PIXI.utils.TextureCache[waver.room.zone.enemyTextures.waver[waver.type][waver.currentFrame]]
					} else if (sinceFrozen % 3 === 0) {
						waver.sprite.texture = PIXI.utils.TextureCache[waver.room.zone.enemyTextures.waver[0][waver.currentFrame]]
					}
				}
				if (sinceFrozen === 240) {
					waver.unFreeze()
				}
					
			} else {
				if (counter-waver.damagedAt < 10) {
					if (counter % 2 === 0) {
						waver.sprite.tint = 0xff0000
					} else {
						waver.sprite.tint = 0xffffff
					}
				}
				if (counter-waver.damagedAt === 10) {
					waver.sprite.tint = 0xffffff
				}
				
			}
			if (!waver.dead && currentRoom === waver.room && inRange(waver,segmentWidth*cellSize,segmentHeight*cellSize)) {
				
				if (!waver.detonated && !waver.sprite.visible) {
					waver.sprite.visible = true
				}
				if (!screenShifting) {
					if (!waver.blewAt) {
						if (bullets.length) {
							waver.checkForBullets()
						}
						if (bombs.length) {
							waver.checkForBombs()
						}
					}
					if (!waver.frozen) {
						waver.fly()
						waver.checkForBlocks()
						waver.applyVelocity()
						if (randomInt(0,1) && !waver.flexing && counter % 30 === 0) {
							waver.flexing = true
						}
						if (waver.flexing && counter % 5 === 0) {
							waver.flex()
						}
						if (waver.sprite.y > waver.room.roomObject.posY+(segmentHeight*cellSize)
						|| waver.sprite.y < waver.room.roomObject.posY) { 
							waver.reset()
						}
					}
					
					if (!waver.blewAt && !waver.frozen && !samus.injured) {
						waver.checkForSamus()
					}
					if (waver.blewAt) {
						if (waver.detonated) {
							waver.sprayGibs()
						} else {
							// waver.explode()
						}
					}
				}
			} else {
				if (waver.sprite.visible) {
					waver.sprite.visible = false
				}
			}
		}
		for (var r=0;r<pipeFlyers.length;r++) {
			var pipeFlyer = pipeFlyers[r]
			if (pipeFlyer.frozen) {
				var sinceFrozen = counter-pipeFlyer.frozenAt
				if (sinceFrozen >= 200) {
					if (sinceFrozen % 6 === 0) {
						pipeFlyer.sprite.texture = PIXI.utils.TextureCache[pipeFlyer.room.zone.enemyTextures.pipeFlyer[pipeFlyer.type][pipeFlyer.currentFrame]]
					} else if (sinceFrozen % 3 === 0) {
						pipeFlyer.sprite.texture = PIXI.utils.TextureCache[pipeFlyer.room.zone.enemyTextures.pipeFlyer[0][pipeFlyer.currentFrame]]
					}
				}
				if (sinceFrozen === 240) {
					pipeFlyer.unFreeze()
				}
					
			} else {
				if (counter-pipeFlyer.damagedAt < 10) {
					if (counter % 2 === 0) {
						pipeFlyer.sprite.tint = 0xff0000
					} else {
						pipeFlyer.sprite.tint = 0xffffff
					}
				}
				if (counter-pipeFlyer.damagedAt === 10) {
					pipeFlyer.sprite.tint = 0xffffff
				}
				
			}
			if (!pipeFlyer.dead && currentRoom === pipeFlyer.room && inRange(pipeFlyer,segmentWidth*cellSize,segmentHeight*cellSize)) {
				
				if (!pipeFlyer.detonated && !pipeFlyer.sprite.visible) {
					pipeFlyer.sprite.visible = true
				}
				if (!screenShifting) {
					if (!pipeFlyer.blewAt && pipeFlyer.sprite.y <= pipeFlyer.pipe.posY-pipeFlyer.sprite.height) {
						if (bullets.length) {
							pipeFlyer.checkForBullets()
						}
						if (bombs.length) {
							pipeFlyer.checkForBombs()
						}
					}
					if (!pipeFlyer.frozen) {
						pipeFlyer.flap(3)
					}
					if (pipeFlyer.killed < pipeFlyer.supply && !pipeFlyer.frozen && !pipeFlyer.risen) {
						pipeFlyer.rise()
						if (pipeFlyer.sprite.y < pipeFlyer.pipe.posY-pipeFlyer.sprite.height*2) {
							// pipeFlyer.checkAbove()
						}
					} else {
						if (counter-pipeFlyer.roseAt > pipeFlyer.flyDelay && !pipeFlyer.blewAt && !pipeFlyer.frozen) {
							pipeFlyer.fly()
							if (pipeFlyer.sprite.y < pipeFlyer.pipe.posY-cellSize && !pipeFlyer.offScreen()) {
								pipeFlyer.checkForBlocks()
							}
						}
					}
					if (!pipeFlyer.blewAt && !pipeFlyer.frozen && !samus.injured) {
						pipeFlyer.checkForSamus()
					}
					if (pipeFlyer.blewAt) {
						if (pipeFlyer.detonated) {
							pipeFlyer.sprayGibs()
						} else {
							// pipeFlyer.explode()
						}
					}
				}
			} else {
				if (pipeFlyer.sprite.visible) {
					pipeFlyer.sprite.visible = false
				}
			}
		}

		for (var p=0;p<powerups.length;p++) {
			var powerup = powerups[p]
			if (powerup.sprite.visible) {
				powerup.checkForSamus()
				if (counter % 2  === 0) {
					powerup.flash()
				}
				var sinceBorn = counter-powerup.bornAt
				if (sinceBorn > powerup.longevity-60) {
					if (counter % 6 === 0) {
						powerup.sprite.tint = 0x000000
					} else if (counter % 3 === 0){
						powerup.sprite.tint = 0xff0000
					}
				}
				if (sinceBorn === powerup.longevity) {
					powerup.sprite.visible = false
				}
			} else {
				// powerups.splice(powerups.indexOf(this,1))
				gameContainer.removeChild(this.sprite)
			}
		}

		for (var u=0;u<upgrades.length;u++) {
			var upgrade = upgrades[u]
			if (!upgrade.collected && upgrade.room === currentRoom) {
				if (!upgrade.sprite.visible) {
					upgrade.sprite.visible = true
				} 
				upgrade.checkForSamus()
			} else {
				if (upgrade.sprite.visible) {
					upgrade.sprite.visible = false
				}
			}
		}
		for (var f=0;f<dragonFireballs.length;f++) {
			var fireball = dragonFireballs[f]
			if (fireball.doomed) {
				stage.removeChild(fireball.sprite)
				fireball.sprite.destroy()
				dragonFireballs.splice(f,1)
				f--
			} else {
				fireball.fly()
				fireball.checkForSamus()
			}
		}
		for (var d=0;d<dragons.length;d++) {
			var dragon = dragons[d]
			if (dragon.frozen) {
				var sinceFrozen = counter-dragon.frozenAt
				if (sinceFrozen >= 200) {
					if (sinceFrozen % 6 === 0) {
						dragon.sprite.texture = PIXI.utils.TextureCache[dragon.room.zone.enemyTextures.dragon[dragon.type][dragon.currentFrame]]
					
					} else if (sinceFrozen % 3 === 0) {
						dragon.sprite.texture = PIXI.utils.TextureCache[dragon.room.zone.enemyTextures.dragon[0][dragon.currentFrame]]
					
					}
				}
				if (sinceFrozen === 240) {
					dragon.unFreeze()
				}
					
			} else {
				if (counter-dragon.damagedAt < 10) {
					if (counter % 2 === 0) {
						dragon.sprite.tint = 0xff0000
					} else {
						dragon.sprite.tint = 0xffffff
					}
				}
				if (counter-dragon.damagedAt === 10) {
					dragon.sprite.tint = 0xffffff
				}
				
			}
			if (!dragon.dead && dragon.room === currentRoom && inRange(dragon,segmentWidth*cellSize,segmentHeight*cellSize)) {
				if (!dragon.detonated && !dragon.sprite.visible) {
					dragon.sprite.visible = true
				}
				if (!dragon.frozen && !screenShifting) {
					if (Math.abs(samus.sprite.x-dragon.sprite.x) < cellSize*8) {
						if (counter-dragon.roseAt > 120 && !dragon.risen) {
							dragon.rise()
						}
					}
					if (dragon.risen) {
						dragon.checkForBullets()
						dragon.checkForSamus()
						var sinceRisen = counter-dragon.roseAt
						if (sinceRisen === dragon.fireDelay) {
							dragon.emitFireball()
						}
						if (sinceRisen >= dragon.fireDelay*2) {
							dragon.descend()
						}
					}
					if (!dragon.detonated) {
						if (bullets.length) {
							dragon.checkForBullets()
						}
						if (bombs.length) {
							dragon.checkForBombs()
						}
						if (!dragon.frozen && !samus.injured) {
							dragon.checkForSamus()
						}
					}

				}
				if (dragon.blewAt) {
					if (dragon.detonated) {
						dragon.sprayGibs()
					} else {
						dragon.explode()
					}
				}

			} else {
				if (dragon.sprite.visible) {
					dragon.sprite.visible = false
				}
			}

		}
		for (var d=0;d<squeepts.length;d++) {
			var squeept = squeepts[d]
			if (squeept.frozen) {
				var sinceFrozen = counter-squeept.frozenAt
				if (sinceFrozen >= 200) {
					if (sinceFrozen % 6 === 0) {
						squeept.sprite.texture = PIXI.utils.TextureCache[squeept.room.zone.enemyTextures.squeept[squeept.type][squeept.currentFrame]]
					
					} else if (sinceFrozen % 3 === 0) {
						squeept.sprite.texture = PIXI.utils.TextureCache[squeept.room.zone.enemyTextures.squeept[0][squeept.currentFrame]]
					
					}
				}
				if (sinceFrozen === 240) {
					squeept.unFreeze()
				}
					
			} else {
				if (counter-squeept.damagedAt < 10) {
					if (counter % 2 === 0) {
						squeept.sprite.tint = 0xff0000
					} else {
						squeept.sprite.tint = 0xffffff
					}
				}
				if (counter-squeept.damagedAt === 10) {
					squeept.sprite.tint = 0xffffff
				}
				
			}
			if (!squeept.dead && squeept.room === currentRoom && inRange(squeept,segmentWidth*cellSize,segmentHeight*cellSize)) {
				if (!squeept.detonated && !squeept.sprite.visible) {
					squeept.sprite.visible = true
				}
				if (!squeept.emergedAt && Math.abs(samus.sprite.x-squeept.sprite.x) < (segmentWidth/2)*cellSize) {
					squeept.emergedAt = counter
				}
				
				if (!squeept.frozen && !screenShifting) {
					var sinceRisen = counter-squeept.emergedAt
					if (sinceRisen >= squeept.jumpDelay) {
						squeept.rise()
						squeept.riseSpeed -= newPixelSize/12
						if (counter % 4 === 0 && !squeept.flexing) {
							squeept.flex()
						}
					}
					
					
					if (!squeept.detonated) {
						if (bullets.length) {
							squeept.checkForBullets()
						}
						if (bombs.length) {
							squeept.checkForBombs()
						}
						if (!dragon.frozen && !samus.injured) {
							squeept.checkForSamus()
						}
					}
				}
				if (squeept.blewAt) {
					if (squeept.detonated) {
						squeept.sprayGibs()
					} else {
						squeept.explode()
					}
				}
			} else {
				if (squeept.sprite.visible) {
					squeept.sprite.visible = false
				}
			}

		}

		for (var r=0;r<rippers.length;r++) {
			var ripper = rippers[r]
			if (ripper.frozen) {
				var sinceFrozen = counter-ripper.frozenAt
				if (sinceFrozen >= 200) {
					if (sinceFrozen % 6 === 0) {
						ripper.sprite.texture = PIXI.utils.TextureCache[ripper.room.zone.enemyTextures.ripper[ripper.type][ripper.currentFrame]]
					
					} else if (sinceFrozen % 3 === 0) {
						ripper.sprite.texture = PIXI.utils.TextureCache[ripper.room.zone.enemyTextures.ripper[0][ripper.currentFrame]]
					
					}
				}
				if (sinceFrozen === 240) {
					ripper.unFreeze()
				}
					
			}
			if (!ripper.dead && ripper.room === currentRoom && inRange(ripper,segmentWidth*cellSize,segmentHeight*cellSize)) {
				if (!ripper.detonated && !ripper.sprite.visible) {
					ripper.sprite.visible = true
				}
				if (!screenShifting) {
					if (!ripper.detonated && !ripper.frozen) {
						ripper.patrol()
						if (ripper.room.zone.enemyTextures.ripper[1].length > 1) {
							ripper.flap(3)
						}
					}
					ripper.checkForBlocks()
					if (!ripper.detonated && bullets.length) {
						ripper.checkForBullets()
					}
					if (!ripper.detonated && !ripper.frozen && !samus.injured) {
						ripper.checkForSamus()
					}
				}
				if (ripper.blewAt) {
					if (ripper.detonated) {
						ripper.sprayGibs()
					} else {
						ripper.explode()
					}
				}
			} else {
				if (ripper.sprite.visible) {
					ripper.sprite.visible = false
				}
			}
			
		}

		for (var r=0;r<divers.length;r++) {
			var diver = divers[r]
			if (diver.frozen) {
				var sinceFrozen = counter-diver.frozenAt
				if (sinceFrozen >= 200) {
					if (sinceFrozen % 6 === 0) {
						diver.sprite.texture = PIXI.utils.TextureCache[diver.room.zone.enemyTextures.diver[diver.type][diver.currentFrame]]
					} else if (sinceFrozen % 3 === 0) {
						diver.sprite.texture = PIXI.utils.TextureCache[diver.room.zone.enemyTextures.diver[0][diver.currentFrame]]
					
					}
				}
				if (sinceFrozen === 240) {
					diver.unFreeze()
				}
					
			} else {
				if (counter-diver.damagedAt < 10) {
					if (counter % 2 === 0) {
						diver.sprite.tint = 0xff0000
					} else {
						diver.sprite.tint = 0xffffff
					}
				}
				if (counter-diver.damagedAt === 10) {
					diver.sprite.tint = 0xffffff
				}
				
			}
			if (!diver.dead && diver.room === currentRoom && inRange(diver,segmentWidth*cellSize,segmentHeight*cellSize)) {
				if (!diver.detonated && !diver.sprite.visible) {
					diver.sprite.visible = true
					if (diver.sprite.alpha === 0) {
						diver.sprite.alpha = 1
					}
				}
				if (!diver.homeCell) {
					diver.findCeiling()
				}
				if (!diver.frozen && !screenShifting) {
					if (!diver.blewAt && !diver.dove) {
						
						diver.spin(10)
						if (Math.abs(samus.sprite.x-diver.sprite.x) < cellSize*5) {
							diver.dove = true
						}
					}
					if (!diver.blewAt && !diver.frozen && diver.dove) {
						if (!diver.landed) {
							diver.dive()
							diver.checkForGround()
						} else {
							if (counter-diver.landedAt === 30) {
								diver.blewAt = counter
								diver.detonate()
							}
						}
						diver.spin(3)
					}
					if (!diver.detonated) {				
						if (bullets.length) {
							diver.checkForBullets()
						}
						if (bombs.length) {
							diver.checkForBombs()
						}
						if (!diver.frozen && !samus.injured) {
							diver.checkForSamus()
						}
					}
					
				}
				if (diver.blewAt) {
					if (diver.detonated) {
						diver.sprayGibs()
					} else {
						diver.explode()
					}
				}
			} else {
				if (diver.sprite.visible) {
					diver.sprite.visible = false
				}
			}

		}
		for (var b=0;b<bombers.length;b++) {
			var bomber = bombers[b]
			if (bomber.frozen) {
				var sinceFrozen = counter-bomber.frozenAt
				if (sinceFrozen >= 200) {
					if (sinceFrozen % 6 === 0) {
						bomber.sprite.texture = PIXI.utils.TextureCache[bomber.room.zone.enemyTextures.bomber[bomber.type][bomber.currentFrame]]
					} else if (sinceFrozen % 3 === 0) {
						bomber.sprite.texture = PIXI.utils.TextureCache[bomber.room.zone.enemyTextures.bomber[0][bomber.currentFrame]]
					
					}
				}
				if (sinceFrozen === 240) {
					bomber.unFreeze()
				}
					
			} else {
				if (counter-bomber.damagedAt < 10) {
					if (counter % 2 === 0) {
						bomber.sprite.tint = 0xff0000
					} else {
						bomber.sprite.tint = 0xffffff
					}
				}
				if (counter-bomber.damagedAt === 10) {
					bomber.sprite.tint = 0xffffff
				}
				
			}
			if (!bomber.dead && bomber.room === currentRoom && inRange(bomber,segmentWidth*cellSize,segmentHeight*cellSize)) {
				if (!bomber.detonated && !bomber.sprite.visible) {
					bomber.sprite.visible = true
					if (bomber.sprite.alpha === 0) {
						bomber.sprite.alpha = 1
					}
				}
				if (!bomber.ascending && !bomber.homeCell) {
					bomber.findCeiling()
				}
				if (!screenShifting) {
					if (!bomber.blewAt && !bomber.dove) {
						if (Math.abs(samus.sprite.x-bomber.sprite.x) < cellSize*5) {
							bomber.dove = true
						}
					}
					if (!bomber.blewAt && !bomber.frozen && bomber.dove) {
						if (!bomber.landed && counter-bomber.relandedAt > bomber.diveDelay) {
							bomber.dive()
							bomber.checkForGround()
						} else if (bomber.ascending) {
							bomber.ascend()
							bomber.checkForGround()
						}
						
					}
					if (!bomber.frozen) {
						bomber.flap(6)
					}
					if (!bomber.detonated) {				
						if (bullets.length) {
							bomber.checkForBullets()
						}
						if (bombs.length) {
							bomber.checkForBombs()
						}
						if (!bomber.frozen && !samus.injured) {
							bomber.checkForSamus()
						}
					}
					
				}
				if (bomber.blewAt) {
					if (bomber.detonated) {
						bomber.sprayGibs()
					} else {
						bomber.explode()
					}
				}
			} else {
				if (bomber.sprite.visible) {
					bomber.sprite.visible = false
				}
			}

		}
		for (var s=0;s<swoopers.length;s++) {
			var swooper = swoopers[s]
			if (swooper.frozen) {
				var sinceFrozen = counter-swooper.frozenAt
				if (sinceFrozen >= 200) {
					if (sinceFrozen % 6 === 0) {
						swooper.sprite.texture = PIXI.utils.TextureCache[swooper.room.zone.enemyTextures.swooper[swooper.type][swooper.currentFrame]]
					} else if (sinceFrozen % 3 === 0) {
						swooper.sprite.texture = PIXI.utils.TextureCache[swooper.room.zone.enemyTextures.swooper[0][swooper.currentFrame]]
					
					}
				}
				if (sinceFrozen === 240) {
					swooper.unFreeze()
				}
					
			} else {
				if (counter-swooper.damagedAt < 10) {
					if (counter % 2 === 0) {
						swooper.sprite.tint = 0xff0000
					} else {
						swooper.sprite.tint = 0xffffff
					}
				}
				if (counter-swooper.damagedAt === 10) {
					swooper.sprite.tint = 0xffffff
				}
				
			}
			if (!swooper.dead && swooper.room === currentRoom && inRange(swooper,segmentWidth*cellSize,segmentHeight*cellSize)) {
				if (!swooper.detonated && !swooper.sprite.visible) {
					swooper.sprite.visible = true
					if (swooper.sprite.alpha === 0) {
						swooper.sprite.alpha = 1
					}
				}
				if (!swooper.ascending && !swooper.homeCell) {
					swooper.findCeiling()
				}
				if (!screenShifting) {
					if (!swooper.blewAt && !swooper.dove) {
						if (Math.abs(samus.sprite.x-swooper.sprite.x) < swooper.detectionRange) {
							swooper.dove = true
						}
					}
					if (!swooper.blewAt && !swooper.frozen && swooper.dove) {
						if (!swooper.landed && counter-swooper.relandedAt > swooper.diveDelay) {
							swooper.dive()
							swooper.checkForGround()
						} else if (swooper.ascending) {
							swooper.ascend()
							swooper.checkForGround()
						}
						
					}
					if (!swooper.frozen) {
						swooper.flap(6)
					}
					if (!swooper.detonated) {				
						if (bullets.length) {
							swooper.checkForBullets()
						}
						if (bombs.length) {
							swooper.checkForBombs()
						}
						if (!swooper.frozen && !samus.injured) {
							swooper.checkForSamus()
						}
					}
					
				}
				if (swooper.blewAt) {
					if (swooper.detonated) {
						swooper.sprayGibs()
					} else {
						swooper.explode()
					}
				}
			} else {
				if (swooper.sprite.visible) {
					swooper.sprite.visible = false
				}
			}

		}

		for (var r=0;r<crawlers.length;r++) {
			var crawler = crawlers[r]
			if (crawler.frozen) {
				var sinceFrozen = counter-crawler.frozenAt
				if (sinceFrozen >= 200) {
					if (sinceFrozen % 6 === 0) {
						crawler.sprite.texture = crawler.origTexture
					} else if (sinceFrozen % 3 === 0) {
						crawler.sprite.texture = crawler.freezeTexture
					}
				}
				if (sinceFrozen === 240) {
					crawler.unFreeze()
				}
					
			} else {
				if (counter-crawler.damagedAt < 10) {
					if (counter % 4 === 0) {
						crawler.sprite.tint = 0xff0000
					} else if (counter % 2 === 0) {
						crawler.sprite.tint = 0xffffff
					}
				}
				if (counter-crawler.damagedAt === 10) {
					crawler.sprite.tint = 0xffffff
				}
				
			}
			if (!crawler.dead && crawler.room === currentRoom && inRange(crawler,segmentWidth*cellSize,segmentHeight*cellSize)) {
				if (!crawler.detonated && !crawler.sprite.visible) {
					crawler.sprite.visible = true
				}
				if (!crawler.blewAt && !screenShifting) {
					// if (!crawler.attachedTo) {
					// 	// crawler.sprite.y += 1
					// 	crawler.sprite.tint = 0xff0000
					// } else {
					// 	crawler.sprite.tint = 0xffffff
					// }
					crawler.checkForAttachedBlock()
					// crawler.checkForBlocks()
					if (!crawler.frozen) {
						if (crawler.attachedTo) {
							// if (pressingSpace) {
								crawler.walk(crawler.walkDirection)
							// }
						} else {
							// crawler.sprite.y -= newPixelSize/12
						}
					}
					if (bullets.length) {
						crawler.checkForBullets()
					}
					if (bombs.length) {
						crawler.checkForBombs()
					}
					if (!crawler.frozen && !samus.injured) {
						crawler.checkForSamus()
					}
				}
				if (crawler.blewAt) {
					if (crawler.detonated) {
						crawler.sprayGibs()
					} else {
						crawler.explode()
					}
				}
			} else {
				if (crawler.sprite.visible) {
					crawler.sprite.visible = false
				}
			}
		}
	}
	// console.log(activeCells.length)
	// debug.text = "stuck: " + samus.stuckOnCell 
	// "\nvic cells: " + vicinityCells.length +
	// "\nfloorCells : " + floorCells.length
	
	// if (samus.velocity.y !== 0) {
		
	// }
	if (gameContainer.scale.x > 0.5) {
		handleCamera()
	}
	// if (pressedDownAt === counter) {
	// 	samus.sprite.y += cellSize*4
	// }
	if (samus.stance === "ball") {
		// console.log("ball velocY " + samus.velocity.y + " at " + counter)
	}
	if (!samus.blocked["up"] && (pressedJumpAt === counter)) {
		if ((!samus.ascending && samus.onGround) || samus.stuckOnCell) {
			if (samus.stance !== "ball") {
				samus.beginJump()
			} else {
				samus.morphing = "neutral"
				samus.beganMorphAt = counter
			}
		}
	}
	if (counter > 5 && pressedShootAt === counter) {
		if (samus.stance === "ball") {
			samus.dropBomb()
		} else {
			samus.shoot()
		}
	} else {
		if (samus.stance !== "ball") {
			if (counter === pressedShootAt+5 || counter === pressedEAt+5) {
				// console.log("changing to prev frame " + this.previousFrame + " after shot")
				// samus.changeFrame(samus.previousFrame)
			}
		}
	}

	if (samus.stuckOnCell) {
		if (counter % samus.lavaDefense === 0) {
			samus.hp--
		}
		energyDisplay.updateDisplay()
	}
	
	
	
	if (!samus.onGround && samus.ascending) {
		if (samus.stance !== "ball") {
			samus.ascend()
		}
		if (samus.velocity.y > 0) {
			samus.ascending = false
		}
	}
	if (counter > doneLoadingAt+10 && samus.velocity.y > 0) {
		if (samus.ascending) {
			samus.ascending = false
		}
		if (samus.stance !== "ball" && samus.runIndex !== 4) {
			samus.runIndex = 4
			samus.changeFrame(samus.runFrames[samus.stance][samus.runIndex])
		}
	}

	if (samus.sprite.y-(samus.standingHeight/2) > (-gameContainer.y+(segmentHeight*cellSize))) {
		samus.sprite.y = (-gameContainer.y+(segmentHeight*cellSize))+(samus.standingHeight/2)
	}

	if (!screenShifting && !loadingScreen.container.visible) {
		samus.applyVelocity()
		samus.applyGravity()
	}
	if (!screenShifting && counter-samus.jumpedAt > 0 && (pressedDownAt === counter || Math.abs(playerMovedX) > 0 || Math.abs(playerMovedY) > 0)) {
		samus.checkForBlockingCells()
	}
	playerMovedX = samus.sprite.x-samus.previousPosition.x
	playerMovedY = samus.sprite.y-samus.previousPosition.y
	
	
	
	samus.previousPosition.x = samus.sprite.x
	samus.previousPosition.y = samus.sprite.y
	
	// debug.text = "onGround: " + samus.onGround +
	// "\nvelocityY: " + samus.velocity.y +
	// "\nfloor: " + currentFloor

	
		
	

	// console.log(samus.sprite.y)
	
	// debug.text = cellTextures.length
	if (rightClickedAt === counter) {
		toggleMap()
	}
	// debug.text = (
	// "presD: " + pressedDownAt + 
	// "\rpresingD: " + pressingDown + 
	// "\rheight: " + samus.sprite.height + 
	// "\rproperHeight: " + (40*(cellSize/16)) + 
	// "\rroundedHeight: " + (40*newPixelSize) + 
	// "\rcellSize: " + cellSize + 
	// "\runroudnedCell: " + (viewHeight/15) + 
	// "\rpixelSize: " + newPixelSize + 
	// "\runrounded: " + (cellSize/16) + 
	// "velocX: " + Math.round(samus.velocity.x) + 
	// "\rvelocY: " + Math.round(samus.velocity.y) + 
	// // "\rscaleX: " + samus.sprite.scale.x + 
	// "\rbUp: " + samus.blocked["up"] + 
	// "\rbLeft: " + samus.blocked["left"] + 
	// "\rbRight: " + samus.blocked["right"] +
	// "\ranchorY: " + samus.sprite.anchor.y +
	// "\rstance: " + samus.stance +
	// "\rrealHeight: " + samus.standingHeight +
	// "\rcenterX: " + samus.centerX() +
	// "\rspriteY: " + Math.round(samus.sprite.y) +
	// "\rmovedY: " + Math.round(playerMovedY) +
	// "\rpressedJump: " + pressedJumpAt +
	// "\rmovedX: " + Math.round(playerMovedX) +
	// "\rgunRetracted: " + samus.gunRetracted +
	// "\ronGround: " + samus.onGround 
	// ""
	// )

	// if (touches.length) {
		// debug.text = 
		// "\nfingeron: " + fingerOnScreen +
		// "\ntouches: " + touches.length +
		// "\npressL: " + pressingLeft +
		// "\npressB: " + pressingShoot +
		// "\npressA: " + pressingJump +
		// "\nmark: " + map.playerMark.scale.x
	// }
	
	// gameContainer.x = Math.round(gameContainer.x)
	// gameContainer.y = Math.round(gameContainer.y)
	// gameContainer.width = Math.round(gameContainer.width)
	// gameContainer.height = Math.round(gameContainer.height)
	counter++
} else {
	titleScreen.animate()
		if (titleScreen.container.alpha+0.025 <= 1) {
			titleScreen.container.alpha += 0.025
		} else {
			titleScreen.container.alpha = 1
		}
		precounter++
	} // GAME STARTED
	renderer.render(stage);
	requestAnimationFrame(update);
	
}