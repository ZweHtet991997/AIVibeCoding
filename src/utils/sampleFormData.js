// Sample form data structure that demonstrates the JSON format
// This will be replaced with actual API data from the backend

export const sampleFormData = {
  id: "form_001",
  name: "Employee Onboarding Form",
  description: "Please complete this form to begin your onboarding process. All fields marked with * are required.",
  fields: [
    {
      id: "full_name",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      helpText: "Please enter your legal name as it appears on official documents"
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      placeholder: "your.email@company.com",
      required: true,
      helpText: "This will be your primary work email"
    },
    {
      id: "phone",
      type: "text",
      label: "Phone Number",
      placeholder: "+1 (555) 123-4567",
      required: true
    },
    {
      id: "date_of_birth",
      type: "date",
      label: "Date of Birth",
      required: true,
      minDate: "1900-01-01",
      maxDate: "2005-12-31"
    },
    {
      id: "department",
      type: "select",
      label: "Department",
      required: true,
      options: [
        { value: "engineering", label: "Engineering" },
        { value: "marketing", label: "Marketing" },
        { value: "sales", label: "Sales" },
        { value: "hr", label: "Human Resources" },
        { value: "finance", label: "Finance" },
        { value: "operations", label: "Operations" }
      ]
    },
    {
      id: "position",
      type: "text",
      label: "Job Position",
      placeholder: "e.g., Senior Software Engineer",
      required: true
    },
    {
      id: "start_date",
      type: "date",
      label: "Expected Start Date",
      required: true,
      minDate: new Date().toISOString().split('T')[0]
    },
    {
      id: "salary_expectation",
      type: "number",
      label: "Salary Expectation (USD)",
      placeholder: "75000",
      required: true,
      min: 30000,
      max: 200000,
      step: 1000,
      helpText: "Please provide your expected annual salary"
    },
    {
      id: "work_experience",
      type: "textarea",
      label: "Relevant Work Experience",
      placeholder: "Describe your relevant work experience...",
      required: true,
      rows: 5,
      helpText: "Please provide a summary of your relevant work experience"
    },
    {
      id: "skills",
      type: "checkbox",
      label: "Technical Skills",
      required: false,
      options: [
        { value: "javascript", label: "JavaScript" },
        { value: "python", label: "Python" },
        { value: "react", label: "React" },
        { value: "nodejs", label: "Node.js" },
        { value: "sql", label: "SQL" },
        { value: "aws", label: "AWS" },
        { value: "docker", label: "Docker" },
        { value: "git", label: "Git" }
      ],
      helpText: "Select all skills that apply to you"
    },
    {
      id: "work_preference",
      type: "radio",
      label: "Work Preference",
      required: true,
      options: [
        { value: "remote", label: "Remote" },
        { value: "hybrid", label: "Hybrid" },
        { value: "onsite", label: "On-site" }
      ]
    },
    {
      id: "resume",
      type: "file",
      label: "Resume/CV",
      required: true,
      accept: ".pdf,.doc,.docx",
      helpText: "Please upload your resume in PDF, DOC, or DOCX format"
    },
    {
      id: "cover_letter",
      type: "file",
      label: "Cover Letter (Optional)",
      required: false,
      accept: ".pdf,.doc,.docx",
      helpText: "Optional: Upload a cover letter explaining why you're interested in this position"
    }
  ],
  assignedAt: "2024-01-15T10:00:00Z",
  dueDate: "2024-01-22T17:00:00Z",
  status: "pending"
};

export const sampleAssignedForms = [
  {
    id: "form_001",
    name: "Employee Onboarding Form",
    description: "Complete your onboarding process",
    fields: sampleFormData.fields,
    assignedAt: "2024-01-15T10:00:00Z",
    dueDate: "2024-01-22T17:00:00Z",
    status: "pending"
  },
  {
    id: "form_002",
    name: "Performance Review",
    description: "Annual performance evaluation form",
    fields: [
      {
        id: "self_assessment",
        type: "textarea",
        label: "Self Assessment",
        placeholder: "Please provide a self-assessment of your performance...",
        required: true,
        rows: 6
      },
      {
        id: "goals_achieved",
        type: "number",
        label: "Goals Achieved (%)",
        placeholder: "85",
        required: true,
        min: 0,
        max: 100
      },
      {
        id: "improvement_areas",
        type: "textarea",
        label: "Areas for Improvement",
        placeholder: "What areas would you like to improve?",
        required: false,
        rows: 4
      }
    ],
    assignedAt: "2024-01-10T09:00:00Z",
    dueDate: "2024-01-25T17:00:00Z",
    status: "completed"
  },
  {
    id: "form_003",
    name: "Training Feedback",
    description: "Provide feedback on recent training sessions",
    fields: [
      {
        id: "training_session",
        type: "select",
        label: "Training Session",
        required: true,
        options: [
          { value: "react_basics", label: "React Basics" },
          { value: "node_advanced", label: "Node.js Advanced" },
          { value: "database_design", label: "Database Design" },
          { value: "agile_methodology", label: "Agile Methodology" }
        ]
      },
      {
        id: "rating",
        type: "radio",
        label: "Overall Rating",
        required: true,
        options: [
          { value: "5", label: "Excellent (5)" },
          { value: "4", label: "Very Good (4)" },
          { value: "3", label: "Good (3)" },
          { value: "2", label: "Fair (2)" },
          { value: "1", label: "Poor (1)" }
        ]
      },
      {
        id: "feedback",
        type: "textarea",
        label: "Additional Feedback",
        placeholder: "Please share your thoughts about the training...",
        required: false,
        rows: 4
      }
    ],
    assignedAt: "2024-01-12T14:00:00Z",
    dueDate: "2024-01-19T17:00:00Z",
    status: "pending"
  }
];

// Helper function to get form by ID (for demo purposes)
export const getFormById = (formId) => {
  return sampleAssignedForms.find(form => form.id === formId) || sampleFormData;
};

// Helper function to get all assigned forms (for demo purposes)
export const getAssignedForms = () => {
  return sampleAssignedForms;
}; 