import React, { useMemo, useState } from "react";
import "./Bankers.css";
import CodeEditor from "./CodeEditor";

const initialAllocation = [
  [0, 1, 0],
  [2, 0, 0],
  [3, 0, 2],
  [2, 1, 1],
  [0, 0, 2],
];

const initialMax = [
  [7, 5, 3],
  [3, 2, 2],
  [9, 0, 2],
  [2, 2, 2],
  [4, 3, 3],
];

const initialAvailable = [3, 3, 2];

const createMatrix = (rows, cols, value = 0) =>
  Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => value)
  );

const createVector = (length, value = 0) =>
  Array.from({ length }, () => value);

function Bankers() {
  const [processCount, setProcessCount] = useState(5);
  const [resourceCount, setResourceCount] = useState(3);

  const [allocation, setAllocation] = useState(initialAllocation);
  const [maxMatrix, setMaxMatrix] = useState(initialMax);
  const [available, setAvailable] = useState(initialAvailable);

  const [appliedProcesses, setAppliedProcesses] = useState(5);
  const [appliedResources, setAppliedResources] = useState(3);

  const [result, setResult] = useState(null);

  const [requestProcess, setRequestProcess] = useState(0);
  const [request, setRequest] = useState([0, 0, 0]);
  const [requestResult, setRequestResult] = useState(null);

  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceMessage, setPracticeMessage] = useState("");

  const [quizAnswers, setQuizAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });

  const [quizScore, setQuizScore] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const processLabels = useMemo(
    () =>
      Array.from(
        { length: appliedProcesses },
        (_, index) => `P${index}`
      ),
    [appliedProcesses]
  );

  const resourceLabels = useMemo(
    () =>
      Array.from(
        { length: appliedResources },
        (_, index) => `R${index}`
      ),
    [appliedResources]
  );

  const calculateNeed = (alloc = allocation, max = maxMatrix) => {
    return max.map((row, i) =>
      row.map((value, j) => Math.max(0, Number(value) - Number(alloc[i][j])))
    );
  };

  const isLessThanOrEqual = (row1, row2) =>
    row1.every((value, index) => Number(value) <= Number(row2[index]));

  const addVectors = (a, b) =>
    a.map((value, index) => Number(value) + Number(b[index]));

  const subtractVectors = (a, b) =>
    a.map((value, index) => Number(value) - Number(b[index]));

  const runSafetyAlgorithm = (
    alloc = allocation,
    max = maxMatrix,
    avail = available
  ) => {
    const need = calculateNeed(alloc, max);
    const work = [...avail].map(Number);
    const finish = Array(alloc.length).fill(false);
    const safeSequence = [];
    const steps = [];

    let progress = true;

    while (safeSequence.length < alloc.length && progress) {
      progress = false;

      for (let i = 0; i < alloc.length; i++) {
        if (finish[i]) continue;

        if (isLessThanOrEqual(need[i], work)) {
          const workBefore = [...work];

          for (let j = 0; j < work.length; j++) {
            work[j] += Number(alloc[i][j]);
          }

          finish[i] = true;
          safeSequence.push(i);
          progress = true;

          steps.push({
            process: `P${i}`,
            workBefore,
            allocation: [...alloc[i]],
            workAfter: [...work],
          });
        }
      }
    }

    const safe = finish.every(Boolean);

    return {
      need,
      finish,
      safeSequence,
      steps,
      finalWork: work,
      safe,
    };
  };

  const applyDimensions = () => {
    const pCount = Math.min(
      8,
      Math.max(1, Number(processCount) || 1)
    );

    const rCount = Math.min(
      6,
      Math.max(1, Number(resourceCount) || 1)
    );

    setProcessCount(pCount);
    setResourceCount(rCount);
    setAppliedProcesses(pCount);
    setAppliedResources(rCount);

    setAllocation(createMatrix(pCount, rCount, 0));
    setMaxMatrix(createMatrix(pCount, rCount, 0));
    setAvailable(createVector(rCount, 0));

    setRequestProcess(0);
    setRequest(createVector(rCount, 0));

    setResult(null);
    setRequestResult(null);
    setIsCompleted(false);
  };

  const loadExample = () => {
    setProcessCount(5);
    setResourceCount(3);
    setAppliedProcesses(5);
    setAppliedResources(3);

    setAllocation(initialAllocation);
    setMaxMatrix(initialMax);
    setAvailable(initialAvailable);

    setRequestProcess(0);
    setRequest([0, 0, 0]);

    setResult(null);
    setRequestResult(null);
    setIsCompleted(false);
  };

  const updateMatrixValue = (setter, matrix, row, col, value) => {
    const numericValue =
      value === "" ? 0 : Math.max(0, Number(value));

    const updated = matrix.map((currentRow, rowIndex) =>
      currentRow.map((currentValue, colIndex) =>
        rowIndex === row && colIndex === col
          ? numericValue
          : currentValue
      )
    );

    setter(updated);
    setResult(null);
    setRequestResult(null);
  };

  const updateAvailableValue = (index, value) => {
    const numericValue =
      value === "" ? 0 : Math.max(0, Number(value));

    setAvailable((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? numericValue : item
      )
    );

    setResult(null);
    setRequestResult(null);
  };

  const handleCalculate = () => {
    const invalidAllocation = allocation.some((row, i) =>
      row.some((value, j) => Number(value) > Number(maxMatrix[i][j]))
    );

    if (invalidAllocation) {
      setResult({
        safe: false,
        error:
          "Allocation cannot be greater than Maximum requirement.",
      });
      return;
    }

    const safetyResult = runSafetyAlgorithm();

    setResult(safetyResult);
    setRequestResult(null);
  };

  const handleRequestChange = (index, value) => {
    const numericValue =
      value === "" ? 0 : Math.max(0, Number(value));

    setRequest((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? numericValue : item
      )
    );

    setRequestResult(null);
  };

  const handleResourceRequest = () => {
    if (allocation.length === 0) return;

    const selected = Number(requestProcess);
    const need = calculateNeed();

    const selectedNeed = need[selected];

    const exceedsNeed = request.some(
      (value, index) => Number(value) > Number(selectedNeed[index])
    );

    if (exceedsNeed) {
      setRequestResult({
        granted: false,
        message: `Request cannot be granted because the request exceeds the Need of P${selected}.`,
      });
      return;
    }

    const exceedsAvailable = request.some(
      (value, index) => Number(value) > Number(available[index])
    );

    if (exceedsAvailable) {
      setRequestResult({
        granted: false,
        message:
          "Request cannot be granted because requested resources exceed Available resources.",
      });
      return;
    }

    const newAvailable = subtractVectors(available, request);

    const newAllocation = allocation.map((row, i) =>
      row.map((value, j) =>
        i === selected
          ? Number(value) + Number(request[j])
          : Number(value)
      )
    );

    const safetyAfterRequest = runSafetyAlgorithm(
      newAllocation,
      maxMatrix,
      newAvailable
    );

    if (safetyAfterRequest.safe) {
      setRequestResult({
        granted: true,
        message: `Request can be granted safely. Safe sequence: ${safetyAfterRequest.safeSequence
          .map((index) => `P${index}`)
          .join(" → ")}`,
      });
    } else {
      setRequestResult({
        granted: false,
        message:
          "Request cannot be granted because it would make the system unsafe.",
      });
    }
  };

  const resetExperiment = () => {
    setProcessCount(5);
    setResourceCount(3);
    setAppliedProcesses(5);
    setAppliedResources(3);

    setAllocation(initialAllocation);
    setMaxMatrix(initialMax);
    setAvailable(initialAvailable);

    setResult(null);
    setRequestProcess(0);
    setRequest([0, 0, 0]);
    setRequestResult(null);

    setPracticeAnswer("");
    setPracticeMessage("");

    setQuizAnswers({
      q1: "",
      q2: "",
      q3: "",
    });

    setQuizScore(null);
    setIsCompleted(false);
  };

  const checkPractice = () => {
    const answer = practiceAnswer.trim().toLowerCase();

    if (
      answer === "safe" ||
      answer === "safe state" ||
      answer === "p1,p3,p4,p0,p2" ||
      answer === "p1 p3 p4 p0 p2"
    ) {
      setPracticeMessage(
        "Correct! The given system is in a safe state."
      );
    } else {
      setPracticeMessage(
        "Try again. Use the Safety Algorithm and find a safe sequence."
      );
    }
  };

  const checkQuiz = () => {
    let score = 0;

    if (quizAnswers.q1 === "a") score++;
    if (quizAnswers.q2 === "b") score++;
    if (quizAnswers.q3 === "c") score++;

    setQuizScore(score);
  };

  const markComplete = () => {
    setIsCompleted(true);
  };

  const currentNeed = result?.need || calculateNeed();

  return (
    <div className="bankers-page">
      <div className="bankers-header">
        <div className="bankers-header-top">
          <button
            className="bankers-back-button"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>

          <span className="bankers-os-badge">
            Operating System
          </span>
        </div>

        <h1>
          Implementation of Banker's Algorithm for Deadlock
          Avoidance
        </h1>

        <p>
          Simulate resource allocation and check whether the
          system is in a safe state.
        </p>
      </div>

      <main className="bankers-content">
        {/* THEORY */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">📘</div>
            <div>
              <h2>Theory</h2>
              <p>Understanding Banker's Algorithm</p>
            </div>
          </div>

          <div className="theory-grid">
            <div className="theory-item">
              <h3>Banker's Algorithm</h3>
              <p>
                Banker's Algorithm is used to avoid deadlocks
                by ensuring that resource allocation always
                leads to a safe state.
              </p>
            </div>

            <div className="theory-item">
              <h3>Safe State</h3>
              <p>
                A system is in a safe state when every process
                can obtain its remaining resources and complete
                successfully.
              </p>
            </div>

            <div className="theory-item">
              <h3>Allocation</h3>
              <p>
                Allocation matrix represents the resources
                currently allocated to each process.
              </p>
            </div>

            <div className="theory-item">
              <h3>Maximum</h3>
              <p>
                Maximum matrix represents the maximum resources
                required by each process.
              </p>
            </div>
          </div>
        </section>

        {/* OBJECTIVE */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">🎯</div>
            <div>
              <h2>Objective</h2>
              <p>What you will learn</p>
            </div>
          </div>

          <ul className="learning-list">
            <li>
              Understand deadlock avoidance using Banker's
              Algorithm.
            </li>
            <li>
              Calculate the Need matrix from Allocation and
              Maximum matrices.
            </li>
            <li>
              Determine whether the system is in a safe state.
            </li>
            <li>
              Find the safe sequence of processes.
            </li>
            <li>
              Understand how resource requests are safely
              handled.
            </li>
            <li>
              Implement the Safety Algorithm.
            </li>
          </ul>
        </section>

        {/* PREREQUISITES */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">📋</div>
            <div>
              <h2>Prerequisites</h2>
              <p>Before starting the experiment</p>
            </div>
          </div>

          <div className="prerequisite-grid">
            <div className="prerequisite-item">
              <strong>Processes</strong>
              <span>Know process concepts</span>
            </div>

            <div className="prerequisite-item">
              <strong>Resources</strong>
              <span>Understand resource allocation</span>
            </div>

            <div className="prerequisite-item">
              <strong>Deadlock</strong>
              <span>Basic deadlock knowledge</span>
            </div>

            <div className="prerequisite-item">
              <strong>Matrices</strong>
              <span>Basic matrix operations</span>
            </div>
          </div>
        </section>

        {/* ALGORITHM */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">⚙️</div>
            <div>
              <h2>Algorithm</h2>
              <p>Steps of Banker's Algorithm</p>
            </div>
          </div>

          <ol className="algorithm-list">
            <li>
              Take the number of processes and number of
              resource types.
            </li>
            <li>
              Enter the Allocation matrix, Maximum matrix and
              Available vector.
            </li>
            <li>
              Calculate the Need matrix using:
              <div className="formula-box">
                Need[i][j] = Max[i][j] − Allocation[i][j]
              </div>
            </li>
            <li>
              Initialize Work = Available and Finish[i] =
              false for all processes.
            </li>
            <li>
              Find a process whose Finish[i] is false and
              Need[i] ≤ Work.
            </li>
            <li>
              If found, execute the process and update:
              <div className="formula-box">
                Work = Work + Allocation[i]
              </div>
            </li>
            <li>
              Set Finish[i] = true and add the process to the
              safe sequence.
            </li>
            <li>
              Repeat until all processes finish or no suitable
              process is found.
            </li>
            <li>
              If all Finish values are true, the system is in a
              safe state.
            </li>
          </ol>
        </section>

        {/* SYSTEM INPUT */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">🖥️</div>
            <div>
              <h2>System Resources Input</h2>
              <p>Define processes and resource types</p>
            </div>
          </div>

          <div className="dimension-controls">
            <div className="input-group">
              <label>Number of Processes</label>
              <input
                type="number"
                min="1"
                max="8"
                value={processCount}
                onChange={(e) =>
                  setProcessCount(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Resource Types</label>
              <input
                type="number"
                min="1"
                max="6"
                value={resourceCount}
                onChange={(e) =>
                  setResourceCount(e.target.value)
                }
              />
            </div>

            <button
              className="primary-button"
              onClick={applyDimensions}
            >
              Apply Dimensions
            </button>

            <button
              className="secondary-button"
              onClick={loadExample}
            >
              Load Example
            </button>

            <button
              className="reset-button"
              onClick={resetExperiment}
            >
              Reset
            </button>
          </div>
        </section>

        {/* ALLOCATION MATRIX */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">📊</div>
            <div>
              <h2>Allocation Matrix</h2>
              <p>Resources currently allocated to each process</p>
            </div>
          </div>

          <div className="matrix-wrapper">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Process</th>
                  {resourceLabels.map((resource) => (
                    <th key={resource}>{resource}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {allocation.map((row, i) => (
                  <tr key={i}>
                    <td className="process-name">
                      P{i}
                    </td>

                    {row.map((value, j) => (
                      <td key={j}>
                        <input
                          className="matrix-input"
                          type="number"
                          min="0"
                          value={value}
                          onChange={(e) =>
                            updateMatrixValue(
                              setAllocation,
                              allocation,
                              i,
                              j,
                              e.target.value
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* MAX MATRIX */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">📈</div>
            <div>
              <h2>Maximum Matrix</h2>
              <p>Maximum resources required by each process</p>
            </div>
          </div>

          <div className="matrix-wrapper">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Process</th>
                  {resourceLabels.map((resource) => (
                    <th key={resource}>{resource}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {maxMatrix.map((row, i) => (
                  <tr key={i}>
                    <td className="process-name">
                      P{i}
                    </td>

                    {row.map((value, j) => (
                      <td key={j}>
                        <input
                          className="matrix-input"
                          type="number"
                          min="0"
                          value={value}
                          onChange={(e) =>
                            updateMatrixValue(
                              setMaxMatrix,
                              maxMatrix,
                              i,
                              j,
                              e.target.value
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* AVAILABLE VECTOR */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">📦</div>
            <div>
              <h2>Available Resources</h2>
              <p>Available instances of each resource</p>
            </div>
          </div>

          <div className="available-grid">
            {available.map((value, index) => (
              <div className="available-item" key={index}>
                <label>{resourceLabels[index]}</label>

                <input
                  type="number"
                  min="0"
                  value={value}
                  onChange={(e) =>
                    updateAvailableValue(
                      index,
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
          </div>

          <div className="calculate-area">
            <button
              className="calculate-button"
              onClick={handleCalculate}
            >
              Run Safety Algorithm
            </button>
          </div>
        </section>

        {/* NEED MATRIX */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">🔢</div>
            <div>
              <h2>Need Matrix</h2>
              <p>Calculated using Maximum − Allocation</p>
            </div>
          </div>

          <div className="formula-highlight">
            Need[i][j] = Max[i][j] − Allocation[i][j]
          </div>

          <div className="matrix-wrapper">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Process</th>
                  {resourceLabels.map((resource) => (
                    <th key={resource}>{resource}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {currentNeed.map((row, i) => (
                  <tr key={i}>
                    <td className="process-name">
                      P{i}
                    </td>

                    {row.map((value, j) => (
                      <td key={j} className="calculated-cell">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SAFETY RESULT */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">🛡️</div>
            <div>
              <h2>Safety Algorithm Result</h2>
              <p>Check whether the system is in a safe state</p>
            </div>
          </div>

          {!result ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No Result Yet</h3>
              <p>
                Enter the resource information and click
                "Run Safety Algorithm".
              </p>
            </div>
          ) : result.error ? (
            <div className="unsafe-result">
              <div className="result-icon">⚠️</div>
              <div>
                <h3>Invalid Input</h3>
                <p>{result.error}</p>
              </div>
            </div>
          ) : (
            <>
              <div
                className={
                  result.safe
                    ? "safe-result"
                    : "unsafe-result"
                }
              >
                <div className="result-icon">
                  {result.safe ? "✓" : "⚠️"}
                </div>

                <div>
                  <h3>
                    {result.safe
                      ? "System is in Safe State"
                      : "System is in Unsafe State"}
                  </h3>

                  <p>
                    {result.safe
                      ? "All processes can complete without causing deadlock."
                      : "No suitable process can be found to complete all remaining processes."}
                  </p>
                </div>
              </div>

              {result.safe && (
                <div className="safe-sequence-box">
                  <h3>Safe Sequence</h3>

                  <div className="safe-sequence">
                    {result.safeSequence.map(
                      (processIndex, index) => (
                        <React.Fragment key={processIndex}>
                          <span className="sequence-process">
                            P{processIndex}
                          </span>

                          {index <
                            result.safeSequence.length - 1 && (
                            <span className="sequence-arrow">
                              →
                            </span>
                          )}
                        </React.Fragment>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="safety-steps">
                <h3>Safety Algorithm Execution</h3>

                <div className="steps-table-wrapper">
                  <table className="steps-table">
                    <thead>
                      <tr>
                        <th>Step</th>
                        <th>Process</th>
                        <th>Work Before</th>
                        <th>Allocation</th>
                        <th>Work After</th>
                      </tr>
                    </thead>

                    <tbody>
                      {result.steps.map((step, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="process-name">
                            {step.process}
                          </td>
                          <td>
                            [{step.workBefore.join(", ")}]
                          </td>
                          <td>
                            [{step.allocation.join(", ")}]
                          </td>
                          <td>
                            [{step.workAfter.join(", ")}]
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>

        {/* RESOURCE REQUEST */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">📥</div>
            <div>
              <h2>Resource Request Algorithm</h2>
              <p>Optional request safety check</p>
            </div>
          </div>

          <div className="request-info">
            <p>
              The request is checked against Need and Available
              resources. The request is temporarily allocated
              and the Safety Algorithm is executed.
            </p>
          </div>

          <div className="request-controls">
            <div className="input-group">
              <label>Select Process</label>

              <select
                value={requestProcess}
                onChange={(e) => {
                  setRequestProcess(Number(e.target.value));
                  setRequestResult(null);
                }}
              >
                {processLabels.map((process, index) => (
                  <option key={process} value={index}>
                    {process}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="request-vector">
            {resourceLabels.map((resource, index) => (
              <div className="available-item" key={resource}>
                <label>{resource} Request</label>

                <input
                  type="number"
                  min="0"
                  value={request[index] ?? 0}
                  onChange={(e) =>
                    handleRequestChange(
                      index,
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
          </div>

          <button
            className="calculate-button"
            onClick={handleResourceRequest}
          >
            Check Resource Request
          </button>

          {requestResult && (
            <div
              className={
                requestResult.granted
                  ? "request-success"
                  : "request-denied"
              }
            >
              <strong>
                {requestResult.granted
                  ? "✓ Request Granted"
                  : "✕ Request Denied"}
              </strong>

              <p>{requestResult.message}</p>
            </div>
          )}
        </section>

        {/* CODE EDITOR */}
        <section className="bankers-code-section">
          <CodeEditor />
        </section>

        {/* COMPLEXITY */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">📐</div>
            <div>
              <h2>Complexity / Analysis</h2>
              <p>Performance of Banker's Algorithm</p>
            </div>
          </div>

          <div className="analysis-grid">
            <div className="analysis-item">
              <span>Safety Algorithm</span>
              <strong>O(n² × m)</strong>
            </div>

            <div className="analysis-item">
              <span>Need Calculation</span>
              <strong>O(n × m)</strong>
            </div>

            <div className="analysis-item">
              <span>Space Complexity</span>
              <strong>O(n × m)</strong>
            </div>

            <div className="analysis-item">
              <span>n</span>
              <strong>Processes</strong>
            </div>
          </div>
        </section>

        {/* KEY TAKEAWAYS */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">💡</div>
            <div>
              <h2>Key Takeaways</h2>
              <p>Important points to remember</p>
            </div>
          </div>

          <ul className="takeaway-list">
            <li>
              Banker's Algorithm is a deadlock avoidance
              algorithm.
            </li>

            <li>
              Need matrix is calculated as Maximum −
              Allocation.
            </li>

            <li>
              Work initially contains the Available resources.
            </li>

            <li>
              A process can execute when Need ≤ Work.
            </li>

            <li>
              After a process completes, its allocated
              resources are returned to Work.
            </li>

            <li>
              If all processes finish, the system is in a safe
              state.
            </li>

            <li>
              A safe sequence proves that deadlock can be
              avoided for the current state.
            </li>
          </ul>
        </section>

        {/* PRACTICE */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">✍️</div>
            <div>
              <h2>Practice</h2>
              <p>Test your understanding</p>
            </div>
          </div>

          <div className="practice-question">
            <h3>
              For the standard example with Available =
              [3,3,2], is the system in a safe state?
            </h3>

            <p>
              Try to find the safe sequence using the Safety
              Algorithm.
            </p>

            <input
              type="text"
              placeholder="Enter Safe / Unsafe or safe sequence"
              value={practiceAnswer}
              onChange={(e) =>
                setPracticeAnswer(e.target.value)
              }
            />

            <button
              className="practice-button"
              onClick={checkPractice}
            >
              Check Answer
            </button>

            {practiceMessage && (
              <div
                className={
                  practiceMessage.startsWith("Correct")
                    ? "practice-success"
                    : "practice-error"
                }
              >
                {practiceMessage}
              </div>
            )}
          </div>
        </section>

        {/* QUIZ */}
        <section className="bankers-card">
          <div className="section-title">
            <div className="section-icon">🧠</div>
            <div>
              <h2>Quiz</h2>
              <p>Check your knowledge</p>
            </div>
          </div>

          <div className="quiz-question">
            <h3>1. What is the main purpose of Banker's Algorithm?</h3>

            <label>
              <input
                type="radio"
                name="q1"
                value="a"
                checked={quizAnswers.q1 === "a"}
                onChange={(e) =>
                  setQuizAnswers({
                    ...quizAnswers,
                    q1: e.target.value,
                  })
                }
              />
              Deadlock avoidance
            </label>

            <label>
              <input
                type="radio"
                name="q1"
                value="b"
                checked={quizAnswers.q1 === "b"}
                onChange={(e) =>
                  setQuizAnswers({
                    ...quizAnswers,
                    q1: e.target.value,
                  })
                }
              />
              CPU scheduling
            </label>

            <label>
              <input
                type="radio"
                name="q1"
                value="c"
                checked={quizAnswers.q1 === "c"}
                onChange={(e) =>
                  setQuizAnswers({
                    ...quizAnswers,
                    q1: e.target.value,
                  })
                }
              />
              Memory allocation
            </label>
          </div>

          <div className="quiz-question">
            <h3>2. How is Need calculated?</h3>

            <label>
              <input
                type="radio"
                name="q2"
                value="a"
                checked={quizAnswers.q2 === "a"}
                onChange={(e) =>
                  setQuizAnswers({
                    ...quizAnswers,
                    q2: e.target.value,
                  })
                }
              />
              Allocation − Maximum
            </label>

            <label>
              <input
                type="radio"
                name="q2"
                value="b"
                checked={quizAnswers.q2 === "b"}
                onChange={(e) =>
                  setQuizAnswers({
                    ...quizAnswers,
                    q2: e.target.value,
                  })
                }
              />
              Maximum − Allocation
            </label>

            <label>
              <input
                type="radio"
                name="q2"
                value="c"
                checked={quizAnswers.q2 === "c"}
                onChange={(e) =>
                  setQuizAnswers({
                    ...quizAnswers,
                    q2: e.target.value,
                  })
                }
              />
              Available − Allocation
            </label>
          </div>

          <div className="quiz-question">
            <h3>
              3. When is a system considered safe?
            </h3>

            <label>
              <input
                type="radio"
                name="q3"
                value="a"
                checked={quizAnswers.q3 === "a"}
                onChange={(e) =>
                  setQuizAnswers({
                    ...quizAnswers,
                    q3: e.target.value,
                  })
                }
              />
              When one process finishes
            </label>

            <label>
              <input
                type="radio"
                name="q3"
                value="b"
                checked={quizAnswers.q3 === "b"}
                onChange={(e) =>
                  setQuizAnswers({
                    ...quizAnswers,
                    q3: e.target.value,
                  })
                }
              />
              When Available is zero
            </label>

            <label>
              <input
                type="radio"
                name="q3"
                value="c"
                checked={quizAnswers.q3 === "c"}
                onChange={(e) =>
                  setQuizAnswers({
                    ...quizAnswers,
                    q3: e.target.value,
                  })
                }
              />
              When all processes can finish safely
            </label>
          </div>

          <button
            className="quiz-button"
            onClick={checkQuiz}
          >
            Submit Quiz
          </button>

          {quizScore !== null && (
            <div className="quiz-result">
              Score: {quizScore} / 3
            </div>
          )}
        </section>

        {/* COMPLETION */}
        <section className="bankers-card completion-card">
          <div className="section-title">
            <div className="section-icon">🏆</div>
            <div>
              <h2>Experiment Status</h2>
              <p>Complete the practical</p>
            </div>
          </div>

          <div
            className={
              isCompleted
                ? "completion-success"
                : "completion-pending"
            }
          >
            <div>
              <strong>
                {isCompleted
                  ? "Experiment Completed ✓"
                  : "Experiment In Progress"}
              </strong>

              <p>
                {isCompleted
                  ? "You have successfully completed the Banker's Algorithm experiment."
                  : "Run the algorithm, study the result and mark the experiment complete."}
              </p>
            </div>

            {!isCompleted && (
              <button
                className="complete-button"
                onClick={markComplete}
              >
                Mark Complete
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Bankers;