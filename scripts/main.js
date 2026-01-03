document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-card');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const carousel = document.querySelector('.carousel');
    const starsContainer = document.querySelector('.stars-container');
    let currentSlide = 0;
    let slideInterval;
    let isPaused = false;

    // Создаем звездочки для каждого слайда
    function createStars() {
        starsContainer.innerHTML = '';
        
        slides.forEach((_, index) => {
            const starBtn = document.createElement('button');
            starBtn.className = 'star-btn';
            starBtn.setAttribute('data-slide', index);
            starBtn.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
            
            const starImg = document.createElement('img');
            starImg.className = 'star-img';
            
            // Устанавливаем начальное изображение
            updateStarImage(starImg, index);
            
            starBtn.appendChild(starImg);
            starsContainer.appendChild(starBtn);
            
            // Добавляем обработчик клика
            starBtn.addEventListener('click', function() {
                goToSlide(index);
                stopTimer();
            });
        });
    }
    
    // Обновляем изображение звездочки в зависимости от активного слайда
    function updateStarImage(starImg, index) {
        if (index === currentSlide) {
            starImg.src = './images/header/star-red.svg';
            starImg.alt = 'Активный слайд';
            starImg.classList.add('active');
        } else {
            starImg.src = './images/header/star-gray.svg';
            starImg.alt = 'Неактивный слайд';
            starImg.classList.remove('active');
        }
    }
    
    // Обновляем все звездочки
    function updateAllStars() {
        const starButtons = document.querySelectorAll('.star-btn');
        starButtons.forEach((starBtn, index) => {
            const starImg = starBtn.querySelector('.star-img');
            updateStarImage(starImg, index);
        });
    }
    
    // Переход к конкретному слайду
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
        updateAllStars();
    }
    
    // Показываем слайд
    // Показываем слайд
    function showSlide(index) {
        // Удаляем active со всех слайдов
        slides.forEach(slide => {
            slide.classList.remove('active');
            // Сбрасываем трансформацию для неактивных слайдов
            slide.style.transform = 'translateY(10px)';
            slide.style.transition = 'transform 0.5s ease';
        });
        
        // Добавляем active к текущему слайду
        slides[index].classList.add('active');
        
        // Применяем анимацию подъема
        setTimeout(() => {
            slides[index].style.transform = 'translateY(0)';
        }, 10); // Небольшая задержка для активации анимации
    }

    function startTimer() {
        if (isPaused) return;
        slideInterval = setInterval(function() {
            currentSlide++;
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }
            showSlide(currentSlide);
            updateAllStars();
        }, 5000);
    }

    function stopTimer() {
        clearInterval(slideInterval);
        isPaused = true;
    }

    function resetTimer() {
        stopTimer();
        isPaused = false;
        startTimer();
    }

    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
        updateAllStars();
        stopTimer();
    }

    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
        updateAllStars();
        stopTimer();
    }

    // Инициализация
    slides[currentSlide].classList.add('active');
    createStars();
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    if (carousel) {
        carousel.addEventListener('mouseenter', stopTimer);
        carousel.addEventListener('mouseleave', resetTimer);
    }

    startTimer();
});

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.floating-img');
    
    // Функция проверки видимости
    function checkScroll() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        animatedElements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top + windowTop;
            const elementBottom = elementTop + element.offsetHeight;
            
            // Если элемент в зоне видимости
            if (elementBottom > windowTop && elementTop < windowBottom) {
                const scrollPercent = (windowBottom - elementTop) / (windowHeight + element.offsetHeight);
                
                // Определяем направление разлета
                let translateX = 0;
                const translateY = scrollPercent * 100; // Изменено: теперь увеличивается со скроллом
                
                // Первые две картинки - влево и вниз
                if (index < 2) {
                    translateX = scrollPercent * -100; // Изменено: увеличивается со скроллом (влево)
                } 
                // Последняя картинка - вправо и вниз
                else if (index === animatedElements.length - 1) {
                    translateX = scrollPercent * 100; // Изменено: увеличивается со скроллом (вправо)
                }
                // Остальные картинки (если есть) - просто вниз
                else {
                    translateX = 0;
                }
                
                element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${element.style.rotate || '0deg'})`;
            }
        });
    }
    
    // Дебаунс для оптимизации
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Первоначальная проверка
    checkScroll();
}

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', initScrollAnimations);


class BackgroundVideo {
    constructor(videoElement) {
        this.video = videoElement;
        this.isVisible = false;
        this.fadeDuration = 1500; // мс
        this.setupVideo();
        this.initIntersectionObserver();
    }

    setupVideo() {
        // Убираем звук на всякий случай
        this.video.muted = true;
        this.video.volume = 0;
        
        // Событие для плавного перезапуска
        this.video.addEventListener('timeupdate', () => {
            if (this.video.currentTime >= this.video.duration - 1.5) {
                this.startFadeOut();
            }
        });

        // После окончания видео - плавный перезапуск
        this.video.addEventListener('ended', () => {
            this.restartVideo();
        });
    }

    startFadeOut() {
        if (!this.isVisible) return;
        
        this.video.classList.add('fade-out');
        this.video.classList.remove('fade-in');
    }

    restartVideo() {
        this.video.classList.add('fade-in');
        this.video.classList.remove('fade-out');
        
        // Перезапуск с небольшой задержкой
        setTimeout(() => {
            if (this.isVisible) {
                this.video.currentTime = 0;
                this.video.play().catch(e => console.log('Autoplay prevented:', e));
            }
        }, this.fadeDuration);
    }

    initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px', // Запас для плавности
            threshold: 0.1 // Виден хотя бы на 10%
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.playVideo();
                } else {
                    this.pauseVideo();
                }
            });
        }, options);

        observer.observe(this.video);
    }

    playVideo() {
        this.isVisible = true;
        this.video.classList.add('fade-in');
        this.video.classList.remove('fade-out');
        
        // Проверяем, помещается ли видео на экране
        const videoRect = this.video.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (videoRect.height >= viewportHeight * 0.9) { // 90% высоты экрана
            this.video.play().catch(e => {
                // Автовоспроизведение может быть заблокировано
                console.log('Autoplay prevented, will play on interaction');
                this.addPlayOnInteraction();
            });
        } else {
            // Видео слишком маленькое - не воспроизводим
            this.video.pause();
        }
    }

    pauseVideo() {
        this.isVisible = false;
        this.video.pause();
        this.video.classList.add('fade-out');
        this.video.classList.remove('fade-in');
    }

    addPlayOnInteraction() {
        const playOnce = () => {
            if (this.isVisible) {
                this.video.play();
            }
            document.removeEventListener('click', playOnce);
            document.removeEventListener('touchstart', playOnce);
        };
        
        document.addEventListener('click', playOnce);
        document.addEventListener('touchstart', playOnce);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const videoElements = document.querySelectorAll('.background-video');
    videoElements.forEach(video => new BackgroundVideo(video));
});

document.addEventListener('DOMContentLoaded', function() {
    const videoCards = document.querySelectorAll('.animate-on-scroll');
    const videoContainer = document.querySelector('.video-container');
    const aboutSection = document.querySelector('#about_us'); // Предполагаем, что секция "О нас" имеет id="about"
    
    // Проверяем, видна ли секция "О нас"
    function isAboutSectionVisible() {
        if (!aboutSection) return true; // Если секции нет, показываем сразу
        
        const rect = aboutSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Секция видна, если хотя бы 20% ее находится в области просмотра
        return rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2;
    }
    
    // Активируем анимацию карточек
    function activateCardsAnimation() {
        videoCards.forEach(card => {
            card.classList.add('visible');
        });
        // Убираем обработчики после активации
        window.removeEventListener('scroll', checkAndActivate);
        window.removeEventListener('click', handleMenuClick);
    }
    
    // Проверяем и активируем при скролле
    function checkAndActivate() {
        if (isAboutSectionVisible()) {
            activateCardsAnimation();
        }
    }
    
    // Обработчик клика по кнопке меню "О нас"
    function handleMenuClick(e) {
        // Проверяем, является ли клик по ссылке на секцию "О нас"
        const target = e.target.closest('a[href*="#about"], a[href*="#about-us"]');
        if (target) {
            // Ждем завершения плавной прокрутки
            setTimeout(activateCardsAnimation, 800);
        }
    }
    
    // Проверяем сразу при загрузке (если секция уже видна)
    if (isAboutSectionVisible()) {
        activateCardsAnimation();
    } else {
        // Добавляем обработчики
        window.addEventListener('scroll', checkAndActivate);
        window.addEventListener('click', handleMenuClick);
        
        // Также проверяем при скролле внутри видео-контейнера
        const scrollWrapper = document.querySelector('.video-scroll-wrapper');
        if (scrollWrapper) {
            scrollWrapper.addEventListener('scroll', checkAndActivate);
        }
    }
});