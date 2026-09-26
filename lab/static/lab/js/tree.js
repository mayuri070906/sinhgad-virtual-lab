/* =================================
   TREE THEORY PAGE JS
================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Tree theory page loaded.");

    /*
       Smooth scroll for internal links
       if added in future.
    */

    const links = document.querySelectorAll(
        'a[href^="#"]'
    );

    links.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const target = document.querySelector(
                this.getAttribute("href")
            );

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

});