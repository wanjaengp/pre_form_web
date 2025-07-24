import React, { useState } from 'react';

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    monthlyIncome: '',
    loanAmount: '',
    loanPurpose: '',
    age: '',
    phoneNumber: '',
    email: ''
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    // Basic front-end validation
    const requiredFields = [
      'fullName',
      'monthlyIncome',
      'loanAmount',
      'loanPurpose',
      'age',
      'phoneNumber',
      'email'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Missing field: ${field}`);
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return;
    }

    try {
      const response = await fetch('/api/v1/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          monthlyIncome: Number(formData.monthlyIncome),
          loanAmount: Number(formData.loanAmount),
          age: Number(formData.age),
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      setResult(data);
    } catch (err) {
      setError(err?.message || 'Unexpected error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow rounded bg-white">
      <h2 className="text-xl font-bold mb-4">Apply for a Loan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Full Name', name: 'fullName' },
          { label: 'Monthly Income', name: 'monthlyIncome', type: 'number' },
          { label: 'Loan Amount', name: 'loanAmount', type: 'number' },
          { label: 'Loan Purpose', name: 'loanPurpose' },
          { label: 'Age', name: 'age', type: 'number' },
          { label: 'Phone Number', name: 'phoneNumber' },
          { label: 'Email', name: 'email', type: 'email' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label className="block font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>

      {result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded">
          <h3 className="font-semibold">Application Submitted</h3>
          <p><strong>ID:</strong> {result.applicationId}</p>
          <p><strong>Eligible:</strong> {result.eligible ? 'Yes' : 'No'}</p>
          <p><strong>Reason:</strong> {result.reason}</p>
          <p><strong>Timestamp:</strong> {result.timestamp}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default LoanApplicationForm;
