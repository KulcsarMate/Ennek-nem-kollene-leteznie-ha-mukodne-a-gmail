var input = document.querySelector("#item");
var list = document.querySelector("#list");
fill();

function fill() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let currentItem = JSON.parse(localStorage.getItem(key));
        let pre = document.createElement("pre");
        pre.innerText = currentItem.text + " ";
        createCheckBox(pre, currentItem.complete);
        createButton(pre);
        let li = document.createElement("li");
        li.draggable = true;
        if (currentItem.complete) li.classList.add("complete");
        li.appendChild(pre);
        addDragEvents(li);
        list.appendChild(li);
    }
}

function addItem() {
    let pre = document.createElement("pre");
    let value = input.value.trim();
    if (!value) {console.log("Empty item"); return;}
    input.value = "";
    let text = document.createTextNode(value + " ");
    pre.appendChild(text);
    createCheckBox(pre);
    createButton(pre);
    let li = document.createElement("li");
    li.draggable = true;
    li.appendChild(pre);
    addDragEvents(li);
    list.appendChild(li);
    let itemData = {
        text: value,
        complete: false
    };
    let index = `item#${localStorage.length}`;
    localStorage.setItem(index, JSON.stringify(itemData));
    updateStorage();
}

function createCheckBox(pre, isChecked = false) {
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = isChecked;
    pre.appendChild(checkBox);
    checkBox.onclick = function () {
        let li = pre.parentNode;
        if (li.classList.contains("complete")) {
            li.classList.remove("complete");
        }
        else {
            li.classList.add("complete");
        }
        updateStorage();
    }
}

function createButton(pre) {
    let button = document.createElement("input");
    button.type = "button";
    button.value = "Remove";
    button.onclick = function () {
        let parent = pre.parentNode;
        parent.remove();
        updateStorage();
    };
    pre.appendChild(button);
}

function addDragEvents(li) {
    li.addEventListener("dragstart", (e) => {
        e.target.classList.add("dragging");
    });

    li.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
    });
}

list.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggingElement = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(list, e.clientY);
    if (afterElement == null) {
        list.appendChild(draggingElement);
    } else {
        list.insertBefore(draggingElement, afterElement);
    }
    updateStorage();
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateStorage() {
    localStorage.clear();
    const items = list.querySelectorAll("li");
    items.forEach((li, index) => {
        const pre = li.querySelector("pre");
        const checkBox = pre.querySelector("input[type='checkbox']");
        const text = pre.childNodes[0].nodeValue.trim();
        const itemData = {
            text: text,
            complete: checkBox.checked
        };
        localStorage.setItem(`item#${index}`, JSON.stringify(itemData));
    });
}