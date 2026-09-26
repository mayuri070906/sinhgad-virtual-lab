document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       ELEMENTS
    ========================================= */

    const languageSelect =
        document.getElementById("languageSelect");

    const codeTextarea =
        document.getElementById("codeTextarea");

    const lineNumbers =
        document.getElementById("lineNumbers");

    const runCodeBtn =
        document.getElementById("runCodeBtn");

    const clearCodeBtn =
        document.getElementById("clearCodeBtn");

    const outputBox =
        document.getElementById("outputBox");

    const terminalContainer =
        document.getElementById("terminalContainer");


    if (
        !languageSelect ||
        !codeTextarea ||
        !lineNumbers ||
        !runCodeBtn ||
        !clearCodeBtn ||
        !outputBox ||
        !terminalContainer
    ) {
        console.error("Code Editor elements not found.");
        return;
    }


    /* =========================================
       STATE
    ========================================= */

    let socket = null;

    let isRunning = false;

    let terminalInput = null;


    /* =========================================
       DEFAULT CODE
    ========================================= */

    function getDefaultCode(language) {

        if (language === "c") {

            return `#include <stdio.h>

int main() {

    int n;

    printf("Enter a number: ");
    scanf("%d", &n);

    printf("Square = %d\\n", n * n);
    printf("Cube = %d\\n", n * n * n);

    return 0;
}`;
        }


        if (language === "cpp") {

            return `#include <iostream>
using namespace std;

int main() {

    int n;

    cout << "Enter a number: ";
    cin >> n;

    cout << "Square = " << n * n << endl;
    cout << "Cube = " << n * n * n << endl;

    return 0;
}`;
        }


        if (language === "java") {

            return `import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a number: ");

        int n = sc.nextInt();

        System.out.println("Square = " + (n * n));
        System.out.println("Cube = " + (n * n * n));

    }
}`;
        }


        if (language === "python") {

            return `n = int(input("Enter a number: "))

print("Square =", n * n)
print("Cube =", n * n * n)`;
        }


        return "";
    }


    /* =========================================
       LINE NUMBERS
    ========================================= */

    function updateLineNumbers() {

        const lineCount =
            codeTextarea.value.split("\n").length;

        lineNumbers.innerHTML = "";

        for (let i = 1; i <= lineCount; i++) {

            const span =
                document.createElement("span");

            span.textContent = i;

            lineNumbers.appendChild(span);
        }
    }


    /* =========================================
       OUTPUT
    ========================================= */

    function setOutput(text) {

        outputBox.textContent = text;

        terminalContainer.scrollTop =
            terminalContainer.scrollHeight;
    }


    function appendOutput(text) {

        outputBox.textContent += text;

        terminalContainer.scrollTop =
            terminalContainer.scrollHeight;
    }


    /* =========================================
       TERMINAL INPUT
    ========================================= */

    function createTerminalInput() {

        if (terminalInput) {
            terminalInput.focus();
            return;
        }


        const row =
            document.createElement("div");

        row.className =
            "terminal-input-row";


        const prompt =
            document.createElement("span");

        prompt.className =
            "terminal-prompt";

        prompt.textContent = ">";


        terminalInput =
            document.createElement("input");

        terminalInput.type = "text";

        terminalInput.className =
            "terminal-input";

        terminalInput.placeholder =
            "Enter input and press Enter...";


        terminalInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    sendInput();
                }
            }
        );


        row.appendChild(prompt);

        row.appendChild(terminalInput);

        terminalContainer.appendChild(row);

        terminalContainer.scrollTop =
            terminalContainer.scrollHeight;

        terminalInput.focus();
    }


    function removeTerminalInput() {

        if (!terminalInput) {
            return;
        }


        const row =
            terminalInput.parentElement;

        if (row) {
            row.remove();
        }


        terminalInput = null;
    }


    /* =========================================
       RUN CODE
    ========================================= */

    function runCode() {

        const code =
            codeTextarea.value;

        const language =
            languageSelect.value;


        if (!code.trim()) {

            setOutput(
                "Please write some code first."
            );

            return;
        }


        if (socket) {

            try {
                socket.close();
            }
            catch (error) {
                console.error(error);
            }

            socket = null;
        }


        removeTerminalInput();


        setOutput(
            "Starting program...\n"
        );


        isRunning = true;

        updateButtons();


        try {

            socket =
                new WebSocket(
                    "ws://127.0.0.1:8000/ws/run-code/"
                );

        }
        catch (error) {

            isRunning = false;

            updateButtons();

            setOutput(
                "Could not create WebSocket connection."
            );

            return;
        }


        /* =====================================
           SOCKET OPEN
        ===================================== */

        socket.onopen = function () {

            socket.send(
                JSON.stringify({
                    type: "run",
                    code: code,
                    language: language
                })
            );
        };


        /* =====================================
           SOCKET MESSAGE
        ===================================== */

        socket.onmessage = function (event) {

            let data;

            try {

                data =
                    JSON.parse(event.data);

            }
            catch (error) {

                console.error(
                    "Invalid WebSocket response:",
                    error
                );

                appendOutput(
                    "\nInvalid response received from server.\n"
                );

                return;
            }


            /* =================================
               OUTPUT
            ================================= */

            if (data.type === "output") {

                appendOutput(
                    data.data || ""
                );

                return;
            }


            /* =================================
               ERROR
            ================================= */

            if (data.type === "error") {

                appendOutput(
                    data.data ||
                    "\nExecution error.\n"
                );

                isRunning = false;

                removeTerminalInput();

                updateButtons();

                return;
            }


            /* =================================
               PROGRAM STARTED
            ================================= */

            if (data.type === "started") {

                isRunning = true;

                updateButtons();

                return;
            }


            /* =================================
               INPUT REQUIRED
            ================================= */

            if (
                data.type === "input_required" ||
                data.type === "input"
            ) {

                createTerminalInput();

                return;
            }


            /* =================================
               PROGRAM FINISHED
            ================================= */

            if (data.type === "done") {

                isRunning = false;

                removeTerminalInput();

                updateButtons();


                if (socket) {

                    socket.close();

                    socket = null;
                }

                return;
            }
        };


        /* =====================================
           SOCKET ERROR
        ===================================== */

        socket.onerror = function (error) {

            console.error(
                "WebSocket error:",
                error
            );


            isRunning = false;

            removeTerminalInput();

            updateButtons();


            setOutput(
                "Could not connect to Django WebSocket backend.\n\n" +
                "Make sure Daphne is running at:\n" +
                "http://127.0.0.1:8000/"
            );
        };


        /* =====================================
           SOCKET CLOSE
        ===================================== */

        socket.onclose = function () {

            socket = null;

        };
    }


    /* =========================================
       SEND USER INPUT
    ========================================= */

    function sendInput() {

        if (
            !socket ||
            socket.readyState !== WebSocket.OPEN ||
            !terminalInput
        ) {
            return;
        }


        const value =
            terminalInput.value;


        socket.send(
            JSON.stringify({
                type: "input",
                input: value + "\n"
            })
        );


        appendOutput(
            value + "\n"
        );


        terminalInput.value = "";


        terminalInput.focus();
    }


    /* =========================================
       STOP PROGRAM
    ========================================= */

    function stopCode() {

        if (
            socket &&
            socket.readyState === WebSocket.OPEN
        ) {

            socket.send(
                JSON.stringify({
                    type: "stop"
                })
            );

            socket.close();

            socket = null;
        }


        isRunning = false;

        removeTerminalInput();

        updateButtons();


        appendOutput(
            "\n\nProgram stopped.\n"
        );
    }


    /* =========================================
       CLEAR CODE
    ========================================= */

    function clearCode() {

        if (socket) {

            try {
                socket.close();
            }
            catch (error) {
                console.error(error);
            }

            socket = null;
        }


        isRunning = false;

        removeTerminalInput();


        codeTextarea.value = "";


        setOutput(
            "Output will appear here..."
        );


        updateLineNumbers();

        updateButtons();
    }


    /* =========================================
       LANGUAGE CHANGE
    ========================================= */

    languageSelect.addEventListener(
        "change",
        function () {

            if (socket) {

                try {
                    socket.close();
                }
                catch (error) {
                    console.error(error);
                }

                socket = null;
            }


            isRunning = false;

            removeTerminalInput();


            const language =
                languageSelect.value;


            codeTextarea.value =
                getDefaultCode(language);


            setOutput(
                "Output will appear here..."
            );


            updateLineNumbers();

            updateButtons();
        }
    );


    /* =========================================
       BUTTON STATE
    ========================================= */

    function updateButtons() {

        if (isRunning) {

            runCodeBtn.textContent =
                "⏹ Stop";

            runCodeBtn.classList.add(
                "running"
            );

            runCodeBtn.onclick =
                stopCode;

            clearCodeBtn.disabled =
                true;

        }
        else {

            runCodeBtn.textContent =
                "▶ Run Code";

            runCodeBtn.classList.remove(
                "running"
            );

            runCodeBtn.onclick =
                runCode;

            clearCodeBtn.disabled =
                false;
        }
    }


    /* =========================================
       TAB SUPPORT
    ========================================= */

    codeTextarea.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Tab") {
                return;
            }


            event.preventDefault();


            const start =
                codeTextarea.selectionStart;

            const end =
                codeTextarea.selectionEnd;


            codeTextarea.value =
                codeTextarea.value.substring(
                    0,
                    start
                ) +
                "    " +
                codeTextarea.value.substring(
                    end
                );


            codeTextarea.selectionStart =
                codeTextarea.selectionEnd =
                start + 4;


            updateLineNumbers();
        }
    );


    /* =========================================
       INPUT EVENT
    ========================================= */

    codeTextarea.addEventListener(
        "input",
        function () {

            updateLineNumbers();

        }
    );


    /* =========================================
       SCROLL SYNC
    ========================================= */

    codeTextarea.addEventListener(
        "scroll",
        function () {

            lineNumbers.scrollTop =
                codeTextarea.scrollTop;
        }
    );


    /* =========================================
       INITIAL CODE
    ========================================= */

    codeTextarea.value =
        getDefaultCode("c");


    updateLineNumbers();

    updateButtons();


    /* =========================================
       CLEANUP
    ========================================= */

    window.addEventListener(
        "beforeunload",
        function () {

            if (socket) {

                try {
                    socket.close();
                }
                catch (error) {
                    console.error(error);
                }

                socket = null;
            }
        }
    );

});