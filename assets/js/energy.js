document.addEventListener("contextmenu", function(e){
    if (e.target.nodeName === "IMG") {
        e.preventDefault();
    }
  }, false);

/**
   * Animation on scroll
   */
window.addEventListener('load', () => {
    AOS.init({
      duration: 2000,
      delay: 100,
      easing: 'ease-in-out',
      once: false,
      mirror: false,
    })
  });

/* * 
   * Easy selector helper function
 * */
const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

const bg = select("body");
const page = select(".page");
const mouseglow = select(".mouse-glow");
const readout = select(".coords");

const acceleration = .0006; 
//standard seems to be .0004 but that was a little too slow imo. (px/ms^2)

const potential = select("#potential");
const kinetic = select("#kinetic");
const overall = select("#overall");
const testing = select("#testing")

// const page_height = window.innerHeight;
const page_height = page.clientHeight;

//control buttons
const controls = select(".controls-hidden")
const potButton = select("#potButton");
const kinButton = select("#kinButton");
const totalButton = select("#totalButton");
const restartButton = select("#restartButton");

let timer;

//percentage of page scrolled
var hScroll = 0;

window.addEventListener('scroll', () => {
    hScroll = window.pageXOffset / (document.body.offsetWidth - window.innerWidth);
    // hScroll = window.pageXOffset / (document.body.offsetWidth);
    var numScreens = $(document.documentElement).css("--num-screens");
    // var test = (hScroll - 11.7/numScreens + .0125) * 25;
    var test = (hScroll - .864) * 25;
    document.documentElement.style.setProperty("--scroll", test);
    // readout.innerText = `scroll: ${hScroll}`;
})

document.addEventListener("mousemove", (e) => {
    // clearTimeout(timer);
    mouseglow.style.setProperty("--x", e.clientX);
    mouseglow.style.setProperty("--y", e.clientY);
    // timer = setTimeout(turnOffGlow, 500);
});

function turnOnGlow(e) {
    e = e || window.event;
    if (mouseglow.classList.contains("hide-glow")) {
        mouseglow.classList.remove("hide-glow");
    }
    bg.style.cursor = "none";
}

function turnOffGlow(e) {
    e = e || window.event;
    mouseglow.classList.add("hide-glow");
    // if (getComputedStyle(bg).getPropertyValue('cursor') == 'none') {
    //     bg.style.cursor = "default";
    // }
    // else {
    //     bg.style.cursor = "none";
    // }
    
}

//disappear on scroll
function disappear() {
    $(this).children(".text").css("display", "none");
}

potentialDemo(potential);
kineticDemo(kinetic);
controlButtons(kinetic);

console.log(screen.width);
(function() {
    document.documentElement.style.setProperty("--device-width", screen.width + "px");
}());
console.log('d: ', $(document.documentElement).css("--device-width"));

/* * * * * * * * * * * * *
   * Helper Functions  *
 * * * * * * * * * * * * */

//block ball from being dragged below "ground" or above page
function blockDrag(e, elmnt) {
    e = e || window.event;
    var bottom_pos = getComputedStyle(elmnt).getPropertyValue('bottom');
    // if ball is tried to move below ground
    if (parseInt(bottom_pos) < 100) {
        document.onmousemove = null;
        elmnt.style.bottom = "102px";
    }

    // if ball is tried to move above page height
    else if (parseInt(bottom_pos) > (parseFloat(page_height)-100)) {
        document.onmousemove = null;
        elmnt.style.bottom = (parseFloat(page_height)-105) + "px";
    }

}

$(".demo").mouseenter(function() {
    $(this).children(".arrow").css("display", "none");
})

/* * *
    Visualizes potential energy as ball is dragged 
    vertically and height is varied
* * */
function potentialDemo(elmnt) {
    var instructions = elmnt.querySelector('.instructions');
    var cursor_x = 0, cursor_y = 0;
    var bottom_pos = 0, height = 0;
    var text = elmnt.previousElementSibling;

    elmnt.onmousedown = function(e){
        e = e || window.event;
        dragMouseDown(e);
        text.classList.remove("text");
        text.classList.add("expln");
        text.innerText = `The ball's aura visualizes the amount of gravitational potential energy it possesses. See how it changes with respect to height?`;
    }
    elmnt.onmouseenter = switchGlow;
    elmnt.onmouseleave = switchGlow;

    // this function switches the cursor glow to the energy level glow when cursor is on top of ball
    function switchGlow(e) {
        e = e || window.event;
        mouseglow.classList.toggle("potential-energy-level");
    }

    // when mouse is pressed down
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        cursor_x = e.clientX;
        cursor_y = e.clientY;       
        document.onmouseup = closeDragElement;

        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    // when mouse is pressed down + moving
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        // calculate the new cursor position:
        cursor_x = e.clientX;
        cursor_y = e.clientY;

        bottom_pos = getComputedStyle(elmnt).getPropertyValue('bottom');

        blockDrag(e, elmnt);

        height = parseFloat(bottom_pos)-100;
        var diameter = 0.5 * parseFloat(height);

        if (parseInt(bottom_pos) >= 100 & parseInt(bottom_pos) < (parseFloat(page_height)-100)) {
            mouseglow.style.setProperty("--diameter", diameter);
            instructions.innerText = `height: ${height} pixels (px)`;
            // set the element's new position:
            elmnt.style.bottom = (page_height-50-cursor_y) + "px";
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }      
}    

/* * *
    Visualizes kinetic energy as ball is "dropped" 
    and speed is varied
* * */
function kineticDemo(elmnt) {
    var instructions = elmnt.querySelector('.instructions');
    var energy_level = elmnt.querySelector('.energy-level-hidden');
    var init_h = 600;
    var drop_t = (3750 * (init_h-100)) ** (1/2);
    var init_diameter = 0.5 * (init_h-100);
    var text = elmnt.parentElement.previousElementSibling;
    var textChanged = false;

    //kind of a shortcut since 
    document.documentElement.style.setProperty("--start-height", init_h + "px");
    document.documentElement.style.setProperty("--drop-time", drop_t + "ms");
    document.documentElement.style.setProperty("--init-diameter", init_diameter);

    elmnt.onclick = function(e) {
        e = e || window.event;
        kinButton.focus({focusVisible: true, preventScroll: true});
    }

    elmnt.onmousedown = function(e) {
        e = e || window.event;
        dropBall(e);
        text.classList.remove("text");
        text.classList.add("expln");
        text.innerText = `See how kinetic energy changes with respect to speed?`;
    }
    
    elmnt.onmouseenter = switchGlow;
    elmnt.onmouseleave = switchGlow;
    
    // this function switches the cursor glow to the energy level glow when cursor is on top of ball
    function switchGlow(e) {
        e = e || window.event;
        mouseglow.classList.toggle("hide-glow");
    }

    function dropBall(e) {
        e = e || window.event;
        elmnt.classList.toggle("kinetic-active");
        energy_level.classList.toggle("kinetic-energy-level");
        instructions.classList.add("speed");

        setInterval(changeText, 100);
        

        function changeText() {

            var bot_pos = parseFloat(getComputedStyle(elmnt).getPropertyValue('bottom'));
            var delta_h = init_h-bot_pos;
            var speed_long = (2*acceleration*delta_h) ** (1/2);
            speed = (speed_long).toFixed(2);
            instructions.innerText = `speed: ~ ${speed} px/ms`; 
        }

    }
}

/* * *
    potential and kinetic
* * */

function controlButtons(elmnt) {
    var energy = elmnt.querySelector('.energy-level-hidden');
    var bottomPos = 0, height = 0, diameter = 0;
    var initBottom = $("#kinetic").css("bottom"), initHeight = parseFloat(initBottom)-100;
    var greenValue = 0, blueValue = 0;
    var instructions = elmnt.querySelector('.instructions');
    var text = elmnt.parentElement.previousElementSibling;

    potButton.onmousedown = function(e) {
        e = e || window.event;
        potButton.focus();
        energy.setAttribute("class", ""); //clears other classes, e.g. button-kinetic
        energy.classList.add("button-potential");
        $(".button-potential").css("--g", 255);
        $(".button-potential").css("--b", 0);
        potential = setInterval(potentialMode, 10);
    }

    kinButton.onmousedown = function(e) {
        e = e || window.event;
        kinButton.focus();
        energy.setAttribute("class", "");
        energy.classList.add("button-kinetic");
        $(".button-kinetic").css("--g", 0);
        $(".button-kinetic").css("--b", 255);
        kinetic = setInterval(kineticMode, 10);
    }

    totalButton.onmousedown = function(e) {
        e = e || window.event;
        totalButton.focus();
        energy.setAttribute("class", "");
        diameter = 0.5 * initHeight;
        energy.classList.add("energy-level");
        $(".energy-level").css("--d", diameter);
        total = setInterval(totalMode, 10);
    }

    function kineticMode() {
        bottomPos = $("#kinetic").css("bottom");
        height = parseFloat(bottomPos)-100;
        diameter = 0.5 * (500-height);
        $(".button-kinetic").css("--d", diameter);
        // document.documentElement.style.setProperty("--g", green);
        // document.documentElement.style.setProperty("--b", green);
    }

    function potentialMode() {
        bottomPos = $("#kinetic").css("bottom");
        height = parseFloat(bottomPos)-100;
        diameter = 0.5 * height;
        $(".button-potential").css("--d", diameter);
    }

    function totalMode() {
        bottomPos = $("#kinetic").css("bottom");
        height = parseFloat(bottomPos)-100;
        greenValue = (height/initHeight)*255;
        blueValue = 255 - greenValue;
        $(".energy-level").css("--g", greenValue);
        $(".energy-level").css("--b", blueValue);
    }
}


