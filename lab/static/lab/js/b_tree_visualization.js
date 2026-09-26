/* ==========================================
   B TREE VISUALIZATION
========================================== */


/* ==========================================
   NODE CLASS
========================================== */

class BTreeNode {

    constructor(leaf = true){

        this.keys = [];

        this.children = [];

        this.leaf = leaf;

        this.id =
            "node_" +
            Math.random()
                .toString(36)
                .substring(2,10);
    }
}


/* ==========================================
   B TREE CLASS
========================================== */

class BTree{

    constructor(order){

        this.order = order;

        this.maxKeys = order - 1;

        this.root = new BTreeNode(true);
    }


    insert(key){

        let root = this.root;

        if(root.keys.length === this.maxKeys){

            let newRoot =
                new BTreeNode(false);

            newRoot.children.push(root);

            this.root = newRoot;

            this.splitChild(newRoot,0);

            this.insertNonFull(newRoot,key);

            return true;
        }

        this.insertNonFull(root,key);

        return false;
    }


    insertNonFull(node,key){

        if(node.leaf){

            node.keys.push(key);

            node.keys.sort((a,b)=>a-b);

            return;
        }

        let i = node.keys.length - 1;

        while(i >= 0 && key < node.keys[i]){
            i--;
        }

        i++;

        if(node.children[i].keys.length === this.maxKeys){

            this.splitChild(node,i);

            if(key > node.keys[i]){
                i++;
            }
        }

        this.insertNonFull(node.children[i],key);
    }


    splitChild(parent,index){

        const child =
            parent.children[index];

        const right =
            new BTreeNode(child.leaf);

        const mid =
            Math.floor(child.keys.length / 2);

        const middleKey =
            child.keys[mid];


        right.keys =
            child.keys.slice(mid + 1);

        child.keys =
            child.keys.slice(0,mid);


        if(!child.leaf){

            right.children =
                child.children.slice(mid + 1);

            child.children =
                child.children.slice(0,mid + 1);
        }


        parent.keys.splice(index,0,middleKey);

        parent.children.splice(index + 1,0,right);
    }


    getAllKeys(){

        let result = [];

        function walk(node){

            if(node.leaf){

                result.push(...node.keys);

                return;
            }

            for(let i=0;i<node.keys.length;i++){

                walk(node.children[i]);

                result.push(node.keys[i]);
            }

            walk(node.children[node.keys.length]);
        }

        walk(this.root);

        return result;
    }
}


/* ==========================================
   GLOBAL
========================================== */

let tree = null;

let selectedOrder = null;

let lastKey = null;


/* ==========================================
   DOM
========================================== */

const orderInput =
document.getElementById("orderInput");

const keyInput =
document.getElementById("keyInput");

const setOrderBtn =
document.getElementById("setOrderBtn");

const insertBtn =
document.getElementById("insertBtn");

const resetBtn =
document.getElementById("resetBtn");

const message =
document.getElementById("message");

const currentOrder =
document.getElementById("currentOrder");

const maxKeys =
document.getElementById("maxKeys");

const maxChildren =
document.getElementById("maxChildren");

const treeWrapper =
document.getElementById("treeWrapper");

const treeLines =
document.getElementById("treeLines");

const treeNodes =
document.getElementById("treeNodes");

const emptyTree =
document.getElementById("emptyTree");

const operationText =
document.getElementById("operationText");

const keyResult =
document.getElementById("keyResult");


/* ==========================================
   SET ORDER
========================================== */

setOrderBtn.addEventListener("click",()=>{

    const order =
        Number(orderInput.value);

    if(!Number.isInteger(order) || order < 3){

        message.textContent =
        "Order must be 3 or greater.";

        message.style.color="#dc2626";

        return;
    }

    selectedOrder = order;

    tree = new BTree(order);

    currentOrder.textContent = order;

    maxKeys.textContent = order - 1;

    maxChildren.textContent = order;

    keyInput.disabled = false;

    insertBtn.disabled = false;

    orderInput.disabled = true;

    setOrderBtn.disabled = true;

    message.textContent =
    "B-Tree created successfully.";

    message.style.color="#15803d";

    operationText.textContent =
    "Order " + order +
    " selected. Now insert keys.";

    renderTree();

    renderKeys();
});


/* ==========================================
   INSERT
========================================== */

insertBtn.addEventListener("click",()=>{

    if(tree === null){

        message.textContent =
        "Set order first.";

        return;
    }

    const value =
        Number(keyInput.value);

    if(keyInput.value.trim()==="" || !Number.isFinite(value)){

        message.textContent =
        "Enter valid key.";

        message.style.color="#dc2626";

        return;
    }

    const split =
        tree.insert(value);

    lastKey = value;

    if(split){

        operationText.textContent =
        "Node split occurred. Middle key promoted to parent.";

    }else{

        operationText.textContent =
        value +
        " inserted successfully.";
    }

    message.textContent =
    "Key inserted successfully.";

    message.style.color="#15803d";

    keyInput.value="";

    keyInput.focus();

    renderTree();

    renderKeys();
});


/* ==========================================
   ENTER
========================================== */

keyInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        insertBtn.click();
    }

});


/* ==========================================
   RESET
========================================== */

resetBtn.addEventListener("click",()=>{

    tree = null;

    selectedOrder = null;

    lastKey = null;

    orderInput.disabled=false;

    setOrderBtn.disabled=false;

    keyInput.disabled=true;

    insertBtn.disabled=true;

    orderInput.value="";

    keyInput.value="";

    currentOrder.textContent="-";

    maxKeys.textContent="-";

    maxChildren.textContent="-";

    treeNodes.innerHTML="";

    treeLines.innerHTML="";

    emptyTree.style.display="block";

    keyResult.textContent=
    "No keys inserted.";

    message.textContent=
    "Please enter B-Tree order first.";

    operationText.textContent=
    "Waiting for B-Tree order.";
});


/* ==========================================
   CALCULATE POSITIONS
========================================== */

function calculatePositions(){

    const positions = new Map();

    if(tree === null) return positions;

    let counter = 0;

    const width =
        treeWrapper.clientWidth;

    const levelGap = 120;


    function walk(node,depth){

        if(node.leaf){

            positions.set(node.id,{
                node:node,
                x:counter * 120,
                y:60 + depth * levelGap
            });

            counter++;

            return;
        }

        node.children.forEach(child=>{
            walk(child,depth+1);
        });

        const childPos =
        node.children.map(c=>positions.get(c.id));

        const first=childPos[0];
        const last=childPos[childPos.length-1];

        positions.set(node.id,{
            node:node,
            x:(first.x + last.x)/2,
            y:60 + depth*levelGap
        });
    }

    walk(tree.root,0);


    const values =
    Array.from(positions.values());

    const minX =
    Math.min(...values.map(p=>p.x));

    const maxX =
    Math.max(...values.map(p=>p.x));

    const currentWidth =
    maxX-minX || 1;

    const available =
    width-100;

    const scale =
    currentWidth>available
        ? available/currentWidth
        :1;

    values.forEach(p=>{
        p.x =
        50 + (p.x-minX)*scale;
    });

    return positions;
}


/* ==========================================
   RENDER TREE
========================================== */

function renderTree(){

    treeNodes.innerHTML="";
    treeLines.innerHTML="";

    if(tree===null || tree.root.keys.length===0){

        emptyTree.style.display="block";
        return;
    }

    emptyTree.style.display="none";

    const positions =
        calculatePositions();

    drawEdges(tree.root,positions);

    positions.forEach(pos=>{
        createNode(pos);
    });
}


/* ==========================================
   DRAW EDGES
========================================== */

function drawEdges(node,positions){

    if(node.leaf) return;

    const parent =
    positions.get(node.id);

    node.children.forEach(child=>{

        const childPos =
        positions.get(child.id);

        createLine(
            parent.x,
            parent.y+25,
            childPos.x,
            childPos.y-25
        );

        drawEdges(child,positions);
    });
}


/* ==========================================
   LINE
========================================== */

function createLine(x1,y1,x2,y2){

    const line =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("x1",x1);
    line.setAttribute("y1",y1);
    line.setAttribute("x2",x2);
    line.setAttribute("y2",y2);
    line.setAttribute("class","tree-edge");

    treeLines.appendChild(line);
}


/* ==========================================
   CREATE NODE
========================================== */

function createNode(pos){

    const div =
    document.createElement("div");

    div.className="btree-node";

    div.style.left=pos.x+"px";
    div.style.top=pos.y+"px";

    if(pos.node.keys.includes(lastKey)){
        div.classList.add("new-node");
    }

    pos.node.keys.forEach(key=>{

        const k =
        document.createElement("div");

        k.className="btree-key";

        k.textContent=key;

        div.appendChild(k);

    });

    treeNodes.appendChild(div);
}


/* ==========================================
   SORTED KEYS
========================================== */

function renderKeys(){

    if(tree===null){

        keyResult.textContent=
        "No keys inserted.";

        return;
    }

    const keys =
    tree.getAllKeys();

    keyResult.innerHTML="";

    keys.forEach(key=>{

        const box =
        document.createElement("div");

        box.className="result-key";

        box.textContent=key;

        keyResult.appendChild(box);

    });
}


/* ==========================================
   RESIZE
========================================== */

window.addEventListener("resize",()=>{
    renderTree();
});