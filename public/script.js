$("#seed").on("click", function () {
    event.preventDefault();

    console.log("seeding");

    $.get("/seed", function (response, err) {
        if (response) {
            console.log(response);
        }
        else if (err) {
            throw (err);
        }
    });

})
