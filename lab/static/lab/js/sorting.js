document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================
           GET ALL SORTING CARDS
        ====================================== */

        const cards =
            document.querySelectorAll(
                ".sorting-card"
            );


        /* =====================================
           CARD ANIMATION
        ====================================== */

        cards.forEach(
            function (card, index) {

                card.style.opacity = "0";

                card.style.transform =
                    "translateY(20px)";


                setTimeout(
                    function () {

                        card.style.transition =
                            "opacity 0.45s ease, transform 0.45s ease";

                        card.style.opacity =
                            "1";

                        card.style.transform =
                            "translateY(0)";

                    },
                    index * 100
                );

            }
        );


        /* =====================================
           BUTTON CLICK EFFECT
        ====================================== */

        const buttons =
            document.querySelectorAll(
                ".primary-btn"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        this.style.transform =
                            "scale(0.97)";

                        setTimeout(
                            function () {

                                button.style.transform =
                                    "";

                            },
                            150
                        );

                    }
                );

            }
        );

    }
);