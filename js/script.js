/**
 * СОТА - Маркетплейс нового поколения
 * Основной JavaScript файл
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initHeader();
    initMobileMenu();
    initTabs();
    initHoneycombBackground();
    setTimeout(initScrollAnimations, 180); // чуть раньше, чтобы элементы появлялись сразу
    initBenefitsCarousel();
    // initCustomCursor(); // Отключено по желанию пользователя
});

/**
 * Инициализация 3D-карусели преимуществ
 */
function initBenefitsCarousel() {
    const carouselContainer = document.querySelector('.benefits-3d-carousel');
    if (!carouselContainer) return;

    const cards = carouselContainer.querySelectorAll('.benefit-card');
    const prevButton = carouselContainer.querySelector('.carousel-control.prev');
    const nextButton = carouselContainer.querySelector('.carousel-control.next');
    const indicators = carouselContainer.querySelectorAll('.indicator');

    if (!prevButton || !nextButton || cards.length === 0) return;

    // Массив всех карточек
    const allCards = Array.from(cards);
    // Текущий индекс активной карточки
    let currentIndex = 0;
    // Задержка для автоматической прокрутки
    const autoScrollDelay = 5000;
    // Интервал автоматической прокрутки
    let autoScrollInterval;
    
    /**
     * Обновляет карусель, расставляя карточки в нужном порядке
     */
    function updateCarousel() {
        // Обновляем индикаторы
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        // Обновляем классы и атрибуты карточек
        allCards.forEach((card, index) => {
            // Удаляем все классы позиций
            card.classList.remove('benefit-primary', 'benefit-secondary', 'benefit-hidden');
            
            if (index === currentIndex) {
                // Главная карточка - по центру
                card.classList.add('benefit-primary');
                card.setAttribute('data-position', 'center');
            } else if (index === getPrevIndex(currentIndex)) {
                // Предыдущая карточка - слева
                card.classList.add('benefit-secondary');
                card.setAttribute('data-position', 'left');
            } else if (index === getNextIndex(currentIndex)) {
                // Следующая карточка - справа
                card.classList.add('benefit-secondary');
                card.setAttribute('data-position', 'right');
            } else {
                // Все остальные карточки - скрыты
                card.classList.add('benefit-hidden');
                card.setAttribute('data-position', 'hidden');
            }
        });
    }

    /**
     * Получает индекс предыдущей карточки с учетом цикличности
     */
    function getPrevIndex(index) {
        return (index === 0) ? allCards.length - 1 : index - 1;
    }

    /**
     * Получает индекс следующей карточки с учетом цикличности
     */
    function getNextIndex(index) {
        return (index === allCards.length - 1) ? 0 : index + 1;
    }

    /**
     * Переключает на следующую карточку
     */
    function scrollToNext() {
        currentIndex = getNextIndex(currentIndex);
        updateCarousel();
    }

    /**
     * Переключает на предыдущую карточку
     */
    function scrollToPrev() {
        currentIndex = getPrevIndex(currentIndex);
        updateCarousel();
    }

    /**
     * Запускает автоматическую прокрутку
     */
    function startAutoScroll() {
        stopAutoScroll(); // Останавливаем предыдущий интервал, если он есть
        autoScrollInterval = setInterval(scrollToNext, autoScrollDelay);
    }

    /**
     * Останавливает автоматическую прокрутку
     */
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Обработчики событий кнопок
    nextButton.addEventListener('click', () => {
        scrollToNext();
        stopAutoScroll();
        startAutoScroll(); // Перезапускаем автопрокрутку при ручном взаимодействии
    });

    prevButton.addEventListener('click', () => {
        scrollToPrev();
        stopAutoScroll();
        startAutoScroll();
    });
    
    // Обработчики событий для индикаторов
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            stopAutoScroll();
            startAutoScroll();
        });
    });

    // Останавливаем автопрокрутку при наведении на карусель
    carouselContainer.addEventListener('mouseenter', stopAutoScroll);
    carouselContainer.addEventListener('mouseleave', startAutoScroll);
    
    // Поддержка свайпов для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Свайп влево - следующая карточка
            scrollToNext();
        } else if (touchEndX > touchStartX + 50) {
            // Свайп вправо - предыдущая карточка
            scrollToPrev();
        }
        stopAutoScroll();
        startAutoScroll();
    }
    
    // Инициализация карусели
    updateCarousel();
    startAutoScroll();
}


/**
 * Инициализация хедера (изменение стиля при скролле)
 */
function initHeader() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu a');
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Анимация гамбургер-иконки
        mobileMenuToggle.classList.toggle('active');
        if (mobileMenuToggle.classList.contains('active')) {
            mobileMenuToggle.querySelector('span:first-child').style.transform = 'translateY(9px) rotate(45deg)';
            mobileMenuToggle.querySelector('span:nth-child(2)').style.opacity = '0';
            mobileMenuToggle.querySelector('span:last-child').style.transform = 'translateY(-9px) rotate(-45deg)';
        } else {
            mobileMenuToggle.querySelector('span:first-child').style.transform = 'none';
            mobileMenuToggle.querySelector('span:nth-child(2)').style.opacity = '1';
            mobileMenuToggle.querySelector('span:last-child').style.transform = 'none';
        }
    });
    
    // Закрытие меню при клике на пункт меню
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.querySelector('span:first-child').style.transform = 'none';
            mobileMenuToggle.querySelector('span:nth-child(2)').style.opacity = '1';
            mobileMenuToggle.querySelector('span:last-child').style.transform = 'none';
        });
    });
}

/**
 * Инициализация табов в разделе "Как это работает"
 */
function initTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabHeaders.length === 0 || tabPanes.length === 0) return;
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Убрать активный класс у всех заголовков и панелей
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Добавить активный класс выбранному заголовку и соответствующей панели
            header.classList.add('active');
            const tabId = header.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Создание фона из сот для секции hero
 */
function initHoneycombBackground() {
    const honeycombContainer = document.querySelector('.honeycomb');
    
    if (!honeycombContainer) return;
    
    const hexSize = 80; // Размер шестиугольника
    const containerWidth = honeycombContainer.clientWidth;
    const containerHeight = honeycombContainer.clientHeight;
    
    // Рассчитаем, сколько шестиугольников нам нужно для заполнения контейнера
    const hexPerRow = Math.ceil(containerWidth / (hexSize * 1.5)) + 1;
    const hexPerColumn = Math.ceil(containerHeight / (hexSize * 0.866)) + 1;
    
    let honeycombHTML = '';
    
    for (let row = 0; row < hexPerColumn; row++) {
        for (let col = 0; col < hexPerRow; col++) {
            // Создаем смещение для четных рядов
            const xOffset = row % 2 === 0 ? 0 : hexSize * 0.75;
            
            const x = col * hexSize * 1.5 + xOffset;
            const y = row * hexSize * 0.866;
            
            // Случайный размер для более динамичного вида
            const size = hexSize * (0.8 + Math.random() * 0.4);
            
            honeycombHTML += `
                <div class="hex" style="
                    left: ${x}px; 
                    top: ${y}px; 
                    width: ${size}px; 
                    height: ${size * 0.866}px;
                    clip-path: polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%);
                    background-color: ${Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--secondary-color)'};
                    opacity: ${0.05 + Math.random() * 0.1};
                    position: absolute;
                "></div>
            `;
        }
    }
    
    honeycombContainer.innerHTML = honeycombHTML;
}

/**
 * Инициализация анимаций при скролле
 */
function initScrollAnimations() {
    // Анимация появления элементов при скролле
    const animatedElements = document.querySelectorAll('.benefit-card, .tech-bubbles .bubble');
    
    if (animatedElements.length === 0) return;
    
    // Опции для Intersection Observer
    const options = {
        root: null, // Используем viewport как корневой элемент
        rootMargin: '0px',
        threshold: 0.03 // почти сразу реагируем, быстрая анимация
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Добавляем класс для анимации с задержкой, зависящей от индекса элемента
                setTimeout(() => {
                    element.classList.add('fade-in');
                }, element.dataset.delay || 0);
                
                // Перестаем наблюдать за элементом после его появления
                observer.unobserve(element);
            }
        });
    }, options);
    
    // Добавляем задержки и начинаем наблюдение за элементами
    animatedElements.forEach((element, index) => {
        // Установим разную задержку в зависимости от типа элемента и его положения
        let delay = 0;
        
        if (element.classList.contains('benefit-card')) {
            delay = index * 45; // быстрее анимация!
        } else if (element.classList.contains('bubble')) {
            delay = index * 30;
        } else {
            delay = index * 70;
        }
        
        element.dataset.delay = delay;
        // если элемент видим уже при загрузке
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
            setTimeout(()=>element.classList.add('fade-in'), 60+delay);
            observer.unobserve(element);
        } else {
            observer.observe(element);
        }
    });
}

/**
 * Инициализация кастомного курсора
 */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor-follower');
    
    if (!cursor) return;
    
    // Показываем курсор при движении мыши
    document.addEventListener('mousemove', e => {
        cursor.style.opacity = '1';
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    
    // Увеличиваем курсор при наведении на интерактивные элементы
    const interactiveElements = document.querySelectorAll('a, button, .btn, .tab-header');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(255, 193, 7, 0.3)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'rgba(255, 193, 7, 0.5)';
        });
    });
    
    // Скрываем системный курсор
    document.body.style.cursor = 'none';
    
    // Скрываем кастомный курсор, когда он выходит за пределы окна
    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
    });
    
    // Эффект нажатия
    document.addEventListener('mousedown', () => {
        cursor.style.transform += ' scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', '');
    });
}

/**
 * Создание эффекта параллакса для секции hero
 */
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero');
    const scrollPosition = window.scrollY;
    
    if (heroSection && scrollPosition <= heroSection.clientHeight) {
        const parallaxElements = heroSection.querySelectorAll('.honeycomb .hex');
        parallaxElements.forEach((element, index) => {
            // Разная скорость движения для эффекта параллакса
            const speed = 0.05 + (index % 3) * 0.02;
            const yPos = scrollPosition * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
});
