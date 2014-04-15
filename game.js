// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

function get_xy(node) {
	return {
		x: parseFloat(node.getAttribute("x")),
		y: parseFloat(node.getAttribute("y"))
	};
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}


// The player class used in this program
function Player() {
    this.node = svgdoc.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
    this.face = 1;
}

Player.prototype.isOnPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

function isOnPlatform(object,size) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((object.x + size.w > x && object.x < x + w) ||
             ((object.x + size.w) == x) ||
              (object.x == (x + w))) &&
            object.y + size.h == y) return true;
    }
    if (object.y + size.h == SCREEN_SIZE.h) return true;

    return false;
}

function is_on_platform(object,size,node) {
	var x = parseFloat(node.getAttribute("x"));
	var y = parseFloat(node.getAttribute("y"));
	var w = parseFloat(node.getAttribute("width"));
	var h = parseFloat(node.getAttribute("height"));
	if (((object.x + size.w > x && object.x < x + w) ||
		 ((object.x + size.w) == x) ||
		  (object.x == (x + w))) &&
		object.y + size.h == y) return true;
}

function is_exactly_on_platform(object,size,node) {
	var x = parseFloat(node.getAttribute("x"));
	var y = parseFloat(node.getAttribute("y"));
	var w = parseFloat(node.getAttribute("width"));
	var h = parseFloat(node.getAttribute("height"));
	if ((object.x + size.w/4 > x && object.x < x + w) &&
		object.y + size.h == y) return true;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

function collidePlatform (position,object_size) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, object_size, pos, size)) {
			return true;
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}

//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 400);     // The initial position of the player

var MOVE_DISPLACEMENT = 10;                  // The speed of the player in motion
var JUMP_SPEED = 40;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 10;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game
var BULLET_SIZE = new Size(10, 10); // The size of a bullet
var BULLET_SPEED = 10.0;            // The speed of a bullet
                                    //  = pixels it moves each game loop
var SHOOT_INTERVAL = 500.0;         // The period when shooting is disabled
var MONSTER_SIZE = new Size(60, 60); // The size of a monster
var GOODTHING_SIZE = new Size(20, 20);

//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum

var svgdoc = null;                          // SVG root document node
var player = null;                          // The player object
var monsters = [];
var monster_bullet;
var gameInterval = null;                    // The interval
var zoom = 1;                             // The zoom level of the screen
var canShoot = true;                // A flag indicating whether the player can shoot a bullet
var score = 0; // The score of the game
var name = "";
var moving_down = true;
var bullet_left = 4;
var level = 1;
var remaining_time = 60;
var cheatmode = false;
var gamestarted = false;
var isASV = (window.navigator.appName == "Adobe SVG Viewer");
var isFF = (window.navigator.appName == "Netscape");
var health = 5;
var hit_rest = 0;

//
// The load function for the SVG document
//
function load(evt) {
    // Set the root node to the global variable
    svgdoc = evt.target.ownerDocument;
    
    name=prompt("Please enter your name", name);
    if( name=="") name="Anonymous";
    svgdoc.getElementById("player_name").innerHTML=name;
	
    // Attach keyboard events
    svgdoc.documentElement.addEventListener("keydown", keydown, false);
    svgdoc.documentElement.addEventListener("keyup", keyup, false);

    // Remove text nodes in the 'platforms' group
    cleanUpGroup("platforms", true);
    
    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
    setInterval(function()
    {
		if( !gamestarted) return;
		remaining_time--;
		if( remaining_time<=0)
			gameover();
		svgdoc.getElementById("time_left").firstChild.data = remaining_time;
	},1000);
}

function prepare(start_zoom)
{
	zoom = 1;
	if( start_zoom) zoom = 2;
	//svgdoc.getElementById("startscreen").setAttribute("visibility","hidden");
	//svgdoc.getElementById("startscreen_A").setAttribute("opacity","0");
	//svgdoc.getElementById("startscreen_B").setAttribute("opacity","0");
	svgdoc.getElementById("effect").beginElement();
	setTimeout(gamestart,2000);
}

function gamestart()
{
	monsters = [];
	canShoot = true;
	score = 0;
	moving_down = true;
	level = 1;
	health = 5;
	bullet_left = 4;
	remaining_time = 60;
	cheatmode = false;
	gamestarted = true;
	
    player = new Player();
	monster_bullet = new Monster_bullet();
	clearchild("monsters", true);
	clearchild("bullets", true);
	clearchild("goodthings", true);
	create_things();
	svgdoc.getElementById("level").firstChild.data = level;
	svgdoc.getElementById("health").firstChild.data = health;
	svgdoc.getElementById("bullet_left").firstChild.data = bullet_left;
}

function create_things()
{
	var num_of_monsters = 2 + (level-1)*2;
	for( var i=0; i<num_of_monsters; i++)
		monsters[i] = new Monster(i==0);
	
	var portals = svgdoc.getElementsByClassName("portal");
	for( var i=0; i<8; i++)
	{
		for(var x=-100,y=-100;
			(x<100 && y>440) ||
			!isOnPlatform({x:x,y:y},GOODTHING_SIZE) ||
			collidePlatform({x:x,y:y},GOODTHING_SIZE) ||
			is_exactly_on_platform({x:x,y:y},PLAYER_SIZE,portals[0]) ||
			is_exactly_on_platform({x:x,y:y},PLAYER_SIZE,portals[1]) ;
			x = Math.floor(Math.random()*580/10)*10,
			y = Math.floor(Math.random()*540/10)*10);
		createElement(svgdoc.getElementById("goodthings"),
			"use",
			{x:x, y:y},
			[["http://www.w3.org/1999/xlink", "xlink:href", "#goodthing"]]);
	}
}

function playsound(id) {
	if (isASV) {
		var snd = document.getElementById(id + "_asv");
		snd.endElement();
		snd.beginElement();
	}
	if (isFF) {
		var snd = svgdoc.getElementById(id);
		snd.currentTime = 0;
		snd.play();
	}
}

//
// This function removes all/certain nodes under a group
//
function cleanUpGroup(id, textOnly) {
    var node, next;
    var group = svgdoc.getElementById(id);
    node = group.firstChild;
    while (node != null) {
        next = node.nextSibling;
        if (!textOnly || node.nodeType == 3) // A text node
            group.removeChild(node);
        node = next;
    }
}


//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
	if( !gamestarted) return;
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "N".charCodeAt(0):
            player.motion = motionType.LEFT;
            break;

        case "M".charCodeAt(0):
            player.motion = motionType.RIGHT;
            break;

        case "Z".charCodeAt(0):
            if (player.isOnPlatform()) player.verticalSpeed = JUMP_SPEED;
            break;
            
        case "C".charCodeAt(0):
            cheatmode = true;
            break;
            
        case "V".charCodeAt(0):
            cheatmode = false;
            break;
           
        case 32: // spacebar = shoot
	    if (canShoot && (bullet_left>0 || cheatmode)) {
			playsound('shoot_sound');
			shootBullet();
			// Disable shooting for a short period of time
			canShoot = false;
			setTimeout("canShoot = true", SHOOT_INTERVAL);
			bullet_left--;
			svgdoc.getElementById("bullet_left").firstChild.data = bullet_left;
		}
	    break;
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
	if( !gamestarted) return;
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "N".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case "M".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}


//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
	if( !gamestarted) return;
    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();
    
    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT)
    {
        displacement.x = -MOVE_DISPLACEMENT;
        player.face = -1;
	}
    if (player.motion == motionType.RIGHT)
    {
        displacement.x = MOVE_DISPLACEMENT;
        player.face = 1;
	}

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }
    
    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;
    
    // moving platform
    var moving = svgdoc.getElementById("moving");
    var mov = get_xy(moving);
    mov.y += 5*(moving_down?1:-1);
    if( is_on_platform(player.position,PLAYER_SIZE,moving))
		position.y += 5*(moving_down?1:-1);
    if( mov.y>=220)
		moving_down = false;
	if( mov.y<=120)
		moving_down = true;
	setAttr(moving,mov);
	
	// disappearing platforms
	var disappearing = svgdoc.getElementsByClassName("disappearing");
	for( var i=0; i<disappearing.length; i++)
	{
		if( is_on_platform(player.position,PLAYER_SIZE,disappearing[i]))
		{
			var opa = parseFloat(disappearing[i].getAttribute('opacity'));
			opa -= 0.05;
			disappearing[i].setAttribute('opacity',opa);
			if( opa<0)
				svgdoc.getElementById("platforms").removeChild(disappearing[i]);
		}
	}
	
	// portals
	var portals = svgdoc.getElementsByClassName("portal");
	var inp = on_portal(position);
	if( inp!==null)
	{
		var out = get_xy(portals[inp===0?1:0]);
		position.x = out.x-20;
		position.y = out.y-40;
	}
	function on_portal(position)
	{
		for( var i=0; i<portals.length; i++)
			if( is_exactly_on_platform(position,PLAYER_SIZE,portals[i]))
				return i;
		return null;
	}
	
	// exit
	if( is_exactly_on_platform(position,PLAYER_SIZE,svgdoc.getElementById("exit")))
	{
		var goodthings = svgdoc.getElementById("goodthings");
		if( goodthings.childNodes.length==0)
		{
			nextlevel();
			return ;
		}
	}
	
    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);
	
    // Set the location back to the player object (before update the screen)
    player.position = position;
	
    updateScreen();
    moveBullets();
    moveMonsters();
    svgdoc.getElementById("score").firstChild.data = score;
    svgdoc.getElementById("health").firstChild.data = health;
    collisionDetection();
    hit_rest--;
}

//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function updateScreen() {
    // Transform the player
    player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
    svgdoc.getElementById("player_sym").setAttribute("transform",player.face==1?"":"translate(40,0) scale(-1,1)");
    for( var i=0; i<monsters.length; i++)
		render(monsters[i],true);
	render(monster_bullet,false);
	
    // Calculate the scaling and translation factors	
    scale="scale("+zoom+")";
    
    var tx = SCREEN_SIZE.w / 2 - (player.position.x + PLAYER_SIZE.w / 2) * zoom;
    if (tx > 0) tx = 0;
    if (tx < SCREEN_SIZE.w * (1-zoom)) tx = SCREEN_SIZE.w * (1-zoom);
    
    var ty = SCREEN_SIZE.h / 2 - (player.position.y + PLAYER_SIZE.h / 2) * zoom;
    if (ty > 0) ty = 0;
    if (ty < SCREEN_SIZE.h * (1-zoom)) ty = SCREEN_SIZE.h * (1-zoom);
    
    svgdoc.getElementById("gamearea").setAttribute("transform", "translate(" + tx + ", " + ty + ")"+scale);
}

function render(object,flip)
{
	object.ele.setAttribute("transform",
			"translate("+object.x+","+object.y+")"+
			((!flip||object.face==-1)?"":"translate(60,0) scale(-1,1)")
			);
}

function Monster(can_shoot){
	this.ele = createElement(svgdoc.getElementById("monsters"),
		"use",
		{x:0, y:0},
		[["http://www.w3.org/1999/xlink", "xlink:href", "#monster"]]);
	this.x = 0;
	this.y = 0;
	this.can_shoot = can_shoot;
	this.go = function(){
		for(var x=0,y=400;
			x<200 && y>280;
			x = Math.floor(Math.random()*520/10)*10,
			y = Math.floor(Math.random()*480/10)*10);
		this.tx = x;
		this.ty = y;
		this.face = (this.tx-this.x)>0?1:-1;
	}
	this.go();
	//var ani = createElement(mon,"animateMotion",
	//	{begin:"indefinite", path:"M 0 0 L "+x+" "+y,
	//		attributeName:"primer", dur:"1s", fill:"freeze"});
}

function Monster_bullet(){
	this.ele = svgdoc.getElementById("monster_bullet");
	this.x = -100;
	this.y = -100;
	this.face = 0;
}

function moveMonsters() {
	for( var i=0; i<monsters.length; i++)
	{
		var mon=monsters[i];
		if( mon.dead)
			continue;
		if( mon.x!=mon.tx || mon.y!=mon.ty)
		{
			var dx = mon.tx-mon.x,
				dy = mon.ty-mon.y;
			mon.x = mon.x+round(dx/20);
			mon.y = mon.y+round(dy/20);
		}
		else
		{
			if( Math.random()<0.1)
			{
				mon.go();
			}
		}
		if( mon.can_shoot && monster_bullet.face==0)
		{
			if( Math.random()<0.2)
			{
				monster_bullet.x = mon.x;
				monster_bullet.y = mon.y;
				monster_bullet.face = mon.face;
			}
		}
	}
	function round(x)
	{
		if( x==0)
			return 0;
		else if( Math.abs(x)<=1)
			return x>0?1:-1;
		else
			return Math.round(x);
	}
}

function createElement(append_to,tag,attr,attrNS)
{
    var ele = svgdoc.createElementNS("http://www.w3.org/2000/svg", tag);
    append_to.appendChild(ele);
    for( var i in attr)
		ele.setAttribute(i,attr[i]);
    for( var i in attrNS)
		ele.setAttributeNS(attrNS[i][0],attrNS[i][1],attrNS[i][2]);
	return ele;
}

function setAttr(ele,attr)
{
    for( var i in attr)
		ele.setAttribute(i,attr[i]);
}

function shootBullet() {
	var x = player.position.x,
		y = player.position.y,
		face = player.face;
    // Create the bullet by createing a use node
    var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");

    // Calculate and set the position of the bullet
    bullet.setAttribute("x", x+PLAYER_SIZE.h/2*face);
    bullet.setAttribute("y", y);
    
    // Set the href of the use node to the bullet defined in the defs node
    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
    bullet.setAttribute("face",face);
    
    // Append the bullet to the bullet group
    svgdoc.getElementById("bullets").appendChild(bullet);
}

function moveBullets() {
    // Go through all bullets
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);

        // Update the position of the bullet
        var dir = parseInt(node.getAttribute("face"));
        node.setAttribute("x", parseInt(node.getAttribute("x"))+BULLET_SPEED*dir);

        // If the bullet is not inside the screen delete it from the group
        if ( parseInt(node.getAttribute("x")) > 700 || parseInt(node.getAttribute("x")) < -100 || parseInt(node.getAttribute("y")) > 600 || parseInt(node.getAttribute("y")) <-100 )
            bullets.removeChild(node);
    }
    monster_bullet.x += BULLET_SPEED*monster_bullet.face;
    if( monster_bullet.x>700 || monster_bullet.x<-100)
		monster_bullet.face = 0;
}

function collisionDetection() {
    // Check whether the player collides with a monster
    for (var i = 0; i < monsters.length; i++) {
        var monster = monsters[i];
        if( monster.dead)
			continue;

        // For each monster check if it overlaps with the player
        // if yes, stop the game
        if( !cheatmode)
            if (intersect(player.position, PLAYER_SIZE, monster, MONSTER_SIZE)) hit_player();

        // Check whether a bullet hits a monster
        var bullets = svgdoc.getElementById("bullets");
        for (var j = 0; j < bullets.childNodes.length; j++) {
            var bullet = bullets.childNodes.item(j);

            // For each bullet check if it overlaps with any monster
            // if yes, remove both the monster and the bullet
            var bulletPos = new Point(parseInt(bullet.getAttribute("x")),parseInt(bullet.getAttribute("y")));
            if (intersect(bulletPos, BULLET_SIZE, monster, MONSTER_SIZE)){ 
                bullets.removeChild(bullet);
                svgdoc.getElementById("monsters").removeChild(monster.ele);
                monster.dead=true;
                score+=10*(zoom==2?3:1);
				playsound('die_sound');
            }
        }
    }
    // check player collides monster's bullet
    if (!cheatmode)
    if (intersect(player.position, PLAYER_SIZE, monster_bullet, BULLET_SIZE)) hit_player();
    
    // collect goodthings
    var goodthings = svgdoc.getElementById("goodthings");
    for (var i = 0; i < goodthings.childNodes.length; i++) {
        var node = goodthings.childNodes.item(i);
		var good = get_xy(node);
		if (intersect(player.position, PLAYER_SIZE, good, GOODTHING_SIZE))
		{
			goodthings.removeChild(node);
			score+=5*(zoom);
		}
	}
}

function hit_player()
{
	if( hit_rest<=0)
	{
		health--;
		hit_rest = 10;
		svgdoc.getElementById("health").firstChild.data = health;
		if( health<=0)
			gameover();
		else
			playsound('r_sound');
	}
}

function nextlevel()
{
	level++;
	clearchild("monsters");
	clearchild("bullets");
	clearchild("goodthings");
	create_things();
    player = new Player();
	health = 5;
	bullet_left = 4+level*2;
	score+= level*100 + remaining_time*zoom;
	svgdoc.getElementById("level").firstChild.data = level;
	svgdoc.getElementById("health").firstChild.data = health;
	svgdoc.getElementById("bullet_left").firstChild.data = bullet_left;
	remaining_time = 60;
	playsound('verygood_sound');
}

function clearchild(id)
{
	var myNode = svgdoc.getElementById(id);
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
}

function gameover(){
	playsound('lose_sound');
	clearchild("highscoretext");
     var table = getHighScoreTable();
     var record = new ScoreRecord(name, score);
     var added = false;
     for (var i = 0; i < 10; i++){
         if (i >= table.length) break;
         if (score > table[i].score){
             table.splice(i, 0, record);
             added = true;
             break;
         }
     }
     if (added==false) table.push(record);
     setHighScoreTable(table);
     showHighScoreTable(table);
     gamestarted = false;
}

function start_again()
{
	svgdoc.getElementById("highscoretable").style.setProperty("visibility", "hidden");
	gamestarted = false;
	name=prompt("Please enter your name", name);
    if( name=="") name="Anonymous";
    svgdoc.getElementById("player_name").innerHTML=name;
    gamestart();
}
