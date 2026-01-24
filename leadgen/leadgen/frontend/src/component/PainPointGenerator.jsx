// frontend/src/component/PainPointGenerator.jsx
import React from 'react';
import PersonaMapping from './PersonaMapping';

/**
 * PainPointGenerator is now a wrapper around PersonaMapping.
 * The PersonaMapping component handles auto-generation of pain points and outcomes.
 * When you select an ICP and Persona in PersonaMapping, it automatically:
 * 1. Calls /api/insights/{persona}?icpId={icpId}
 * 2. Triggers ensure_persona_insights_for_icp() if no insights exist
 * 3. Generates pain points and outcomes via Groq AI
 */
const PainPointGenerator = ({ icps, selectedIcpId, onSelectIcp }) => {
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      {/* PersonaMapping handles everything: ICP selection, persona tabs, and auto-generation */}
      <PersonaMapping
        icps={icps || []}
        selectedIcpId={selectedIcpId}
        onSelectIcp={onSelectIcp}
      />
    </div>
  );
};

export default PainPointGenerator;