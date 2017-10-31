var pics = [
    'https://kde.link/test/1.png',
    'https://kde.link/test/2.png',
    'https://kde.link/test/9.png',
    'https://kde.link/test/7.png',
    'https://kde.link/test/6.png',
    'https://kde.link/test/3.png',
    'https://kde.link/test/4.png',
    'https://kde.link/test/0.png',
    'https://kde.link/test/5.png',
    'https://kde.link/test/8.png'
];

var lastClicked;
var picsAmount;
var gamePics = [];
var handler;
var tmp1 = '';
var tmp2 = '';
var closedPic = 0;
var score = 0;


var addGamePics =  function() {
    for (var i = 0; gamePics.length < picsAmount; ++i) {
        gamePics.push(pics[i], pics[i]);
        if (i === 9) {
            i = 0;
        }
    }
}


var shuffleGamePics = function(array) {
    var tmp, current, top = array.length;

    if (top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array
}

var clickableGrid = function(cols, rows, callback){
    var i = 0;
    var grid = document.createElement('table');
    grid.className = 'grid';

    for (var c = 0;c < cols; ++c){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var r = 0; r < rows; ++r){
            var cell = tr.appendChild(document.createElement('td'));
            cell.id = ++i
            cell.innerHTML = cell.id;
            cell.addEventListener('click', (function(el, i){
                return function(){
                    callback(el, i);
                }
            })(cell, i), true);
        }
    }
    return grid;
}


var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};


//start the script
getJSON('https://kde.link/test/get_field_size.php',
    function(err, data) {
        if (err !== null) {
            console.log('Something went wrong: ' + err);
        } else {
            console.log('width: ' + data.width + ' height: ' + data.height);
            picsAmount = data.width * data.height

            var grid = clickableGrid(data.height, data.width,
                function(el, i){

                    if (tmp1 && tmp2) {

                        if (document.getElementById(tmp1).firstChild.src === document.getElementById(tmp2).firstChild.src) {
                            var done1 = document.getElementById(tmp1);
                            var done2 = document.getElementById(tmp2);
                            done1.innerHTML = "";
                            done2.innerHTML = "";
                            done1.className = 'done';
                            done2.className = 'done';
                            done1.parentNode.replaceChild(done1.cloneNode(1), done1);
                            done2.parentNode.replaceChild(done2.cloneNode(1), done2);
                            tmp1 = "";
                            tmp2 = "";
                            closedPic += 2;
                            score += 10;
                            document.getElementById('score').innerHTML = score;

                            if (closedPic === picsAmount - 2) {
                                console.log("win")
                                var btn = document.createElement('button');
                                btn.innerHTML = "Restart"
                                btn.addEventListener('click', function(){
                                    location.reload();
                                })
                                document.body.appendChild(btn);
                            }
                        }
                    }

                    if (tmp2) {

                        if (document.getElementById(tmp2) !== el) {
                            document.getElementById(tmp1).innerHTML = tmp1;
                            document.getElementById(tmp2).innerHTML = tmp2;

                            tmp1 = "";
                            tmp2 = "";
                        }
                    }

                    if (tmp1) {

                        if (document.getElementById(tmp1) !== el) {
                            tmp2 = el.id;
                            el.innerHTML = "<img src='" + gamePics[i - 1] + "'>";
                        }
                        return true
                    }

                    tmp1 = el.id;
                    el.innerHTML = "<img src='" + gamePics[i - 1] + "'>";
            });
            document.body.appendChild(grid);
            addGamePics();
            gamePics = shuffleGamePics(gamePics);
        }
});
