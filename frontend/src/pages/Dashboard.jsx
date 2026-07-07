import React, { useState } from 'react';
import { UploadCloud, Building2, FileText, Info, CheckCircle2, XCircle, Award } from 'lucide-react';
import { generateHash, getCertificates, saveCertificates } from '../utils/helpers';
import { verifyCertificate } from '../services/api';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const { mode, token, userRole } = useAuth();

  /* ==========================================================================
     RECRUITER STATES & FUNCTIONS
     ========================================================================== */
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const [manualLoading, setManualLoading] = useState(false);
  const [manualResult, setManualResult] = useState(null);
  const [manualForm, setManualForm] = useState({
    studentName: '',
    rollNumber: '',
    universityName: 'Northern Tech University',
    degreeType: 'Bachelor of Technology',
    programCourse: '',
    completionYear: '',
  });

  const handleManualChange = (e) => {
    setManualForm({
      ...manualForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setScanResult(null);
    }
  };

  const loadDemoCertificate = () => {
    setPreviewUrl('/demo_certificate.png');
    setScanResult(null);
    setScanLoading(true);

    setTimeout(async () => {
      const extractedData = {
        studentName: 'Jane Doe',
        rollNumber: '1NTU18CS123',
        universityName: 'Northern Tech University',
        degreeType: 'Bachelor of Technology',
        programCourse: 'Computer Science and Engineering',
        completionYear: 2022,
      };

      const { hashHex } = await generateHash(extractedData);
      const certs = getCertificates();
      const match = certs.find(c => c.hash === hashHex || (
        c.studentName?.toLowerCase() === 'jane doe' && 
        c.rollNumber === '1NTU18CS123'
      ));

      if (match) {
        setScanResult({
          status: 'valid',
          hash: hashHex,
          block: match.block || 1024,
          data: extractedData
        });
      } else {
        setScanResult({
          status: 'invalid',
          hash: hashHex,
          data: extractedData
        });
      }
      setScanLoading(false);
    }, 1500);
  };

  const handleClearScan = () => {
    setFile(null);
    setPreviewUrl('');
    setScanResult(null);
  };

  const handleScanVerify = async () => {
    if (!previewUrl) {
      alert('Please upload a certificate first or click Load Demo Certificate.');
      return;
    }
    setScanLoading(true);
    setScanResult(null);

    setTimeout(async () => {
      const extractedData = {
        studentName: 'Jane Doe',
        rollNumber: '1NTU18CS123',
        universityName: 'Northern Tech University',
        degreeType: 'Bachelor of Technology',
        programCourse: 'Computer Science and Engineering',
        completionYear: 2022
      };

      const { hashHex } = await generateHash(extractedData);
      const certs = getCertificates();
      const match = certs.find(c => c.hash === hashHex);

      if (match) {
        setScanResult({
          status: 'valid',
          hash: hashHex,
          block: match.block || 1024,
          data: extractedData
        });
      } else {
        setScanResult({
          status: 'invalid',
          hash: hashHex,
          data: extractedData
        });
      }
      setScanLoading(false);
    }, 1500);
  };

  const handleManualVerify = async (e) => {
    e.preventDefault();
    setManualLoading(true);
    setManualResult(null);

    if (mode === 'simulated') {
      setTimeout(async () => {
        const { hashHex } = await generateHash(manualForm);
        const certs = getCertificates();
        const match = certs.find(c => c.hash === hashHex || (
          c.studentName?.toLowerCase() === manualForm.studentName.toLowerCase().trim() && 
          c.rollNumber === manualForm.rollNumber.trim()
        ));

        if (match) {
          setManualResult({ status: 'valid', hash: hashHex, block: match.block, data: match });
        } else {
          setManualResult({ status: 'invalid', hash: hashHex });
        }
        setManualLoading(false);
      }, 1200);
    } else {
      try {
        const data = await verifyCertificate(token, manualForm);
        if (data.exists && data.matches && data.matches.length > 0) {
          const match = data.matches[0];
          setManualResult({
            status: 'valid',
            hash: match.hash || 'N/A',
            block: match.block || 'DB Record',
            data: {
              studentName: match.studentName,
              universityName: match.universityName,
              degreeType: match.degreeType,
              completionYear: match.completionYear,
              matchScore: match.matchScore
            }
          });
        } else {
          setManualResult({ status: 'invalid', hash: 'N/A' });
        }
      } catch (err) {
        alert(`Verification Error: ${err.message}`);
      } finally {
        setManualLoading(false);
      }
    }
  };

  /* ==========================================================================
     UNIVERSITY STATES & FUNCTIONS (NEW WORKFLOW)
     ========================================================================== */
  const [univFile, setUnivFile] = useState(null);
  const [univPreviewUrl, setUnivPreviewUrl] = useState('');
  const [registerResult, setRegisterResult] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [univForm, setUnivForm] = useState({
    studentName: '',
    studentEmail: '',
    enrollmentNumber: '',
    degreeType: 'B.Tech',
    universityName: 'Northern Tech University',
    collegeName: 'Global Tech Institute',
    completionYear: '',
    cgpa: '',
  });

  const handleUnivChange = (e) => {
    setUnivForm({
      ...univForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUnivFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setUnivFile(selectedFile);
      setUnivPreviewUrl(URL.createObjectURL(selectedFile));
      setRegisterResult(null);
    }
  };

  const loadUnivDemoCertificate = () => {
    // Standard mock file path
    setUnivPreviewUrl('/demo_certificate.png');
    setUnivFile(new File([""], "demo_certificate.png", { type: "image/png" }));
    setRegisterResult(null);
  };

  const handleUnivClearFile = () => {
    setUnivFile(null);
    setUnivPreviewUrl('');
    setRegisterResult(null);
  };

  const handleUnivRegister = async (e) => {
    e.preventDefault();
    if (!univPreviewUrl) {
      alert('Please upload a certificate document first.');
      return;
    }
    setRegisterLoading(true);
    setRegisterResult(null);

    if (mode === 'simulated') {
      // Simulated OCR check
      setTimeout(async () => {
        // Our simulated OCR reads:
        // Name: "Jane Doe" (case insensitive)
        // Roll/Enrollment: "1NTU18CS123"
        // University: "Northern Tech University"
        // Year: "2022"
        const ocrName = "Jane Doe";
        const ocrRoll = "1NTU18CS123";
        const ocrUniv = "Northern Tech University";
        const ocrYear = "2022";

        const reasons = [];

        // Check studentName
        if (univForm.studentName.toLowerCase().trim() !== ocrName.toLowerCase()) {
          reasons.push(`Student Name mismatch: manual entry "${univForm.studentName}" vs OCR detected "${ocrName}"`);
        }
        // Check roll number
        if (univForm.enrollmentNumber.trim() !== ocrRoll) {
          reasons.push(`Enrollment/Roll number mismatch: manual entry "${univForm.enrollmentNumber}" vs OCR detected "${ocrRoll}"`);
        }
        // Check university
        if (univForm.universityName.trim() !== ocrUniv) {
          reasons.push(`University Name mismatch: manual entry "${univForm.universityName}" vs OCR detected "${ocrUniv}"`);
        }
        // Check year
        if (univForm.completionYear.toString().trim() !== ocrYear) {
          reasons.push(`Completion Year mismatch: manual entry "${univForm.completionYear}" vs OCR detected "${ocrYear}"`);
        }

        if (reasons.length > 0) {
          setRegisterResult({
            status: 'error',
            message: 'Manual entry does not match the certificate document!',
            details: reasons
          });
        } else {
          // Success case - save to simulated ledger
          const { hashHex } = await generateHash({
            studentName: univForm.studentName,
            rollNumber: univForm.enrollmentNumber,
            universityName: univForm.universityName,
            degreeType: univForm.degreeType,
            completionYear: parseInt(univForm.completionYear)
          });

          const certs = getCertificates();
          const alreadyExists = certs.some(c => c.hash === hashHex);

          if (alreadyExists) {
            setRegisterResult({
              status: 'error',
              message: 'This certificate hash is already registered in the blockchain ledger!',
              details: ['Duplicate registration attempt prevented.']
            });
          } else {
            const newBlock = Math.floor(Math.random() * 3000) + 1500;
            const newCert = {
              studentName: univForm.studentName,
              rollNumber: univForm.enrollmentNumber,
              universityName: univForm.universityName,
              degreeType: univForm.degreeType,
              completionYear: parseInt(univForm.completionYear),
              cgpa: parseFloat(univForm.cgpa) || null,
              verificationStatus: 'Verified',
              block: newBlock,
              hash: hashHex,
              timestamp: new Date().toLocaleString()
            };

            saveCertificates([newCert, ...certs]);
            setRegisterResult({
              status: 'success',
              message: 'Certificate successfully verified against OCR & published to the blockchain ledger!',
              hash: hashHex,
              block: newBlock
            });

            // Reset form except defaults
            setUnivForm({
              studentName: '',
              studentEmail: '',
              enrollmentNumber: '',
              degreeType: 'B.Tech',
              universityName: 'Northern Tech University',
              collegeName: 'Global Tech Institute',
              completionYear: '',
              cgpa: '',
            });
            setUnivFile(null);
            setUnivPreviewUrl('');
          }
        }
        setRegisterLoading(false);
      }, 1800);
    } else {
      // Backend / DB Mode
      try {
        const formData = new FormData();
        formData.append('certificatePhoto', univFile);
        formData.append('studentName', univForm.studentName);
        formData.append('studentEmail', univForm.studentEmail || `${univForm.studentName.replace(/\s+/g, '').toLowerCase()}@university.edu`);
        formData.append('degreeType', univForm.degreeType);
        formData.append('universityName', univForm.universityName);
        formData.append('collegeName', univForm.collegeName);
        formData.append('completionYear', univForm.completionYear);
        formData.append('enrollmentNumber', univForm.enrollmentNumber);
        if (univForm.cgpa) {
          formData.append('cgpa', univForm.cgpa);
        }

        const response = await fetch('http://localhost:5000/api/university/upload-certificate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          setRegisterResult({
            status: 'error',
            message: data.message || 'Registration failed.',
            details: data.errors || [data.error || 'The entered details do not match the extracted OCR data.']
          });
        } else {
          setRegisterResult({
            status: 'success',
            message: 'Certificate successfully verified against OCR & registered in the database!',
            hash: data.hash || 'N/A',
            block: data.block || 'DB Record'
          });

          // Reset form
          setUnivForm({
            studentName: '',
            studentEmail: '',
            enrollmentNumber: '',
            degreeType: 'B.Tech',
            universityName: 'Northern Tech University',
            collegeName: 'Global Tech Institute',
            completionYear: '',
            cgpa: '',
          });
          setUnivFile(null);
          setUnivPreviewUrl('');
        }
      } catch (err) {
        setRegisterResult({
          status: 'error',
          message: 'Server error during verification.',
          details: [err.message]
        });
      } finally {
        setRegisterLoading(false);
      }
    }
  };

  /* ==========================================================================
     REDUX/CONTEXT ROUTING VIEW
     ========================================================================== */
  if (userRole === 'university') {
    return (
      <div className="dashboard-grid fade-in">
        {/* Left Column: Upload Certificate */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon-box upload">
              <UploadCloud size={20} />
            </div>
            <div className="card-title-box">
              <h3>Upload Certificate Document</h3>
              <p>Step 1: Upload the degree/transcript image for OCR extraction</p>
            </div>
          </div>

          <div className="upload-container">
            <button 
              type="button" 
              className="btn-submit-verification" 
              onClick={loadUnivDemoCertificate}
              style={{ backgroundColor: '#10b981', marginBottom: '0.5rem' }}
            >
              <FileText size={16} /> Load Demo Certificate (Sample Document)
            </button>

            {!univPreviewUrl ? (
              <label className="drag-drop-zone">
                <UploadCloud size={32} className="upload-icon" style={{ color: '#10b981' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  Drag and drop certificate document here
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or</span>
                <br />
                <span className="choose-file-btn" style={{ backgroundColor: '#10b981' }}>Choose File</span>
                <input 
                  type="file" 
                  onChange={handleUnivFileChange} 
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                />
                <p className="upload-formats">Accepted formats: JPG, PNG, PDF (Max size: 10MB)</p>
              </label>
            ) : (
              <div>
                <h4 className="preview-title">Uploaded Document Preview</h4>
                <div className="preview-box">
                  <img src={univPreviewUrl} alt="Certificate Preview" className="preview-image" />
                  <button className="remove-file-btn" onClick={handleUnivClearFile}>
                    Remove File
                  </button>
                </div>
              </div>
            )}

            <div className="info-alert" style={{ backgroundColor: '#f0fdf4', color: '#14532d' }}>
              <Info size={16} className="info-alert-icon" style={{ color: '#16a34a' }} />
              <p>
                <strong>OCR Engine Matching:</strong> The server will scan this document to read name, roll no, university and graduation year, then compare it with your manual entry to guarantee accuracy.
              </p>
            </div>

          </div>
        </div>

        {/* Right Column: Manual Entry & Verify */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon-box verify" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Building2 size={20} />
            </div>
            <div className="card-title-box">
              <h3>Manual Entry Registration</h3>
              <p>Step 2: Enter certificate metadata to match and store in registry</p>
            </div>
          </div>

          <form onSubmit={handleUnivRegister} className="dashboard-form">
            <h4 className="form-section-title">Certificate &amp; Candidate Metadata</h4>
            
            <div className="form-grid-row">
              <div className="form-group">
                <label>Student Full Name <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  name="studentName"
                  value={univForm.studentName}
                  onChange={handleUnivChange}
                  placeholder="Must match certificate text exactly"
                  required
                />
              </div>
              <div className="form-group">
                <label>Enrollment / Roll Number <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  name="enrollmentNumber"
                  value={univForm.enrollmentNumber}
                  onChange={handleUnivChange}
                  placeholder="e.g. 1NTU18CS123"
                  required
                />
              </div>
            </div>

            <div className="form-grid-row">
              <div className="form-group">
                <label>University / Board <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  name="universityName"
                  value={univForm.universityName}
                  onChange={handleUnivChange}
                  placeholder="e.g. Northern Tech University"
                  required
                />
              </div>
              <div className="form-group">
                <label>College / Department <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  name="collegeName"
                  value={univForm.collegeName}
                  onChange={handleUnivChange}
                  placeholder="e.g. Global Tech Institute"
                  required
                />
              </div>
            </div>

            <div className="form-grid-row">
              <div className="form-group">
                <label>Degree Type <span style={{ color: 'red' }}>*</span></label>
                <select 
                  name="degreeType" 
                  value={univForm.degreeType} 
                  onChange={handleUnivChange}
                >
                  <option value="B.Tech">Bachelor of Technology (B.Tech)</option>
                  <option value="B.Sc">Bachelor of Science (B.Sc)</option>
                  <option value="B.A">Bachelor of Arts (B.A)</option>
                  <option value="B.Com">Bachelor of Commerce (B.Com)</option>
                  <option value="M.Tech">Master of Technology (M.Tech)</option>
                  <option value="MBA">Master of Business Admin (MBA)</option>
                  <option value="M.Sc">Master of Science (M.Sc)</option>
                  <option value="M.Com">Master of Commerce (M.Com)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Year of Graduation <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="number" 
                  name="completionYear"
                  value={univForm.completionYear}
                  onChange={handleUnivChange}
                  placeholder="e.g. 2022"
                  required
                />
              </div>
            </div>

            <div className="form-grid-row">
              <div className="form-group">
                <label>Student Email (Optional)</label>
                <input 
                  type="email" 
                  name="studentEmail"
                  value={univForm.studentEmail}
                  onChange={handleUnivChange}
                  placeholder="student@domain.com"
                />
              </div>
              <div className="form-group">
                <label>CGPA (Optional)</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="cgpa"
                  value={univForm.cgpa}
                  onChange={handleUnivChange}
                  placeholder="e.g. 9.20"
                />
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="btn-clear-form" 
                onClick={() => setUnivForm({
                  studentName: '',
                  studentEmail: '',
                  enrollmentNumber: '',
                  degreeType: 'B.Tech',
                  universityName: 'Northern Tech University',
                  collegeName: 'Global Tech Institute',
                  completionYear: '',
                  cgpa: '',
                })}
              >
                Clear Details
              </button>
              <button 
                type="submit" 
                className="btn-save-verification" 
                style={{ backgroundColor: '#10b981' }}
                disabled={registerLoading}
              >
                {registerLoading ? 'Processing OCR & Registering...' : 'Verify & Register Certificate'}
              </button>
            </div>
          </form>

          {/* Registration Loading */}
          {registerLoading && (
            <div className="loader-box" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div className="loader" style={{ width: '32px', height: '32px', border: '3px solid #f3f3f3', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Running OCR scan on document and validating manual entries...</p>
            </div>
          )}

          {/* Registration Result Banner */}
          {registerResult && (
            <div 
              className="result-banner" 
              style={{ 
                marginTop: '1.5rem', 
                padding: '1.25rem', 
                borderRadius: '10px', 
                border: registerResult.status === 'success' ? '1px solid #abf7b1' : '1px solid #fecaca', 
                backgroundColor: registerResult.status === 'success' ? '#f0fdf4' : '#fdf2f2' 
              }}
            >
              {registerResult.status === 'success' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', marginBottom: '0.5rem' }}>
                    <CheckCircle2 size={22} />
                    <strong style={{ fontSize: '1rem' }}>Verification Match! Certificate Registered</strong>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#166534', marginBottom: '0.75rem' }}>{registerResult.message}</p>
                  
                  <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Blockchain Block:</span>
                      <strong style={{ color: 'var(--text-main)' }}>#{registerResult.block}</strong>
                    </div>
                    <div style={{ wordBreak: 'break-all' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Tamper-proof Hash:</span>
                      <br />
                      <strong style={{ fontFamily: 'monospace', color: '#10b981' }}>{registerResult.hash}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--red)', marginBottom: '0.5rem' }}>
                    <XCircle size={22} />
                    <strong style={{ fontSize: '1.05rem' }}>OCR Verification Discrepancy</strong>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {registerResult.message}
                  </p>
                  
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#991b1b', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {registerResult.details && registerResult.details.map((detail, idx) => (
                      <li key={idx}>⚠️ {detail}</li>
                    ))}
                  </ul>
                  
                  <p style={{ fontSize: '0.8rem', color: '#b91c1c', marginTop: '0.75rem', fontStyle: 'italic' }}>
                    Please check the uploaded certificate file and ensure your manually typed entries match it exactly.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT RECRUITER VIEW
  return (
    <div className="dashboard-grid fade-in">
      {/* Left Column: Scan & Verify Certificate */}
      <div className="dashboard-card">
        <div className="card-header">
          <div className="card-icon-box upload">
            <UploadCloud size={20} />
          </div>
          <div className="card-title-box">
            <h3>Scan &amp; Verify Certificate</h3>
            <p>Upload a certificate to scan, extract, and verify details automatically</p>
          </div>
        </div>

        <div className="upload-container">
          <button 
            type="button" 
            className="btn-submit-verification" 
            onClick={loadDemoCertificate}
            style={{ backgroundColor: '#4f46e5', marginBottom: '0.5rem' }}
          >
            <FileText size={16} /> Load Demo Certificate (Sample Scan)
          </button>

          {!previewUrl ? (
            <label className="drag-drop-zone">
              <UploadCloud size={32} className="upload-icon" />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Drag and drop certificate image here
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or</span>
              <br />
              <span className="choose-file-btn">Choose File</span>
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
              />
              <p className="upload-formats">Accepted formats: JPG, PNG, PDF (Max size: 10MB)</p>
            </label>
          ) : (
            <div>
              <h4 className="preview-title">Certificate Image</h4>
              <div className="preview-box">
                <img src={previewUrl} alt="Certificate Preview" className="preview-image" />
                <button className="remove-file-btn" onClick={handleClearScan}>
                  Remove File
                </button>
              </div>
            </div>
          )}

          <div className="info-alert">
            <Info size={16} className="info-alert-icon" />
            <p>Scanning extracts text dynamically using Google Vision OCR engines.</p>
          </div>

          <button 
            type="button" 
            onClick={handleScanVerify} 
            className="btn-submit-verification"
            disabled={scanLoading || !previewUrl}
          >
            {scanLoading ? 'Scanning &amp; Verifying...' : 'Scan &amp; Verify'}
          </button>

          {/* Scan Results Display */}
          {scanLoading && (
            <div className="loader-box" style={{ marginTop: '1rem' }}>
              <div className="loader" style={{ width: '32px', height: '32px' }}></div>
              <p style={{ fontSize: '0.85rem' }}>Extracting text &amp; matching ledger...</p>
            </div>
          )}

          {scanResult && (
            <div className="success-box" style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
              {scanResult.status === 'valid' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: 'var(--green)', marginBottom: '0.5rem' }}>
                    <CheckCircle2 size={24} />
                    <strong style={{ fontSize: '1.1rem' }}>Certificate Verified Genuine</strong>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Matched block #{scanResult.block}</p>
                  <div className="verified-data" style={{ marginTop: '0.5rem', backgroundColor: '#ffffff' }}>
                    <div><span>Candidate</span><strong>{scanResult.data.studentName}</strong></div>
                    <div><span>Institution</span><strong>{scanResult.data.universityName}</strong></div>
                    <div><span>Degree</span><strong>{scanResult.data.degreeType}</strong></div>
                    <div><span>Passing Year</span><strong>{scanResult.data.completionYear}</strong></div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: 'var(--red)', marginBottom: '0.5rem' }}>
                    <XCircle size={24} />
                    <strong style={{ fontSize: '1.1rem' }}>Verification Failed</strong>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No matching credentials found in blockchain ledger registry.</p>
                </>
              )}
              <div className="hash-display" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>{scanResult.hash}</div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Manual Entry Verification */}
      <div className="dashboard-card">
        <div className="card-header">
          <div className="card-icon-box verify">
            <Building2 size={20} />
          </div>
          <div className="card-title-box">
            <h3>Manual Entry Verification</h3>
            <p>Manually type certificate details to verify candidate credentials</p>
          </div>
        </div>

        <form onSubmit={handleManualVerify} className="dashboard-form">
          <h4 className="form-section-title">Candidate Information</h4>
          
          <div className="form-grid-row">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="studentName"
                value={manualForm.studentName}
                onChange={handleManualChange}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Roll Number / Registration Number</label>
              <input 
                type="text" 
                name="rollNumber"
                value={manualForm.rollNumber}
                onChange={handleManualChange}
                placeholder="e.g. 1NTU18CS123"
                required
              />
            </div>
          </div>

          <div className="form-grid-row">
            <div className="form-group">
              <label>University / Institution</label>
              <select 
                name="universityName" 
                value={manualForm.universityName} 
                onChange={handleManualChange}
              >
                <option value="Northern Tech University">Northern Tech University</option>
                <option value="IIT Bombay">IIT Bombay</option>
                <option value="IIT Delhi">IIT Delhi</option>
                <option value="BITS Pilani">BITS Pilani</option>
              </select>
            </div>
            <div className="form-group">
              <label>Degree</label>
              <select 
                name="degreeType" 
                value={manualForm.degreeType} 
                onChange={handleManualChange}
              >
                <option value="Bachelor of Technology">Bachelor of Technology</option>
                <option value="Bachelor of Science">Bachelor of Science</option>
                <option value="Master of Business Admin">Master of Business Admin</option>
                <option value="Bachelor of Arts">Bachelor of Arts</option>
              </select>
            </div>
          </div>

          <div className="form-grid-row">
            <div className="form-group">
              <label>Program / Course (Optional)</label>
              <input 
                type="text" 
                name="programCourse"
                value={manualForm.programCourse}
                onChange={handleManualChange}
                placeholder="e.g. Computer Science"
              />
            </div>
            <div className="form-group">
              <label>Year of Passing</label>
              <input 
                type="number" 
                name="completionYear"
                value={manualForm.completionYear}
                onChange={handleManualChange}
                placeholder="e.g. 2022"
                required
              />
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button 
              type="button" 
              className="btn-clear-form" 
              onClick={() => setManualForm({
                studentName: '',
                rollNumber: '',
                universityName: 'Northern Tech University',
                degreeType: 'Bachelor of Technology',
                programCourse: '',
                completionYear: '',
              })}
            >
              Clear Form
            </button>
            <button type="submit" className="btn-save-verification" disabled={manualLoading}>
              {manualLoading ? 'Verifying...' : 'Verify Manually'}
            </button>
          </div>
        </form>

        {/* Manual Result Display */}
        {manualResult && (
          <div className="success-box" style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
            {manualResult.status === 'valid' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: 'var(--green)', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={24} />
                  <strong style={{ fontSize: '1.1rem' }}>Matched Record Found</strong>
                </div>
                {manualResult.data.matchScore && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600', textAlign: 'center' }}>Fuzzy Match Score: {manualResult.data.matchScore}%</p>
                )}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>Verified against secure ledger block #{manualResult.block}</p>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: 'var(--red)', marginBottom: '0.5rem' }}>
                  <XCircle size={24} />
                  <strong style={{ fontSize: '1.1rem' }}>Record Not Found</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>The details provided do not match any certificate in the ledger.</p>
              </>
            )}
            <div className="hash-display" style={{ marginTop: '0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>{manualResult.hash}</div>
          </div>
        )}
      </div>
    </div>
  );
}
