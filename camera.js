function handleCamera() {
    if (!screenShifting) {
		
        if (counter > 1 && Math.abs(playerMovedX) > 0 && currentRoom.type !== "vertical") {
            
            // if (mapGrid[startingCellPos.y+currentRoom.startPos.y][startingCellPos.x+currentRoom.startPos.x+(currentRoom.endPos.x-currentRoom.startPos.x+1)] === 5
            // || mapGrid[startingCellPos.y+currentRoom.startPos.y][startingCellPos.x+currentRoom.startPos.x+(currentRoom.endPos.x-currentRoom.startPos.x+1)] === 0) {
            //     var scrollLimitRight = -(currentRoom.roomObject.posX+currentRoom.roomObject.width-(viewWidth)-(extraXSpace/2))-(viewWidth-(segmentWidth*cellSize)/2)
            //     // console.log("setting 0 or 5 scrollLimitRight " + scrollLimitRight)
            // } else {
                
                var scrollLimitRight = -(currentRoom.roomObject.posX+currentRoom.roomObject.width-(viewWidth)-(extraXSpace/2))
                // console.log("setting scrollLimitRight " + scrollLimitRight)
            // }
            if (currentRoom.startPos.x-currentRoom.endPos.x === 0) {
                var scrollLimitRight = -(currentRoom.roomObject.posX-(extraXSpace/2))+(viewWidth-(segmentWidth*cellSize))/2
            }
            // if (mapGrid[startingCellPos.y+currentRoom.startPos.y][startingCellPos.x+currentRoom.startPos.x-1] === 5
            // || mapGrid[startingCellPos.y+currentRoom.startPos.y][startingCellPos.x+currentRoom.startPos.x-1] === 0) {
            //     var scrollLimitLeft = -(currentRoom.roomObject.posX)+(extraXSpace/2)+(viewWidth/2)-cellSize
            // } else {
                var scrollLimitLeft = -(currentRoom.roomObject.posX)+(extraXSpace/2)
            // }
            if (currentRoom.startPos.x-currentRoom.endPos.x === 0) {
                var scrollLimitLeft = -(currentRoom.roomObject.posX-(extraXSpace/2))+(viewWidth-(segmentWidth*cellSize))/2
                
            }
            if (gameContainer.x !== scrollLimitLeft && gameContainer.x !== scrollLimitRight) {
                if (playerMovedX > 0) {
                    if (gameContainer.x-playerMovedX >= scrollLimitRight) {
                        gameContainer.x -= playerMovedX
                    } else {
                        gameContainer.x = scrollLimitRight
                        console.log("sticking right")
                    }
                } 	
                if (playerMovedX < 0) {
                    if (gameContainer.x-playerMovedX < scrollLimitLeft) {
                        gameContainer.x -= playerMovedX
                    } else {
                        gameContainer.x = scrollLimitLeft
                    }
                } 	
            } else if (scrollLimitLeft !== scrollLimitRight) {
                if (currentRoom.startPos.x-currentRoom.endPos.x > 0) {}
                if (gameContainer.x === scrollLimitLeft) {
                    if (playerMovedX > 0 && samus.sprite.x >= screenCenter().x) {
                        gameContainer.x -= playerMovedX
                    }
                } else if (gameContainer.x === scrollLimitRight) {
                    // console.log("locked right")
                    if (playerMovedX < 0 && samus.sprite.x <= screenCenter().x) {
                        // console.log("resuming scroll left from lock right")
                        gameContainer.x -= playerMovedX
                    }
                }
            }
        }
        

    } else {
        shiftScreen(screenShifting,currentRoom)
    }
    if (!screenShifting && counter > 1 && Math.abs(playerMovedY) > 0 && currentRoom.type === "vertical") {
        var upperCellX = startingCellPos.x+currentRoom.startPos.x
        var upperCellY = startingCellPos.y+currentRoom.startPos.y-(currentRoom.startPos.y-currentRoom.endPos.y+1)
        // if (mapGrid[upperCellY][upperCellX] !== 5) {
            var scrollLimitTop = -(currentRoom.roomObject.posY-currentRoom.roomObject.height+(cellSize*segmentHeight))+(extraYSpace/2)
        // } else {
        //     var scrollLimitTop = -(currentRoom.roomObject.posY-currentRoom.roomObject.height+(cellSize*8))+(extraYSpace/2)
        // }
        var lowerCellX = startingCellPos.x+currentRoom.startPos.x
        var lowerCellY = startingCellPos.y+currentRoom.startPos.y+1
        
        // if (mapGrid[lowerCellY][lowerCellX] !== 5) {
            var scrollLimitBottom = -(currentRoom.roomObject.posY)+(extraYSpace/2)
        // } else {
        //     var scrollLimitBottom = -(currentRoom.roomObject.posY)-(cellSize*7)+(extraYSpace/2)
        // }
        if (Math.abs(playerMovedY) < cellSize/2 && gameContainer.y !== scrollLimitBottom && gameContainer.y !== scrollLimitTop) {
            if (playerMovedY < 0) {
                if (gameContainer.y-playerMovedY < scrollLimitTop) {
                    gameContainer.y -= playerMovedY
                } else {
                    gameContainer.y = scrollLimitTop
                }
            } else if (playerMovedY > 0) {
                if (gameContainer.y-playerMovedY > scrollLimitBottom) {
                    gameContainer.y -= playerMovedY
                } else {
                    gameContainer.y = scrollLimitBottom
                }
            }
        } else {
            if (currentRoom.startPos.x-currentRoom.endPos.x === 0) { 
                if (gameContainer.y === scrollLimitBottom) {
                    if (playerMovedY < 0 && samus.sprite.y <= screenCenter().y) {
                        gameContainer.y -= playerMovedY
                    }
                } else {
                    if ((playerMovedY > 0 && samus.sprite.y >= screenCenter().y)) {
                        gameContainer.y -= playerMovedY
                    }
                }
            }
        }
        if (Math.abs(playerMovedY) >= cellSize/2) {
            // console.log("NOT SCROLL " + counter)
        }
    }
}