import { useState, useRef, useEffect } from "react";
import "./CodeEditor.css";

function CodeEditor() {
  const getDefaultCode = (lang) => {
    if (lang === "c") {
      return `#include <stdio.h>

int main() {
    int n;

    printf("Enter a number: ");
    fflush(stdout);

    scanf("%d", &n);

    printf("Square = %d\\n", n * n);
    printf("Cube = %d\\n", n * n * n);

    return 0;
}`;
    }

    if (lang === "cpp") {
      return `#include <iostream>
using namespace std;

int main() {
    int n;

    cout << "Enter a number: " << flush;
    cin >> n;

    cout << "Square = " << n * n << endl;
    cout << "Cube = " << n * n * n << endl;

    return 0;
}`;
    }

    if (lang === "java") {
      return `import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a number: ");
        System.out.flush();

        int n = sc.nextInt();

        System.out.println("Square = " + (n * n));
        System.out.println("Cube = " + (n * n * n));
    }

}`;
    }

    if (lang === "python") {
      return `n = int(input("Enter a number: "))

print("Square =", n * n)
print("Cube =", n * n * n)`;
    }

    return "";
  };

  const [language, setLanguage] = useState("c");
  const [code, setCode] = useState(getDefaultCode("c"));
  const [output, setOutput] = useState("");
  const [terminalInput, setTerminalInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const socketRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const runCode = () => {
    if (!code.trim()) {
      setOutput("Please write some code first.");
      return;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setOutput("Starting program...\n");
    setTerminalInput("");
    setIsRunning(true);

    const socket = new WebSocket(
      "ws://127.0.0.1:8000/ws/run-code/"
    );

    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "run",
          code: code,
          language: language,
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Program output
        if (data.type === "output") {
          setOutput((prev) => prev + (data.data || ""));
        }

        // Backend error
        else if (data.type === "error") {
          setOutput(
            (prev) =>
              prev +
              (data.data || "Execution error.")
          );

          setIsRunning(false);
        }

        // Program started
        else if (data.type === "started") {
          setIsRunning(true);
        }

        // Program finished
        else if (data.type === "done") {
          setIsRunning(false);

          if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
          }
        }

      } catch (error) {
        console.error("WebSocket message error:", error);

        setOutput(
          (prev) =>
            prev +
            "\nInvalid response received from server."
        );

        setIsRunning(false);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);

      setIsRunning(false);

      setOutput(
        "Could not connect to Django WebSocket backend.\n\n" +
        "Make sure Daphne is running at:\n" +
        "http://127.0.0.1:8000/"
      );
    };

    socket.onclose = () => {
      socketRef.current = null;
    };
  };

  const sendInput = () => {
    if (
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    const value = terminalInput;

    socketRef.current.send(
      JSON.stringify({
        type: "input",
        input: value + "\n",
      })
    );

    setOutput((prev) => prev + value + "\n");
    setTerminalInput("");
  };

  const handleTerminalKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendInput();
    }
  };

  const stopCode = () => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(
        JSON.stringify({
          type: "stop",
        })
      );

      socketRef.current.close();
      socketRef.current = null;
    }

    setIsRunning(false);
    setTerminalInput("");

    setOutput((prev) => prev + "\n\nProgram stopped.");
  };

  const clearCode = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setCode("");
    setOutput("");
    setTerminalInput("");
    setIsRunning(false);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setLanguage(selectedLanguage);
    setCode(getDefaultCode(selectedLanguage));
    setOutput("");
    setTerminalInput("");
    setIsRunning(false);
  };

  return (
    <section className="code-editor-card">

      {/* HEADER */}
      <div className="code-editor-header">

        <div className="code-editor-title">

          <span className="code-editor-icon">
            💻
          </span>

          <div>
            <h2>Code Editor</h2>

            <p>
              Write and run your code in the Virtual Lab.
            </p>
          </div>

        </div>

        <select
          className="language-select"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>

      </div>

      {/* CODE EDITOR */}
      <div className="editor-wrapper">

        <div className="line-numbers">

          {code.split("\n").map((_, index) => (
            <span key={index}>
              {index + 1}
            </span>
          ))}

        </div>

        <textarea
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          placeholder="Write your code here..."
        />

      </div>

      {/* BUTTONS */}
      <div className="editor-actions">

        {!isRunning ? (
          <button
            className="run-code-btn"
            onClick={runCode}
          >
            ▶ Run Code
          </button>
        ) : (
          <button
            className="run-code-btn"
            onClick={stopCode}
          >
            ⏹ Stop
          </button>
        )}

        <button
          className="clear-code-btn"
          onClick={clearCode}
          disabled={isRunning}
        >
          Clear
        </button>

      </div>

      {/* OUTPUT / TERMINAL */}
      <div className="output-section">

        <div className="output-header">
          <strong>Output</strong>
        </div>

        <div
          className="terminal-container"
          ref={outputRef}
        >

          <pre className="output-box">
            {output || "Output will appear here..."}
          </pre>

          {isRunning && (
            <div className="terminal-input-row">

              <span className="terminal-prompt">
                &gt;
              </span>

              <input
                type="text"
                className="terminal-input"
                value={terminalInput}
                onChange={(e) =>
                  setTerminalInput(e.target.value)
                }
                onKeyDown={handleTerminalKeyDown}
                placeholder="Type input and press Enter..."
                autoFocus
              />

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default CodeEditor;