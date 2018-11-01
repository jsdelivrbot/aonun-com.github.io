let db=localforage.createInstance('tm');

db.setItem('k', new Date(), (error, value)=>{
    console.log('[getItem]', error||value);
});

