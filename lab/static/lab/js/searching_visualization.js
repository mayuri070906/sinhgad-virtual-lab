document.addEventListener("DOMContentLoaded", function () {

    let array = [];

    let searchValue = null;

    let searchType = "linear";

    let currentStep = 0;

    let low = 0;

    let high = 0;

    let found = false;

    let finished = false;


    /* ELEMENTS */

    const arrayInput =
        document.getElementById("array-input");

    const searchInput =
        document.getElementById("search-input");

    const searchTypeInput =
        document.getElementById("search-type");

    const startBtn =
        document.getElementById("start-btn");

    const stepBtn =
        document.getElementById("step-btn");

    const resetBtn =
        document.getElementById("reset-btn");

    const arrayContainer =
        document.getElementById("array-container");

    const indexContainer =
        document.getElementById("index-container");

    const message =
        document.getElementById("message");

    const status =
        document.getElementById("status");


    /* START SEARCH */

    startBtn.addEventListener(
        "click",
        function () {

            const values =
                arrayInput.value
                    .split(",")
                    .map(value => Number(value.trim()))
                    .filter(value => !isNaN(value));


            if (values.length === 0) {

                setMessage(
                    "Please enter array values."
                );

                return;

            }


            if (searchInput.value === "") {

                setMessage(
                    "Please enter a search value."
                );

                return;

            }


            array = values;

            searchValue =
                Number(searchInput.value);

            searchType =
                searchTypeInput.value;

            currentStep = 0;

            found = false;

            finished = false;


            if (searchType === "linear") {

                low = 0;

                high = array.length - 1;

            }

            else {

                /*
                 Binary Search requires sorted array.
                 */

                array.sort(
                    function (a, b) {
                        return a - b;
                    }
                );

                low = 0;

                high = array.length - 1;

            }


            renderArray();

            setMessage(
                searchType === "linear"
                    ? "Linear Search started."
                    : "Binary Search started."
            );

            status.textContent =
                "Searching";

        }
    );


    /* NEXT STEP */

    stepBtn.addEventListener(
        "click",
        function () {

            if (array.length === 0) {

                setMessage(
                    "Start a search first."
                );

                return;

            }


            if (finished) {

                setMessage(
                    "Search has already finished."
                );

                return;

            }


            if (searchType === "linear") {

                linearStep();

            }

            else {

                binaryStep();

            }

        }
    );


    /* LINEAR SEARCH */

    function linearStep() {

        if (
            currentStep >=
            array.length
        ) {

            finishNotFound();

            return;

        }


        clearHighlights();


        const index =
            currentStep;


        highlightChecking(index);


        if (
            array[index] ===
            searchValue
        ) {

            highlightFound(index);

            found = true;

            finished = true;

            status.textContent =
                "Found";

            setMessage(
                "✓ " +
                searchValue +
                " found at index " +
                index +
                " (position " +
                (index + 1) +
                ")."
            );

            return;

        }


        setMessage(
            "Checking index " +
            index +
            ": " +
            array[index] +
            " ≠ " +
            searchValue
        );


        currentStep++;


        if (
            currentStep >=
            array.length
        ) {

            setTimeout(
                function () {

                    if (!found) {

                        finishNotFound();

                    }

                },
                300
            );

        }

    }


    /* BINARY SEARCH */

    function binaryStep() {

        if (low > high) {

            finishNotFound();

            return;

        }


        clearHighlights();


        const mid =
            Math.floor(
                (low + high) / 2
            );


        highlightChecking(mid);


        if (
            array[mid] ===
            searchValue
        ) {

            highlightFound(mid);

            found = true;

            finished = true;

            status.textContent =
                "Found";

            setMessage(
                "✓ " +
                searchValue +
                " found at index " +
                mid +
                " (position " +
                (mid + 1) +
                ")."
            );

            return;

        }


        if (
            searchValue <
            array[mid]
        ) {

            setMessage(
                "Middle = " +
                array[mid] +
                ". Search value is smaller → move LEFT."
            );

            high = mid - 1;

        }

        else {

            setMessage(
                "Middle = " +
                array[mid] +
                ". Search value is larger → move RIGHT."
            );

            low = mid + 1;

        }


        markOutsideRange();


        if (low > high) {

            setTimeout(
                function () {

                    finishNotFound();

                },
                300
            );

        }

    }


    /* RENDER */

    function renderArray() {

        arrayContainer.innerHTML = "";

        indexContainer.innerHTML = "";


        array.forEach(
            function (value, index) {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "array-item";

                item.textContent =
                    value;

                item.dataset.index =
                    index;

                arrayContainer.appendChild(
                    item
                );


                const indexItem =
                    document.createElement(
                        "div"
                    );

                indexItem.className =
                    "index-item";

                indexItem.textContent =
                    "index " + index;

                indexContainer.appendChild(
                    indexItem
                );

            }
        );

    }


    /* CHECKING */

    function highlightChecking(index) {

        const items =
            document.querySelectorAll(
                ".array-item"
            );


        if (items[index]) {

            items[index]
                .classList.add(
                    "checking"
                );

        }

    }


    /* FOUND */

    function highlightFound(index) {

        const items =
            document.querySelectorAll(
                ".array-item"
            );


        if (items[index]) {

            items[index]
                .classList.remove(
                    "checking"
                );

            items[index]
                .classList.add(
                    "found"
                );

        }

    }


    /* CLEAR */

    function clearHighlights() {

        const items =
            document.querySelectorAll(
                ".array-item"
            );


        items.forEach(
            function (item) {

                item.classList.remove(
                    "checking",
                    "found",
                    "not-found"
                );

            }
        );

    }


    /* MARK OUTSIDE BINARY RANGE */

    function markOutsideRange() {

        const items =
            document.querySelectorAll(
                ".array-item"
            );


        items.forEach(
            function (item, index) {

                if (
                    index < low ||
                    index > high
                ) {

                    item.classList.add(
                        "not-found"
                    );

                }

            }
        );

    }


    /* NOT FOUND */

    function finishNotFound() {

        finished = true;

        found = false;

        status.textContent =
            "Not Found";


        const items =
            document.querySelectorAll(
                ".array-item"
            );


        items.forEach(
            function (item) {

                item.classList.add(
                    "not-found"
                );

            }
        );


        setMessage(
            "✕ " +
            searchValue +
            " was not found in the array."
        );

    }


    /* MESSAGE */

    function setMessage(text) {

        message.textContent =
            text;

    }


    /* RESET */

    resetBtn.addEventListener(
        "click",
        function () {

            array = [];

            searchValue = null;

            currentStep = 0;

            low = 0;

            high = 0;

            found = false;

            finished = false;

            arrayInput.value = "";

            searchInput.value = "";

            searchTypeInput.value =
                "linear";


            arrayContainer.innerHTML =
                '<div class="empty-array">' +
                'Enter an array and click Start.' +
                '</div>';


            indexContainer.innerHTML =
                "";


            setMessage(
                "Ready to search."
            );

            status.textContent =
                "Ready";

        }
    );

});