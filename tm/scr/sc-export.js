(function(){var n=prompt('export col number:','2');var a=[];$('#ext-element-16 td:nth-child('+n+')').each(function(i,e){ a.push(e.textContent); });console.log(a.join('\n'));})();