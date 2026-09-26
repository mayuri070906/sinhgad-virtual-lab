import { useState } from "react";
import "./SJF.css";
import CodeEditor from "./CodeEditor";

function SJF() {
  const [processId, setProcessId] = useState("");
  const [burstTime, setBurstTime] = useState("");
  const [processes, setProcesses] = useState([]);

  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceMessage, setPracticeMessage] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Add Process
  const addProcess = () => {
    if (burstTime === "") {
      alert("Please enter Burst Time.");
      return;
    }

    const burst = Number(burstTime);

    if (burst <= 0) {
      alert("Burst Time must be greater than 0.");
      return;
    }

    const id =
      processId.trim() !== ""
        ? processId.trim()
        : `P${processes.length + 1}`;

    setProcesses((prev) => [
      ...prev,
      {
        id,
        burstTime: burst,
        order: prev.length,
      },
    ]);

    setProcessId("");
    setBurstTime("");
  };

  // Remove Process
  const removeProcess = (index) => {
    setProcesses((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((process, newIndex) => ({
          ...process,
          order: newIndex,
        }))
    );
  };

  // Reset
  const resetAll = () => {
    setProcesses([]);
    setProcessId("");
    setBurstTime("");
    setPracticeAnswer("");
    setPracticeMessage("");
    setQuizAnswers({});
    setQuizScore(null);
    setIsCompleted(false);
  };

  // SJF Calculation
  // Non-Preemptive SJF
  // If Burst Time is same, original queue order is maintained.
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.burstTime !== b.burstTime) {
      return a.burstTime - b.burstTime;
    }

    return a.order - b.order;
  });

  let currentTime = 0;

  const results = sortedProcesses.map((process) => {
    const startTime = currentTime;

    const completionTime =
      startTime + process.burstTime;

    const waitingTime = startTime;

    const turnaroundTime = completionTime;

    currentTime = completionTime;

    return {
      ...process,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime,
    };
  });

  // Average Waiting Time
  const averageWaitingTime =
    results.length > 0
      ? results.reduce(
          (sum, process) =>
            sum + process.waitingTime,
          0
        ) / results.length
      : 0;

  // Average Turnaround Time
  const averageTurnaroundTime =
    results.length > 0
      ? results.reduce(
          (sum, process) =>
            sum + process.turnaroundTime,
          0
        ) / results.length
      : 0;

  // Total Burst Time
  const totalBurstTime = results.reduce(
    (sum, process) =>
      sum + process.burstTime,
    0
  );

  // Practice
  const checkPractice = () => {
    const value = Number(practiceAnswer);

    if (
      practiceAnswer.trim() === "" ||
      Number.isNaN(value)
    ) {
      setPracticeMessage("Please enter a valid answer.");
      return;
    }

    setPracticeMessage(
      Math.abs(value - 4.5) < 0.001
        ? "Correct! Average Waiting Time = 4.50 units."
        : "Try again. The correct Average Waiting Time is 4.50 units."
    );
  };

  // Quiz
  const submitQuiz = () => {
    const correctAnswers = {
      q1: "a",
      q2: "b",
      q3: "c",
    };

    const score = Object.keys(correctAnswers).reduce(
      (total, question) =>
        total +
        (quizAnswers[question] ===
        correctAnswers[question]
          ? 1
          : 0),
      0
    );

    setQuizScore(score);
  };

  // Complete Experiment
  const markComplete = () => {
    setIsCompleted(true);
  };

  return (
    <main className="sjf-page">

      {/* ================= HEADER ================= */}

      <header className="sjf-header">

        <div className="sjf-header-top">

          <button
            className="sjf-back-button"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>

          <span className="sjf-os-badge">
            OPERATING SYSTEM
          </span>

        </div>

        <h1>
          Shortest Job First Scheduling
        </h1>

        <p>
          SJF is a CPU scheduling algorithm that
          selects the process with the shortest
          burst time for execution first.
        </p>

      </header>


      {/* ================= THEORY ================= */}

      <section className="sjf-card">

        <div className="section-title">

          <span>📚</span>

          <div>
            <h2>SJF Theory</h2>

            <p>
              Understand the Shortest Job First
              scheduling algorithm.
            </p>
          </div>

        </div>


        <p className="theory-text">

          <strong>
            Shortest Job First (SJF)
          </strong>{" "}
          is a CPU scheduling algorithm in which
          the process having the smallest burst
          time is selected for execution first.

        </p>


        <p className="theory-text">

          SJF in this practical is a{" "}
          <strong>Non-Preemptive</strong>{" "}
          scheduling algorithm. Once a process
          starts execution, it continues until
          its burst time is completely finished.

        </p>


        <p className="theory-text">

          When two or more processes have the same
          burst time, the process that was added
          earlier is selected first.

        </p>


        <div className="theory-grid">

          <div className="theory-box">

            <h3>⚡ Selection</h3>

            <p>
              The process with the smallest Burst
              Time is selected first.
            </p>

          </div>


          <div className="theory-box">

            <h3>🔒 Non-Preemptive</h3>

            <p>
              Once execution starts, the process
              continues until completion.
            </p>

          </div>


          <div className="theory-box">

            <h3>⏱️ Completion</h3>

            <p>
              Completion time is calculated by
              adding burst time to start time.
            </p>

          </div>


          <div className="theory-box">

            <h3>📊 Objective</h3>

            <p>
              Reduce the average waiting time by
              executing shorter jobs first.
            </p>

          </div>

        </div>


        <div className="formula-box">

          <strong>
            Important Formulas
          </strong>

          <div className="formula-list">

            <span>
              Completion Time = Start Time + Burst Time
            </span>

            <span>
              Waiting Time = Start Time
            </span>

            <span>
              Turnaround Time = Completion Time
            </span>

          </div>

        </div>

      </section>


      {/* ================= OBJECTIVE ================= */}

      <section className="sjf-card">

        <div className="section-title">

          <span>🎯</span>

          <div>
            <h2>Objective</h2>

            <p>
              What you will learn from this SJF practical.
            </p>
          </div>

        </div>

        <div className="learning-list">

          <div className="learning-item">
            <span>1</span>
            <p>
              Understand how Shortest Job First
              scheduling works.
            </p>
          </div>

          <div className="learning-item">
            <span>2</span>
            <p>
              Calculate Completion Time, Waiting
              Time and Turnaround Time.
            </p>
          </div>

          <div className="learning-item">
            <span>3</span>
            <p>
              Build and understand the SJF Gantt Chart.
            </p>
          </div>

          <div className="learning-item">
            <span>4</span>
            <p>
              Calculate Average Waiting Time and
              Average Turnaround Time.
            </p>
          </div>

        </div>

      </section>


      {/* ================= PREREQUISITES ================= */}

      <section className="sjf-card">

        <div className="section-title">

          <span>📌</span>

          <div>
            <h2>Prerequisites</h2>

            <p>
              Basic concepts you should know before starting.
            </p>
          </div>

        </div>

        <div className="prerequisite-grid">

          <div className="prerequisite-box">
            <strong>Process</strong>
            <span>
              A program waiting for CPU execution.
            </span>
          </div>

          <div className="prerequisite-box">
            <strong>Burst Time</strong>
            <span>
              CPU time required by a process.
            </span>
          </div>

          <div className="prerequisite-box">
            <strong>CPU Scheduling</strong>
            <span>
              Selecting which process gets the CPU next.
            </span>
          </div>

          <div className="prerequisite-box">
            <strong>Gantt Chart</strong>
            <span>
              A timeline showing process execution.
            </span>
          </div>

        </div>

      </section>


      {/* ================= ALGORITHM ================= */}

      <section className="sjf-card">

        <div className="section-title">

          <span>🧠</span>

          <div>
            <h2>SJF Algorithm</h2>

            <p>
              Follow these steps to perform SJF scheduling.
            </p>
          </div>

        </div>

        <ol className="algorithm-list">

          <li>
            Take the Process ID and Burst Time as input.
          </li>

          <li>
            Compare the Burst Time of all available processes.
          </li>

          <li>
            Select the process having the smallest Burst Time.
          </li>

          <li>
            If two processes have the same Burst Time,
            select the process added earlier.
          </li>

          <li>
            Execute the selected process completely.
          </li>

          <li>
            Calculate Completion Time using
            Start Time + Burst Time.
          </li>

          <li>
            Calculate Waiting Time and Turnaround Time
            for every process.
          </li>

          <li>
            Calculate Average Waiting Time and
            Average Turnaround Time.
          </li>

          <li>
            Represent the execution order using a Gantt Chart.
          </li>

        </ol>

      </section>


      {/* ================= ADD PROCESS ================= */}

      <section className="sjf-card">

        <div className="section-title">

          <span>⚙️</span>

          <div>

            <h2>Add Processes</h2>

            <p>
              Enter process ID and burst time.
            </p>

          </div>

        </div>


        <div className="input-area">

          <div className="input-group">

            <label>
              Process ID
            </label>

            <input
              type="text"
              value={processId}
              placeholder={`P${processes.length + 1}`}
              onChange={(e) =>
                setProcessId(e.target.value)
              }
            />

          </div>


          <div className="input-group">

            <label>
              Burst Time
            </label>

            <input
              type="number"
              min="1"
              value={burstTime}
              placeholder="e.g. 5"
              onChange={(e) =>
                setBurstTime(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addProcess();
                }
              }}
            />

          </div>


          <button
            className="add-btn"
            onClick={addProcess}
          >
            + Add Process
          </button>


          <button
            className="reset-btn"
            onClick={resetAll}
          >
            Reset
          </button>

        </div>

      </section>


      {/* ================= PROCESS QUEUE ================= */}

      {processes.length > 0 && (

        <section className="sjf-card">

          <div className="section-title">

            <span>📋</span>

            <div>

              <h2>Process Queue</h2>

              <p>
                SJF selects the process with the
                shortest Burst Time first.
              </p>

            </div>

          </div>


          <div className="process-chips">

            {processes.map((process, index) => (

              <div
                className="process-chip"
                key={`${process.id}-${index}`}
              >

                <div className="chip-content">

                  <strong>
                    {process.id}
                  </strong>

                  <small>
                    BT: {process.burstTime}
                  </small>

                </div>


                <button
                  className="remove-process"
                  onClick={() =>
                    removeProcess(index)
                  }
                >
                  ×
                </button>

              </div>

            ))}

          </div>

        </section>

      )}


      {/* ================= GANTT CHART ================= */}

      {results.length > 0 && (

        <section className="sjf-card">

          <div className="section-title">

            <span>📈</span>

            <div>

              <h2>
                Gantt Chart
              </h2>

              <p>
                Visual representation of SJF CPU execution.
              </p>

            </div>

          </div>


          <div className="gantt-container">

            {/* Process names above blocks */}

            <div className="gantt-top-labels">

              {results.map((process, index) => {

                const width =
                  (process.burstTime /
                    totalBurstTime) *
                  100;

                return (

                  <div
                    key={`label-${process.id}-${index}`}
                    className="gantt-top-label"
                    style={{
                      width: `${width}%`,
                    }}
                  >
                    {process.id}
                  </div>

                );

              })}

            </div>


            {/* Main Gantt blocks */}

            <div className="gantt-chart">

              {results.map((process, index) => {

                const width =
                  (process.burstTime /
                    totalBurstTime) *
                  100;

                return (

                  <div
                    key={`block-${process.id}-${index}`}
                    className={`gantt-block gantt-color-${index % 5}`}
                    style={{
                      width: `${width}%`,
                    }}
                  >

                    <strong>
                      {process.id}
                    </strong>

                    <span>
                      {process.burstTime} units
                    </span>

                  </div>

                );

              })}

            </div>


            {/* Timeline */}

            <div className="gantt-times">

              <span className="gantt-time gantt-start-time">
                0
              </span>


              {results.map((process, index) => {

                if (
                  index ===
                  results.length - 1
                ) {
                  return null;
                }

                const position =
                  (process.completionTime /
                    totalBurstTime) *
                  100;

                return (

                  <span
                    key={`time-${process.id}-${index}`}
                    className="gantt-time gantt-boundary-time"
                    style={{
                      left: `${position}%`,
                    }}
                  >
                    {process.completionTime}
                  </span>

                );

              })}


              <span className="gantt-time gantt-final-time">

                {
                  results[
                    results.length - 1
                  ].completionTime
                }

              </span>

            </div>

          </div>

        </section>

      )}


      {/* ================= RESULTS ================= */}

      {results.length > 0 && (

        <section className="sjf-card">

          <div className="section-title">

            <span>📊</span>

            <div>

              <h2>
                Scheduling Results
              </h2>

              <p>
                Calculated SJF scheduling results.
              </p>

            </div>

          </div>


          <div className="table-wrapper">

            <table className="sjf-table">

              <thead>

                <tr>

                  <th>
                    Process
                  </th>

                  <th>
                    Burst Time
                  </th>

                  <th>
                    Start Time
                  </th>

                  <th>
                    Completion Time
                  </th>

                  <th>
                    Waiting Time
                  </th>

                  <th>
                    Turnaround Time
                  </th>

                </tr>

              </thead>


              <tbody>

                {results.map((process, index) => (

                  <tr
                    key={`${process.id}-${index}`}
                  >

                    <td className="process-cell">
                      {process.id}
                    </td>

                    <td>
                      {process.burstTime}
                    </td>

                    <td>
                      {process.startTime}
                    </td>

                    <td>
                      {process.completionTime}
                    </td>

                    <td>
                      {process.waitingTime}
                    </td>

                    <td>
                      {process.turnaroundTime}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* Average Results */}

          <div className="average-container">

            <div className="average-box">

              <span>
                Average Waiting Time
              </span>

              <strong>
                {averageWaitingTime.toFixed(2)}
              </strong>

              <small>
                AWT
              </small>

            </div>


            <div className="average-box">

              <span>
                Average Turnaround Time
              </span>

              <strong>
                {averageTurnaroundTime.toFixed(2)}
              </strong>

              <small>
                ATAT
              </small>

            </div>

          </div>

        </section>

      )}


      {/* ================= EMPTY STATE ================= */}

      {results.length === 0 && (

        <section className="sjf-card">

          <div className="empty-state">

            <div className="empty-icon">
              🧮
            </div>

            <h3>
              No Processes Added
            </h3>

            <p>
              Add processes above to calculate
              SJF scheduling results.
            </p>

          </div>

        </section>

      )}


      {/* ================= CODE EDITOR ================= */}

      <section className="sjf-code-section">
        <CodeEditor />
      </section>


      {/* ================= COMPLEXITY / ANALYSIS ================= */}

      <section className="sjf-card">

        <div className="section-title">

          <span>📐</span>

          <div>

            <h2>
              Complexity / Analysis
            </h2>

            <p>
              Understand the performance and behavior of SJF.
            </p>

          </div>

        </div>


        <div className="analysis-grid">

          <div className="analysis-box">

            <span>
              Time Complexity
            </span>

            <strong>
              O(n²)
            </strong>

            <p>
              Finding the shortest burst time
              repeatedly can require comparisons
              between processes.
            </p>

          </div>


          <div className="analysis-box">

            <span>
              Space Complexity
            </span>

            <strong>
              O(n)
            </strong>

            <p>
              The process list and calculated
              results are stored.
            </p>

          </div>


          <div className="analysis-box">

            <span>
              Preemption
            </span>

            <strong>
              Non-Preemptive
            </strong>

            <p>
              A running process continues until
              its burst time finishes.
            </p>

          </div>


          <div className="analysis-box">

            <span>
              Main Advantage
            </span>

            <strong>
              Low Waiting Time
            </strong>

            <p>
              Shorter processes are completed
              earlier, reducing average waiting time.
            </p>

          </div>

        </div>

      </section>


      {/* ================= KEY TAKEAWAYS ================= */}

      <section className="sjf-card">

        <div className="section-title">

          <span>💡</span>

          <div>

            <h2>
              Key Takeaways
            </h2>

            <p>
              Important points to remember.
            </p>

          </div>

        </div>


        <div className="takeaway-list">

          <div>
            ✓ The process with the smallest Burst Time
            executes first.
          </div>

          <div>
            ✓ SJF in this practical is a non-preemptive
            scheduling algorithm.
          </div>

          <div>
            ✓ If Burst Times are equal, earlier queue
            order is maintained.
          </div>

          <div>
            ✓ SJF can reduce Average Waiting Time.
          </div>

          <div>
            ✓ Long processes may have to wait when
            shorter processes are available.
          </div>

        </div>

      </section>


      {/* ================= PRACTICE ================= */}

      <section className="sjf-card">

        <div className="section-title">

          <span>💪</span>

          <div>

            <h2>
              Practice
            </h2>

            <p>
              Try a small SJF calculation yourself.
            </p>

          </div>

        </div>


        <div className="practice-problem">

          <h3>
            Problem
          </h3>

          <p>
            Four processes have Burst Times
            P1 = 6, P2 = 2, P3 = 8 and P4 = 3.
            All processes arrive together.
            Using non-preemptive SJF, what is the
            Average Waiting Time?
          </p>


          <div className="practice-input-row">

            <input
              type="number"
              min="0"
              value={practiceAnswer}
              placeholder="Enter your answer"
              onChange={(e) => {
                setPracticeAnswer(e.target.value);
                setPracticeMessage("");
              }}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                checkPractice()
              }
            />

            <button
              className="practice-btn"
              onClick={checkPractice}
            >
              Check Answer
            </button>

          </div>


          {practiceMessage && (

            <p className="practice-message">
              {practiceMessage}
            </p>

          )}

        </div>

      </section>


      {/* ================= QUIZ ================= */}

      <section className="sjf-card">

        <div className="section-title">

          <span>📝</span>

          <div>

            <h2>
              SJF Quiz
            </h2>

            <p>
              Test your understanding of SJF scheduling.
            </p>

          </div>

        </div>


        <div className="quiz-question">

          <h3>
            1. Which process is selected first in SJF?
          </h3>

          <label>
            <input
              type="radio"
              name="q1"
              checked={quizAnswers.q1 === "a"}
              onChange={() =>
                setQuizAnswers((p) => ({
                  ...p,
                  q1: "a",
                }))
              }
            />
            Process with the smallest Burst Time
          </label>

          <label>
            <input
              type="radio"
              name="q1"
              checked={quizAnswers.q1 === "b"}
              onChange={() =>
                setQuizAnswers((p) => ({
                  ...p,
                  q1: "b",
                }))
              }
            />
            Process with the largest Burst Time
          </label>

          <label>
            <input
              type="radio"
              name="q1"
              checked={quizAnswers.q1 === "c"}
              onChange={() =>
                setQuizAnswers((p) => ({
                  ...p,
                  q1: "c",
                }))
              }
            />
            Last process in the queue
          </label>

        </div>


        <div className="quiz-question">

          <h3>
            2. SJF in this practical is which type of scheduling?
          </h3>

          <label>
            <input
              type="radio"
              name="q2"
              checked={quizAnswers.q2 === "a"}
              onChange={() =>
                setQuizAnswers((p) => ({
                  ...p,
                  q2: "a",
                }))
              }
            />
            Preemptive
          </label>

          <label>
            <input
              type="radio"
              name="q2"
              checked={quizAnswers.q2 === "b"}
              onChange={() =>
                setQuizAnswers((p) => ({
                  ...p,
                  q2: "b",
                }))
              }
            />
            Non-Preemptive
          </label>

          <label>
            <input
              type="radio"
              name="q2"
              checked={quizAnswers.q2 === "c"}
              onChange={() =>
                setQuizAnswers((p) => ({
                  ...p,
                  q2: "c",
                }))
              }
            />
            Both
          </label>

        </div>


        <div className="quiz-question">

          <h3>
            3. What is the main objective of SJF?
          </h3>

          <label>
            <input
              type="radio"
              name="q3"
              checked={quizAnswers.q3 === "a"}
              onChange={() =>
                setQuizAnswers((p) => ({
                  ...p,
                  q3: "a",
                }))
              }
            />
            Increase waiting time
          </label>

          <label>
            <input
              type="radio"
              name="q3"
              checked={quizAnswers.q3 === "b"}
              onChange={() =>
                setQuizAnswers((p) => ({
                  ...p,
                  q3: "b",
                }))
              }
            />
            Execute the largest process first
          </label>

          <label>
            <input
              type="radio"
              name="q3"
              checked={quizAnswers.q3 === "c"}
              onChange={() =>
                setQuizAnswers((p) => ({
                  ...p,
                  q3: "c",
                }))
              }
            />
            Reduce average waiting time
          </label>

        </div>


        <button
          className="quiz-submit-btn"
          onClick={submitQuiz}
        >
          Submit Quiz
        </button>


        {quizScore !== null && (

          <div
            className={`quiz-result ${
              quizScore === 3
                ? "quiz-pass"
                : "quiz-practice"
            }`}
          >

            <strong>
              Score: {quizScore}/3
            </strong>

            <span>
              {quizScore === 3
                ? "Excellent! You passed the SJF quiz."
                : "Keep practicing and try the quiz again."}
            </span>

          </div>

        )}

      </section>


      {/* ================= COMPLETE EXPERIMENT ================= */}

      <section className="sjf-card completion-card">

        <div className="section-title">

          <span>🏁</span>

          <div>

            <h2>
              Experiment Status
            </h2>

            <p>
              Finish the SJF practical when you are ready.
            </p>

          </div>

        </div>


        {!isCompleted ? (

          <button
            className="complete-btn"
            onClick={markComplete}
          >
            ✓ Mark Experiment Complete
          </button>

        ) : (

          <div className="completed-message">

            <strong>
              🎉 SJF Experiment Completed
            </strong>

            <span>
              You can now move to the next experiment.
            </span>

          </div>

        )}

      </section>

    </main>
  );
}

export default SJF;