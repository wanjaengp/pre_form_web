import React, { useEffect, useState } from "react";
import SectionHeader from "../SectionHeader";
import Container from "../Container";
import useStore from "@/store/useStore";
import axios from "axios";

export default function Addons() {
  const { step, increaseStep, decreaseStep, setSelectedApplications } = useStore(
    (state) => ({
      step: state.step,
      increaseStep: state.increaseStep,
      decreaseStep: state.decreaseStep,
      setSelectedApplications: state.setSelectedApplications,
    })
  );

  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLoans = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/v1/loans", {
        params: {
          page,
          limit: 10,
          eligible: true, // optional
          purpose: "education", // optional
        },
      });

      const { applications, totalPages } = response.data;
      setApplications(applications);
      setTotalPages(totalPages);

      // Save fetched applications to global store
      setSelectedApplications(applications);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch loan applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [page]);

  const onNext = () => {
    increaseStep(step);
  };

  const onPrevious = () => {
    decreaseStep(step);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <Container onNext={onNext} onPreviousStep={onPrevious}>
      <SectionHeader title="Application Result" description="" />
      {loading && <p>Loading loan applications...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && applications.length === 0 && <p>No loan applications found.</p>}

      {!loading && applications.length > 0 && (
        <ul className="space-y-4 mt-4">
          {applications.map((app: any, idx) => (
            <li key={idx} className="p-4 border rounded-lg shadow-sm">
              <p>
                <strong>Loan ID:</strong> {app.id}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
              <p>
                <strong>Purpose:</strong> {app.purpose}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </Container>
  );
}
