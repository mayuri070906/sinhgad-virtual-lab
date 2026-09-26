document.addEventListener(
    "DOMContentLoaded",
    function () {

        let array = [];

        let originalArray = [];

        let steps = [];

        let currentStep = 0;

        let comparisons = 0;

        let merges = 0;

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

        const mergeText =
            document.getElementById(
                "mergeText"
            );

        const instructionText =
            document.getElementById(
                "instructionText"
            );

        const operationText =
            document.getElementById(
                "operationText"
            );

        const leftText =
            document.getElementById(
                "leftText"
            );

        const middleText =
            document.getElementById(
                "middleText"
            );

        const rightText =
            document.getElementById(
                "rightText"
            );


        /* =========================
           CREATE STEPS
        ========================== */

        function createSteps(
            values
        ) {

            const result = [];

            const working =
                [...values];


            function divide(
                low,
                high
            ) {

                if (
                    low >= high
                ) {

                    result.push({

                        type: "base",

                        low: low,

                        high: high,

                        array:
                            [...working],

                        message:
                            "Single element reached. It is already sorted."

                    });

                    return;

                }


                const mid =
                    Math.floor(
                        (low + high) / 2
                    );


                result.push({

                    type: "divide",

                    low: low,

                    mid: mid,

                    high: high,

                    array:
                        [...working],

                    message:
                        "Divide the array into two halves."

                });


                divide(
                    low,
                    mid
                );


                divide(
                    mid + 1,
                    high
                );


                merge(
                    low,
                    mid,
                    high
                );

            }


            function merge(
                low,
                mid,
                high
            ) {

                let left =
                    working.slice(
                        low,
                        mid + 1
                    );


                let right =
                    working.slice(
                        mid + 1,
                        high + 1
                    );


                let i = 0;

                let j = 0;

                let k = low;


                result.push({

                    type: "mergeStart",

                    low: low,

                    mid: mid,

                    high: high,

                    array:
                        [...working],

                    message:
                        "Merge the two sorted halves."

                });


                while (
                    i < left.length &&
                    j < right.length
                ) {

                    result.push({

                        type: "compare",

                        low: low,

                        mid: mid,

                        high: high,

                        leftIndex:
                            low + i,

                        rightIndex:
                            mid + 1 + j,

                        array:
                            [...working],

                        message:
                            "Compare " +
                            left[i] +
                            " and " +
                            right[j] +
                            "."

                    });


                    let chooseLeft;


                    if (
                        orderSelect.value ===
                        "desc"
                    ) {

                        chooseLeft =
                            left[i] >= right[j];

                    }
                    else {

                        chooseLeft =
                            left[i] <= right[j];

                    }


                    if (
                        chooseLeft
                    ) {

                        working[k] =
                            left[i];

                        i++;

                    }
                    else {

                        working[k] =
                            right[j];

                        j++;

                    }


                    k++;


                    result.push({

                        type: "place",

                        low: low,

                        mid: mid,

                        high: high,

                        index:
                            k - 1,

                        array:
                            [...working],

                        message:
                            "Place the selected element into the merged array."

                    });

                }


                while (
                    i < left.length
                ) {

                    working[k] =
                        left[i];

                    i++;

                    k++;


                    result.push({

                        type: "place",

                        low: low,

                        mid: mid,

                        high: high,

                        index:
                            k - 1,

                        array:
                            [...working],

                        message:
                            "Copy the remaining element from the left half."

                    });

                }


                while (
                    j < right.length
                ) {

                    working[k] =
                        right[j];

                    j++;

                    k++;


                    result.push({

                        type: "place",

                        low: low,

                        mid: mid,

                        high: high,

                        index:
                            k - 1,

                        array:
                            [...working],

                        message:
                            "Copy the remaining element from the right half."

                    });

                }


                result.push({

                    type: "merged",

                    low: low,

                    mid: mid,

                    high: high,

                    array:
                        [...working],

                    message:
                        "The current section has been merged successfully."

                });

            }


            divide(
                0,
                working.length - 1
            );


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

            merges = 0;


            statusText.textContent =
                "Ready";

            instructionText.textContent =
                "Click Start or Next Step to begin.";

            operationText.textContent =
                "Array is ready for Merge Sort.";


            updateStats();

            render(
                array,
                null
            );

        }


        /* =========================
           RENDER
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
                            index >= state.low &&
                            index <= state.mid
                        ) {

                            bar.classList.add(
                                "left-half"
                            );

                        }


                        if (
                            index > state.mid &&
                            index <= state.high
                        ) {

                            bar.classList.add(
                                "right-half"
                            );

                        }


                        if (
                            state.type ===
                            "compare" &&
                            (
                                index ===
                                state.leftIndex ||
                                index ===
                                state.rightIndex
                            )
                        ) {

                            bar.classList.add(
                                "compare"
                            );

                        }


                        if (
                            state.type ===
                            "place" &&
                            index ===
                            state.index
                        ) {

                            bar.classList.add(
                                "compare"
                            );

                        }


                        if (
                            state.type ===
                            "merged" &&
                            index >= state.low &&
                            index <= state.high
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

                leftText.textContent =
                    state.low;

                middleText.textContent =
                    state.mid !== undefined
                        ? state.mid
                        : "-";

                rightText.textContent =
                    state.high;

            }
            else {

                leftText.textContent =
                    "-";

                middleText.textContent =
                    "-";

                rightText.textContent =
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
                "merged"
            ) {

                merges++;

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


            stepText.textContent =
                currentStep;


            comparisonText.textContent =
                comparisons;


            mergeText.textContent =
                merges;


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
                "Merge Sort completed successfully.";


            operationText.textContent =
                "All elements have been divided and merged into sorted order.";


            leftText.textContent =
                "-";

            middleText.textContent =
                "-";

            rightText.textContent =
                "-";


            render(
                array,
                null
            );


            arrayContainer
                .querySelectorAll(
                    ".array-bar"
                )
                .forEach(
                    bar => {

                        bar.classList.add(
                            "sorted"
                        );

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

            merges = 0;


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

            mergeText.textContent =
                merges;

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