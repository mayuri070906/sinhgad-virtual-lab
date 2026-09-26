let stack = [];

const MAX_SIZE = 5;


function pushElement() {

    const input =
        document.getElementById("stack-input");

    const output =
        document.getElementById("output");

    const status =
        document.getElementById("status");


    if (stack.length >= MAX_SIZE) {

        output.innerText =
            "❌ Stack Overflow! Maximum size is 5.";

        status.innerText =
            "Overflow";

        return;
    }


    const value = input.value.trim();


    if (value === "") {

        output.innerText =
            "⚠ Please enter a value.";

        status.innerText =
            "Input Required";

        input.focus();

        return;
    }


    stack.push(value);


    input.value = "";


    displayStack();


    output.innerText =
        `✓ ${value} pushed into the stack.`;

    status.innerText =
        "Push Successful";
}


function popElement() {

    const output =
        document.getElementById("output");

    const status =
        document.getElementById("status");


    if (stack.length === 0) {

        output.innerText =
            "❌ Stack Underflow! Stack is empty.";

        status.innerText =
            "Underflow";

        return;
    }


    const removed =
        stack.pop();


    displayStack();


    output.innerText =
        `✓ ${removed} popped from the stack.`;

    status.innerText =
        "Pop Successful";
}


function peekElement() {

    const output =
        document.getElementById("output");

    const status =
        document.getElementById("status");


    if (stack.length === 0) {

        output.innerText =
            "⚠ Stack is empty.";

        status.innerText =
            "Empty";

        return;
    }


    const top =
        stack[stack.length - 1];


    output.innerText =
        `👁 Top element is ${top}.`;

    status.innerText =
        "Peek";
}


function resetStack() {

    stack = [];


    displayStack();


    document.getElementById("output").innerText =
        "↻ Stack has been reset.";

    document.getElementById("status").innerText =
        "Reset";


    document.getElementById("stack-input").value = "";
}


function displayStack() {

    const container =
        document.getElementById(
            "stack-container"
        );

    const size =
        document.getElementById(
            "stack-size"
        );


    container.innerHTML = "";


    if (stack.length === 0) {

        container.innerHTML =
            `<div class="empty-stack">
                Stack is empty
             </div>`;

        size.innerText =
            "Size: 0";

        return;
    }


    for (
        let i = 0;
        i < stack.length;
        i++
    ) {

        const element =
            document.createElement("div");


        element.className =
            "stack-element";


        if (i === stack.length - 1) {

            element.classList.add(
                "top-element"
            );

        }


        element.innerText =
            stack[i];


        container.appendChild(element);
    }


    size.innerText =
        `Size: ${stack.length}`;
}

/* =========================================
   QUEUE VIRTUAL LAB
========================================= */

let queue = [];

const QUEUE_MAX_SIZE = 5;


/* ENQUEUE */

function enqueueElement() {

    const input =
        document.getElementById("queue-input");

    const output =
        document.getElementById("queue-output");

    const status =
        document.getElementById("queue-status");


    if (queue.length >= QUEUE_MAX_SIZE) {

        output.innerText =
            "❌ Queue Overflow! Maximum size is 5.";

        status.innerText =
            "Overflow";

        return;
    }


    const value =
        input.value.trim();


    if (value === "") {

        output.innerText =
            "⚠ Please enter a value.";

        status.innerText =
            "Input Required";

        input.focus();

        return;
    }


    queue.push(value);


    input.value = "";


    displayQueue();


    output.innerText =
        `✓ ${value} inserted into the queue.`;

    status.innerText =
        "Enqueue Successful";
}


/* DEQUEUE */

function dequeueElement() {

    const output =
        document.getElementById("queue-output");

    const status =
        document.getElementById("queue-status");


    if (queue.length === 0) {

        output.innerText =
            "❌ Queue Underflow! Queue is empty.";

        status.innerText =
            "Underflow";

        return;
    }


    const removed =
        queue.shift();


    displayQueue();


    output.innerText =
        `✓ ${removed} removed from the queue.`;

    status.innerText =
        "Dequeue Successful";
}


/* PEEK */

function peekQueue() {

    const output =
        document.getElementById("queue-output");

    const status =
        document.getElementById("queue-status");


    if (queue.length === 0) {

        output.innerText =
            "⚠ Queue is empty.";

        status.innerText =
            "Empty";

        return;
    }


    const front =
        queue[0];


    output.innerText =
        `👁 Front element is ${front}.`;

    status.innerText =
        "Peek";
}


/* RESET */

function resetQueue() {

    queue = [];


    displayQueue();


    document.getElementById(
        "queue-output"
    ).innerText =
        "↻ Queue has been reset.";


    document.getElementById(
        "queue-status"
    ).innerText =
        "Reset";


    document.getElementById(
        "queue-input"
    ).value = "";
}


/* DISPLAY QUEUE */

function displayQueue() {

    const container =
        document.getElementById(
            "queue-container"
        );


    const size =
        document.getElementById(
            "queue-size"
        );


    container.innerHTML = "";


    if (queue.length === 0) {

        container.innerHTML =
            `<div class="empty-queue">
                Queue is empty
             </div>`;

        size.innerText =
            "Size: 0";

        return;
    }


    for (
        let i = 0;
        i < queue.length;
        i++
    ) {

        const element =
            document.createElement("div");


        element.className =
            "queue-element";


        if (i === 0) {

            element.classList.add(
                "front-element"
            );

        }


        element.innerText =
            queue[i];


        container.appendChild(element);
    }


    size.innerText =
        `Size: ${queue.length}`;
}
