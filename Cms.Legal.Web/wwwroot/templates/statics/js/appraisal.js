// ===== STATE MANAGEMENT =====
let currentTab = 'upload';
let uploadedFile = null;
let extractedText = '';
let isVoiceRecording = false;
let voiceRecognition = null;

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceRecognition();
    setupDragAndDrop();
});

// ===== TAB SWITCHING =====
function switchTab(tabName) {
    currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// ===== DRAG AND DROP =====
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.style.borderColor = 'var(--gold)';
            uploadArea.style.transform = 'scale(1.02)';
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.style.borderColor = 'rgba(212, 175, 55, 0.5)';
            uploadArea.style.transform = 'scale(1)';
        });
    });

    uploadArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload({ target: { files: files } });
        }
    });
}

// ===== FILE UPLOAD =====
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.', 'error');
        return;
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
        showNotification('Unsupported file format.', 'error');
        return;
    }

    uploadedFile = file;

    // Hide upload area, show file info
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'block';
    document.getElementById('uploadedFileName').textContent = file.name;
    document.getElementById('uploadedFileSize').textContent = formatFileSize(file.size);

    // Extract text from file
    extractTextFromFile(event);

    showNotification('File uploaded successfully!', 'success');
}

function extractTextFromFile(event) {
    // Simulate text extraction
    const sampleTexts = "";
    const file = event.target.files[0];
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'txt') {
        const reader = new FileReader();
        reader.onload = function (evt) {
            $('#textContent').text(textContent);
            extractedText = textContent;
            //$('#text').val(evt.target.result);
        };
        reader.readAsText(file);
    }
    else {
        if (ext === 'docx') {
            const reader = new FileReader();
            reader.onload = function (evt) {
                mammoth.extractRawText({
                    arrayBuffer: evt.target.result
                })
                    .then(function (result) {
                        $('#textContent').text(textContent);
                        extractedText = textContent;
                        //$('#text').val(result.value);
                    });
            };
            reader.readAsArrayBuffer(file);
        }
        else {
            const reader = new FileReader();
            reader.onload = function (evt) {
                const pdfData = new Uint8Array(evt.target.result);
                pdfjsLib.getDocument(pdfData).promise.then(function (pdf) {
                    let textContent = '';
                    let pages = [];
                    for (let i = 1; i <= pdf.numPages; i++) {
                        pages.push(pdf.getPage(i).then(page => page.getTextContent()
                            .then(tc => tc.items.map(item => item.str).join(' '))
                            .then(text => {
                                textContent += text + "\n";
                            })));
                    }
                    Promise.all(pages).then(() => {
                        $('#textContent').text(textContent);
                        extractedText = textContent;
                        //$('#text').val(textContent);
                    });
                });
            };
            reader.readAsArrayBuffer(file);
        }
    }


    extractedText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

    // Show extracted text
    document.getElementById('extractedText').style.display = 'block';
    document.getElementById('textContent').textContent = extractedText;

    // Enable analyze button
    document.getElementById('analyzeUploadBtn').disabled = false;
}

function removeUploadedFile() {
    uploadedFile = null;
    extractedText = '';

    // Reset UI
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('extractedText').style.display = 'none';
    document.getElementById('uploadAnalysisResult').style.display = 'none';
    document.getElementById('analyzeUploadBtn').disabled = true;
    document.getElementById('fileUpload').value = '';

    showNotification('File deleted.', 'info');
}

// ===== VOICE RECOGNITION =====
function initializeVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        voiceRecognition = new SpeechRecognition();
        voiceRecognition.lang = 'en-EN';
        voiceRecognition.continuous = true;
        voiceRecognition.interimResults = true;

        voiceRecognition.onresult = (event) => {
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                }
            }

            if (finalTranscript) {
                const textInput = document.getElementById('textInput');
                textInput.value += finalTranscript;
            }
        };

        voiceRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopVoiceInput();
            if (event.error === 'not-allowed') {
                showNotification('Please allow microphone access.', 'error');
            }
        };

        voiceRecognition.onend = () => {
            if (isVoiceRecording) {
                voiceRecognition.start();
            }
        };
    }
}

function toggleVoiceInput() {
    if (!voiceRecognition) {
        showNotification('The browser does not support voice recognition.', 'error');
        return;
    }

    if (isVoiceRecording) {
        stopVoiceInput();
    } else {
        startVoiceInput();
    }
}

function startVoiceInput() {
    isVoiceRecording = true;

    document.getElementById('voiceInputBtn').classList.add('recording');
    document.getElementById('voiceIndicator').style.display = 'block';

    try {
        voiceRecognition.start();
        showNotification('Recording... Please state the content to be reviewed.', 'info');
    } catch (error) {
        console.error('Error starting recognition:', error);
        stopVoiceInput();
    }
}

function stopVoiceInput() {
    isVoiceRecording = false;

    document.getElementById('voiceInputBtn').classList.remove('recording');
    document.getElementById('voiceIndicator').style.display = 'none';

    if (voiceRecognition) {
        voiceRecognition.stop();
    }

    showNotification('Stop Record.', 'success');
}

// ===== ANALYSIS =====
function analyzeUploadedFile() {
    if (!extractedText) {
        showNotification('No content to analyze.', 'warning');
        return;
    }

    performAnalysis(extractedText, 'uploadAnalysisResult');
}

function analyzeText() {
    const text = document.getElementById('textInput').value.trim();

    if (!text) {
        showNotification('Please enter the content to be evaluated.', 'warning');
        return;
    }

    performAnalysis(text, 'textAnalysisResult');
}

function performAnalysis(text, resultElementId) {
    const resultElement = document.getElementById(resultElementId);
    const analyzeBtn = resultElementId === 'uploadAnalysisResult' ?
        document.getElementById('analyzeUploadBtn') :
        document.getElementById('analyzeTextBtn');

    // Show loading
    resultElement.style.display = 'block';
    resultElement.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <div class="loading-text">AI is analyzing documents...</div>
        </div>
    `;

    analyzeBtn.classList.add('analyzing');
    analyzeBtn.disabled = true;

    // Simulate AI analysis
    displayAnalysisResult(resultElement, text);
}


function displayAnalysisResult(element, text) {
    $.ajax({
        url: "/case/ai-analysis",
        type: "POST",
        data: {
            json: text,
            type: "file"
        },
        success: function (data) {
            if (data != 400) {
                const riskBadgeClass = `risk-${analysis.riskLevel}`;
                const riskText = {
                    low: 'Rủi ro thấp',
                    medium: 'Rủi ro trung bình',
                    high: 'Rủi ro cao'
                };

                element.innerHTML = `
        <div class="result-header">
            
        No data
        </div>
    `;
            } else {
                element.innerHTML = `
        <div class="result-header">
            
        No data
        </div>
    `;
            }

        }, error: function (error) {
        }
    })

}

// ===== UTILITY FUNCTIONS =====
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showNotification(message, type) {
    const existingNotif = document.querySelector('.appraisal-notification');
    if (existingNotif) existingNotif.remove();

    const notification = document.createElement('div');
    notification.className = `appraisal-notification ${type}`;

    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const colors = { success: '#00ff00', error: '#ff4444', warning: '#ffaa00', info: '#4a90e2' };

    notification.innerHTML = `
        <span style="color: ${colors[type]}; font-size: 1.3rem; font-weight: bold;">${icons[type]}</span>
        <span style="color: rgba(255, 255, 255, 0.9); font-weight: 600;">${message}</span>
    `;

    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(40, 40, 40, 0.98) 100%);
        backdrop-filter: blur(15px); border: 2px solid ${colors[type]}; border-radius: 10px;
        padding: 15px 20px; display: flex; align-items: center; gap: 12px;
        animation: slideIn 0.4s ease; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        max-width: 400px;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(notifStyle);
