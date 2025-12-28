let lastScrollY = 0;
let isTicking = false;

const handleScroll = () => {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50 && !header.classList.contains('scrolled')) {
        header.classList.add('scrolled');
    } else if (currentScrollY <= 50 && header.classList.contains('scrolled')) {
        header.classList.remove('scrolled');
    }

    isTicking = false;
};

window.addEventListener('scroll', () => {
    if (!isTicking) {
        window.requestAnimationFrame(handleScroll);
        isTicking = true;
    }
});
