import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockFormData = {
  1: { name: 'Employee Onboarding', fields: [{ label: 'Full Name', type: 'text' }] },
  2: { name: 'Leave Request', fields: [{ label: 'Start Date', type: 'date' }] },
  3: { name: 'Expense Report', fields: [{ label: 'Amount', type: 'number' }] },
};

const FormBuilderScreen = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(!!formId);

  useEffect(() => {
    if (formId) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setForm(mockFormData[formId] || null);
        setLoading(false);
      }, 600);
    } else {
      setForm({ name: '', fields: [] });
      setLoading(false);
    }
  }, [formId]);

  const handleBack = () => {
    navigate('/admin-dashboard', { state: { activeMenu: 'Forms' } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {formId ? 'Edit Form' : 'Create New Form'}
          </h1>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-primary-600 font-medium">Loading form...</span>
          </div>
        ) : (
          <div>
            {/* Form Name */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Form Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form?.name || ''}
                placeholder="Enter form name"
                readOnly
              />
            </div>
            {/* Fields List (placeholder) */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Fields</label>
              <div className="space-y-3">
                {form?.fields?.length ? (
                  form.fields.map((field, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-100 rounded p-3">
                      <span className="font-semibold text-gray-800">{field.label}</span>
                      <span className="text-gray-500 text-sm">({field.type})</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No fields yet. (Form builder UI coming soon)</div>
                )}
              </div>
            </div>
            {/* Placeholder for form builder controls */}
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
              Form Builder UI goes here (drag & drop, field config, etc.)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilderScreen; 