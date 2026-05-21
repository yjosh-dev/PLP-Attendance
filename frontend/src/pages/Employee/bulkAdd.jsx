import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  X,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Trash2,
  Users,
} from "lucide-react";

const BASE_URL = "http://localhost:8000";
const API_URL = `${BASE_URL}/api/employees/bulk`;

// Expected column headers (case-insensitive matching)
const COLUMN_MAP = {
  employee_id: ["employee_id", "employee id", "empid", "id", "emp_id", "employee number"],
  account_email: ["account_email", "email", "e-mail", "email address", "account email"],
  account_password: ["account_password", "password", "pwd", "account password"],
  first_name: ["first_name", "first name", "firstname", "fname", "given name"],
  middle_name: ["middle_name", "middle name", "middlename", "mname", "middle initial"],
  last_name: ["last_name", "last name", "lastname", "lname", "surname", "family name"],
  department: ["department", "dept", "department name"],
  position: ["position", "job title", "title", "role", "job position"],
  birthdate: ["birthdate", "birth date", "date of birth", "dob", "birthday"],
  profile_image: ["profile_image", "profile image", "photo", "avatar", "image", "picture"],
  email: ["email", "personal email", "secondary email", "email address"],
  phone: ["phone", "phone number", "phone_number", "contact number", "contact", "mobile", "telephone"],
};

function normalizeHeader(header) {
  return header?.toString().trim().toLowerCase().replace(/[\s\-]+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length < 2) {
          reject(new Error("File is empty or has only headers"));
          return;
        }

        // Get headers from first row
        const headers = jsonData[0].map(normalizeHeader);

        // Map column indices
        const columnIndex = {};
        const foundColumns = [];
        const missingColumns = [];

        for (const [key, aliases] of Object.entries(COLUMN_MAP)) {
          let found = false;
          for (const alias of aliases) {
            const idx = headers.findIndex((h) => h === normalizeHeader(alias));
            if (idx !== -1) {
              columnIndex[key] = idx;
              foundColumns.push(key);
              found = true;
              break;
            }
          }
          if (!found && ["employee_id", "first_name", "last_name"].includes(key)) {
            missingColumns.push(aliases[0]);
          }
        }

        // Validate required columns
        if (missingColumns.length > 0) {
          reject(new Error(`Missing required columns: ${missingColumns.join(", ")}`));
          return;
        }

        // Parse rows
        const records = [];
        const errors = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.every((cell) => !cell || cell.toString().trim() === "")) continue;

          const record = {};
          
          // Parse each available column
          for (const [key, idx] of Object.entries(columnIndex)) {
            let value = row[idx];
            
            // Handle Excel date for birthdate
            if (key === "birthdate" && typeof value === "number") {
              const date = XLSX.SSF.parse_date_code(value);
              value = `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
            } else {
              value = value?.toString().trim() || "";
            }
            
            record[key] = value;
          }

          // Validate required fields
          if (!record.employee_id) {
            errors.push({ row: i + 1, error: "Missing employee ID" });
            continue;
          }
          if (!record.first_name) {
            errors.push({ row: i + 1, employee_id: record.employee_id, error: "Missing first name" });
            continue;
          }
          if (!record.last_name) {
            errors.push({ row: i + 1, employee_id: record.employee_id, error: "Missing last name" });
            continue;
          }

          // Validate email format if provided
          if (record.account_email && !isValidEmail(record.account_email)) {
            errors.push({ row: i + 1, employee_id: record.employee_id, error: "Invalid account email format" });
          }
          
          if (record.email && !isValidEmail(record.email)) {
            errors.push({ row: i + 1, employee_id: record.employee_id, error: "Invalid personal email format" });
          }

          // Validate phone format if provided
          if (record.phone && !isValidPhone(record.phone)) {
            errors.push({ row: i + 1, employee_id: record.employee_id, error: "Invalid phone number format" });
          }

          records.push({ ...record, _row: i + 1 });
        }

        resolve({ records, errors, foundColumns, totalRows: jsonData.length - 1 });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s\+\-\(\)]{7,15}$/.test(phone);
}

function downloadTemplate() {
  const template = [
    [
      "employee_id",
      "account_email",
      "account_password",
      "first_name",
      "middle_name",
      "last_name",
      "department",
      "position",
      "birthdate",
      "profile_image",
      "email",
      "phone",
    ],
    [
      "EMP001",
      "john.doe@company.com",
      "password123",
      "John",
      "Michael",
      "Doe",
      "IT Department",
      "Software Developer",
      "1990-05-15",
      "profile1.jpg",
      "john.personal@email.com",
      "+1-555-0123",
    ],
    [
      "EMP002",
      "jane.smith@company.com",
      "password456",
      "Jane",
      "Marie",
      "Smith",
      "HR Department",
      "HR Manager",
      "1988-12-03",
      "profile2.jpg",
      "jane.smith@email.com",
      "+1-555-0124",
    ],
    [
      "EMP003",
      "bob.wilson@company.com",
      "password789",
      "Bob",
      "",
      "Wilson",
      "Finance",
      "Accountant",
      "1992-08-20",
      "",
      "",
      "555-0125",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Employees");

  // Set column widths
  ws["!cols"] = [
    { wch: 15 }, // employee_id
    { wch: 28 }, // account_email
    { wch: 18 }, // account_password
    { wch: 15 }, // first_name
    { wch: 15 }, // middle_name
    { wch: 15 }, // last_name
    { wch: 18 }, // department
    { wch: 22 }, // position
    { wch: 12 }, // birthdate
    { wch: 20 }, // profile_image
    { wch: 25 }, // email
    { wch: 15 }, // phone
  ];

  XLSX.writeFile(wb, "employee_bulk_template.xlsx");
}

export default function BulkAdd() {
  const [showModal, setShowModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      showToast("error", "Please upload an Excel (.xlsx, .xls) or CSV file");
      return;
    }

    setFile(file);
    try {
      const result = await parseFile(file);
      setParsedData(result);
    } catch (err) {
      showToast("error", err.message || "Failed to parse file");
      setFile(null);
      setParsedData(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!parsedData?.records?.length) {
      showToast("error", "No valid records to upload");
      return;
    }

    setUploading(true);
    try {
      const payload = parsedData.records.map(({ _row, ...rest }) => rest);
      
      const token = localStorage.getItem("auth_token");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ employees: payload }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      showToast("success", `Successfully registered ${payload.length} employee${payload.length !== 1 ? "s" : ""}`);
      setShowModal(false);
      setFile(null);
      setParsedData(null);
    } catch (err) {
      showToast("error", err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeRecord = (index) => {
    setParsedData((prev) => ({
      ...prev,
      records: prev.records.filter((_, i) => i !== index),
    }));
  };

  const getPreviewColumns = () => {
    if (!parsedData?.foundColumns) return [];
    // Show columns in a logical order
    const priorityOrder = [
      "employee_id", "first_name", "middle_name", "last_name",
      "account_email", "department", "position", "birthdate",
      "phone", "email", "account_password", "profile_image"
    ];
    return priorityOrder.filter(col => parsedData.foundColumns.includes(col));
  };

  const formatColumnLabel = (key) => {
    const labels = {
      employee_id: "Employee ID",
      account_email: "Account Email",
      account_password: "Password",
      first_name: "First Name",
      middle_name: "Middle Name",
      last_name: "Last Name",
      department: "Department",
      position: "Position",
      birthdate: "Birthdate",
      profile_image: "Profile Image",
      email: "Personal Email",
      phone: "Phone",
    };
    return labels[key] || key.replace(/_/g, " ");
  };

  return (
    <div className="-ml-1 w-[97%] h-[96%] bg-[#ECECEC] rounded-xl flex flex-col p-3.5 gap-3 overflow-hidden relative">
      {/* Toast */}
      {toast && (
        <div
          className={`absolute top-3 right-3 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold shadow-lg animate-in slide-in-from-right
          ${toast.type === "success" ? "bg-[#32a852] text-white" : "bg-red-600 text-white"}`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={12} />
          ) : (
            <AlertCircle size={12} />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-md font-bold text-gray-700 leading-none">
            Bulk Employee Registration
          </h1>
          <p className="text-[11px] text-gray-400 mt-0.5 leading-none">
            Upload Excel file to register multiple employees at once
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-semibold text-gray-500 hover:border-gray-300 transition-all duration-150 active:scale-95"
          >
            <Download size={11} />
            Template
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#32a852" }}
          >
            <Upload size={12} />
            Upload XLSX
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-xl border border-gray-200 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.10)] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="text-[9px] font-black tracking-[0.18em] uppercase text-gray-400">
                  Bulk Registration
                </p>
                <h2 className="text-sm font-semibold text-gray-800 mt-0.5">
                  Upload Employee Data
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFile(null);
                  setParsedData(null);
                }}
                className="text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {!file ? (
                /* Drop Zone */
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? "border-[#32a852] bg-green-50/50"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                  }`}
                >
                  <div className={`p-3 rounded-full ${dragOver ? "bg-green-100" : "bg-gray-100"}`}>
                    <Users size={24} className={dragOver ? "text-[#32a852]" : "text-gray-400"} />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-semibold text-gray-600">
                      {dragOver ? "Drop your file here" : "Drag & drop your Excel file"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      or click to browse
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-gray-300">
                      Supports .xlsx, .xls, .csv
                    </span>
                    <p className="text-[10px] text-gray-300 mt-1">
                      Required columns: Employee ID, First Name, Last Name
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>
              ) : parsedData ? (
                /* Parsed Data Preview */
                <div className="flex flex-col gap-4">
                  {/* File info */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <FileSpreadsheet size={16} className="text-[#32a852]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-700 truncate">{file.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {parsedData.records.length} valid record{parsedData.records.length !== 1 ? "s" : ""}
                        {parsedData.errors.length > 0 && (
                          <span className="text-red-400 ml-1">
                            · {parsedData.errors.length} error{parsedData.errors.length !== 1 ? "s" : ""}
                          </span>
                        )}
                        <span className="text-gray-300 ml-1">
                          · {parsedData.foundColumns?.length || 0} columns detected
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => { setFile(null); setParsedData(null); }}
                      className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Errors */}
                  {parsedData.errors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                      {parsedData.errors.map((err, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <AlertCircle size={10} className="text-red-400 flex-shrink-0" />
                          <span className="text-[10px] text-red-600">
                            Row {err.row}{err.employee_id ? ` (${err.employee_id})` : ""}: {err.error}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Records preview table */}
                  {parsedData.records.length > 0 && (
                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                      <div className="max-h-96 overflow-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 sticky top-0">
                              <th className="text-left px-3 py-2 text-[9px] font-black tracking-[0.18em] uppercase text-gray-400 sticky left-0 bg-gray-50">
                                #
                              </th>
                              {getPreviewColumns().map((col) => (
                                <th
                                  key={col}
                                  className="text-left px-3 py-2 text-[9px] font-black tracking-[0.18em] uppercase text-gray-400 whitespace-nowrap"
                                >
                                  {formatColumnLabel(col)}
                                </th>
                              ))}
                              <th className="text-center px-3 py-2 text-[9px] font-black tracking-[0.18em] uppercase text-gray-400">
                                -
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {parsedData.records.map((rec, i) => (
                              <tr
                                key={i}
                                className={`border-t border-gray-50 hover:bg-gray-50/50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}
                              >
                                <td className="px-3 py-2 text-[10px] text-gray-400 sticky left-0 bg-white">
                                  {i + 1}
                                </td>
                                {getPreviewColumns().map((col) => (
                                  <td
                                    key={col}
                                    className="px-3 py-2 text-[11px] text-gray-700 whitespace-nowrap max-w-[200px] truncate"
                                    title={rec[col] || "—"}
                                  >
                                    {col === "account_password" ? (
                                      <span className="text-gray-400">••••••••</span>
                                    ) : rec[col] ? (
                                      rec[col]
                                    ) : (
                                      <span className="text-gray-300">—</span>
                                    )}
                                  </td>
                                ))}
                                <td className="px-3 py-2 text-center">
                                  <button
                                    onClick={() => removeRecord(i)}
                                    className="text-gray-300 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Parsing... */
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={20} className="animate-spin text-[#32a852]" />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {file && parsedData && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <span className="text-[10px] text-gray-400">
                  Total: <span className="font-semibold text-gray-600">{parsedData.records.length}</span> employee{parsedData.records.length !== 1 ? "s" : ""} will be registered
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setFile(null);
                      setParsedData(null);
                    }}
                    disabled={uploading}
                    className="px-5 py-2 text-[11px] font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || parsedData.records.length === 0}
                    className="px-5 py-2 text-[11px] font-semibold text-white rounded-lg transition-all duration-150 disabled:opacity-60 flex items-center gap-1.5 hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "#32a852" }}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={11} className="animate-spin" />
                        Registering…
                      </>
                    ) : (
                      <>
                        <Upload size={11} />
                        Register {parsedData.records.length} Employee{parsedData.records.length !== 1 ? "s" : ""}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content area (empty state) */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col items-center justify-center gap-3">
        <div className="p-4 rounded-full bg-gray-50">
          <Users size={28} className="text-gray-300" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-500">No employees registered</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Click "Upload XLSX" to bulk register employees, or download the template first
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Required: Employee ID, First Name, Last Name
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-2 px-4 py-2 rounded-lg text-[11px] font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          style={{ background: "#32a852" }}
        >
          <Upload size={11} className="inline mr-1.5" />
          Upload XLSX
        </button>
      </div>
    </div>
  );
}