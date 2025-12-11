// ===== SAMPLE LAWYER DATA =====
const lawyersData = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        title: "Luật Sư Cao Cấp",
        rating: 4.9,
        reviews: 156,
        experience: 15,
        location: "TP. Hồ Chí Minh",
        district: "Quận 1",
        specialties: ["Luật Doanh Nghiệp", "Luật Hình Sự"],
        description: "Chuyên gia pháp lý với hơn 15 năm kinh nghiệm trong lĩnh vực luật doanh nghiệp và hình sự. Đã xử lý thành công hơn 500 vụ án phức tạp.",
        price: 5000000,
        avatar: "👨‍⚖️"
    },
    {
        id: 2,
        name: "Trần Thị Bình",
        title: "Luật Sư Chuyên Nghiệp",
        rating: 4.8,
        reviews: 142,
        experience: 12,
        location: "Hà Nội",
        district: "Ba Đình",
        specialties: ["Luật Dân Sự", "Luật Gia Đình"],
        description: "Luật sư giàu kinh nghiệm trong giải quyết các tranh chấp dân sự và gia đình. Tận tâm, chu đáo với khách hàng.",
        price: 4000000,
        avatar: "👩‍⚖️"
    },
    {
        id: 3,
        name: "Lê Minh Cường",
        title: "Luật Sư Trưởng",
        rating: 5.0,
        reviews: 203,
        experience: 20,
        location: "TP. Hồ Chí Minh",
        district: "Quận 3",
        specialties: ["Luật Bất Động Sản", "Luật Doanh Nghiệp"],
        description: "Chuyên gia hàng đầu về luật bất động sản và M&A. Đã tư vấn cho nhiều dự án lớn trị giá hàng trăm tỷ đồng.",
        price: 8000000,
        avatar: "👨‍💼"
    },
    {
        id: 4,
        name: "Phạm Thu Hà",
        title: "Luật Sư",
        rating: 4.7,
        reviews: 98,
        experience: 8,
        location: "Đà Nẵng",
        district: "Hải Châu",
        specialties: ["Luật Lao Động", "Luật Dân Sự"],
        description: "Chuyên tư vấn về luật lao động và các tranh chấp lao động. Nhiệt tình, tận tâm với từng vụ việc.",
        price: 3000000,
        avatar: "👩‍💼"
    },
    {
        id: 5,
        name: "Hoàng Đức Thắng",
        title: "Luật Sư Cao Cấp",
        rating: 4.9,
        reviews: 187,
        experience: 18,
        location: "TP. Hồ Chí Minh",
        district: "Bình Tân",
        specialties: ["Luật Hình Sự", "Luật Dân Sự"],
        description: "Luật sư kỳ cựu với thành tích xuất sắc trong bào chữa hình sự. Tỷ lệ thắng kiện cao.",
        price: 6000000,
        avatar: "👨‍⚖️"
    },
    {
        id: 6,
        name: "Vũ Thị Mai",
        title: "Luật Sư Chuyên Nghiệp",
        rating: 4.6,
        reviews: 76,
        experience: 7,
        location: "Hà Nội",
        district: "Hoàn Kiếm",
        specialties: ["Luật Gia Đình", "Luật Dân Sự"],
        description: "Chuyên giải quyết các vấn đề gia đình, ly hôn, tranh chấp tài sản. Tiếp cận nhân văn, thấu hiểu.",
        price: 3500000,
        avatar: "👩‍⚖️"
    },
    {
        id: 7,
        name: "Đặng Văn Hùng",
        title: "Luật Sư Trưởng",
        rating: 4.8,
        reviews: 165,
        experience: 16,
        location: "TP. Hồ Chí Minh",
        district: "Tân Bình",
        specialties: ["Luật Doanh Nghiệp", "Luật Bất Động Sản"],
        description: "Chuyên gia tư vấn doanh nghiệp và bất động sản. Đã tư vấn cho hơn 200 doanh nghiệp.",
        price: 7000000,
        avatar: "👨‍💼"
    },
    {
        id: 8,
        name: "Ngô Thị Lan",
        title: "Luật Sư",
        rating: 4.5,
        reviews: 89,
        experience: 6,
        location: "Hải Phòng",
        district: "Lê Chân",
        specialties: ["Luật Lao Động", "Luật Dân Sự"],
        description: "Luật sư trẻ năng động, nhiệt huyết. Chuyên tư vấn về quyền lợi người lao động.",
        price: 2500000,
        avatar: "👩‍💼"
    },
    {
        id: 9,
        name: "Bùi Minh Tuấn",
        title: "Luật Sư Cao Cấp",
        rating: 4.9,
        reviews: 194,
        experience: 14,
        location: "TP. Hồ Chí Minh",
        district: "Thủ Đức",
        specialties: ["Luật Hình Sự", "Luật Doanh Nghiệp"],
        description: "Luật sư có kinh nghiệm sâu rộng trong lĩnh vực hình sự kinh tế và doanh nghiệp.",
        price: 5500000,
        avatar: "👨‍⚖️"
    },
    {
        id: 10,
        name: "Lý Thị Hương",
        title: "Luật Sư Chuyên Nghiệp",
        rating: 4.7,
        reviews: 123,
        experience: 10,
        location: "Cần Thơ",
        district: "Ninh Kiều",
        specialties: ["Luật Dân Sự", "Luật Gia Đình"],
        description: "Chuyên giải quyết tranh chấp dân sự và gia đình tại khu vực miền Tây.",
        price: 3200000,
        avatar: "👩‍⚖️"
    }
];

// Generate more lawyers to reach 156 total
for (let i = 11; i <= 156; i++) {
    const names = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Ngô", "Bùi", "Lý"];
    const firstNames = ["Văn", "Thị", "Minh", "Thu", "Đức", "Hồng", "Quang", "Thanh"];
    const lastNames = ["An", "Bình", "Cường", "Dũng", "Hà", "Hùng", "Lan", "Mai", "Nam", "Phương"];
    
    const name = `${names[i % names.length]} ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
    const titles = ["Luật Sư", "Luật Sư Chuyên Nghiệp", "Luật Sư Cao Cấp", "Luật Sư Trưởng"];
    const locations = ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
    const districts = ["Quận 1", "Quận 3", "Ba Đình", "Hoàn Kiếm", "Hải Châu"];
    const specialtiesOptions = [
        ["Luật Doanh Nghiệp", "Luật Hình Sự"],
        ["Luật Dân Sự", "Luật Gia Đình"],
        ["Luật Bất Động Sản", "Luật Doanh Nghiệp"],
        ["Luật Lao Động", "Luật Dân Sự"],
        ["Luật Hình Sự", "Luật Dân Sự"]
    ];
    const avatars = ["👨‍⚖️", "👩‍⚖️", "👨‍💼", "👩‍💼"];
    
    lawyersData.push({
        id: i,
        name: name,
        title: titles[i % titles.length],
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        reviews: Math.floor(50 + Math.random() * 150),
        experience: Math.floor(5 + Math.random() * 15),
        location: locations[i % locations.length],
        district: districts[i % districts.length],
        specialties: specialtiesOptions[i % specialtiesOptions.length],
        description: "Luật sư có kinh nghiệm trong lĩnh vực pháp lý, tận tâm với khách hàng và cam kết mang lại kết quả tốt nhất.",
        price: Math.floor(2000000 + Math.random() * 6000000),
        avatar: avatars[i % avatars.length]
    });
}

// ===== STATE MANAGEMENT =====
let currentPage = 1;
const itemsPerPage = 18;
let currentView = 'list';
let filteredLawyers = [...lawyersData];

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    renderLawyers();
    renderPagination();
});

// ===== FILTER FUNCTIONS =====
function updateFilters() {
    const region = document.getElementById('regionFilter').value;
    const country = document.getElementById('countryFilter').value;
    const state = document.getElementById('stateFilter').value;
    const city = document.getElementById('cityFilter').value;
    
    const specialties = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    filteredLawyers = lawyersData.filter(lawyer => {
        let matches = true;
        
        if (state && lawyer.location !== getLocationName(state)) {
            matches = false;
        }
        
        if (city && lawyer.district !== getDistrictName(city)) {
            matches = false;
        }
        
        if (specialties.length > 0) {
            const hasSpecialty = specialties.some(spec => 
                lawyer.specialties.some(ls => ls.toLowerCase().includes(spec))
            );
            if (!hasSpecialty) matches = false;
        }
        
        return matches;
    });
    
    currentPage = 1;
    document.getElementById('totalResults').textContent = filteredLawyers.length;
    renderLawyers();
    renderPagination();
}

function getLocationName(value) {
    const map = {
        'hanoi': 'Hà Nội',
        'hcm': 'TP. Hồ Chí Minh',
        'danang': 'Đà Nẵng',
        'haiphong': 'Hải Phòng',
        'cantho': 'Cần Thơ'
    };
    return map[value] || '';
}

function getDistrictName(value) {
    const map = {
        'district1': 'Quận 1',
        'district3': 'Quận 3',
        'binhtan': 'Bình Tân',
        'tanbinh': 'Tân Bình',
        'thuducity': 'Thủ Đức'
    };
    return map[value] || '';
}

function resetFilters() {
    document.getElementById('regionFilter').value = '';
    document.getElementById('countryFilter').value = 'vietnam';
    document.getElementById('stateFilter').value = '';
    document.getElementById('cityFilter').value = '';
    
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    filteredLawyers = [...lawyersData];
    currentPage = 1;
    document.getElementById('totalResults').textContent = filteredLawyers.length;
    renderLawyers();
    renderPagination();
}

// ===== SORT FUNCTIONS =====
function sortResults() {
    const sortValue = document.getElementById('sortSelect').value;
    
    switch(sortValue) {
        case 'rating':
            filteredLawyers.sort((a, b) => b.rating - a.rating);
            break;
        case 'experience':
            filteredLawyers.sort((a, b) => b.experience - a.experience);
            break;
        case 'price-low':
            filteredLawyers.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredLawyers.sort((a, b) => b.price - a.price);
            break;
        default:
            // relevant - keep original order
            break;
    }
    
    currentPage = 1;
    renderLawyers();
    renderPagination();
}

// ===== VIEW FUNCTIONS =====
function changeView(view) {
    currentView = view;
    
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    const container = document.getElementById('resultsContainer');
    container.className = `results-container ${view}-view`;
    
    renderLawyers();
}

// ===== RENDER FUNCTIONS =====
function renderLawyers() {
    const container = document.getElementById('resultsContainer');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const lawyersToShow = filteredLawyers.slice(start, end);
    
    if (lawyersToShow.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>Không Tìm Thấy Kết Quả</h3>
                <p>Vui lòng thử điều chỉnh bộ lọc của bạn</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = lawyersToShow.map(lawyer => `
        <div class="lawyer-card">
            <div class="lawyer-avatar">
                <div class="avatar-placeholder">${lawyer.avatar}</div>
            </div>
            <div class="lawyer-info">
                <div class="lawyer-header">
                    <div>
                        <h3 class="lawyer-name">${lawyer.name}</h3>
                        <p class="lawyer-title">${lawyer.title}</p>
                    </div>
                    <div class="lawyer-rating">
                        <span class="rating-stars">★</span>
                        <span class="rating-number">${lawyer.rating}</span>
                        <span style="color: rgba(255,255,255,0.6);">(${lawyer.reviews})</span>
                    </div>
                </div>
                <div class="lawyer-specialties">
                    ${lawyer.specialties.map(spec => `<span class="specialty-tag">${spec}</span>`).join('')}
                </div>
                <p class="lawyer-description">${lawyer.description}</p>
                <div class="lawyer-actions">
                    <button class="btn-contact" onclick="contactLawyer(${lawyer.id})">Liên Hệ</button>
                    <button class="btn-profile" onclick="viewProfile(${lawyer.id})">Xem Hồ Sơ</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Scroll to top of results
    window.scrollTo({ top: 300, behavior: 'smooth' });
}

function renderPagination() {
    const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage);
    const paginationList = document.getElementById('paginationList');
    
    let html = '';
    
    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">‹</a>
        </li>
    `;
    
    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        html += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1); return false;">1</a></li>`;
        if (startPage > 2) {
            html += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`;
        }
        html += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a></li>`;
    }
    
    // Next button
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">›</a>
        </li>
    `;
    
    paginationList.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderLawyers();
    renderPagination();
}

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function contactLawyer(id) {
    const lawyer = lawyersData.find(l => l.id === id);
    alert(`Đang kết nối với ${lawyer.name}...\n\nTính năng này sẽ được phát triển trong phiên bản tiếp theo.`);
}

function viewProfile(id) {
    const lawyer = lawyersData.find(l => l.id === id);
    alert(`Xem hồ sơ của ${lawyer.name}...\n\nTính năng này sẽ được phát triển trong phiên bản tiếp theo.`);
}

console.log('%c Search Lawyers - Legal AI ', 'background: #d4af37; color: #000; font-size: 16px; font-weight: bold; padding: 8px;');
console.log(`Total lawyers: ${lawyersData.length}`);
