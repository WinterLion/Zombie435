
// find and replace qmcRunner with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()

function qmcRunner(game) {
    this.player = 1;
    this.radius = 10;
    this.rocks = 0;
    this.kills = 0;
    this.name = "Quinn Runner";
    this.color = "Blue";
    this.cooldown = 0;
	this.corners = [{x:0, y:0}, {x:800, y:0}, {x:0, y:800}, {x:800, y:800}]
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: 0, y: 0 };
};

qmcRunner.prototype = new Entity();
qmcRunner.prototype.constructor = qmcRunner;

// alter the code in this function to create your agent
// you may check the state but do not change the state of these variables:
//    this.rocks
//    this.cooldown
//    this.x
//    this.y
//    this.velocity
//    this.game and any of its properties

// you may access a list of zombies from this.game.zombies
// you may access a list of rocks from this.game.rocks
// you may access a list of players from this.game.players

qmcRunner.prototype.selectAction = function () {

    var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
    var acceleration = 1000000;
    var closest = 1000;
    var targetZombie = null;
    this.visualRadius = 100;

    for (var i = 0; i < this.game.zombies.length; i++) {
        var thisZombie = this.game.zombies[i];
        var dist = distance(thisZombie, this);
        if (dist < closest) { //dist < 100
            closest = dist;
            targetZombie = thisZombie;
        }
        if (this.collide({x: thisZombie.x, y: thisZombie.y, radius: this.visualRadius})) {
            var difX = (thisZombie.x - this.x) / dist;
            var difY = (thisZombie.y - this.y) / dist;
            action.direction.x -= difX * acceleration / (dist * dist);
            action.direction.y -= difY * acceleration / (dist * dist);
        }
    }
    for (var i = 0; i < this.game.rocks.length; i++) {
        var thisRock = this.game.rocks[i];//this.rocks < 2
        if (!thisRock.removeFromWorld && !thisRock.thrown && this.rocks < 3 && this.collide({ x: thisRock.x, y: thisRock.y, radius: this.visualRadius })) {
            var dist = distance(this, thisRock);
            if (dist > this.radius + thisRock.radius) {
                var difX = (thisRock.x - this.x) / dist;
                var difY = (thisRock.y - this.y) / dist;
                action.direction.x += difX * acceleration / (dist * dist);
                action.direction.y += difY * acceleration / (dist * dist);
            }
        }
    }
	
	for (var i = 0; i < 4; i++) {
        if (this.collide({ x: this.corners[i].x, y: this.corners[i].y, radius: this.visualRadius })) {
            var dist = distance(this, this.corners[i]);
            var difX = (this.corners[i].x - this.x) / dist;
            var difY = (this.corners[i].y - this.y) / dist;
            action.direction.x -= difX * acceleration / (dist * dist);
            action.direction.y -= difY * acceleration / (dist * dist);
        }
    }

	//calculate where the zombie will be
    if (targetZombie && !targetZombie.removeFromWorld && 0 === this.cooldown && this.rocks > 0) {
        var zx = targetZombie.x
		var zy = targetZombie.y
		var zvx = targetZombie.velocity.x
		var zvy = targetZombie.velocity.y
		
		//console.log(" zx: " + zx + " zy: " + zy + " zvx: " + zvx + " zvy: " + zvy)
		
		var speed = Math.sqrt(targetZombie.velocity.x * targetZombie.velocity.x + targetZombie.velocity.y * targetZombie.velocity.y);
		// if (speed > targetZombie.maxSpeed) {
			// var ratio = targetZombie.maxSpeed / speed;
			// targetZombie.velocity.x *= ratio;
			// targetZombie.velocity.y *= ratio;
		// }	
		//var direction = Math.atan(zx/zy)
		
		// var dx = a.x - b.x;
		// var dy = a.y - b.y;
		// var dist = Math.sqrt(dx * dx + dy * dy);
		// if(dist > 0) return { x: dx / dist, y: dy / dist }; else return {x:0,y:0};
		
		//console.log(" speed: " + speed)
		
		var ZombieGoal = {x:zvx, y:zvy}; 
		
		var dir = direction(targetZombie, ZombieGoal);
		//console.log(" dir: " + dir.x + " " + dir.y)
		
		var willbeX = zx + dir.x
		var willbeY = zy + dir.y
		
		var ZombieWillBe = {x:willbeX, y:willbeY}; 
		
		action.target = ZombieWillBe;
        action.throwRock = true;
    }
	if (targetZombie)
	{
		
	}
	
    return action;
};

// do not change code beyond this point

qmcRunner.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

qmcRunner.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

qmcRunner.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

qmcRunner.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

qmcRunner.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

qmcRunner.prototype.update = function () {
    Entity.prototype.update.call(this);
    // console.log(this.velocity);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    this.action = this.selectAction();
    //if (this.cooldown > 0) console.log(this.action);
    this.velocity.x += this.action.direction.x;
    this.velocity.y += this.action.direction.y;

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            if (ent.name !== "Zombie" && ent.name !== "Rock") {
                var temp = { x: this.velocity.x, y: this.velocity.y };
                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
                var difX = (this.x - ent.x) / dist;
                var difY = (this.y - ent.y) / dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.velocity.x = ent.velocity.x * friction;
                this.velocity.y = ent.velocity.y * friction;
                ent.velocity.x = temp.x * friction;
                ent.velocity.y = temp.y * friction;
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                ent.x += ent.velocity.x * this.game.clockTick;
                ent.y += ent.velocity.y * this.game.clockTick;
            }
            if (ent.name === "Rock" && this.rocks < 2) {
                this.rocks++;
                ent.removeFromWorld = true;
            }
        }
    }
    

    if (this.cooldown === 0 && this.action.throwRock && this.rocks > 0) {
        this.cooldown = 1;
        this.rocks--;
        var target = this.action.target;
        var dir = direction(target, this);

        var rock = new Rock(this.game);
        rock.x = this.x + dir.x * (this.radius + rock.radius + 20);
        rock.y = this.y + dir.y * (this.radius + rock.radius + 20);
        rock.velocity.x = dir.x * rock.maxSpeed;
        rock.velocity.y = dir.y * rock.maxSpeed;
        rock.thrown = true;
        rock.thrower = this;
        this.game.addEntity(rock);
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

qmcRunner.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};