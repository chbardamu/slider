An orbit-like slider, made primarily for the homepage of the Taxibeat Wordpress theme

```javascript
// Optional faster swipe on touch events
slider.swipe.fast = true;

// Initialize
slider.setup({
    "pager": document.querySelector('.slides'),
    "container": document.querySelector('.slider'), 
    "header": document.querySelector('.slider-header'),
    "subHeader": document.querySelector('.slider-sub-header'),
}).start();
```