/*jslint devel: true, regexp: true, browser: true, confusion: true, continue: true, sloppy: true, white: true, maxerr: 50, indent: 4 */

/*properties
    appendChild, background, backgroundPosition, body, clearInterval, 
    createElement, cursor, height, keypress, left, move, onload, position, 
    random, relinquish_control, round, setInterval, setTimeout, style, 
    take_control, top, width, zIndex
*/


window.onload = function() {
    var i,
        starting_yoshi_count = 20,
        Yoshi_maker,
        Yoshis = [];
    
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
                
            var ai,
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
            el.style.cursor = "pointer";
            
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
                
                if (pos_y === 0 && vertical < 0) {
                    vertical = 0;
                }
                
                /// AI might do this.
                if (horizontal === 0 && vertical === 0) {
                    stand();
                    return;
                }
                
                facing = horizontal || facing;
                
                frame += 1;
                pos_x += speed * horizontal;
                pos_y += speed * vertical;
                if (pos_y < 0) {
                    pos_y = 0;
                }
                el.style.left = pos_x;
                el.style.top  = pos_y;
                ///NOTE: zIndex can't be negitive.
                if (pos_y >= 0) {
                    el.style.zIndex = pos_y;
                }
                                
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
                        window.clearInterval(ai_timer);
                    }
                    move(ai_horizontal, ai_vertical, ai_running);
                }, 30);
            }
            
            
            /// Start the Yoshi standing.
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
    
    
    for (i = 0; i < starting_yoshi_count; i += 1) {
        Yoshis[i] = new Yoshi_maker();
    }
};
