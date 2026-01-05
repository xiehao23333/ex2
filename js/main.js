// 测试播放列表（本地音频文件）
const demoPlaylist = [
    { title: '演示歌曲 1', artist: '本地测试', cover: 'res/bg1.jpg', url: 'res/sound/ex1.mp3' },
    { title: '演示歌曲 2', artist: '本地测试', cover: 'res/bg2.jpg', url: 'res/sound/ex2.mp3' },
    { title: '演示歌曲 3', artist: '本地测试', cover: 'res/bg3.png', url: 'res/sound/ex3.mp3' }
];

// 轮播图功能
document.addEventListener('DOMContentLoaded', function() {
    // --- 轮播图逻辑开始 ---
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 只有当存在轮播图元素时，才执行轮播图逻辑
    if (slides.length > 0 && prevBtn && nextBtn) {
        let currentSlide = 0;
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
    }
    // --- 轮播图逻辑结束 ---
    
    // --- 下面是其他通用逻辑（确保这些在 if 外面，能被执行到） ---
    
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
    
    
    // ========== 左下角悬浮播放器 ==========
    const miniPlayer = document.getElementById('mini-player');
    const playerCoverImg = document.getElementById('playerCoverImg');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtnPlayer = document.getElementById('prevBtnPlayer');
    const nextBtnPlayer = document.getElementById('nextBtnPlayer');
    
    // 场景数据
    const sceneData = {
        focus: [
            { title: 'Deep Focus', artist: 'Various Artists', cover: 'https://picsum.photos/300/300?random=focus1', url: '' },
            { title: 'Concentration Flow', artist: 'Ambient Music', cover: 'https://picsum.photos/300/300?random=focus2', url: '' },
            { title: 'Study Session', artist: 'Lo-Fi Beats', cover: 'https://picsum.photos/300/300?random=focus3', url: '' }
        ],
        workout: [
            { title: 'Power Up', artist: 'Energy Mix', cover: 'https://picsum.photos/300/300?random=workout1', url: '' },
            { title: 'Cardio Beats', artist: 'Fitness Music', cover: 'https://picsum.photos/300/300?random=workout2', url: '' },
            { title: 'Gym Anthems', artist: 'Workout Playlist', cover: 'https://picsum.photos/300/300?random=workout3', url: '' }
        ],
        sleep: [
            { title: 'Peaceful Dreams', artist: 'Sleep Sounds', cover: 'https://picsum.photos/300/300?random=sleep1', url: '' },
            { title: 'Night Meditation', artist: 'Calm Music', cover: 'https://picsum.photos/300/300?random=sleep2', url: '' },
            { title: 'Restful Sleep', artist: 'Ambient Sleep', cover: 'https://picsum.photos/300/300?random=sleep3', url: '' }
        ],
        party: [
            { title: 'Party Starter', artist: 'DJ Mix', cover: 'https://picsum.photos/300/300?random=party1', url: '' },
            { title: 'Dance Floor', artist: 'Club Hits', cover: 'https://picsum.photos/300/300?random=party2', url: '' },
            { title: 'Night Vibes', artist: 'Party Anthems', cover: 'https://picsum.photos/300/300?random=party3', url: '' }
        ]
    };
    
    // 播放器状态
    let currentPlaylist = [];
    let currentIndex = 0;
    let isPlaying = false;
    let currentAudio = null;
    
    // 更新播放器显示
    function updatePlayerDisplay() {
        if (currentPlaylist.length > 0 && currentIndex < currentPlaylist.length) {
            const currentSong = currentPlaylist[currentIndex];
            playerCoverImg.src = currentSong.cover;
            playerTitle.textContent = currentSong.title;
            playerArtist.textContent = currentSong.artist;
        }
    }
    
    // 唤醒播放器
    function activatePlayer() {
        miniPlayer.classList.add('active');
    }
    
    // 清理音频对象和事件监听器
    function cleanupAudio() {
        if (currentAudio) {
            // 移除所有事件监听器
            currentAudio.removeEventListener('play', handleAudioPlay);
            currentAudio.removeEventListener('pause', handleAudioPause);
            currentAudio.removeEventListener('ended', handleAudioEnded);
            currentAudio.removeEventListener('error', handleAudioError);
            
            // 停止播放
            currentAudio.pause();
            currentAudio.src = '';
            currentAudio = null;
        }
    }
    
    // 音频播放事件处理
    function handleAudioPlay() {
        isPlaying = true;
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="ri-pause-fill"></i>';
        }
        if (miniPlayer) {
            miniPlayer.classList.add('playing');
        }
    }
    
    // 音频暂停事件处理
    function handleAudioPause() {
        isPlaying = false;
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="ri-play-fill"></i>';
        }
        if (miniPlayer) {
            miniPlayer.classList.remove('playing');
        }
    }
    
    // 音频播放结束事件处理
    function handleAudioEnded() {
        playNext();
    }
    
    // 音频错误事件处理
    function handleAudioError(e) {
        console.error('音频加载失败:', currentPlaylist[currentIndex]?.url, e);
        // 尝试播放下一首
        playNext();
    }
    
    // 加载并播放音频
    function loadAndPlayAudio() {
        if (currentPlaylist.length === 0 || currentIndex >= currentPlaylist.length) return;
        
        const currentSong = currentPlaylist[currentIndex];
        if (!currentSong.url) {
            console.warn('歌曲URL不存在:', currentSong.title);
            return;
        }
        
        // 清理旧的音频对象
        cleanupAudio();
        
        // 创建新的音频对象
        currentAudio = new Audio(currentSong.url);
        
        // 添加事件监听器
        currentAudio.addEventListener('play', handleAudioPlay);
        currentAudio.addEventListener('pause', handleAudioPause);
        currentAudio.addEventListener('ended', handleAudioEnded);
        currentAudio.addEventListener('error', handleAudioError);
        
        // 开始播放
        currentAudio.play().catch(function(error) {
            console.error('播放失败:', error);
        });
    }
    
    // 播放/暂停
    function togglePlayPause() {
        if (currentPlaylist.length === 0) return;
        
        if (!currentAudio && currentPlaylist[currentIndex].url) {
            // 如果还没有加载音频，先加载
            loadAndPlayAudio();
        } else if (currentAudio) {
            // 切换播放/暂停
            if (isPlaying) {
                currentAudio.pause();
            } else {
                currentAudio.play().catch(function(error) {
                    console.error('播放失败:', error);
                });
            }
        }
    }
    
    // 加载并播放播放列表（强制重置版本）
    function loadAndPlay(playlist) {
        if (!playlist || playlist.length === 0) {
            console.warn('播放列表为空');
            return;
        }
        
        // 步骤1: 强制停止当前播放
        if (currentAudio) {
            try {
                currentAudio.pause();
            } catch (e) {
                console.warn('停止播放时出错:', e);
            }
        }
        
        // 步骤2: 清理旧的音频对象和事件监听器
        cleanupAudio();
        
        // 步骤3: 更新状态变量
        currentPlaylist = [...playlist]; // 使用展开运算符创建新数组，避免引用问题
        currentIndex = 0; // 关键：重置索引为0
        isPlaying = false; // 先设为false，播放时由事件监听器更新
        
        // 步骤4: 更新UI显示
        updatePlayerDisplay();
        activatePlayer();
        
        // 步骤5: 加载新资源并开始播放
        loadAndPlayAudio();
    }
    
    // 播放场景音乐
    function playScene(mood) {
        if (!sceneData[mood] || sceneData[mood].length === 0) return;
        
        loadAndPlay(sceneData[mood]);
    }
    
    // 上一首
    function playPrevious() {
        if (currentPlaylist.length === 0) return;
        currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        updatePlayerDisplay();
        if (isPlaying) {
            loadAndPlayAudio();
        }
    }
    
    // 下一首
    function playNext() {
        if (currentPlaylist.length === 0) return;
        currentIndex = (currentIndex + 1) % currentPlaylist.length;
        updatePlayerDisplay();
        if (isPlaying) {
            loadAndPlayAudio();
        }
    }
    
    // 绑定播放器控制按钮
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    if (prevBtnPlayer) {
        prevBtnPlayer.addEventListener('click', playPrevious);
    }
    if (nextBtnPlayer) {
        nextBtnPlayer.addEventListener('click', playNext);
    }
    
    // 场景卡片点击事件
    const playlistCards = document.querySelectorAll('.playlist-card[data-mood]');
    playlistCards.forEach(card => {
        card.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            playScene(mood);
        });
    });
    
    // ========== 热门推荐 ==========
    const recommendationsData = [
        { title: '2024年度热歌榜', cover: 'https://picsum.photos/300/300?random=1', plays: 4033 },
        { title: '华语流行精选', cover: 'https://picsum.photos/300/300?random=2', plays: 2856 },
        { title: '欧美流行金曲', cover: 'https://picsum.photos/300/300?random=3', plays: 3210 },
        { title: '日韩流行音乐', cover: 'https://picsum.photos/300/300?random=4', plays: 1987 },
        { title: '摇滚经典回顾', cover: 'https://picsum.photos/300/300?random=5', plays: 1523 },
        { title: '电子音乐节拍', cover: 'https://picsum.photos/300/300?random=6', plays: 2341 },
        { title: '民谣温暖时光', cover: 'https://picsum.photos/300/300?random=7', plays: 987 },
        { title: 'R&B节奏蓝调', cover: 'https://picsum.photos/300/300?random=8', plays: 1756 }
    ];
    
    // 渲染推荐卡片
    function renderRecommendations() {
        const grid = document.getElementById('recommendationsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        recommendationsData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            
            const playsText = item.plays >= 10000 
                ? `${(item.plays / 10000).toFixed(1)}万` 
                : item.plays.toString();
            
            card.innerHTML = `
                <div class="recommendation-cover">
                    <img src="${item.cover}" alt="${item.title}">
                    <div class="recommendation-stats">
                        <i class="ri-headphone-fill"></i>
                        <span>${playsText}</span>
                    </div>
                    <button class="recommendation-play-btn">
                        <i class="ri-play-circle-line"></i>
                    </button>
                </div>
                <div class="recommendation-title">${item.title}</div>
            `;
            
            // 为每个卡片添加点击事件，加载并播放测试播放列表
            card.addEventListener('click', function(e) {
                // 如果点击的是播放按钮，不触发卡片点击
                if (e.target.closest('.recommendation-play-btn')) {
                    return;
                }
                // 加载并播放测试播放列表
                loadAndPlay(demoPlaylist);
            });
            
            // 播放按钮点击事件
            const playBtn = card.querySelector('.recommendation-play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', function(e) {
                    e.stopPropagation(); // 阻止事件冒泡
                    loadAndPlay(demoPlaylist);
                });
            }
            
            grid.appendChild(card);
        });
    }
    
    // 初始化推荐列表
    renderRecommendations();
    
    // ========== 价格页面功能 ==========
    // 月付/年付切换功能
    const pricingToggle = document.getElementById('pricingToggle');
    const labelMonthly = document.getElementById('labelMonthly');
    const labelYearly = document.getElementById('labelYearly');
    const priceValues = document.querySelectorAll('.price-value');
    
    // 检查元素是否存在
    if (pricingToggle && labelMonthly && labelYearly && priceValues.length > 0) {
        // 更新价格显示函数
        function updatePricingDisplay() {
            const isYearly = pricingToggle.checked;
            
            // 更新标签状态
            if (isYearly) {
                labelMonthly.classList.remove('active');
                labelYearly.classList.add('active');
            } else {
                labelMonthly.classList.add('active');
                labelYearly.classList.remove('active');
            }
            
            // 更新所有价格数字
            priceValues.forEach((priceEl) => {
                const monthlyPrice = priceEl.getAttribute('data-monthly');
                const yearlyPrice = priceEl.getAttribute('data-yearly');
                
                // 验证数据属性是否存在
                if (monthlyPrice === null || yearlyPrice === null) {
                    console.warn('价格元素缺少data属性:', priceEl);
                    return;
                }
                
                const monthly = parseFloat(monthlyPrice);
                const yearly = parseFloat(yearlyPrice);
                
                // 验证是否为有效数字
                if (isNaN(monthly) || isNaN(yearly)) {
                    console.warn('价格数据无效:', { monthly, yearly });
                    return;
                }
                
                if (isYearly && yearly > 0) {
                    // 年付模式：显示年付价格（每月）
                    priceEl.textContent = yearly.toFixed(yearly % 1 === 0 ? 0 : 1);
                    
                    // 显示折合每月价格提示（仅在年付时显示）
                    const equivalentEl = priceEl.parentElement.querySelector('.yearly-equivalent');
                    if (equivalentEl) {
                        equivalentEl.textContent = `折合 ¥${yearly.toFixed(1)}/月`;
                        equivalentEl.style.display = 'block';
                    }
                } else {
                    // 月付模式：显示月付价格
                    priceEl.textContent = monthly.toFixed(monthly % 1 === 0 ? 0 : 1);
                    
                    // 隐藏折合价格提示
                    const equivalentEl = priceEl.parentElement.querySelector('.yearly-equivalent');
                    if (equivalentEl) {
                        equivalentEl.style.display = 'none';
                    }
                }
            });
        }
        
        // 监听checkbox变化
        pricingToggle.addEventListener('change', function() {
            updatePricingDisplay();
        });
        
        // 标签点击事件（切换checkbox状态）
        labelMonthly.addEventListener('click', function(e) {
            e.preventDefault();
            if (pricingToggle.checked) {
                pricingToggle.checked = false;
                updatePricingDisplay();
            }
        });
        
        labelYearly.addEventListener('click', function(e) {
            e.preventDefault();
            if (!pricingToggle.checked) {
                pricingToggle.checked = true;
                updatePricingDisplay();
            }
        });
        
        // 初始化显示（默认月付）
        pricingToggle.checked = false;
        updatePricingDisplay();
    } else {
        console.warn('价格切换功能初始化失败：缺少必要的DOM元素');
    }
    
    // FAQ 折叠功能
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                // 关闭其他所有FAQ项
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // 切换当前项
                item.classList.toggle('active');
            });
        }
    });
});


