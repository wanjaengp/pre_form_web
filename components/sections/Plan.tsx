import React, { useState } from "react";
import SectionHeader from "../SectionHeader";
import Container from "../Container";
import useStore from "@/store/useStore";

export default function Plan() {
  // Get step actions and plan slice setters and values from store
  const {
    step,
    increaseStep,
    decreaseStep,
    applicationId,
    loanStatus,
    setApplicationId,
    setLoanStatus,
  } = useStore();

  const [inputId, setInputId] = useState(applicationId); // local input state, initialized from store
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onNext = () => {
    increaseStep(step);
  };

  const onPrevious = () => {
    decreaseStep(step);
  };

  const fetchLoanStatus = async () => {
    if (!inputId) {
      setError("Please enter an application ID.");
      setLoanStatus(null);
      return;
    }

    setLoading(true);
    setError(null);
    setLoanStatus(null);

    try {
      const response = await fetch(`/api/v1/loans/${inputId}`);

      if (response.status === 404) {
        const data = await response.json();
        setError(data.message || "Loan application not found.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setLoanStatus(data);          // Save globally
      setApplicationId(inputId);    // Save globally
      setError(null);
    } catch (err) {
      setError("Failed to fetch loan status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container onNext={onNext} onPreviousStep={onPrevious}>
      <SectionHeader title="Check Loan Status" description="" />

      <div className="my-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Enter Application ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
        />

        <button
          onClick={fetchLoanStatus}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Status"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {loanStatus && (
          <div className="mt-4 p-4 border rounded bg-green-50">
            <p><strong>Application ID:</strong> {loanStatus.applicationId}</p>
            <p><strong>Name:</strong> {loanStatus.fullName}</p>
            <p><strong>Monthly Income:</strong> {loanStatus.monthlyIncome}</p>
            <p><strong>Loan Amount:</strong> {loanStatus.loanAmount}</p>
            <p><strong>Loan Purpose:</strong> {loanStatus.loanPurpose}</p>
            <p><strong>Age:</strong> {loanStatus.age}</p>
            <p><strong>Phone:</strong> {loanStatus.phoneNumber}</p>
            <p><strong>Email:</strong> {loanStatus.email}</p>
            <p><strong>Eligible:</strong> {loanStatus.eligible ? "Yes" : "No"}</p>
            <p><strong>Reason:</strong> {loanStatus.reason}</p>
            <p><strong>Timestamp:</strong> {new Date(loanStatus.timestamp).toLocaleString()}</p>
          </div>
        )}
      </div>
    </Container>
  );
}
