// Global variables
let targetDate = new Date('October 4, 2025 05:00:00').getTime();
let countdownTimer;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    startCountdown();
});

// Start the countdown timer
function startCountdown() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
    
    countdownTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update the display
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

        // If the countdown is over
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdown').innerHTML = `
                <div class="reunion-message">
                    <h2>🎉 You're Together Now! 🎉</h2>
                    <p>Enjoy your time together, Andrew & Tara!</p>
                </div>
            `;
        }
    }, 1000);
}


// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add click effect to countdown units
    const timeUnits = document.querySelectorAll('.time-unit');
    timeUnits.forEach(unit => {
        unit.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add floating hearts animation
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.opacity = '0.7';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1';
        heart.style.animation = 'float 8s linear forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }

    // Create floating hearts periodically
    setInterval(createFloatingHeart, 3000);

    // Add romantic message rotation
    const romanticMessages = [
        "Distance means nothing when someone means everything",
        "Love knows no distance",
        "Soon we'll be in each other's arms",
        "The countdown to happiness begins now"
    ];

    let messageIndex = 0;
    const messageElement = document.querySelector('.romantic-message p');
    
    setInterval(() => {
        messageIndex = (messageIndex + 1) % romanticMessages.length;
        messageElement.style.opacity = '0';
        setTimeout(() => {
            messageElement.textContent = `"${romanticMessages[messageIndex]}"`;
            messageElement.style.opacity = '1';
        }, 500);
    }, 10000);
});

// Add some sparkle effects on hover
document.addEventListener('mousemove', function(e) {
    if (Math.random() < 0.1) { // 10% chance
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.fontSize = '12px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10';
        sparkle.style.animation = 'sparkle 1s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
});

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Slideshow functionality
let slideIndex = 0;
let slideInterval;

// Initialize slideshow
function initSlideshow() {
    detectVideoSlides();
    showSlide(0);
    startAutoPlay();
}

// Detect which slides have videos
function detectVideoSlides() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        const video = slide.querySelector('.slide-video');
        if (video && video.src && video.src !== '') {
            slide.classList.add('has-video');
        }
    });
}

// Show specific slide
function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;
    
    // Pause all videos and hide all slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        const video = slide.querySelector('.slide-video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
    
    // Check if current slide has a video and play it
    const currentSlide = slides[slideIndex];
    const currentVideo = currentSlide.querySelector('.slide-video');
    const currentImage = currentSlide.querySelector('.slide-image');
    
    if (currentVideo && currentVideo.src) {
        // Hide image, show video
        if (currentImage) currentImage.style.display = 'none';
        currentVideo.style.display = 'block';
        currentVideo.play().catch(e => {
            console.log('Video autoplay prevented:', e);
            // If autoplay fails, show image instead
            if (currentImage) currentImage.style.display = 'block';
            currentVideo.style.display = 'none';
        });
    } else {
        // Show image, hide video
        if (currentImage) currentImage.style.display = 'block';
        if (currentVideo) currentVideo.style.display = 'none';
    }
}

// Change slide by direction
function changeSlide(direction) {
    slideIndex += direction;
    showSlide(slideIndex);
    resetAutoPlay();
}

// Go to specific slide
function currentSlide(n) {
    slideIndex = n - 1;
    showSlide(slideIndex);
    resetAutoPlay();
}

// Auto-play functionality
function startAutoPlay() {
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 5000); // Change slide every 5 seconds
}

// Check if slide has video content
function hasVideo(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    const slide = slides[slideIndex];
    if (!slide) return false;
    
    const video = slide.querySelector('.slide-video');
    return video && video.src && video.src !== '';
}

// Get appropriate timing for slide (longer for videos)
function getSlideTiming(slideIndex) {
    return hasVideo(slideIndex) ? 8000 : 5000; // 8 seconds for videos, 5 for images
}

function resetAutoPlay() {
    clearInterval(slideInterval);
    startAutoPlay();
}

// Pause auto-play on hover
document.addEventListener('DOMContentLoaded', function() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }
});

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSlideshow();
});
