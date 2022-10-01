const bannerSliderModule = () => {
    const slideItems = document.querySelectorAll('[data-banner="item"]'); 
    const slider = document.querySelector('[data-banner="slider"]');
    
    const btnNext = document.querySelector('[data-banner="btn-next"]');
    const btnPrevious = document.querySelector('[data-banner="btn-previous"]');
    
    const btnConstrols = document.querySelectorAll('[data-banner="btn-control"]');
    
    const imgTitles = document.querySelectorAll('[data-banner="img-title"]');
    
    const state = {
        mouseDownPosition: 0,
        movementPosition: 0,
        lastTranslatePosition: 0,
        currentSliderPosition: 0,
        currentSlideIndex: 0
    }
    
    function translateSlide(position) {
        state.lastTranslatePosition = position;
        slider.style.transform = `translateX(${position}px)`;    
    }
    
    function getCenterPosition(index){
        const slide = slideItems[index];
        const margin = (document.body.clientWidth - slide.offsetWidth) / 2; 
        const centerPosition = margin - (slide.offsetWidth * index);
        return centerPosition;
    }
    
    function animateTransition(active){
        if(active){
            slider.style.transition = 'transform .3s';
        } else {
            slider.style.removeProperty('transition')
        }
    }
    
    function activeControlButton(index){
        btnConstrols.forEach(function(item){
            item.classList.remove('active');
        });
        const btnControl = btnConstrols[index];
        btnControl.classList.add('active');
    }
    
    function activeImageTitle(index){
        imgTitles.forEach(function(item){
            item.classList.remove('active');
        });
        const imgTitle = imgTitles[index];
        imgTitle.classList.add('active');
    }
    
    function activeCurrentSlides() {
        slideItems.forEach((slide, slideIndex) => {
            slide.classList.remove('active');
            if(slideIndex === state.currentSlideIndex) {
                slide.classList.add('active');
            }
        });
    }
    
    function setArrowButtonsDisplay(){
        btnPrevious.style.display = state.currentSlideIndex === 0 ? 'none' : 'block';
        btnNext.style.display = state.currentSlideIndex === (slideItems.length -1) ? 'none' : 'block'
    }
    
    function setVisibleSlide(index){
        state.currentSlideIndex = index;
        const position = getCenterPosition(index);
        activeCurrentSlides();
        setArrowButtonsDisplay();
        animateTransition(true);
        activeControlButton(index);
        activeImageTitle(index);
        translateSlide(position);
    }
    
    function forwardSlide(){
        if(state.currentSlideIndex < slideItems.length - 1){
            setVisibleSlide(state.currentSlideIndex + 1);
        } else {
            setVisibleSlide(state.currentSlideIndex);
        }
    }
    
    function backwardSlide(){
        if(state.currentSlideIndex > 0){
            setVisibleSlide(state.currentSlideIndex - 1);
        } else {
            setVisibleSlide(state.currentSlideIndex);
        }
    }
    
    function preventDefault(event){
        event.preventDefault();
    }
    
    function onControlButtonClick(event, index){
        setVisibleSlide(index);
    }
    
    function onMouseDown(event, index){
        const slide = event.currentTarget;
        state.mouseDownPosition = event.clientX;
        state.currentSliderPosition = event.clientX - state.lastTranslatePosition;
        state.currentSlideIndex = index;
        animateTransition(false);
        slide.addEventListener('mousemove', onMouseMove);
    }
    
    function onMouseUp(event){
        const slide = event.currentTarget;
        const movementQtd = event.type.includes('touch') ? 50 : 150;
        if(state.movementPosition > movementQtd){
            backwardSlide();
        } else if(state.movementPosition < -movementQtd){
            forwardSlide();
        } else {
            setVisibleSlide(state.currentSlideIndex);
        }
        state.movementPosition = 0;
        slide.removeEventListener('mousemove', onMouseMove);
    }
    
    function onMouseMove(event){
        state.movementPosition = event.clientX - state.mouseDownPosition;
        translateSlide(event.clientX - state.currentSliderPosition);
    }
    
    function onMouseLeave(event){
        const slide = event.currentTarget;
        slide.removeEventListener('mousemove', onMouseMove);
    }
    
    function onTouchStart(event, index){
        const slide = event.currentTarget;
        slide.addEventListener('touchmove', onTouchMove);
        event.clientX = event.touches[0].clientX;
        onMouseDown(event, index);
    }
    
    function onTouchMove(event){
        event.clientX = event.touches[0].clientX;
        onMouseMove(event);
    }
    
    function onTouchEnd(event){
        const slide = event.currentTarget;
        slide.removeEventListener('touchmove', onTouchMove);
        onMouseUp(event);
    }
    
    function onResizeWindow(){
        setVisibleSlide(state.currentSlideIndex);
    }
    
    function setListeners(){
        btnNext.addEventListener('click', forwardSlide);
        btnPrevious.addEventListener('click', backwardSlide);
        slideItems.forEach(function(slide, index){
            const link = slide.querySelector('.banner-slider_link')
            link.addEventListener('click', preventDefault);
            slide.addEventListener('dragstart', preventDefault);
            
            slide.addEventListener('mousedown', function(event){
                onMouseDown(event, index);
            });
            slide.addEventListener('mouseup', onMouseUp);
            slide.addEventListener('mouseleave', onMouseLeave)
            btnConstrols[index].addEventListener('click', function(event){
                onControlButtonClick(event, index)
            });
    
            slide.addEventListener('touchstart', function(event){
                onTouchStart(event, index);
            });
            slide.addEventListener('touchend', onTouchEnd);
        });
        let resizeTimeOut;
        window.addEventListener('resize', function(){
            clearTimeout(resizeTimeOut);
            resizeTimeOut = setTimeout(function(){
                onResizeWindow();
            }, 1000);
        });
    }
    
    function init(){
        setVisibleSlide(3);
        setListeners();
    }
    
    return { 
        init
    }
}

export default bannerSliderModule