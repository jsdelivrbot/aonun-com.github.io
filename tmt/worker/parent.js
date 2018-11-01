console.warn('parent.js');

importScripts('sub.js');


postMessage(['parent', Date.now()]);
