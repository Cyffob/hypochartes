const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
});

// Gestion des sous-menus au clic (uniquement utile en mobile)
document.querySelectorAll('.nav-item > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const parent = link.parentElement;
        const hasDropdown = parent.querySelector('.dropdown');

        if (hasDropdown && window.innerWidth <= 768) {
            e.preventDefault(); // évite de suivre le lien si on veut juste ouvrir le sous-menu
            parent.classList.toggle('open');
        }
    });
});

document.querySelectorAll('.has-submenu > a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            link.parentElement.classList.toggle('open');
        }
    });
});