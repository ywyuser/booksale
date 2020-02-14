window.onload = function() {
    var banner = document.getElementById("banner");
    var btn = banner.getElementsByTagName("input");
    var img = banner.getElementsByTagName("img");
    var length = btn.length;
    var index = 0;
    for (var i = 0; i < length; i++) {
        btn[i].index = i;
        btn[i].onclick = function() {
            for (var i = 0; i < length; i++) {
                img[i].className = "six";
                btn[i].className = "sixz";
            }
            img[this.index].className = "six active";
            btn[this.index].className = "sixz lactive";
        };
    }

    function lunbo() {
        var timer = null;
        var count = 0;
        clearInterval(timer);
        timer = setInterval(function() {
            if (count < length - 1) {
                count++;
            } else {
                count = 0;
            }
            for (var i = 0; i < length; i++) {
                img[i].className = "six";
                btn[i].className = "sixz";
            }
            img[count].className = "six active";
            btn[count].className = "sixz lactive";
        }, 2000);
    }
    lunbo();

};