/*jslint devel: true, regexp: true, browser: true, confusion: true, continue: true, sloppy: true, white: true, maxerr: 50, indent: 4 */

/*global $ */

/*properties
    append, cancelBubble, characterSpeed, css, currentPosition, doAnimation, 
    hide, id, isAnimationRunning, isCharacterMovingLeft, 
    isCharacterMovingRight, keyCode, keydown, keypress, keyup, left, log, 
    mousedown, moveCharacter, movingLeftIntervalID, movingRightIntervalID, 
    offset, preventDefault, random, ready, returnValue, spriteHeight, 
    startAnimation, stopAnimation, stopPropagation, toggleAnimation, top, 
    yoshiKeyDownLeft, yoshiKeyDownRight, yoshiKeyUpLeft, yoshiKeyUpRight, 
    yoshiSprite
*/


$(document).ready(function() {
    var Yoshi_maker;
    /// Prevent Firefox from scrolling when an arrow key is pressed.
    window.keypress = function() {
        return false;
    };
    
    
    /// This first function is run immediately to create the other function that is stored in Yoshi_maker.
    Yoshi_maker = (function ()
    {
        /// Private variables created once that only Yoshi_maker() can see.
        var speed = 5,
            sprite_size = 64;
        
        return function () {
            /// These variables are created each time a Yoshi is made and only that Yoshi object can see them (so they never clash with other Yoshis).
                
            var ai = true,
                el = document.createElement("div"),
                /// facing is either -1 for left or 1 for right
                facing = Math.round(Math.random()) || -1,
                frame = 0,
                moving = false,
                /// Create a random starting point
                pos_x = Math.floor(Math.random() * 500),
                pos_y = Math.floor(Math.random() * 140);
            
            el.style.background = "url(http://i53.tinypic.com/bdwhat.gif)";
            el.style.position = "absolute";
            el.style.width  = sprite_size + "px";
            el.style.height = sprite_size + "px";
            
            function set_frame() {
                if (frame > 7) {
                    frame = 0;
                }
                
                el.style.backgroundPosition = (sprite_size * (facing === 1)) + "px " + (sprite_size * frame) + "px";
            }
            
            function stand() {
                frame = 0;
                el.style.left = pos_x;
                el.style.top  = pos_y;
                set_frame();
            }
            
            /**
             * Move the Yoshi
             *
             * @param horizontal (int) Whether the Yoshi is moving right or left (-1 = left, 0 = neither, 1 = right)
             * @param vertical   (int) Whether the Yoshi is moving up or down (-1 = up, 0 = neither, 1 = down)
             */
            function move(horizontal, vertical, running) {
                if (moving) {
                    return;
                }
                /// Make sure that the variables are numbers because they will be used in equations.
                horizontal = Number(horizontal);
                vertical   = Number(vertical);
                
                /// AI might do this.
                if (horizontal === 0 && vertical === 0) {
                    stand();
                    return;
                }
                
                facing = horizontal || facing;
                
                frame += 1;
                pos_x += speed * horizontal;
                pos_y += speed * vertical;
                el.style.left = pos_x;
                el.style.top  = pos_y;
                                
                set_frame();
                moving = true;
                
                window.setTimeout(function () {
                    moving = false;
                }, (running ? 30 : 100));
            }
            
            function start_ai() {
                var ai_horizontal = 0,
                    ai_vertical   = 0,
                    ai_running    = 0,
                    
                    ai_change_speed = Math.floor(Math.random() * 8) + 1,
                    ai_timer;
                
                ai = true;
                
                function change_hor() {
                    ai_horizontal = Math.floor(Math.random() * 3) - 1;
                    if (ai) {
                        window.setTimeout(change_hor, Math.floor(Math.random() * 700 * ai_change_speed) + (100 * ai_change_speed));
                    }
                }
                
                function change_vert() {
                    ai_vertical = Math.floor(Math.random() * 3) - 1;
                    if (ai) {
                        window.setTimeout(change_vert, Math.floor(Math.random() * 700 * ai_change_speed) + (100 * ai_change_speed));
                    }
                }
                
                function change_running() {
                    ai_running = Math.floor(Math.random() * 2);
                    if (ai) {
                        window.setTimeout(change_running, ai_running ? (Math.floor(Math.random() * 2000 * ai_change_speed) + (100 * ai_change_speed)) : (Math.floor(Math.random() * 50000 * ai_change_speed) + (6000 * ai_change_speed)));
                    }
                }
                
                change_hor();
                change_vert();
                change_running();
                
                ai_timer = window.setInterval(function () {
                    if (!ai) {
                        window.clearInterval(ai_timer1);
                    }
                    move(ai_horizontal, ai_vertical, ai_running);
                }, 30);
            }
            
            
            /// Start the Yoshi standing.
            stand();
            start_ai();
            /// Now that he is all ready, make him visible.
            document.body.appendChild(el);
            
            return {
                take_control: function () {
                    ai = false;
                    stand();
                },
                relinquish_control: function () {
                    start_ai();
                },
                move: move
            };
        };
    }());
    
    
    Yoshi_maker();
    
    return;
    /// Get the sprite image from what's currently set in css
    spriteImage = $("#yoshi").css("background-image").slice(4, -1);
    
    function selectYoshi(id) {
        //prevents a never clearing setInterval when you hold down an arrow key while clicking another yoshi
        if (selectedYoshi) {
            selectedYoshi.yoshiKeyUpLeft();
            selectedYoshi.yoshiKeyUpRight();
        }

        selectedYoshi = yoshiArr[id];
        console.log(selectedYoshi);
    }
    
    //Yoshi class
    function YoshiObj(creationID) {
        this.isCharacterMovingLeft  = false;
        this.isCharacterMovingRight = false;
        
        this.isAnimationRunning = false;
        
        this.movingLeftIntervalID  = 0;
        this.movingRightIntervalID = 0;
        
        this.spriteHeight   = 64;
        this.characterSpeed = 5;
        
        this.id = creationID;
        
        this.yoshiSprite = spriteImage;

        $("body").append("<div id=\"yoshi" + this.id + "\"></div>");
        $("#yoshi" + this.id).css("background", "url(" + this.yoshiSprite + ") 64px 64px");
        $("#yoshi" + this.id).css("width",  "64px");
        $("#yoshi" + this.id).css("height", "64px");
        $("#yoshi" + this.id).css("top",  Math.floor(Math.random() * 300) + "px");
        $("#yoshi" + this.id).css("left", Math.floor(Math.random() * 500) + "px");
        $("#yoshi" + this.id).css("position", "absolute");

        $("#yoshi" + this.id).mousedown(function() {
            selectYoshi(creationID);
        });
    }
    
    function moveCharacter(dx, dy) {
        //move yoshi
        
        this.currentPosition = $("#yoshi" + this.id).offset();

        $("#yoshi" + this.id).offset({
            top:  this.currentPosition.top + dy,
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
    
    function yoshiKeyUpLeft() {
        this.isCharacterMovingLeft = false;
        this.toggleAnimation();
        clearInterval(this.movingLeftIntervalID);
    }
    
    function yoshiKeyUpRight() {
        this.isCharacterMovingRight = false;
        this.toggleAnimation();
        clearInterval(this.movingRightIntervalID);
    }
    
    function yoshiKeyDownLeft() {
        this.isCharacterMovingLeft = true;
        this.toggleAnimation();
        this.movingLeftIntervalID = setInterval(function() {
            selectedYoshi.moveCharacter(-1, 0);
        }, this.characterSpeed);

    }
    
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
        creationID += 1;
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
        if (event.keyCode === 32) {

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
        event.returnValue  = false;
        return false;
    }
    
    //Animation functions
    function toggleAnimation() {
        if (this.isAnimationRunning) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    }

    function startAnimation() {
        this.isAnimationRunning = true;
        intervalID = setInterval(this.doAnimation, animationSpeed);
    }


    function stopAnimation() {
        this.isAnimationRunning = false;
        clearInterval(intervalID);
    }

    function doAnimation() {
        //PROBLEM: this.isCharacterMovingLeft === undefined for some reason. that ruins animation.
        currentFrame += 1;
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
    
    YoshiObj.prototype.moveCharacter     = moveCharacter;
    YoshiObj.prototype.toggleAnimation   = toggleAnimation;
    YoshiObj.prototype.yoshiKeyUpLeft    = yoshiKeyUpLeft;
    YoshiObj.prototype.yoshiKeyUpRight   = yoshiKeyUpRight;
    YoshiObj.prototype.yoshiKeyDownLeft  = yoshiKeyDownLeft;
    YoshiObj.prototype.yoshiKeyDownRight = yoshiKeyDownRight;
    YoshiObj.prototype.startAnimation    = startAnimation;
    YoshiObj.prototype.stopAnimation     = stopAnimation;
    YoshiObj.prototype.doAnimation       = doAnimation;
    
    // listen for keys
    $(window).keydown(handleKeydown);
    $(window).keyup(handleKeyup);
});
