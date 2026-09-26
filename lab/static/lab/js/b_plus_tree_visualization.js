/* =====================================================
   B+ TREE VISUALIZATION

   User selects ORDER.

   Example:

   Order 4
   Maximum children = 4
   Maximum keys      = 3

   Actual data is stored ONLY in leaf nodes.

   Internal nodes contain separator keys.

   Duplicate values are allowed.
===================================================== */


/* =====================================================
   NODE
===================================================== */

class BPlusNode {

    constructor(leaf = false) {

        this.keys = [];

        this.children = [];

        this.leaf = leaf;

        this.next = null;

        this.id =
            "bplus_" +
            Math.random()
                .toString(36)
                .substring(2, 10);
    }
}


/* =====================================================
   B+ TREE
===================================================== */

class BPlusTree {

    constructor(order) {

        this.order = order;

        this.maxKeys =
            order - 1;

        this.root =
            new BPlusNode(true);
    }


    /* =================================================
       INSERT
    ================================================= */

    insert(key) {

        const root =
            this.root;


        /*
         * If root is full,
         * split root first.
         */

        if (
            root.keys.length >=
            this.maxKeys
        ) {

            const newRoot =
                new BPlusNode(false);

            newRoot.children.push(root);

            this.root =
                newRoot;


            this.splitChild(
                newRoot,
                0
            );


            this.insertNonFull(
                newRoot,
                key
            );


            return true;
        }


        this.insertNonFull(
            root,
            key
        );


        return false;
    }


    /* =================================================
       INSERT NON FULL
    ================================================= */

    insertNonFull(
        node,
        key
    ) {

        /*
         * Leaf
         */

        if (node.leaf) {

            node.keys.push(key);

            node.keys.sort(
                (a, b) => a - b
            );


            /*
             * Leaf overflow
             */

            if (
                node.keys.length >
                this.maxKeys
            ) {

                /*
                 * This normally happens
                 * when insertion occurs
                 * directly in a leaf.
                 *
                 * Find parent through
                 * recursive mechanism.
                 */

                return;
            }


            return;
        }


        /*
         * Find child.
         *
         * Equal keys go to the right
         * for B+ tree duplicate support.
         */

        let index = 0;


        while (
            index <
            node.keys.length &&
            key >= node.keys[index]
        ) {

            index++;
        }


        const child =
            node.children[index];


        /*
         * If child is full,
         * split it before insertion.
         */

        if (
            child.keys.length >=
            this.maxKeys
        ) {

            this.splitChild(
                node,
                index
            );


            /*
             * Re-evaluate child.
             */

            if (
                key >=
                node.keys[index]
            ) {

                index++;
            }
        }


        this.insertNonFull(
            node.children[index],
            key
        );


        /*
         * Safety:
         * split leaf if overflow happened.
         */

        this.fixOverflow(
            node
        );
    }


    /* =================================================
       FIX OVERFLOW
    ================================================= */

    fixOverflow(node) {

        for (
            let i = 0;
            i < node.children.length;
            i++
        ) {

            const child =
                node.children[i];


            if (
                child.keys.length >
                this.maxKeys
            ) {

                this.splitChild(
                    node,
                    i
                );
            }
        }
    }


    /* =================================================
       SPLIT CHILD
    ================================================= */

    splitChild(
        parent,
        index
    ) {

        const child =
            parent.children[index];


        /*
         * CASE 1:
         * Leaf split
         */

        if (child.leaf) {

            const right =
                new BPlusNode(true);


            /*
             * Split approximately
             * in the middle.
             */

            const splitPoint =
                Math.ceil(
                    child.keys.length / 2
                );


            right.keys =
                child.keys.slice(
                    splitPoint
                );


            child.keys =
                child.keys.slice(
                    0,
                    splitPoint
                );


            /*
             * Connect leaf nodes.
             */

            right.next =
                child.next;

            child.next =
                right;


            /*
             * First key of right
             * becomes separator.
             *
             * IMPORTANT:
             *
             * Key remains in leaf.
             */

            const separator =
                right.keys[0];


            parent.keys.splice(
                index,
                0,
                separator
            );


            parent.children.splice(
                index + 1,
                0,
                right
            );


            return;
        }


        /*
         * CASE 2:
         * Internal node split
         */

        const right =
            new BPlusNode(false);


        const middle =
            Math.floor(
                child.keys.length / 2
            );


        /*
         * Separator promoted.
         */

        const separator =
            child.keys[middle];


        /*
         * Right keys.
         */

        right.keys =
            child.keys.slice(
                middle + 1
            );


        /*
         * Left keys.
         */

        child.keys =
            child.keys.slice(
                0,
                middle
            );


        /*
         * Children.
         */

        right.children =
            child.children.slice(
                middle + 1
            );


        child.children =
            child.children.slice(
                0,
                middle + 1
            );


        /*
         * Add separator to parent.
         */

        parent.keys.splice(
            index,
            0,
            separator
        );


        parent.children.splice(
            index + 1,
            0,
            right
        );
    }


    /* =================================================
       GET LEAF NODES
    ================================================= */

    getLeafNodes() {

        let node =
            this.root;


        /*
         * Go to leftmost leaf.
         */

        while (!node.leaf) {

            node =
                node.children[0];
        }


        const leaves = [];


        while (node) {

            leaves.push(node);

            node =
                node.next;
        }


        return leaves;
    }


    /* =================================================
       GET ALL DATA
    ================================================= */

    getAllKeys() {

        const leaves =
            this.getLeafNodes();


        const result = [];


        leaves.forEach(
            leaf => {

                result.push(
                    ...leaf.keys
                );
            }
        );


        return result;
    }
}


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let tree = null;

let selectedOrder = null;

let lastInsertedKey = null;


/* =====================================================
   DOM
===================================================== */

const orderInput =
    document.getElementById(
        "orderInput"
    );

const keyInput =
    document.getElementById(
        "keyInput"
    );

const setOrderBtn =
    document.getElementById(
        "setOrderBtn"
    );

const insertBtn =
    document.getElementById(
        "insertBtn"
    );

const resetBtn =
    document.getElementById(
        "resetBtn"
    );

const message =
    document.getElementById(
        "message"
    );

const currentOrder =
    document.getElementById(
        "currentOrder"
    );

const maxKeys =
    document.getElementById(
        "maxKeys"
    );

const maxChildren =
    document.getElementById(
        "maxChildren"
    );

const treeWrapper =
    document.getElementById(
        "treeWrapper"
    );

const treeLines =
    document.getElementById(
        "treeLines"
    );

const treeNodes =
    document.getElementById(
        "treeNodes"
    );

const emptyTree =
    document.getElementById(
        "emptyTree"
    );

const leafChain =
    document.getElementById(
        "leafChain"
    );

const operationText =
    document.getElementById(
        "operationText"
    );

const keyResult =
    document.getElementById(
        "keyResult"
    );


/* =====================================================
   SET ORDER
===================================================== */

setOrderBtn.addEventListener(
    "click",
    function () {

        const order =
            Number(
                orderInput.value
            );


        if (
            !Number.isInteger(order) ||
            order < 3
        ) {

            message.textContent =
                "B+ Tree order must be 3 or greater.";

            message.style.color =
                "#dc2626";

            return;
        }


        selectedOrder =
            order;


        tree =
            new BPlusTree(order);


        currentOrder.textContent =
            order;


        maxKeys.textContent =
            order - 1;


        maxChildren.textContent =
            order;


        keyInput.disabled =
            false;


        insertBtn.disabled =
            false;


        orderInput.disabled =
            true;


        setOrderBtn.disabled =
            true;


        message.textContent =
            "Order " +
            order +
            " B+ Tree created successfully.";


        message.style.color =
            "#15803d";


        operationText.textContent =
            "B+ Tree order is " +
            order +
            ". Maximum " +
            (order - 1) +
            " keys are allowed in a node before splitting.";


        renderTree();

        renderLeafChain();

        renderKeys();


        keyInput.focus();
    }
);


/* =====================================================
   INSERT KEY
===================================================== */

insertBtn.addEventListener(
    "click",
    function () {

        if (
            tree === null
        ) {

            message.textContent =
                "First set the B+ Tree order.";

            return;
        }


        const value =
            Number(
                keyInput.value
            );


        if (
            keyInput.value.trim() === "" ||
            !Number.isFinite(value)
        ) {

            message.textContent =
                "Enter a valid number.";

            message.style.color =
                "#dc2626";

            return;
        }


        /*
         * Duplicate values allowed.
         */

        const before =
            tree.getLeafNodes()
                .length;


        /*
         * Insert using recursive
         * safe method.
         */

        insertValue(
            tree.root,
            value
        );


        /*
         * Root overflow check.
         */

        if (
            tree.root.keys.length >
            tree.maxKeys
        ) {

            const oldRoot =
                tree.root;


            const newRoot =
                new BPlusNode(false);


            newRoot.children.push(
                oldRoot
            );


            tree.root =
                newRoot;


            tree.splitChild(
                newRoot,
                0
            );
        }


        lastInsertedKey =
            value;


        const after =
            tree.getLeafNodes()
                .length;


        if (
            after > before
        ) {

            operationText.textContent =
                "Leaf node became full. " +
                "It was split into two leaf nodes. " +
                "The first key of the right leaf " +
                "was copied to the parent as a separator. " +
                "The original data remains in the leaf nodes.";

        } else {

            operationText.textContent =
                "Key " +
                value +
                " inserted into the appropriate leaf node.";
        }


        message.textContent =
            "Key " +
            value +
            " inserted successfully.";


        message.style.color =
            "#15803d";


        keyInput.value = "";

        keyInput.focus();


        renderTree();

        renderLeafChain();

        renderKeys();
    }
);


/* =====================================================
   INSERT VALUE
===================================================== */

function insertValue(
    node,
    key
) {

    /*
     * Leaf
     */

    if (node.leaf) {

        node.keys.push(key);

        node.keys.sort(
            (a,b) => a-b
        );

        return;
    }


    /*
     * Find child.
     *
     * Equal goes right.
     */

    let index = 0;


    while (
        index < node.keys.length &&
        key >= node.keys[index]
    ) {

        index++;
    }


    let child =
        node.children[index];


    /*
     * Insert into child.
     */

    insertValue(
        child,
        key
    );


    /*
     * If child overflowed,
     * split it.
     */

    if (
        child.keys.length >
        tree.maxKeys
    ) {

        tree.splitChild(
            node,
            index
        );
    }


    /*
     * Parent itself can overflow.
     *
     * It will be handled while
     * returning to root.
     */
}


/* =====================================================
   ENTER KEY
===================================================== */

keyInput.addEventListener(
    "keydown",
    function(event){

        if(
            event.key === "Enter"
        ){

            event.preventDefault();

            insertBtn.click();
        }
    }
);


/* =====================================================
   RESET
===================================================== */

resetBtn.addEventListener(
    "click",
    function(){

        tree = null;

        selectedOrder = null;

        lastInsertedKey = null;


        orderInput.value = "";

        keyInput.value = "";


        orderInput.disabled =
            false;


        setOrderBtn.disabled =
            false;


        keyInput.disabled =
            true;


        insertBtn.disabled =
            true;


        currentOrder.textContent =
            "-";


        maxKeys.textContent =
            "-";


        maxChildren.textContent =
            "-";


        treeNodes.innerHTML =
            "";


        treeLines.innerHTML =
            "";


        emptyTree.style.display =
            "block";


        leafChain.innerHTML =
            "No leaf nodes.";


        keyResult.textContent =
            "No keys inserted.";


        message.textContent =
            "Please enter B+ Tree order first.";


        message.style.color =
            "#15803d";


        operationText.textContent =
            "Waiting for B+ Tree order.";
    }
);


/* =====================================================
   CALCULATE POSITIONS
===================================================== */

function calculatePositions(){

    const positions =
        new Map();


    if(
        tree === null
    ){

        return positions;
    }


    const wrapperWidth =
        Math.max(
            treeWrapper.clientWidth,
            1000
        );


    let leafIndex = 0;


    const levelGap = 125;


    function calculate(
        node,
        depth
    ){

        if(node.leaf){

            positions.set(
                node.id,
                {
                    node:node,
                    x:leafIndex * 120 + 70,
                    y:60 + depth * levelGap
                }
            );


            leafIndex++;

            return;
        }


        /*
         * Calculate children first.
         */

        node.children.forEach(
            child => {

                calculate(
                    child,
                    depth + 1
                );
            }
        );


        const children =
            node.children.map(
                child =>
                    positions.get(
                        child.id
                    )
            );


        const first =
            children[0];


        const last =
            children[
                children.length - 1
            ];


        positions.set(
            node.id,
            {
                node:node,
                x:
                    (
                        first.x +
                        last.x
                    ) / 2,

                y:
                    60 +
                    depth * levelGap
            }
        );
    }


    calculate(
        tree.root,
        0
    );


    /*
     * Fit horizontally.
     */

    const values =
        Array.from(
            positions.values()
        );


    if(
        values.length === 0
    ){

        return positions;
    }


    const minX =
        Math.min(
            ...values.map(
                p => p.x
            )
        );


    const maxX =
        Math.max(
            ...values.map(
                p => p.x
            )
        );


    const width =
        maxX - minX || 1;


    const available =
        wrapperWidth - 120;


    if(
        width > available
    ){

        const scale =
            available / width;


        values.forEach(
            p => {

                p.x =
                    60 +
                    (
                        p.x - minX
                    ) *
                    scale;
            }
        );
    }


    return positions;
}


/* =====================================================
   RENDER TREE
===================================================== */

function renderTree(){

    treeNodes.innerHTML =
        "";

    treeLines.innerHTML =
        "";


    if(
        tree === null ||
        tree.root.keys.length === 0
    ){

        emptyTree.style.display =
            "block";

        return;
    }


    emptyTree.style.display =
        "none";


    const positions =
        calculatePositions();


    drawEdges(
        tree.root,
        positions
    );


    positions.forEach(
        position => {

            createNodeElement(
                position
            );
        }
    );
}


/* =====================================================
   DRAW EDGES
===================================================== */

function drawEdges(
    node,
    positions
){

    if(
        node.leaf
    ){

        return;
    }


    const parent =
        positions.get(
            node.id
        );


    node.children.forEach(
        child => {

            const childPosition =
                positions.get(
                    child.id
                );


            if(
                childPosition
            ){

                createLine(
                    parent.x,
                    parent.y + 28,
                    childPosition.x,
                    childPosition.y - 28
                );
            }


            drawEdges(
                child,
                positions
            );
        }
    );
}


/* =====================================================
   CREATE LINE
===================================================== */

function createLine(
    x1,
    y1,
    x2,
    y2
){

    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    line.setAttribute(
        "x1",
        x1
    );


    line.setAttribute(
        "y1",
        y1
    );


    line.setAttribute(
        "x2",
        x2
    );


    line.setAttribute(
        "y2",
        y2
    );


    line.setAttribute(
        "class",
        "tree-edge"
    );


    treeLines.appendChild(
        line
    );
}


/* =====================================================
   CREATE NODE
===================================================== */

function createNodeElement(
    position
){

    const node =
        position.node;


    const element =
        document.createElement(
            "div"
        );


    element.className =
        "bplus-node";


    if(
        node.leaf
    ){

        element.classList.add(
            "leaf-node"
        );

    }else{

        element.classList.add(
            "internal-node"
        );
    }


    if(
        node.keys.includes(
            lastInsertedKey
        )
    ){

        element.classList.add(
            "new-node"
        );
    }


    element.style.left =
        position.x + "px";


    element.style.top =
        position.y + "px";


    node.keys.forEach(
        key => {

            const keyElement =
                document.createElement(
                    "div"
                );


            keyElement.className =
                "bplus-key";


            keyElement.textContent =
                key;


            element.appendChild(
                keyElement
            );
        }
    );


    treeNodes.appendChild(
        element
    );
}


/* =====================================================
   RENDER LEAF CHAIN
===================================================== */

function renderLeafChain(){

    leafChain.innerHTML =
        "";


    if(
        tree === null
    ){

        leafChain.textContent =
            "No leaf nodes.";

        return;
    }


    const leaves =
        tree.getLeafNodes();


    if(
        leaves.length === 0
    ){

        leafChain.textContent =
            "No leaf nodes.";

        return;
    }


    leaves.forEach(
        (leaf,index) => {

            const node =
                document.createElement(
                    "div"
                );


            node.className =
                "leaf-chain-node";


            leaf.keys.forEach(
                key => {

                    const keyBox =
                        document.createElement(
                            "div"
                        );


                    keyBox.className =
                        "leaf-chain-key";


                    keyBox.textContent =
                        key;


                    node.appendChild(
                        keyBox
                    );
                }
            );


            leafChain.appendChild(
                node
            );


            if(
                index <
                leaves.length - 1
            ){

                const arrow =
                    document.createElement(
                        "div"
                    );


                arrow.className =
                    "chain-arrow";


                arrow.textContent =
                    "→";


                leafChain.appendChild(
                    arrow
                );
            }
        }
    );
}


/* =====================================================
   RENDER KEYS
===================================================== */

function renderKeys(){

    if(
        tree === null
    ){

        keyResult.textContent =
            "No keys inserted.";

        return;
    }


    const keys =
        tree.getAllKeys();


    if(
        keys.length === 0
    ){

        keyResult.textContent =
            "No keys inserted.";

        return;
    }


    keyResult.innerHTML =
        "";


    keys.forEach(
        key => {

            const box =
                document.createElement(
                    "div"
                );


            box.className =
                "result-key";


            box.textContent =
                key;


            keyResult.appendChild(
                box
            );
        }
    );
}


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    function(){

        renderTree();
    }
);