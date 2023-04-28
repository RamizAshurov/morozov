const lockPaddingElements = document.querySelector("header");

function lockBody() {
    let paddingValue = window.innerWidth - document.documentElement.clientWidth;
    if (lockPaddingElements && paddingValue) {
        lockPaddingElements.style.paddingRight = paddingValue + "px"
    }
    document.body.classList.add("body_lock")
}

function unlockBody () {
    if (lockPaddingElements) {
        lockPaddingElements.style.paddingRight = ""
    }
    document.body.classList.remove("body_lock")
}

function closePopup(popup) {
    // сбрасываем форму
    if (popup.querySelector("form")) {
        popup.querySelector(".popup__form").reset();
        popup.querySelectorAll(".form__input_error").forEach(reqField => reqField.classList.remove("form__input_error"))
    }
    // возвращаем слайдер к первому слайду
    if (popup.querySelector(".swiper-wrapper")) {
        popup.querySelector(".swiper-wrapper").style.transform = ""
    }
    
    popup.classList.remove("popup_open");
    popup.addEventListener("transitionend", () =>  {
        if (!document.querySelector(".header__burger_open")) {
            unlockBody() 
        }
        if (popup.classList.contains("popup_form-sent")) {
            popup.classList.remove("popup_form-sent")
        }
    }, {once: true})
}

function openPopup(popup = undefined) {
    lockBody()
    if (popup) {
        popup.classList.add("popup_open")
    } else {
        console.log("Give me a popup")
    }
}

function validateForm(form) {
    
    function changeContentPage(form) {
        form.closest(".popup__content").style.opacity = "0"
        form.closest(".popup__content").addEventListener("transitionend", () => {
            form.closest(".popup").classList.add("popup_form-sent");
            form.closest(".popup__content").style.opacity = "1"
        }, { once: true })
    }

    const reqFiedls = form.querySelectorAll('.form__input_required')

    let errors = 0;
    for (let i = 0; i < reqFiedls.length; i++) {
        if (reqFiedls[i].getAttribute("name") === "phone") {
            if (reqFiedls[i].value.trim() === "" || reqFiedls[i].value.length < 15) {
                reqFiedls[i].classList.add("form__input_error");
                errors++;
            }
        }
        if (reqFiedls[i].getAttribute("name") === "file") {
            if (reqFiedls[i].value === "") {
                reqFiedls[i].classList.add("form__input_error");
                errors++;
            }
        }
    }

    if (errors) {
        console.log("Fill req fields");
        if (form.classList.contains("popup__form")) {
            form.closest(".popup__content").classList.add("animate__shakeX");
            form.closest(".popup__content").addEventListener("animationend", (e) => e.target.classList.remove("animate__shakeX"))
        }
    } else {
        // sendForm(form)
        setTimeout(() => {
            if (form.classList.contains("popup__form")) {
                changeContentPage(form)
            } else {
                form.reset()
            }
        })
    }
}

function phoneMask(e) {
    console.log(e)
}  

async function sendForm(form) {
    const data = new FormData(form);
    let response = await fetch("", {
        method: "POST",
        body: data
    })

    if (response.ok) {
        console.log("ok!")
    }
}

const burger = document.querySelector(".header__burger");

burger.addEventListener("click", (e) => {
    const headerNav = document.querySelector(".header__nav");
    burger.classList.toggle("header__burger_open")
    headerNav.classList.toggle("header__nav_open");
    if (document.body.classList.contains("body_lock")) {
        unlockBody()
    } else {
        lockBody()
    }
})

// Попап "Заказать звонок"
document.querySelectorAll(".header__button").forEach(headerButton => {
    const headerPopup = document.querySelector(".header .popup");
    headerButton.addEventListener("click", (e) => openPopup(headerPopup))
})

// Закрыть попап
document.querySelectorAll(".popup__close").forEach(closeElement => {
    closeElement.addEventListener("click", e => {
        closePopup(e.target.closest(".popup"))
    })
})

// Закрыть попап по клику на esc
document.addEventListener("keydown", (e) => {
    if (e.which === 27) {
        const popupActive = document.querySelector(".popup_open")

        if (popupActive) {
            closePopup(popupActive)
        }
    }
})

// 
const headerObserverElement = document.querySelector(".header__observer");

const callback = function(entries, observer) {
    const hero = document.querySelector(".hero") 
    if (entries[0].isIntersecting) {
        hero.classList.remove("hero_scroll")
    } else {
        hero.classList.add("hero_scroll")
    }
}

const headerObserver = new IntersectionObserver(callback)
headerObserver.observe(headerObserverElement)

// Обработка форм
for (let i = 0; i < document.forms.length; i++) {
    document.forms[i].addEventListener("submit", (e) => {
        e.preventDefault();
        validateForm(e.target)
    })
}

document.querySelectorAll(".form__input_required").forEach(reqField => {
    reqField.addEventListener("input", (e) => {
        if (reqField.classList.contains("form__input_error")) {
            reqField.classList.remove("form__input_error")
        }
    })

})

document.querySelector(".form__file-input").addEventListener("change", e => {
    e.target.nextElementSibling.lastElementChild.innerHTML = e.target.files[0].name
})

document.querySelectorAll("input[name='phone']").forEach(inputElement => {
    inputElement.addEventListener("keypress", (e) => {
        const length = e.target.value.length;
        if (e.charCode < 48 || e.charCode > 57 || length > 14) {
            e.preventDefault();
            return;
        }

        switch (length) {
            case 0: 
                e.target.value = "8 " ;
                break;
            case 5:
            case 9:
            case 12:
                e.target.value += " ";
                break;
            default:
                break;
        }
    })
    inputElement.addEventListener("input", e => {e.target.value.length === 2 && (e.target.value = "")})
})

// Открытие галереи
document.querySelectorAll(".work-item").forEach((work) => {
    work.addEventListener("click", (e) => {
        const workId = work.dataset.workId;
        if (workId)
            openPopup(e.target.closest(".works").querySelector(`.popup_${workId}`))
    })
})

const worksSwiper = new Swiper(".works__body", {
    // Optional parameters
    slidesPerView: 3,
    spaceBetween: 20,
    breakpoints: {
        320: {
            slidesPerView: 1.1,
            spaceBetween: 10
        },
        576: {
            slidesPerView: 2,
        },
        941: {
            slidesPerView: 3
        }
    },
    // If we need pagination
    pagination: {
        el: ".swiper-pagination",
        type: "fraction",
        formatFractionCurrent: function(number) {
            if (number < 10)
                return "0" + number;
            return number
        }
    },
    
    // Navigation arrows
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    
    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});

new Swiper(".work-overview__gallery", {
    // Optional parameters
    slidesPerView: 2,
    spaceBetween: 20,
    breakpoints: {
        320: {
            slidesPerView: 1.05,
            spaceBetween: 10
        },
        576: {
            slidesPerView: 2,
        },
    },
    // If we need pagination
    
    // Navigation arrows
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    
    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
})

document.querySelector(".swiper-show-more").addEventListener("click", (e) =>  {
    e.target.closest(".swiper-controls").remove()
    worksSwiper.destroy();
    document.querySelector(".works__list").classList.add("works__list_open");
})