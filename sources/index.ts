// Ensure that jQuery is available a window.$ and window.jQuery
import jQuery from 'jquery';
(window as any).$ = (window as any).jQuery = jQuery;

import "slick-carousel";

import { mylatte } from './components/mylatte/mylatte';
import { slickcarousel } from './components/slickcarousel/slickcarousel'; 
import { liveclock } from './components/liveclock/liveclock';

document.addEventListener('DOMContentLoaded', () => {
    mylatte(); 
    slickcarousel();
    liveclock(); 
});  
