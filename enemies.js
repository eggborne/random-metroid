function inRange(obj,limitX,limitY) {
    var distX = Math.abs((-gameContainer.x+(viewWidth/2))-obj.sprite.x)
    if (obj.sprite.anchor.y === 0.5) {
        var distY = Math.abs(((-gameContainer.y+((segmentHeight*cellSize)/2))-(samus.standingHeight/2))-obj.sprite.y)
    } else {
        var distY = Math.abs(((-gameContainer.y+((segmentHeight*cellSize)/2))-(samus.standingHeight/2))-obj.sprite.y+(obj.sprite.height/2))
    }
    
    if (distX < limitX && distY < limitY) {
        return true
    } else {
        return false
    }
}
function DragonFireball(owner) {
    this.sprite = preparedSprite(PIXI.utils.TextureCache["dragonfireball.png"],0.5,0.5)
    if (owner.sprite.scale.x < 0) {
        this.sprite.scale.x *= -1
        this.sprite.x = owner.sprite.x+(cellSize/1.4)
        
        this.flyAngle = degToRad(-55)
    } else {
        this.sprite.x = owner.sprite.x-(cellSize/1.4)
        this.flyAngle = degToRad(-125)
    }
    this.sprite.y = owner.sprite.y-(cellSize/3.6)
    this.doomed = false
    gameContainer.addChild(this.sprite)
    dragonFireballs.push(this)
    this.fly = function() {
        if (this.sprite.scale.x < 0) {
            this.flyAngle += (degToRad(2))
        } else {
            this.flyAngle -= (degToRad(2))
        }
        var oldY = this.sprite.y
        var newSpot = pointAtAngle(this.sprite.x,this.sprite.y,this.flyAngle,newPixelSize*4)
        this.sprite.x = newSpot.x
        this.sprite.y = newSpot.y
        if (oldY < newSpot.y && this.sprite.scale.y > 0) {
            this.sprite.scale.y *= -1
        }
        if (this.flyAngle <= degToRad(-270) || this.flyAngle >= degToRad(90) || Math.abs(this.sprite.x-samus.sprite.x) > viewWidth || Math.abs(this.sprite.y-samus.sprite.y) > viewHeight) {
            this.doomed = true
        }
    }
    this.checkForSamus = function() {
        var distX = Math.abs(this.sprite.x-samus.sprite.x)
        var distY = Math.abs(this.sprite.y-(samus.sprite.y-(samus.standingHeight/2)))
        if (distX < cellSize && distY < (this.sprite.height/2)+(samus.standingHeight/2)) {
            this.doomed = true
            samus.takeDamage(this,30)
        }
    }
}
function Dragon(posX,posY,room) {
    var randomType = randomInt(1,currentZone.enemyTextures.dragon.length-1)
    this.type = randomType
    this.touchDamage = 14
	this.room = room
    room.enemies.push(this)
    this.hp = this.maxHP = 30
    
	this.frozen = false
    this.frozenAt = -99
    this.freezeBlock = undefined
	this.floatSpeed = (newPixelSize/2)+((randomType-1)*(newPixelSize/8))
    this.currentFrame = 0
    this.origTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.dragon[this.type][this.currentFrame]]
    this.freezeTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.dragon[0][0]]
	this.sprite = preparedSprite(this.origTexture,0.5,0)
    this.sprite.width = Math.round(this.sprite.width)
    this.sprite.height = Math.round(this.sprite.height)
    
    this.origin = {x:undefined,y:undefined}
	this.sprite.x = this.origin.x = posX
	this.sprite.y = this.origin.y = posY
	gameContainer.addChildAt(this.sprite,0)
	this.sprite.visible = false
    this.dead = false
    this.blewAt = undefined
    this.gibs = []
    this.detonated = false
    this.risen = false
    this.roseAt = -99
    this.fireDelay = randomInt(10,30)
    this.riseDistance = cellSize*(randomInt(10,19)/10)
    this.riseSpeed = newPixelSize*2
    this.slowRate = 1
    this.reset = function() {
        this.risen = false
        this.sprite.x = this.origin.x
		this.sprite.y = this.origin.y
        this.sprite.tint = 0xffffff
        this.sprite.texture = this.origTexture
        this.blewAt = undefined
        this.hp = this.maxHP
        this.gibs.length = 0
        this.detonated = false
        this.slowRate = 1
    }
    this.detonate = function() {
        this.detonated = true
        this.sprite.visible = false
        
        for (var g=0;g<4;g++) {
            var gib = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
            gib.anchor.set(0.5)
            gib.tint = 0xff0000
            gib.width = cellSize/3.5
            gib.height = cellSize/3.5
            if (g===0) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===1) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===2) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            } else if (g===3) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            }
            this.gibs.push(gib)
            gameContainer.addChild(gib)
        }
    }
    this.sprayGibs = function() {
        var sinceBlew = counter-this.blewAt
        for (var g=0;g<this.gibs.length;g++) {
            var gib = this.gibs[g]
            if (g===0) {
                gib.x -= cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===1) {
                gib.x += cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===2) {
                gib.x -= cellSize/4
                gib.y -= cellSize/10
            } else if (g===3) {
                gib.x += cellSize/4
                gib.y -= cellSize/10
            }
            gib.y += (sinceBlew*(newPixelSize))
            if (sinceBlew === 8) {
                gib.destroy()
            }
        }
        
        if (sinceBlew === 8) {
            this.dead = true
            this.reset()
        }
    }
    this.rise = function() {
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        if (this.sprite.scale.x < 0 && samus.sprite.x < this.sprite.x) {
            this.sprite.scale.x *= -1
        }
        if (this.sprite.scale.x > 0 && samus.sprite.x > this.sprite.x) {
            this.sprite.scale.x *= -1
        }
        if (this.sprite.y-this.riseSpeed > this.origin.y-this.riseDistance) {
            this.sprite.y -= this.riseSpeed*this.slowRate
        } else {
            this.sprite.y = this.origin.y-this.riseDistance
            this.risen = true
            this.roseAt = counter
        }
    }
    this.descend = function() {
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        if (this.sprite.y+this.riseSpeed < this.origin.y) {
            this.sprite.y += this.riseSpeed*this.slowRate
        } else {
            this.sprite.y = this.origin.y
            this.risen = false
            this.fireDelay = randomInt(10,30)
            this.riseDistance = cellSize*(randomInt(10,19)/10)
        }
    }
    this.emitFireball = function() {
        var fireball = new DragonFireball(this)
        if (this.sprite.scale.x > 0) {

        }
    }
    this.checkForSamus = function() {
        var xDist = samus.sprite.x-this.sprite.x
        var yDist = (samus.sprite.y-(samus.standingHeight/2))-(this.sprite.y+(this.sprite.height/2))
        var collisionX = cellSize
        var collisionY = (samus.standingHeight/2)+(this.sprite.height/2)
        if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
            samus.takeDamage(this,this.touchDamage)
        }
    }
    this.checkForBullets = function() {
        for (var b=0;b<bullets.length;b++) {
            var bullet = bullets[b]
            var xDist = this.sprite.x-bullet.sprite.x
            var yDist = (this.sprite.y+(this.sprite.height/2))-bullet.sprite.y
            var collisionX = (this.sprite.height/2)+(bullet.sprite.height/2)
            var collisionY = (this.sprite.width/2)+(bullet.sprite.height/2)
            if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
                if (bullet.type !== "missile") {
                    bullet.doomed = true
                    if (bullet.launchDirection.x === 1) {
                        bullet.sprite.x = this.sprite.x-(this.sprite.width/2)-(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.x === -1) {
                        bullet.sprite.x = this.sprite.x+(this.sprite.width/2)+(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.y === -1) {
                        bullet.sprite.y = this.sprite.y+this.sprite.height+(bullet.sprite.height/2)
                    }
                } else {
                    bullet.blewAt = counter
                }
                this.hp -= bullet.damage
                this.damagedAt = counter
                if (this.hp <= 0) {
                    // this.dead = true
                    if (this.frozen) {
                        this.unFreeze()
                    }
                    if (randomInt(0,1)) {
                        var powerup = "health"
                    } else {
                        var powerup = "missile"
                    }
                    new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                    this.blewAt = counter
                    if (!this.detonated) {
                        this.detonate()
                    }
                }
                if (bullet.type === "ice") {
                    if (!this.dead && !this.frozen) {
                        this.frozen = true
                        this.frozenAt = counter
                        this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.dragon[0][this.currentFrame]]
                        this.freezeBlock = undefined
                        this.freezeBlock = new Cell(0,0,this.sprite.x-(this.sprite.width/2),this.sprite.y)
                        activeCells.push(this.freezeBlock)
                        this.freezeBlock.sprite.alpha = 0
                        this.freezeBlock.sprite.width = this.sprite.width
                        // this.freezeBlock.sprite.height = this.sprite.height
                    } else {
                        this.unFreeze()
                    }
                }
            }
        }
    }
    this.checkForBombs = function() {
		for (var b=0;b<bombs.length;b++) {
			var bomb = bombs[b]
			if (bomb.detonated) {
				var diffX = this.sprite.x-bomb.sprite.x
                var diffY = this.sprite.y-bomb.sprite.y
				if (Math.abs(diffX) <= cellSize) {
					this.hp -= bomb.damage
                    this.damagedAt = counter
                    if (this.hp <= 0) {
                        // this.dead = true
                        this.killed++
                        if (this.frozen) {
                            this.unFreeze()
                        }
                        if (randomInt(0,1)) {
                            var powerup = "health"
                        } else {
                            var powerup = "missile"
                        }
                        new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                        if (!this.detonated) {
                            this.detonate()
                            this.blewAt = counter
                        }
                    }
				}
			}
		}
	}
    this.unFreeze = function() {
		this.frozen = false
		if (samus.standingOnCell === this.freezeBlock) {
			samus.onGround = false
		}
		this.freezeBlock.sprite.visible = false					
		this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.dragon[this.type][this.currentFrame]]
        this.frozenAt = -99
	}
    dragons.push(this)

}
function Squeept(posX,posY,room) {
    var randomType = randomInt(1,currentZone.enemyTextures.squeept.length-1)
    this.type = randomType
    this.touchDamage = 14
	this.room = room
    room.enemies.push(this)
    this.hp = this.maxHP = 30
	this.frozen = false
    this.frozenAt = -99
    this.freezeBlock = undefined
	this.floatSpeed = (newPixelSize/2)+((randomType-1)*(newPixelSize/8))
    this.currentFrame = 0
    this.origTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.squeept[this.type][this.currentFrame]]
    this.freezeTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.squeept[0][0]]
	this.sprite = preparedSprite(this.origTexture,0.5,0)
    this.sprite.width = Math.round(this.sprite.width)
    this.sprite.height = Math.round(this.sprite.height)
    
    this.origin = {x:undefined,y:undefined}
	this.sprite.x = this.origin.x = posX
	this.sprite.y = this.origin.y = posY
	gameContainer.addChildAt(this.sprite,0)
	this.sprite.visible = false
    this.dead = false
    this.blewAt = undefined
    this.gibs = []
    this.detonated = false
    this.emerged = false
    this.emergedAt = undefined
    this.jumpDelay = randomInt(30,60)
    this.riseDistance = cellSize*randomInt(5,9)
    this.riseSpeed = cellSize/(randomInt(30,40)/10)
    this.slowRate = 1
    this.reset = function() {
        this.emerged = false
        this.sprite.x = this.origin.x
		this.sprite.y = this.origin.y
        this.sprite.tint = 0xffffff
        this.sprite.texture = this.origTexture
        this.blewAt = undefined
        this.hp = this.maxHP
        this.gibs.length = 0
        this.detonated = false
        this.riseSpeed = cellSize/3
        this.emergedAt = undefined
        this.riseSpeed = cellSize/(randomInt(30,40)/10)
        this.slowRate = 1
    }
    
    this.detonate = function() {
        this.detonated = true
        this.sprite.visible = false
        
        for (var g=0;g<4;g++) {
            var gib = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
            gib.anchor.set(0.5)
            gib.tint = 0xff0000
            gib.width = cellSize/3.5
            gib.height = cellSize/3.5
            if (g===0) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===1) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===2) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            } else if (g===3) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            }
            this.gibs.push(gib)
            gameContainer.addChild(gib)
        }
    }
    this.sprayGibs = function() {
        var sinceBlew = counter-this.blewAt
        for (var g=0;g<this.gibs.length;g++) {
            var gib = this.gibs[g]
            if (g===0) {
                gib.x -= cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===1) {
                gib.x += cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===2) {
                gib.x -= cellSize/4
                gib.y -= cellSize/10
            } else if (g===3) {
                gib.x += cellSize/4
                gib.y -= cellSize/10
            }
            gib.y += (sinceBlew*(newPixelSize))
            if (sinceBlew === 8) {
                gib.destroy()
            }
        }
        
        if (sinceBlew === 8) {
            this.dead = true
            this.reset()
        }
    }
    this.rise = function() {
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        if (this.sprite.scale.x < 0 && samus.sprite.x < this.sprite.x) {
            this.sprite.scale.x *= -1
        }
        if (this.sprite.scale.x > 0 && samus.sprite.x > this.sprite.x) {
            this.sprite.scale.x *= -1
        }
        if (this.sprite.y-(this.riseSpeed*this.slowRate) < this.origin.y) {
            this.sprite.y -= this.riseSpeed*this.slowRate
        } else {
            console.log("resetting " + counter)
            this.emergedAt = undefined
            this.riseSpeed = cellSize/(randomInt(30,40)/10)
            // this.reset()
        }

        
    }
    this.flexPattern = [0,0,0,0,1,1,1,2,2,2,2,2,2,2,2,1,1,1,0,0,0,0]
    this.flexIndex = 0
    this.flexing = false
    this.flex = function() {
        this.currentFrame = this.flexPattern[this.flexIndex]
        this.sprite.texture = PIXI.utils.TextureCache[this.room.zone.enemyTextures.squeept[this.type][this.currentFrame]]
        this.flexIndex++
        if (this.flexIndex === this.flexPattern.length) {
            this.flexing = false
            this.flexIndex = 0
        }
    }
    this.descend = function() {
        if (this.sprite.y+this.riseSpeed < this.origin.y) {
            this.sprite.y += this.riseSpeed
        } else {
            this.sprite.y = this.origin.y
            this.risen = false
            this.jumpDelay = randomInt(30,60)
            this.riseDistance = cellSize*randomInt(5,9)
        }
    }
    this.emitFireball = function() {
        var fireball = new DragonFireball(this)
        if (this.sprite.scale.x > 0) {

        }
    }
    this.checkForSamus = function() {
        var xDist = samus.sprite.x-this.sprite.x
        var yDist = (samus.sprite.y-(samus.standingHeight/2))-(this.sprite.y+(this.sprite.height/2))
        var collisionX = cellSize
        var collisionY = (samus.standingHeight/2)+(this.sprite.height/2)
        if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
            samus.takeDamage(this,this.touchDamage)
        }
    }
    this.checkForBullets = function() {
        for (var b=0;b<bullets.length;b++) {
            var bullet = bullets[b]
            var xDist = this.sprite.x-bullet.sprite.x
            var yDist = (this.sprite.y+(this.sprite.height/2))-bullet.sprite.y
            var collisionX = (this.sprite.height/2)+(bullet.sprite.height/2)
            var collisionY = (this.sprite.width/2)+(bullet.sprite.height/2)
            if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
                if (bullet.type !== "missile") {
                    bullet.doomed = true
                    if (bullet.launchDirection.x === 1) {
                        bullet.sprite.x = this.sprite.x-(this.sprite.width/2)-(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.x === -1) {
                        bullet.sprite.x = this.sprite.x+(this.sprite.width/2)+(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.y === -1) {
                        bullet.sprite.y = this.sprite.y+this.sprite.height+(bullet.sprite.height/2)
                    }
                } else {
                    bullet.blewAt = counter
                }
                this.hp -= bullet.damage
                this.damagedAt = counter
                if (this.hp <= 0) {
                    // this.dead = true
                    if (this.frozen) {
                        this.unFreeze()
                    }
                    if (randomInt(0,1)) {
                        var powerup = "health"
                    } else {
                        var powerup = "missile"
                    }
                    new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                    this.blewAt = counter
                    if (!this.detonated) {
                        this.detonate()
                    }
                }
                if (bullet.type === "ice") {
                    if (!this.dead && !this.frozen) {
                        this.frozen = true
                        this.frozenAt = counter
                        this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.squeept[0][this.currentFrame]]
                        this.freezeBlock = undefined
                        this.freezeBlock = new Cell(0,0,this.sprite.x-(this.sprite.width/2),this.sprite.y)
                        activeCells.push(this.freezeBlock)
                        this.freezeBlock.sprite.alpha = 0
                        this.freezeBlock.sprite.width = this.sprite.width
                        // this.freezeBlock.sprite.height = this.sprite.height
                    } else {
                        this.unFreeze()
                    }
                }
            }
        }
    }
    this.checkForBombs = function() {
		for (var b=0;b<bombs.length;b++) {
			var bomb = bombs[b]
			if (bomb.detonated) {
				var diffX = this.sprite.x-bomb.sprite.x
                var diffY = this.sprite.y-bomb.sprite.y
				if (Math.abs(diffX) <= cellSize) {
					this.hp -= bomb.damage
                    this.damagedAt = counter
                    if (this.hp <= 0) {
                        // this.dead = true
                        if (this.frozen) {
                            this.unFreeze()
                        }
                        if (randomInt(0,1)) {
                            var powerup = "health"
                        } else {
                            var powerup = "missile"
                        }
                        new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                        if (!this.detonated) {
                            this.detonate()
                            this.blewAt = counter
                        }
                    }
				}
			}
		}
	}
    this.unFreeze = function() {
		this.frozen = false
		if (samus.standingOnCell === this.freezeBlock) {
			samus.onGround = false
		}
		this.freezeBlock.sprite.visible = false					
		this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.squeept[this.type][this.currentFrame]]
        this.frozenAt = -99
	}
    squeepts.push(this)

}

function Ripper(posX,posY,room) {
    var randomType = randomInt(1,currentZone.enemyTextures.ripper.length-1)
    this.type = randomType
    this.touchDamage = 14
	this.room = room
    room.enemies.push(this)
    this.hp = 100
    this.maxHP = 100
	this.floatDirection = -1
	this.frozen = false
    this.frozenAt = -99
    this.freezeBlock = undefined
	this.floatSpeed = (newPixelSize/2)+((randomType-1)*(newPixelSize/8))
    this.currentFrame = 0
    this.origTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.ripper[this.type][this.currentFrame]]
    this.freezeTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.ripper[0][0]]
	this.sprite = preparedSprite(this.origTexture,0.5,0)
    this.sprite.width = Math.round(this.sprite.width)
    this.sprite.height = Math.round(this.sprite.height)
    
    this.origin = {x:undefined,y:undefined}
	this.sprite.x = this.origin.x = posX
	this.sprite.y = this.origin.y = posY
	gameContainer.addChild(this.sprite)
	this.sprite.visible = false
    this.dead = false
    this.blewAt = undefined
    this.gibs = []
    this.detonated = false
    
    this.reset = function() {
        if (this.sprite.scale.x < 0) {
            this.sprite.scale.x *= -1
        }
        // this.sprite.x = this.origin.x
		// this.sprite.y = this.origin.y
        this.sprite.tint = 0xffffff
        // this.sprite.visible = true
        this.sprite.texture = this.origTexture
        
        this.sprite.alpha = 1
        this.blewAt = undefined
        this.hp = this.maxHP
        this.slowRate = 1
        // this.dead = false
        this.gibs.length = 0
        this.detonated = false
    }
    this.detonate = function() {
        this.detonated = true
        this.sprite.visible = false
        
        for (var g=0;g<4;g++) {
            var gib = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
            gib.anchor.set(0.5)
            gib.tint = 0xff0000
            gib.width = cellSize/3.5
            gib.height = cellSize/3.5
            if (g===0) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===1) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===2) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            } else if (g===3) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            }
            this.gibs.push(gib)
            gameContainer.addChild(gib)
        }
    }
    this.sprayGibs = function() {
        var sinceBlew = counter-this.blewAt
        for (var g=0;g<this.gibs.length;g++) {
            var gib = this.gibs[g]
            if (g===0) {
                gib.x -= cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===1) {
                gib.x += cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===2) {
                gib.x -= cellSize/4
                gib.y -= cellSize/10
            } else if (g===3) {
                gib.x += cellSize/4
                gib.y -= cellSize/10
            }
            gib.y += (sinceBlew*(newPixelSize))
            if (sinceBlew === 8) {
                gib.destroy()
            }
        }
        
        if (sinceBlew === 8) {
            this.dead = true
            this.reset()
        }
    }
    this.flap = function(speed) {
        if (counter % (speed*2) === 0) {
            this.currentFrame = 0
            this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.ripper[this.type][this.currentFrame]]
        } else if (counter % speed === 0) {
            this.currentFrame = 1
            this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.ripper[this.type][this.currentFrame]]
        }
    }
	this.checkForBlocks = function() {
		for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
			if (cell.sprite.visible && this.freezeBlock !== cell && cell.sprite.y === this.sprite.y) {
				var diffX = this.sprite.x-(cell.sprite.x+(cellSize/2))
				if (Math.abs(diffX) <= cellSize) {
					if (diffX < 0) {
						this.sprite.x = cell.sprite.x-(cellSize/2)
					} else {
						this.sprite.x = cell.sprite.x+(cellSize*1.5)
					}
					this.floatDirection *= -1
					this.sprite.scale.x *= -1
				}
			}
		}
        for (var d=0;d<room.roomObject.doors.length;d++) {
            var door = room.roomObject.doors[d]
            
            var xDist = this.sprite.x-(door.sprite.x+(cellSize/2))
            if (Math.abs(xDist) <= cellSize/2) {
                if (xDist < 0) {
                    // this.sprite.x = door.sprite.x-(cellSize/2)
                } else {
                    // this.sprite.x = door.sprite.x+(cellSize*1.5)
                }
                this.floatDirection *= -1
                this.sprite.scale.x *= -1
            }
        }
	}
    this.checkForSamus = function() {
        var xDist = samus.sprite.x-this.sprite.x
        var yDist = (samus.sprite.y-(samus.standingHeight/2))-(this.sprite.y+(this.sprite.height/2))
        var collisionX = cellSize
        var collisionY = (samus.standingHeight/2)+(this.sprite.height/2)
        if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
            samus.takeDamage(this,this.touchDamage)
        }
    }
    this.checkForBullets = function() {
        for (var b=0;b<bullets.length;b++) {
            var bullet = bullets[b]
            var xDist = this.sprite.x-bullet.sprite.x
            var yDist = (this.sprite.y+(this.sprite.height/2))-bullet.sprite.y
            var collisionX = (this.sprite.height/2)+(bullet.sprite.height/2)
            var collisionY = (this.sprite.width/2)+(bullet.sprite.height/2)
            if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
                if (bullet.type !== "missile") {
                    bullet.doomed = true
                    if (bullet.launchDirection.x === 1) {
                        bullet.sprite.x = this.sprite.x-(this.sprite.width/2)-(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.x === -1) {
                        bullet.sprite.x = this.sprite.x+(this.sprite.width/2)+(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.y === -1) {
                        bullet.sprite.y = this.sprite.y+this.sprite.height+(bullet.sprite.height/2)
                    }
                } else if (!bullet.blewAt) {
                    bullet.blewAt = counter
                    if (this.frozen) {
                        this.hp -= bullet.damage
                        if (this.hp <= 0) {                    
                            this.unFreeze()
                            // this.sprite.alpha = 0
                            if (randomInt(0,1)) {
                                var powerup = "health"
                            } else {
                                var powerup = "missile"
                            }
                            new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                            if (!this.detonated) {
                                this.detonate()
                                this.blewAt = counter
                            }
                            
                        }
                    }
                }
                
                if (bullet.type === "ice") {
                    if (!this.dead && !this.frozen) {
                        this.frozen = true
                        this.frozenAt = counter
                        this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.ripper[0][this.currentFrame]]
                        this.freezeBlock = undefined
                        this.freezeBlock = new Cell(0,0,this.sprite.x-(this.sprite.width/2),this.sprite.y)
                        activeCells.push(this.freezeBlock)
                        this.freezeBlock.sprite.alpha = 0
                        // this.freezeBlock.sprite.width = this.sprite.width
                        // this.freezeBlock.sprite.height = this.sprite.height
                    } else {
                        this.unFreeze()
                    }
                }
            }
        }
    }
    this.unFreeze = function() {
		this.frozen = false
		if (samus.standingOnCell === this.freezeBlock) {
			samus.onGround = false
		}
		this.freezeBlock.sprite.visible = false					
		this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.ripper[this.type][this.currentFrame]]
        this.frozenAt = -99
	}
	this.patrol = function() {
		this.sprite.x += this.floatSpeed*this.floatDirection
	}
	rippers.push(this)
}

function Crawler(posX,posY,room,homeLedge) {
    var randomType = randomInt(1,currentZone.enemyTextures.crawler.length-1)
    this.type = randomType
    this.touchDamage = 18
    this.hp = 30
    this.maxHP = 30
	this.room = room
    room.enemies.push(this)
    this.ledge = homeLedge
    this.slowRate = 1
	this.frozen = false
    this.frozenAt = -99
    this.freezeBlock = undefined
    this.attachedTo = undefined
	this.walkSpeed = Math.round(newPixelSize/2+((randomType-1)*(newPixelSize/4)))
    this.origTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.crawler[randomType]]
    this.freezeTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.crawler[0]]
	this.sprite = preparedSprite(this.origTexture,0.5,0.5)
    this.sprite.width = Math.round(this.sprite.width)
    this.sprite.height = Math.round(this.sprite.height)
    this.origin = {x:undefined,y:undefined}
	this.sprite.x = this.origin.x = Math.round(posX)
	this.sprite.y = this.origin.y = Math.round(posY)
    this.origScaleX = this.sprite.scale.x
    this.origScaleY = this.sprite.scale.y
    this.damagedAt = -99
    this.blewAt = undefined
    this.gibs = []
    this.detonated = false
    if (randomInt(0,1)) {
        this.walkDirection = "left"
    } else {
        this.walkDirection = "right"
    }
    this.orientation = "top"
    this.damagedAt = -99
	gameContainer.addChildAt(this.sprite,0)
	this.sprite.visible = false
    this.dead = false
    crawlers.push(this)
    
    this.reset = function() {
        if (randomInt(0,1)) {
            this.walkDirection = "left"
        } else {
            this.walkDirection = "right"
        }
        this.sprite.x = this.origin.x
		this.sprite.y = this.origin.y
        this.sprite.tint = 0xffffff
        this.sprite.visible = false
        this.sprite.rotation = 0
        this.sprite.alpha = 1
        this.blewAt = undefined
        this.hp = this.maxHP
        this.slowRate = 1
        // this.dead = false
        this.gibs.length = 0
        this.detonated = false
    }
    
    this.detonate = function() {
        this.detonated = true
        for (var g=0;g<4;g++) {
            var gib = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
            gib.anchor.set(0.5)
            gib.tint = 0xff0000
            gib.width = cellSize/3.5
            gib.height = cellSize/3.5
            if (g===0) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y
            } else if (g===1) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y
            } else if (g===2) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/3)
            } else if (g===3) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/3)
            }
            this.gibs.push(gib)
            gameContainer.addChild(gib)
        }
        this.sprite.visible = false
    }
    this.sprayGibs = function() {
        var sinceBlew = counter-this.blewAt
        for (var g=0;g<this.gibs.length;g++) {
            var gib = this.gibs[g]
            if (g===0) {
                gib.x -= cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===1) {
                gib.x += cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===2) {
                gib.x -= cellSize/4
                gib.y -= cellSize/10
            } else if (g===3) {
                gib.x += cellSize/4
                gib.y -= cellSize/10
            }
            gib.y += (sinceBlew*(newPixelSize))
            if (sinceBlew === 8) {
                gib.destroy()
            }
        }
        if (sinceBlew === 8) {
            this.dead = true
            this.reset()

        }
    }
    // this.orientation = function() {
    //     if (this.sprite.rotation === 0) {
    //         return "top"
    //     }
    //     if (this.sprite.rotation === degToRad(180)) {
    //         return "bottom"
    //     }
    //     if (this.sprite.rotation === degToRad(-90)) {
    //         return "left"
    //     }
    //     if (this.sprite.rotation === degToRad(90)) {
    //         return "right"
    //     }
    // }
    this.findAttachedBlock = function() {

    }
    this.reverseDirection = function() {
        if (this.walkDirection === "up") {
            this.walkDirection = "down"
        } else if (this.walkDirection === "down") {
            this.walkDirection = "up"
        } else if (this.walkDirection === "left") {
            this.walkDirection = "right"
        } else if (this.walkDirection === "right") {
            this.walkDirection = "left"
        }
    }
    this.checkForCrawlers = function() {
        for (var c=0;c<crawlers.length;c++) {
            var crawler = crawlers[c]
            if (crawler.room === this.room) {
                var diffX = this.sprite.x-crawler.sprite.x
                var diffY = this.sprite.y-crawler.sprite.y
                if (this.walkDirection === "right" && crawler.walkDirection === "left") {
                    if (diffY === 0 && diffX > 0) {
                        this.reverseDirection()
                        this.walk(this.walkDirection)
                        this.reverseDirection()
                        crawler.reverseDirection()
                        crawler.walk(this.walkDirection)
                        crawler.reverseDirection()
                    }
                }
                if (this.walkDirection === "left" && crawler.walkDirection === "right") {
                    if (diffX === 0 && diffY < 0) {
                        this.reverseDirection()
                        this.walk(this.walkDirection)
                        this.reverseDirection()
                        crawler.reverseDirection()
                        crawler.walk(this.walkDirection)
                        crawler.reverseDirection()
                    }
                }
            }
        }
    }
    
    this.checkForAttachedBlock = function() {
        var closestDistance = 9999
        var closestCell = activeCells[0]
        for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
            if (cell.type !== "noCollision" && cell.type !== "quicksand" && this.freezeBlock !== cell) {
                var diffX = this.sprite.x-(cell.sprite.x+(cellSize/2))
                var diffY = this.sprite.y-(cell.sprite.y+(cellSize/2))
                var distance = Math.ceil(distanceFromABToXY(this.sprite.x,this.sprite.y,cell.sprite.x+(cellSize/2),cell.sprite.y+(cellSize/2)))
                var limit = (cellSize)
                var orientation = this.orientation
                if (distance < closestDistance) {
                    
                    closestDistance = distance
                    closestCell = cell
                    
                }
            }
        }
        if (this.attachedTo !== closestCell) {
            
            if (this.attachedTo) {
                var oldCell = this.attachedTo
                this.attachedTo = closestCell
                // oldCell.sprite.tint = 0xffffff
                
                if (oldCell.sprite.y === closestCell.sprite.y) {
                    // adjacent left or right
                    
                    if (oldCell.sprite.x < closestCell.sprite.x) {
                        // adjacent left
                        
                    } else {
                        // adjacent right

                    }
                } else if (oldCell.sprite.y > closestCell.sprite.y) {
                    // above
                    if (oldCell.sprite.x === closestCell.sprite.x) {
                        // adjacent above

                    } else if (oldCell.sprite.x > closestCell.sprite.x) {
                        // above left
                        if (this.orientation === "top" || this.orientation === "bottom") {
                            this.changeOrientation("right")
                        } else {
                            this.changeOrientation("bottom")
                        }
                    } else if (oldCell.sprite.x < closestCell.sprite.x) {
                        // above right
                        if (this.orientation === "top" || this.orientation === "bottom") {
                            this.changeOrientation("left")
                        } else {
                            this.changeOrientation("bottom")
                        }
                    }
                } else if (oldCell.sprite.y < closestCell.sprite.y) {
                    // below
                    
                    if (oldCell.sprite.x === closestCell.sprite.x) {
                        // adjacent below

                    } else if (oldCell.sprite.x > closestCell.sprite.x) {
                        // below left
                        if (this.orientation === "top" || this.orientation === "bottom") {
                            this.changeOrientation("right")
                        } else {
                            this.changeOrientation("top")
                        }
                    } else if (oldCell.sprite.x < closestCell.sprite.x) {
                        // below right
                        if (this.orientation === "top" || this.orientation === "bottom") {
                            this.changeOrientation("left")
                        } else {
                            this.changeOrientation("top")
                        }
                    }
                }
            }
             

        }
        if (!this.attachedTo) {
            this.attachedTo = closestCell
        }
        // closestCell.sprite.tint = 0xff0000
    }
    this.changeOrientation = function(newOr) {
        var oldOr = this.orientation
        var oldDir = this.walkDirection
        
        this.orientation = newOr
        if (newOr === "top") {
            this.sprite.y = this.attachedTo.sprite.y-(this.sprite.height/2)
            this.sprite.rotation = 0
            if (oldOr === "left") {
                if (this.walkDirection === "up") {
                    this.walkDirection = "right"
                } else {
                    this.walkDirection = "left"
                }
            } else {
                if (this.walkDirection === "up") {
                    this.walkDirection = "left"
                } else {
                    this.walkDirection = "right"
                }
            }
        } else if (newOr === "bottom") {
            this.sprite.y = this.attachedTo.sprite.y+(this.attachedTo.sprite.height)+(this.sprite.height/2)
            this.sprite.rotation = degToRad(180)
            if (oldOr === "left") {
                if (this.walkDirection === "up") {
                    this.walkDirection = "left"
                } else {
                    this.walkDirection = "right"
                }
            } else {
                if (this.walkDirection === "up") {
                    this.walkDirection = "right"
                } else {
                    this.walkDirection = "left"
                }
            }
        } else if (newOr === "left") {
            this.sprite.x = this.attachedTo.sprite.x-(this.sprite.width/2)
            this.sprite.rotation = degToRad(-90)
            if (oldOr === "top") {
                if (this.walkDirection === "left") {
                    this.walkDirection = "down"
                } else {
                    this.walkDirection = "up"
                }
            } else {
                if (this.walkDirection === "left") {
                    this.walkDirection = "up"
                } else {
                    this.walkDirection = "down"
                }
            }
        } else if (newOr === "right") {
            this.sprite.x = this.attachedTo.sprite.x+(this.attachedTo.sprite.width)+(this.sprite.width/2)
            this.sprite.rotation = degToRad(90)
            if (oldOr === "top") {
                if (this.walkDirection === "left") {
                    this.walkDirection = "up"
                } else {
                    this.walkDirection = "down"
                }
            } else {
                if (this.walkDirection === "left") {
                    this.walkDirection = "down"
                } else {
                    this.walkDirection = "up"
                }
            }
        }
        this.sprite.x = Math.round(this.sprite.x)
        this.sprite.y = Math.round(this.sprite.y)
        // if (Math.abs(this.sprite.x-samus.sprite.x) < viewWidth/3 ) {
        //     console.log("changing or from " + oldOr + " to " + newOr + " at " + counter)
        //     console.log("changing walk direction from " + oldDir + " to " + this.walkDirection + " at " + counter)
        // }
    }
    this.walk = function(direction) {
        if (counter % 10 === 0) {
            this.sprite.scale.x *= -1
        } else if (counter % 5 === 0) {
            this.sprite.scale.x *= -1
        }
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        var orientation = this.orientation
        if (orientation === "top") {
            if (direction === "left") {
                var limit = this.attachedTo.sprite.x-newPixelSize
                this.sprite.x -= this.walkSpeed*this.slowRate
                if (this.sprite.x < limit) {
                    this.changeOrientation("left")
                }
            } else if (direction === "right") {
                var limit = this.attachedTo.sprite.x+cellSize+newPixelSize
                this.sprite.x += this.walkSpeed*this.slowRate
                if (this.sprite.x > limit) {
                    this.changeOrientation("right")
                }
            }     
        } else if (orientation === "bottom") {
            if (direction === "left") {
                var limit = this.attachedTo.sprite.x-newPixelSize
                this.sprite.x -= this.walkSpeed*this.slowRate
                if (this.sprite.x < limit) {
                    this.changeOrientation("left")
                }
                
            } else if (direction === "right") {
                var limit = this.attachedTo.sprite.x+cellSize+newPixelSize
                this.sprite.x += this.walkSpeed*this.slowRate
                if (this.sprite.x > limit) {
                    this.changeOrientation("right")
                }
            }  
        } else if (orientation === "left") {
            if (direction === "up") {
                var limit = this.attachedTo.sprite.y-newPixelSize
                this.sprite.y -= this.walkSpeed*this.slowRate
                if (this.sprite.y < limit) {
                    this.changeOrientation("top")
                }
                
            } else if (direction === "down") {
                var limit = this.attachedTo.sprite.y+cellSize+newPixelSize
                this.sprite.y += this.walkSpeed*this.slowRate
                if (this.sprite.y > limit) {
                    this.changeOrientation("bottom")
                }
            }  
        } else if (orientation === "right") {
            if (direction === "up") {
                var limit = this.attachedTo.sprite.y-newPixelSize
                this.sprite.y -= this.walkSpeed*this.slowRate
                if (this.sprite.y < limit) {
                    this.changeOrientation("top")
                }
                
            } else if (direction === "down") {
                var limit = this.attachedTo.sprite.y+cellSize+newPixelSize
                this.sprite.y += this.walkSpeed*this.slowRate
                if (this.sprite.y > limit) {
                    this.changeOrientation("bottom")
                }
            }  
        }
    }
    this.checkForBlocks = function() {
		for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
			if (cell.type !== "noCollision" && cell.type !== "quicksand" && cell.sprite.alpha > 0 && cell.sprite.visible && this.freezeBlock !== cell) {
				var diffX = Math.round(this.sprite.x-(cell.sprite.x+(cellSize/2)))
                var diffY = Math.round((this.sprite.y)-(cell.sprite.y+(cellSize/2)))
                var limit = cellSize
				if (this.attachedTo !== cell && Math.abs(diffX) < limit && Math.abs(diffY) < limit) {
					if (this.orientation === "top") {
                        if (this.walkDirection === "left") {
                            this.changeOrientation("right")
                            this.sprite.x = cell.sprite.x+(cellSize*1.5)
                        } else if (this.walkDirection === "right") {
                            this.changeOrientation("left")
                            this.sprite.x = cell.sprite.x-(cellSize/2)
                        }
                    } else if (this.orientation === "bottom") {
                        if (this.walkDirection === "left") {
                            this.changeOrientation("right")
                            this.sprite.x = cell.sprite.x+(cellSize*1.5)
                        } else if (this.walkDirection === "right") {
                            this.changeOrientation("left")
                            this.sprite.x = cell.sprite.x+(cellSize*1.5)
                        }
                    } else if (this.orientation === "left") {
                        if (this.walkDirection === "up") {
                            this.changeOrientation("bottom")
                            this.sprite.y = cell.sprite.y+(cellSize*1.5)
                        } else if (this.walkDirection === "down") {
                            this.changeOrientation("top")
                            this.sprite.y = cell.sprite.y-(cellSize/2)
                        }
                    } else if (this.orientation === "right") {
                        if (this.walkDirection === "up") {
                            this.changeOrientation("bottom")
                            this.sprite.y = cell.sprite.y+(cellSize*1.5)
                        } else if (this.walkDirection === "down") {
                            this.changeOrientation("top")
                            this.sprite.y = cell.sprite.y-(cellSize/2)
                        }
                    }
                    
                    
                    
                    
                    this.attachedTo = cell

                    // var orientation = this.orientation()
                    // if (this.walkDirection === "left") {
                    //     this.sprite.x = cell.sprite.x+(cellSize*1.5)
                    //     if (orientation === "top") {
                    //         this.walkDirection = "up"
                    //     } else {
                    //         this.walkDirection = "down"
                    //     }
                    //     this.sprite.rotation = degToRad(90)
                        
                    // }
                    // if (this.walkDirection === "right") {
                    //     this.sprite.x = cell.sprite.x-(cellSize/2)
                    //     if (orientation === "top") {
                    //         this.walkDirection = "down"
                    //     } else {
                    //         this.walkDirection = "up"
                    //     }
                    //     this.sprite.rotation = degToRad(-90)
                    // }
                    // if (this.walkDirection === "up") {
                    //     this.sprite.y = cell.sprite.y+(cellSize*1.5)
                    //     if (orientation === "left") {
                    //         this.walkDirection = "left"
                    //     } else {
                    //         this.walkDirection = "right"
                    //     }
                    //     this.sprite.rotation = degToRad(180)
                    // }
                    // if (this.walkDirection === "down") {
                    //     this.sprite.y = cell.sprite.y-(cellSize/2)
                    //     if (orientation === "left") {
                    //         this.walkDirection = "left"
                    //     } else {
                    //         this.walkDirection = "right"
                    //     }
                    //     this.sprite.rotation = 0
                    // }
                    // this.attachedTo = cell
                    // this.reverseDirection()
                    return
				}
			}
		}
        for (var d=0;d<room.roomObject.doors.length;d++) {
            var door = room.roomObject.doors[d]
            
            var xDist = this.sprite.x-(door.sprite.x+(cellSize/2))
            if (Math.abs(xDist) <= cellSize/2) {
                this.reverseDirection()
            }
        }
	}
    this.checkForSamus = function() {
        var xDist = samus.sprite.x-this.sprite.x
        var yDist = (samus.sprite.y-(samus.standingHeight/2))-(this.sprite.y+(this.sprite.height/2))
        var collisionX = cellSize
        var collisionY = (samus.standingHeight/2)+(this.sprite.height/2)
        if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
            samus.takeDamage(this,this.touchDamage)
        }
    }
    this.checkForBullets = function() {
        for (var b=0;b<bullets.length;b++) {
            var bullet = bullets[b]
            var xDist = this.sprite.x-bullet.sprite.x
            var yDist = (this.sprite.y+(this.sprite.height/2))-bullet.sprite.y
            var collisionX = (this.sprite.height/2)+(bullet.sprite.height/2)
            var collisionY = (this.sprite.width/2)+(bullet.sprite.height/2)
            if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
                if (bullet.type !== "missile") {
                    bullet.doomed = true
                    if (bullet.launchDirection.x === 1) {
                        bullet.sprite.x = this.sprite.x-(this.sprite.width/2)-(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.x === -1) {
                        bullet.sprite.x = this.sprite.x+(this.sprite.width/2)+(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.y === -1) {
                        bullet.sprite.y = this.sprite.y+this.sprite.height+(bullet.sprite.height/2)
                    }
                } else if (!bullet.blewAt) {
                    bullet.blewAt = counter
                }
                this.hp -= bullet.damage
                this.damagedAt = counter
                if (this.hp <= 0) {
                    // this.dead = true
                    if (this.frozen) {
                        this.unFreeze()
                    }
                    this.sprite.alpha = 0
                    if (randomInt(0,1)) {
                        var powerup = "health"
                    } else {
                        var powerup = "missile"
                    }
                    new Powerup(this.sprite.x,this.sprite.y,powerup)
                    if (!this.detonated) {
                        this.detonate()
                        this.blewAt = counter
                    }
                }
                if (bullet.type === "ice") {
                    if (!this.detonated && !this.frozen) {
                        this.frozen = true
                        this.frozenAt = counter
                        this.sprite.texture = this.freezeTexture
                        this.freezeBlock = undefined
                        this.freezeBlock = new Cell(0,0,this.sprite.x-(this.sprite.width/2),this.sprite.y-(this.sprite.height/2))
                        activeCells.push(this.freezeBlock)
                        this.freezeBlock.sprite.alpha = 0
                        // this.freezeBlock.sprite.width = this.sprite.width
                        // this.freezeBlock.sprite.height = this.sprite.height
                    } else {
                        this.unFreeze()
                    }
                }
            }
        }
    }
    this.checkForBombs = function() {
		for (var b=0;b<bombs.length;b++) {
			var bomb = bombs[b]
			if (bomb.detonated) {
				var diffX = this.sprite.x-bomb.sprite.x
                var diffY = this.sprite.y-bomb.sprite.y
				if (Math.abs(diffX) <= cellSize) {
					this.hp -= bomb.damage
                    this.damagedAt = counter
                    if (this.hp <= 0) {
                        // this.dead = true
                        if (this.frozen) {
                            this.unFreeze()
                        }
                        if (randomInt(0,1)) {
                            var powerup = "health"
                        } else {
                            var powerup = "missile"
                        }
                        new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                        if (!this.detonated) {
                            this.detonate()
                            this.blewAt = counter
                        }
                    }
				}
			}
		}
	}
    this.unFreeze = function() {
		this.frozen = false
		if (samus.standingOnCell === this.freezeBlock) {
			samus.onGround = false
		}
		this.freezeBlock.sprite.visible = false					
		this.sprite.texture = this.origTexture
        this.frozenAt = -99
	}
    
	this.patrol = function() {
		var orientation = this.orientation()
        if (counter % 10 === 0) {
            this.sprite.scale.x *= -1
        } else if (counter % 5 === 0) {
            this.sprite.scale.x *= -1
        }
        // if (room.type === "vertical") {
        //     var wallThickness = room.zone[room.style].wallPattern[0].length*cellSize
        //     if (this.walkDirection === "left" && this.sprite.x <= room.roomObject.posX+wallThickness) {
        //         this.walkDirection = "right"
        //     }
        //     if (this.walkDirection === "right" && this.sprite.x >= room.roomObject.posX+(segmentWidth*cellSize)-wallThickness-(this.sprite.width/2)) {
        //         this.walkDirection = "left"
        //     }

        // }
        if (orientation === "top") { // on top
            if (this.walkDirection === "right") {
                this.sprite.x += this.walkSpeed
                if (this.sprite.x >= this.ledge.posX+(this.ledge.length*cellSize)+(cellSize/2)) {
                    this.walkDirection = "down"
                    this.sprite.rotation = degToRad(90)
                    this.sprite.y += cellSize/2
                }
            }
            if (this.walkDirection === "left") {
                this.sprite.x -= this.walkSpeed
                if (this.sprite.x <= this.ledge.posX-(cellSize/2)) {
                    this.walkDirection = "down"
                    this.sprite.rotation = -degToRad(90)
                    this.sprite.y += cellSize/2
                }
            }
        } else if (orientation === "bottom") { // upside down
            if (this.walkDirection === "right") {
                this.sprite.x += this.walkSpeed
                if (this.sprite.x >= this.ledge.posX+(this.ledge.length*cellSize)+(cellSize/2)) {
                    this.walkDirection = "up"
                    this.sprite.rotation = degToRad(90)
                    this.sprite.y -= cellSize/2
                }
            }
            if (this.walkDirection === "left") {
                this.sprite.x -= this.walkSpeed
                if (this.sprite.x <= this.ledge.posX-(cellSize/2)) {
                    this.walkDirection = "up"
                    this.sprite.rotation = -degToRad(90)
                    this.sprite.y -= cellSize/2
                }
            }
        } else if (orientation === "left") { // left side
            if (this.walkDirection === "up") {
                this.sprite.y -= this.walkSpeed
                if (this.sprite.y <= this.ledge.posY-(cellSize/2)) {
                    this.walkDirection = "right"
                    this.sprite.rotation = 0
                    // this.sprite.y += cellSize/2
                }
            }
            if (this.walkDirection === "down") {
                this.sprite.y += this.walkSpeed
                if (this.sprite.y >= this.ledge.posY+(cellSize*1.5)) {
                    this.walkDirection = "right"
                    this.sprite.rotation = degToRad(180)
                    // this.sprite.y -= cellSize/2
                }
            }
        } else if (orientation === "right") { // right side
            if (this.walkDirection === "up") {
                this.sprite.y -= this.walkSpeed
                if (this.sprite.y <= this.ledge.posY-(cellSize/2)) {
                    this.walkDirection = "left"
                    this.sprite.rotation = 0
                    // this.sprite.y += cellSize/2
                }
            }
            if (this.walkDirection === "down") {
                this.sprite.y += this.walkSpeed
                if (this.sprite.y >= this.ledge.posY+(cellSize*1.5)) {
                    this.walkDirection = "left"
                    this.sprite.rotation = degToRad(180)
                    // this.sprite.y = this.ledge.posY+cellSize
                }
            }
        }
	}
}

function PipeFlyer(posX,posY,room,homePipe) {
    var randomType = randomInt(1,currentZone.enemyTextures.pipeFlyer.length-1)
    this.type = randomType
    this.touchDamage = 21
    this.hp = 30
    this.maxHP = 30
	this.room = room
    this.killed = 0
    this.supply = randomInt(5,12)
    room.enemies.push(this)
    this.pipe = homePipe
    this.slowRate = 1
    this.preRiseY = posY-(this.pipe.depth*cellSize)
	this.frozen = false
    this.frozenAt = -99
    this.freezeBlock = undefined
     
	this.flySpeed = newPixelSize*((30+(5*(this.type-1)))/10)
    this.riseSpeed = newPixelSize*2
    this.currentFrame = 0
    this.origTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.pipeFlyer[this.type][this.currentFrame]]
    this.freezeTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.pipeFlyer[this.currentFrame]]
	this.sprite = preparedSprite(this.origTexture,0.5,0)
    this.sprite.width = Math.round(this.sprite.width)
    this.sprite.height = Math.round(this.sprite.height)
    this.origin = {x:undefined,y:undefined}
	this.sprite.x = this.origin.x = posX
	this.sprite.y = this.origin.y = posY
    this.origScaleX = this.sprite.scale.x
    this.origScaleY = this.sprite.scale.y
    this.flyDirection = undefined
    this.damagedAt = -99
    this.blewAt = undefined
    this.gibs = []
    this.detonated = false
	gameContainer.addChildAt(this.sprite,0)
	this.sprite.visible = false
    this.risen = false
    this.roseAt = -99
    this.flyDelay = 20-(this.type*3)
    this.dead = false
    pipeFlyers.push(this)
    this.reset = function() {
        this.sprite.x = this.pipe.posX+cellSize
		this.sprite.y = this.pipe.posY+cellSize
        this.sprite.tint = 0xffffff
		this.risen = false
        this.blewAt = undefined
        this.hp = this.maxHP
        this.slowRate = 1
        this.dead = false
        this.detonated = false
        this.gibs.length = 0
    }
    this.checkAbove = function() {
        for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
			if (cell.sprite.y+cell.sprite.height < this.sprite.y && cell.sprite.alpha > 0 && cell.sprite.visible && this.freezeBlock !== cell) {
				var diffX = this.sprite.x-(cell.sprite.x+(cellSize/2))
                var diffY = (this.sprite.y+(this.sprite.height/2))-(cell.sprite.y+(cell.sprite.height/2))
				if (Math.abs(diffX) <= cellSize/2 && this.sprite.y-this.riseSpeed < cell.sprite.y+cell.sprite.height) {
					// this.reset()
                    this.sprite.y = cell.sprite.y+cell.sprite.height
                    this.risen = true
                    this.roseAt = counter
				}
			}
		}
    }
    this.rise = function() {
        
        if (counter-this.damagedAt < 10 && this.slowRate === 1) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        if (samus.sprite.x <= this.pipe.posX) {
            this.flyDirection = -1
            this.sprite.scale.x = this.origScaleX
        } else {
            this.flyDirection = 1
            this.sprite.scale.x = -this.origScaleX
        }
        
        if (this.sprite.y+(this.sprite.height) > this.preRiseY || this.sprite.y+(this.sprite.height/2)-this.riseSpeed > (samus.sprite.y-(samus.standingHeight/2))) {
            this.sprite.y -= this.riseSpeed*this.slowRate
        } else {
            this.risen = true
            this.roseAt = counter
        }
    }
    this.flap = function(speed) {
        if (counter % (speed*2) === 0) {
            this.currentFrame = 0
            this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.pipeFlyer[this.type][this.currentFrame]]
        } else if (counter % speed ===0) {
            this.currentFrame = 1
            this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.pipeFlyer[this.type][this.currentFrame]]
        }
    }
    
    this.detonate = function() {
        this.detonated = true
        this.sprite.visible = false
        
        for (var g=0;g<4;g++) {
            var gib = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
            gib.anchor.set(0.5)
            gib.tint = 0xff0000
            gib.width = cellSize/3.5
            gib.height = cellSize/3.5
            if (g===0) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===1) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===2) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            } else if (g===3) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            }
            this.gibs.push(gib)
            gameContainer.addChild(gib)
        }
    }
    this.sprayGibs = function() {
        var sinceBlew = counter-this.blewAt
        for (var g=0;g<this.gibs.length;g++) {
            var gib = this.gibs[g]
            if (g===0) {
                gib.x -= cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===1) {
                gib.x += cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===2) {
                gib.x -= cellSize/4
                gib.y -= cellSize/10
            } else if (g===3) {
                gib.x += cellSize/4
                gib.y -= cellSize/10
            }
            gib.y += (sinceBlew*(newPixelSize))
            if (sinceBlew === 8) {
                gib.destroy()
            }
        }
        
        if (sinceBlew === 8) {
            this.reset()
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
            this.sprite.texture = this.origTexture
            this.sprite.scale.x = this.origScaleX
            this.sprite.scale.y = this.origScaleY
            gameContainer.setChildIndex(this.sprite,0)
			this.reset()
		}
    }
    this.offScreen = function() {
        return (this.sprite.x < -gameContainer.x || this.sprite.x > -gameContainer.x+(viewWidth))
    }
    this.fly = function() {
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        this.sprite.x += this.flySpeed*this.flyDirection*this.slowRate
        if (this.offScreen()) {
            this.reset()
            
        }
    }
	this.checkForBlocks = function() {
		for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
			if (cell.sprite.alpha > 0 && cell.sprite.visible && this.freezeBlock !== cell) {
				var diffX = this.sprite.x-(cell.sprite.x+(cellSize/2))
                var diffY = (this.sprite.y+(this.sprite.height/2))-(cell.sprite.y+(cell.sprite.height/2))
				if (!this.offScreen() && Math.abs(diffX) <= cellSize/2 && Math.abs(diffY) <= cellSize) {
                    if (!this.detonated) {
                        this.detonate()
                        this.blewAt = counter
                    }
				}
			}
		}
        for (var d=0;d<room.roomObject.doors.length;d++) {
            var door = room.roomObject.doors[d]
            
            var xDist = this.sprite.x-(door.sprite.x+(cellSize/2))
            if (!this.offScreen() && Math.abs(xDist) <= cellSize/2) {
                if (!this.detonated) {
                    this.detonate()
                    this.blewAt = counter
                }
            }
        }
	}
    this.checkForBombs = function() {
		for (var b=0;b<bombs.length;b++) {
			var bomb = bombs[b]
			if (bomb.detonated) {
				var diffX = this.sprite.x-bomb.sprite.x
                var diffY = this.sprite.y-bomb.sprite.y
				if (Math.abs(diffX) <= cellSize) {
					this.hp -= bomb.damage
                    this.damagedAt = counter
                    if (this.hp <= 0) {
                        this.killed++
                        if (this.frozen) {
                            this.unFreeze()
                        }
                        if (randomInt(0,1)) {
                            var powerup = "health"
                        } else {
                            var powerup = "missile"
                        }
                        new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                        
                        if (!this.detonated) {
                            this.detonate()
                            this.blewAt = counter
                        }
                    }
				}
			}
		}
	}
    this.checkForSamus = function() {
        var xDist = samus.sprite.x-this.sprite.x
        var yDist = (samus.sprite.y-(samus.standingHeight/2))-(this.sprite.y+(this.sprite.height/2))
        var collisionX = cellSize
        var collisionY = (samus.standingHeight/2)+(this.sprite.height/2)
        if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
            samus.takeDamage(this,this.touchDamage)
        }
    }
    this.checkForBullets = function() {
        for (var b=0;b<bullets.length;b++) {
            var bullet = bullets[b]
            var xDist = this.sprite.x-bullet.sprite.x
            var yDist = (this.sprite.y+(this.sprite.height/2))-bullet.sprite.y
            var collisionX = (this.sprite.height/2)+(bullet.sprite.height/2)
            var collisionY = (this.sprite.width/2)+(bullet.sprite.height/2)
            if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
                if (bullet.type !== "missile") {
                    bullet.doomed = true
                    if (bullet.launchDirection.x === 1) {
                        bullet.sprite.x = this.sprite.x-(this.sprite.width/2)-(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.x === -1) {
                        bullet.sprite.x = this.sprite.x+(this.sprite.width/2)+(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.y === -1) {
                        bullet.sprite.y = this.sprite.y+this.sprite.height+(bullet.sprite.height/2)
                    }
                } else {
                    bullet.blewAt = counter
                }
                this.hp -= bullet.damage
                this.damagedAt = counter
                
                if (bullet.type === "ice") {
                    if (!this.detonated && !this.dead && !this.frozen) {
                        this.frozen = true
                        this.frozenAt = counter
                        this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.pipeFlyer[0][this.currentFrame]]
                        this.freezeBlock = undefined
                        this.freezeBlock = new Cell(0,0,this.sprite.x-(this.sprite.width/2),this.sprite.y)
                        activeCells.push(this.freezeBlock)
                        this.freezeBlock.sprite.alpha = 0
                        // this.freezeBlock.sprite.width = this.sprite.width
                        // this.freezeBlock.sprite.height = this.sprite.height
                    } else {
                        this.unFreeze()
                    }
                }
                if (this.hp <= 0) {
                    this.killed++
                    if (this.frozen) {
                        this.unFreeze()
                        
                    }
                    if (randomInt(0,1)) {
                        var powerup = "health"
                    } else {
                        var powerup = "missile"
                    }
                    new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                    this.blewAt = counter
                    if (!this.detonated) {
                        this.detonate()
                    }
                }
            }
        }
    }
    
    this.unFreeze = function() {
		this.frozen = false
		if (samus.standingOnCell === this.freezeBlock) {
			samus.onGround = false
		}
		this.freezeBlock.sprite.visible = false			
		this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.pipeFlyer[this.type][this.currentFrame]]
        this.frozenAt = -99
	}
}

function Diver(posX,posY,room) {
    var randomType = randomInt(1,currentZone.enemyTextures.diver.length-1)
    if (randomInt(0,1)) {
        this.diveDirection = -1
    } else {
        this.diveDirection = 1
    }
    this.type = randomType
    this.touchDamage = 32
    this.hp = 30
    this.maxHP = 30
	this.room = room
    room.enemies.push(this)
    this.slowRate = 1
	this.frozen = false
    this.frozenAt = -99
    this.freezeBlock = undefined
	this.diveSpeed = newPixelSize*((30+(5*(this.type-1)))/8)
    this.currentFrame = 0
    this.origTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.diver[this.type][this.currentFrame]]
    this.freezeTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.diver[0][this.currentFrame]]
	this.sprite = preparedSprite(this.origTexture,0.5,0)
    this.sprite.width = Math.round(this.sprite.width)
    this.sprite.height = Math.round(this.sprite.height)
    this.origin = {x:posX,y:posY}
	this.sprite.x = posX
	this.sprite.y = posY
    this.origScaleX = this.sprite.scale.x
    this.origScaleY = this.sprite.scale.y
    this.damagedAt = -99
    this.blewAt = undefined
    this.gibs = []
    this.detonated = false
	gameContainer.addChildAt(this.sprite,0)
	this.sprite.visible = false
    this.dove = false
    this.landed = false
    this.landedAt = -99
    this.explodeDelay = 20-(this.type*3)
    this.dead = false
    divers.push(this)
    this.reset = function() {
        if (randomInt(0,1)) {
            this.diveDirection = -1
        } else {
            this.diveDirection = 1
        }
        this.sprite.x = this.origin.x
		this.sprite.y = this.origin.y
        this.sprite.tint = 0xffffff
        // this.sprite.visible = true
        this.sprite.texture = this.origTexture
        this.sprite.alpha = 1
		this.landed = false
        this.landedAt = -99
        this.dove = false
        this.blewAt = undefined
        this.hp = this.maxHP
        this.slowRate = 1
        // this.dead = false
        this.gibs.length = 0
        this.detonated = false
    }
    this.spinPattern = [0,1,0,2]
    this.spinIndex = 0
    
    this.detonate = function() {
        this.detonated = true
        this.sprite.visible = false
        
        for (var g=0;g<4;g++) {
            var gib = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
            gib.anchor.set(0.5)
            gib.tint = 0xff0000
            gib.width = cellSize/3.5
            gib.height = cellSize/3.5
            if (g===0) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===1) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===2) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            } else if (g===3) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            }
            this.gibs.push(gib)
            gameContainer.addChild(gib)
        }
    }
    this.sprayGibs = function() {
        var sinceBlew = counter-this.blewAt
        for (var g=0;g<this.gibs.length;g++) {
            var gib = this.gibs[g]
            if (g===0) {
                gib.x -= cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===1) {
                gib.x += cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===2) {
                gib.x -= cellSize/4
                gib.y -= cellSize/10
            } else if (g===3) {
                gib.x += cellSize/4
                gib.y -= cellSize/10
            }
            gib.y += (sinceBlew*(newPixelSize))
            if (sinceBlew === 8) {
                gib.destroy()
            }
        }
        
        if (sinceBlew === 8) {
            this.dead = true
            this.reset()
        }
    }
    this.findCeiling = function() {
        var closestY = segmentHeight*cellSize
        var winner = undefined
        for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
            if (cell.type !== "noCollision" && cell.sprite.y <= this.sprite.y-cellSize && Math.abs(cell.sprite.x+(cell.sprite.width/2)-this.sprite.x) <= cellSize/2) {
                var diffY = this.sprite.y-cell.sprite.y
                // cell.sprite.tint = 0xff0000
                if (diffY < closestY) {
                    closestY = diffY
                    winner = cell
                }
            }
        }
        if (winner) {
            this.homeCell = winner
            this.sprite.x = this.origin.x = winner.sprite.x+(winner.sprite.width/2)
            this.sprite.y = this.origin.y = winner.sprite.y+(cellSize)
        }
    }
    
    this.spin = function(speed) {
        if (counter % speed === 0) {
            this.currentFrame = this.spinPattern[this.spinIndex]
            this.sprite.texture = PIXI.utils.TextureCache[this.room.zone.enemyTextures.diver[this.type][this.currentFrame]]
            this.spinIndex++
            if (this.spinIndex === this.spinPattern.length) {
                this.spinIndex = 0
            }
        }
    }
    
    this.explode = function() {
        var sinceBlew = counter-this.blewAt
		if (sinceBlew === 1) {
			this.sprite.texture = PIXI.utils.TextureCache["bombexplode1.png"]
		}
		if (sinceBlew === 4) {
			this.sprite.texture = PIXI.utils.TextureCache["bombexplode2.png"]
		}
		if (sinceBlew === 6) {
            this.sprite.texture = this.origTexture
            this.sprite.scale.x = this.origScaleX
            this.sprite.scale.y = this.origScaleY
            gameContainer.setChildIndex(this.sprite,0)
            this.sprite.visible = false
			// this.reset()
		}
        this.sprite.width += Math.round(cellSize/9)
		this.sprite.height += Math.round(cellSize/9)
    }
    this.offScreen = function() {
        return (this.sprite.x < -gameContainer.x || this.sprite.x > -gameContainer.x+(viewWidth))
    }
    this.dive = function() {
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        this.sprite.y += this.diveSpeed*this.slowRate
        this.sprite.x += newPixelSize*(randomInt(3,9)/10)*this.diveDirection*this.slowRate
    }
	this.checkForGround = function() {
		for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
            if (cell.type !== "noCollision" && cell.sprite.alpha > 0 && cell.sprite.visible && this.freezeBlock !== cell) {
                if (cell.sprite.y > this.sprite.y+cellSize && Math.abs(cell.sprite.x-this.sprite.x) <= cellSize*2) {
                    var diffY = cell.sprite.y-this.sprite.y
                    var diffX = Math.abs(cell.sprite.x+(cellSize/2)-this.sprite.x)
                    if (diffX <= cellSize/2) {
                        this.flyDirection = 0
                        if (diffY < this.sprite.height) {
                            this.landed = true
                            this.landedAt = counter
                            this.sprite.y = cell.sprite.y-this.sprite.height
                            return
                        }
                    }
                    
                }
            }
		}
        
	}
    this.checkForBombs = function() {
		for (var b=0;b<bombs.length;b++) {
			var bomb = bombs[b]
			if (bomb.detonated) {
				var diffX = this.sprite.x-bomb.sprite.x
                var diffY = this.sprite.y-bomb.sprite.y
				if (Math.abs(diffX) <= cellSize) {
					this.hp -= bomb.damage
                    this.damagedAt = counter
                    if (this.hp <= 0) {
                        // this.dead = true
                        if (this.frozen) {
                            this.unFreeze()
                        }
                        if (randomInt(0,1)) {
                            var powerup = "health"
                        } else {
                            var powerup = "missile"
                        }
                        new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                        this.blewAt = counter
                        if (!this.detonated) {
                            this.detonate()
                        }
                        
                    }
				}
			}
		}
	}
    this.checkForSamus = function() {
        var xDist = samus.sprite.x-this.sprite.x
        var yDist = (samus.sprite.y-(samus.standingHeight/2))-(this.sprite.y+(this.sprite.height/2))
        var collisionX = cellSize
        var collisionY = (samus.standingHeight/2)+(this.sprite.height/2)
        if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
            samus.takeDamage(this,this.touchDamage)
        }
    }
    this.checkForBullets = function() {
        for (var b=0;b<bullets.length;b++) {
            var bullet = bullets[b]
            var xDist = this.sprite.x-bullet.sprite.x
            var yDist = (this.sprite.y+(this.sprite.height/2))-bullet.sprite.y
            var collisionX = (this.sprite.height/2)+(bullet.sprite.height/2)
            var collisionY = (this.sprite.width/2)+(bullet.sprite.height/2)
            if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
                if (bullet.type !== "missile") {
                    bullet.doomed = true
                    if (bullet.launchDirection.x === 1) {
                        bullet.sprite.x = this.sprite.x-(this.sprite.width/2)-(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.x === -1) {
                        bullet.sprite.x = this.sprite.x+(this.sprite.width/2)+(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.y === -1) {
                        bullet.sprite.y = this.sprite.y+this.sprite.height+(bullet.sprite.height/2)
                    }
                } else {
                    bullet.blewAt = counter
                }
                this.hp -= bullet.damage
                this.damagedAt = counter
                if (this.hp <= 0) {
                    // this.dead = true
                    if (this.frozen) {
                        this.unFreeze()
                    }
                    if (randomInt(0,1)) {
                        var powerup = "health"
                    } else {
                        var powerup = "missile"
                    }
                    new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                    this.blewAt = counter
                    if (!this.detonated) {
                        this.detonate()
                    }
                }
                if (bullet.type === "ice") {
                    if (!this.dead && !this.frozen) {
                        this.frozen = true
                        this.frozenAt = counter
                        this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.diver[0][this.currentFrame]]
                        this.freezeBlock = undefined
                        this.freezeBlock = new Cell(0,0,this.sprite.x-(this.sprite.width/2),this.sprite.y)
                        activeCells.push(this.freezeBlock)
                        this.freezeBlock.sprite.alpha = 0
                        this.freezeBlock.sprite.width = this.sprite.width
                        // this.freezeBlock.sprite.height = this.sprite.height
                    } else {
                        this.unFreeze()
                    }
                }
            }
        }
    }
    this.unFreeze = function() {
		this.frozen = false
		if (samus.standingOnCell === this.freezeBlock) {
			samus.onGround = false
		}
		this.freezeBlock.sprite.visible = false
		this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.diver[this.type][this.currentFrame]]
        this.frozenAt = -99
	}
}
function Bomber(posX,posY,room) {
    var randomType = randomInt(1,currentZone.enemyTextures.bomber.length-1)
    if (randomInt(0,1)) {
        this.diveDirection = -1
    } else {
        this.diveDirection = 1
    }
    this.type = randomType
    this.touchDamage = 32
    this.hp = 30
    this.maxHP = 30
	this.room = room
    room.enemies.push(this)
    this.slowRate = 1
	this.frozen = false
    this.frozenAt = -99
    this.freezeBlock = undefined
	this.diveSpeed = newPixelSize*((30+(randomInt(4,6)*(this.type-1)))/8)
    this.currentFrame = 0
    this.origTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.bomber[this.type][this.currentFrame]]
    this.freezeTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.bomber[0][this.currentFrame]]
	this.sprite = preparedSprite(this.origTexture,0.5,0)
    this.sprite.width = Math.round(this.sprite.width)
    this.sprite.height = Math.round(this.sprite.height)
    this.origin = {x:posX,y:posY}
	this.sprite.x = posX
	this.sprite.y = posY
    this.origScaleX = this.sprite.scale.x
    this.origScaleY = this.sprite.scale.y
    this.damagedAt = -99
    this.blewAt = undefined
    this.gibs = []
    this.detonated = false
	gameContainer.addChildAt(this.sprite,0)
	this.sprite.visible = false
    this.dove = false
    this.landed = false
    this.landedAt = -99
    this.relandedAt = -99
    this.explodeDelay = 20-(this.type*3)
    this.dead = false
    this.ascending = false
    this.reboundDistance = this.sprite.height*(randomInt(1,5))
    this.diveDelay = randomInt(15,45)
    bombers.push(this)
    
    this.reset = function() {
        if (randomInt(0,1)) {
            this.diveDirection = -1
        } else {
            this.diveDirection = 1
        }
        this.diveDelay = randomInt(15,45)
        this.diveSpeed = newPixelSize*((30+(randomInt(4,6)*(this.type-1)))/8)
        this.reboundDistance = this.sprite.height*(randomInt(1,5))
        this.sprite.x = this.origin.x
		this.sprite.y = this.origin.y
        this.sprite.tint = 0xffffff
        // this.sprite.visible = true
        this.sprite.texture = this.origTexture
		this.landed = false
        this.landedAt = -99
        this.dove = false
        this.blewAt = undefined
        this.hp = this.maxHP
        this.slowRate = 1
        // this.dead = false
        this.gibs.length = 0
        this.detonated = false
    }
    this.spinPattern = [0,1,0,2]
    this.spinIndex = 0
    
    this.detonate = function() {
        this.detonated = true
        this.sprite.visible = false
        
        for (var g=0;g<4;g++) {
            var gib = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
            gib.anchor.set(0.5)
            gib.tint = 0xff0000
            gib.width = cellSize/3.5
            gib.height = cellSize/3.5
            if (g===0) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===1) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===2) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            } else if (g===3) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            }
            this.gibs.push(gib)
            gameContainer.addChild(gib)
        }
    }
    this.sprayGibs = function() {
        var sinceBlew = counter-this.blewAt
        for (var g=0;g<this.gibs.length;g++) {
            var gib = this.gibs[g]
            if (g===0) {
                gib.x -= cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===1) {
                gib.x += cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===2) {
                gib.x -= cellSize/4
                gib.y -= cellSize/10
            } else if (g===3) {
                gib.x += cellSize/4
                gib.y -= cellSize/10
            }
            gib.y += (sinceBlew*(newPixelSize))
            if (sinceBlew === 8) {
                gib.destroy()
            }
        }
        
        if (sinceBlew === 8) {
            this.dead = true
            this.reset()
        }
    }
    
    this.findCeiling = function() {
        var closestY = segmentHeight*cellSize
        var winner = undefined
        for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
            if (cell.type !== "noCollision" && cell.sprite.y <= this.sprite.y-cellSize && Math.abs(cell.sprite.x+(cell.sprite.width/2)-this.sprite.x) <= cellSize/2) {
                var diffY = this.sprite.y-cell.sprite.y
                // cell.sprite.tint = 0xff0000
                if (diffY < closestY) {
                    closestY = diffY
                    winner = cell
                }
            }
        }
        if (winner) {
            this.homeCell = winner
            this.sprite.x = this.origin.x = winner.sprite.x+(winner.sprite.width/2)
            this.sprite.y = this.origin.y = winner.sprite.y+(cellSize)
        }
    }
    
    this.flap = function(speed) {
        if (counter % (speed) === 0) {
            if (this.currentFrame === 0) {
                this.currentFrame = 1
            } else {
                this.currentFrame = 0
            }
            this.sprite.texture = PIXI.utils.TextureCache[this.room.zone.enemyTextures.bomber[this.type][this.currentFrame]]
        }
    }
    
    this.explode = function() {
        var sinceBlew = counter-this.blewAt
		if (sinceBlew === 1) {
			this.sprite.texture = PIXI.utils.TextureCache["bombexplode1.png"]
		}
		if (sinceBlew === 4) {
			this.sprite.texture = PIXI.utils.TextureCache["bombexplode2.png"]
		}
		if (sinceBlew === 6) {
            this.sprite.texture = this.origTexture
            this.sprite.scale.x = this.origScaleX
            this.sprite.scale.y = this.origScaleY
            gameContainer.setChildIndex(this.sprite,0)
            this.sprite.visible = false
			// this.reset()
		}
        this.sprite.width += Math.round(cellSize/9)
		this.sprite.height += Math.round(cellSize/9)
    }
    this.offScreen = function() {
        return (this.sprite.x < -gameContainer.x || this.sprite.x > -gameContainer.x+(viewWidth))
    }
    this.dive = function() {
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        this.sprite.y += this.diveSpeed*this.slowRate
        this.sprite.x += newPixelSize*(randomInt(3,9)/6)*this.diveDirection*this.slowRate
    }
    this.ascend = function() {
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        this.sprite.y -=  this.diveSpeed*this.slowRate
        this.sprite.x += newPixelSize*(randomInt(3,9)/10)*this.diveDirection*this.slowRate
    }
	this.checkForGround = function() {
		for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
            if (cell.type !== "noCollision" && this.freezeBlock !== cell) {
                if (Math.abs(cell.sprite.x-this.sprite.x) <= cellSize*2) {
                    
                    var diffY = (cell.sprite.y-this.diveSpeed)-this.sprite.y
                    var diffX = Math.abs(cell.sprite.x+(cellSize/2)-this.sprite.x)
                    
                    if (diffX <= cellSize) {
                        this.flyDirection = 0
                        if (!this.ascending && cell.sprite.y > this.sprite.y+(this.sprite.height) && diffY < this.reboundDistance) {
                            this.landed = true
                            this.ascending = true
                            this.landedAt = counter
                            this.homeCell = undefined
                            this.sprite.y = cell.sprite.y-((this.reboundDistance))
                            return
                            
                        } else if (this.ascending && cell.sprite.y < this.sprite.y && this.sprite.y < cell.sprite.y+cellSize) {
                            this.landed = false
                            this.relandedAt = counter
                            this.ascending = false
                            this.dove = false
                            this.homeCell = cell
                            if (randomInt(0,1)) {
                                this.diveDirection = -1
                            } else {
                                this.diveDirection = 1
                            }
                            this.diveDelay = randomInt(15,45)
                            this.reboundDistance = this.sprite.height*(randomInt(1,5))
                            this.diveSpeed = newPixelSize*((30+(randomInt(4,6)*(this.type-1)))/8)
                            this.sprite.y = cell.sprite.y+cellSize
                            return
                        }
                    }
                    
                }
            }
		}
        
	}
    this.checkForBombs = function() {
		for (var b=0;b<bombs.length;b++) {
			var bomb = bombs[b]
			if (bomb.detonated) {
				var diffX = this.sprite.x-bomb.sprite.x
                var diffY = this.sprite.y-bomb.sprite.y
				if (Math.abs(diffX) <= cellSize) {
					this.hp -= bomb.damage
                    this.damagedAt = counter
                    if (this.hp <= 0) {
                        // this.dead = true
                        if (this.frozen) {
                            this.unFreeze()
                        }
                        if (randomInt(0,1)) {
                            var powerup = "health"
                        } else {
                            var powerup = "missile"
                        }
                        new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                        this.blewAt = counter
                        if (!this.detonated) {
                            this.detonate()
                        }
                        
                    }
				}
			}
		}
	}
    this.checkForSamus = function() {
        var xDist = samus.sprite.x-this.sprite.x
        var yDist = (samus.sprite.y-(samus.standingHeight/2))-(this.sprite.y+(this.sprite.height/2))
        var collisionX = cellSize
        var collisionY = (samus.standingHeight/2)+(this.sprite.height/2)
        if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
            samus.takeDamage(this,this.touchDamage)
        }
    }
    this.checkForBullets = function() {
        for (var b=0;b<bullets.length;b++) {
            var bullet = bullets[b]
            var xDist = this.sprite.x-bullet.sprite.x
            var yDist = (this.sprite.y+(this.sprite.height/2))-bullet.sprite.y
            var collisionX = (this.sprite.height/2)+(bullet.sprite.height/2)
            var collisionY = (this.sprite.width/2)+(bullet.sprite.height/2)
            if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
                if (bullet.type !== "missile") {
                    bullet.doomed = true
                    if (bullet.launchDirection.x === 1) {
                        bullet.sprite.x = this.sprite.x-(this.sprite.width/2)-(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.x === -1) {
                        bullet.sprite.x = this.sprite.x+(this.sprite.width/2)+(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.y === -1) {
                        bullet.sprite.y = this.sprite.y+this.sprite.height+(bullet.sprite.height/2)
                    }
                } else {
                    bullet.blewAt = counter
                }
                this.hp -= bullet.damage
                this.damagedAt = counter
                if (this.hp <= 0) {
                    // this.dead = true
                    if (this.frozen) {
                        this.unFreeze()
                    }
                    if (randomInt(0,1)) {
                        var powerup = "health"
                    } else {
                        var powerup = "missile"
                    }
                    new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                    this.blewAt = counter
                    if (!this.detonated) {
                        this.detonate()
                    }
                }
                if (bullet.type === "ice") {
                    if (!this.dead && !this.frozen) {
                        this.frozen = true
                        this.frozenAt = counter
                        this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.bomber[0][this.currentFrame]]
                        this.freezeBlock = undefined
                        this.freezeBlock = new Cell(0,0,this.sprite.x-(this.sprite.width/2),this.sprite.y)
                        activeCells.push(this.freezeBlock)
                        this.freezeBlock.sprite.alpha = 0
                        this.freezeBlock.sprite.width = this.sprite.width
                        // this.freezeBlock.sprite.height = this.sprite.height
                    } else {
                        this.unFreeze()
                    }
                }
            }
        }
    }
    this.unFreeze = function() {
		this.frozen = false
		if (samus.standingOnCell === this.freezeBlock) {
			samus.onGround = false
		}
		this.freezeBlock.sprite.visible = false
		this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.bomber[this.type][this.currentFrame]]
        this.frozenAt = -99
	}
}
function Swooper(posX,posY,room) {
    var randomType = randomInt(1,currentZone.enemyTextures.swooper.length-1)
    if (randomInt(0,1)) {
        this.diveDirection = -1
    } else {
        this.diveDirection = 1
    }
    this.type = randomType
    this.touchDamage = 32
    this.hp = 30
    this.maxHP = 30
	this.room = room
    this.diveAngle = 0
    room.enemies.push(this)
    this.slowRate = 1
	this.frozen = false
    this.frozenAt = -99
    this.freezeBlock = undefined
	this.diveSpeed = newPixelSize*((30+(randomInt(4,6)*(this.type-1)))/10)
    this.currentFrame = 0
    this.origTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.swooper[this.type][this.currentFrame]]
    this.freezeTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.swooper[0][this.currentFrame]]
	this.sprite = preparedSprite(this.origTexture,0.5,0)
    this.sprite.width = Math.round(this.sprite.width)
    this.sprite.height = Math.round(this.sprite.height)
    this.origin = {x:posX,y:posY}
	this.sprite.x = posX
	this.sprite.y = posY
    this.origScaleX = this.sprite.scale.x
    this.origScaleY = this.sprite.scale.y
    this.damagedAt = -99
    this.blewAt = undefined
    this.gibs = []
    this.detonated = false
	gameContainer.addChildAt(this.sprite,0)
	this.sprite.visible = false
    this.dove = false
    this.landed = false
    this.landedAt = -99
    this.relandedAt = -99
    this.explodeDelay = 20-(this.type*3)
    this.dead = false
    this.ascending = false
    this.reboundDistance = this.sprite.height*2
    this.detectionRange = cellSize*randomInt(5,8)
    this.diveDelay = randomInt(15,45)
    swoopers.push(this)
    
    this.reset = function() {
        if (randomInt(0,1)) {
            this.diveDirection = -1
        } else {
            this.diveDirection = 1
        }
        this.diveDelay = randomInt(15,45)
        this.diveSpeed = newPixelSize*((30+(randomInt(4,6)*(this.type-1)))/10)
        this.reboundDistance = this.sprite.height*2
        this.sprite.x = this.origin.x
		this.sprite.y = this.origin.y
        this.sprite.tint = 0xffffff
        // this.sprite.visible = true
        this.sprite.texture = this.origTexture
		this.landed = false
        this.landedAt = -99
        this.dove = false
        this.blewAt = undefined
        this.hp = this.maxHP
        this.slowRate = 1
        // this.dead = false
        this.gibs.length = 0
        this.detonated = false
    }
    this.spinPattern = [0,1,0,2]
    this.spinIndex = 0
    
    this.detonate = function() {
        this.detonated = true
        this.sprite.visible = false
        
        for (var g=0;g<4;g++) {
            var gib = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
            gib.anchor.set(0.5)
            gib.tint = 0xff0000
            gib.width = cellSize/3.5
            gib.height = cellSize/3.5
            if (g===0) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===1) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/2)
            } else if (g===2) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            } else if (g===3) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/3)+(this.sprite.height/2)
            }
            this.gibs.push(gib)
            gameContainer.addChild(gib)
        }
    }
    this.sprayGibs = function() {
        var sinceBlew = counter-this.blewAt
        for (var g=0;g<this.gibs.length;g++) {
            var gib = this.gibs[g]
            if (g===0) {
                gib.x -= cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===1) {
                gib.x += cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===2) {
                gib.x -= cellSize/4
                gib.y -= cellSize/10
            } else if (g===3) {
                gib.x += cellSize/4
                gib.y -= cellSize/10
            }
            gib.y += (sinceBlew*(newPixelSize))
            if (sinceBlew === 8) {
                gib.destroy()
            }
        }
        
        if (sinceBlew === 8) {
            this.dead = true
            this.reset()
        }
    }
    
    this.findCeiling = function() {
        var closestY = segmentHeight*cellSize
        var winner = undefined
        for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
            if (cell.type !== "noCollision" && cell.sprite.y <= this.sprite.y-cellSize && Math.abs(cell.sprite.x+(cell.sprite.width/2)-this.sprite.x) <= cellSize/2) {
                var diffY = this.sprite.y-cell.sprite.y
                // cell.sprite.tint = 0xff0000
                if (diffY < closestY) {
                    closestY = diffY
                    winner = cell
                }
            }
        }
        if (winner) {
            this.homeCell = winner
            this.sprite.x = this.origin.x = winner.sprite.x+(winner.sprite.width/2)
            this.sprite.y = this.origin.y = winner.sprite.y+(cellSize)
        }
    }
    
    this.flap = function(speed) {
        if (counter % speed === 0) {
            if (this.currentFrame === 0) {
                this.currentFrame = 1
            } else {
                this.currentFrame = 0
            }
            this.sprite.texture = PIXI.utils.TextureCache[this.room.zone.enemyTextures.swooper[this.type][this.currentFrame]]
        }
    }
    
    this.explode = function() {
        var sinceBlew = counter-this.blewAt
		if (sinceBlew === 1) {
			this.sprite.texture = PIXI.utils.TextureCache["bombexplode1.png"]
		}
		if (sinceBlew === 4) {
			this.sprite.texture = PIXI.utils.TextureCache["bombexplode2.png"]
		}
		if (sinceBlew === 6) {
            this.sprite.texture = this.origTexture
            this.sprite.scale.x = this.origScaleX
            this.sprite.scale.y = this.origScaleY
            gameContainer.setChildIndex(this.sprite,0)
            this.sprite.visible = false
			// this.reset()
		}
        this.sprite.width += Math.round(cellSize/9)
		this.sprite.height += Math.round(cellSize/9)
    }
    this.offScreen = function() {
        return (this.sprite.x < -gameContainer.x || this.sprite.x > -gameContainer.x+(viewWidth))
    }
    this.dive = function() {
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        var samusAngle = angleOfPointABFromXY(samus.sprite.x,samus.sprite.y-(samus.standingHeight/2),this.sprite.x,this.sprite.y+(this.sprite.height/2))
        
        if (samusAngle < degToRad(160) && samusAngle > degToRad(20)) {
            this.diveAngle = samusAngle
        }
        var targetPoint = pointAtAngle(this.sprite.x,this.sprite.y,this.diveAngle,this.diveSpeed*this.slowRate)
        this.sprite.x = targetPoint.x
        this.sprite.y = targetPoint.y
        // this.sprite.y += this.diveSpeed*this.slowRate
        // this.sprite.x += newPixelSize*(randomInt(3,9)/6)*this.diveDirection*this.slowRate
    }
    this.ascend = function() {
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        this.sprite.y -=  this.diveSpeed*this.slowRate
        this.sprite.x += newPixelSize*(randomInt(3,9)/10)*this.diveDirection*this.slowRate
    }
	this.checkForGround = function() {
		for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
            if (cell.type !== "noCollision" && this.freezeBlock !== cell) {
                if (Math.abs(cell.sprite.x-this.sprite.x) <= cellSize*2) {
                    
                    var diffY = (cell.sprite.y-this.diveSpeed)-this.sprite.y
                    var diffX = Math.abs(cell.sprite.x+(cellSize/2)-this.sprite.x)
                    
                    if (diffX <= cellSize) {
                        this.flyDirection = 0
                        if (!this.ascending && cell.sprite.y > this.sprite.y+(this.sprite.height) && diffY < this.reboundDistance) {
                            this.landed = true
                            this.ascending = true
                            this.landedAt = counter
                            this.homeCell = undefined
                            this.sprite.y = cell.sprite.y-((this.reboundDistance))
                            return
                            
                        } else if (this.ascending && cell.sprite.y < this.sprite.y && this.sprite.y < cell.sprite.y+cellSize) {
                            this.landed = false
                            this.relandedAt = counter
                            this.ascending = false
                            this.dove = false
                            this.homeCell = cell
                            if (randomInt(0,1)) {
                                this.diveDirection = -1
                            } else {
                                this.diveDirection = 1
                            }
                            this.diveDelay = randomInt(15,45)
                            this.reboundDistance = this.sprite.height*2
                            this.diveSpeed = newPixelSize*((30+(randomInt(4,6)*(this.type-1)))/10)
                            this.sprite.y = cell.sprite.y+cellSize
                            return
                        }
                    }
                    
                }
            }
		}
        
	}
    this.checkForBombs = function() {
		for (var b=0;b<bombs.length;b++) {
			var bomb = bombs[b]
			if (bomb.detonated) {
				var diffX = this.sprite.x-bomb.sprite.x
                var diffY = this.sprite.y-bomb.sprite.y
				if (Math.abs(diffX) <= cellSize) {
					this.hp -= bomb.damage
                    this.damagedAt = counter
                    if (this.hp <= 0) {
                        // this.dead = true
                        if (this.frozen) {
                            this.unFreeze()
                        }
                        if (randomInt(0,1)) {
                            var powerup = "health"
                        } else {
                            var powerup = "missile"
                        }
                        new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                        this.blewAt = counter
                        if (!this.detonated) {
                            this.detonate()
                        }
                        
                    }
				}
			}
		}
	}
    this.checkForSamus = function() {
        var xDist = samus.sprite.x-this.sprite.x
        var yDist = (samus.sprite.y-(samus.standingHeight/2))-(this.sprite.y+(this.sprite.height/2))
        var collisionX = cellSize
        var collisionY = (samus.standingHeight/2)+(this.sprite.height/2)
        if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
            samus.takeDamage(this,this.touchDamage)
            this.landed = true
            this.ascending = true
            this.landedAt = counter
            this.homeCell = undefined
        }
    }
    this.checkForBullets = function() {
        for (var b=0;b<bullets.length;b++) {
            var bullet = bullets[b]
            var xDist = this.sprite.x-bullet.sprite.x
            var yDist = (this.sprite.y+(this.sprite.height/2))-bullet.sprite.y
            var collisionX = (this.sprite.height/2)+(bullet.sprite.height/2)
            var collisionY = (this.sprite.width/2)+(bullet.sprite.height/2)
            if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
                if (bullet.type !== "missile") {
                    bullet.doomed = true
                    if (bullet.launchDirection.x === 1) {
                        bullet.sprite.x = this.sprite.x-(this.sprite.width/2)-(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.x === -1) {
                        bullet.sprite.x = this.sprite.x+(this.sprite.width/2)+(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.y === -1) {
                        bullet.sprite.y = this.sprite.y+this.sprite.height+(bullet.sprite.height/2)
                    }
                } else {
                    bullet.blewAt = counter
                }
                this.hp -= bullet.damage
                this.damagedAt = counter
                if (this.hp <= 0) {
                    // this.dead = true
                    if (this.frozen) {
                        this.unFreeze()
                    }
                    if (randomInt(0,1)) {
                        var powerup = "health"
                    } else {
                        var powerup = "missile"
                    }
                    new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                    this.blewAt = counter
                    if (!this.detonated) {
                        this.detonate()
                    }
                }
                if (bullet.type === "ice") {
                    if (!this.dead && !this.frozen) {
                        this.frozen = true
                        this.frozenAt = counter
                        this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.swooper[0][this.currentFrame]]
                        this.freezeBlock = undefined
                        this.freezeBlock = new Cell(0,0,this.sprite.x-(this.sprite.width/2),this.sprite.y)
                        activeCells.push(this.freezeBlock)
                        this.freezeBlock.sprite.alpha = 0
                        this.freezeBlock.sprite.width = this.sprite.width
                        // this.freezeBlock.sprite.height = this.sprite.height
                    } else {
                        this.unFreeze()
                    }
                }
            }
        }
    }
    this.unFreeze = function() {
		this.frozen = false
		if (samus.standingOnCell === this.freezeBlock) {
			samus.onGround = false
		}
		this.freezeBlock.sprite.visible = false
		this.sprite.texture = PIXI.utils.TextureCache[currentZone.enemyTextures.diver[this.type][this.currentFrame]]
        this.frozenAt = -99
	}
}

function Waver(posX,posY,room) {
    var randomType = randomInt(1,currentZone.enemyTextures.waver.length-1)
    this.type = randomType
    this.touchDamage = 18
    this.hp = 30
    this.maxHP = 30
	this.room = room
    room.enemies.push(this)
    this.slowRate = 1
	this.frozen = false
    this.frozenAt = -99
    this.freezeBlock = undefined
    this.attachedTo = undefined
	this.flySpeed = newPixelSize+((randomType-1)*(newPixelSize))
    this.currentFrame = 0
    this.origTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.waver[randomType][this.currentFrame]]
    this.freezeTexture = PIXI.utils.TextureCache[currentZone.enemyTextures.waver[0][0]]
	this.sprite = preparedSprite(this.origTexture,0.5,0.5)
    this.sprite.width = Math.round(this.sprite.width)
    this.sprite.height = Math.round(this.sprite.height)
    this.velocity = {x:0,y:0}
    this.origin = {x:undefined,y:undefined}
	this.sprite.x = this.origin.x = posX
	this.sprite.y = this.origin.y = posY
    this.origScaleX = this.sprite.scale.x
    this.origScaleY = this.sprite.scale.y
    this.damagedAt = -99
    this.blewAt = undefined
    this.gibs = []
    this.detonated = false
    this.flexing = false
    this.bornAt = counter
    this.base = {x:this.sprite.x,y:this.sprite.y}
    var waveBonus = randomInt(0,5)/5
    this.waveSize = cellSize+(waveBonus*cellSize)
    this.waveAngle = 0
    this.flySpeed += waveBonus*newPixelSize*2
    if (randomInt(0,1)) {
        this.flyDirection = "-1"
        if (this.sprite.scale.x < 0) {
            this.sprite.scale.x *= -1
        }
    } else {
        this.flyDirection = "1"
        if (this.sprite.scale.x > 0) {
            this.sprite.scale.x *= -1
        }
    }
    this.damagedAt = -99
	gameContainer.addChildAt(this.sprite,0)
	this.sprite.visible = false
    this.dead = false
    wavers.push(this)
    this.reset = function() {
        if (randomInt(0,1)) {
            this.flyDirection = "-1"
            if (this.sprite.scale.x < 0) {
                this.sprite.scale.x *= -1
            }
        } else {
            this.flyDirection = "1"
            if (this.sprite.scale.x > 0) {
                this.sprite.scale.x *= -1
            }
        }
        this.sprite.x = this.origin.x
		this.sprite.y = this.origin.y
        this.sprite.tint = 0xffffff
        this.sprite.visible = false
        this.sprite.rotation = 0
        this.blewAt = undefined
        this.hp = this.maxHP
        this.slowRate = 1
        // this.dead = false
        this.gibs.length = 0
        this.detonated = false
        this.bornAt = counter
    }
    this.applyVelocity = function() {
        if (counter-this.damagedAt < 10) {
            this.slowRate = 0.1
        }
        if (counter-this.damagedAt === 10) {
            this.slowRate = 1
        }
        var appliedX = this.velocity.x*this.slowRate
        var appliedY = this.velocity.y*this.slowRate

        this.sprite.x += appliedX
        this.sprite.y += appliedY
    }
    this.fireAngle = 0
    this.fly = function() {
        this.waveAngle += 8
        if (this.waveAngle >= 360) {
            this.waveAngle -= 360
        }
        var sinceFired = counter-this.bornAt
        this.velocity.x = this.flySpeed*this.flyDirection
        var lineX = this.base.x+(sinceFired*this.flySpeed*this.flyDirection)
		var waveSpot = pointAtAngle(lineX,this.base.y,degToRad(this.waveAngle),this.waveSize)
	    this.velocity.y = waveSpot.y-this.sprite.y
        
    }
    this.flexPattern = [0,1,2,2,2,2,2,1,0]
    this.flexIndex = 0
    this.flex = function() {
        this.currentFrame = this.flexPattern[this.flexIndex]
        this.sprite.texture = PIXI.utils.TextureCache[this.room.zone.enemyTextures.waver[this.type][this.currentFrame]]
        this.flexIndex++
        if (this.flexIndex === this.flexPattern.length) {
            this.flexing = false
            this.flexIndex = 0
        }
    }
    
    this.detonate = function() {
        this.detonated = true 
        for (var g=0;g<4;g++) {
            var gib = new PIXI.Sprite(PIXI.utils.TextureCache["pixel.bmp"])
            gib.anchor.set(0.5)
            gib.tint = 0xff0000
            gib.width = cellSize/3.5
            gib.height = cellSize/3.5
            if (g===0) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y
            } else if (g===1) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y
            } else if (g===2) {
                gib.x = this.sprite.x
                gib.y = this.sprite.y+(this.sprite.height/3)
            } else if (g===3) {
                gib.x = this.sprite.x+(this.sprite.width/3)
                gib.y = this.sprite.y+(this.sprite.height/3)
            }
            this.gibs.push(gib)
            gameContainer.addChild(gib)
        }
        this.sprite.visible = false
    }
    this.sprayGibs = function() {
        var sinceBlew = counter-this.blewAt
        for (var g=0;g<this.gibs.length;g++) {
            var gib = this.gibs[g]
            if (g===0) {
                gib.x -= cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===1) {
                gib.x += cellSize/3.75
                gib.y -= cellSize/4
            } else if (g===2) {
                gib.x -= cellSize/4
                gib.y -= cellSize/10
            } else if (g===3) {
                gib.x += cellSize/4
                gib.y -= cellSize/10
            }
            gib.y += (sinceBlew*(newPixelSize))
            if (sinceBlew === 8) {
                gib.destroy()
            }
        }
        if (sinceBlew === 8) {
            this.dead = true
            this.reset()

        }
    }
    this.checkForBlocks = function() {
		for (var a=0;a<activeCells.length;a++) {
			var cell = activeCells[a]
			if (cell.type !== "noCollision" && cell.sprite.alpha > 0 && cell.sprite.visible && this.freezeBlock !== cell) {
				var diffX = Math.round(this.sprite.x-(cell.sprite.x+(cellSize/2)))
                var diffY = Math.round((this.sprite.y)-(cell.sprite.y+(cellSize/2)))
				if (Math.abs(diffX) < (cellSize/2)+(this.sprite.width/2) && Math.abs(diffY) < (cellSize/2)+(this.sprite.height/2)) {
                    if (Math.abs(diffX) <= Math.abs(diffY)) {
                        // above or below?
                        if (diffY < 0) {
                            // hit bottom
                            // cell.sprite.tint = 0xff0000
                            this.sprite.y = cell.sprite.y-(this.sprite.height)
                            this.velocity.y = 0
                        } else {
                            // hit top
                            // cell.sprite.tint = 0xff00ff
                            this.sprite.y = cell.sprite.y+(cellSize)+(this.sprite.height)
                            this.velocity.y = 0
                        }
                        
                        

                    } else {
                        this.flyDirection *= -1
                        this.sprite.scale.x *= -1
                        this.velocity.x *= -1
                        // this.velocity.y *= -1
                        this.base.x = this.sprite.x
                        this.base.y = this.sprite.y
                        this.fireAngle = 0
                        this.bornAt = counter
                    }
                    this.waveAngle = 0
                    return
				}
			}
		}
        for (var d=0;d<room.roomObject.doors.length;d++) {
            var door = room.roomObject.doors[d]
            
            var xDist = this.sprite.x-(door.sprite.x+(cellSize/2))
            if (Math.abs(xDist) <= cellSize/2) {
                this.flyDirection *= -1
                this.sprite.scale.x *= -1
                this.velocity.x *= -1
                this.base.x = this.sprite.x
                this.base.y = this.sprite.y
                this.bornAt = counter
                return
            }
        }
	}
    this.checkForSamus = function() {
        var xDist = samus.sprite.x-this.sprite.x
        var yDist = (samus.sprite.y-(samus.standingHeight/2))-(this.sprite.y+(this.sprite.height/2))
        var collisionX = cellSize
        var collisionY = (samus.standingHeight/2)+(this.sprite.height/2)
        if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
            samus.takeDamage(this,this.touchDamage)
        }
    }
    this.checkForBullets = function() {
        for (var b=0;b<bullets.length;b++) {
            var bullet = bullets[b]
            var xDist = this.sprite.x-bullet.sprite.x
            var yDist = (this.sprite.y+(this.sprite.height/2))-bullet.sprite.y
            var collisionX = (this.sprite.height/2)+(bullet.sprite.height/2)
            var collisionY = (this.sprite.width/2)+(bullet.sprite.height/2)
            if (Math.abs(xDist) < collisionX && Math.abs(yDist) < collisionY) {
                if (bullet.type !== "missile") {
                    bullet.doomed = true
                    if (bullet.launchDirection.x === 1) {
                        bullet.sprite.x = this.sprite.x-(this.sprite.width/2)-(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.x === -1) {
                        bullet.sprite.x = this.sprite.x+(this.sprite.width/2)+(bullet.sprite.width/2)
                    }
                    if (bullet.launchDirection.y === -1) {
                        bullet.sprite.y = this.sprite.y+this.sprite.height+(bullet.sprite.height/2)
                    }
                } else if (!bullet.blewAt) {
                    bullet.blewAt = counter
                }
                this.hp -= bullet.damage
                this.damagedAt = counter
                this.lastBorn = this.bornAt
                if (this.hp <= 0) {
                    // this.dead = true
                    if (this.frozen) {
                        this.unFreeze()
                    }
                    this.sprite.alpha = 0
                    if (randomInt(0,1)) {
                        var powerup = "health"
                    } else {
                        var powerup = "missile"
                    }
                    new Powerup(this.sprite.x,this.sprite.y,powerup)
                    if (!this.detonated) {
                        this.detonate()
                        this.blewAt = counter
                    }
                }
                if (bullet.type === "ice") {
                    if (!this.detonated && !this.frozen) {
                        this.frozen = true
                        this.frozenAt = counter
                        this.sprite.texture = this.freezeTexture
                        this.freezeBlock = undefined
                        this.freezeBlock = new Cell(0,0,this.sprite.x-(this.sprite.width/2),this.sprite.y-(this.sprite.height/2))
                        activeCells.push(this.freezeBlock)
                        this.freezeBlock.sprite.alpha = 0
                        // this.freezeBlock.sprite.width = this.sprite.width
                        // this.freezeBlock.sprite.height = this.sprite.height
                    } else {
                        this.unFreeze()
                    }
                }
            }
        }
    }
    this.checkForBombs = function() {
		for (var b=0;b<bombs.length;b++) {
			var bomb = bombs[b]
			if (bomb.detonated) {
				var diffX = this.sprite.x-bomb.sprite.x
                var diffY = this.sprite.y-bomb.sprite.y
				if (Math.abs(diffX) <= cellSize) {
					this.hp -= bomb.damage
                    this.damagedAt = counter
                    this.lastBorn = this.bornAt
                    if (this.hp <= 0) {
                        // this.dead = true
                        if (this.frozen) {
                            this.unFreeze()
                        }
                        if (randomInt(0,1)) {
                            var powerup = "health"
                        } else {
                            var powerup = "missile"
                        }
                        new Powerup(this.sprite.x,this.sprite.y+(this.sprite.height/2),powerup)
                        if (!this.detonated) {
                            this.detonate()
                            this.blewAt = counter
                        }
                    }
				}
			}
		}
	}
    this.offScreen = function() {
        return (this.sprite.x < -gameContainer.x || this.sprite.x > -gameContainer.x+(viewWidth))
    }
    this.unFreeze = function() {
		this.frozen = false
		if (samus.standingOnCell === this.freezeBlock) {
			samus.onGround = false
		}
		this.freezeBlock.sprite.visible = false					
		this.sprite.texture = this.origTexture
        this.frozenAt = -99
	}
}




function reviveEnemies(room) {
    for (var e=0;e<room.enemies.length;e++) {
		var enemy = room.enemies[e]
		if (enemy.dead) {
			enemy.dead = false
		}
        if (enemy.riseSpeed && enemy.risen) {
            enemy.reset()
            
        }
        if (enemy.supply) {
            enemy.killed = 0
            enemy.supply = randomInt(5,12)
        }
	}
}
function clearGibs(room) {
    for (var e=0;e<room.enemies.length;e++) {
		var enemy = room.enemies[e]
        
		if (enemy.detonated) {
			for (var g=0;g<enemy.gibs.length;g++) {
                var gib = enemy.gibs[g]
                gib.destroy()
            }
		}
        enemy.reset()
	}
}