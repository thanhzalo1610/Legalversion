var ajax_form = {
    Init: function () {

    },
    form: function (element_form) {

        $(document).on("submit", "form[data-ajax='true']", function (e) {
            e.preventDefault();

            var form = $(this);

            if (!form.valid()) {
                return; // Validation không hợp lệ -> không submit
            }

            var url = form.attr("action");
            var method = form.attr("method");

            var formData = new FormData(this);

            if (typeof window[form.data("ajax-begin")] === "function") {
                window[form.data("ajax-begin")](form);
            }

            $.ajax({
                url: url,
                type: method,
                data: formData,
                processData: false,
                contentType: false,
                beforeSend: function () {
                    onBegin();
                },
                success: function (response) {
                    onSuccess();
                },
                error: function (xhr) {
                    onFailed();
                },
                complete: function () {
                    onComplete();
                }
            });
            e.stopPropagation();
        });
    }
}


function onBegin(form) {
    $('#loadding').removeClass("d-none");
}

function onSuccess(response, form) {
    Swal.fire({
        icon: response.status ?? "success",
        title: response.title ?? "Success",
        text: response.message ?? "Done"
    });
}

function onFailed(xhr, form) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: xhr.responseText ?? "Request failed"
    });
}

function onComplete(form) {
    $('#loadding').addClass("d-none");
}