// Ensure that jQuery is available a window.$ and window.jQuery
//import jQuery from 'jquery';
//(window as any).$ = (window as any).jQuery = jQuery;

// jQuery is already loaded and available on the window object, alias $ as well
(window as any).$ = (window as any).jQuery;

import "./index.scss";

import { mylatte } from './components/mylatte/mylatte';
import { slickcarousel } from './components/slickcarousel/slickcarousel'; 
import { liveclock } from './components/liveclock/liveclock';
import './components/xaclock/xaclock';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOCUMENT READY");
    liveclock();
    mylatte();
    slickcarousel(); 
});  
