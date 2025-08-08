import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columnWidths - Array of column width objects for formatting
 * @param {string} sheetName - Name of the worksheet (default: 'Sheet1')
 */
export const exportToExcel = (data, filename, columnWidths = null, sheetName = 'Sheet1') => {
  try {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths if provided
    if (columnWidths) {
      worksheet['!cols'] = columnWidths;
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const fullFilename = `${filename}_${timestamp}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, fullFilename);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export data. Please try again.');
  }
};

/**
 * Export user list data to Excel with predefined formatting
 * @param {Array} users - Array of user objects
 * @param {string} filename - Name of the file (without extension)
 */
export const exportUserListToExcel = (users, filename = 'users_export') => {
  // Prepare data for export - only include visible columns in the same order
  const exportData = users.map(user => ({
    'Username': user.userName,
    'Email': user.email,
    'Role': user.role,
    'Total Assigned Forms': user.totalAssignedForms,
    'Status': user.status
  }));

  // Set column widths for better formatting
  const columnWidths = [
    { wch: 20 }, // Username
    { wch: 30 }, // Email
    { wch: 15 }, // Role
    { wch: 20 }, // Total Assigned Forms
    { wch: 12 }  // Status
  ];

  return exportToExcel(exportData, filename, columnWidths, 'Users');
};

/**
 * Export approvals data to Excel with predefined formatting
 * @param {Array} approvals - Array of approval objects
 * @param {string} filename - Name of the file (without extension)
 */
export const exportApprovalsToExcel = (approvals, filename = 'approvals_export') => {
  // Prepare data for export - only include visible columns in the same order
  const exportData = approvals.map(approval => ({
    'Submission ID': approval.id,
    'Form Name': approval.formName,
    'Submitted By': approval.submittedBy,
    'Submission Date': new Date(approval.submissionDate).toLocaleDateString(),
    'Status': approval.status
  }));

  // Set column widths for better formatting
  const columnWidths = [
    { wch: 15 }, // Submission ID
    { wch: 25 }, // Form Name
    { wch: 20 }, // Submitted By
    { wch: 15 }, // Submission Date
    { wch: 12 }  // Status
  ];

  return exportToExcel(exportData, filename, columnWidths, 'Approvals');
};

/**
 * Export spam submissions data to Excel with predefined formatting
 * @param {Array} spamSubmissions - Array of spam submission objects
 * @param {string} filename - Name of the file (without extension)
 */
export const exportSpamSubmissionsToExcel = (spamSubmissions, filename = 'spam_submissions_export') => {
  // Prepare data for export - only include visible columns in the same order
  const exportData = spamSubmissions.map(submission => ({
    'Submission ID': submission.id,
    'Form Name': submission.formName,
    'Submitted By': submission.submittedBy,
    'Submission Date': new Date(submission.submissionDate).toLocaleDateString(),
    'Status': submission.status
  }));

  // Set column widths for better formatting
  const columnWidths = [
    { wch: 15 }, // Submission ID
    { wch: 25 }, // Form Name
    { wch: 20 }, // Submitted By
    { wch: 15 }, // Submission Date
    { wch: 12 }  // Status
  ];

  return exportToExcel(exportData, filename, columnWidths, 'Spam Submissions');
}; 