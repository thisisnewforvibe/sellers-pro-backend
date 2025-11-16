// Lesson data
const lessonsData = {
    1: {
        title: "Dars 1",
        duration: "6:30",
        intro: "Uzum Market bilan tanishuv. Bu darsda biz Uzum Market platformasi haqida umumiy ma'lumot olamiz va asosiy funksiyalarni o'rganamiz.",
        videoId: "ZvibDUZIwjA",
        summary: "Ushbu kirish darsida biz Uzum Market platformasi bilan tanishamiz. Siz platformaning asosiy imkoniyatlari, sotuvchilar uchun mavjud bo'lgan vositalar va muvaffaqiyatli savdo qilish uchun zarur bo'lgan asosiy tushunchalar bilan tanishasiz. Keling, Uzum Market dunyosiga birgalikda kirib, muvaffaqiyatli savdo yo'lini boshlaymiz!",
        resources: [
            { name: "Uzum Market Rasmiy Sayti", url: "https://uzum.uz" },
            { name: "Sotuvchilar Uchun Qo'llanma", url: "#" }
        ],
        downloads: [
            { name: "Kirish Darsi Prezentatsiya.pdf", url: "#" },
            { name: "Kontrolli Ro'yxat.xlsx", url: "#" }
        ]
    },
    2: {
        title: "Dars 2",
        duration: "4:40",
        intro: "Hisob ochish va sozlash. Bu darsda sotuvchi hisobini qanday yaratish va to'g'ri sozlashni o'rganamiz.",
        videoId: "2_mHB2GOJb4",
        summary: "Ikkinchi darsda biz Uzum Market'da sotuvchi hisobini qanday ochish va uni to'g'ri sozlashni batafsil ko'rib chiqamiz. Profilingizni to'ldirish, bank ma'lumotlarini qo'shish, yetkazib berish sozlamalarini o'rnatish va boshqa muhim sozlamalarni amalga oshirishni o'rganasiz.",
        resources: [
            { name: "Hisob Ochish Yo'riqnomasi", url: "#" },
            { name: "Bank Integratsiya Qo'llanmasi", url: "#" }
        ],
        downloads: [
            { name: "Hisob Sozlamalari Shablon.pdf", url: "#" }
        ]
    },
    3: {
        title: "Dars 3",
        duration: "8:20",
        intro: "Mahsulot qo'shish asoslari. Bu darsda platformaga mahsulot qo'shishning asosiy qoidalari va eng yaxshi amaliyotlarini o'rganamiz.",
        videoId: "EpTZmupQIGE",
        summary: "Uchinchi darsda mahsulot qo'shish jarayonini batafsil o'rganamiz. To'g'ri kategoriyani tanlash, mahsulot tavsifini yozish, rasmlar yuklash, narx belgilash va boshqa muhim jihatlarni ko'rib chiqamiz. Sifatli mahsulot kartochkasi yaratish ko'nikmalarini egallaysiz.",
        resources: [
            { name: "Mahsulot Qo'shish Video Qo'llanma", url: "#" },
            { name: "SEO Optimallashtirish Maslahatlari", url: "#" }
        ],
        downloads: [
            { name: "Mahsulot Tavsifi Shablonlari.docx", url: "#" },
            { name: "Rasm Talablari.pdf", url: "#" }
        ]
    },
    4: {
        title: "Dars 4",
        duration: "7:23",
        intro: "Kategoriyalar va xususiyatlar. Bu darsda mahsulot kategoriyalarini to'g'ri tanlash va xususiyatlarni sozlashni o'rganamiz.",
        videoId: "cmA0MrTpkQ8",
        summary: "To'rtinchi darsda Uzum Market'dagi kategoriya tizimini chuqur o'rganamiz. To'g'ri kategoriyani tanlash, mahsulot xususiyatlarini to'g'ri belgilash va qidiruv tizimida yuqori o'rinlarda ko'rinish uchun optimallashtirishni o'rganasiz.",
        resources: [
            { name: "Kategoriyalar Ro'yxati", url: "#" },
            { name: "Xususiyatlar Bo'yicha Qo'llanma", url: "#" }
        ],
        downloads: [
            { name: "Kategoriya Tanlash Yo'riqnomasi.pdf", url: "#" }
        ]
    },
    5: {
        title: "Dars 5",
        duration: "5:15",
        intro: "Narx strategiyalari. Bu darsda raqobatbardosh narxlarni qanday belgilash va narx strategiyalarini boshqarishni o'rganamiz.",
        videoId: "BEwS33XIduA",
        summary: "Beshinchi darsda narx belgilash strategiyalarini o'rganamiz. Raqobatchilar tahlili, chegirmalar va aksiyalar yaratish, dinamik narxlash va foyda marjasini hisoblash kabi muhim mavzularni ko'rib chiqamiz.",
        resources: [
            { name: "Narx Strategiyalari Qo'llanmasi", url: "#" },
            { name: "Foyda Kalkulyatori", url: "#" }
        ],
        downloads: [
            { name: "Narxlarni Hisoblash Jadval.xlsx", url: "#" },
            { name: "Chegirmalar Strategiyasi.pdf", url: "#" }
        ]
    },
    6: {
        title: "Dars 6",
        duration: "6:45",
        intro: "Mahsulot rasmlari va videolar. Bu darsda sifatli rasm va videolar yaratish, ularni optimallashtirish va yuklashni o'rganamiz.",
        videoId: "XVJluq9c1lA",
        summary: "Oltinchi darsda mahsulot rasmlari va videolarining ahamiyati haqida gaplashamiz. Professional ko'rinishdagi rasm va videolar yaratish, ularni tahrirlash va platformaga yuklash qoidalarini o'rganasiz. Sifatli vizual kontent savdoni qanday oshirishini ko'rasiz.",
        resources: [
            { name: "Rasm Tahrirlash Dasturlari", url: "#" },
            { name: "Video Yaratish Qo'llanmasi", url: "#" }
        ],
        downloads: [
            { name: "Rasm Talablari va Standartlar.pdf", url: "#" },
            { name: "Video Formatlari Qo'llanmasi.pdf", url: "#" }
        ]
    },
    7: {
        title: "Dars 7",
        duration: "8:10",
        intro: "Marketing va reklama. Bu darsda Uzum Market'da marketing strategiyalari va reklama vositalaridan foydalanishni o'rganamiz.",
        videoId: "0wLGYqgm-Tw",
        summary: "Yettinchi darsda marketing va reklama vositalarini o'rganamiz. Uzum Market ichidagi reklama platformasi, SEO optimallashtiruvi, tashqi marketing kanallari va mijozlarni jalb qilish strategiyalarini ko'rib chiqamiz.",
        resources: [
            { name: "Marketing Strategiyalari", url: "#" },
            { name: "Reklama Qo'llanmasi", url: "#" }
        ],
        downloads: [
            { name: "Marketing Reja Shabloni.pdf", url: "#" },
            { name: "Reklama Byudjeti Kalkulyatori.xlsx", url: "#" }
        ]
    },
    8: {
        title: "Dars 8",
        duration: "5:50",
        intro: "Buyurtmalarni boshqarish. Bu darsda buyurtmalarni qabul qilish, qayta ishlash va yetkazib berishni tashkil qilishni o'rganamiz.",
        videoId: "S0Wqoo40XsQ",
        summary: "Sakkizinchi darsda buyurtmalarni samarali boshqarishni o'rganamiz. Buyurtmalarni qabul qilish jarayoni, mahsulotlarni tayyorlash, yetkazib berish tizimini sozlash va mijozlar bilan muloqot qilish ko'nikmalarini egallaysiz.",
        resources: [
            { name: "Buyurtmalar Tizimi Qo'llanmasi", url: "#" },
            { name: "Yetkazib Berish Shartnomalari", url: "#" }
        ],
        downloads: [
            { name: "Buyurtmalarni Boshqarish Jadval.xlsx", url: "#" },
            { name: "Logistika Bo'yicha Qo'llanma.pdf", url: "#" }
        ]
    },
    9: {
        title: "Dars 9",
        duration: "7:30",
        intro: "Mijozlar bilan ishlash. Bu darsda mijozlar bilan samarali muloqot qilish, shikoyatlarni hal qilish va sodiqlikni oshirishni o'rganamiz.",
        videoId: "9Wgs-T7P4CA",
        summary: "To'qqizinchi darsda mijozlar xizmati va munosabatlarni boshqarishni o'rganamiz. Mijozlar bilan professional muloqot, muammolarni tez hal qilish, sharh va baholarga javob berish, mijozlar sodiqligini oshirish strategiyalarini ko'rib chiqamiz.",
        resources: [
            { name: "Mijozlar Xizmati Qo'llanmasi", url: "#" },
            { name: "Shikoyatlarni Hal Qilish", url: "#" }
        ],
        downloads: [
            { name: "Mijozlar bilan Ishlash Shablonlari.pdf", url: "#" },
            { name: "FAQ Shabloni.docx", url: "#" }
        ]
    },
    10: {
        title: "Dars 10",
        duration: "9:15",
        intro: "Analitika va optimallashtiruv. Bu darsda savdo statistikasini tahlil qilish va biznesingizni rivojlantirishni o'rganamiz.",
        videoId: "kCjxWIrfPKs",
        summary: "O'ninchi darsda analitika vositalari va optimallashtiruv texnikalarini o'rganamiz. Savdo ko'rsatkichlarini kuzatish, hisobotlarni tahlil qilish, zaif va kuchli tomonlarni aniqlash, biznes jarayonlarini yaxshilash strategiyalarini ko'rib chiqamiz.",
        resources: [
            { name: "Analitika Paneli Qo'llanmasi", url: "#" },
            { name: "KPI Ko'rsatkichlari", url: "#" }
        ],
        downloads: [
            { name: "Tahlil Shablonlari.xlsx", url: "#" },
            { name: "Optimallashtiruv Yo'riqnomasi.pdf", url: "#" }
        ]
    }
};

// Get lesson ID from URL
function getLessonId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

// Load lesson data
function loadLessonData() {
    const lessonId = getLessonId();
    const lesson = lessonsData[lessonId];
    
    if (!lesson) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Update lesson title
    document.querySelector('.lesson-title').textContent = lesson.title;
    document.title = `${lesson.title} - Sellers Pro`;
    
    // Update intro
    document.querySelector('.lesson-intro').textContent = lesson.intro;
    
    // Update video
    const iframe = document.querySelector('.video-player iframe');
    iframe.src = `https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1`;
    iframe.title = lesson.title;
    
    // Update summary
    document.querySelector('.section-text').textContent = lesson.summary;
    
    // Update resources
    const resourcesList = document.querySelectorAll('.resources-list')[0];
    resourcesList.innerHTML = lesson.resources.map(resource => `
        <a href="${resource.url}" class="resource-item" target="_blank">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10 13C10.4295 13.5741 10.9774 14.0492 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9404 15.7513 14.6897C16.4231 14.4391 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59699 21.9548 8.33398 21.9434 7.02301C21.932 5.71204 21.4061 4.45797 20.4791 3.53097C19.5521 2.60396 18.298 2.07806 16.987 2.06667C15.676 2.05528 14.413 2.55926 13.47 3.47L11.75 5.18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60707C11.7642 9.26331 11.0685 9.05889 10.3533 9.00768C9.63819 8.95646 8.92037 9.05965 8.24861 9.31028C7.57685 9.5609 6.96684 9.95302 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05657 16.977C2.06796 18.288 2.59386 19.542 3.52086 20.469C4.44787 21.396 5.70194 21.9219 7.01291 21.9333C8.32387 21.9447 9.58688 21.4407 10.53 20.53L12.24 18.82" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>${resource.name}</span>
        </a>
    `).join('');
    
    // Update downloads
    const downloadsList = document.querySelectorAll('.resources-list')[1];
    downloadsList.innerHTML = lesson.downloads.map(file => `
        <a href="${file.url}" class="resource-item download-item" download>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 18V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 15L12 18L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>${file.name}</span>
        </a>
    `).join('');
}

// Load lesson data when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('lesson.html') || window.location.search.includes('id=')) {
        loadLessonData();
        setupAutoCompletion();
        updateCompletionStatus();
    }
});

// Setup automatic completion tracking
function setupAutoCompletion() {
    const lessonId = getLessonId();
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    
    // If already completed, just show the badge
    if (completedLessons.includes(lessonId)) {
        return;
    }
    
    // Track watch time for auto-completion
    let watchTime = 0;
    let isPageVisible = !document.hidden;
    let hasStartedWatching = false;
    
    // Track page visibility
    document.addEventListener('visibilitychange', function() {
        isPageVisible = !document.hidden;
    });
    
    // Start tracking after a short delay (to ensure iframe loaded)
    setTimeout(function() {
        hasStartedWatching = true;
        
        const watchInterval = setInterval(function() {
            if (isPageVisible && hasStartedWatching) {
                watchTime++;
                
                // Get lesson duration from lessonsData
                const lessonData = lessonsData[lessonId];
                let requiredWatchTime = 180; // Default 3 minutes
                
                // Try to parse duration from lesson data if available
                // Format is typically "6:30" meaning 6 minutes 30 seconds
                if (lessonData && lessonData.duration) {
                    const parts = lessonData.duration.split(':');
                    if (parts.length === 2) {
                        requiredWatchTime = (parseInt(parts[0]) * 60 + parseInt(parts[1])) * 0.8; // 80% of video
                    }
                }
                
                // Auto-complete after watching for required time
                if (watchTime >= requiredWatchTime) {
                    clearInterval(watchInterval);
                    markLessonComplete();
                }
            }
        }, 1000);
        
        // Clean up on page unload
        window.addEventListener('beforeunload', function() {
            clearInterval(watchInterval);
        });
    }, 2000);
}

// Mark lesson as complete automatically
function markLessonComplete() {
    const lessonId = getLessonId();
    
    // Get existing completed lessons
    let completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    
    // Add current lesson if not already completed
    if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
        
        // Update completion status
        updateCompletionStatus();
        
        // Show success message
        showCompletionMessage();
    }
}

// Update completion status display
function updateCompletionStatus() {
    const lessonId = getLessonId();
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    const statusElement = document.getElementById('completionStatus');
    
    if (statusElement && completedLessons.includes(lessonId)) {
        statusElement.innerHTML = `
            <div class="completion-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Dars tugallangan</span>
            </div>
        `;
        statusElement.style.display = 'flex';
    }
}

// Show completion message
function showCompletionMessage() {
    // Create a success notification
    const notification = document.createElement('div');
    notification.className = 'completion-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>🎉 Tabriklaymiz! Dars tugallandi</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(function() {
        notification.style.opacity = '0';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
}
