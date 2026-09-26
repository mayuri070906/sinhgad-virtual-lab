document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================
           GET ALL CARDS
        ====================================== */

        const cards =
            document.querySelectorAll(
                ".structure-card"
            );


        /* =====================================
           GET ALL BUTTONS
        ====================================== */

        const buttons =
            document.querySelectorAll(
                ".structure-card .primary-btn"
            );


        /* =====================================
           CARD HOVER
        ====================================== */

        cards.forEach(
            function (card) {

                card.addEventListener(
                    "mouseenter",
                    function () {

                        this.classList.add(
                            "card-active"
                        );

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    function () {

                        this.classList.remove(
                            "card-active"
                        );

                    }
                );

            }
        );


        /* =====================================
           BUTTON CLICK
        ====================================== */

        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        this.classList.add(
                            "button-clicked"
                        );

                    }
                );

            }
        );


        /* =====================================
           CARD LOAD ANIMATION
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

                        card.style.opacity = "1";

                        card.style.transform =
                            "translateY(0)";

                    },
                    index * 100
                );

            }
        );


        /* =====================================
           KEYBOARD ACCESSIBILITY
        ====================================== */

        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter"
                        ) {

                            this.click();

                        }

                    }
                );

            }
        );

    }
);