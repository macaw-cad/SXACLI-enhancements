import './liveclock.scss';

var showTwelve = false;

export function liveclock() {
    $('.digital-clock').click(() => {
        showTwelve = !showTwelve;
        console.log("showTwelve:", showTwelve);
    });
    clockUpdate();
    setInterval(clockUpdate, 1000);
}

function clockUpdate() { 
    var date = new Date();
    $('.digital-clock').css({ 'color': '#fff', 'text-shadow': '0 0 6px #ff0' });
    function addZero(x: number | string) {
        if (x < 10) {
            return x = '0' + x;
        } else {
            return x;
        }
    } 

    function twelveHour(x: number) {
        if (x > 12) {
            return x = x - 12; 
        } else if (x == 0) {
            return x = 12;
        } else {
            return x; 
        }
    }

    var hours = date.getHours();
    if (showTwelve) hours = twelveHour(hours);
    var h = addZero(hours);
    var m = addZero(date.getMinutes());
    var s = addZero(date.getSeconds());

    $('.digital-clock').text(h + ':' + m + ':' + s)
    
}