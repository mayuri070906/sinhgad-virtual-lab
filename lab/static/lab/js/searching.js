document.addEventListener("DOMContentLoaded", function () {

    const links =
        document.querySelectorAll(".search-nav a");

    links.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                this.getAttribute("href");

            if (targetId.startsWith("#")) {

                event.preventDefault();

                const target =
                    document.querySelector(targetId);

                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }

        });

    });

});