$(document).ready(function () {
    console.log($("#color-2").val());
    $("#color-2").on("change", function () {
        $("div[data-role='content']").css('background-color', $(this).val());
    });
});