$(document).ready(function() {
    //to hide the (necessary) original <img> yoshi
    $("#yoshi").hide();
    
    //declare some initial variables
    var currentFrame = 0;
    var intervalID = 0;
    var animationSpeed = 66;
    
    var selectedYoshi = 0;
    var creationID = 0;
    var yoshiArr = [0];
    
    // listen for keys
    $(window).keydown(handleKeydown);
    $(window).keyup(handleKeyup);
    
    //hide scrollbar in chrome
    $("body").css("overflow", "hidden");
    // Prevent Firefox from scrolling when an arrow key is pressed.
    $(window).keypress(function() {
        return false;
    });

    //get the sprite image from what's currently set in css
    spriteImage = $("#yoshi").css("background-image").substr(4);
    spriteImage = spriteImage.substr(0, spriteImage.length - 1);
    
    //Yoshi class
    function YoshiObj(creationID) {

        this.isCharacterMovingLeft = false;
        this.isCharacterMovingRight = false;
        this.isAnimationRunning = false;
        this.movingLeftIntervalID = 0;
        this.movingRightIntervalID = 0;
        this.spriteHeight = 64;

        this.id = creationID;
        this.characterSpeed = 5;
        this.yoshiSprite = spriteImage;

        $("body").append("<div id=\"yoshi" + this.id + "\"></div>");
        $("#yoshi" + this.id).css("background", "url(" + this.yoshiSprite + ") 64px 64px");
        $("#yoshi" + this.id).css("width", "64px");
        $("#yoshi" + this.id).css("height", "64px");
        $("#yoshi" + this.id).css("top", Math.floor(Math.random() * 300) + "px");
        $("#yoshi" + this.id).css("left", Math.floor(Math.random() * 500) + "px");
        $("#yoshi" + this.id).css("position", "absolute");

        $("#yoshi" + this.id).mousedown(function() {
            selectYoshi(creationID);
        });
    }
    
    function selectYoshi(id) {

        //prevents a never clearing setInterval when you hold down an arrow key while clicking another yoshi
        if (selectedYoshi) {
            selectedYoshi.yoshiKeyUpLeft();
            selectedYoshi.yoshiKeyUpRight();
        }

        selectedYoshi = yoshiArr[id];
        console.log(selectedYoshi);
    }

    YoshiObj.prototype.moveCharacter = moveCharacter;

    function moveCharacter(dx, dy) {
        //move yoshi
        
        this.currentPosition = $("#yoshi" + this.id).offset();

        $("#yoshi" + this.id).offset({
            top: this.currentPosition.top + dy,
            left: this.currentPosition.left + dx
        });

        ///////////////////move background///////////////////
        //var currentPositionBG1 = $("#background1").offset();
        // var currentPositionBG2 = $("#background2").offset();
        // setInterval(doAnimation, animationSpeed);
                /* $("#background1").offset({
                    left: currentPositionBG1.left - dx
                });
                $("#background2").offset({
                    left: currentPositionBG2.left - dx
                });

                if (currentPositionBG1.left < -512) {

                    $("#background1").offset({
                        left: currentPositionBG1.left = 510
                    });
                } else if (currentPositionBG2.left < -512) {

                    $("#background2").offset({
                        left: currentPositionBG2.left = 510
                    });

                } else if (currentPositionBG1.left > 512) {

                    $("#background1").offset({
                        left: currentPositionBG1.left = -510
                    });
                } else if (currentPositionBG2.left > 512) {

                    $("#background2").offset({
                        left: currentPositionBG2.left = -510
                    });
                }
                console.log(currentPositionBG1.left);*/
    }

    YoshiObj.prototype.yoshiKeyUpLeft = yoshiKeyUpLeft;

    function yoshiKeyUpLeft() {

        this.isCharacterMovingLeft = false;
        this.toggleAnimation();
        clearInterval(this.movingLeftIntervalID);
    }

    YoshiObj.prototype.yoshiKeyUpRight = yoshiKeyUpRight;

    function yoshiKeyUpRight() {
        this.isCharacterMovingRight = false;
        this.toggleAnimation();
        clearInterval(this.movingRightIntervalID);
    }

    YoshiObj.prototype.yoshiKeyDownLeft = yoshiKeyDownLeft;

    function yoshiKeyDownLeft() {
        this.isCharacterMovingLeft = true;
        this.toggleAnimation();
        this.movingLeftIntervalID = setInterval(function() {
            selectedYoshi.moveCharacter(-1, 0);
        }, this.characterSpeed);

    }

    YoshiObj.prototype.yoshiKeyDownRight = yoshiKeyDownRight;

    function yoshiKeyDownRight() {

        this.isCharacterMovingRight = true;
        this.toggleAnimation();
        this.movingRightIntervalID = setInterval(function() {
            selectedYoshi.moveCharacter(1, 0);
        }, this.characterSpeed);
    }

    //yoshi object creation
    function createYoshi() {
        yoshiArr[creationID] = new YoshiObj(creationID);
        ++creationID;
    }
    
    // handle key up
    function handleKeyup(event) {
        // console.log(event.keyCode);
        if (event.keyCode === 37) {
            // Left
            selectedYoshi.yoshiKeyUpLeft();
        } else if (event.keyCode === 39) {
            // Right
            selectedYoshi.yoshiKeyUpRight();
        }
    }

    // handle key down
    function handleKeydown(event) {

        //console.log(event.keyCode);
        // on space, create a yoshi object and put it in an array;
        if (event.keyCode == 32) {

            createYoshi();

        } else if (event.keyCode === 39) {
            // right arrow is pressed, move right
            // checks to see if the character is already moving right. So we don't end up creating multiple intervals
            if (selectedYoshi.isCharacterMovingRight === false) {

                selectedYoshi.yoshiKeyDownRight();
            }
        }
        else if (event.keyCode === 37) {
            // left arrow is pressed, move left
            // checks to see if the character is already moving left. So we don't end up creating multiple intervals
            if (selectedYoshi.isCharacterMovingLeft === false) {

                selectedYoshi.yoshiKeyDownLeft();
            }
        }

        // Prevent scrolling when an arrow key is pressed.
        if (event.stopPropagation) {
            event.stopPropagation();
            event.preventDefault();
        }
        event.cancelBubble = true;
        event.returnValue = false;
        return false;
    }
    
    //Animation functions

    YoshiObj.prototype.toggleAnimation = toggleAnimation;

    function toggleAnimation() {

        if (this.isAnimationRunning) {
            this.stopAnimation();
        } else {

            this.startAnimation();
        }
    }

    YoshiObj.prototype.startAnimation = startAnimation;

    function startAnimation() {

        this.isAnimationRunning = true;
        intervalID = setInterval(this.doAnimation, animationSpeed);
    }

    YoshiObj.prototype.stopAnimation = stopAnimation;

    function stopAnimation() {

        this.isAnimationRunning = false;
        clearInterval(intervalID);
    }
    YoshiObj.prototype.doAnimation = doAnimation;

    function doAnimation() {

        //PROBLEM: this.isCharacterMovingLeft === undefined for some reason. that ruins animation.
    
        currentFrame++;
        if (currentFrame > 7) {
            currentFrame = 0;
        }
        if (this.isCharacterMovingLeft) {
            $("#yoshi" + this.id).css("background", "url(" + this.yoshiSprite + ") 0 " + (currentFrame * this.spriteHeight) + "px");
        }
        if (this.isCharacterMovingRight) {
            $("#yoshi" + this.id).css("background", "url(" + this.yoshiSprite + ") 64px " + (currentFrame * this.spriteHeight) + "px");
        }
    }
});