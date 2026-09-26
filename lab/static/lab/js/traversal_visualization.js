document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       ELEMENTS
    ===================================== */

    const input = document.getElementById("nodeValue");
    const insertBtn = document.getElementById("insertBtn");
    const resetBtn = document.getElementById("resetBtn");

    const inorderBtn = document.getElementById("inorderBtn");
    const preorderBtn = document.getElementById("preorderBtn");
    const postorderBtn = document.getElementById("postorderBtn");

    const treeWrapper = document.getElementById("treeWrapper");
    const treeSvg = document.getElementById("treeSvg");
    const treeNodes = document.getElementById("treeNodes");

    const message = document.getElementById("insertMessage");
    const currentStep = document.getElementById("currentStep");
    const result = document.getElementById("result");


    /* =====================================
       BST NODE
    ===================================== */

    class TreeNode {

        constructor(value) {

            this.value = value;

            this.left = null;

            this.right = null;

            this.id =
                "node-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 9);
        }

    }


    /* =====================================
       TREE ROOT
    ===================================== */

    let root = null;

    let traversalRunning = false;


    /* =====================================
       INSERT INTO BST
       
       RULE:
       Smaller value  → LEFT
       Greater value  → RIGHT
       Duplicate value → RIGHT
    ===================================== */

    function insertNode(rootNode, value) {

        /*
         * If current position is empty,
         * create a new node.
         */

        if (rootNode === null) {

            return new TreeNode(value);

        }


        /*
         * Smaller value goes to LEFT.
         */

        if (value < rootNode.value) {

            rootNode.left =
                insertNode(
                    rootNode.left,
                    value
                );

        }

        /*
         * Greater OR DUPLICATE value
         * goes to RIGHT.
         */

        else {

            rootNode.right =
                insertNode(
                    rootNode.right,
                    value
                );

        }


        return rootNode;
    }


    /* =====================================
       INSERT BUTTON
    ===================================== */

    insertBtn.addEventListener(
        "click",
        function () {

            /*
             * Do not allow insertion while
             * traversal animation is running.
             */

            if (traversalRunning) {
                return;
            }


            const value =
                Number(input.value);


            /*
             * Validate input.
             */

            if (!Number.isInteger(value)) {

                message.textContent =
                    "Please enter a valid integer.";

                message.style.color =
                    "#dc2626";

                return;
            }


            /*
             * IMPORTANT:
             *
             * There is NO duplicate check here.
             *
             * Duplicate values are allowed.
             */

            root =
                insertNode(
                    root,
                    value
                );


            message.textContent =
                value +
                " inserted successfully.";

            message.style.color =
                "#2563eb";


            /*
             * Clear input.
             */

            input.value = "";

            input.focus();


            /*
             * Clear previous traversal.
             */

            clearTraversal();


            /*
             * Render updated tree.
             */

            renderTree(value);

        }
    );


    /* =====================================
       ENTER KEY
    ===================================== */

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                insertBtn.click();

            }

        }
    );


    /* =====================================
       RESET TREE
    ===================================== */

    resetBtn.addEventListener(
        "click",
        function () {

            if (traversalRunning) {
                return;
            }


            root = null;


            treeNodes.innerHTML = "";

            treeSvg.innerHTML = "";


            message.textContent = "";


            currentStep.textContent =
                "Select a traversal to begin.";


            result.textContent = "-";


            showEmptyTree();

        }
    );


    /* =====================================
       EMPTY TREE
    ===================================== */

    function showEmptyTree() {

        treeNodes.innerHTML = "";


        const empty =
            document.createElement("div");


        empty.className =
            "empty-tree";


        empty.textContent =
            "Enter values above to build your Binary Search Tree.";


        treeNodes.appendChild(empty);

    }


    /* =====================================
       GET TREE LEVELS
    ===================================== */

    function getTreeLevels() {

        const levels = [];


        if (!root) {

            return levels;

        }


        const queue = [

            {
                node: root,
                depth: 0
            }

        ];


        while (queue.length > 0) {

            const item =
                queue.shift();


            const node =
                item.node;


            const depth =
                item.depth;


            if (!levels[depth]) {

                levels[depth] = [];

            }


            levels[depth].push(node);


            /*
             * Add left child.
             */

            if (node.left) {

                queue.push({

                    node: node.left,

                    depth: depth + 1

                });

            }


            /*
             * Add right child.
             */

            if (node.right) {

                queue.push({

                    node: node.right,

                    depth: depth + 1

                });

            }

        }


        return levels;
    }


    /* =====================================
       CALCULATE NODE POSITIONS
    ===================================== */

    function calculatePositions() {

        const positions =
            new Map();


        const levels =
            getTreeLevels();


        if (!root) {

            return positions;

        }


        const wrapperWidth =
            treeWrapper.clientWidth;


        const levelHeight = 85;

        const topPadding = 55;


        /*
         * Recursively position nodes.
         */

        function placeNode(
            node,
            left,
            right,
            depth
        ) {

            if (!node) {

                return;

            }


            /*
             * Center of current subtree.
             */

            const x =
                (left + right) / 2;


            const y =
                topPadding +
                depth * levelHeight;


            positions.set(
                node,
                {
                    x: x,
                    y: y
                }
            );


            /*
             * LEFT subtree.
             */

            placeNode(
                node.left,
                left,
                x,
                depth + 1
            );


            /*
             * RIGHT subtree.
             */

            placeNode(
                node.right,
                x,
                right,
                depth + 1
            );

        }


        placeNode(
            root,
            60,
            wrapperWidth - 60,
            0
        );


        /*
         * Automatically increase tree height
         * when there are many levels.
         */

        const requiredHeight =
            Math.max(
                520,
                levels.length *
                    levelHeight +
                    100
            );


        treeWrapper.style.height =
            requiredHeight + "px";


        return positions;

    }


    /* =====================================
       RENDER TREE
    ===================================== */

    function renderTree(
        insertedValue = null
    ) {

        /*
         * Clear old nodes and edges.
         */

        treeNodes.innerHTML = "";

        treeSvg.innerHTML = "";


        /*
         * Empty tree.
         */

        if (!root) {

            showEmptyTree();

            return;

        }


        const positions =
            calculatePositions();


        /* =================================
           DRAW EDGES
        ================================= */

        function drawEdges(node) {

            if (!node) {

                return;

            }


            const parentPosition =
                positions.get(node);


            /*
             * LEFT EDGE
             */

            if (node.left) {

                const childPosition =
                    positions.get(
                        node.left
                    );


                drawLine(
                    parentPosition,
                    childPosition
                );


                drawEdges(
                    node.left
                );

            }


            /*
             * RIGHT EDGE
             */

            if (node.right) {

                const childPosition =
                    positions.get(
                        node.right
                    );


                drawLine(
                    parentPosition,
                    childPosition
                );


                drawEdges(
                    node.right
                );

            }

        }


        drawEdges(root);


        /* =================================
           DRAW NODES
        ================================= */

        function drawNodes(node) {

            if (!node) {

                return;

            }


            const position =
                positions.get(node);


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "tree-node";


            /*
             * Every node has its own ID.
             *
             * This is important for duplicates.
             *
             * Example:
             *
             * 34
             * 34
             * 34
             *
             * All three have different IDs.
             */

            element.dataset.nodeId =
                node.id;


            element.dataset.value =
                node.value;


            element.textContent =
                node.value;


            element.style.left =
                position.x + "px";


            element.style.top =
                position.y + "px";


            /*
             * Animation for newly inserted node.
             */

            if (
                insertedValue !== null &&
                node.value === insertedValue
            ) {

                element.classList.add(
                    "inserted"
                );

            }


            treeNodes.appendChild(
                element
            );


            /*
             * Draw left subtree.
             */

            drawNodes(
                node.left
            );


            /*
             * Draw right subtree.
             */

            drawNodes(
                node.right
            );

        }


        drawNodes(root);

    }


    /* =====================================
       DRAW EDGE
    ===================================== */

    function drawLine(
        parent,
        child
    ) {

        const line =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );


        line.setAttribute(
            "x1",
            parent.x
        );


        line.setAttribute(
            "y1",
            parent.y
        );


        line.setAttribute(
            "x2",
            child.x
        );


        line.setAttribute(
            "y2",
            child.y
        );


        line.classList.add(
            "tree-edge"
        );


        treeSvg.appendChild(
            line
        );

    }


    /* =====================================
       INORDER
       
       LEFT → ROOT → RIGHT
    ===================================== */

    function inorder(
        node,
        array = []
    ) {

        if (!node) {

            return array;

        }


        /*
         * Visit LEFT.
         */

        inorder(
            node.left,
            array
        );


        /*
         * Visit ROOT.
         */

        array.push(node);


        /*
         * Visit RIGHT.
         */

        inorder(
            node.right,
            array
        );


        return array;

    }


    /* =====================================
       PREORDER
       
       ROOT → LEFT → RIGHT
    ===================================== */

    function preorder(
        node,
        array = []
    ) {

        if (!node) {

            return array;

        }


        /*
         * Visit ROOT.
         */

        array.push(node);


        /*
         * Visit LEFT.
         */

        preorder(
            node.left,
            array
        );


        /*
         * Visit RIGHT.
         */

        preorder(
            node.right,
            array
        );


        return array;

    }


    /* =====================================
       POSTORDER
       
       LEFT → RIGHT → ROOT
    ===================================== */

    function postorder(
        node,
        array = []
    ) {

        if (!node) {

            return array;

        }


        /*
         * Visit LEFT.
         */

        postorder(
            node.left,
            array
        );


        /*
         * Visit RIGHT.
         */

        postorder(
            node.right,
            array
        );


        /*
         * Visit ROOT.
         */

        array.push(node);


        return array;

    }


    /* =====================================
       CLEAR TRAVERSAL
    ===================================== */

    function clearTraversal() {

        const nodes =
            document.querySelectorAll(
                ".tree-node"
            );


        nodes.forEach(
            function (node) {

                node.classList.remove(
                    "active"
                );


                node.classList.remove(
                    "visited"
                );

            }
        );


        result.textContent =
            "-";


        currentStep.textContent =
            "Select a traversal to begin.";

    }


    /* =====================================
       DISABLE / ENABLE BUTTONS
    ===================================== */

    function setButtonsDisabled(
        state
    ) {

        inorderBtn.disabled =
            state;


        preorderBtn.disabled =
            state;


        postorderBtn.disabled =
            state;


        insertBtn.disabled =
            state;


        resetBtn.disabled =
            state;

    }


    /* =====================================
       RUN TRAVERSAL
    ===================================== */

    async function runTraversal(
        traversalNodes,
        traversalName
    ) {

        /*
         * Tree empty.
         */

        if (!root) {

            currentStep.textContent =
                "Please insert nodes first.";

            return;

        }


        /*
         * Traversal already running.
         */

        if (traversalRunning) {

            return;

        }


        traversalRunning = true;


        setButtonsDisabled(
            true
        );


        /*
         * Clear old highlighting.
         */

        clearTraversal();


        const values = [];


        currentStep.textContent =
            traversalName +
            " traversal started.";


        /*
         * Visit nodes one by one.
         */

        for (
            let i = 0;
            i < traversalNodes.length;
            i++
        ) {

            const current =
                traversalNodes[i];


            /*
             * IMPORTANT:
             *
             * Search using node ID,
             * NOT value.
             *
             * This allows duplicate values.
             */

            const element =
                document.querySelector(
                    `[data-node-id="${current.id}"]`
                );


            if (!element) {

                continue;

            }


            /*
             * Previous active node
             * becomes visited.
             */

            document
                .querySelectorAll(
                    ".tree-node.active"
                )
                .forEach(
                    function (node) {

                        node.classList.remove(
                            "active"
                        );


                        node.classList.add(
                            "visited"
                        );

                    }
                );


            /*
             * Highlight current node.
             */

            element.classList.add(
                "active"
            );


            /*
             * Add current value
             * to traversal result.
             */

            values.push(
                current.value
            );


            result.textContent =
                values.join(
                    " → "
                );


            currentStep.textContent =
                traversalName +
                ": Visiting " +
                current.value;


            /*
             * Wait 850ms before
             * visiting next node.
             */

            await sleep(850);

        }


        /*
         * Make final active node visited.
         */

        document
            .querySelectorAll(
                ".tree-node.active"
            )
            .forEach(
                function (node) {

                    node.classList.remove(
                        "active"
                    );


                    node.classList.add(
                        "visited"
                    );

                }
            );


        currentStep.textContent =
            traversalName +
            " traversal completed.";


        traversalRunning = false;


        setButtonsDisabled(
            false
        );

    }


    /* =====================================
       SLEEP
    ===================================== */

    function sleep(ms) {

        return new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    ms
                );

            }
        );

    }


    /* =====================================
       INORDER BUTTON
    ===================================== */

    inorderBtn.addEventListener(
        "click",
        function () {

            if (!root) {

                currentStep.textContent =
                    "Please insert nodes first.";

                return;

            }


            const nodes =
                inorder(root);


            runTraversal(
                nodes,
                "Inorder"
            );

        }
    );


    /* =====================================
       PREORDER BUTTON
    ===================================== */

    preorderBtn.addEventListener(
        "click",
        function () {

            if (!root) {

                currentStep.textContent =
                    "Please insert nodes first.";

                return;

            }


            const nodes =
                preorder(root);


            runTraversal(
                nodes,
                "Preorder"
            );

        }
    );


    /* =====================================
       POSTORDER BUTTON
    ===================================== */

    postorderBtn.addEventListener(
        "click",
        function () {

            if (!root) {

                currentStep.textContent =
                    "Please insert nodes first.";

                return;

            }


            const nodes =
                postorder(root);


            runTraversal(
                nodes,
                "Postorder"
            );

        }
    );


    /* =====================================
       WINDOW RESIZE
    ===================================== */

    window.addEventListener(
        "resize",
        function () {

            if (
                root &&
                !traversalRunning
            ) {

                renderTree();

            }

        }
    );


    /* =====================================
       INITIAL STATE
    ===================================== */

    showEmptyTree();

});