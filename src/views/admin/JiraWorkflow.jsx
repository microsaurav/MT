import React from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeStyles = (borderColor) => ({
  background: '#f9fafb',
  color: '#333',
  padding: '15px',
  borderRadius: '8px',
  border: `2px solid ${borderColor}`,
  fontSize: '14px',
  fontFamily: 'Segoe UI, sans-serif',
  borderColor,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
});

const createNode = (id, label, x, y, color) => ({
  id,
  data: { label },
  position: { x, y },
  style: nodeStyles(color)
});

const initialNodes = [
  createNode('start', 'Start', 300, 0, '#007BFF'),
  createNode('1', 'Open', 300, 100, '#FFC107'),
  createNode('2', 'CR Review', 300, 200, '#17A2B8'),
  createNode('3', 'Awaiting Clarification', 150, 300, '#FF7043'),
  createNode('4', 'CR Approved', 450, 300, '#28A745'),
  createNode('5', 'CR Rejected', 600, 200, '#DC3545'),
  createNode('6', 'BRD Creation', 450, 400, '#6F42C1'),
  createNode('7', 'BRD Review', 450, 500, '#007BFF'),
  createNode('8', 'Solution Design Creation', 450, 600, '#8A2BE2'),
  createNode('9', 'Solution Design Review', 450, 700, '#6495ED'),
  createNode('10', 'Solution Design Signed Off', 450, 800, '#2E8B57'),
  createNode('11', 'QA Test Cases', 150, 900, '#FFD700'),
createNode('12', 'QA Testing', 350, 950, '#FFA500'),
createNode('13', 'QA Passed', 550, 950, '#28A745'),
createNode('14', 'UAT', 350, 1000, '#8A2BE2'),
createNode('15', 'UAT Sign Off', 550, 1000, '#00BFFF'),
createNode('16', 'Awaiting RCB Approval', 350, 1050, '#8B008B'),
  createNode('17', 'RCB Approved', 450, 1050, '#32CD32'),
  createNode('18', 'RCB Rejected', 600, 1050, '#DC3545'),
  createNode('19', 'Awaiting Production Movement', 300, 1100, '#FF8C00'),
  createNode('20', 'Go-Live', 450, 1100, '#228B22'),
  createNode('21', 'Deployed', 300, 1150, '#2E8B57'),
  createNode('close', 'Close', 300, 1200, '#333333'),

  // Detailed nodes for additional information
  createNode('subtitles', 'Subtitles', 800, 100, '#FFC0CB'),
  createNode('currentStatus', 'Current Status', 800, 200, '#FFD700'),
  createNode('nextStatus', 'Next Status', 800, 300, '#87CEEB'),
  createNode('actionOwner', 'Action Owner', 800, 400, '#FF8C00'),
  createNode('assignees', 'Assignees', 800, 500, '#90EE90'),
  createNode('actions', 'Actions', 800, 600, '#DDA0DD')
];

const initialEdges = [
  { id: 'e-start-1', source: 'start', target: '1', label: 'Create', animated: true },
  { id: 'e1-2', source: '1', target: '2', label: 'Submit for Approval', animated: true },
  { id: 'e2-3', source: '2', target: '3', label: 'Clarifications Required', animated: true },
  { id: 'e3-2', source: '3', target: '2', label: 'Info Updated', animated: true },
  { id: 'e2-4', source: '2', target: '4', label: 'Approved', animated: true },
  { id: 'e2-5', source: '2', target: '5', label: 'Rejected', animated: true },
  { id: 'e4-6', source: '4', target: '6', label: 'Assign BA', animated: true },
  { id: 'e6-7', source: '6', target: '7', label: 'BRD Review', animated: true },
  { id: 'e7-8', source: '7', target: '8', label: 'Solution Design Creation', animated: true },
  { id: 'e8-9', source: '8', target: '9', label: 'Solution Design Review', animated: true },
  { id: 'e9-10', source: '9', target: '10', label: 'Sign Off', animated: true },
  { id: 'e10-11', source: '10', target: '11', label: 'QA Test Cases', animated: true },
  { id: 'e11-12', source: '11', target: '12', label: 'QA Testing', animated: true },
  { id: 'e12-13', source: '12', target: '13', label: 'QA Passed', animated: true },
  { id: 'e13-14', source: '13', target: '14', label: 'UAT', animated: true },
  { id: 'e14-15', source: '14', target: '15', label: 'UAT Sign Off', animated: true },
  { id: 'e15-16', source: '15', target: '16', label: 'Awaiting RCB Approval', animated: true },
  { id: 'e16-17', source: '16', target: '17', label: 'RCB Approved', animated: true },
  { id: 'e16-18', source: '16', target: '18', label: 'RCB Rejected', animated: true },
  { id: 'e17-19', source: '17', target: '19', label: 'Awaiting Production Movement', animated: true },
  { id: 'e19-20', source: '19', target: '20', label: 'Go-Live', animated: true },
  { id: 'e20-21', source: '20', target: '21', label: 'Deployed', animated: true },
  { id: 'e21-close', source: '21', target: 'close', label: 'Complete', animated: true }
];

const JiraWorkflowFlow = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
        <MiniMap nodeColor={(node) => node?.style?.borderColor || '#ccc'} />
        <Controls />
        <Background variant="lines" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default JiraWorkflowFlow;