###

slider.coffee

An orbit-like slider, made primarily for the homepage of the Taxibeat Wordpress theme

###

slider =
    # array of image URLs
    slides: null
    
    # seconds takes to change image
    period: 10

    # image container
    container: null

    # title to be updated when a slide's changed
    header: null

    # sub text to title, expected to be slightly longer
    subHeader: null

    # current showing
    currentIndex: 0

    # there is no previous when starting
    previousIndex: -1

    # timeout handler
    timeout: -1

    # seconds passed
    timer: 0

    # current viewing item on pager list
    currentItem: {}

    # the progress element
    loader: null

    # pagination
    pager: null

    # debugger switch
    debug: false

    # swipe object
    swipe:
        start: 
            x: null 
            y: null 
        
        threshold: 50
        
        fast: false


    trace: (message) ->
        console.log "[home slider] " + message if @debug

    
    touchStart: (touchEvent) ->
        touch = touchEvent.changedTouches[0]
        @swipe.start.x = touch.pageX
        @swipe.start.y = touch.pageY
        @trace "touchstart triggered (" + touch.pageX + ", " + touch.pageY + ")"
        return
    
    
    touchMove: (touchEvent) ->
        # prevent possible scrolling
        touchEvent.preventDefault()
        return
    

    touchEnd: (touchEvent) ->
        touch = touchEvent.changedTouches[0]
        
        # clearup current state, otherwise things get utterly fucked
        @resetCurrent()

        # use x coord to determine swiping direction
        if touch.pageX - @swipe.start.x >= @swipe.threshold
            @showPrevious()
            @trace "touchend triggered (Previous Slide)"

        else if (touch.pageX - @swipe.start.x) <= (-1 * @swipe.threshold)
            @showNext()
            @trace "touchend triggered (Next Slide)"

        return
    

    setup: (config) ->
        throw "Pager is not set" if not config.pager
        throw "Header is not set" if not config.header
        
        @pager     = config.pager
        @container = config.container
        @header    = config.header
        @subHeader = config.subHeader
        
        if not @container.tagName.match /UL|OL/
            if @container.children[0].tagName.match /UL|OL/
                @container = @container.children[0]
            else 
                throw "Slide list cannot be found."
        
        @slides = @container.children
        
        slice = Array.prototype.slice.call @slides, 0

        self = @

        slice.forEach (slide, index) =>
            if index > 0
                slide.classList.add "off"

            if self.swipe.fast
                slide.classList.add "fast"

            slide.addEventListener "touchstart", self.touchStart.bind(self), false
            slide.addEventListener "touchmove", self.touchMove.bind(self), false
            slide.addEventListener "touchend", self.touchEnd.bind(self), false

        # show first slide
        @updateSlide()

        return @


    updateSlide: ->
        imageURL = @slides[@currentIndex].getAttribute "data-url"
        prevSlide = @container.querySelector ":nth-child(" + (@previousIndex + 1) + ")" 
        currentSlide = @container.querySelector ":nth-child(" + (@currentIndex + 1) + ")"
        
        @trace "previous slide: " + (@previousIndex + 1) + " -> " + "current slide: " + (@currentIndex + 1)
        
        currentSlide.style.backgroundImage = "url('" + imageURL + "')"
        
        if prevSlide
            prevSlide.className = "off" + (if @swipe.fast then " fast" else "")
        
        currentSlide.classList.add "on"

        self = @

        # update texts with a slight delay
        setTimeout ->
            self.header.innerHTML = self.slides[self.currentIndex].getAttribute "data-header"            
            if self.subHeader
                self.subHeader.innerHTML = self.slides[self.currentIndex].getAttribute "data-sub-header"
            return
        , 750

        return


    showPrevious: ->
        @previousIndex = @currentIndex
        @currentIndex -= 1
        
        if @currentIndex < 0
            @currentIndex = @slides.length - 1
            @previousIndex = 0
        
        @updateSlide()
        
        return @

    
    showNext: ->
        @previousIndex = @currentIndex
        @currentIndex += 1
        
        if @currentIndex >= @slides.length
            @currentIndex = 0
            @previousIndex = @slides.length - 1
        
        @updateSlide()
        
        return @


    resetCurrent: ->
        @timer = 0
        # clear previous loading session
        @currentItem.classList.remove "loading"
        @currentItem.querySelector("a").className = ""
        @currentItem.removeChild @loader
        @loader = null
        return

    
    change: ->
        @timer += 1
        @trace @timer + "s"
        try
            @getCurrentLoader()
            if @timer > @period
                @showNext()
                @resetCurrent()
        catch _22
            console.error _22
        @loop()

    
    getCurrentLoader: ->
        @currentItem = @pager.querySelector ":nth-child(" + (@currentIndex + 1) + ")"

        if not @currentItem.className.match "loading"
            @trace "slide " + (@currentIndex + 1)
            @currentItem.classList.add "loading"
            @currentItem.querySelector("a").className = "current"
            @loader = document.createElement "span"
            @loader.setAttribute "class", "loader"
            @currentItem.appendChild @loader
            self = @
            setTimeout -> 
                self.loader.classList.add "filling"
            , 50

        return @loader


    loop: ->
        self = @
        @timeout = setTimeout ->
            self.change.call self
        , 1000
    

    start: ->
        @loop()


    stop: ->
        return clearTimeout @timeout


# Export slider to global namespace, 
# either it is for Node.js or browser
root = exports ? this
root.slider = slider
