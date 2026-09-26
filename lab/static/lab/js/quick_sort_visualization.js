document.addEventListener(
    "DOMContentLoaded",
    function () {

        let array = [];

        let originalArray = [];

        let steps = [];

        let currentStep = 0;

        let comparisons = 0;

        let swaps = 0;

        let running = false;

        let timer = null;


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

        const stepText =
            document.getElementById(
                "stepText"
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

        const lowText =
            document.getElementById(
                "lowText"
            );

        const pivotText =
            document.getElementById(
                "pivotText"
            );

        const highText =
            document.getElementById(
                "highText"
            );


        /* =========================
           CREATE QUICK SORT STEPS
        ========================== */

        function createSteps(
            values
        ) {

            const working =
                [...values];

            const result = [];


            function partition(
                low,
                high
            ) {

                const pivot =
                    working[high];


                result.push({

                    type: "pivot",

                    low: low,

                    high: high,

                    pivotIndex: high,

                    pivotValue: pivot,

                    array:
                        [...working],

                    message:
                        "Select " +
                        pivot +
                        " as the pivot."
                });


                let i =
                    low - 1;


                for (
                    let j = low;
                    j < high;
                    j++
                ) {

                    result.push({

                        type: "compare",

                        low: low,

                        high: high,

                        pivotIndex: high,

                        currentIndex: j,

                        pivotValue: pivot,

                        array:
                            [...working],

                        message:
                            "Compare " +
                            working[j] +
                            " with pivot " +
                            pivot +
                            "."

                    });


                    let condition;


                    if (
                        orderSelect.value ===
                        "desc"
                    ) {

                        condition =
                            working[j] >= pivot;

                    }
                    else {

                        condition =
                            working[j] <= pivot;

                    }


                    if (
                        condition
                    ) {

                        i++;


                        if (
                            i !== j
                        ) {

                            const temp =
                                working[i];

                            working[i] =
                                working[j];

                            working[j] =
                                temp;


                            result.push({

                                type: "swap",

                                low: low,

                                high: high,

                                pivotIndex: high,

                                currentIndex: j,

                                swapIndex: i,

                                pivotValue: pivot,

                                array:
                                    [...working],

                                message:
                                    "Swap " +
                                    working[i] +
                                    " and " +
                                    working[j] +
                                    "."

                            });

                        }

                    }

                }


                const pivotPosition =
                    i + 1;


                const temp =
                    working[pivotPosition];

                working[pivotPosition] =
                    working[high];

                working[high] =
                    temp;


                result.push({

                    type: "pivotFixed",

                    low: low,

                    high: high,

                    pivotIndex:
                        pivotPosition,

                    pivotValue:
                        working[pivotPosition],

                    array:
                        [...working],

                    message:
                        "Pivot is now in its correct position."

                });


                return pivotPosition;

            }


            function quickSort(
                low,
                high
            ) {

                if (
                    low < high
                ) {

                    const pivotIndex =
                        partition(
                            low,
                            high
                        );


                    quickSort(
                        low,
                        pivotIndex - 1
                    );


                    quickSort(
                        pivotIndex + 1,
                        high
                    );

                }
                else if (
                    low === high
                ) {

                    result.push({

                        type: "single",

                        low: low,

                        high: high,

                        pivotIndex: low,

                        pivotValue:
                            working[low],

                        array:
                            [...working],

                        message:
                            "Only one element remains. It is already sorted."

                    });

                }

            }


            quickSort(
                0,
                working.length - 1
            );


            result.push({

                type: "complete",

                low: 0,

                high:
                    working.length - 1,

                array:
                    [...working],

                message:
                    "Quick Sort completed successfully."

            });


            return result;

        }


        /* =========================
           SET ARRAY
        ========================== */

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
                values.length < 2
            ) {

                alert(
                    "Please enter at least 2 numbers."
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


            steps =
                createSteps(
                    array
                );


            currentStep = 0;

            comparisons = 0;

            swaps = 0;


            statusText.textContent =
                "Ready";


            instructionText.textContent =
                "Click Start or Next Step to begin.";


            operationText.textContent =
                "Array is ready for Quick Sort.";


            updateStats();


            render(
                array,
                null
            );

        }


        /* =========================
           RENDER ARRAY
        ========================== */

        function render(
            values,
            state
        ) {

            arrayContainer.innerHTML =
                "";


            const max =
                Math.max(
                    ...values.map(
                        value =>
                            Math.abs(value)
                    ),
                    1
                );


            values.forEach(
                function (
                    value,
                    index
                ) {

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


                    if (
                        state
                    ) {

                        if (
                            state.type !==
                            "complete" &&
                            index >= state.low &&
                            index <= state.high
                        ) {

                            bar.classList.add(
                                "active"
                            );

                        }


                        if (
                            state.pivotIndex ===
                            index
                        ) {

                            bar.classList.remove(
                                "active"
                            );

                            bar.classList.add(
                                "pivot"
                            );

                        }


                        if (
                            state.type ===
                            "compare" &&
                            index ===
                            state.currentIndex
                        ) {

                            bar.classList.remove(
                                "active"
                            );

                            bar.classList.add(
                                "compare"
                            );

                        }


                        if (
                            state.type ===
                            "swap" &&
                            (
                                index ===
                                state.currentIndex ||
                                index ===
                                state.swapIndex
                            )
                        ) {

                            bar.classList.remove(
                                "active"
                            );

                            bar.classList.add(
                                "compare"
                            );

                        }


                        if (
                            state.type ===
                            "pivotFixed" &&
                            index ===
                            state.pivotIndex
                        ) {

                            bar.classList.remove(
                                "active"
                            );

                            bar.classList.add(
                                "sorted"
                            );

                        }


                        if (
                            state.type ===
                            "complete"
                        ) {

                            bar.classList.add(
                                "sorted"
                            );

                        }

                    }


                    arrayContainer.appendChild(
                        bar
                    );

                }
            );


            if (
                state
            ) {

                lowText.textContent =
                    state.low !== undefined
                        ? state.low
                        : "-";


                highText.textContent =
                    state.high !== undefined
                        ? state.high
                        : "-";


                pivotText.textContent =
                    state.pivotValue !== undefined
                        ? state.pivotValue
                        : "-";

            }
            else {

                lowText.textContent =
                    "-";

                pivotText.textContent =
                    "-";

                highText.textContent =
                    "-";

            }

        }


        /* =========================
           NEXT STEP
        ========================== */

        function nextStep() {

            if (
                currentStep >=
                steps.length
            ) {

                finish();

                return;

            }


            const step =
                steps[currentStep];


            if (
                step.type ===
                "compare"
            ) {

                comparisons++;

            }


            if (
                step.type ===
                "swap"
            ) {

                swaps++;

            }


            array =
                [...step.array];


            instructionText.textContent =
                step.message;


            operationText.textContent =
                step.message;


            statusText.textContent =
                "Running";


            currentStep++;


            updateStats();


            render(
                array,
                step
            );


            if (
                currentStep >=
                steps.length
            ) {

                setTimeout(
                    finish,
                    500
                );

            }

        }


        /* =========================
           START
        ========================== */

        function start() {

            if (
                running
            ) {

                return;

            }


            if (
                currentStep >=
                steps.length
            ) {

                reset();

            }


            running = true;


            statusText.textContent =
                "Running";


            timer =
                setInterval(
                    nextStep,
                    850
                );

        }


        /* =========================
           PAUSE
        ========================== */

        function pause() {

            running = false;


            clearInterval(
                timer
            );


            timer = null;


            if (
                statusText.textContent !==
                "Completed"
            ) {

                statusText.textContent =
                    "Paused";

            }

        }


        /* =========================
           FINISH
        ========================== */

        function finish() {

            pause();


            array =
                [...array].sort(
                    function (
                        a,
                        b
                    ) {

                        return orderSelect.value ===
                            "desc"
                            ? b - a
                            : a - b;

                    }
                );


            statusText.textContent =
                "Completed";


            instructionText.textContent =
                "Quick Sort completed successfully.";


            operationText.textContent =
                "The pivot has been placed correctly at each partition and the complete array is sorted.";


            lowText.textContent =
                "-";

            pivotText.textContent =
                "-";

            highText.textContent =
                "-";


            render(
                array,
                {
                    type: "complete"
                }
            );

        }


        /* =========================
           RESET
        ========================== */

        function reset() {

            pause();


            array =
                [...originalArray];


            steps =
                createSteps(
                    array
                );


            currentStep = 0;

            comparisons = 0;

            swaps = 0;


            statusText.textContent =
                "Ready";


            instructionText.textContent =
                "Click Start or Next Step to begin.";


            operationText.textContent =
                "Array has been reset.";


            updateStats();


            render(
                array,
                null
            );

        }


        /* =========================
           UPDATE STATS
        ========================== */

        function updateStats() {

            stepText.textContent =
                currentStep;

            comparisonText.textContent =
                comparisons;

            swapText.textContent =
                swaps;

        }


        /* =========================
           EVENTS
        ========================== */

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


        orderSelect.addEventListener(
            "change",
            function () {

                if (
                    array.length > 0
                ) {

                    setArray();

                }

            }
        );


        /* INITIAL */

        setArray();

    }
);