$(e => {
    E.test.mouseTypes = new Set(['mousedown']);
    E.test.keyboardTypes = new Set(['keydown']);


    let textarea = $('textarea').get(0);
    textarea.readOnly = true;

    E.test.mouseHandles.push(e => {
        textarea.value = (`[${e.type} (x:${e.originalEvent.offsetX},y:${e.originalEvent.offsetY})]` + '\n' + textarea.value).slice(0, 4000);
    });
    
    E.test.keyboardHandles.push(e => {
        textarea.value = (`[${e.type}] ${e.keyMap}` + '\n' + textarea.value).slice(0, 4000);
    });

    E.test.start();
    E.start();
});