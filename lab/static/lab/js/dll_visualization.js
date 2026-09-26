document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       DATA
       ========================================= */

    let dll = [];

    let selectedOperation = null;


    /* =========================================
       ELEMENTS
       ========================================= */

    const valueInput =
        document.getElementById("dll-value");

    const positionInput =
        document.getElementById("dll-position");

    const positionContainer =
        document.getElementById("dll-position-container");

    const insertToggle =
        document.getElementById("dll-insert-toggle");

    const deleteToggle =
        document.getElementById("dll-delete-toggle");

    const insertMenu =
        document.getElementById("dll-insert-menu");

    const deleteMenu =
        document.getElementById("dll-delete-menu");

    const executeButton =
        document.getElementById("dll-execute-btn");

    const searchButton =
        document.getElementById("dll-search-btn");

    const resetButton =
        document.getElementById("dll-reset-btn");

    const listContainer =
        document.getElementById("dll-list");

    const nodeCount =
        document.getElementById("dll-node-count");

    const message =
        document.getElementById("dll-message");

    const selectedOperationText =
        document.getElementById(
            "dll-selected-operation"
        );

    const status =
        document.getElementById("dll-status");


    /* =========================================
       INSERT DROPDOWN
       ========================================= */

    insertToggle.addEventListener(
        "click",
        function () {

            insertMenu.classList.toggle("show");

            deleteMenu.classList.remove("show");

        }
    );


    /* =========================================
       DELETE DROPDOWN
       ========================================= */

    deleteToggle.addEventListener(
        "click",
        function () {

            deleteMenu.classList.toggle("show");

            insertMenu.classList.remove("show");

        }
    );


    /* =========================================
       SELECT OPERATION
       ========================================= */

    const operationButtons =
        document.querySelectorAll(
            ".dll-operation-menu button"
        );


    operationButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedOperation =
                        this.dataset.operation;

                    const operationName =
                        this.textContent.trim();

                    selectedOperationText.textContent =
                        "Selected: " + operationName;


                    /*
                     * Show position input only
                     * for location operations.
                     */

                    if (
                        selectedOperation ===
                        "insertLocation" ||

                        selectedOperation ===
                        "deleteLocation"
                    ) {

                        positionContainer.classList.add(
                            "show"
                        );

                    } else {

                        positionContainer.classList.remove(
                            "show"
                        );

                    }


                    /*
                     * Close dropdowns
                     */

                    insertMenu.classList.remove(
                        "show"
                    );

                    deleteMenu.classList.remove(
                        "show"
                    );


                    showMessage(
                        operationName +
                        " selected."
                    );

                }
            );

        }
    );


    /* =========================================
       EXECUTE
       ========================================= */

    executeButton.addEventListener(
        "click",
        function () {

            if (!selectedOperation) {

                showMessage(
                    "Please select an operation."
                );

                return;

            }


            switch (selectedOperation) {

                case "insertBegin":

                    insertBegin();

                    break;


                case "insertEnd":

                    insertEnd();

                    break;


                case "insertLocation":

                    insertLocation();

                    break;


                case "deleteBegin":

                    deleteBegin();

                    break;


                case "deleteEnd":

                    deleteEnd();

                    break;


                case "deleteLocation":

                    deleteLocation();

                    break;

            }

        }
    );


    /* =========================================
       INSERT BEGIN
       ========================================= */

    function insertBegin() {

        const value =
            getValue();

        if (value === null) {

            return;

        }

        dll.unshift(value);

        renderList();

        showMessage(
            value +
            " inserted at beginning."
        );

        clearValue();

    }


    /* =========================================
       INSERT END
       ========================================= */

    function insertEnd() {

        const value =
            getValue();

        if (value === null) {

            return;

        }

        dll.push(value);

        renderList();

        showMessage(
            value +
            " inserted at end."
        );

        clearValue();

    }


    /* =========================================
       INSERT LOCATION
       ========================================= */

    function insertLocation() {

        const value =
            getValue();

        if (value === null) {

            return;

        }

        const position =
            getPosition();

        if (position === null) {

            return;

        }


        if (
            position < 1 ||
            position > dll.length + 1
        ) {

            showMessage(
                "Invalid position. Enter position from 1 to " +
                (dll.length + 1) +
                "."
            );

            return;

        }


        dll.splice(
            position - 1,
            0,
            value
        );

        renderList();

        showMessage(
            value +
            " inserted at position " +
            position +
            "."
        );

        clearValue();

        clearPosition();

    }


    /* =========================================
       DELETE BEGIN
       ========================================= */

    function deleteBegin() {

        if (dll.length === 0) {

            showMessage(
                "List is empty."
            );

            return;

        }


        const deleted =
            dll.shift();

        renderList();

        showMessage(
            deleted +
            " deleted from beginning."
        );

    }


    /* =========================================
       DELETE END
       ========================================= */

    function deleteEnd() {

        if (dll.length === 0) {

            showMessage(
                "List is empty."
            );

            return;

        }


        const deleted =
            dll.pop();

        renderList();

        showMessage(
            deleted +
            " deleted from end."
        );

    }


    /* =========================================
       DELETE LOCATION
       ========================================= */

    function deleteLocation() {

        if (dll.length === 0) {

            showMessage(
                "List is empty."
            );

            return;

        }


        const position =
            getPosition();

        if (position === null) {

            return;

        }


        if (
            position < 1 ||
            position > dll.length
        ) {

            showMessage(
                "Invalid position. Enter position from 1 to " +
                dll.length +
                "."
            );

            return;

        }


        const deleted =
            dll.splice(
                position - 1,
                1
            )[0];


        renderList();

        showMessage(
            deleted +
            " deleted from position " +
            position +
            "."
        );

        clearPosition();

    }


    /* =========================================
       SEARCH
       ========================================= */

    searchButton.addEventListener(
        "click",
        function () {

            const value =
                getValue();

            if (value === null) {

                return;

            }


            const index =
                dll.indexOf(value);


            if (index !== -1) {

                highlightNode(index);

                showMessage(
                    value +
                    " found at position " +
                    (index + 1) +
                    "."
                );

                status.textContent =
                    "Found";

            } else {

                showMessage(
                    value +
                    " not found in the list."
                );

                status.textContent =
                    "Not Found";

            }

        }
    );


    /* =========================================
       RESET
       ========================================= */

    resetButton.addEventListener(
        "click",
        function () {

            dll = [];

            selectedOperation = null;

            valueInput.value = "";

            positionInput.value = "";

            positionContainer.classList.remove(
                "show"
            );

            selectedOperationText.textContent =
                "No operation selected";

            renderList();

            showMessage(
                "List has been reset."
            );

            status.textContent =
                "Ready";

        }
    );


    /* =========================================
       GET VALUE
       ========================================= */

    function getValue() {

        const value =
            valueInput.value.trim();


        if (value === "") {

            showMessage(
                "Please enter a value."
            );

            valueInput.focus();

            return null;

        }


        const number =
            Number(value);


        if (!Number.isFinite(number)) {

            showMessage(
                "Please enter a valid number."
            );

            return null;

        }


        return number;

    }


    /* =========================================
       GET POSITION
       ========================================= */

    function getPosition() {

        const position =
            positionInput.value.trim();


        if (position === "") {

            showMessage(
                "Please enter a position."
            );

            positionInput.focus();

            return null;

        }


        const number =
            Number(position);


        if (
            !Number.isInteger(number) ||
            number < 1
        ) {

            showMessage(
                "Position must be a positive integer."
            );

            return null;

        }


        return number;

    }


    /* =========================================
       CLEAR VALUE
       ========================================= */

    function clearValue() {

        valueInput.value = "";

    }


    /* =========================================
       CLEAR POSITION
       ========================================= */

    function clearPosition() {

        positionInput.value = "";

    }


    /* =========================================
       RENDER LIST
       ========================================= */

    function renderList() {

        listContainer.innerHTML = "";

        nodeCount.textContent =
            dll.length;


        if (dll.length === 0) {

            const empty =
                document.createElement("div");

            empty.className =
                "dll-empty";

            empty.textContent =
                "Doubly Linked List is empty";

            listContainer.appendChild(
                empty
            );

            status.textContent =
                "Ready";

            return;

        }


        dll.forEach(
            function (value, index) {

                const wrapper =
                    document.createElement(
                        "div"
                    );

                wrapper.className =
                    "dll-node-wrapper";


                const node =
                    document.createElement(
                        "div"
                    );

                node.className =
                    "dll-node";

                node.dataset.index =
                    index;


                /* PREV */

                const prev =
                    document.createElement(
                        "div"
                    );

                prev.className =
                    "dll-node-top";

                prev.textContent =
                    index === 0
                        ? "NULL"
                        : "PREV";


                /* DATA */

                const data =
                    document.createElement(
                        "div"
                    );

                data.className =
                    "dll-node-data";

                data.textContent =
                    value;


                /* NEXT */

                const next =
                    document.createElement(
                        "div"
                    );

                next.className =
                    "dll-node-bottom";

                next.textContent =
                    index === dll.length - 1
                        ? "NULL"
                        : "NEXT";


                node.appendChild(prev);

                node.appendChild(data);

                node.appendChild(next);


                wrapper.appendChild(node);


                /*
                 * Add two-way arrow
                 * between nodes.
                 */

                if (
                    index <
                    dll.length - 1
                ) {

                    const arrow =
                        document.createElement(
                            "div"
                        );

                    arrow.className =
                        "dll-arrow";

                    arrow.innerHTML =
                        "⇄";

                    wrapper.appendChild(
                        arrow
                    );

                }


                listContainer.appendChild(
                    wrapper
                );

            }
        );

    }


    /* =========================================
       HIGHLIGHT SEARCHED NODE
       ========================================= */

    function highlightNode(index) {

        const nodes =
            document.querySelectorAll(
                ".dll-node"
            );


        nodes.forEach(
            function (node) {

                node.style.background =
                    "white";

                node.style.transform =
                    "scale(1)";

            }
        );


        if (nodes[index]) {

            nodes[index].style.background =
                "#f1f5f9";

            nodes[index].style.transform =
                "scale(1.08)";


            setTimeout(
                function () {

                    if (nodes[index]) {

                        nodes[index].style.background =
                            "white";

                        nodes[index].style.transform =
                            "scale(1)";

                    }

                },
                1800
            );

        }

    }


    /* =========================================
       MESSAGE
       ========================================= */

    function showMessage(text) {

        message.textContent =
            text;

    }


    /* =========================================
       CLOSE DROPDOWNS
       ========================================= */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    ".dll-operation-group"
                )
            ) {

                insertMenu.classList.remove(
                    "show"
                );

                deleteMenu.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =========================================
       INITIAL RENDER
       ========================================= */

    renderList();

});