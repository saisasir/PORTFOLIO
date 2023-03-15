/**
* Template Name: MyResume - v4.8.1
* Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  document.addEventListener("contextmenu", function(e){
    if (e.target.nodeName === "IMG") {
        e.preventDefault();
    }
  }, false);

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)
  
  /**
   * Page corner flip effect
   */
  const flipcorner = () => {
    let pagecorner = select('.page-corner-up');
    console.log("class list: ", pagecorner.classList)
    if (pagecorner.classList.contains("page-corner-down")) {
      pagecorner.classList.remove("page-corner-down");
      // setTimeout(function(){pagecorner.classList.add("page-corner-down");}, 800)
      
    }
    else pagecorner.classList.add("page-corner-down");
  }
  window.addEventListener('load', flipcorner);


  /**
   * Customize color of page
   */

  function rgbtohex(rgb_input) {
    //ex. input: rgb(100, 100, 100) -> output: [100,100,100]
    let rgb_vals = rgb_input.slice(4, -1);
    let rgb_nospace = rgb_vals.replace(/ /g, "");
    let separated = rgb_nospace.split(",");

    var r, g, b;
    r = parseInt(separated[0]);
    g = parseInt(separated[1]);
    b = parseInt(separated[2]);

    //for converting each component value
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    //joins components together
    function makeHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    return makeHex(r, g, b);
    
  }

  //uses hex values, returns new color
  function LightenDarkenColor(col, amt) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}
  

  let colorPicker = select('.color-picker');
  if (colorPicker) {

    //for each color button, reads its color and sets it as document color
    on('click', '.color-picker button', function(e) {
      var selectColorRGB = $(this).css("background-color");
      var selectColorhex = rgbtohex(selectColorRGB);
      var darkerColor = LightenDarkenColor(selectColorhex, -50);
      var lighterColor = LightenDarkenColor(selectColorhex,70)

      let pagecorner = select('.page-corner-up');
      pagecorner.classList.remove("page-corner-down");
      
      if (document.activeElement != this) {
        this.focus();
      };

      setTimeout(function(){
        pagecorner.classList.add("page-corner-down"); 
        $(document.documentElement).css("--lighter-color", lighterColor);
        $(document.documentElement).css("--main-color", selectColorhex);
        $(document.documentElement).css("--accent-color", darkerColor);}, 850)

    }, true)


  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Expanding images
   */
  let expandables = select('.expandable', true);
  if (expandables) {

    expandables.forEach(expandable => {
      if (!(expandable.offsetWidth > window.innerWidth*.8)) {
        expandable.classList.add("zoomable");
        expandable.addEventListener("click", () => 
        {
          expandable.classList.toggle("enlarge");
        }
        );
      }
    })
  }
  
  /**
   * For expanding images that are in a bootstrap grid
   */
  let gridexpandables = select('.grid-expandable', true);
  if (gridexpandables) {
    
    gridexpandables.forEach(expandable => {
      if (!(expandable.offsetWidth > window.innerWidth*.7)) {
        expandable.classList.add("zoomable");
        var toggler = ""
        if (expandable.classList[0].startsWith('col-12')) {
          expandable.classList.forEach(item => {
            if (item.startsWith('col-xl-')) {
              toggler = item   
            }
          }
          )
        }
        else {toggler='col-12'}
        console.log('toggler: ', toggler)

        expandable.addEventListener("click", () => {
          expandable.classList.toggle(toggler)
          console.log(expandable.classList)

        }
        

      
      
      );
    }
    })
  }



  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    let projectGrid = select('.project-grid');

    if (portfolioContainer) {

      // if (projectGrid) {
      //   let testIsotope = new Isotope(projectGrid, {
      //     itemSelector: '.grid-item',
      //     percentPosition: true,
      //     masonry: {
      //       // use outer width of grid-sizer for columnWidth
      //       columnWidth: '.grid-sizer',
      //       gutter: '.gutter-sizer'
      //     }
      //   })
      // }

      let projects = select('.portfolio-wrap', true);
      projects.forEach(function(e) {

      })

      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()