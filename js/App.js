'use strict';

let draggedEl,
    onDragStart,
    onDrag,
    onDragEnd,
    onAddNoteBtnClick,
    grabPointX,
    grabPointY,
    createNote,
    addNoteBtnEl,
    init,
    testLocalStorage,
    saveNote,
    deleteNote,
    loadNotes,
    getNoteObject;

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

onDragEnd = function (){
    draggedEl = null;
    grabPointX = null;
	grabPointY = null;
};

getNoteObject = function (el) {
    let title = el.querySelector('.title')
    let textarea = el.querySelector('.content');
    return {
        content: textarea.value,
        title: title.value,
        id: el.id,
        transformCSSValue: el.style.transform,
        textarea: {
            width: textarea.style.width,
            height: textarea.style.height
        }
    }
};

createNote = function (options) {
    let stickerEl = document.createElement('div'),
        barEl = document.createElement('div'),
        titleEl = document.createElement('textarea'),
        textareaEl = document.createElement('textarea'),
        deleteBtnEl = document.createElement('button'),
        onSave,
        onDelete,
        BOUNDARIES = 400,
        noteConfig = options || {
            content: '',
            title: '',
            id: "sticker_" + new Date().getTime(),
            transformCSSValue: "translateX(" + Math.random() * BOUNDARIES + "px) translateY(" + Math.random() * BOUNDARIES + "px)"
        }
    
    onSave = function () {
        saveNote(
            getNoteObject(stickerEl)
        );
    };
    
    onDelete = function () {
        deleteNote(
            getNoteObject(stickerEl)
        );
        document.body.removeChild(stickerEl);
    };
    
    if (noteConfig.textarea){
        textareaEl.style.width = noteConfig.textarea.width;
        textareaEl.style.height = noteConfig.textarea.height;
    }
    
    titleEl.classList.add('title');
    textareaEl.classList.add('content');
    
    stickerEl.id = noteConfig.id;
    textareaEl.value = noteConfig.content;
    
    titleEl.value = noteConfig.title;
    
    deleteBtnEl.addEventListener('click', onDelete);
    deleteBtnEl.classList.add('deleteButton');
    
    stickerEl.style.transform = noteConfig.transformCSSValue;
    
    barEl.classList.add('bar');
    stickerEl.classList.add('sticker');
    
    barEl.appendChild(titleEl);
    barEl.appendChild(deleteBtnEl);
    
    stickerEl.appendChild(barEl);
    stickerEl.appendChild(textareaEl);
    
    stickerEl.addEventListener('mousedown', onDragStart, false);
    stickerEl.addEventListener('mouseup', onSave);
    stickerEl.addEventListener('keyup', onSave);
    
    document.body.appendChild(stickerEl);
}

testLocalStorage = function () {
    let foo = "foo";
    
    try{
        localStorage.setItem(foo, foo);
        localStorage.removeItem(foo);
        return true;
    } catch (e){
        return false;
    }
};

onAddNoteBtnClick = function () {
    createNote();
}

init = function () {
    if (!testLocalStorage()){
        saveNote = deleteNote = function (note) {
            alert("Local storage is not working!");
        }
    } else {
        saveNote = function (note) {
            localStorage.setItem(note.id, JSON.stringify(note));
        };
        
        deleteNote = function (note) {
            localStorage.removeItem(note.id);
        };
        
        loadNotes = function () {
            for (let i = 0; i < localStorage.length; i++){
                let noteObject = JSON.parse(
                    localStorage.getItem(
                        localStorage.key(i)
                    )
                );
                createNote(noteObject);
            }
        }
        
        loadNotes();
    }
    
    addNoteBtnEl = document.querySelector('.addNoteBtn');
    addNoteBtnEl.addEventListener('click', onAddNoteBtnClick, false);
    document.addEventListener('mouseup', onDragEnd, false);
    document.addEventListener('mousemove', onDrag, false);
    
};

init();
