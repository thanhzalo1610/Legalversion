// Mock Trial Simulator JavaScript

// Sample data for participants
const availableParticipants = {
    judges: [
        { id: 1, name: 'Hon. Sarah Mitchell', credentials: 'Federal District Judge' },
        { id: 2, name: 'Hon. Robert Chen', credentials: 'Circuit Court Judge' },
        { id: 3, name: 'Hon. Maria Rodriguez', credentials: 'Supreme Court Justice' }
    ],
    attorneys: [
        { id: 4, name: 'John Anderson', credentials: 'Senior Partner, Anderson & Associates' },
        { id: 5, name: 'Emily Thompson', credentials: 'Criminal Defense Attorney' },
        { id: 6, name: 'Michael Davis', credentials: 'Prosecutor, District Attorney Office' },
        { id: 7, name: 'Lisa Wang', credentials: 'Civil Rights Attorney' }
    ],
    witnesses: [
        { id: 8, name: 'Dr. James Wilson', credentials: 'Expert Witness - Forensics' },
        { id: 9, name: 'Officer Sarah Brown', credentials: 'Police Officer' },
        { id: 10, name: 'Prof. David Lee', credentials: 'Expert Witness - Economics' }
    ],
    jurors: [
        { id: 11, name: 'Alice Johnson', credentials: 'Juror #1' },
        { id: 12, name: 'Bob Smith', credentials: 'Juror #2' },
        { id: 13, name: 'Carol White', credentials: 'Juror #3' },
        { id: 14, name: 'Daniel Brown', credentials: 'Juror #4' },
        { id: 15, name: 'Emma Davis', credentials: 'Juror #5' },
        { id: 16, name: 'Frank Miller', credentials: 'Juror #6' }
    ]
};

// Trial data storage
let trials = null;
let currentTrialId = null;

//Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadTrials();
     //updateStatistics();

    // Form submission
    //document.getElementById('createTrialForm').addEventListener('submit', createTrial);
});

//Show create trial modal
function showCreateTrialModal() {
    const modal = new bootstrap.Modal(document.getElementById('createTrialModal'));
    modal.show();
}

// Create new trial
function createTrial(data) {
    const trial = {
        id: data.code,
        caseName: data.title,
        caseType: data.categoryName,
        description: data.description,
        status: 'active',
        createdAt: new Date().toISOString(),
        participants: {
            judge: null,
            plaintiff: null,
            defendant: null,
            plaintiffAttorney: null,
            defendantAttorney: null,
            witnesses: [],
            jurors: []
        },
        evidence: [],
        proceedings: [],
        verdict: null
    };

    trials.push(trial);
    ////saveTrials();;
    loadTrials();
     //updateStatistics();

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('createTrialModal')).hide();
    document.getElementById('createTrialForm').reset();

    // Open the new trial
    openTrial(trial.id);
}

//Load trials list
function loadTrials() {
    const trialList = document.getElementById('trialList');
    fetch("/case/list-mocktrial", {
        method: "GET",
    }).then(response => response.json()).then(data => {
        trials = data;
         //updateStatistics();

        if (trials == null) {
            trialList.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px;">No trials yet</p>';
            return;
        }

        trialList.innerHTML = trials.map(trial => `
        <div class="trial-item ${currentTrialId === trial.code ? 'active' : ''}" onclick="openTrial(${trial.code})">
            <div class="trial-item-name">${trial.title}</div>
            <div class="trial-item-type">${formatCaseType(trial.caseName)}</div>
            <span class="trial-item-status status-active">Is Active</span>
        </div>
    `).join('');
    }).catch(error => console.error("Error fetching trials:", error));


}

// Open trial
function openTrial(trialId) {
    currentTrialId = trialId;
    fetch("/case/get-mocktrial", {
        method: "POST",
        headers: {
            "Content-Type": "application/text"
        },
        body: JSON.stringify({ code: trialId })
    }).then(response => response.json()).then(data => {
        if (data != null) {
            trial = data; // Assuming only one trial is returned
            const workspace = document.getElementById('trialWorkspace');
            workspace.innerHTML = generateTrialContent(trial);

            initializeTabs();

            // Initialize voice recognition if available
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                initializeVoiceRecognition();
            }
        }
    }).catch(error => console.error("Error fetching trial:", error));
    if (!trial) return;
    //loadTrials(); // Update active state
    // Initialize tabs
}
// Generate trial content
function generateTrialContent(trial) {
    return `
        <div class="trial-content active">
            <!-- Trial Header -->
            <div class="trial-info-header">
                <div class="trial-info-left">
                    <h2>${trial.caseName}</h2>
                    <p>${formatCaseType(trial.caseType)} • Created: ${formatDate(trial.createdAt)}</p>
                </div>
                <div class="trial-actions">
                    <button class="btn-trial-action btn-edit" onclick="editTrial(${trial.id})">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                        Edit
                    </button>
                    <button class="btn-trial-action btn-lock" onclick="toggleLock(${trial.id})">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                        ${trial.status === 'locked' ? 'Unlock' : 'Lock'}
                    </button>
                    <button class="btn-trial-action btn-delete" onclick="deleteTrial(${trial.id})">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>

            <!-- Trial Tabs -->
            <div class="trial-tabs">
                <button class="trial-tab active" data-tab="participants">Participants</button>
                <button class="trial-tab" data-tab="evidence">Evidence</button>
                <button class="trial-tab" data-tab="proceedings">Trial Proceedings</button>
                <button class="trial-tab" data-tab="verdict">Verdict & Results</button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content-area">
                ${generateParticipantsTab(trial)}
                ${generateEvidenceTab(trial)}
                ${generateProceedingsTab(trial)}
                ${generateVerdictTab(trial)}
            </div>
        </div>
    `;
}

// Generate Participants Tab
function generateParticipantsTab(trial) {
    return `
        <div class="tab-pane active" id="participants">
            <div class="participants-section">
                <h3 class="section-title">Court Officials</h3>
                <div class="participants-grid">
                    ${generateParticipantCard('Judge', trial.participants.judge, 'judge')}
                </div>
            </div>

            <div class="participants-section">
                <h3 class="section-title">Parties</h3>
                <div class="participants-grid">
                    ${generateParticipantCard('Plaintiff', trial.participants.plaintiff, 'plaintiff')}
                    ${generateParticipantCard('Plaintiff Attorney', trial.participants.plaintiffAttorney, 'plaintiffAttorney')}
                    ${generateParticipantCard('Defendant', trial.participants.defendant, 'defendant')}
                    ${generateParticipantCard('Defendant Attorney', trial.participants.defendantAttorney, 'defendantAttorney')}
                </div>
            </div>

            <div class="participants-section">
                <h3 class="section-title">Witnesses</h3>
                <div class="participants-grid" id="witnessesGrid">
                    ${trial.participants.witnesses.map((w, i) => generateParticipantCard('Witness', w, 'witness', i)).join('')}
                </div>
                <button class="btn-add-participant" onclick="addParticipant('witness')">+ Add Witness</button>
            </div>

            <div class="participants-section">
                <h3 class="section-title">Jury</h3>
                <div class="participants-grid" id="jurorsGrid">
                    ${trial.participants.jurors.map((j, i) => generateParticipantCard('Juror', j, 'juror', i)).join('')}
                </div>
                <button class="btn-add-participant" onclick="addParticipant('juror')">+ Add Juror</button>
            </div>
        </div>
    `;
}

// Generate participant card
function generateParticipantCard(role, participant, type, index = null) {
    if (!participant) {
        return `
            <div class="participant-card" onclick="selectParticipant('${type}', ${index})">
                <div class="participant-role">${role}</div>
                <div class="participant-name" style="color: rgba(255,255,255,0.5);">Click to assign</div>
            </div>
        `;
    }

    return `
        <div class="participant-card">
            <div class="participant-role">${role}</div>
            <div class="participant-name">${participant.name}</div>
            <div class="participant-info">${participant.credentials}</div>
            <div class="participant-actions">
                <button class="btn-participant-action" onclick="editParticipant('${type}', ${index})" title="Edit">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z"/>
                    </svg>
                </button>
                <button class="btn-participant-action" onclick="removeParticipant('${type}', ${index})" title="Remove">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// Generate Evidence Tab
function generateEvidenceTab(trial) {
    return `
        <div class="tab-pane" id="evidence">
            <div class="evidence-upload" onclick="document.getElementById('fileUpload').click()">
                <input type="file" id="fileUpload" style="display: none" multiple onchange="uploadEvidence(event)">
                <svg width="60" height="60" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
                <p><strong>Upload Evidence Files</strong></p>
                <p style="font-size: 14px;">Click to browse or drag and drop files here</p>
            </div>

            <div class="mb-4">
                <h4 class="section-title">Or Enter Text Evidence</h4>
                <textarea class="form-control" id="textEvidence" rows="6" placeholder="Enter evidence description or testimony..."></textarea>
                <button class="btn-add-participant mt-3" onclick="addTextEvidence()">Add Text Evidence</button>
            </div>

            <div class="mb-4">
                <h4 class="section-title">Or Record Voice Evidence</h4>
                <button class="btn-add-participant" id="voiceRecordBtn" onclick="startVoiceRecording()">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                        <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
                    </svg>
                    Start Recording
                </button>
                <div id="voiceStatus" style="color: #d4af37; margin-top: 10px;"></div>
            </div>

            <h4 class="section-title">Evidence List</h4>
            <div class="evidence-list" id="evidenceList">
                ${trial.evidence.length === 0 ? '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px;">No evidence uploaded yet</p>' :
            trial.evidence.map((e, i) => generateEvidenceItem(e, i)).join('')}
            </div>
        </div>
    `;
}

// Continue in next part due to length...

// Generate evidence item
function generateEvidenceItem(evidence, index) {
    return `
        <div class="evidence-item">
            <div class="evidence-info">
                <div class="evidence-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                    </svg>
                </div>
                <div class="evidence-details">
                    <h4>${evidence.name}</h4>
                    <p>${evidence.type} • ${evidence.size || 'N/A'} • ${formatDate(evidence.uploadedAt)}</p>
                </div>
            </div>
            <button class="btn-participant-action" onclick="deleteEvidence(${index})">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
            </button>
        </div>
    `;
}

// Generate Proceedings Tab
function generateProceedingsTab(trial) {
    const phases = [
        { name: 'Jury Selection', description: 'Voir dire process to select impartial jurors' },
        { name: 'Opening Statements', description: 'Both sides present their case overview' },
        { name: 'Plaintiff Case', description: 'Plaintiff presents evidence and witnesses' },
        { name: 'Defendant Case', description: 'Defendant presents evidence and witnesses' },
        { name: 'Closing Arguments', description: 'Final arguments from both sides' },
        { name: 'Jury Instructions', description: 'Judge instructs jury on the law' },
        { name: 'Jury Deliberation', description: 'Jury discusses and reaches verdict' },
        { name: 'Verdict Reading', description: 'Jury announces their decision' }
    ];

    return `
        <div class="tab-pane" id="proceedings">
            <h3 class="section-title">U.S. Trial Procedure Phases</h3>
            <div class="proceedings-timeline">
                ${phases.map((phase, i) => `
                    <div class="proceeding-phase ${trial.proceedings[i] ? 'completed' : ''}">
                        <div class="phase-number">${i + 1}</div>
                        <div class="phase-content">
                            <h4>${phase.name}</h4>
                            <p>${phase.description}</p>
                            ${trial.proceedings[i] ? `
                                <div class="phase-notes">
                                    <strong>Notes:</strong> ${trial.proceedings[i].notes}
                                </div>
                            ` : `
                                <button class="btn-add-participant" onclick="addProceeding(${i}, '${phase.name}')">Record This Phase</button>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Generate Verdict Tab
function generateVerdictTab(trial) {
    if (!trial.verdict) {
        return `
            <div class="tab-pane" id="verdict">
                <div class="verdict-pending">
                    <svg width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    <h3>No Verdict Yet</h3>
                    <p>Complete all trial proceedings to generate AI verdict</p>
                    <button class="btn-add-participant" onclick="generateVerdict()">Generate AI Verdict</button>
                </div>
            </div>
        `;
    }

    return `
        <div class="tab-pane" id="verdict">
            <div class="verdict-result">
                <h2 class="verdict-title">VERDICT</h2>
                <div class="verdict-decision ${trial.verdict.decision}">
                    ${trial.verdict.decision.toUpperCase()}
                </div>
                
                <div class="verdict-details">
                    <h3>Case Summary</h3>
                    <p><strong>Case:</strong> ${trial.caseName}</p>
                    <p><strong>Type:</strong> ${formatCaseType(trial.caseType)}</p>
                    <p><strong>Date:</strong> ${formatDate(trial.verdict.date)}</p>
                </div>

                <div class="verdict-details">
                    <h3>Jury Decision</h3>
                    <p>${trial.verdict.juryDecision}</p>
                </div>

                <div class="verdict-details">
                    <h3>Reasoning</h3>
                    <p>${trial.verdict.reasoning}</p>
                </div>

                <div class="verdict-details">
                    <h3>Damages/Penalties</h3>
                    <p>${trial.verdict.damages}</p>
                </div>

                <div class="verdict-details">
                    <h3>Judge's Notes</h3>
                    <p>${trial.verdict.judgeNotes}</p>
                </div>

                <button class="btn-add-participant" onclick="exportVerdict()">Export Verdict Report</button>
            </div>
        </div>
    `;
}

// Initialize tabs
function initializeTabs() {
    const tabs = document.querySelectorAll('.trial-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            // Add active to clicked tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Select participant
function selectParticipant(type, index) {
    const trial = trials.find(t => t.id === currentTrialId);
    if (!trial || trial.status === 'locked') return;

    // Show selection modal
    showParticipantSelectionModal(type, index);
}

// Show participant selection modal
function showParticipantSelectionModal(type, index) {
    let options = [];
    let title = '';

    switch (type) {
        case 'judge':
            options = availableParticipants.judges;
            title = 'Select Judge';
            break;
        case 'plaintiffAttorney':
        case 'defendantAttorney':
            options = availableParticipants.attorneys;
            title = 'Select Attorney';
            break;
        case 'witness':
            options = availableParticipants.witnesses;
            title = 'Select Witness';
            break;
        case 'juror':
            options = availableParticipants.jurors;
            title = 'Select Juror';
            break;
        default:
            // For plaintiff/defendant, allow custom input
            const name = prompt('Enter name:');
            if (name) {
                assignParticipant(type, index, { name, credentials: 'Party' });
            }
            return;
    }

    const html = `
        <div class="modal fade" id="participantModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content trial-modal">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="participant-options">
                            ${options.map(p => `
                                <div class="participant-option" onclick="assignParticipant('${type}', ${index}, ${JSON.stringify(p).replace(/"/g, '&quot;')})">
                                    <strong>${p.name}</strong>
                                    <p>${p.credentials}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('participantModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = new bootstrap.Modal(document.getElementById('participantModal'));
    modal.show();
}

// Assign participant
function assignParticipant(type, index, participant) {
    const trial = trials.find(t => t.id === currentTrialId);
    if (!trial) return;

    if (type === 'witness') {
        if (index === null) {
            trial.participants.witnesses.push(participant);
        } else {
            trial.participants.witnesses[index] = participant;
        }
    } else if (type === 'juror') {
        if (index === null) {
            trial.participants.jurors.push(participant);
        } else {
            trial.participants.jurors[index] = participant;
        }
    } else {
        trial.participants[type] = participant;
    }

    //saveTrials();;
    openTrial(currentTrialId);

    // Close modal if exists
    const modal = document.getElementById('participantModal');
    if (modal) {
        bootstrap.Modal.getInstance(modal).hide();
        modal.remove();
    }
}

// Add participant
function addParticipant(type) {
    selectParticipant(type, null);
}

// Remove participant
function removeParticipant(type, index) {
    if (!confirm('Remove this participant?')) return;

    const trial = trials.find(t => t.id === currentTrialId);
    if (!trial || trial.status === 'locked') return;

    if (type === 'witness') {
        trial.participants.witnesses.splice(index, 1);
    } else if (type === 'juror') {
        trial.participants.jurors.splice(index, 1);
    } else {
        trial.participants[type] = null;
    }

    //saveTrials();;
    openTrial(currentTrialId);
}

// Edit participant
function editParticipant(type, index) {
    selectParticipant(type, index);
}

// Upload evidence
function uploadEvidence(event) {
    const trial = trials.find(t => t.id === currentTrialId);
    if (!trial || trial.status === 'locked') return;

    const files = event.target.files;
    for (let file of files) {
        trial.evidence.push({
            name: file.name,
            type: file.type || 'Unknown',
            size: formatFileSize(file.size),
            uploadedAt: new Date().toISOString(),
            content: 'File uploaded'
        });
    }

    //saveTrials();;
    openTrial(currentTrialId);
}

// Add text evidence
function addTextEvidence() {
    const trial = trials.find(t => t.id === currentTrialId);
    if (!trial || trial.status === 'locked') return;

    const text = document.getElementById('textEvidence').value.trim();
    if (!text) {
        alert('Please enter evidence text');
        return;
    }

    trial.evidence.push({
        name: 'Text Evidence',
        type: 'Text Document',
        size: `${text.length} characters`,
        uploadedAt: new Date().toISOString(),
        content: text
    });

    //saveTrials();;
    openTrial(currentTrialId);
}

// Voice recording
let recognition = null;
let isRecording = false;

function initializeVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        document.getElementById('voiceStatus').textContent = 'Recording: ' + transcript;
    };

    recognition.onend = function () {
        if (isRecording) {
            recognition.start();
        }
    };
}

function startVoiceRecording() {
    if (!recognition) {
        alert('Voice recognition not supported in this browser');
        return;
    }

    const trial = trials.find(t => t.id === currentTrialId);
    if (!trial || trial.status === 'locked') return;

    if (!isRecording) {
        recognition.start();
        isRecording = true;
        document.getElementById('voiceRecordBtn').innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
            </svg>
            Stop Recording
        `;
        document.getElementById('voiceStatus').textContent = 'Recording...';
    } else {
        recognition.stop();
        isRecording = false;

        // Save the recording
        const transcript = document.getElementById('voiceStatus').textContent.replace('Recording: ', '');
        if (transcript && transcript !== 'Recording...') {
            trial.evidence.push({
                name: 'Voice Recording',
                type: 'Audio Transcript',
                size: `${transcript.length} characters`,
                uploadedAt: new Date().toISOString(),
                content: transcript
            });
            //saveTrials();;
        }

        document.getElementById('voiceRecordBtn').innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
            </svg>
            Start Recording
        `;
        document.getElementById('voiceStatus').textContent = 'Recording saved!';

        setTimeout(() => {
            openTrial(currentTrialId);
        }, 1000);
    }
}

// Delete evidence
function deleteEvidence(index) {
    if (!confirm('Delete this evidence?')) return;

    const trial = trials.find(t => t.id === currentTrialId);
    if (!trial || trial.status === 'locked') return;

    trial.evidence.splice(index, 1);
    //saveTrials();;
    openTrial(currentTrialId);
}

// Add proceeding
function addProceeding(phaseIndex, phaseName) {
    const trial = trials.find(t => t.id === currentTrialId);
    if (!trial || trial.status === 'locked') return;

    const notes = prompt(`Enter notes for ${phaseName}:`);
    if (!notes) return;

    trial.proceedings[phaseIndex] = {
        phase: phaseName,
        notes: notes,
        completedAt: new Date().toISOString()
    };

    //saveTrials();;
    openTrial(currentTrialId);
}

// Generate verdict
function generateVerdict() {
    const trial = trials.find(t => t.id === currentTrialId);
    if (!trial) return;

    // Check if all phases are completed
    if (trial.proceedings.length < 8) {
        alert('Please complete all trial proceedings before generating verdict');
        return;
    }

    // AI-generated verdict (simulated)
    const decisions = ['GUILTY', 'NOT GUILTY', 'LIABLE', 'NOT LIABLE'];
    const decision = decisions[Math.floor(Math.random() * decisions.length)];

    trial.verdict = {
        decision: decision,
        date: new Date().toISOString(),
        juryDecision: `The jury has reached a unanimous decision after careful deliberation of all evidence and testimony presented during the trial.`,
        reasoning: `Based on the preponderance of evidence presented, including witness testimonies, documentary evidence, and expert opinions, the jury finds that the ${decision === 'GUILTY' || decision === 'LIABLE' ? 'prosecution/plaintiff' : 'defense'} has ${decision === 'GUILTY' || decision === 'LIABLE' ? 'successfully proven' : 'failed to prove'} their case beyond reasonable doubt.`,
        damages: decision === 'LIABLE' ? 'The defendant is ordered to pay $500,000 in compensatory damages and $100,000 in punitive damages.' : decision === 'GUILTY' ? 'Sentencing will be scheduled for a later date.' : 'No damages awarded.',
        judgeNotes: `The court finds that this trial was conducted fairly and in accordance with all applicable laws and procedures. Both parties were given adequate opportunity to present their cases.`
    };

    trial.status = 'completed';
    //saveTrials();;
     //updateStatistics();
    openTrial(currentTrialId);
}

// Export verdict
function exportVerdict() {
    const trial = trials.find(t => t.id === currentTrialId);
    if (!trial || !trial.verdict) return;

    const report = `
OFFICIAL VERDICT REPORT
========================

Case: ${trial.caseName}
Type: ${formatCaseType(trial.caseType)}
Date: ${formatDate(trial.verdict.date)}

VERDICT: ${trial.verdict.decision}

JURY DECISION:
${trial.verdict.juryDecision}

REASONING:
${trial.verdict.reasoning}

DAMAGES/PENALTIES:
${trial.verdict.damages}

JUDGE'S NOTES:
${trial.verdict.judgeNotes}

========================
Generated by Legal AI Mock Trial Simulator
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verdict-${trial.caseName.replace(/\s+/g, '-')}.txt`;
    a.click();
}

// Edit trial
function editTrial(trialId) {
    const trial = trials.find(t => t.id === trialId);
    if (!trial || trial.status === 'locked') return;

    const newName = prompt('Enter new case name:', trial.caseName);
    if (newName) {
        trial.caseName = newName;
        //saveTrials();;
        loadTrials();
        openTrial(trialId);
    }
}

// Toggle lock
function toggleLock(trialId) {
    const trial = trials.find(t => t.id === trialId);
    if (!trial) return;

    trial.status = trial.status === 'locked' ? 'active' : 'locked';
    //saveTrials();;
    loadTrials();
     //updateStatistics();
    openTrial(trialId);
}

// Delete trial
function deleteTrial(trialId) {
    if (!confirm('Are you sure you want to delete this trial? This action cannot be undone.')) return;

    trials = trials.filter(t => t.id !== trialId);
    //saveTrials();;
    loadTrials();
     //updateStatistics();

    document.getElementById('trialWorkspace').innerHTML = `
        <div class="welcome-message">
            <svg width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
            </svg>
            <h2>Welcome to AI Mock Trial Simulator</h2>
            <p>Create a new trial or select an existing one to begin</p>
        </div>
    `;
}

// Update statistics
//function updateStatistics() {
//    document.getElementById('totalTrials').textContent = trials.length;
//    document.getElementById('activeTrials').textContent = trials.filter(t => t.status === 'active').length;
//    document.getElementById('completedTrials').textContent = trials.filter(t => t.status === 'completed').length;
//}

//Save trials to localStorage
//function //saveTrials(); {
//    localStorage.setItem('mockTrials', JSON.stringify(trials));
//}

// Utility functions
function formatCaseType(type) {
    const types = {
        criminal: 'Criminal Case',
        civil: 'Civil Case',
        family: 'Family Law',
        corporate: 'Corporate Law'
    };
    return types[type] || type;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
