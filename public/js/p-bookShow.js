window.onload = function() {
    var btn1 = document.getElementById("btn1");
    var suc1 = document.getElementById("suc1");
    var btn2 = document.getElementById("btn2");
    var suc2 = document.getElementById("suc2");
    btn1.onclick = function() {
        suc1.style.display = 'block';
        if (suc1.style.display == 'block') {
            setTimeout(function() {
                suc1.style.display = 'none';
            }, 1000);
        }
    };
    btn2.onclick = function() {
        suc2.style.display = 'block'
        if (suc2.style.display == 'block') {
            setTimeout(function() {
                suc2.style.display = 'none';
            }, 1000);
        }
    };
};