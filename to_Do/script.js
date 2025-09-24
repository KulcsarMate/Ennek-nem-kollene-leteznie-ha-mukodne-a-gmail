var input = document.querySelector("#item");
var list = document.querySelector("#list");

function addItem() {
    let pre = document.createElement("pre");
    let value = input.value.trim();
    if (!value) {console.log("Empty item"); return;}
    input.value = "";
    pre.innerText = value + " ";
    createCheckBox(pre);
    createButton(pre);
    let li = document.createElement("li");
    li.draggable = true;
    li.appendChild(pre);
    addDragEvents(li);
    list.appendChild(li);
}

function createCheckBox(pre) {
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    pre.appendChild(checkBox);
    checkBox.onclick = function () {
        let parent = pre.parentNode;
        if (parent.classList.contains("complete")) {
            parent.classList.remove("complete");
        }
        else {
            parent.classList += "complete";
        }
    }
}

function createButton(pre) {
    let button = document.createElement("input");
    button.type = "button";
    button.value = "Remove";
    button.onclick = function () {
        let parent = pre.parentNode;
        parent.remove();
    };
    pre.appendChild(button);
}

function addDragEvents(li) {
    li.addEventListener("dragstart", (e) => {
        li.classList.add("dragging");
    });

    li.addEventListener("dragend", (e) => {
        li.classList.remove("dragging");
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
