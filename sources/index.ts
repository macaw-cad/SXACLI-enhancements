// jQuery is already loaded and available on the window object, alias $ as well
(window as any).$ = (window as any).jQuery;

import "./index.scss";
import './components/xaclock/xaclock';

import { mylatte } from './components/mylatte/mylatte';
import { slickcarousel } from './components/slickcarousel/slickcarousel'; 
import { liveclock } from './components/liveclock/liveclock';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOCUMENT READY");
    liveclock();
    mylatte();
    slickcarousel(); 
}); 
