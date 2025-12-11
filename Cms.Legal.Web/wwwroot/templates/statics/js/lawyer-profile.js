// Lawyer Profile Page JavaScript

// Tab Switching Function
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }

    // Initialize charts if needed
    if (tabName === 'fields' && !window.practiceChartInitialized) {
        initPracticeChart();
        window.practiceChartInitialized = true;
    }
    if (tabName === 'ethics' && !window.ethicsChartInitialized) {
        initEthicsChart();
        window.ethicsChartInitialized = true;
    }
    if (tabName === 'communication' && !window.communicationChartInitialized) {
        initCommunicationChart();
        window.communicationChartInitialized = true;
    }
    if (tabName === 'salary' && !window.salaryChartInitialized) {
        initSalaryChart();
        window.salaryChartInitialized = true;
    }
}

// Initialize Practice Chart
function initPracticeChart() {
    const ctx = document.getElementById('practiceChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Divorce Law', 'Family Law', 'Same-Sex Marriage', 'Other'],
            datasets: [{
                data: [35, 25, 15, 25],
                backgroundColor: [
                    'rgba(212, 175, 55, 0.9)',
                    'rgba(212, 175, 55, 0.7)',
                    'rgba(212, 175, 55, 0.5)',
                    'rgba(212, 175, 55, 0.3)'
                ],
                borderColor: [
                    '#d4af37',
                    '#d4af37',
                    '#d4af37',
                    '#d4af37'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#fff',
                        font: {
                            size: 14
                        },
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Practice Areas Distribution',
                    color: '#d4af37',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                }
            }
        }
    });
}

// Initialize Ethics Chart
function initEthicsChart() {
    const ctx = document.getElementById('ethicsChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Competence', 'Ethics', 'Professionalism', 'Client Satisfaction', 'Peer Recognition'],
            datasets: [{
                label: 'Rating',
                data: [10, 10, 9.5, 9.8, 10],
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                borderColor: '#d4af37',
                borderWidth: 3,
                pointBackgroundColor: '#d4af37',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#d4af37',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        color: 'rgba(255, 255, 255, 0.7)',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(212, 175, 55, 0.2)'
                    },
                    pointLabels: {
                        color: '#fff',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Ethics & Professional Rating (out of 10)',
                    color: '#d4af37',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                }
            }
        }
    });
}

// Initialize Communication Chart
function initCommunicationChart() {
    const ctx = document.getElementById('communicationChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Responsiveness', 'Clarity', 'Empathy', 'Professionalism', 'Availability'],
            datasets: [{
                label: 'Score',
                data: [9.5, 9.8, 9.7, 10, 9.3],
                backgroundColor: 'rgba(212, 175, 55, 0.7)',
                borderColor: '#d4af37',
                borderWidth: 2,
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        stepSize: 2
                    },
                    grid: {
                        color: 'rgba(212, 175, 55, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Communication Skills Rating (out of 10)',
                    color: '#d4af37',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                }
            }
        }
    });
}

// Initialize Salary Chart
function initSalaryChart() {
    const ctx = document.getElementById('salaryChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1980', '1990', '2000', '2010', '2020', '2024'],
            datasets: [{
                label: 'Hourly Rate ($)',
                data: [100, 200, 300, 400, 500, 600],
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderColor: '#d4af37',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#d4af37',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return '$' + value;
                        }
                    },
                    grid: {
                        color: 'rgba(212, 175, 55, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(212, 175, 55, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Consultation Fee Over the Years',
                    color: '#d4af37',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                }
            }
        }
    });
}

// Contact Lawyer Button
document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.querySelector('.btn-contact-lawyer');
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            alert('Contact functionality will be implemented here.\nPhone: (646) 770-3868\nEmail: contact@mandellawfirm.com');
        });
    }

    // Initialize first tab's chart if it contains one
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && activeTab.id === 'fields') {
        initPracticeChart();
        window.practiceChartInitialized = true;
    }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#login' && href !== '#register') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
