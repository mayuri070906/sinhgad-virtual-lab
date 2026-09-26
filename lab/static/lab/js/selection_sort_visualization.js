document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================
           VARIABLES
        ===================================== */

        let array = [];

        let originalArray = [];

        let i = 0;

        let j = 1;

        let minIndex = 0;

        let comparisons = 0;

        let swaps = 0;

        let pass = 0;

        let running = false;

        let timer = null;

        let comparing = [];

        let swapping = [];

        let sortedIndexes = [];


        /* =====================================
           ELEMENTS
        ===================================== */

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

        const swapText =
            document.getElementById(
                "swapText"
            );

        const instructionText =
            document.getElementById(
                "instructionText"
            );

        const operationText =
            document.getElementById(
                "operationText"
            );


        /* =====================================
           SET ARRAY
        ===================================== */

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


            array =
                [...values];

            originalArray =
                [...values];


            i = 0;

            j = 1;

            minIndex = 0;

            comparisons = 0;

            swaps = 0;

            pass = 0;

            comparing = [];

            swapping = [];

            sortedIndexes = [];


            statusText.textContent =
                "Ready";

            instructionText.textContent =
                "Click Start or Next Step to begin.";

            operationText.textContent =
                "Array is ready for Selection Sort.";


            updateStats();

            render();

        }


        /* =====================================
           RENDER
        ===================================== */

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


                    /* SORTED */

                    if (
                        sortedIndexes.includes(
                            index
                        )
                    ) {

                        bar.classList.add(
                            "sorted"
                        );

                    }


                    /* MINIMUM */

                    if (
                        index === minIndex &&
                        !sortedIndexes.includes(
                            index
                        )
                    ) {

                        bar.classList.add(
                            "minimum"
                        );

                    }


                    /* COMPARISON */

                    if (
                        comparing.includes(
                            index
                        )
                    ) {

                        bar.classList.add(
                            "compare"
                        );

                    }


                    /* SWAP */

                    if (
                        swapping.includes(
                            index
                        )
                    ) {

                        bar.classList.add(
                            "swap"
                        );

                    }


                    arrayContainer.appendChild(
                        bar
                    );

                }
            );

        }


        /* =====================================
           STATS
        ===================================== */

        function updateStats() {

            passText.textContent =
                pass;

            comparisonText.textContent =
                comparisons;

            swapText.textContent =
                swaps;

        }


        /* =====================================
           SHOULD UPDATE MIN
        ===================================== */

        function shouldUpdateMinimum(
            current,
            minimum
        ) {

            if (
                orderSelect.value ===
                "desc"
            ) {

                return current > minimum;

            }

            return current < minimum;

        }


        /* =====================================
           NEXT STEP
        ===================================== */

        function nextStep() {

            if (
                array.length < 2
            ) {

                return;

            }


            /* FINISHED */

            if (
                i >= array.length - 1
            ) {

                finish();

                return;

            }


            /* START NEW PASS */

            if (
                j >= array.length
            ) {

                comparing = [];

                swapping = [];


                sortedIndexes.push(i);


                if (
                    minIndex !== i
                ) {

                    swapping =
                        [i, minIndex];

                }


                /* SWAP */

                if (
                    minIndex !== i
                ) {

                    const temp =
                        array[i];

                    array[i] =
                        array[minIndex];

                    array[minIndex] =
                        temp;

                    swaps++;

                }


                pass =
                    i + 1;


                updateStats();

                render();


                setTimeout(
                    function () {

                        swapping = [];

                        i++;

                        j = i + 1;

                        minIndex = i;

                        comparing = [];

                        render();

                    },
                    500
                );


                return;

            }


            /* COMPARISON */

            comparing =
                [minIndex, j];


            comparisons++;


            instructionText.textContent =
                "Comparing current minimum with the next element.";


            operationText.textContent =
                "Compare " +
                array[minIndex] +
                " with " +
                array[j] +
                ".";


            render();

            updateStats();


            /* NEW MINIMUM */

            if (
                shouldUpdateMinimum(
                    array[j],
                    array[minIndex]
                )
            ) {

                minIndex = j;


                operationText.textContent =
                    "New minimum selected: " +
                    array[minIndex];


                instructionText.textContent =
                    "A new minimum element has been found.";

            }


            j++;


            setTimeout(
                function () {

                    comparing = [];

                    render();

                },
                350
            );

        }


        /* =====================================
           START
        ===================================== */

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

                        if (
                            i >=
                            array.length - 1
                        ) {

                            finish();

                            return;

                        }


                        nextStep();

                    },
                    800
                );

        }


        /* =====================================
           PAUSE
        ===================================== */

        function pause() {

            running = false;

            clearInterval(
                timer
            );

            timer = null;


            if (
                array.length > 0
            ) {

                statusText.textContent =
                    "Paused";

            }

        }


        /* =====================================
           FINISH
        ===================================== */

        function finish() {

            pause();


            comparing = [];

            swapping = [];


            sortedIndexes = [];


            for (
                let k = 0;
                k < array.length;
                k++
            ) {

                sortedIndexes.push(k);

            }


            statusText.textContent =
                "Completed";


            instructionText.textContent =
                "Selection Sort completed successfully.";


            operationText.textContent =
                "All elements are now in their correct positions.";


            render();

            updateStats();

        }


        /* =====================================
           RESET
        ===================================== */

        function reset() {

            pause();


            array =
                [...originalArray];


            i = 0;

            j = 1;

            minIndex = 0;

            comparisons = 0;

            swaps = 0;

            pass = 0;

            comparing = [];

            swapping = [];

            sortedIndexes = [];


            statusText.textContent =
                "Ready";


            instructionText.textContent =
                "Click Start or Next Step to begin.";


            operationText.textContent =
                "Array has been reset.";


            updateStats();

            render();

        }


        /* =====================================
           EVENTS
        ===================================== */

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


        /* =====================================
           INITIALIZE
        ===================================== */

        setArray();

    }
);