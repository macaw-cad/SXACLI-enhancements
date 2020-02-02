// Ensure that jQuery is available a window.$ and window.jQuery
import jQuery from 'jquery';
(window as any).$ = (window as any).jQuery = jQuery;

import "slick-carousel";

import { mylatte } from './mylatte';
import { slickcarousel } from './slickcarousel'; 
import { liveclock } from './liveclock';

document.addEventListener('DOMContentLoaded', () => {
    mylatte(); 
    slickcarousel();
    liveclock();
});  
