'use strict';

let draggedEl,
    onDragStart,
    onDrag,
    onDragEnd,
    grabPointX,
    grabPointY,
    createNote,
    addNoteBtnEl;

onDragStart = function (ev) {
    if (ev.target.className.indexOf('bar') === -1) {
        return;
    }
    
    draggedEl = this;
    
    let boundingClientRect = draggedEl.getBoundingClientRect();
    
    grabPointX = boundingClientRect.left - ev.clientX;
    grabPointY = boundingClientRect.top - ev.clientY;
    
};

onDrag = function (ev) {
    if (!draggedEl) {
        return;
    }
    
    let posX = ev.clientX + grabPointX,
        posY = ev.clientY + grabPointY;
    
    if (posX < 0){
        posX = 0;
    }
    if (posY < 0){
        posY = 0;
    }
    
    draggedEl.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";
};

onDragEnd = function(){
    draggedEl = null;
    grabPointX = null;
    grabPointY = null;
}

createNote = function () {
    let stickerEl = document.createElement('div'),
        barEl = document.createElement('div'),
        textareaEl = document.createElement('textarea');
    
    let transformCSSValue = "translateX(" + Math.random() * window.innerWidth + "px) translateY(" + Math.random() * window.innerHeight + "px)";
    
    stickerEl.style.transform = transformCSSValue;
    
    barEl.classList.add('bar');
    stickerEl.classList.add('sticker');
    
    stickerEl.appendChild(barEl);
    stickerEl.appendChild(textareaEl);
    
    stickerEl.addEventListener('mousedown', onDragStart, false);
    
    document.body.appendChild(stickerEl);
}

addNoteBtnEl = document.querySelector('.addNoteBtn');
addNoteBtnEl.addEventListener('click', createNote, false);


document.addEventListener('mousemove', onDrag, false);
document.addEventListener('mouseup', onDragEnd, false);