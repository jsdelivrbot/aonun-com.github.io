let names=`download,dashboard,spaces,turnOff,moreBrightness,lessBrightness,widgets,brightness
forward,rewind,playPause,volumeOff,lowVolume,highVolume,application2,application4
paintbucket,text,colorMixer,selection,resize,crop,roundedSelection,switchColors
colors,noColor,wireFrame,layout,grid,topbar,expose,newLayer
lock,unlock,calendar,todoList1,rulers,writeDocument,jog,keyframes
intersect,split,union,intersect2,colorPicker,colorPickerSelected,reload,vinyl
acion,flame,earth,oldCamera,newCamera,zoomInPlace,zoomOutPlace,refresh
settings,boldPlus,ghost,addScreen,infoScreen,info,settings1,iceCream
drop,wall,flag,roller,marker,cutter,heart,gallery
addPin,star,comment,chat,pin,mail,newDocument,removePin
NYFatcap,tiles,spraycanEmpty,fullSparaycan,spraycanHalfFull,brush,toiletPaper,subway
bomb,slotenacesta,upload,santasReindeer,pointer,handy,home,capricorn1
paragraphJustify,paragraphLeft,paragraphRight,christmassTree,pcfan,zip,images,path
plus,reply,trash,retweet,unrated,rated,twitter,pen
user2,users,userComments,users2,usersComents,watchUser,thinkingUser,updateSummary
map,list,orderedList,imageLike,watch,watchMap,userComment,todoList
display,user,watchedUser,addUser,removeUser,userInfo,deleteUser,watchedWall
tags,addFlag,zoomOut,zoomIn,search,watchHome,taxi,car
iphoneVertical,creditCard,imac,cart,barcode,toCart,wallet,iphoneHorizontal
ok,ng,movieFrame,summary,coins,tool,soundWave,oldPhone
rightArrow,leftArrow,smallerPads,note,biggerPads,headphones,cd,arrows`;


let namesArray=names.split('\n').map(e=>e.split(','));
// console.log(namesArray);

function getModel(name,x,y){
	return `.icons_${name} { background-position: ${x}px ${y}px; }`;
}


let cssDatas=[`.icons {
width: 18px;
height: 18px;
background-image: url(icons.png);
background-repeat: no;
display: inline-block;
user-select: none;
cursor: pointer;}`];
namesArray.forEach((row,rowIndex)=>{
	row.forEach((rowItem,rowItemIndex)=>{
		let name=rowItem,
		x=-18*rowItemIndex,
		y=-18*rowIndex;
		let css=getModel(name,x,y);

		cssDatas.push(css);
		// console.log(css);
	})
});


const fs=require('fs');
fs.writeFileSync('icons.css', cssDatas.join('\n'),{encoding:'utf8'});
