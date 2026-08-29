import React, { useState } from 'react';

const PDFLocalizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');

  return (
    <div>
      <h2>PDF Localizer</h2>
      <div 
        style={{ border: '2px dashed #cbd5e1', padding: '3rem', textAlign: 'center', borderRadius: '12px', marginBottom: '1rem', cursor: 'pointer' }}
        onClick={() => document.getElementById('pdfUpload')?.click()}
      >
        <span style={{ fontSize: '3rem' }}>📄</span>
        <p>{file ? file.name : 'Tap or drag to upload PDF'}</p>
        <input type="file" id="pdfUpload" hidden accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      {file && (
        <button className="btn-primary" onClick={() => setStatus('Processing...')}>
          Localize PDF
        </button>
      )}
      {status && (
        <div style={{ marginTop: '2rem' }}>
          <p>{status}</p>
          {status === 'Processing...' && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px' }}>
              <p className="hindi-text">Extracted: अध्याय १ - संख्याएँ</p>
              <p className="santali-text" style={{ color: '#ed8936' }}>Translated: ᱦᱟᱹᱴᱤᱧ ᱑ - ᱮᱞᱠᱷᱟ</p>
            </div>
          )}
          <button className="btn-primary" style={{ marginTop: '1rem', backgroundColor: '#38a169' }}>Download Translated PDF</button>
        </div>
      )}
    </div>
  );
};
export default PDFLocalizer;
