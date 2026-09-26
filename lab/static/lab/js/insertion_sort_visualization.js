document.addEventListener(
    "DOMContentLoaded",
    function () {

        let array = [];

        let originalArray = [];

        let i = 1;

        let j = 0;

        let key = null;

        let comparisons = 0;

        let shifts = 0;

        let pass = 0;

        let running = false;

        let timer = null;

        let currentState = "ready";

        let activeIndexes = [];


        /* ELEMENTS */

        const arrayInput =
            document.getElementById(
                "arrayInput"
            );

        const orderSelect =
            document.getElementById(
                "orderSelect"
            );

        const arrayContainer =
            document.getElementById(
                "arrayContainer"
            );

        const setArrayBtn =
            document.getElementById(
                "setArrayBtn"
            );

        const startBtn =
            document.getElementById(
                "startBtn"
            );

        const pauseBtn =
            document.getElementById(
                "pauseBtn"
            );

        const nextBtn =
            document.getElementById(
                "nextBtn"
            );

        const resetBtn =
            document.getElementById(
                "resetBtn"
            );

        const statusText =
            document.getElementById(
                "statusText"
            );

        const passText =
            document.getElementById(
                "passText"
            );

        const comparisonText =
            document.getElementById(
                "comparisonText"
            );

        const shiftText =
            document.getElementById(
                "shiftText"
            );

        const instructionText =
            document.getElementById(
                "instructionText"
            );

        const operationText =
            document.getElementById(
                "operationText"
            );


        /* SET ARRAY */

        function setArray() {

            pause();


            const values =
                arrayInput.value
                .split(",")
                .map(
                    value =>
                        Number(
                            value.trim()
                        )
                )
                .filter(
                    value =>
                        Number.isFinite(value)
                );


            if (
                values.length === 0
            ) {

                alert(
                    "Please enter valid numbers."
                );

                return;

            }


            if (
                values.length > 15
            ) {

                alert(
                    "Please enter maximum 15 values."
                );

                return;

            }


            array = [...values];

            originalArray = [...values];


            i = 1;

            j = 0;

            key = null;

            comparisons = 0;

            shifts = 0;

            pass = 0;

            currentState = "ready";

            activeIndexes = [];


            statusText.textContent =
                "Ready";

            instructionText.textContent =
                "Click Start or Next Step to begin.";

            operationText.textContent =
                "Array is ready for Insertion Sort.";


            updateStats();

            render();

        }


        /* RENDER */

        function render() {

            arrayContainer.innerHTML = "";


            if (
                array.length === 0
            ) {

                return;

            }


            const max =
                Math.max(
                    ...array.map(
                        value =>
                            Math.abs(value)
                    ),
                    1
                );


            array.forEach(
                function (value, index) {

                    const bar =
                        document.createElement(
                            "div"
                        );


                    bar.className =
                        "array-bar";


                    const height =
                        50 +
                        (
                            Math.abs(value)
                            / max
                        ) * 180;


                    bar.style.height =
                        height + "px";


                    const valueElement =
                        document.createElement(
                            "span"
                        );


                    valueElement.className =
                        "array-value";

                    valueElement.textContent =
                        value;


                    const indexElement =
                        document.createElement(
                            "span"
                        );


                    indexElement.className =
                        "array-index";

                    indexElement.textContent =
                        "Index " + index;


                    bar.appendChild(
                        valueElement
                    );

                    bar.appendChild(
                        indexElement
                    );


                    /* SORTED PREFIX */

                    if (
                        i > 0 &&
                        index < i &&
                        currentState !==
                        "ready"
                    ) {

                        bar.classList.add(
                            "sorted"
                        );

                    }


                    /* KEY */

                    if (
                        index === j &&
                        key !== null &&
                        currentState ===
                        "key"
                    ) {

                        bar.classList.add(
                            "key"
                        );

                    }


                    /* COMPARISON */

                    if (
                        activeIndexes.includes(
                            index
                        ) &&
                        currentState ===
                        "compare"
                    ) {

                        bar.classList.add(
                            "compare"
                        );

                    }


                    /* SHIFT */

                    if (
                        activeIndexes.includes(
                            index
                        ) &&
                        currentState ===
                        "shift"
                    ) {

                        bar.classList.add(
                            "shift"
                        );

                    }


                    arrayContainer.appendChild(
                        bar
                    );

                }
            );

        }


        /* STATS */

        function updateStats() {

            passText.textContent =
                pass;

            comparisonText.textContent =
                comparisons;

            shiftText.textContent =
                shifts;

        }


        /* COMPARISON FUNCTION */

        function shouldShift(
            value,
            keyValue
        ) {

            if (
                orderSelect.value ===
                "desc"
            ) {

                return value < keyValue;

            }

            return value > keyValue;

        }


        /* NEXT STEP */

        function nextStep() {

            if (
                array.length < 2
            ) {

                return;

            }


            /* COMPLETE */

            if (
                i >= array.length
            ) {

                finish();

                return;

            }


            /* SELECT KEY */

            if (
                currentState ===
                "ready"
            ) {

                key =
                    array[i];

                j =
                    i - 1;

                pass =
                    i;


                currentState =
                    "key";


                instructionText.textContent =
                    "Select the next element as the key.";

                operationText.textContent =
                    "Key selected: " +
                    key;


                updateStats();

                render();

                return;

            }


            /* KEY STATE */

            if (
                currentState ===
                "key"
            ) {

                if (
                    j >= 0
                ) {

                    currentState =
                        "compare";

                    activeIndexes =
                        [j];


                    instructionText.textContent =
                        "Compare the key with the previous element.";

                    operationText.textContent =
                        "Comparing " +
                        key +
                        " with " +
                        array[j] +
                        ".";


                    comparisons++;


                    updateStats();

                    render();

                    return;

                }


                insertKey();

                return;

            }


            /* COMPARE STATE */

            if (
                currentState ===
                "compare"
            ) {

                if (
                    j >= 0 &&
                    shouldShift(
                        array[j],
                        key
                    )
                ) {

                    currentState =
                        "shift";

                    activeIndexes =
                        [j, j + 1];


                    instructionText.textContent =
                        "The element is larger than the key. Shift it right.";

                    operationText.textContent =
                        "Shift " +
                        array[j] +
                        " one position to the right.";


                    updateStats();

                    render();

                    return;

                }


                insertKey();

                return;

            }


            /* SHIFT STATE */

            if (
                currentState ===
                "shift"
            ) {

                array[j + 1] =
                    array[j];

                shifts++;

                j--;


                if (
                    j >= 0
                ) {

                    currentState =
                        "compare";

                    activeIndexes =
                        [j];

                    instructionText.textContent =
                        "Continue comparing with the previous element.";

                    operationText.textContent =
                        "Continue searching for the correct position of the key.";

                }
                else {

                    insertKey();

                }


                updateStats();

                render();

            }

        }


        /* INSERT KEY */

        function insertKey() {

            array[j + 1] =
                key;


            instructionText.textContent =
                "Insert the key into its correct position.";

            operationText.textContent =
                "Inserted " +
                key +
                " at index " +
                (j + 1) +
                ".";


            activeIndexes =
                [j + 1];


            currentState =
                "insert";


            render();


            setTimeout(
                function () {

                    i++;

                    key = null;

                    j = i - 1;

                    activeIndexes = [];


                    if (
                        i >= array.length
                    ) {

                        finish();

                        return;

                    }


                    currentState =
                        "key";


                    key =
                        array[i];

                    j =
                        i - 1;

                    pass =
                        i;


                    instructionText.textContent =
                        "Select the next key.";

                    operationText.textContent =
                        "Next key: " +
                        key;


                    updateStats();

                    render();

                },
                500
            );

        }


        /* START */

        function start() {

            if (
                running
            ) {

                return;

            }


            running = true;

            statusText.textContent =
                "Running";


            timer =
                setInterval(
                    function () {

                        nextStep();

                    },
                    750
                );

        }


        /* PAUSE */

        function pause() {

            running = false;

            clearInterval(
                timer
            );

            timer = null;


            if (
                array.length > 0 &&
                statusText.textContent !==
                "Completed"
            ) {

                statusText.textContent =
                    "Paused";

            }

        }


        /* FINISH */

        function finish() {

            pause();


            currentState =
                "complete";

            activeIndexes = [];


            statusText.textContent =
                "Completed";


            instructionText.textContent =
                "Insertion Sort completed successfully.";


            operationText.textContent =
                "All elements are now sorted.";


            pass =
                Math.max(
                    0,
                    array.length - 1
                );


            updateStats();


            arrayContainer.innerHTML = "";


            const max =
                Math.max(
                    ...array.map(
                        value =>
                            Math.abs(value)
                    ),
                    1
                );


            array.forEach(
                function (value, index) {

                    const bar =
                        document.createElement(
                            "div"
                        );


                    bar.className =
                        "array-bar sorted";


                    const height =
                        50 +
                        (
                            Math.abs(value)
                            / max
                        ) * 180;


                    bar.style.height =
                        height + "px";


                    const valueElement =
                        document.createElement(
                            "span"
                        );


                    valueElement.className =
                        "array-value";

                    valueElement.textContent =
                        value;


                    const indexElement =
                        document.createElement(
                            "span"
                        );


                    indexElement.className =
                        "array-index";

                    indexElement.textContent =
                        "Index " + index;


                    bar.appendChild(
                        valueElement
                    );

                    bar.appendChild(
                        indexElement
                    );


                    arrayContainer.appendChild(
                        bar
                    );

                }
            );

        }


        /* RESET */

        function reset() {

            pause();


            array =
                [...originalArray];


            i = 1;

            j = 0;

            key = null;

            comparisons = 0;

            shifts = 0;

            pass = 0;

            currentState =
                "ready";

            activeIndexes = [];


            statusText.textContent =
                "Ready";

            instructionText.textContent =
                "Click Start or Next Step to begin.";

            operationText.textContent =
                "Array has been reset.";


            updateStats();

            render();

        }


        /* EVENTS */

        setArrayBtn.addEventListener(
            "click",
            setArray
        );


        startBtn.addEventListener(
            "click",
            start
        );


        pauseBtn.addEventListener(
            "click",
            pause
        );


        nextBtn.addEventListener(
            "click",
            function () {

                pause();

                nextStep();

            }
        );


        resetBtn.addEventListener(
            "click",
            reset
        );


        /* INITIAL */

        setArray();

    }
);