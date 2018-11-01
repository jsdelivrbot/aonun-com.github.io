let w1 = new Worker('1.js');


w1.addEventListener('message', e=>{
    console.log('main', e.data);
});

w1.addEventListener('error', e=>{
    console.log('error', e); 
});

w1.addEventListener('close',e=>{
    console.log('close', e);
});