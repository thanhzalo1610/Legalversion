// ===== STATE MANAGEMENT =====
let isRecording = false;
let recognition = null;
let recordingStartTime = null;
let recordingInterval = null;
let selectedFile = null;

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initializeSpeechRecognition();
    scrollToBottom();
});

// ===== SPEECH RECOGNITION =====
function initializeSpeechRecognition() {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-EN';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            const messageInput = document.getElementById('messageInput');
            if (finalTranscript) {
                messageInput.value += finalTranscript;
                autoResize(messageInput);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                showNotification('Voice not detected. Please try again..', 'warning');
            } else if (event.error === 'not-allowed') {
                showNotification('Please allow microphone access.', 'error');
            }
            stopRecording();
        };

        recognition.onend = () => {
            if (isRecording) {
                recognition.start();
            }
        };
    } else {
        console.warn('Speech Recognition not supported in this browser');
    }
}

// ===== VOICE RECORDING =====
function toggleVoiceRecording() {
    if (!recognition) {
        showNotification('The browser does not support voice recognition..', 'error');
        return;
    }

    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    isRecording = true;
    recordingStartTime = Date.now();

    // Update UI
    document.getElementById('voiceRecording').style.display = 'flex';
    document.getElementById('voiceBtn').classList.add('recording');

    // Start recording timer
    updateRecordingTime();
    recordingInterval = setInterval(updateRecordingTime, 1000);

    // Start speech recognition
    try {
        recognition.start();
        showNotification('Recording is underway... Please say your question.', 'info');
    } catch (error) {
        console.error('Error starting recognition:', error);
        stopRecording();
    }
}

function stopRecording() {
    isRecording = false;

    // Update UI
    document.getElementById('voiceRecording').style.display = 'none';
    document.getElementById('voiceBtn').classList.remove('recording');

    // Stop recording timer
    if (recordingInterval) {
        clearInterval(recordingInterval);
        recordingInterval = null;
    }

    // Stop speech recognition
    if (recognition) {
        recognition.stop();
    }

    showNotification('Recording stopped.', 'success');
}

function updateRecordingTime() {
    if (!recordingStartTime) return;

    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('recordingTime').textContent = timeString;
}

// ===== FILE HANDLING =====
function handleFileSelect(event) {
    const file = event.target.files[0];
    const ext = file.name.split('.').pop().toLowerCase();
    //if (ext === 'txt') {
    //    const reader = new FileReader();
    //    reader.onload = function (evt) {
    //        $('#messageInput').text(textContent);
    //        //$('#text').val(evt.target.result);
    //    };
    //    reader.readAsText(file);
    //}
    //else {
    //    if (ext === 'docx') {
    //        const reader = new FileReader();
    //        reader.onload = function (evt) {
    //            mammoth.extractRawText({
    //                arrayBuffer: evt.target.result
    //            })
    //                .then(function (result) {
    //                    $('#messageInput').text(textContent);
    //                    //$('#text').val(result.value);
    //                });
    //        };
    //        reader.readAsArrayBuffer(file);
    //    }
    //    else {
    //        const reader = new FileReader();
    //        reader.onload = function (evt) {
    //            const pdfData = new Uint8Array(evt.target.result);
    //            pdfjsLib.getDocument(pdfData).promise.then(function (pdf) {
    //                let textContent = '';
    //                let pages = [];
    //                for (let i = 1; i <= pdf.numPages; i++) {
    //                    pages.push(pdf.getPage(i).then(page => page.getTextContent()
    //                        .then(tc => tc.items.map(item => item.str).join(' '))
    //                        .then(text => {
    //                            textContent += text + "\n";
    //                        })));
    //                }
    //                Promise.all(pages).then(() => {
    //                    $('#messageInput').text(textContent);
    //                    //$('#text').val(textContent);
    //                });
    //            });
    //        };
    //        reader.readAsArrayBuffer(file);
    //    }
    //}
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File is too large. Please select a file smaller than 5MB.', 'error');
        return;
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
        showNotification('File format not supported. Please select PDF, DOC, DOCX or TXT file.', 'error');
        return;
    }

    selectedFile = file;

    // Show file preview
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('filePreview').style.display = 'block';

    showNotification('File has been attached. Click send to upload.', 'success');
}

function removeFile() {
    selectedFile = null;
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('fileInput').value = '';
    showNotification('Attached file deleted.', 'info');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ===== MESSAGE HANDLING =====
function sendMessage(btn) {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    const log = $(btn).attr("data-log");
    const c = $(btn).attr("data-c");

    if (!message && !selectedFile) {
        showNotification('Please enter a message or attach a file.', 'warning');
        return;
    }


    // Add user message
    if (message) {
        addMessage(message, 'user');
        messageInput.value = '';
        autoResize(messageInput);
    }

    // Add file message if exists
    if (selectedFile) {
        addFileMessage(selectedFile);
    }

    // Show typing indicator
    showTypingIndicator();
    var formsata = new FormData();
    var data = ["content", "code_chat", "session_code"];
    $.each(data, function (v, d) {
        if (d == "content") formsata.append(d, message);
        if (d == "code_chat") formsata.append(d, c);
        if (d == "session_code") formsata.append(d, log);
    });
    if (selectedFile != null) {
        formsata.append("type_page", "chat");
        formsata.append("UploadedFiles", selectedFile); 
    }
    generateAIResponse(formsata, btn);
    removeFile();
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatar = sender === 'user' ? '<img src="/templates/statics/images/icon/iconuserchat.png" />' : '<img src="/templates/statics/images/icon/iconchatbot.png" />';
    const time = getCurrentTime();

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-bubble">
                <p>${text}</p>
            </div>
            <div class="message-time">${time}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addFileMessage(file) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';

    const time = getCurrentTime();

    messageDiv.innerHTML = `
        <div class="message-avatar"><img src="/templates/statics/images/icon/iconuserchat.png" /></div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="file-message">
                    <div class="file-message-icon">📄</div>
                    <div class="file-message-info">
                        <div class="file-message-name">${file.name}</div>
                        <div class="file-message-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
            </div>
            <div class="message-time">${time}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function generateAIResponse(payload, btn) {



    fetch("/legal/ai-chat", {
        method: "POST",
        body: payload
    })
        .then(r => {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.text();
        })
        .then(data => {
            hideTypingIndicator();
            var json = JSON.parse(data);
            if ($(btn).attr("data-log") == "") {
                $(".quick-actions button.quick-action-btn").map(function () {
                    $(this).attr("data-log", json.session_code);
                });
                $(".input-wrapper button").map(function () {
                    $(this).attr("data-log", json.session_code);
                });
            }
            addMessage(json.answer, "ai");
        })
        .catch(err => console.error(err));
    //$.ajax({
    //    url: "/legal/ai-chat",
    //    type: "POST",
    //    data: { text: userMessage },
    //    success: function (data) {
    //        hideTypingIndicator();
    //        addMessage(data, 'ai');
    //    },
    //    error: function (error) {
    //        console.log(error.responseText);
    //    }
    //});
}

function quickQuestion(question, btn) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = question;
    autoResize(messageInput);
    sendMessage(btn);
}

// ===== TYPING INDICATOR =====
function showTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'flex';
    scrollToBottom();
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

// ===== CHAT ACTIONS =====
function clearChat() {
    if (confirm('Are you sure you want to delete all chat history?')) {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = `
            <div class="message ai-message">
                <div class="message-avatar"><img src="/templates/statics/images/icon/iconchatbot.png" /></div>
                <div class="message-content">
                    <div class="message-bubble">
                        <p>Chat history has been cleared. I am here to help you.!</p>
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
            </div>
        `;
        showNotification('Chat history deleted.', 'success');
    }
}

function downloadChat() {
    const messages = document.querySelectorAll('.message');
    let chatText = 'History CHAT - LEGAL AI ASSISTANT\n';
    chatText += '='.repeat(50) + '\n\n';

    messages.forEach(message => {
        const sender = message.classList.contains('user-message') ? 'You' : 'Legal AI';
        const content = message.querySelector('.message-bubble').textContent.trim();
        const time = message.querySelector('.message-time').textContent;

        chatText += `[${time}] ${sender}:\n${content}\n\n`;
    });

    // Create download link
    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-ai-chat-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Chat history downloaded.', 'success');
}

// ===== UTILITY FUNCTIONS =====
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotif = document.querySelector('.chat-notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `chat-notification ${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const colors = {
        success: '#00ff00',
        error: '#ff4444',
        warning: '#ffaa00',
        info: '#4a90e2'
    };

    notification.innerHTML = `
        <span class="notif-icon" style="color: ${colors[type]}">${icons[type]}</span>
        <span class="notif-message">${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(40, 40, 40, 0.98) 100%);
        backdrop-filter: blur(15px);
        border: 2px solid ${colors[type]};
        border-radius: 10px;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideInRight 0.4s ease;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Add notification styles
const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notif-icon {
        font-size: 1.3rem;
        font-weight: bold;
    }
    
    .notif-message {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
        font-size: 0.95rem;
    }
`;
document.head.appendChild(notifStyle);
