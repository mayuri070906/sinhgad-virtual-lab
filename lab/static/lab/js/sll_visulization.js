document.addEventListener("DOMContentLoaded", function () {

    let list = [];

    let selectedOperation = null;


    /* ELEMENTS */

    const valueInput =
        document.getElementById("value-input");

    const positionInput =
        document.getElementById("position-input");

    const positionGroup =
        document.getElementById("position-group");

    const executeBtn =
        document.getElementById("execute-btn");

    const searchBtn =
        document.getElementById("search-btn");

    const resetBtn =
        document.getElementById("reset-btn");

    const linkedList =
        document.getElementById("linked-list");

    const nodeCount =
        document.getElementById("node-count");

    const message =
        document.getElementById("operation-message");

    const status =
        document.getElementById("status");

    const insertBtn =
        document.getElementById("insert-dropdown-btn");

    const deleteBtn =
        document.getElementById("delete-dropdown-btn");

    const insertMenu =
        document.getElementById("insert-menu");

    const deleteMenu =
        document.getElementById("delete-menu");


    /* INSERT DROPDOWN */

    insertBtn.addEventListener("click", function () {

        insertMenu.classList.toggle("show");

        deleteMenu.classList.remove("show");

    });


    /* DELETE DROPDOWN */

    deleteBtn.addEventListener("click", function () {

        deleteMenu.classList.toggle("show");

        insertMenu.classList.remove("show");

    });


    /* INSERT OPTIONS */

    const insertOptions =
        insertMenu.querySelectorAll("button");

    insertOptions.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedOperation =
                this.dataset.operation;

            insertBtn.querySelector("span:first-child")
                .textContent = this.textContent;

            insertMenu.classList.remove("show");

            updatePositionField();

            setMessage(
                "Selected: " + this.textContent
            );

        });

    });


    /* DELETE OPTIONS */

    const deleteOptions =
        deleteMenu.querySelectorAll("button");

    deleteOptions.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedOperation =
                this.dataset.operation;

            deleteBtn.querySelector("span:first-child")
                .textContent = this.textContent;

            deleteMenu.classList.remove("show");

            updatePositionField();

            setMessage(
                "Selected: " + this.textContent
            );

        });

    });


    /* POSITION FIELD */

    function updatePositionField() {

        if (
            selectedOperation === "insertLocation" ||
            selectedOperation === "deleteLocation"
        ) {

            positionGroup.classList.remove("hidden");

        } else {

            positionGroup.classList.add("hidden");

            positionInput.value = "";

        }

    }


    /* EXECUTE */

    executeBtn.addEventListener("click", function () {

        if (!selectedOperation) {

            setMessage(
                "Please select an operation first."
            );

            return;
        }


        if (selectedOperation === "insertBegin") {

            insertBegin();

        }

        else if (selectedOperation === "insertEnd") {

            insertEnd();

        }

        else if (selectedOperation === "insertLocation") {

            insertLocation();

        }

        else if (selectedOperation === "deleteBegin") {

            deleteBegin();

        }

        else if (selectedOperation === "deleteEnd") {

            deleteEnd();

        }

        else if (selectedOperation === "deleteLocation") {

            deleteLocation();

        }

    });


    /* INSERT BEGIN */

    function insertBegin() {

        const value =
            getValue();

        if (value === null) return;

        list.unshift(value);

        render();

        setMessage(
            "Inserted " +
            value +
            " at beginning."
        );

        clearValue();

    }


    /* INSERT END */

    function insertEnd() {

        const value =
            getValue();

        if (value === null) return;

        list.push(value);

        render();

        setMessage(
            "Inserted " +
            value +
            " at end."
        );

        clearValue();

    }


    /* INSERT LOCATION */

    function insertLocation() {

        const value =
            getValue();

        if (value === null) return;


        const position =
            parseInt(positionInput.value);


        if (
            isNaN(position) ||
            position < 1 ||
            position > list.length + 1
        ) {

            setMessage(
                "Invalid position. Enter position from 1 to " +
                (list.length + 1)
            );

            return;
        }


        list.splice(
            position - 1,
            0,
            value
        );

        render();

        setMessage(
            "Inserted " +
            value +
            " at position " +
            position +
            "."
        );

        clearInputs();

    }


    /* DELETE BEGIN */

    function deleteBegin() {

        if (list.length === 0) {

            setMessage(
                "Linked List is empty."
            );

            return;
        }


        const deleted =
            list.shift();

        render();

        setMessage(
            "Deleted " +
            deleted +
            " from beginning."
        );

    }


    /* DELETE END */

    function deleteEnd() {

        if (list.length === 0) {

            setMessage(
                "Linked List is empty."
            );

            return;
        }


        const deleted =
            list.pop();

        render();

        setMessage(
            "Deleted " +
            deleted +
            " from end."
        );

    }


    /* DELETE LOCATION */

    function deleteLocation() {

        if (list.length === 0) {

            setMessage(
                "Linked List is empty."
            );

            return;
        }


        const position =
            parseInt(positionInput.value);


        if (
            isNaN(position) ||
            position < 1 ||
            position > list.length
        ) {

            setMessage(
                "Invalid position. Enter position from 1 to " +
                list.length
            );

            return;
        }


        const deleted =
            list.splice(
                position - 1,
                1
            )[0];


        render();

        setMessage(
            "Deleted " +
            deleted +
            " from position " +
            position +
            "."
        );

        positionInput.value = "";

    }


    /* SEARCH */

    searchBtn.addEventListener(
        "click",
        function () {

            const value =
                getValue();

            if (value === null) return;


            const index =
                list.indexOf(value);


            render();


            if (index === -1) {

                setMessage(
                    value +
                    " not found in the linked list."
                );

                status.textContent =
                    "Not Found";

                return;

            }


            const nodes =
                document.querySelectorAll(".node");


            if (nodes[index]) {

                nodes[index]
                    .classList.add("search-found");

            }


            setMessage(
                value +
                " found at position " +
                (index + 1) +
                "."
            );

            status.textContent =
                "Found";

        }
    );


    /* RESET */

    resetBtn.addEventListener(
        "click",
        function () {

            list = [];

            selectedOperation = null;

            valueInput.value = "";

            positionInput.value = "";

            positionGroup.classList.add(
                "hidden"
            );

            insertBtn.querySelector(
                "span:first-child"
            ).textContent = "Insert";

            deleteBtn.querySelector(
                "span:first-child"
            ).textContent = "Delete";

            insertMenu.classList.remove(
                "show"
            );

            deleteMenu.classList.remove(
                "show"
            );

            render();

            setMessage(
                "Linked List has been reset."
            );

            status.textContent =
                "Ready";

        }
    );


    /* GET VALUE */

    function getValue() {

        const value =
            valueInput.value.trim();


        if (value === "") {

            setMessage(
                "Please enter a value."
            );

            valueInput.focus();

            return null;

        }


        return Number(value);

    }


    /* CLEAR VALUE */

    function clearValue() {

        valueInput.value = "";

    }


    /* CLEAR INPUTS */

    function clearInputs() {

        valueInput.value = "";

        positionInput.value = "";

    }


    /* MESSAGE */

    function setMessage(text) {

        message.textContent =
            text;

        status.textContent =
            "Ready";

    }


    /* RENDER */

    function render() {

        linkedList.innerHTML = "";

        nodeCount.textContent =
            list.length;


        if (list.length === 0) {

            const empty =
                document.createElement("div");

            empty.className =
                "empty-message";

            empty.textContent =
                "Linked List is empty";

            linkedList.appendChild(
                empty
            );

            return;

        }


        list.forEach(
            function (value, index) {

                const wrapper =
                    document.createElement(
                        "div"
                    );

                wrapper.className =
                    "node-wrapper";


                const node =
                    document.createElement(
                        "div"
                    );

                node.className =
                    "node";


                const data =
                    document.createElement(
                        "div"
                    );

                data.className =
                    "node-data";

                data.textContent =
                    value;


                const next =
                    document.createElement(
                        "div"
                    );

                next.className =
                    "node-next";

                next.textContent =
                    index === list.length - 1
                        ? "NULL"
                        : "next";


                node.appendChild(data);

                node.appendChild(next);

                wrapper.appendChild(node);


                if (
                    index <
                    list.length - 1
                ) {

                    const arrow =
                        document.createElement(
                            "span"
                        );

                    arrow.className =
                        "node-arrow";

                    arrow.textContent =
                        "→";

                    wrapper.appendChild(
                        arrow
                    );

                }


                linkedList.appendChild(
                    wrapper
                );

            }
        );

    }


    /* INITIAL RENDER */

    render();

});