let logPanel=new Vue({
    el:'#logPanel',
    datas:{
        drag:0,
        dragstart:0,
        dragend:0,
        dragover:0,
        dragenter:0,
        dragleave:0,
        drop:0
    }
});


let item, box, counter={};

// document.addEventListener('drag', (e) => {
//     log(e);
// }, false);


document.addEventListener('dragstart', (e) => {
    console.log(false, e.target);
    
    item = e.target;
    item.classList.add('move');
    log(e);
}, false);
document.addEventListener('dragstart', (e) => {
    console.log(true, e.target);
    
    item = e.target;
    item.classList.add('move');
    log(e);
}, true);
document.body.addEventListener('dragstart', (e) => {
    console.log(true, e.target);

    item = e.target;
    item.classList.add('move');
    log(e);
}, true);


document.addEventListener('dragover', (e) => {
    e.preventDefault();// 启动drop事件
    box = e.target;// box
    log(e);
}, false);

document.addEventListener('dragenter', (e) => {
    log(e);
    
    box = e.target;

    let b = item === box;
    item.classList[b?'remove':'add']('move');
    box.style.background = b?'#ff0':'#f00';
}, false);

document.addEventListener('dragleave', (e) => {
    log(e);
    box = e.target;
    box.style.background = '';

    if(box===item) {
        item.classList.add('not-allowed');
    }else{
        item.classList.remove('not-allowed');
    }
}, false);

document.addEventListener('dragend', (e) => {
    item = e.target;// item
    item.classList.remove('move');
    log(e);
}, false);

document.addEventListener('drop', (e) => {
    e.preventDefault();
    box = e.target;
    box.appendChild(item);
    box.style.background = '';
    item.classList.remove('move');
    log(e);
}, false);


function log(e) {
    if (typeof counter[e.type] !== 'number') counter[e.type]=0;
    counter[e.type]++;
    console.log(e.type);
    
    document.querySelector('#' + e.type).textContent = counter[e.type] + e.target.id;
    // console.log(e.type, e.target.id);
}