
// import * as jQuery from 'jquery';
// (window as any).$ = (window as any).jQuery = jQuery;

// const jquerywindow = window as unknown as {
//   $: any;
// }

import './slickcarousel.scss';

export function slickcarousel() {
  jQuery('#slickcarousel').slick();
}