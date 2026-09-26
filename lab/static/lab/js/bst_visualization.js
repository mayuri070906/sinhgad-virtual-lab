/* =========================================
   BINARY SEARCH TREE VISUALIZATION
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const arrayInput = document.getElementById("arrayInput");
const buildBtn = document.getElementById("buildBtn");

const treeSvg = document.getElementById("treeSvg");

const treeMessage = document.getElementById("treeMessage");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetSearchBtn = document.getElementById("resetSearchBtn");

const searchFlow = document.getElementById("searchFlow");
const searchResult = document.getElementById("searchResult");


/* =========================================
   BST NODE
========================================= */

class BSTNode {

    constructor(value) {

        this.value = value;

        this.left = null;

        this.right = null;

        this.x = 0;

        this.y = 0;

        this.id = "node-" + Math.random()
            .toString(36)
            .substring(2, 10);
    }
}


/* =========================================
   BST CLASS
========================================= */

class BST {

    constructor() {

        this.root = null;
    }


    insert(value) {

        const newNode = new BSTNode(value);

        if (!this.root) {

            this.root = newNode;

            return;
        }

        let current = this.root;

        while (true) {

            if (value < current.value) {

                if (!current.left) {

                    current.left = newNode;

                    return;
                }

                current = current.left;

            } else {

                if (!current.right) {

                    current.right = newNode;

                    return;
                }

                current = current.right;
            }
        }
    }
}


/* =========================================
   GLOBAL VARIABLES
========================================= */

let bst = new BST();

let allNodes = [];

let nodeMap = new Map();


/* =========================================
   BUILD TREE
========================================= */

buildBtn.addEventListener("click", buildTree);


function buildTree() {

    const input = arrayInput.value.trim();

    if (!input) {

        treeMessage.textContent =
            "Please enter some numbers.";

        treeMessage.style.color = "#dc2626";

        return;
    }


    const values = input
        .split(",")
        .map(value => value.trim())
        .filter(value => value !== "")
        .map(Number);


    if (values.some(value => Number.isNaN(value))) {

        treeMessage.textContent =
            "Please enter valid numbers separated by commas.";

        treeMessage.style.color = "#dc2626";

        return;
    }


    if (values.length === 0) {

        treeMessage.textContent =
            "No valid values found.";

        return;
    }


    /* CREATE NEW BST */

    bst = new BST();

    values.forEach(value => {

        bst.insert(value);

    });


    /* RESET SEARCH */

    searchFlow.innerHTML =
        '<p class="empty-flow">No search performed yet.</p>';

    searchResult.className = "search-result";

    searchResult.textContent =
        "No search performed yet.";

    searchInput.value = "";


    /* DRAW TREE */

    drawTree();


    treeMessage.textContent =
        `Tree created with ${values.length} value${values.length > 1 ? "s" : ""}.`;

    treeMessage.style.color = "#166534";
}


/* =========================================
   GET TREE NODES
========================================= */

function collectNodes(node, depth = 0) {

    if (!node) {
        return;
    }

    allNodes.push(node);

    collectNodes(node.left, depth + 1);

    collectNodes(node.right, depth + 1);
}


/* =========================================
   CALCULATE TREE POSITIONS
========================================= */

function calculatePositions() {

    allNodes = [];

    nodeMap.clear();

    collectNodes(bst.root);


    if (!bst.root) {
        return;
    }


    /*
       In-order positioning.

       This guarantees:
       left subtree < root < right subtree
    */

    let order = 0;

    const levelGap = 115;

    const horizontalGap = 105;


    function position(node, depth) {

        if (!node) {
            return;
        }


        position(node.left, depth + 1);


        node.x = 80 + order * horizontalGap;

        node.y = 70 + depth * levelGap;

        order++;


        position(node.right, depth + 1);
    }


    position(bst.root, 0);


    allNodes.forEach(node => {

        nodeMap.set(node.id, node);

    });
}


/* =========================================
   DRAW TREE
========================================= */

function drawTree() {

    treeSvg.innerHTML = "";


    if (!bst.root) {
        return;
    }


    calculatePositions();


    const nodeRadius = 27;

    const sidePadding = 80;

    const topPadding = 30;

    const bottomPadding = 80;


    const maxX = Math.max(
        ...allNodes.map(node => node.x)
    );

    const maxY = Math.max(
        ...allNodes.map(node => node.y)
    );


    const svgWidth = Math.max(
        maxX + sidePadding,
        700
    );

    const svgHeight = Math.max(
        maxY + bottomPadding,
        450
    );


    treeSvg.setAttribute(
        "viewBox",
        `0 0 ${svgWidth} ${svgHeight}`
    );

    treeSvg.setAttribute(
        "width",
        svgWidth
    );

    treeSvg.setAttribute(
        "height",
        svgHeight
    );


    /* =====================================
       DRAW EDGES FIRST
    ===================================== */

    allNodes.forEach(node => {

        if (node.left) {

            createEdge(
                node,
                node.left
            );
        }


        if (node.right) {

            createEdge(
                node,
                node.right
            );
        }
    });


    /* =====================================
       DRAW NODES
    ===================================== */

    allNodes.forEach(node => {

        createNode(node);

    });
}


/* =========================================
   CREATE EDGE
========================================= */

function createEdge(parent, child) {

    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    const radius = 27;


    const dx = child.x - parent.x;

    const dy = child.y - parent.y;

    const distance =
        Math.sqrt(dx * dx + dy * dy);


    const offsetX =
        (dx / distance) * radius;

    const offsetY =
        (dy / distance) * radius;


    line.setAttribute(
        "x1",
        parent.x + offsetX
    );

    line.setAttribute(
        "y1",
        parent.y + offsetY
    );

    line.setAttribute(
        "x2",
        child.x - offsetX
    );

    line.setAttribute(
        "y2",
        child.y - offsetY
    );


    line.classList.add("tree-edge");


    treeSvg.appendChild(line);
}


/* =========================================
   CREATE NODE
========================================= */

function createNode(node) {

    const group =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );


    group.setAttribute(
        "data-node-id",
        node.id
    );


    /* CIRCLE */

    const circle =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );


    circle.setAttribute(
        "cx",
        node.x
    );

    circle.setAttribute(
        "cy",
        node.y
    );

    circle.setAttribute(
        "r",
        27
    );


    circle.classList.add("tree-node");


    /* TEXT */

    const text =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


    text.setAttribute(
        "x",
        node.x
    );

    text.setAttribute(
        "y",
        node.y
    );


    text.classList.add("node-text");

    text.textContent = node.value;


    group.appendChild(circle);

    group.appendChild(text);


    treeSvg.appendChild(group);
}


/* =========================================
   SEARCH
========================================= */

searchBtn.addEventListener(
    "click",
    searchBST
);


function searchBST() {

    if (!bst.root) {

        searchResult.className =
            "search-result error";

        searchResult.textContent =
            "Please build the tree first.";

        return;
    }


    const value =
        Number(searchInput.value);


    if (searchInput.value.trim() === "" ||
        Number.isNaN(value)) {

        searchResult.className =
            "search-result error";

        searchResult.textContent =
            "Please enter a valid search value.";

        return;
    }


    /* RESET OLD COLORS */

    drawTree();


    searchFlow.innerHTML = "";


    let current = bst.root;

    let step = 1;

    let found = false;


    while (current) {


        highlightNode(
            current,
            "current"
        );


        const stepDiv =
            document.createElement("div");


        stepDiv.classList.add(
            "flow-step"
        );


        if (value === current.value) {

            stepDiv.classList.add(
                "found-step"
            );


            stepDiv.innerHTML =
                `<strong>Step ${step}:</strong>
                 Compare ${value} with ${current.value}.
                 <br>
                 ${value} = ${current.value}
                 → Value found! 🎯`;


            searchFlow.appendChild(
                stepDiv
            );


            highlightNode(
                current,
                "found"
            );


            found = true;

            break;
        }


        if (value < current.value) {

            stepDiv.innerHTML =
                `<strong>Step ${step}:</strong>
                 Compare ${value} with ${current.value}.
                 <br>
                 ${value} &lt; ${current.value}
                 → Move to LEFT subtree.`;

            searchFlow.appendChild(
                stepDiv
            );


            current = current.left;

        } else {

            stepDiv.innerHTML =
                `<strong>Step ${step}:</strong>
                 Compare ${value} with ${current.value}.
                 <br>
                 ${value} &gt; ${current.value}
                 → Move to RIGHT subtree.`;

            searchFlow.appendChild(
                stepDiv
            );


            current = current.right;
        }


        step++;
    }


    /* =====================================
       SEARCH RESULT
    ===================================== */

    if (found) {

        searchResult.className =
            "search-result success";

        searchResult.textContent =
            `🎯 ${value} is present in the Binary Search Tree.`;

    } else {

        const lastStep =
            document.createElement("div");

        lastStep.classList.add(
            "flow-step",
            "not-found-step"
        );

        lastStep.innerHTML =
            `<strong>Step ${step}:</strong>
             The required position is empty.
             <br>
             ${value} is not present in the tree.`;

        searchFlow.appendChild(
            lastStep
        );


        searchResult.className =
            "search-result error";

        searchResult.textContent =
            `❌ ${value} is not present in the Binary Search Tree.`;
    }
}


/* =========================================
   HIGHLIGHT NODE
========================================= */

function highlightNode(
    node,
    className
) {

    const group =
        treeSvg.querySelector(
            `[data-node-id="${node.id}"]`
        );


    if (!group) {
        return;
    }


    const circle =
        group.querySelector(
            ".tree-node"
        );


    if (!circle) {
        return;
    }


    circle.classList.remove(
        "current",
        "found",
        "not-found"
    );


    circle.classList.add(
        className
    );
}


/* =========================================
   RESET SEARCH
========================================= */

resetSearchBtn.addEventListener(
    "click",
    resetSearch
);


function resetSearch() {

    searchInput.value = "";


    searchFlow.innerHTML =
        '<p class="empty-flow">No search performed yet.</p>';


    searchResult.className =
        "search-result";


    searchResult.textContent =
        "No search performed yet.";


    drawTree();
}


/* =========================================
   ENTER KEY
========================================= */

arrayInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            buildTree();

        }

    }
);


searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchBST();

        }

    }
);