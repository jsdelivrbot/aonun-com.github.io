{
//  创建UI的类
function Maskbox(){
let strHTML=`<div class="ao-maskbox">
<style>
.ao-maskbox {
    width:33%;
    height: 100%;
    position:fixed;
    right:0;
    top:0;
    background: #000b;
    z-index: 9999;
}
.ao-menu {
    width:100%;
    background: #000;
}
button {
    background:#ccc;
    padding:7px;
    border-radius:7px 0;
    height:auto;
}
#ao-tasklist {background:#333;}
.ao-task {
    color: #fff;
    line-height: 0;
    border: 1px solid #666;
    user-select:none;
}
.ao-task:odd { color:eee;}
</style>
<div class="ao-menu">
    <button id="ao-close">CLOSE</button>
</div>
<table id="ao-tasklist"></table>
</div>`;

let maskbox=$(strHTML).appendTo('body');
let aoClose=maskbox.find('#ao-close').text(MQ.Res['Buttons.Close.Text']);

aoClose.one('click', ()=>maskbox.remove());
this.content=maskbox;
this.tasklist=maskbox.find('#ao-tasklist');
}
Maskbox.prototype.add=function(opt){
    let task=$('<tbody class="ao-task">').appendTo(this.tasklist);
    for(let k in opt) {
        let v=opt[k];
        $('<tr>').appendTo(task)
        .append($('<th>').text(k))
        .append($('<td>').text(v));
    }
    // 点击时打开文档, 并获取DocInstanceId
    task.on('click', ()=>{});
}

    // 显示id们
    let taskTRs=$('#TaskTableContainerDiv');
    let maskbox=new Maskbox();

    // 从task中获取必要信息
    taskTRs.find('tr[data-role="1000"]').each((i,e)=>{
        let tr=$(e);
        let segments=tr.find('.segments').text()
        let projectName=tr.find('.project-name').text()
        let docName=tr.find('.doc-name').text()
        let langPair=tr.find('.lang-pair').text()
        let opt={
            divisionGuid: '',
            projectId: tr.attr('data-projectguid'),
            documentId: tr.attr('data-docguid'),
            projectName, docName, langPair, segments,
        };

        // $(e).attr({title:opt});
        // console.log(opt)
        maskbox.add(opt);
    });





}

// DOMAttrModified
// DOMAttributeNameChanged
// DOMCharacterDataModified
// DOMElementNameChanged
// DOMNodeInserted
// DOMNodeInsertedIntoDocument
// DOMNodeRemoved
// DOMNodeRemovedFromDocument
// DOMSubtreeModified
/*
<tbody id="gridTableBody">
<tr  data-id="0"  class style="display:table-row">
    <td class="order">1.</td>
    <td class="original-segment-grid">
        <div class="editor-cell-container" style="max-height:534px">
            <div class="editor-cell">
                <div class="asset-container"></div>
                <div class="content-container-wrapper">
                    <span class="content-container">
                        <span class=" editor-char  ">검투사의 가죽 장화</span></span></div></div>
    <td class="translated-segment-grid">
        <div class="editor-cell-container focused" style="max-height: 746px;">
            <div class="editor-cell">
                <div class="asset-container">
                    <div class="editor-cursor hidden" style="width: 0px; height: 15px; left: 0px; top: 0px;"></div></div>
                    <div class="content-container-wrapper">
                        <!-- 有两种可能性, 空的没有<span class="editor-char" /> -->
                        <span class="content-container"></span></div></div></div>
                        <span class="content-container"><span class=" editor-char  ">112341</span></span>


页面侦听wheel事件

如果array还有有效内容, 
    填充(#gridTableBody tr[data-id=?] .translated-segment-grid span.content-container)
    下的span.editor-char
*/

(function() {

let str, map, target, div, msg, ok, ng, ta, ui, input;

input=document.querySelector('#editorHiddenInput');

ui = $(`<div style="position:fixed; top:0; right:10px; width:40%; bottom:10px; border:2px solid blue; padding:24px; background:#0007; z-index: 99999;">
<h5 class="message" style="background:#fffc; font-weight:bold;">memoQ 위한 붙여넣는 기능입니다.</h5>
<button class="ok" style="text-align:center;background:#ff0">확인</button>
<button class="ng" style="text-align:center;background:#ff0">취소</button>
<textarea style="width:100%; height:80%;"></textarea>
</div>`).appendTo('body');

msg = ui.find('h5.message');
ok = ui.find('button.ok')
ng = ui.find('button.ng')
ta = ui.find('textarea')

ok.on('click', function() {
    str = ta.val();
    map = stringToMap(str);
    ta.remove();
    ok.remove();
    msg.text("마우스 링을 굴러 보세요. 취소할 수도 있습니다.");
    $(window).on('keyup', doFill);
    ui.css({width: 200, height: 200, top: 0, right: 10 });
});

ng = ng.on("click", function() {
    ui.remove();
    input.addEventListener('keyup', doFill);
});

function doFill(e) {
    if(e.keyCode===40||e.keyCode===38){
        msg.textContent='남은 수: '+map.size+'개.';
        if(map.size) {
            setTimeout(function()=>{
                let active=document.querySelector('#gridTableBody tr.active');
                if(active){
                    let id=active.getAttribute('data-id');
                    if(map.has(id)){
                        console.log(id, map.get(id));
                        if(input){
                            let s=active.querySelector('.translated-segment-grid .content-container');
                            s.textContent='';
                            input.value=map.get(id);
                            map.delete(id);
                        }
                    }     
                }
                console.log(active);
            });
        }else{
            msg.text("입력 완료.").css({
                background: "rgba(0,255,0,0.2)"
            });
            $(window).off("keyup", doFill);
            setTimeout(function() { ui.remove(); },1000);
        }
    }
}

function stringToMap(str){
    let map=new Map();
    str.split('\n').forEach((v,i)=>{
        v=v.trim();
        if(v.length>0) map.set(String(i), v);
    });
    return map;
}

// function fill(id, value) {
//     let t,c,i;
//     t=document.querySelector('#gridTableBody tr[data-id="'+id+'"] .translated-segment-grid span.content-container');
//     c=t.querySelector('span.editor-char');
//     if(c===null) {
//         c=document.createElement('span');
//         x.classList('editor-char');
//         t.appendChild(c);
//     }
//     c.textContent=value;
//     c.style.background='#ccc';
    
//     let e=new Event('keyup');
//     e.keyCode=13;
//     e.ctrlKey=true;
//     e.shiftKey=false;
//     e.altKey=false;
//     e.metaKey=false;
//     t.dispatchEvent(e);
// }


// $(window).on('keydow', e=>console.log(e.type))

// function getRows() {
//     let rows;
//     rows=document.querySelectorAll('#gridTableBody tr[data-id]');
//     return rows;
// }


})();

{
let id='4feb76ab-443a-4533-81c3-5b97a85b1a3c'
let url='https://sakura.memoq.com/gamedex-l10n/api/TranslationService/SaveWebRows';
let data={"DocInstanceId":id,
"WebRows":[{
    "docInstanceId":id,
    "id":0,
    "sourceSegmentHtml":"[[진] 빛나는 대영주의 부츠 상자",
    "targetSegmentHtml":"a",
    "locked":false,
    "translationState":2,
    "warnings":[],
    "webLQAErrors":[],
    "comments":[],
    "rangeForCorrectedLQA":null,
    "sourceSegmentChanges":[],
    "targetSegmentChanges":[]}]}

let headers={
    accept:'*/*',
    'content-type':'application/json; charset=UTF-8',
    'x-xsrf-token':document.cookie.match(/X-XSRF-TOKEN=(.+);?/)[1]
};

$.ajax({
  type: "POST",
  url: url,
  headers:headers,
  data: JSON.stringify(data),
  // dataType: '*/*'
});
}




{
let id='dfb1e7b6-af1c-4257-85cb-86b7b0960574'
let url='https://sakura.memoq.com/gamedex-l10n/api/TranslationService/GetWebContent';
let data={"DocInstanceId":id,
"RowIndicies":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99]}

let headers={
    'accept':'*/*',
    'content-type':'application/json; charset=UTF-8',
    // 'x-xsrf-token':document.cookie.match(/X-XSRF-TOKEN=(.+);?/)[1]
    'x-xsrf-token':MQ.getCookieValue('X-XSRF-TOKEN')
};

function onSuccess(e){
    console.log(e)
}
console.log(id)

$.ajax({
  type: "POST",
  url: url,
  headers:headers,
  data: JSON.stringify(data),
  // dataType: '*/*',
  success:onSuccess
});
}





{// 打开文档的分析
    url:
    'https://sakura.memoq.com/gamedex-l10n/api/TranslationService/BeginOpenDocument';

    req:
    {"projectId":"7ad760b2-a288-e811-a958-000d3a50af3d",
    "documentId":"098483e0-26e8-4db4-a341-79ad8f03f68f",
    "divisionGuid":""}

    res:
    {"Success":true,"Value":"bece3894-b77d-490c-bb7a-95fe50450174","ErrorDetails":null,"SessionExpired":false,"IsExpected":false,"ErrorMessage":null}
}

// 打开文档的函数
function beginOpenDocument(data,task) {
    let url='https://sakura.memoq.com/gamedex-l10n/api/TranslationService/BeginOpenDocument';
    let headers={
        'accept':'*/*',
        'content-type':'application/json; charset=UTF-8',
        'x-xsrf-token':MQ.getCookieValue('X-XSRF-TOKEN')
    };
    let success=function(data){
        task.add()
    };
    $.ajax({ type:'POST', url, headers, data, success });
}



