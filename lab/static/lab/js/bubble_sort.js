document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =================================
           THEORY SECTION ANIMATION
        ================================= */

        const sections =
            document.querySelectorAll(
                ".theory-section"
            );


        sections.forEach(
            function (section, index) {

                section.style.opacity = "0";

                section.style.transform =
                    "translateY(15px)";


                setTimeout(
                    function () {

                        section.style.transition =
                            "opacity 0.4s ease, transform 0.4s ease";

                        section.style.opacity =
                            "1";

                        section.style.transform =
                            "translateY(0)";

                    },
                    index * 70
                );

            }
        );


        /* =================================
           VISUALIZATION BUTTON
        ================================= */

        const button =
            document.querySelector(
                ".visualization-btn"
            );


        if (button) {

            button.addEventListener(
                "click",
                function () {

                    this.style.transform =
                        "scale(0.97)";

                }
            );

        }

    }
);