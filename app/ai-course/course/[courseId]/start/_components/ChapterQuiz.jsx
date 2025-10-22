"use client";
import React, { useMemo, useState, useEffect } from "react";

export default function ChapterQuiz({ content = [] }) {
    // Normalize content: keep only steps that have quiz arrays
    const steps = useMemo(() => {
        return (content || [])
            .map((step, i) => ({
                ...step,
                __stepIndex: i,
                quiz: Array.isArray(step.quiz) ? step.quiz : [],
            }))
            .filter((s) => s.quiz.length > 0);
    }, [content]);

    const totalSteps = steps.length;

    // state
    const [stepIndex, setStepIndex] = useState(0); // current step
    const [qIndex, setQIndex] = useState(0); // current question
    const [answersByStep, setAnswersByStep] = useState(
        steps.map((s) => s.quiz.map(() => ({ selectedIndex: null, answered: false })))
    );
    const [reviewMode, setReviewMode] = useState(false);

    // Reset state whenever steps change (i.e., when switching to another quiz)
    useEffect(() => {
        setStepIndex(0);
        setQIndex(0);
        setAnswersByStep(
            steps.map((s) => s.quiz.map(() => ({ selectedIndex: null, answered: false })))
        );
        setReviewMode(false);
    }, [steps]);

    if (totalSteps === 0) {
        return (
            <div className="max-w-3xl mx-auto p-6 text-center">
                <p className="text-gray-600">No quizzes found in this chapter.</p>
            </div>
        );
    }

    // Safe access to current step and question
    const step = steps[stepIndex] || { quiz: [] };
    const question = step.quiz[qIndex] || { options: [], correct_index: null, question: "" };

    function handleSelect(optionIndex) {
        setAnswersByStep((prev) => {
            const copy = prev.map((arr) => arr.slice());
            copy[stepIndex][qIndex] = { selectedIndex: optionIndex, answered: true };
            return copy;
        });
    }

    function goNextQuestion() {
        if (qIndex + 1 < step.quiz.length) {
            setQIndex((s) => s + 1);
        } else {
            setQIndex(step.quiz.length); // step summary
        }
    }

    function goPrevQuestion() {
        if (qIndex > 0) setQIndex((s) => s - 1);
    }

    function goNextStep() {
        if (stepIndex + 1 < totalSteps) {
            setStepIndex((s) => s + 1);
            setQIndex(0);
        }
    }

    function goPrevStep() {
        if (stepIndex > 0) {
            setStepIndex((s) => s - 1);
            setQIndex(0);
        }
    }

    function computeStepScore(si) {
        const answers = answersByStep[si] || [];
        const qs = steps[si].quiz;
        let correct = 0;
        answers.forEach((a, idx) => {
            if (!a || a.selectedIndex === null) return;
            const corrIdx = qs[idx].correct_index;
            if (a.selectedIndex === corrIdx) correct += 1;
        });
        return { correct, total: qs.length };
    }

    function computeTotalScore() {
        let correct = 0;
        let total = 0;
        steps.forEach((s, si) => {
            const res = computeStepScore(si);
            correct += res.correct;
            total += res.total;
        });
        return { correct, total };
    }

    const atStepSummary = qIndex >= step.quiz.length;

    // --- REVIEW MODE ---
    if (reviewMode) {
        return (
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold mb-4">Review All Answers</h4>
                <div className="space-y-4">
                    {steps.map((s, si) => (
                        <div key={si} className="border rounded p-3">
                            <h5 className="font-medium mb-2">{s.title || `Step ${si + 1}`}</h5>
                            {s.quiz.map((q, qi) => {
                                const ans = answersByStep[si][qi];
                                const answered = ans && ans.answered;
                                const selected = ans?.selectedIndex;
                                const correct = q.correct_index;
                                const isRight = answered && selected === correct;
                                return (
                                    <div key={qi} className="border-b last:border-b-0 py-2">
                                        <div className="font-medium">Q{qi + 1}: {q.question}</div>
                                        <div className="text-sm text-gray-600">
                                            Your answer: {answered ? q.options[selected] : <em className="text-gray-400">Not answered</em>}
                                        </div>
                                        <div className="text-sm text-gray-500">Correct answer: {q.options[correct]}</div>
                                        <div className={isRight ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                            {isRight ? "Correct" : "Wrong"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <button
                        onClick={() => setReviewMode(false)}
                        className="px-3 py-1 rounded bg-indigo-600 text-white"
                    >
                        Back to Quiz
                    </button>
                </div>
            </div>
        );
    }
    // --- REST OF THE ORIGINAL COMPONENT REMAINS UNCHANGED ---
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <header className="mb-4">
                <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                    <span>Step {stepIndex + 1} of {totalSteps}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                            style={{ width: `${Math.round(((stepIndex + 1) / totalSteps) * 100)}%` }}
                            aria-hidden
                        />
                    </div>
                </div>
            </header>

            <main>
                {!atStepSummary ? (
                    <div>
                        <div className="mb-4">
                            <div className="flex items-baseline justify-between">
                                <h4 className="text-lg font-medium">Question {qIndex + 1} of {step.quiz.length}</h4>
                                <div className="text-sm text-gray-500">Progress: {qIndex + 1}/{step.quiz.length}</div>
                            </div>

                            <p className="mt-3 text-gray-800">{question.question}</p>
                        </div>

                        <div className="grid gap-2">
                            {question.options.map((opt, oi) => {
                                const userAnswer = answersByStep[stepIndex]?.[qIndex];
                                const isSelected = userAnswer && userAnswer.selectedIndex === oi;
                                const isAnswered = userAnswer && userAnswer.answered;
                                const isCorrect = question.correct_index === oi;

                                const base = "border rounded p-3 text-left w-full";
                                const style = isAnswered
                                    ? isCorrect
                                        ? "bg-green-50 border-green-400"
                                        : isSelected
                                            ? "bg-red-50 border-red-400"
                                            : "bg-white"
                                    : "bg-white hover:bg-gray-50";

                                return (
                                    <button
                                        key={oi}
                                        onClick={() => handleSelect(oi)}
                                        className={`${base} ${style} flex justify-between items-center`}
                                        aria-pressed={isSelected}
                                    >
                                        <span>{opt}</span>
                                        <span className="ml-3 text-sm text-gray-500">{String.fromCharCode(65 + oi)}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="space-x-2">
                                <button
                                    onClick={goPrevQuestion}
                                    disabled={qIndex === 0}
                                    className="px-3 py-1 rounded border disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <button
                                    onClick={goNextQuestion}
                                    className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    {qIndex + 1 < step.quiz.length ? "Next" : "Finish Step"}
                                </button>
                            </div>

                            <div className="text-sm text-gray-500">
                                <span>
                                    Answered: {answersByStep[stepIndex].filter((a) => a.answered).length}/{step.quiz.length}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4">
                            {answersByStep[stepIndex]?.[qIndex]?.answered && (
                                <div>
                                    {answersByStep[stepIndex][qIndex].selectedIndex === question.correct_index ? (
                                        <div className="text-green-700 font-medium">✅ Correct</div>
                                    ) : (
                                        <div className="text-red-700 font-medium">
                                            ❌ Incorrect — correct answer: <span className="font-semibold">{question.options[question.correct_index]}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h4 className="text-lg font-medium mb-2">Step Summary</h4>
                        <p className="text-sm text-gray-600 mb-4">You finished the questions for this step. Review your results below.</p>

                        <div className="space-y-3">
                            {step.quiz.map((q, idx) => {
                                const ans = answersByStep[stepIndex][idx];
                                const answered = ans && ans.answered;
                                const selected = ans ? ans.selectedIndex : null;
                                const correct = q.correct_index;
                                const isRight = answered && selected === correct;

                                return (
                                    <div key={idx} className="border rounded p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium">Q{idx + 1}: {q.question}</div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Your answer: {answered ? q.options[selected] : <em className="text-gray-400">Not answered</em>}
                                                </div>
                                                <div className="text-sm text-gray-500">Correct answer: {q.options[correct]}</div>
                                            </div>
                                            <div className="text-sm">
                                                {isRight ? <span className="text-green-600 font-semibold">Correct</span> : <span className="text-red-600 font-semibold">Wrong</span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                <button
                                    onClick={() => setQIndex(Math.max(0, step.quiz.length - 1))}
                                    className="px-3 py-1 rounded border mr-2"
                                >
                                    Review Last Question
                                </button>

                                <button
                                    onClick={goPrevStep}
                                    disabled={stepIndex === 0}
                                    className="px-3 py-1 rounded border disabled:opacity-50 mr-2"
                                >
                                    Prev Step
                                </button>

                                <button
                                    onClick={goNextStep}
                                    disabled={stepIndex + 1 >= totalSteps}
                                    className="px-3 py-1 rounded bg-indigo-600 text-white disabled:opacity-50"
                                >
                                    {stepIndex + 1 < totalSteps ? "Next Step" : "Finish Quiz"}
                                </button>
                            </div>

                            <div className="text-sm text-gray-700">
                                <strong>{computeStepScore(stepIndex).correct}</strong> / {computeStepScore(stepIndex).total} correct in this step
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {stepIndex + 1 === totalSteps && atStepSummary && (
                <footer className="mt-6 border-t pt-4">
                    <h4 className="text-lg font-semibold">Final Summary</h4>
                    <div className="mt-2 text-sm text-gray-700">
                        {(() => {
                            const total = computeTotalScore();
                            return (
                                <div>
                                    <div className="mb-2">Total Score: <strong>{total.correct}</strong> / {total.total}</div>
                                    <ProgressBar value={Math.round((total.correct / Math.max(1, total.total)) * 100)} />
                                </div>
                            );
                        })()}
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={() => setReviewMode(true)}
                            className="px-3 py-1 rounded bg-green-600 text-white"
                        >
                            Review Answers
                        </button>
                    </div>
                </footer>
            )}
        </div>
    );
}

function ProgressBar({ value = 0 }) {
    return (
        <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-blue-500" style={{ width: `${value}%` }} />
        </div>
    );
}
