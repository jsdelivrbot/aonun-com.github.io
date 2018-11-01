let w = new Worker('parent.js');

w.addEventListener('connect', e=>{
    console.log(e);
});

w.addEventListener('message', e=>{
    console.log('message:', e.data);
});

w.addEventListener('close', e=>{
    console.log(e);
});


