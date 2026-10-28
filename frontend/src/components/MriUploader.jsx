import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  AlertCircle, 
  ArrowRight, 
  Cpu, 
  CheckCircle2,
  Sparkles,
  FileImage
} from 'lucide-react';
import { api } from '../services/api';

export default function MriUploader({ onAnalysisCreated }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [patientId, setPatientId] = useState(`BRCA-PT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [modality, setModality] = useState('MRI_DCE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setErrorMessage(null);
    const validExtensions = ['.png', '.jpg', '.jpeg', '.dcm', '.dicom', '.tif', '.tiff'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      setErrorMessage(`Unsupported format. Please upload PNG, JPG, or DICOM files.`);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB clinical upload limit.');
      return;
    }

    setSelectedFile(file);
    // Generate object URL for image preview if standard image format
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const startAnalysis = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select or drop a patient MRI scan before starting analysis.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProgressPercent(15);
    setCurrentStage('Step 1/6: Validating image format & focal preprocessing...');

    // Simulate progressive stage feedback for smooth UX
    const timer1 = setTimeout(() => {
      setProgressPercent(35);
      setCurrentStage('Step 2/6: Agent 1 (Tumor Detection) searching for focal lesions...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgressPercent(55);
      setCurrentStage('Step 3/6: Agent 2 (Tumor Classification) predicting malignancy...');
    }, 800);

    const timer3 = setTimeout(() => {
      setProgressPercent(75);
      setCurrentStage('Step 4/6: Agent 3 (Grad-CAM) calculating layer4 gradient attribution...');
    }, 1200);

    try {
      const response = await api.uploadMriScan(selectedFile, patientId, modality);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      setProgressPercent(100);
      setCurrentStage('Analysis complete! Synthesizing multi-agent consensus...');

      setTimeout(() => {
        setIsProcessing(false);
        if (response.data && onAnalysisCreated) {
          onAnalysisCreated(response.data);
        }
      }, 500);

    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Analysis pipeline execution failed.');
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '850px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
          border: '1px solid var(--border-focus)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.75rem auto',
          color: 'var(--accent-cyan)'
        }}>
          <UploadCloud size={26} />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>
          Patient MRI Ingestion Portal
        </h2>
        <p style={{ maxWidth: '550px', margin: '0 auto' }}>
          Upload high-resolution breast MRI cross-sections (DCE-MRI, T1w, T2w) to initiate 
          the 6-agent diagnostic decision-support workflow.
        </p>
      </div>

      {/* Case Metadata Inputs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
        backgroundColor: 'rgba(11, 19, 37, 0.6)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Patient Anonymized ID
          </label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: '6px',
              backgroundColor: '#0a0f1d',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: '600',
              outline: 'none',
              fontFamily: 'var(--font-mono)'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            MRI Pulse Sequence
          </label>
          <select
            value={modality}
            onChange={(e) => setModality(e.target.value)}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: '6px',
              backgroundColor: '#0a0f1d',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="MRI_DCE">DCE-MRI (Dynamic Contrast-Enhanced)</option>
            <option value="MRI_T1">T1-Weighted Fast Spin Echo</option>
            <option value="MRI_T2">T2-Weighted Fat Suppressed</option>
            <option value="GENERIC_MRI">Standard Breast MRI Slice</option>
          </select>
        </div>
      </div>

      {/* Dropzone Container */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--primary)' : selectedFile ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.15)'}`,
          borderRadius: 'var(--radius-lg)',
          backgroundColor: dragActive ? 'rgba(6, 182, 212, 0.08)' : 'rgba(15, 27, 51, 0.45)',
          padding: '2.25rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '1.5rem',
          position: 'relative'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.dcm,.dicom,.tif,.tiff"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {selectedFile ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="MRI Scan Preview"
                style={{
                  maxWidth: '160px',
                  maxHeight: '160px',
                  borderRadius: '10px',
                  objectFit: 'contain',
                  border: '1px solid var(--border-focus)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
                }}
              />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}>
                <FileImage size={32} />
              </div>
            )}
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                {selectedFile.name}
              </span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB • Click or drag to replace
              </span>
            </div>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
              <FileCheck size={12} /> Scan Validated & Ready
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}>
              <UploadCloud size={28} />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Drag and drop patient MRI scan here, or <span style={{ color: 'var(--primary)' }}>browse</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Supports DICOM, PNG, JPG, or TIFF slices (up to 25 MB)
            </span>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          color: '#fda4af',
          fontSize: '0.825rem'
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Progress Bar when Active */}
      {isProcessing && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--accent-cyan)', marginBottom: '0.4rem', fontWeight: '600' }}>
            <span>{currentStage}</span>
            <span>{progressPercent}%</span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: '#0a0f1d',
            borderRadius: '9999px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
              transition: 'width 0.3s ease',
              boxShadow: '0 0 12px var(--primary)'
            }} />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => {
            setSelectedFile(null);
            setPreviewUrl(null);
            setErrorMessage(null);
          }}
          disabled={isProcessing || !selectedFile}
          className="btn btn-secondary"
        >
          Clear Selection
        </button>

        <button
          type="button"
          onClick={startAnalysis}
          disabled={isProcessing || !selectedFile}
          className="btn btn-primary"
          style={{ minWidth: '180px' }}
        >
          {isProcessing ? (
            <>
              <div className="spin-slow" style={{ width: '16px', height: '16px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%' }} />
              <span>Analyzing Pipeline...</span>
            </>
          ) : (
            <>
              <span>Execute 6-Agent Pipeline</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
