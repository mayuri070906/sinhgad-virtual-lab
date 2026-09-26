import { useState } from "react";
import "./RR.css";
import CodeEditor from "./CodeEditor";

function RR() {
  const [processes, setProcesses] = useState([]);
  const [processName, setProcessName] = useState("");
  const [burstTime, setBurstTime] = useState("");
  const [quantum, setQuantum] = useState("");

  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceMessage, setPracticeMessage] = useState("");

  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  const [isCompleted, setIsCompleted] = useState(false);

  // --------------------------------------------------
  // BACK BUTTON
  // --------------------------------------------------
  const goBack = () => {
    window.history.back();
  };

  // --------------------------------------------------
  // GENERATE NEXT PROCESS NAME
  // --------------------------------------------------
  const getNextProcessName = () => {
    let number = 1;

    while (
      processes.some(
        (process) => process.id === `P${number}`
      )
    ) {
      number++;
    }

    return `P${number}`;
  };

  // --------------------------------------------------
  // ADD PROCESS
  // --------------------------------------------------
  const addProcess = () => {
    const bt = Number(burstTime);

    if (!burstTime || bt <= 0) {
      alert("Please enter a valid Burst Time.");
      return;
    }

    const name =
      processName.trim() || getNextProcessName();

    const alreadyExists = processes.some(
      (process) =>
        process.id.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      alert("Process name already exists.");
      return;
    }

    const newProcess = {
      uid: `${Date.now()}-${Math.random()}`,
      id: name,
      bt: bt,
    };

    setProcesses((prev) => [...prev, newProcess]);

    setProcessName("");
    setBurstTime("");
    setIsCompleted(false);
  };

  // --------------------------------------------------
  // ENTER KEY
  // --------------------------------------------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addProcess();
    }
  };

  // --------------------------------------------------
  // REMOVE PROCESS
  // --------------------------------------------------
  const removeProcess = (uid) => {
    setProcesses((prev) =>
      prev.filter((process) => process.uid !== uid)
    );

    setIsCompleted(false);
  };

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------
  const resetAll = () => {
    setProcesses([]);
    setProcessName("");
    setBurstTime("");
    setQuantum("");
    setPracticeAnswer("");
    setPracticeMessage("");
    setQuizAnswers({});
    setQuizScore(null);
    setIsCompleted(false);
  };

  // --------------------------------------------------
  // ROUND ROBIN CALCULATION
  // --------------------------------------------------
  const calculateRR = () => {
    if (
      processes.length === 0 ||
      !quantum ||
      Number(quantum) <= 0
    ) {
      return {
        results: [],
        gantt: [],
      };
    }

    const q = Number(quantum);

    const remaining = processes.map((process) => ({
      uid: process.uid,
      id: process.id,
      bt: process.bt,
      remaining: process.bt,
      ct: 0,
    }));

    const gantt = [];

    let currentTime = 0;
    let completed = 0;

    // --------------------------------------------------
    // ROUND ROBIN LOOP
    // --------------------------------------------------
    while (completed < remaining.length) {
      let processExecuted = false;

      for (let i = 0; i < remaining.length; i++) {
        const process = remaining[i];

        if (process.remaining > 0) {
          processExecuted = true;

          const startTime = currentTime;

          const executionTime = Math.min(
            q,
            process.remaining
          );

          currentTime += executionTime;

          process.remaining -= executionTime;

          // Add Gantt block
          gantt.push({
            uid: process.uid,
            id: process.id,
            start: startTime,
            end: currentTime,
            duration: executionTime,
          });

          // Process completed
          if (process.remaining === 0) {
            process.ct = currentTime;
            completed++;
          }
        }
      }

      if (!processExecuted) {
        break;
      }
    }

    // --------------------------------------------------
    // CREATE FINAL RESULTS
    // AT is internally considered 0
    // --------------------------------------------------
    const results = processes.map((process) => {
      const matchingProcess = remaining.find(
        (p) => p.uid === process.uid
      );

      const at = 0;

      const ct = matchingProcess
        ? matchingProcess.ct
        : 0;

      const tat = ct - at;

      const wt = tat - process.bt;

      return {
        ...process,
        at,
        ct,
        tat,
        wt,
      };
    });

    return {
      results,
      gantt,
    };
  };

  // --------------------------------------------------
  // GET CALCULATION DATA
  // --------------------------------------------------
  const { results, gantt } = calculateRR();

  // --------------------------------------------------
  // AVERAGES
  // --------------------------------------------------
  const totalWT = results.reduce(
    (sum, process) => sum + process.wt,
    0
  );

  const totalTAT = results.reduce(
    (sum, process) => sum + process.tat,
    0
  );

  const averageWT =
    results.length > 0
      ? totalWT / results.length
      : 0;

  const averageTAT =
    results.length > 0
      ? totalTAT / results.length
      : 0;

  // --------------------------------------------------
  // TOTAL EXECUTION TIME
  // --------------------------------------------------
  const totalTime =
    gantt.length > 0
      ? gantt[gantt.length - 1].end
      : 0;

  // --------------------------------------------------
  // PRACTICE
  // --------------------------------------------------
  const checkPractice = () => {
    const answer = Number(practiceAnswer);

    if (answer === 5.33 || answer === 5.3) {
      setPracticeMessage(
        "Correct! Average Waiting Time = 5.33 time units."
      );
    } else {
      setPracticeMessage(
        "Try again. The correct Average Waiting Time is 5.33 time units."
      );
    }
  };

  // --------------------------------------------------
  // QUIZ
  // --------------------------------------------------
  const handleQuizChange = (question, answer) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
    setQuizScore(null);
  };

  const submitQuiz = () => {
    const correctAnswers = {
      q1: "a",
      q2: "b",
      q3: "c",
    };

    let score = 0;

    Object.keys(correctAnswers).forEach((question) => {
      if (
        quizAnswers[question] ===
        correctAnswers[question]
      ) {
        score++;
      }
    });

    setQuizScore(score);
  };

  // --------------------------------------------------
  // COMPLETE EXPERIMENT
  // --------------------------------------------------
  const markComplete = () => {
    if (processes.length === 0) {
      alert("Please add processes before completing the experiment.");
      return;
    }

    if (!quantum || Number(quantum) <= 0) {
      alert("Please enter a valid Time Quantum.");
      return;
    }

    setIsCompleted(true);
  };

  return (
    <div className="rr-page">

      {/* =================================================
          HEADER
      ================================================= */}
      <div className="rr-header">

        <button
          className="back-btn"
          onClick={goBack}
        >
          ← Back
        </button>

        <div className="rr-badge">
          OS PRACTICAL • EXPERIMENT 05
        </div>

        <h1>
          Round Robin Scheduling Algorithm
        </h1>

        <p>
          Round Robin is a preemptive CPU scheduling
          algorithm designed for time-sharing systems.
          Each process gets CPU time for a fixed time
          quantum in a circular order.
        </p>

      </div>


      {/* =================================================
          THEORY
      ================================================= */}
      <section className="rr-card theory-card">

        <div className="section-title">

          <span>📖</span>

          <div>
            <h2>Theory</h2>

            <p>
              Round Robin Scheduling
            </p>
          </div>

        </div>

        <p className="theory-text">
          Round Robin is a CPU scheduling algorithm
          used mainly in time-sharing systems. It is
          similar to First Come First Serve, but
          preemption is added to allow the CPU to
          switch between processes.
        </p>

        <p className="theory-text">
          A small unit of time called{" "}
          <strong>time quantum</strong>{" "}
          or time slice is assigned to each process.
          When the quantum expires, the running process
          is moved to the end of the ready queue if it
          is not completed.
        </p>

        <div className="theory-grid">

          <div className="theory-box">
            <h3>🔄 Preemptive</h3>

            <p>
              A process can be interrupted when its
              time quantum expires.
            </p>
          </div>

          <div className="theory-box">
            <h3>⏱️ Time Quantum</h3>

            <p>
              Each process receives a fixed amount of
              CPU time during each turn.
            </p>
          </div>

          <div className="theory-box">
            <h3>⚖️ Fairness</h3>

            <p>
              Every process gets a fair opportunity
              to use the CPU.
            </p>
          </div>

          <div className="theory-box">
            <h3>🚫 Starvation Free</h3>

            <p>
              Processes repeatedly get CPU time,
              reducing the possibility of starvation.
            </p>
          </div>

        </div>

        <div className="formula-box">

          <strong>
            Important Formulas
          </strong>

          <div className="formula-list">

            <span>
              TAT = CT − AT
            </span>

            <span>
              WT = TAT − BT
            </span>

            <span>
              Average WT = Total WT / Number of Processes
            </span>

            <span>
              Average TAT = Total TAT / Number of Processes
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          OBJECTIVE
      ================================================= */}
      <section className="rr-card">

        <div className="section-title">

          <span>🎯</span>

          <div>
            <h2>Objective</h2>

            <p>
              Learn and visualize Round Robin CPU scheduling.
            </p>
          </div>

        </div>

        <ul className="learning-list">

          <li>
            Understand the working of Round Robin scheduling.
          </li>

          <li>
            Understand the role of Time Quantum.
          </li>

          <li>
            Calculate Completion Time, Waiting Time and Turnaround Time.
          </li>

          <li>
            Visualize CPU execution using a Gantt Chart.
          </li>

        </ul>

      </section>


      {/* =================================================
          PREREQUISITES
      ================================================= */}
      <section className="rr-card">

        <div className="section-title">

          <span>📚</span>

          <div>
            <h2>Prerequisites</h2>

            <p>
              Basic concepts required before performing this experiment.
            </p>
          </div>

        </div>

        <div className="prerequisite-grid">

          <div className="prerequisite-box">
            <strong>CPU Scheduling</strong>
            <span>Basic scheduling concepts</span>
          </div>

          <div className="prerequisite-box">
            <strong>Burst Time</strong>
            <span>CPU execution time</span>
          </div>

          <div className="prerequisite-box">
            <strong>Ready Queue</strong>
            <span>Process execution order</span>
          </div>

          <div className="prerequisite-box">
            <strong>Time Quantum</strong>
            <span>Fixed CPU time slice</span>
          </div>

        </div>

      </section>


      {/* =================================================
          ALGORITHM
      ================================================= */}
      <section className="rr-card">

        <div className="section-title">

          <span>⚙️</span>

          <div>
            <h2>Algorithm</h2>

            <p>
              Steps followed by the Round Robin scheduler.
            </p>
          </div>

        </div>

        <ol className="algorithm-list">

          <li>
            Add all processes to the ready queue.
          </li>

          <li>
            Set the Time Quantum.
          </li>

          <li>
            Select the first process from the ready queue.
          </li>

          <li>
            Execute the process for the Time Quantum or until completion.
          </li>

          <li>
            If the process is not completed, move it to the end of the queue.
          </li>

          <li>
            Continue until all processes are completed.
          </li>

          <li>
            Calculate CT, TAT and WT for every process.
          </li>

        </ol>

      </section>


      {/* =================================================
          ADD PROCESS
      ================================================= */}
      <section className="rr-card">

        <div className="section-title">

          <span>➕</span>

          <div>
            <h2>Add Processes</h2>

            <p>
              Enter process name and burst time.
            </p>
          </div>

        </div>

        <div className="input-area">

          <div className="input-group">

            <label>
              Process Name
            </label>

            <input
              type="text"
              placeholder={getNextProcessName()}
              value={processName}
              onChange={(e) =>
                setProcessName(e.target.value)
              }
              onKeyDown={handleKeyDown}
            />

          </div>

          <div className="input-group">

            <label>
              Burst Time
            </label>

            <input
              type="number"
              min="1"
              placeholder="Example: 10"
              value={burstTime}
              onChange={(e) =>
                setBurstTime(e.target.value)
              }
              onKeyDown={handleKeyDown}
            />

          </div>

          <button
            className="add-btn"
            onClick={addProcess}
          >
            + Insert Process
          </button>

        </div>

        <div className="quantum-area">

          <div className="input-group">

            <label>
              Time Quantum
            </label>

            <input
              type="number"
              min="1"
              placeholder="Example: 3"
              value={quantum}
              onChange={(e) =>
                setQuantum(e.target.value)
              }
            />

          </div>

          <div className="quantum-info">

            <strong>
              ⏱️ Time Quantum
            </strong>

            <p>
              Enter the fixed time slice used by
              the Round Robin algorithm.
            </p>

          </div>

          <button
            className="reset-btn"
            onClick={resetAll}
          >
            Reset
          </button>

        </div>

      </section>


      {/* =================================================
          PROCESS QUEUE
      ================================================= */}
      {processes.length > 0 && (

        <section className="rr-card">

          <div className="section-title">

            <span>📋</span>

            <div>

              <h2>
                Process Queue
              </h2>

              <p>
                Processes are executed in circular order.
              </p>

            </div>

          </div>

          <div className="process-chips">

            {processes.map((process) => (

              <div
                className="process-chip"
                key={process.uid}
              >

                <span>
                  {process.id}
                </span>

                <small>
                  BT: {process.bt}
                </small>

                <button
                  onClick={() =>
                    removeProcess(process.uid)
                  }
                  title="Remove process"
                >
                  ×
                </button>

              </div>

            ))}

          </div>

        </section>

      )}


      {/* =================================================
          GANTT CHART
      ================================================= */}
      {gantt.length > 0 && (

        <section className="rr-card gantt-card">

          <div className="section-title">

            <span>📈</span>

            <div>

              <h2>
                Gantt Chart
              </h2>

              <p>
                Visual representation of Round Robin
                CPU execution.
              </p>

            </div>

          </div>


          {/* SCROLL CONTAINER */}
          <div className="gantt-scroll">

            <div className="rr-gantt-wrapper">

              {/* PROCESS LABELS */}
              <div className="rr-gantt-label-row">

                {gantt.map((block, index) => (

                  <div
                    className="rr-gantt-top-label"
                    key={index}
                  >
                    {block.id}
                  </div>

                ))}

              </div>


              {/* GANTT BLOCKS */}
              <div className="rr-gantt-chart">

                {gantt.map((block, index) => (

                  <div
                    className={`rr-gantt-block ${
                      index % 3 === 0
                        ? "rr-gantt-blue"
                        : index % 3 === 1
                        ? "rr-gantt-dark-blue"
                        : "rr-gantt-light-blue"
                    }`}
                    key={index}
                    title={`${block.id} : ${block.start} - ${block.end}`}
                  >

                    <strong>
                      {block.id}
                    </strong>

                    <span>
                      {block.duration} units
                    </span>

                  </div>

                ))}

              </div>


              {/* TIME VALUES */}
              <div className="rr-gantt-times">

                {gantt.map((block, index) => (

                  <span
                    className={
                      index === 0
                        ? "rr-start-time"
                        : "rr-boundary-time"
                    }
                    key={`time-${index}`}
                    style={{
                      left: `${index * 110}px`,
                    }}
                  >
                    {block.start}
                  </span>

                ))}

                <span
                  className="rr-final-time"
                  style={{
                    left: `${gantt.length * 110}px`,
                  }}
                >
                  {totalTime}
                </span>

              </div>

            </div>

          </div>

        </section>

      )}


      {/* =================================================
          SCHEDULING RESULTS
      ================================================= */}
      {results.length > 0 && (

        <section className="rr-card">

          <div className="section-title">

            <span>📊</span>

            <div>

              <h2>
                Round Robin Scheduling Results
              </h2>

              <p>
                Completion time, turnaround time and
                waiting time are calculated automatically.
              </p>

            </div>

          </div>

          <div className="table-wrapper">

            <table className="rr-table">

              <thead>

                <tr>

                  <th>
                    Process
                  </th>

                  <th>
                    BT
                  </th>

                  <th>
                    CT
                  </th>

                  <th>
                    TAT
                  </th>

                  <th>
                    WT
                  </th>

                </tr>

              </thead>

              <tbody>

                {results.map((process) => (

                  <tr key={process.uid}>

                    <td className="process-cell">
                      {process.id}
                    </td>

                    <td>
                      {process.bt}
                    </td>

                    <td>
                      {process.ct}
                    </td>

                    <td>
                      {process.tat}
                    </td>

                    <td>
                      {process.wt}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <div className="average-container">

            <div className="average-box">

              <span>
                Average Waiting Time
              </span>

              <strong>
                {averageWT.toFixed(2)}
              </strong>

              <small>
                time units
              </small>

            </div>

            <div className="average-box">

              <span>
                Average Turnaround Time
              </span>

              <strong>
                {averageTAT.toFixed(2)}
              </strong>

              <small>
                time units
              </small>

            </div>

          </div>

        </section>

      )}


      {/* =================================================
          EMPTY STATE
      ================================================= */}
      {processes.length === 0 && (

        <div className="empty-state">

          <div className="empty-icon">
            🖥️
          </div>

          <h3>
            No Processes Added
          </h3>

          <p>
            Enter process name, burst time and
            time quantum to start the Round Robin
            visualization.
          </p>

        </div>

      )}


      {/* =================================================
          CODE EDITOR
      ================================================= */}
      <section className="rr-code-section">

        <CodeEditor />

      </section>


      {/* =================================================
          COMPLEXITY / ANALYSIS
      ================================================= */}
      <section className="rr-card">

        <div className="section-title">

          <span>🧠</span>

          <div>
            <h2>
              Complexity / Analysis
            </h2>

            <p>
              Performance characteristics of Round Robin.
            </p>
          </div>

        </div>

        <div className="analysis-grid">

          <div className="analysis-box">

            <span>
              Time Complexity
            </span>

            <strong>
              O(n + ΣBT / Q)
            </strong>

            <p>
              Depends on the number of processes,
              total burst time and time quantum.
            </p>

          </div>

          <div className="analysis-box">

            <span>
              Space Complexity
            </span>

            <strong>
              O(n + k)
            </strong>

            <p>
              Stores process information and Gantt
              execution slices.
            </p>

          </div>

          <div className="analysis-box">

            <span>
              Scheduling Type
            </span>

            <strong>
              Preemptive
            </strong>

            <p>
              A running process can be interrupted
              after its time quantum expires.
            </p>

          </div>

          <div className="analysis-box">

            <span>
              Main Parameter
            </span>

            <strong>
              Time Quantum
            </strong>

            <p>
              Controls how long each process runs
              in one turn.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          KEY TAKEAWAYS
      ================================================= */}
      <section className="rr-card">

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

        <ul className="takeaway-list">

          <li>
            Round Robin is a preemptive scheduling algorithm.
          </li>

          <li>
            Every process receives CPU time according to the Time Quantum.
          </li>

          <li>
            An unfinished process is moved to the end of the ready queue.
          </li>

          <li>
            Smaller quantum generally provides more frequent context switching.
          </li>

          <li>
            Larger quantum makes Round Robin behave more like FCFS.
          </li>

        </ul>

      </section>


      {/* =================================================
          PRACTICE
      ================================================= */}
      <section className="rr-card practice-card">

        <div className="section-title">

          <span>✏️</span>

          <div>
            <h2>
              Practice
            </h2>

            <p>
              Test your Round Robin calculation skills.
            </p>
          </div>

        </div>

        <div className="practice-question">

          <p>
            Consider P1 = 5, P2 = 4, P3 = 2 and
            Time Quantum = 2. All arrival times are 0.
            What is the Average Waiting Time?
          </p>

          <div className="practice-input-row">

            <input
              type="number"
              step="0.01"
              placeholder="Enter your answer"
              value={practiceAnswer}
              onChange={(e) =>
                setPracticeAnswer(e.target.value)
              }
            />

            <button
              className="check-btn"
              onClick={checkPractice}
            >
              Check Answer
            </button>

          </div>

          {practiceMessage && (

            <div className="practice-message">
              {practiceMessage}
            </div>

          )}

        </div>

      </section>


      {/* =================================================
          QUIZ
      ================================================= */}
      <section className="rr-card quiz-card">

        <div className="section-title">

          <span>📝</span>

          <div>
            <h2>
              Quiz
            </h2>

            <p>
              Check your understanding of Round Robin.
            </p>
          </div>

        </div>

        <div className="quiz-question">

          <p>
            <strong>1.</strong>{" "}
            Round Robin is which type of scheduling?
          </p>

          <label>
            <input
              type="radio"
              name="q1"
              checked={quizAnswers.q1 === "a"}
              onChange={() =>
                handleQuizChange("q1", "a")
              }
            />
            Preemptive
          </label>

          <label>
            <input
              type="radio"
              name="q1"
              checked={quizAnswers.q1 === "b"}
              onChange={() =>
                handleQuizChange("q1", "b")
              }
            />
            Non-preemptive
          </label>

          <label>
            <input
              type="radio"
              name="q1"
              checked={quizAnswers.q1 === "c"}
              onChange={() =>
                handleQuizChange("q1", "c")
              }
            />
            Static
          </label>

        </div>


        <div className="quiz-question">

          <p>
            <strong>2.</strong>{" "}
            What determines how long a process runs in one turn?
          </p>

          <label>
            <input
              type="radio"
              name="q2"
              checked={quizAnswers.q2 === "a"}
              onChange={() =>
                handleQuizChange("q2", "a")
              }
            />
            Burst Time
          </label>

          <label>
            <input
              type="radio"
              name="q2"
              checked={quizAnswers.q2 === "b"}
              onChange={() =>
                handleQuizChange("q2", "b")
              }
            />
            Time Quantum
          </label>

          <label>
            <input
              type="radio"
              name="q2"
              checked={quizAnswers.q2 === "c"}
              onChange={() =>
                handleQuizChange("q2", "c")
              }
            />
            Process ID
          </label>

        </div>


        <div className="quiz-question">

          <p>
            <strong>3.</strong>{" "}
            What happens when a process does not finish
            within its Time Quantum?
          </p>

          <label>
            <input
              type="radio"
              name="q3"
              checked={quizAnswers.q3 === "a"}
              onChange={() =>
                handleQuizChange("q3", "a")
              }
            />
            It is deleted
          </label>

          <label>
            <input
              type="radio"
              name="q3"
              checked={quizAnswers.q3 === "b"}
              onChange={() =>
                handleQuizChange("q3", "b")
              }
            />
            It gets the entire CPU again
          </label>

          <label>
            <input
              type="radio"
              name="q3"
              checked={quizAnswers.q3 === "c"}
              onChange={() =>
                handleQuizChange("q3", "c")
              }
            />
            It moves to the end of the ready queue
          </label>

        </div>


        <button
          className="quiz-submit-btn"
          onClick={submitQuiz}
        >
          Submit Quiz
        </button>

        {quizScore !== null && (

          <div className="quiz-result">

            You scored{" "}
            <strong>
              {quizScore}/3
            </strong>

            .

          </div>

        )}

      </section>


      {/* =================================================
          EXPERIMENT STATUS
      ================================================= */}
      <section className="rr-card completion-card">

        <div className="section-title">

          <span>
            {isCompleted ? "✅" : "🏁"}
          </span>

          <div>

            <h2>
              Experiment Status
            </h2>

            <p>
              Complete the experiment after performing the simulation.
            </p>

          </div>

        </div>

        {isCompleted ? (

          <div className="completed-message">

            <strong>
              ✅ Experiment Completed
            </strong>

            <p>
              Round Robin scheduling experiment has been
              successfully completed.
            </p>

          </div>

        ) : (

          <button
            className="complete-btn"
            onClick={markComplete}
          >
            ✓ Mark Experiment Complete
          </button>

        )}

      </section>

    </div>
  );
}

export default RR;