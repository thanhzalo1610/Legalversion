if ($("#complex_head_col").length > 0) {

    $("#complex_head_col").DataTable({
        columns: [{ width: '5%' }, { width: '30%' }, { width: '30%' }, { width: '20%' }, { width: '5%' }]
    });
}
if ($("#form-search-chat").length > 0) {
    $("#form-search-chat #text-srh").on("input", function (e) {
        e.preventDefault();
        let keyword = $(this).val().toLowerCase().trim();

        $(".item-title").each(function () {

            let text = $(this).attr("data-title").toLowerCase();

            // Nếu không nhập gì → show tất cả
            if (keyword === "") {
                $(this).show();
                return;
            }

            // Kiểm tra chuỗi full
            let matchFull = text.includes(keyword);

            // Kiểm tra từng từ
            let words = keyword.split(/\s+/);
            let matchWords = words.every(w => text.includes(w));

            // Kiểm tra từng ký tự
            let chars = keyword.split("");
            let matchChars = chars.every(c => text.includes(c));

            // Nếu có bất kỳ điều kiện nào đúng → show
            if (matchFull || matchWords || matchChars) {
                $(this).show();
            } else {
                $(this).hide();
            }

        });
        e.stopPropagation();
    });
}
if ($(".counter-carousel").length > 0) {
    $(".counter-carousel").owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplaySpeed: 2000,
        nav: false,
        rtl: true,
        responsive: {
            0: {
                items: 2,
            },
            576: {
                items: 2,
            },
            768: {
                items: 3,
            },
            1200: {
                items: 5,
            },
            1400: {
                items: 6,
            },
        },
    });
}
