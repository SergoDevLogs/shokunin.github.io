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