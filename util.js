function correctScreenSize() {
	if (renderer.width !== window.innerWidth || renderer.height !== window.innerHeight) {
		renderer.resize(window.innerWidth,window.innerHeight)
		var xDiff = window.innerWidth-viewWidth
		var yDiff = window.innerHeight-viewHeight	
		if (xDiff > yDiff) {
			var oldWidth = stage.width
			var oldHeight = stage.height
			stage.height = viewHeight
			var adjustment = (stage.height/oldHeight)			
			stage.width *= adjustment
			var difference = stage.width-oldWidth
			var toAdd = ((difference)/2)
			var actualBGWidth = viewWidth*stage.scale.x
			stage.x = (renderer.width-actualBGWidth)/2
		} else {
			var oldHeight = stage.height
			var oldWidth = stage.width
			stage.height = renderer.height
			var adjustment = (stage.height/oldHeight)			
			stage.width *= adjustment
			var actualBGWidth = viewWidth*stage.scale.x
			// stage.x = (renderer.width-actualBGWidth)/2
			stage.y = 0
		}
		if (screenVertical) {
			stage.y = 0
		}			
		
	
	}
}
function randomInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
function pointAtAngle(x,y,angle,distance) {
    return {x:x+distance*Math.cos(angle),y:y+distance*Math.sin(angle)};
};
function angleOfPointABFromXY(a,b,x,y) {
    return Math.atan2(b-y,a-x);
};
function distanceFromABToXY(a,b,x,y) {
    var distanceX = x-a;
    var distanceY = y-b;
    return Math.round( Math.sqrt( (distanceX*distanceX)+(distanceY*distanceY) ));
}
degToRad = function(radians) {
    return radians*(Math.PI/180);
};
radToDeg = function(radians) {
    deg = radians*(180/Math.PI);
    if (deg < 0) {
        deg += 360;
    } else if (deg > 359) {
        deg -= 360;
    };
    return Math.round(radians*(180/Math.PI))
};
function fullscreen() {
	// fullscreen = true
    var el = document.body
    if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    } else {
        el.mozRequestFullScreen()
    }
}
function exitFullscreen() {
	// fullscreen = false
    if (document.exitFullScreen) {
        document.exitFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    }
};
function playSound(sound) {
	if (soundOn) {
		sound.play()
	}
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function lightenColor(colorString) {
    var newColorArray = ["0x"];
    for (var c=2;c<8;c+=2) {
        if (!(colorString.charAt(c) === "f" && colorString.charAt(c+1) === "f")) {
            var twoDigitHex = [];
            twoDigitHex[0] = colorString.charAt(c).toString();
            twoDigitHex[1] = colorString.charAt(c+1).toString();
            newColorArray.push(advanceTwoDigitHex(twoDigitHex.join("")));
        } else {
            newColorArray.push("ff")
        }
    }
    return newColorArray.join("");
}
function advanceTwoDigitHex(orig) {
    if (orig !== "ff") {
        var newArray = [orig.charAt(0),orig.charAt(1)];
        newArray[1] = hexDigits[hexDigits.indexOf(newArray[1])+1];
        if (!newArray[1]) {
            newArray[0] = hexDigits[hexDigits.indexOf(newArray[0])+1];
            if (!newArray[0]) {
                newArray[0] = newArray[1] = "f";
            } else {
                newArray[1] = "0";
            }
        }
        return newArray.join("");
    } else { // if white
        return orig;
    }
}
function givePoints(num) {
	
}
function scrollStage() {
	amountX = (window.innerWidth/2)-ship.screenPosition().x
	amountY = mapHeight+((window.innerHeight-mapHeight)/2)-ship.screenPosition().y

	if (stage.x+amountX > ((screensWide/2)*window.innerWidth)-(window.innerWidth/2)) {
		if (ship.screenPosition().x < window.innerWidth/2) {	
			amountX = ((screensWide/2)*window.innerWidth)-(window.innerWidth/2)-stage.x
		}
	}
	if (stage.x+amountX < -(((screensWide/2)*window.innerWidth)-(window.innerWidth/2))) {
		if (ship.screenPosition().x > window.innerWidth/2) {	
			amountX = -(((screensWide/2)*window.innerWidth)-(window.innerWidth/2))-stage.x
		}
	}
	if (stage.y+amountY > 0) {	
		if (ship.screenPosition().y < mapHeight+((window.innerHeight-mapHeight)/2)) {	
			amountY = -stage.y
		}
	}
	if (stage.y+amountY < -((screensHigh-1)*window.innerHeight*1)) {	
		if (ship.screenPosition().y > mapHeight+((window.innerHeight-mapHeight)/2)) {	
			amountY = 0
		}
	}

	stage.velocity.x = amountX
	stage.velocity.y = amountY
	
}
function numberInMiles(num) {
	return Math.round(((num/(frog.sprite.height/3))/5280)*100)/100
}



