Object.defineProperty(this, 'post', {
    value(...args) {
        return postMessage(args);
    }
})

function send(...args) {
    postMessage(args);
}

send('1.js');

let w2;

let count = 0;

function init() {
    count++;

    w2 = new Worker('2.js');
    w2.id = count;
    w2.addEventListener('message', function (e) {
        post('1.js pipe', e.data);
    });

    w2.addEventListener('error', e => {
        console.log(e.type);
        // init();
    });

    console.log(Object.getOwnPropertyNames(this).filter(e=>/^on./.test(e)));
    
    console.log('inited');
}

init();


// w2.addEventListener('message', e=>{
//     send(e.data);
// });
