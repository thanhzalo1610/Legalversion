document.querySelectorAll('a[href^="#"]:not(.dropdown-toggle)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Only handle valid section links
        if (href && href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});


// ===== ALERT FUNCTION =====
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        background: ${type === 'success' ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' : 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)'};
        color: #000;
        padding: 20px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.5s ease;
        max-width: 400px;
    `;

    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
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
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .alert-icon {
        font-size: 1.5rem;
        font-weight: bold;
    }
    
    .alert-message {
        flex: 1;
        font-weight: 600;
    }
    
    .alert-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #000;
        font-weight: bold;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .alert-close:hover {
        background: rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);

// ===== CAROUSEL AUTO PLAY =====
const carousel = document.querySelector('#partnersCarousel');
if (carousel) {
    const bsCarousel = new bootstrap.Carousel(carousel, {
        interval: 3000,
        wrap: true
    });
}

//// ===== MEGA MENU HOVER EFFECT (Desktop Only) =====
//if (window.innerWidth >= 992) {
//    const megaDropdown = document.querySelector('.mega-dropdown');
//    if (megaDropdown) {
//        megaDropdown.addEventListener('mouseenter', function () {
//            const dropdownToggle = this.querySelector('.dropdown-toggle');
//            if (dropdownToggle && !this.querySelector('.dropdown-menu').classList.contains('show')) {
//                dropdownToggle.click();
//            }
//        });
//    }
//}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.category-card, .feature-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== MOBILE MENU CLOSE ON CLICK =====
const navbarCollapse = document.querySelector('.navbar-collapse');
const navbarLinks = document.querySelectorAll('.nav-link');

navbarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Don't close menu if it's a dropdown toggle
        if (link.classList.contains('dropdown-toggle')) {
            return;
        }

        // Only close on mobile when clicking actual navigation links
        if (window.innerWidth < 992 && link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            setTimeout(() => {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }, 300);
        }
    });
});

// ===== FORM INPUT EFFECTS =====
const formInputs = document.querySelectorAll('.form-control, .form-select');

formInputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

const devModal = document.getElementById('developmentModal');
if (devModal != null) {
    window.addEventListener('load', function () {
        setTimeout(() => {
            const modalElement = document.getElementById('developmentModal');
            if (modalElement && typeof bootstrap !== 'undefined') {
                const devModal = new bootstrap.Modal(modalElement);
                devModal.show();
            }
        }, 1000);
    });
}
if ($('#lawyerSearchForm') != null) {
    $('#lawyerSearchForm select').change(function (e) {
        e.preventDefault();


        const n = $(this).attr("name");
        if (n.indexOf("law")!=-1) {
            const v = $(this).attr("data-view");
            const i = $(this).find(":selected").attr("selector");
            $.ajax({
                url: "/query-view/location-view",
                data: {
                    id: i,
                    name: v,
                    view: i
                }, success: function (data) {
                    if (data != "") {
                        $('#' + v).html(data).prop("disabled", false);
                    }
                }, error: function (error) {
                    console.log(error.responseText);
                }, complete: function () {

                }
            });
        } else {
            const v = $(this).attr("data-view");
            const i = $(this).find(":selected").attr("selector");
            $.ajax({
                url: "/query-view/location-view",
                data: {
                    id: i,
                    name: n,
                    view: v
                }, success: function (data) {
                    if (data != "") {
                        $('#' + v).html(data).prop("disabled", false);
                    }
                }, error: function (error) {
                    console.log(error.responseText);
                }, complete: function () {

                }
            });
        }

        e.stopPropagation();
    });
}

if ($('#registerForm') != null) {
    $('#registerForm select').change(function (e) {
        e.preventDefault();
        

        const n = $(this).attr("name").replace("Input.","");
       
        const v = $(this).attr("data-view");
        const i = $(this).find(":selected").attr("selector");
        var rv = $(this).attr("data-view").replace("Input_", "");
            $.ajax({
                url: "/query-view/location-view",
                data: {
                    id: i,
                    name: n,
                    view: rv
                }, success: function (data) {
                    if (data != "") {
                        $('#' + v).html(data).prop("disabled", false);
                    }
                }, error: function (error) {
                    console.log(error.responseText);
                }, complete: function () {

                }
            });

        e.stopPropagation();
    });

    $("#Input_FisrtName,#Input_LastName").keyup(function (e) {
        e.preventDefault();
        var n = $(this).attr("name");
        if (n === "Input.FisrtName") {
            var v = $(this).val();
            var l = $('#Input_LastName').val();
            $('#Input_FullName').val(v + " " + l);
        } else {
            var v = $(this).val();
            var l = $('#Input_FisrtName').val();
            $('#Input_FullName').val(l + " " + v);
        }
    });

    $("#Input_Address").keyup(function () {
        var a = $('#Input_regions').find(":selected").text();
        var c = $('#Input_country').find(":selected").text();
        var s = $('#Input_state').find(":selected").text();
        var ct = $('#Input_city').find(":selected").text();

        $('#Input_FullAddress').val($(this).val() + " " + a + " " + c + " " + s + " " + ct);
    })

}

$(document).ready(function () {
    const ur = window.location.pathname;
    var path = ur.split('/');
    var gep = $.grep(path, function (n, i) {
        return n !== "";
    }).join(",");
    $('#navbarMain ul.navbar-nav li.nav-item').map(function (e) {
        if ($(this).find('a.nav-link').hasClass("active") == true) {
            $(this).find('a.nav-link').removeClass('active');
            return;
        }
    });
    const map_ser = $('.mega-menu ul li').map(function (e) {
        var hf = $(this).find('a').attr('href').split('/');
        var gep3 = $.grep(hf, function (n, i) {
            return n !== "";
        }).join(",");
        if (gep === gep3) {
            $(this).addClass('active');
            $(this).closest(".mega-menu").siblings("a").addClass("active");
            return true;
        }
        return false;
    });
    if (map_ser.index(true)==-1) {
        
        $('#navbarMain ul.navbar-nav li.nav-item a.nav-link').each(function () {
            const lr = $(this).attr('href').split('/');
            var gep2 = $.grep(lr, function (n, i) {
                return n !== "";
            }).join(",");
            if (gep === gep2) {
                $(this).addClass('active');
            }
        });
    }
});