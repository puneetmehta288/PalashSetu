import React from 'react';
import { useParams } from 'react-router-dom';

const WorksheetView: React.FC = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h2>Worksheet {id}</h2>
      <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1rem', backgroundColor: '#fff' }}>
        <p className="hindi-text"><strong>Q1 (Hindi):</strong> २ + २ कितने होते हैं?</p>
        <p className="santali-text"><strong>Q1 (Santali):</strong> ᱒ + ᱒ ᱛᱤᱱᱟᱹᱜ ᱦᱩᱭᱩᱜᱼᱟ?</p>
        <p><strong>Answer:</strong> 4</p>
      </div>
      <button className="btn-primary">Export PDF</button>
    </div>
  );
};
export default WorksheetView;
