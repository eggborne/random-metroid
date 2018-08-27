zoneStyles = {
	brinstar:["blue","orange","green","purple"],
	norfair:["purple","purpleShrub","green","redBrick","orange","greenEyeballs","purpleEyeballs"],
	ripleyHideout:["pink","green","white","purple"],
	kraidHideout:["white","green","blueBrick","blueBalls"],
	tourian:["white","blue"]
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

function plotZone(zone) {
	console.log("plotting " + zone.name)
	var styleIndexes = []
	for (var i=0;i<zoneStyles[zone.name].length;i++) {
		styleIndexes.push(i)
	}
	var sequence = shuffleArray(styleIndexes)
	if (zone.name === "brinstar") {
		var num = rooms.length
		changeCreationZone(brinstar,zoneStyles[zone.name][0])
		plotHorizontalRoom({x:0,y:0},{x:4,y:0},"wall","door")
		createRoomFromIndex(0)
		changeCreationZone(brinstar,zoneStyles[zone.name][sequence[0]])
		plotVerticalRoom({x:5,y:5},{x:5,y:0},[[5],[0,5]],"closed")
		plotElevatorRoom({x:6,y:5},{x:6,y:6},true,false)
		plotHorizontalRoom({x:6,y:0},{x:9,y:0},"door","door")
		plotVerticalRoom({x:10,y:0},{x:10,y:-12},[[0,9,12],[7]],"closed")
		plotHorizontalRoom({x:5,y:-12},{x:9,y:-12},"door","door")
		plotPreludeRoom({x:3,y:-12},{x:4,y:-12},true,true)
		plotElevatorRoom({x:2,y:-12},{x:2,y:-11},false,true)
		plotPreludeRoom({x:7,y:-9},{x:9,y:-9},true,true)
		plotItemRoom({x:6,y:-9},{x:6,y:-9})
		plotHallway({x:11,y:-7},{x:11,y:-7},1,1)
		changeCreationZone(brinstar,zoneStyles[zone.name][sequence[1]])
		plotVerticalRoom({x:12,y:-3},{x:12,y:-12},[[4],[0,4,8]],"closed")
		plotVerticalRoom({x:30,y:-7},{x:30,y:-11},[[0,2,4],[]],"closed")
		plotPreludeRoom({x:26,y:-9},{x:29,y:-9})
		plotItemRoom({x:25,y:-9},{x:25,y:-9})
		plotPreludeRoom({x:15,y:-12},{x:18,y:-12})
		plotItemRoom({x:14,y:-12},{x:14,y:-12})
		plotVerticalRoom({x:19,y:-12},{x:19,y:-12},[[0],[]],"closed")
		plotHorizontalRoom({x:13,y:-3},{x:21,y:-3},"door","door")
		plotElevatorRoom({x:22,y:-3},{x:22,y:-2},true,false)
		plotVerticalRoom({x:22,y:-5},{x:22,y:-6},[[0],[]],"open")
		plotVerticalRoom({x:18,y:-5},{x:18,y:-6},[[],[]],"open")
		plotPreludeRoom({x:20,y:-5},{x:21,y:-5})
		plotItemRoom({x:19,y:-5},{x:19,y:-5})
		changeCreationZone(brinstar,zoneStyles[zone.name][sequence[2]])
		plotHorizontalRoom({x:13,y:-11},{x:18,y:-11},"door","door")
		plotVerticalRoom({x:19,y:-11},{x:19,y:-11},[[0],[0]],"open")
		plotHorizontalRoom({x:20,y:-11},{x:29,y:-11},"door","door")
		changeCreationZone(brinstar,zoneStyles[zone.name][sequence[3]])
		plotHorizontalRoom({x:13,y:-7},{x:17,y:-7},"door","door")
		plotHorizontalRoom({x:18,y:-7},{x:18,y:-7},"door","door")
		plotHorizontalRoom({x:19,y:-7},{x:21,y:-7},"door","door")
		plotHorizontalRoom({x:22,y:-7},{x:22,y:-7},"door","door")
		plotHorizontalRoom({x:23,y:-7},{x:29,y:-7},"door","door")
		brinstar.numberOfRooms = rooms.length-num
	}
	if (zone.name === "norfair") {
		var num = rooms.length
		changeCreationZone(norfair,zoneStyles[zone.name][sequence[0]])
		plotVerticalRoom({x:22,y:0},{x:22,y:-1},[[0],[0]],"landing")
		plotVerticalRoom({x:30,y:8},{x:30,y:-4},[[0,5,7,8,10,11,12],[]],"closed")
		plotItemRoom({x:27,y:3},{x:27,y:3})
		plotPreludeRoom({x:28,y:3},{x:29,y:3})
		plotVerticalRoom({x:22,y:9},{x:22,y:8},[[],[0,1]],"closed")
		plotVerticalRoom({x:12,y:1},{x:12,y:0},[[],[0,1]],"closed")
		plotVerticalRoom({x:24,y:-2},{x:24,y:-4},[[],[0,2]],"closed")
		changeCreationZone(norfair,zoneStyles[zone.name][sequence[1]])
		plotHorizontalRoom({x:13,y:0},{x:21,y:0},"door","door")
		plotHorizontalRoom({x:13,y:1},{x:16,y:1},"door","door")
		changeCreationZone(norfair,zoneStyles[zone.name][sequence[2]])
		plotVerticalRoom({x:12,y:4},{x:12,y:3},[[],[0,1]],"closed")
		plotVerticalRoom({x:17,y:4},{x:17,y:1},[[0,1,2,3],[0,1]],"closed")
		plotPreludeRoom({x:15,y:2},{x:16,y:2})
		plotItemRoom({x:14,y:2},{x:14,y:2})
		plotVerticalRoom({x:12,y:6},{x:12,y:5},[[],[0]],"closed")
		plotVerticalRoom({x:16,y:6},{x:16,y:6},[[0],[0]],"closed")
		plotVerticalRoom({x:20,y:6},{x:20,y:6},[[0],[0]],"closed")
		plotVerticalRoom({x:20,y:7},{x:20,y:7},[[0],[]],"closed")
		plotVerticalRoom({x:16,y:8},{x:16,y:7},[[],[0]],"closed")
		plotVerticalRoom({x:29,y:5},{x:29,y:4},[[0,1],[]],"closed")
		changeCreationZone(norfair,zoneStyles[zone.name][sequence[3]])
		plotHorizontalRoom({x:13,y:3},{x:16,y:3},"door","door")
		plotHorizontalRoom({x:13,y:4},{x:16,y:4},"door","door")
		plotHorizontalRoom({x:18,y:3},{x:21,y:3},"door","door")
		plotHorizontalRoom({x:18,y:4},{x:28,y:4},"door","door")
        // no left
		plotHorizontalRoom({x:26,y:5},{x:28,y:5},"door","door")
		plotHallway({x:22,y:3},{x:22,y:3},1,1)
		changeCreationZone(norfair,zoneStyles[zone.name][sequence[4]])
		plotHorizontalRoom({x:23,y:0},{x:29,y:0},"door","door")
		plotHorizontalRoom({x:24,y:1},{x:29,y:1},"wall","door")
		plotHorizontalRoom({x:23,y:3},{x:25,y:3},"door","wall")
		plotHorizontalRoom({x:25,y:-4},{x:29,y:-4},"door","door")
		plotHorizontalRoom({x:26,y:-3},{x:29,y:-3},"wall","door")
		plotHorizontalRoom({x:25,y:-2},{x:29,y:-2},"door","door")
		changeCreationZone(norfair,zoneStyles[zone.name][sequence[5]])
		plotHorizontalRoom({x:13,y:6},{x:15,y:6},"door","door")
		plotHorizontalRoom({x:17,y:6},{x:19,y:6},"door","door")
		plotHorizontalRoom({x:21,y:6},{x:28,y:6},"door","wall")
		plotItemRoom({x:17,y:7},{x:17,y:7})
		plotPreludeRoom({x:18,y:7},{x:19,y:7})
		plotHorizontalRoom({x:17,y:8},{x:19,y:8},"door","wall")
		changeCreationZone(norfair,zoneStyles[zone.name][sequence[6]])
		plotHorizontalRoom({x:23,y:8},{x:29,y:8},"door","door")
		plotElevatorRoom({x:23,y:9},{x:23,y:10},true,false)
		norfair.numberOfRooms = rooms.length-num
	}
	if (zone.name === "ripleyHideout") {
		var num = rooms.length
		changeCreationZone(ripleyHideout,zoneStyles[zone.name][sequence[0]])
		plotVerticalRoom({x:23,y:12},{x:23,y:11},[[0],[0]],"landing")
		plotVerticalRoom({x:30,y:17},{x:30,y:12},[[0,1,3,5],[]],"closed")
		plotVerticalRoom({x:13,y:17},{x:13,y:11},[[],[0,3,5]],"closed")
		plotVerticalRoom({x:20,y:16},{x:20,y:14},[[0,2],[0,2]],"closed")
		plotVerticalRoom({x:16,y:14},{x:16,y:13},[[0],[0]],"open")
		changeCreationZone(ripleyHideout,zoneStyles[zone.name][sequence[1]])
		plotHorizontalRoom({x:14,y:12},{x:15,y:12},"door","door")
		plotHorizontalRoom({x:17,y:12},{x:20,y:12},"door","door")
		plotHorizontalRoom({x:14,y:14},{x:15,y:14},"door","door")
		plotHorizontalRoom({x:17,y:14},{x:19,y:14},"door","door")
		plotHorizontalRoom({x:21,y:16},{x:29,y:16},"door","door")
		changeCreationZone(ripleyHideout,zoneStyles[zone.name][sequence[2]])
		plotHorizontalRoom({x:16,y:12},{x:16,y:12},"door","door")
		plotHorizontalRoom({x:17,y:11},{x:17,y:11},"wall",false)
		plotHorizontalRoom({x:24,y:12},{x:29,y:12},"door","door")
		plotHorizontalRoom({x:21,y:11},{x:21,y:11},"door","wall")
		plotHorizontalRoom({x:21,y:12},{x:21,y:12},"door","door")
		plotHorizontalRoom({x:22,y:12},{x:22,y:12},"door","door")
		plotHorizontalRoom({x:14,y:16},{x:19,y:16},"wall","door")
		changeCreationZone(ripleyHideout,zoneStyles[zone.name][sequence[3]])
		plotHorizontalRoom({x:18,y:11},{x:20,y:11},false,"door")
		plotHorizontalRoom({x:21,y:14},{x:29,y:14},"door","door")
		plotHorizontalRoom({x:14,y:17},{x:29,y:17},"door","door")
		ripleyHideout.numberOfRooms = rooms.length-num
	}
	if (zone.name === "kraidHideout") {
		var num = rooms.length
		changeCreationZone(kraidHideout,zoneStyles[zone.name][sequence[0]])
		plotVerticalRoom({x:6,y:13},{x:6,y:7},[[0,2,4,5],[0,2,4,5]],"landing")
		plotVerticalRoom({x:7,y:6},{x:7,y:4},[[],[0,1,2]],"closed")
		plotVerticalRoom({x:10,y:8},{x:10,y:4},[[0,2,3,4],[]],"closed")
		plotVerticalRoom({x:11,y:16},{x:11,y:11},[[0,4,5],[]],"closed")
		plotVerticalRoom({x:8,y:14},{x:8,y:13},[[0,1],[0]],"closed")
		plotVerticalRoom({x:10,y:15},{x:10,y:14},[[0,1],[]],"closed")
		plotVerticalRoom({x:3,y:13},{x:3,y:11},[[],[0,2]],"closed")
		plotVerticalRoom({x:0,y:15},{x:0,y:8},[[],[0,1,6,7]],"closed")
		changeCreationZone(kraidHideout,zoneStyles[zone.name][sequence[1]])
		plotHorizontalRoom({x:9,y:14},{x:9,y:14},"door","door")
		plotHorizontalRoom({x:8,y:15},{x:8,y:15},"door","door")
		plotHorizontalRoom({x:9,y:15},{x:9,y:15},"door","door")
		plotHorizontalRoom({x:3,y:15},{x:7,y:15},"door","door")
		plotHorizontalRoom({x:1,y:15},{x:2,y:15},"door","door")
		changeCreationZone(kraidHideout,zoneStyles[zone.name][sequence[2]])
		plotHorizontalRoom({x:8,y:4},{x:9,y:4},"door","door")
		plotHorizontalRoom({x:8,y:5},{x:9,y:5},"door","door")
		plotHorizontalRoom({x:8,y:6},{x:9,y:6},"door","door")
		// plotHorizontalRoom({x:9,y:8},{x:9,y:8},false,"door")
		plotHorizontalRoom({x:1,y:8},{x:5,y:8},"door","door")
		plotHorizontalRoom({x:1,y:9},{x:5,y:9},"door","door")
		plotHorizontalRoom({x:4,y:11},{x:5,y:11},"door","door")
		plotHorizontalRoom({x:9,y:12},{x:10,y:12},false,"door")
		plotHorizontalRoom({x:4,y:13},{x:5,y:13},"door","door")
		plotHorizontalRoom({x:9,y:16},{x:10,y:16},"door","door")
		plotHallway({x:7,y:13},{x:7,y:13},5,7)
		plotHallway({x:1,y:14},{x:1,y:14},5,7)
		plotHallway({x:2,y:14},{x:2,y:14},5,7)
		changeCreationZone(kraidHideout,zoneStyles[zone.name][sequence[3]])
		plotHorizontalRoom({x:7,y:11},{x:10,y:11},"door","door")
		plotHorizontalRoom({x:7,y:9},{x:8,y:9},"door","wall")
		plotHorizontalRoom({x:7,y:8},{x:9,y:8},"door","door")
		plotHorizontalRoom({x:7,y:16},{x:8,y:16},"wall","door")
		plotHorizontalRoom({x:3,y:14},{x:7,y:14},"door","door")
		kraidHideout.numberOfRooms = rooms.length-num
	} 
	if (zone.name === "tourian") {
		var num = rooms.length
		changeCreationZone(tourian,zoneStyles[zone.name][sequence[0]])
		plotVerticalRoom({x:2,y:-7},{x:2,y:-10},[[],[0]],"landing")
		plotVerticalRoom({x:9,y:-3},{x:9,y:-7},[[0,4],[]],"closed")
		plotVerticalRoom({x:0,y:-3},{x:0,y:-11},[[],[0]],"closed")
		changeCreationZone(tourian,zoneStyles[zone.name][sequence[1]])
		plotHorizontalRoom({x:3,y:-7},{x:8,y:-7},"door","door")
		plotHorizontalRoom({x:1,y:-3},{x:8,y:-3},"door","door")
		tourian.numberOfRooms = rooms.length-num
	}
	zoneLoaded++
	map.updateCells()
}
function attachElevators() {
	for (var r=0;r<rooms.length;r++) {
		var vert = rooms[r]
		if (vert.type === "vertical" && vert.landing === "landing") {
			for (var s=0;s<rooms.length;s++) {
				var elev = rooms[s]
				if (elev.type === "elevator") {
					var elevHeight = (elev.endPos.y-elev.startPos.y+1)
					if (vert.startPos.x === elev.startPos.x && vert.endPos.y-1 === elev.endPos.y) {
						elev.partner = vert
						vert.partner = elev
					}
				}
			}
		}
	}
}