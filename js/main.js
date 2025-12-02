// 轮播图功能
document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 检查元素是否存在
    if (!slides.length || !prevBtn || !nextBtn) {
        console.warn('轮播图元素未找到');
        return;
    }
    
    let autoSlideInterval;
    let isTransitioning = false; // 防止重复切换的标志
    let lastClickTime = 0; // 记录上次点击时间，用于防抖
    
    // 自动轮播
    function autoSlide() {
        if (!isTransitioning) {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        }
    }
    
    // 更新轮播图
    function updateCarousel() {
        // 移除所有活动状态
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 添加当前活动状态
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    // 重置自动轮播计时器
    function resetAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        autoSlideInterval = setInterval(autoSlide, 5000);
    }
    
    // 切换上一张（带防抖和防重复机制）
    function goToPrevSlide() {
        const now = Date.now();
        // 防抖：如果距离上次点击少于300ms，则忽略
        if (now - lastClickTime < 300 || isTransitioning) {
            return;
        }
        
        isTransitioning = true;
        lastClickTime = now;
        
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
        resetAutoSlide();
        
        // 300ms后允许下一次切换
        setTimeout(() => {
            isTransitioning = false;
        }, 300);
    }
    
    // 切换下一张（带防抖和防重复机制）
    function goToNextSlide() {
        const now = Date.now();
        // 防抖：如果距离上次点击少于300ms，则忽略
        if (now - lastClickTime < 300 || isTransitioning) {
            return;
        }
        
        isTransitioning = true;
        lastClickTime = now;
        
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
        resetAutoSlide();
        
        // 300ms后允许下一次切换
        setTimeout(() => {
            isTransitioning = false;
        }, 300);
    }
    
    // 手动切换 - 上一张（向左箭头）
    // 使用click事件，防抖机制已内置在goToPrevSlide函数中
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        goToPrevSlide();
    });
    
    // 触摸设备支持
    prevBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        goToPrevSlide();
    }, { passive: false });
    
    // 确保按钮始终可交互
    prevBtn.style.pointerEvents = 'auto';
    prevBtn.style.zIndex = '11';
    
    // 手动切换 - 下一张（向右箭头）
    // 使用click事件，防抖机制已内置在goToNextSlide函数中
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        goToNextSlide();
    });
    
    // 触摸设备支持
    nextBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        goToNextSlide();
    }, { passive: false });
    
    // 确保按钮始终可交互
    nextBtn.style.pointerEvents = 'auto';
    nextBtn.style.zIndex = '11';
    
    // 点击指示点切换
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            updateCarousel();
            resetAutoSlide(); // 重置自动轮播计时器
        });
    });
    
    // 启动自动轮播（每5秒切换一次）
    autoSlideInterval = setInterval(autoSlide, 5000);
    
    // 移动端菜单切换功能
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    // 关闭菜单的函数（定义在变量之后，确保可以访问）
    let closeMenu = function() {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (menuToggle) {
            menuToggle.classList.remove('active');
        }
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
        }
    };
    
    if (menuToggle && navMenu) {
        // 切换菜单显示/隐藏
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                navMenu.classList.add('active');
                menuToggle.classList.add('active');
                if (menuOverlay) {
                    menuOverlay.classList.add('active');
                }
            }
        });
        
        // 点击遮罩层关闭菜单
        if (menuOverlay) {
            menuOverlay.addEventListener('click', function() {
                closeMenu();
            });
        }
        
        // 点击菜单链接后自动收起菜单
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        // 窗口大小改变时，如果切换到桌面视图，关闭移动菜单
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }
    
    // 导航栏滚动效果
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // 添加/移除滚动样式
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 导航高亮
        highlightNavOnScroll();
        
        lastScroll = currentScroll;
    });
    
    // 导航滚动高亮功能
    function highlightNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // 如果是移动端菜单中的链接，关闭菜单
                if (navMenu && navMenu.classList.contains('active')) {
                    closeMenu();
                }
            }
        });
    });
    
    // 下载按钮点击动效
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 添加点击波纹效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // 显示下载提示
            const platform = this.querySelector('.download-platform').textContent;
            alert(`${platform} 下载即将开始...`);
        });
    });
    
    // 价格卡片悬停动效增强
    const priceCards = document.querySelectorAll('.price-card');
    priceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = '';
            }
        });
        
        // 价格卡片按钮点击
        const priceBtn = card.querySelector('.btn-price');
        priceBtn.addEventListener('click', function() {
            const planName = card.querySelector('.price-header h3').textContent;
            alert(`您选择了 ${planName}！`);
        });
    });
    
    // Banner按钮动效
    const bannerBtns = document.querySelectorAll('.btn-primary');
    bannerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            window.scrollTo({
                top: document.getElementById('download').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
    
    // 功能卡片进入视窗动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察功能卡片和评价卡片
    const cards = document.querySelectorAll('.feature-card, .testimonial-card, .price-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});


