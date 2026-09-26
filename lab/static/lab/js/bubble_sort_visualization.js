document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================
           VARIABLES
        ===================================== */

        let array = [];

        let originalArray = [];

        let i = 0;

        let j = 0;

        let comparisons = 0;

        let swaps = 0;

        let pass = 0;

        let running = false;

        let timer = null;

        let comparing = [];

        let swapping = [];

        let sortedFrom = [];


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

            j = 0;

            comparisons = 0;

            swaps = 0;

            pass = 0;

            comparing = [];

            swapping = [];

            sortedFrom = [];


            statusText.textContent =
                "Ready";

            instructionText.textContent =
                "Click Start or Next Step to begin.";

            operationText.textContent =
                "Array is ready for Bubble Sort.";


            updateStats();

            render();

        }


        /* =====================================
           RENDER ARRAY
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


                    /* BAR HEIGHT */

                    const height =
                        50 +
                        (
                            Math.abs(value)
                            / max
                        ) * 180;

                    bar.style.height =
                        height + "px";


                    /* VALUE */

                    const valueElement =
                        document.createElement(
                            "span"
                        );

                    valueElement.className =
                        "array-value";

                    valueElement.textContent =
                        value;


                    /* INDEX */

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


                    /* COMPARE */

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


                    /* SORTED */

                    if (
                        sortedFrom.includes(
                            index
                        )
                    ) {

                        bar.classList.add(
                            "sorted"
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
           CHECK SORT CONDITION
        ===================================== */

        function shouldSwap(
            first,
            second
        ) {

            if (
                orderSelect.value ===
                "desc"
            ) {

                return first < second;

            }

            return first > second;

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


            /* NEW PASS */

            if (
                j >= array.length - i - 1
            ) {

                sortedFrom.push(
                    array.length - i - 1
                );

                i++;

                j = 0;

                pass = i;

                comparing = [];

                swapping = [];

                updateStats();

                render();

                if (
                    i >= array.length - 1
                ) {

                    finish();

                    return;

                }

            }


            const left =
                j;

            const right =
                j + 1;


            comparing =
                [left, right];

            swapping = [];


            comparisons++;


            const first =
                array[left];

            const second =
                array[right];


            instructionText.textContent =
                "Comparing adjacent elements.";


            operationText.textContent =
                "Compare " +
                first +
                " and " +
                second +
                ".";


            render();

            updateStats();


            /* =================================
               SWAP
            ================================= */

            if (
                shouldSwap(
                    first,
                    second
                )
            ) {

                swapping =
                    [left, right];

                instructionText.textContent =
                    "Elements are in the wrong order. Swapping...";

                operationText.textContent =
                    first +
                    " and " +
                    second +
                    " → Swap";


                render();


                array[left] =
                    second;

                array[right] =
                    first;


                swaps++;


                updateStats();


                setTimeout(
                    function () {

                        swapping = [];

                        comparing =
                            [];

                        j++;

                        render();

                    },
                    400
                );

            }

            else {

                instructionText.textContent =
                    "Elements are already in the correct order.";

                operationText.textContent =
                    first +
                    " and " +
                    second +
                    " → No swap required.";

                comparing =
                    [];

                j++;

                render();

            }

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
                    900
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


            sortedFrom = [];


            for (
                let k = 0;
                k < array.length;
                k++
            ) {

                sortedFrom.push(k);

            }


            statusText.textContent =
                "Completed";

            instructionText.textContent =
                "Bubble Sort completed successfully.";

            operationText.textContent =
                "Array is completely sorted.";

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

            j = 0;

            comparisons = 0;

            swaps = 0;

            pass = 0;

            comparing = [];

            swapping = [];

            sortedFrom = [];


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
           BUTTON EVENTS
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