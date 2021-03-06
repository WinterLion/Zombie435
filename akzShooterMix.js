
// find and replace akz with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()

function akzShooterMix(game) {

    this.player = 1;
    this.radius = 10;
    this.rocks = 0;
    this.kills = 0;
    this.name = "Zombie Hunter Tony";
    this.color = "Gray";
    this.cooldown = 0;
    this.corners = [{x:0, y:0}, {x:800, y:0}, {x:0, y:800}, {x:800, y:800}]

    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: 0, y: 0 };

    this.angle = 1;

    var x, y;
    var radius = 400;
    var angle_stepsize = .1;

    // this.circleArray = new Array();
    // // go through all angles from 0 to 2 * PI radians
    // while (this.angle < 2 * Math.PI)
    // {
    //     // calculate x, y from a vector with known length and angle
    //     x = Math.floor(400 + radius * Math.cos(this.angle));
    //     y = Math.floor(400 + radius * Math.sin(this.angle));

    //     this.circleArray.push({x, y});
    //     this.angle += angle_stepsize;
    // }


    this.angle = 0;
};

akzShooterMix.prototype = new Entity();
akzShooterMix.prototype.constructor = akz;

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

akzShooterMix.prototype.selectAction = function () {

    if (this.game.zombies >= 10) {
    var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
    var acceleration = 1000000;
    var closest = 1000;
    var target = null;
    this.visualRadius = 200;
    var dist;
    var me = this;
    var x = 1000;
    var y = 1000 / 2;
    var length = 400;
    var angle_stepsize = .01;

//    go through all angles from 0 to 2 * PI radians

    if (x > 200 && y > 200) {

    }
    for (var i = 0; i < this.game.zombies.length; i++) {
        var ent = this.game.zombies[i];
        dist = distance(ent, this);
        if (dist < closest) {
            closest = dist;
            target = ent;
        }
        if (this.collide({x: ent.x, y: ent.y, radius: 150})) {
            var difX = (ent.x - this.x) / dist;
            var difY = (ent.y - this.y) / dist;
            action.direction.x -= difX * acceleration / (dist * dist);
            action.direction.y -= difY * acceleration / (dist * dist);
            // if (this.x >= 0 && this.x <= 200 && this.y >= 0 && this.y <= 200) {
            //     action.direction.x *= -action.direction.x * action.direction.x;
            // }
            // if (this.x >= 600 && this.x <= 800 && this.y >= 0 && this.y <= 200) {
            //     action.direction.x *= action.direction.x * action.direction.x;
            // }
            // if (this.x >= 0 && this.x <= 200 && this.y >= 0 && this.y <= 200) {
            //     action.direction.x *= -action.direction.x * action.direction.x;
            // }
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

    // var x = this.x;
    // var y = this.y;
//    if(this.circleArray.indexOf({x: Math.floor(x), y: Math.floor(y)})){// && this.angle < 2 * Math.PI)
    if(this.angle < 2 * Math.PI)
    {
    //     if (this.circleArray.length - 1 >= location) {
    //         location = -1; 
    //     }
    //     x = this.circleArray[location + 1].x;
    //     y = this.circleArray[location + 1].y;
    //     // calculate x, y from a vector with known length and angle
        action.direction.x += length * Math.cos(this.angle);
        action.direction.y += length * Math.sin(this.angle);

         this.angle += angle_stepsize;
    } else {
         this.angle = 0;
    }

//    console.log(action.direction);
    for (var i = 0; i < this.game.rocks.length; i++) {
        var ent = this.game.rocks[i];
        if (!ent.removeFromWorld && !ent.thrown && this.rocks < 2 && this.collide({ x: ent.x, y: ent.y, radius: 50 })) {
            var distRock = distance(this, ent);
            if ((distRock > this.radius + ent.radius) && dist >= 50) {
                var difX = (ent.x - this.x) / distRock;
                var difY = (ent.y - this.y) / distRock;
                action.direction.x += difX * acceleration / (distRock * distRock);
                action.direction.y += difY * acceleration / (distRock * distRock);
            }
        }
    }

    if ((target && this.rocks > 1 && dist <= 500) || dist <= 50) {
        action.target = target;
        action.throwRock = true;
    }
    return action;
}else {

    var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
    var acceleration = 1000000;
    var closest = 1000;
    var targetZombie = null;
    this.visualRadius = 500;

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
        action.target = this.calculateInterceptionPoint(targetZombie, targetZombie.velocity, this, this.game.rocks[0].maxSpeed);
        action.throwRock = true;
    }
    
    return action;
}
};

    /**
     * Calculates the point of interception for one object starting at point
     * <code>a</code> with speed vector <code>v</code> and another object
     * starting at point <code>b</code> with a speed of <code>s</code>.
     * 
     * @see <a
     *      href="http://jaran.de/goodbits/2011/07/17/calculating-an-intercept-course-to-a-target-with-constant-direction-and-velocity-in-a-2-dimensional-plane/">Calculating
     *      an intercept course to a target with constant direction and velocity
     *      (in a 2-dimensional plane)</a>
     * 
     * @param a
     *            start vector of the object to be intercepted
     * @param v
     *            speed vector of the object to be intercepted
     * @param b
     *            start vector of the intercepting object
     * @param s
     *            speed of the intercepting object
     * @return vector of interception or <code>null</code> if object cannot be
     *         intercepted or calculation fails
     * 
     * @author Jens Seiler
     */
    akzShooterMix.prototype.calculateInterceptionPoint = function(a, v, b, s) {
        var ox = a.x - b.x;
        var oy = a.y - b.y;
 
        var h1 = v.x * v.x + v.y * v.y - s * s;
        var h2 = ox * v.x + oy * v.y;
        var t;
        if (h1 == 0) { // problem collapses into a simple linear equation 
            t = -(ox * ox + oy * oy) / 2*h2;
        } else { // solve the quadratic equation
            var minusPHalf = -h2 / h1;
 
            var discriminant = minusPHalf * minusPHalf - (ox * ox + oy * oy) / h1; // term in brackets is h3
            if (discriminant < 0) { // no (real) solution then...
                return null;
            }
 
            var root = Math.sqrt(discriminant);
 
            var t1 = minusPHalf + root;
            var t2 = minusPHalf - root;
 
            var tMin = Math.min(t1, t2);
            var tMax = Math.max(t1, t2);
 
            t = tMin > 0 ? tMin : tMax; // get the smaller of the two times, unless it's negative
            if (t < 0) { // we don't want a solution in the past
                return null;
            }
        }
 
        // calculate the point of interception using the found intercept time and return it
        return answer = {x : (a.x + t * v.x), y : (a.y + t * v.y)};
    };

// do not change code beyond this point

akzShooterMix.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

akzShooterMix.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

akzShooterMix.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

akzShooterMix.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

akzShooterMix.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

akzShooterMix.prototype.update = function () {
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

akzShooterMix.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};