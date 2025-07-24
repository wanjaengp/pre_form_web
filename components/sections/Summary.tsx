import React from "react";
import SectionHeader from "../SectionHeader";
import Container from "../Container";
import useStore from "@/store/useStore";
import ThankYou from "./ThankYou";

export default function Summary() {
  const {
    step,
    decreaseStep,
    isSubmitted,
    onSubmit,
    applicationId,
    loanStatus,
    selectedApplications,
  } = useStore();

  const onNext = () => {
    onSubmit(isSubmitted);
  };

  const onPrevious = () => {
    decreaseStep(step);
  };

  return (
    <Container onNext={onNext} onPreviousStep={onPrevious}>
      {isSubmitted ? (
        <ThankYou />
      ) : (
        <>
          <SectionHeader
            title="Finishing up"
            description="Double-check everything looks OK before confirming."
          />

          {/* Loan Status from Plan.tsx */}
          {loanStatus ? (
            <section className="mb-6 p-4 border rounded bg-green-50 max-w-lg mx-auto">
              <h3 className="font-semibold mb-3 text-lg">Loan Status</h3>
              <p><strong>Application ID:</strong> {applicationId}</p>
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
            </section>
          ) : (
            <p className="text-center text-gray-500 mb-6">No loan status checked yet.</p>
          )}

          {/* Loan Applications from Addons.tsx */}
          {selectedApplications && selectedApplications.length > 0 ? (
            <section className="max-w-lg mx-auto">
              <h3 className="font-semibold mb-3 text-lg">Loan Applications</h3>
              <ul className="space-y-4">
                {selectedApplications.map((app, idx) => (
                  <li
                    key={app.id || idx}
                    className="p-4 border rounded-lg shadow-sm"
                  >
                    <p><strong>Loan ID:</strong> {app.id}</p>
                    <p><strong>Status:</strong> {app.status}</p>
                    <p><strong>Purpose:</strong> {app.purpose}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <p className="text-center text-gray-500">No loan applications loaded.</p>
          )}

          <section className="bg-c-neutral-alabaster rounded-[8px] px-6 py-4 mt-8 max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-c-primary-marine-blue font-medium lg:text-base">Total Applications</h3>
              </div>
              <span className="text-sm font-bold text-c-primary-marine-blue inline lg:text-base">
                {selectedApplications ? selectedApplications.length : 0}
              </span>
            </div>
            <div className="h-[1px] w-full bg-c-neutral-light-gray my-3" />
          </section>
        </>
      )}
    </Container>
  );
}
