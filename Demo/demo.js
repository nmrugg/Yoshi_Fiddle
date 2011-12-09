/*jslint devel: true, regexp: true, browser: true, confusion: true, continue: true, sloppy: true, white: true, forin: true, indent: 4 */

/*properties
    appendChild, background, backgroundPosition, body, clearInterval, 
    createElement, cursor, event, height, keyCode, left, move, onclick, 
    onkeydown, onkeypress, onkeyup, onload, position, random, 
    relinquish_control, round, setInterval, setTimeout, shiftKey, style, 
    take_control, top, visibility, which, width, zIndex
*/


window.onload = function() {
    /// This first function is run immediately to create the other function that is stored in Yoshi_maker.
    var Yoshi_maker = (function ()
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
                pos_y = Math.floor(Math.random() * 140),
                standing = false,
                this_obj;
            
            el.style.visibility = "hidden";
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
                /// Prevent this function from being run over and over again when a Yoshi stands around.
                if (standing) {
                    return;
                }
                frame = 0;
                el.style.left = pos_x;
                el.style.top  = pos_y;
                set_frame();
                standing = true;
            }
            
            /**
             * Move the Yoshi
             *
             * @param horizontal (int) Whether the Yoshi is moving right or left (-1 = left, 0 = neither, 1 = right)
             * @param vertical   (int) Whether the Yoshi is moving up or down (-1 = up, 0 = neither, 1 = down)
             * @param Running    (int) Whether the Yoshi is running or not (1 = running, 0 = walking)
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
                
                /// Is it not moving?
                if (horizontal === 0 && vertical === 0) {
                    stand();
                    window.setTimeout(function () {
                        moving = false;
                    }, 30);
                    return;
                }
                
                standing = false;
                
                facing = horizontal || facing;
                
                frame += 1;
                pos_x += speed * horizontal;
                pos_y += speed * vertical;
                if (pos_y < 0) {
                    pos_y = 0;
                }
                el.style.left = pos_x;
                el.style.top  = pos_y;
                ///NOTE: zIndex can't be negative.
                if (pos_y >= 0) {
                    /// This makes Yoshis that are "farther away" look like they are behind "closer" Yoshis.
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
            
            /// Put him somewhere.
            stand();
            /// Start the Yoshi moving.
            start_ai();
            /// Now that he is all ready, make him visible and put him on the page.
            document.body.appendChild(el);
            el.style.visibility = "visible";
            
            /// This is the object that will be returned by the function to let the other functions outside of the closure interact with the Yoshi.
            this_obj = {
                take_control: function () {
                    ai = false;
                    stand();
                },
                relinquish_control: function () {
                    start_ai();
                },
                move: move
            };
            
            el.onclick = function (e) {
                /// This function will be added later by other code below.
                if (typeof this_obj.onclick === "function") {
                    this_obj.onclick(e);
                }
            };
            
            return this_obj;
        };
    }());
    
    /// The Yoshi_maker() cannot see or manipulate these variables.
    (function () {
        var current_id = false,
            keys_down = {},
            horizontal = 0,
            vertical   = 0,
            running    = 0,
            
            i,
            starting_yoshi_count = 20,
            Yoshis = [];
        
        /// This is the function moves the user's Yoshi. It keeps on looping.
        /// If the user has not selected a Yoshi or is not pressing any keys, nothing much happens.
        window.setInterval(function () {
            if (current_id !== false) {
                Yoshis[current_id].move(horizontal, vertical, running);
            }
        }, 30);
        
        function create_onclick_function(id) {
            return function () {
                /// Did the user click on the same Yoshi?
                if (id === current_id) {
                    return;
                }
                
                /// If the user already clicked on a Yoshi, make that one wander again.
                if (current_id !== false) {
                    Yoshis[current_id].relinquish_control();
                }
                
                current_id = id;
                Yoshis[id].take_control();
            };
        }
        
        function calculate_direction() {
            var key,
                tmp_horizontal = 0,
                tmp_vertical   = 0,
                tmp_running    = 0;
            
            for (key in keys_down) {
                key = Number(key);
                if        (key === 39 && keys_down[key]) { /// Right
                    tmp_horizontal += 1;
                } else if (key === 37 && keys_down[key]) { /// Left
                    tmp_horizontal -= 1;
                } else if (key === 38 && keys_down[key]) { /// Up
                    tmp_vertical -= 1;
                } else if (key === 40 && keys_down[key]) { /// Down
                    tmp_vertical += 1;
                } else if (key === 32 && keys_down[key]) { /// Space bar
                    tmp_running = 1;
                }
            }
            
            horizontal = tmp_horizontal;
            vertical = tmp_vertical;
            running = tmp_running;
        }
        
        function keypressed(e) {
            var cur_key;
            
            /// window.event is for IE.
            e = e || window.event;
            cur_key = e.keyCode || e.which;
            
            /// Only track the arrow keys and the space bar.
            if (cur_key === 32 || (cur_key >= 37 && cur_key <= 40)) {
                keys_down[cur_key] = 1;
                calculate_direction();
            }
            
            /// Was the plus sign (+) pressed?
            ///NOTE: For Firefox, the plus sign = 43, for Chrome 187(?!?)
            if (e.shiftKey && (cur_key === 43 || cur_key === 187)) {
                /// Make me more Yoshis!
                Yoshis[Yoshis.length] = new Yoshi_maker();
                ///NOTE: Because this creates a function, it can't be in a loop (Crockford told me so (strange things happen in loops)).
                Yoshis[Yoshis.length - 1].onclick = create_onclick_function(Yoshis.length - 1);
            }
            /// Prevent Firefox from scrolling when an arrow key is pressed.
            return false;
        }
        
        /// Firefox (maybe IE)
        window.onkeypress = keypressed;
        /// Chrome (maybe Opera)
        window.onkeydown  = keypressed;
        window.onkeyup    = function (e) {
            var cur_key;
            e = e || window.event;
            cur_key = e.keyCode || e.which;
            
            /// Only track the arrow keys and the space bar.
            if (cur_key === 32 || (cur_key >= 37 && cur_key <= 40)) {
                keys_down[cur_key] = 0;
                calculate_direction();
            }
        };
        
        /// Create me Yoshis!
        for (i = 0; i < starting_yoshi_count; i += 1) {
            Yoshis[i] = new Yoshi_maker();
            ///NOTE: Because this function creates a function, it can't be in a loop (Crockford told me so (Strange things happen in loops. Beware.)).
            Yoshis[i].onclick = create_onclick_function(i);
        }
    }());

};
