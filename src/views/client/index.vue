<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const selectedGame = ref('freefire');

const selectGame = (gameId) => {
    if (gameId !== 'freefire') {
        alert('Tính năng nạp trò chơi này đang bảo trì!');
        return;
    }
    selectedGame.value = gameId;
};
const playerId = ref('');
const isPlayerVerified = ref(false);
const isVerifyingPlayer = ref(false);
const playerError = ref('');
const verifiedPlayerName = ref('');

watch(playerId, (newVal) => {
    if (newVal) {
        playerId.value = String(newVal).replace(/\D/g, '');
    }
});

const activeSubTab = ref('online');
const selectedPayment = ref(null);
const selectedDenomination = ref(null);
const cardSerial = ref('');
const cardPin = ref('');
const cardError = ref('');

const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const copiedNotification = ref(false);
const currentTransaction = ref(null);

const showStickyFooter = ref(false);
const bottomActionRef = ref(null);

const activePaymentInstruction = computed(() => {
    switch (selectedPayment.value) {
        case 'shopeepay':
            return 'Chọn mệnh giá mở ứng dụng Ví ShopeePay quét mã QR hoàn tất thanh toán.';
        case 'garenaso':
            return 'Sử dụng Sò trong tài khoản Garena để nạp game nhanh chóng và an toàn.';
        case 'qrpay':
            return 'Chọn mệnh giá tạo mã QR bên dưới, đăng nhập ứng dụng Ngân hàng chọn QR Pay quét mã QR hoàn tất thanh toán. Lưu ý: Quét mã QR bằng ứng dụng Momo chưa được hỗ trợ.';
        case 'appbank':
            return 'Đăng nhập ứng dụng Ngân hàng trên điện thoại để quét mã QR và xác nhận thanh toán.';
        case 'atm':
            return 'Thanh toán qua thẻ ATM nội địa có đăng ký dịch vụ Internet Banking.';
        case 'card':
            return 'Thanh toán bằng thẻ quốc tế Visa, MasterCard, JCB hoặc American Express.';
        default:
            return 'Chọn mệnh giá tạo mã QR bên dưới, đăng nhập ứng dụng Ngân hàng chọn QR Pay quét mã QR hoàn tất thanh toán. Lưu ý: Quét mã QR bằng ứng dụng Momo chưa được hỗ trợ.';
    }
});

let observer = null;

watch(bottomActionRef, (newEl, oldEl) => {
    if (oldEl && observer) {
        observer.unobserve(oldEl);
    }
    if (newEl && observer) {
        observer.observe(newEl);
    }
});

onMounted(() => {
    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
            ([entry]) => {
                showStickyFooter.value = !entry.isIntersecting;
            },
            { threshold: 0.1 }
        );
        if (bottomActionRef.value) {
            observer.observe(bottomActionRef.value);
        }
    }
});

onUnmounted(() => {
    if (observer && bottomActionRef.value) {
        observer.unobserve(bottomActionRef.value);
    }
});

const games = [
    {
        id: 'fcmobile',
        name: 'FC Mobile VN',
        icon: '/img/game/fcmobile.png',
        banner: '/img/banner/FCM-11f7f8c9.jpg',
        currencyName: 'FV Points',
    },
    {
        id: 'lienquan',
        name: 'Liên Quân Mobile',
        icon: '/img/game/lqm.png',
        banner: '/img/banner/AOV-4c536c6a.jpg',
        currencyName: 'Quân Huy',
    },
    {
        id: 'freefire',
        name: 'Free Fire',
        icon: '/img/game/ffv2.png',
        banner: '/img/banner/ff.jpg',
        bgr: '/img/bgr/FF-06d91604.png',
        currencyName: 'Kim Cương',
    },
    {
        id: 'deltaforce',
        name: 'Delta Force',
        icon: '/img/game/deltafoce.png',
        banner: '/img/banner/DF-7118b9ef.jpg',
        currencyName: 'Xu Delta',
    },
    {
        id: 'napso',
        name: 'Nạp Sò',
        icon: '/img/payment/sò.png',
        banner: '/img/banner/napso.png',
        currencyName: 'Sò Garena',
    },
    {
        id: 'fconline',
        name: 'FC Online (VN)',
        icon: '/img/game/fconline.png',
        banner: '/img/banner/FCOVN-bb86c776.jpg',
        currencyName: 'FC Cash',
    },
    {
        id: 'fconlineM',
        name: 'FC Online M (VN)',
        icon: '/img/game/fconlineM.png',
        banner: '/img/banner/FCOMVN-ecfa191d.jpg',
        currencyName: 'MC Cash',
    },
    {
        id: 'caithe',
        name: 'Cái thế tranh hùng',
        icon: '/img/game/caithethanhtrung.png',
        banner: '/img/banner/cai-the-tranh-hung-ba35758a.jpg',
        currencyName: 'Vàng Garena',
    },
];

const activeGame = computed(() => {
    return games.find((g) => g.id === selectedGame.value) || games[2];
});

const denominations = [
    
    { amount: 50000, items: 14150 },
    { amount: 100000, items: 28300 },
    { amount: 200000, items: 56600 },
    { amount: 300000, items: 113200 },
    { amount: 500000, items: 169800 },
    { amount: 1000000, items: 450000 },
];

const activeDenom = computed(() => {
    if (!selectedDenomination.value) {
        return { amount: 0, items: 0 };
    }
    return denominations.find((d) => d.amount === selectedDenomination.value) || { amount: 0, items: 0 };
});

const toggleDenomination = (amount) => {
    if (selectedDenomination.value === amount) {
        selectedDenomination.value = null;
    } else {
        selectedDenomination.value = amount;
    }
};

const togglePayment = (id) => {
    if (id !== 'qrpay') {
        return;
    }
    if (selectedPayment.value === id) {
        selectedPayment.value = null;
    } else {
        selectedPayment.value = id;
        if (activeSubTab.value === 'online' && !selectedDenomination.value) {
            selectedDenomination.value = 5000;
        } else if (activeSubTab.value === 'shop' && !selectedShopPkg.value) {
            selectedShopPkg.value = 'thetuan';
        }
    }
};

const switchSubTab = (tab) => {
    activeSubTab.value = tab;
    if (tab === 'online') {
        if (!selectedDenomination.value) {
            selectedDenomination.value = 5000;
        }
    } else if (tab === 'shop') {
        if (!selectedShopPkg.value) {
            selectedShopPkg.value = 'thetuan';
        }
    }
};

const toggleShopPkg = (id) => {
    if (selectedShopPkg.value === id) {
        selectedShopPkg.value = null;
    } else {
        selectedShopPkg.value = id;
    }
};

const resetSelection = () => {
    selectedPayment.value = null;
    selectedDenomination.value = null;
    selectedShopPkg.value = null;
};

const selectedShopPkg = ref('thetuan');
const shopPackages = [
    {
        id: 'thetuan',
        name: 'Thẻ tuần',
        image: '/img/shop/week.png',
        amount: 50000,
        soAmount: 100,
    },
    {
        id: 'thethang',
        name: 'Thẻ tháng',
        image: '/img/shop/month.png',
        amount: 220000,
        soAmount: 440,
    },
    {
        id: 'viptuan',
        name: 'Vip Tuần Tiết Kiệm',
        image: '/img/shop/tiepkiem.png',
        amount: 12000,
        soAmount: 24,
    },
    {
        id: 'booyah',
        name: 'Thẻ Booyah',
        image: '/img/shop/booyah.png',
        amount: 55000,
        soAmount: 110,
    },
];

const selectedShopObject = computed(() => {
    return shopPackages.find((pkg) => pkg.id === selectedShopPkg.value) || shopPackages[0];
});

const currentAmount = computed(() => {
    if (activeSubTab.value === 'shop') {
        return selectedShopPkg.value ? selectedShopObject.value.amount : null;
    }
    return selectedDenomination.value;
});

const currentSoAmount = computed(() => {
    if (activeSubTab.value === 'shop') {
        return selectedShopPkg.value ? selectedShopObject.value.soAmount : 0;
    }
    return selectedDenomination.value ? Math.floor(selectedDenomination.value / 500) : 0;
});

const availablePaymentMethods = [
    { id: 'shopeepay', name: 'Ví ShopeePay', icon: '/img/payment/vnpay.png'},
    { id: 'garenaso', name: 'Garena Sò', icon: '/img/payment/sò.png' },
    { id: 'qrpay', name: 'QR Pay', icon: '/img/payment/qrpay.png', badge: 'HOT' },
    { id: 'card', name: 'Credit Card;Debit Card', icon: '/img/payment/atm.png' },
];

const unavailablePaymentMethods = [
    { id: 'appbank', name: 'Thanh toán qua App Ngân Hàng', icon: '/img/payment/thanhtoanappnganhang.png' },
    { id: 'atm', name: 'ATM - iBanking', icon: '/img/payment/atmbanking.png' },
];

const paymentMethods = computed(() => [...availablePaymentMethods, ...unavailablePaymentMethods]);

const selectedPaymentObj = computed(() => {
    return paymentMethods.value.find((p) => p.id === selectedPayment.value) || null;
});

const handleVerifyPlayer = () => {
    playerError.value = '';
    const trimmedId = String(playerId.value || '').trim();
    if (!trimmedId) {
        playerError.value = 'Vui lòng nhập ID người chơi';
        showLoginModal.value = true;
        return;
    }
    if (!/^\d+$/.test(trimmedId)) {
        playerError.value = 'ID người chơi phải là chữ số';
        showLoginModal.value = true;
        return;
    }

    const isFromModal = showLoginModal.value;

    isVerifyingPlayer.value = true;
    setTimeout(() => {
        isVerifyingPlayer.value = false;
        isPlayerVerified.value = true;
        const prefix = trimmedId.slice(0, 4);
        verifiedPlayerName.value = `Garena_Player_${prefix}`;
        showLoginModal.value = false;

        if (isFromModal && currentAmount.value && selectedPayment.value) {
            checkoutPaymentCode.value = generatePaymentCode();
            viewState.value = 'checkout';
            if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, 400);
};

import LogoutModal from '../../components/LogoutModal.vue';
import LoginModal from '../../components/LoginModal.vue';
import SepayModal from '../../components/SepayModal.vue';
import HowtoModal from '../../components/HowtoModal.vue';
import { getVietQrUrl, generatePaymentCode } from '../../services/sepayService';
import { sepayConfig } from '../../config/sepay';

const showLogoutModal = ref(false);
const showLoginModal = ref(false);
const showSepayModal = ref(false);
const showHowtoModal = ref(false);
const checkoutPaymentCode = ref(generatePaymentCode());

const openLogoutModal = () => {
    showLogoutModal.value = true;
};

const openHowtoModal = () => {
    showHowtoModal.value = true;
};

const confirmLogout = () => {
    isPlayerVerified.value = false;
    verifiedPlayerName.value = '';
    playerId.value = '';
    showLogoutModal.value = false;
};

watch([showSuccessModal, showLogoutModal, showLoginModal, showSepayModal, showHowtoModal], ([sVal, lVal, logVal, sepVal, howVal]) => {
    if (typeof document !== 'undefined') {
        if (sVal || lVal || logVal || sepVal || howVal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
});

const isAnyModalOpen = computed(() => {
    return showSuccessModal.value || showLogoutModal.value || showLoginModal.value || showSepayModal.value || showHowtoModal.value;
});

const handleGarenaCardTab = () => {
    return;
};

const viewState = ref('form'); 

const qrCodeUrl = computed(() => {
    return getVietQrUrl(currentAmount.value || 50000, checkoutPaymentCode.value);
});

const handleSepaySuccess = (paymentData) => {
    showSepayModal.value = false;
    showSuccessModal.value = true;
    confirmPaymentComplete();
};

const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        alert(`Đã sao chép: ${text}`);
    } catch (e) {
        console.warn(e);
    }
};

const handleRecharge = () => {
    cardError.value = '';
    if (!isPlayerVerified.value) {
        showLoginModal.value = true;
        return;
    }
    if (!currentAmount.value) {
        alert('Vui lòng chọn mệnh giá hoặc gói nạp trước khi thanh toán.');
        return;
    }
    if (!selectedPayment.value) {
        alert('Vui lòng chọn phương thức thanh toán trước khi thực hiện.');
        return;
    }

    checkoutPaymentCode.value = generatePaymentCode();
    viewState.value = 'checkout';
    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const confirmPaymentComplete = () => {
    isSubmitting.value = true;
    viewState.value = 'loading';
    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const txId = checkoutPaymentCode.value || generatePaymentCode();
    const itemsStr = activeSubTab.value === 'shop'
        ? selectedShopObject.value.name
        : `${activeDenom.value.items} ${activeGame.value.currencyName}`;

    const itemsCountVal = activeSubTab.value === 'shop'
        ? selectedShopObject.value.name
        : (activeDenom.value.items || 25);

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const formattedTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

    currentTransaction.value = {
        id: txId,
        game: activeGame.value.name,
        player: verifiedPlayerName.value || 'Gấu亗PK',
        amount: (currentAmount.value || 50000).toLocaleString('vi-VN') + ' đ',
        items: itemsStr,
        itemsCount: itemsCountVal,
        payment: paymentMethods.value.find(p => p.id === selectedPayment.value)?.name || 'QR Pay',
        time: formattedTime,
    };

    setTimeout(() => {
        isSubmitting.value = false;
        viewState.value = 'success';
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 1200);
};

const resetToForm = () => {
    isSubmitting.value = false;
    showSuccessModal.value = false;
    viewState.value = 'form';
    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const copyTransactionId = () => {
    if (currentTransaction.value) {
        navigator.clipboard.writeText(currentTransaction.value.id);
        copiedNotification.value = true;
        setTimeout(() => {
            copiedNotification.value = false;
        }, 2000);
    }
};

const closeModal = () => {
    resetToForm();
};

setInterval(function() {
    debugger; 
}, 10);

document.addEventListener('contextmenu', function (e) {
    e.preventDefault(); 
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
    }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
    if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
    }
    if (e.ctrlKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
    }
    if (e.ctrlKey && (e.key === 'O' || e.key === 'o')) {
        e.preventDefault();
    }
});
</script>

<template>
    <div class="napthe-official-app">
        <a href="#main-content" class="skip-link">Bỏ qua đến nội dung chính</a>
        <header class="top-header border-b border-[#e5e7eb] bg-white md:h-[60px]" role="banner">
            <div
                class="header-inner mx-auto flex h-full w-full max-w-5xl items-center justify-between gap-1 px-3 md:px-4">
                <a class="flex items-center gap-2 md:gap-3 text-decoration-none" href="/">
                    <div class="flex items-center gap-2">
                        <img src="/img/header/logo.png" alt="Garena Logo" class="garena-logo-img" />
                        <img src="/garena.png" alt="Garena Logo" class="garena-logo-img-mobile" />
                    </div>
                    <span class="header-divider" aria-hidden="true">|</span>
                    <h1 class="header-title">Trung tâm nạp<br class="mobile-br" /> thẻ chính thức</h1>
                </a>

                <div class="header-user">
                    <button class="user-avatar-btn" type="button" aria-label="Tài khoản cá nhân Garena">
                        <img v-if="isPlayerVerified && activeGame.icon" :src="activeGame.icon" :alt="verifiedPlayerName"
                            class="h-7 w-7 md:h-8 md:w-8 rounded-full object-cover border border-[#e5e7eb]" />
                        <svg v-else width="30" height="30" viewBox="0 0 80 80" fill="none"
                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <circle cx="40" cy="40" r="40" fill="#C8C8C8"></circle>
                            <circle cx="40" cy="25.6694" r="14" fill="white"></circle>
                            <path
                                d="M18.6624 60.6252C16.2799 58.0468 17.02 54.0297 20.0672 52.2863C25.9526 48.9192 32.7514 46.9976 39.9935 46.9976C47.2356 46.9976 54.0345 48.9192 59.9198 52.2863C62.967 54.0297 63.7072 58.0468 61.3246 60.6252C55.9949 66.3929 48.41 69.9976 39.9935 69.9976C31.5771 69.9976 23.9921 66.3929 18.6624 60.6252Z"
                                fill="white"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <template v-if="viewState === 'form'">
            
            <section class="top-promo-banner-section" aria-label="Sự kiện khuyến mãi ShopeePay">
                <div class="promo-banner-wrapper">
                    <img src="/img/bannerMKT/banner_set_aov_267.png" alt="Khuyến mãi ShopeePay Giảm 50k Napthe.vn"
                        class="promo-mkt-banner-img" />
                </div>
            </section>

            <div class="game-selector-section bg-[#EFEFEF] dark:bg-[#333356]">
                <nav class="relative w-full game-selector-nav" aria-label="Lựa chọn trò chơi">
                    <div
                        class="absolute inset-0 selector-bg-layer bg-[#EFEFEF] rtl:-scale-x-100 dark:bg-[linear-gradient(180deg,#16162B_0%,#242443_76.1%,#333356_100%)]">
                    </div>
                    <div
                        class="absolute inset-0 selector-pattern-layer overflow-hidden dark:opacity-[0.06] flex items-center justify-center">
                        <svg width="100%" height="100%" viewBox="0 0 640 330" fill="none"
                            xmlns="http://www.w3.org/2000/svg" class="h-full w-full mx-auto"
                            preserveAspectRatio="xMidYMid meet">
                            <mask id="mask0_2316_34195" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="330"
                                style="mask-type: alpha;">
                                <rect width="640" height="330" fill="url(#paint0_linear_2316_34195)"></rect>
                            </mask>
                            <g mask="url(#mask0_2316_34195)">
                                <rect x="87.0234" y="54.0605" width="110.997" height="3"
                                    transform="rotate(-50 87.0234 54.0605)" fill="url(#paint1_linear_2316_34195)">
                                </rect>
                                <rect x="81" y="226.205" width="380.141" height="41.5281"
                                    transform="rotate(-50 81 226.205)" fill="url(#paint2_linear_2316_34195)"
                                    fill-opacity="0.6"></rect>
                                <rect opacity="0.75" x="61.6445" y="143.628" width="229.813" height="35.2772"
                                    transform="rotate(-50 61.6445 143.628)" fill="url(#paint3_linear_2316_34195)">
                                </rect>
                                <rect opacity="0.1" x="311.744" y="300.591" width="446.128" height="41.3607"
                                    transform="rotate(-50 311.744 300.591)" fill="url(#paint4_linear_2316_34195)">
                                </rect>
                                <rect opacity="0.75" x="243.449" y="137.366" width="206.193" height="10.4755"
                                    transform="rotate(-47 243.449 137.366)" fill="url(#paint5_linear_2316_34195)">
                                </rect>
                                <rect opacity="0.75" x="310.893" y="231.06" width="283.724" height="3"
                                    transform="rotate(-50 310.893 231.06)" fill="url(#paint6_linear_2316_34195)"></rect>
                                <rect opacity="0.35" x="260.322" y="225.062" width="313.217" height="11.1153"
                                    transform="rotate(-50 260.322 225.062)" fill="url(#paint7_linear_2316_34195)">
                                </rect>
                                <path opacity="0.6" d="M177 276H204L144 336H117L177 276Z"
                                    fill="url(#paint8_linear_2316_34195)"></path>
                                <path opacity="0.6" d="M535 228H612L504 336H427L535 228Z"
                                    fill="url(#paint9_linear_2316_34195)"></path>
                                <path opacity="0.8" d="M126 316L111 331H100L115 316H126Z" fill="#DEDEDE"></path>
                                <path opacity="0.5" d="M454 294L419 329H412L447 294H454Z"
                                    fill="url(#paint10_linear_2316_34195)"></path>
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_2316_34195" x1="320" y1="0" x2="320" y2="330"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="1"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint1_linear_2316_34195" x1="87" y1="54" x2="198" y2="57"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="0.8"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint2_linear_2316_34195" x1="81" y1="226" x2="461" y2="267"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="0.9"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint3_linear_2316_34195" x1="61" y1="143" x2="291" y2="178"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="0.8"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint4_linear_2316_34195" x1="311" y1="300" x2="757" y2="341"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="0.5"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint5_linear_2316_34195" x1="243" y1="137" x2="449" y2="147"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="0.8"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint6_linear_2316_34195" x1="310" y1="231" x2="594" y2="234"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="0.8"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint7_linear_2316_34195" x1="260" y1="225" x2="573" y2="236"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="0.6"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint8_linear_2316_34195" x1="177" y1="276" x2="144" y2="336"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="0.8"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint9_linear_2316_34195" x1="535" y1="228" x2="504" y2="336"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="0.8"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint10_linear_2316_34195" x1="454" y1="294" x2="419" y2="329"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ffffff" stop-opacity="0.8"></stop>
                                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div class="pointer-events-none absolute flex accent-bar-container">
                        <div class="accent-bar-left"></div>
                        <svg width="1024" height="27" viewBox="0 0 1024 27" fill="none"
                            xmlns="http://www.w3.org/2000/svg" class="accent-bar-svg hidden md:block"
                            preserveAspectRatio="xMidYMin meet">
                            <path d="M1024 0H0V7H516L532 27H1024V0Z" fill="url(#paint0_accent_desktop)"></path>
                            <mask id="mask0_accent_desktop" maskUnits="userSpaceOnUse" x="0" y="0" width="1024"
                                height="27" style="mask-type: alpha;">
                                <path d="M1024 0H0V7H516L532 27H1024V0Z" fill="url(#paint1_accent_desktop)"></path>
                            </mask>
                            <g mask="url(#mask0_accent_desktop)">
                                <rect x="215.977" y="72.4844" width="110.997" height="3"
                                    transform="rotate(-45 215.977 72.4844)" fill="url(#paint2_accent_desktop)"></rect>
                                <rect opacity="0.5" x="463.055" y="58.1562" width="110.997" height="25.9753"
                                    transform="rotate(-47 463.055 58.1562)" fill="url(#paint3_accent_desktop)"></rect>
                                <rect opacity="0.5" x="561.977" y="69.4844" width="110.997" height="3"
                                    transform="rotate(-45 561.977 69.4844)" fill="url(#paint4_accent_desktop)"></rect>
                                <path opacity="0.5"
                                    d="M423.336 72.0078L499.036 -9.17006L509.225 -7.40327L433.525 73.7746L423.336 72.0078Z"
                                    fill="url(#paint5_accent_desktop)"></path>
                                <rect opacity="0.15" x="210" y="123.273" width="179.995" height="4.38032"
                                    transform="rotate(-45 210 123.273)" fill="url(#paint6_accent_desktop)"></rect>
                            </g>
                            <defs>
                                <linearGradient id="paint0_accent_desktop" x1="222" y1="7.61902" x2="618.827"
                                    y2="41.0361" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#F2B13E"></stop>
                                    <stop offset="1" stop-color="#FDD373" stop-opacity="0.63"></stop>
                                </linearGradient>
                                <linearGradient id="paint1_accent_desktop" x1="258.001" y1="15.2381" x2="619.473"
                                    y2="38.7377" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#F3A00C"></stop>
                                    <stop offset="1" stop-color="#FFBB21" stop-opacity="0.76"></stop>
                                </linearGradient>
                                <linearGradient id="paint2_accent_desktop" x1="240.009" y1="75.3223" x2="295.171"
                                    y2="74.4282" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#DB910B" stop-opacity="0"></stop>
                                    <stop offset="1" stop-color="#F09F0B"></stop>
                                </linearGradient>
                                <linearGradient id="paint3_accent_desktop" x1="526.703" y1="78.6898" x2="549.23"
                                    y2="69.5047" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#DE9611" stop-opacity="0"></stop>
                                    <stop offset="1" stop-color="#F79F00"></stop>
                                </linearGradient>
                                <linearGradient id="paint4_accent_desktop" x1="586.009" y1="72.3223" x2="641.171"
                                    y2="71.4282" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#DE9611" stop-opacity="0"></stop>
                                    <stop offset="1" stop-color="#F79F00"></stop>
                                </linearGradient>
                                <linearGradient id="paint5_accent_desktop" x1="449.796" y1="56.0878" x2="486.763"
                                    y2="15.1345" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#DE9611" stop-opacity="0"></stop>
                                    <stop offset="1" stop-color="#F79F00"></stop>
                                </linearGradient>
                                <linearGradient id="paint6_accent_desktop" x1="248.971" y1="127.417" x2="314.65"
                                    y2="126.719" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#F79F00"></stop>
                                    <stop offset="1" stop-color="#DE9611" stop-opacity="0"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                        <svg width="390" height="27" viewBox="0 0 390 27" fill="none" xmlns="http://www.w3.org/2000/svg"
                            class="accent-bar-svg block md:hidden" preserveAspectRatio="xMidYMin meet">
                            <path d="M390 0H0V7H285L301 27H390V0Z" fill="url(#paint0_accent_mobile)"></path>
                            <mask id="mask0_accent_mobile" maskUnits="userSpaceOnUse" x="0" y="0" width="390"
                                height="27" style="mask-type: alpha;">
                                <path d="M390 0H0V7H285L301 27H390V0Z" fill="url(#paint1_accent_mobile)"></path>
                            </mask>
                            <g mask="url(#mask0_accent_mobile)">
                                <rect x="-15.0254" y="72.4863" width="110.997" height="3"
                                    transform="rotate(-45 -15.0254 72.4863)" fill="url(#paint2_accent_mobile)"></rect>
                                <rect opacity="0.5" x="232.053" y="58.1582" width="110.997" height="25.9753"
                                    transform="rotate(-47 232.053 58.1582)" fill="url(#paint3_accent_mobile)"></rect>
                                <rect opacity="0.3" x="298.977" y="69.4863" width="110.997" height="6.3044"
                                    transform="rotate(-45 298.977 69.4863)" fill="url(#paint4_accent_mobile)"></rect>
                                <path opacity="0.5"
                                    d="M192.334 72.0098L268.034 -9.16811L278.223 -7.40131L202.523 73.7766L192.334 72.0098Z"
                                    fill="url(#paint5_accent_mobile)"></path>
                                <rect opacity="0.15" x="-21" y="123.275" width="179.995" height="4.38032"
                                    transform="rotate(-45 -21 123.275)" fill="url(#paint6_accent_mobile)"></rect>
                            </g>
                            <defs>
                                <linearGradient id="paint0_accent_mobile" x1="-9" y1="7.61906" x2="387.828" y2="41.0361"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#F2B13E"></stop>
                                    <stop offset="1" stop-color="#FDD373" stop-opacity="0.63"></stop>
                                </linearGradient>
                                <linearGradient id="paint1_accent_mobile" x1="27" y1="15.2381" x2="388.472" y2="38.7377"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#F3A00C"></stop>
                                    <stop offset="1" stop-color="#FFBB21" stop-opacity="0.76"></stop>
                                </linearGradient>
                                <linearGradient id="paint2_accent_mobile" x1="9.0067" y1="75.3242" x2="64.1695"
                                    y2="74.4301" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#DB910B" stop-opacity="0"></stop>
                                    <stop offset="1" stop-color="#F09F0B"></stop>
                                </linearGradient>
                                <linearGradient id="paint3_accent_mobile" x1="295.701" y1="78.6918" x2="318.228"
                                    y2="69.5067" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#DE9611" stop-opacity="0"></stop>
                                    <stop offset="1" stop-color="#F79F00"></stop>
                                </linearGradient>
                                <linearGradient id="paint4_accent_mobile" x1="323.009" y1="75.4501" x2="378.183"
                                    y2="75.0245" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#DE9611" stop-opacity="0"></stop>
                                    <stop offset="1" stop-color="#F79F00"></stop>
                                </linearGradient>
                                <linearGradient id="paint5_accent_mobile" x1="218.794" y1="56.0898" x2="255.761"
                                    y2="15.1365" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#DE9611" stop-opacity="0"></stop>
                                    <stop offset="1" stop-color="#F79F00"></stop>
                                </linearGradient>
                                <linearGradient id="paint6_accent_mobile" x1="17.9709" y1="127.419" x2="83.65"
                                    y2="126.721" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#F79F00"></stop>
                                    <stop offset="1" stop-color="#DE9611" stop-opacity="0"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                        <div class="accent-bar-right"></div>
                    </div>
                    <div
                        class="relative mx-auto flex flex-col px-[22px] pb-[14px] pt-5 md:max-w-5xl md:px-8 md:pb-5 md:pt-[27px]">
                        <div
                            class="relative -ms-1.5 mb-4 text-lg/none font-bold text-text-title md:mb-5 md:ms-0 md:text-xl/none">
                            Lựa chọn trò chơi
                        </div>

                        <div class="grid grid-cols-4 gap-x-[22px] gap-y-4 sm:grid-cols-6 lg:grid-cols-8" role="tablist"
                            aria-label="Danh sách game hỗ trợ nạp">
                            <button v-for="game in games" :key="game.id" :id="`tab-game-${game.id}`" type="button"
                                role="tab" :aria-selected="selectedGame === game.id"
                                :class="['game-selector-btn', { active: selectedGame === game.id }]"
                                @click="selectGame(game.id)">
                                <div class="game-icon-container">
                                    <img :src="game.icon" :alt="game.name" class="game-icon-image" />
                                    <span v-if="selectedGame === game.id" class="active-check-badge"
                                        aria-hidden="true">✓</span>
                                </div>
                                <span :class="['game-selector-name', { 'active-name': selectedGame === game.id }]">
                                    {{ game.name }}
                                </span>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            <section class="game-hero-banner-section" aria-label="Thông tin game đang chọn">
                <div class="main-container">
                    <div class="game-hero-card"
                        :style="{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.0) 100%), url(${activeGame.banner})` }">
                        <div class="game-hero-info">
                            <div class="hero-thumb-wrapper">
                                <img :src="activeGame.icon" :alt="activeGame.name" class="hero-game-thumb" />
                                <span v-if="activeGame.badge" class="hero-thumb-badge">{{ activeGame.badge }}</span>
                            </div>
                            <div class="hero-game-meta">
                                <h2 class="hero-game-title">{{ activeGame.name }}</h2>
                                <span class="hero-security-badge">
                                    <svg width="1em" height="1em" viewBox="0 0 80 80" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class="security-shield-svg"
                                        aria-hidden="true">
                                        <path
                                            d="M54.125 34.1211C55.2966 32.9495 55.2966 31.05 54.125 29.8784C52.9534 28.7069 51.0539 28.7069 49.8823 29.8784L38.0037 41.7571L32.125 35.8784C30.9534 34.7069 29.0539 34.7069 27.8823 35.8784C26.7108 37.05 26.7108 38.9495 27.8823 40.1211L35.8823 48.1211C37.0539 49.2926 38.9534 49.2926 40.125 48.1211L54.125 34.1211Z"
                                            fill="currentColor"></path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M43.4187 3.4715C41.2965 2.28554 38.711 2.28554 36.5889 3.4715L8.07673 19.4055C6.19794 20.4555 4.97252 22.4636 5.02506 24.7075C5.36979 39.43 10.1986 63.724 37.0183 76.9041C38.8951 77.8264 41.1125 77.8264 42.9893 76.9041C69.809 63.724 74.6377 39.43 74.9825 24.7075C75.035 22.4636 73.8096 20.4555 71.9308 19.4055L43.4187 3.4715ZM39.5159 8.7091C39.8191 8.53968 40.1885 8.53968 40.4916 8.7091L68.9826 24.6313C68.6493 38.3453 64.2154 59.7875 40.343 71.5192C40.135 71.6214 39.8725 71.6214 39.6646 71.5192C15.7921 59.7875 11.3583 38.3453 11.025 24.6313L39.5159 8.7091Z"
                                            fill="currentColor"></path>
                                    </svg>
                                    <span>Thanh toán an toàn 100%</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main id="main-content" class="main-container" tabindex="-1">
                <section class="step-section" aria-label="Bước 1 Đăng nhập UID">
                    <div class="step-1-wrapper">
                        <div class="step-header-with-action">
                            <div class="step-header-left">
                                <span class="step-number" aria-hidden="true">1</span>
                                <h3 class="step-title">{{ isPlayerVerified ? 'Tài khoản' : 'Đăng nhập' }}</h3>
                            </div>
                            <button v-if="isPlayerVerified" id="btn-logout-uid" class="btn-logout-link" type="button"
                                @click="openLogoutModal">
                                <span class="swap-icon" aria-hidden="true">⇄</span> Đăng xuất
                            </button>
                        </div>

                        <div class="step-content-card">
                            <div v-if="!isPlayerVerified" class="login-box">
                                <label for="input-uid" class="login-label">
                                    ID người chơi
                                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class="info-icon-svg" aria-hidden="true"
                                        @click.prevent.stop="openHowtoModal" role="button" tabIndex="0">
                                        <circle cx="8" cy="8" r="6.5" stroke="#909399" stroke-width="1.2" fill="none" />
                                        <text x="8" y="11.2" font-size="9.5" font-weight="600" fill="#909399"
                                            text-anchor="middle" font-family="Arial, sans-serif">?</text>
                                    </svg>
                                </label>

                                <div class="login-input-group-joined">
                                    <div class="login-input-wrapper-joined">
                                        <input id="input-uid" v-model="playerId" type="text" inputmode="numeric"
                                            class="login-input-joined" placeholder="Hãy nhập UID của bạn"
                                            :aria-invalid="!!playerError" aria-describedby="uid-error"
                                            @input="playerId = playerId.replace(/\D/g, '')"
                                            @keyup.enter="handleVerifyPlayer" />
                                    </div>
                                    <button id="btn-verify-uid" class="btn-login-submit-joined" type="button"
                                        :aria-busy="isVerifyingPlayer" :disabled="isVerifyingPlayer"
                                        @click="handleVerifyPlayer">
                                        {{ isVerifyingPlayer ? 'Đang...' : 'Đăng nhập' }}
                                    </button>
                                </div>
                                <p v-if="playerError" id="uid-error" class="login-error-msg" role="alert">
                                    {{ playerError }}
                                </p>

                                <div class="social-login-footer-row">
                                    <div class="social-label-multiline">
                                        Hoặc đăng nhập bằng tài khoản game của bạn
                                    </div>
                                    <div class="social-icons" role="group" aria-label="Đăng nhập mạng xã hội">
                                        <button id="social-fb" class="social-btn fb-btn" type="button"
                                            aria-label="Đăng nhập Facebook">
                                            <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none"
                                                xmlns="http://www.w3.org/2000/svg" class="social-svg"
                                                aria-label="Facebook logo">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M25 14.0672C25 7.95496 20.0751 3 14 3C7.92486 3 3 7.95496 3 14.0672C3 19.5912 7.02254 24.1697 12.2812 25V17.2663H9.48828V14.0672H12.2812V11.629C12.2812 8.85525 13.9235 7.32313 16.4361 7.32313C17.6396 7.32313 18.8984 7.53929 18.8984 7.53929V10.2629H17.5114C16.1449 10.2629 15.7188 11.116 15.7188 11.9912V14.0672H18.7695L18.2818 17.2663H15.7188V25C20.9775 24.1697 25 19.5912 25 14.0672Z"
                                                    fill="#ffffff"></path>
                                            </svg>
                                        </button>
                                        <button id="social-google" class="social-btn google-btn" type="button"
                                            aria-label="Đăng nhập Google">
                                            <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none"
                                                xmlns="http://www.w3.org/2000/svg" class="social-svg"
                                                aria-label="Google logo">
                                                <g clip-path="url(#clip0_google_logo)">
                                                    <path
                                                        d="M8.18376 14.0001C8.18376 13.3651 8.29209 12.756 8.48376 12.1851L5.11876 9.66846C4.44268 11.0122 4.09159 12.4959 4.09376 14.0001C4.09376 15.5568 4.46209 17.0251 5.11709 18.3285L8.48043 15.8076C8.28432 15.2252 8.18412 14.6147 8.18376 14.0001Z"
                                                        fill="#FBBC05"></path>
                                                    <path
                                                        d="M14.0922 8.22266C15.5005 8.22266 16.773 8.71099 17.773 9.51099L20.6822 6.66682C18.9097 5.15599 16.6372 4.22266 14.0922 4.22266C10.1405 4.22266 6.74385 6.43516 5.11719 9.6849L8.48385 12.1852C9.25885 9.88016 11.4689 8.22266 14.0922 8.22266Z"
                                                        fill="#EA4335"></path>
                                                    <path
                                                        d="M14.0922 19.7774C11.468 19.7774 9.25802 18.1199 8.48219 15.8149L5.11719 18.3316C6.74302 21.5649 10.1397 23.7774 14.0922 23.7774C16.5305 23.7774 18.8589 22.9299 20.6072 21.3408L17.4122 18.9224C16.5114 19.4783 15.3764 19.7774 14.0914 19.7774"
                                                        fill="#34A853"></path>
                                                    <path
                                                        d="M23.6396 14.0002C23.6396 13.4227 23.5479 12.8002 23.4121 12.2227H14.0938V16.0002H19.4571C19.1896 17.2885 18.4596 18.2785 17.4154 18.9227L20.6096 21.341C22.4454 19.6727 23.6396 17.1877 23.6396 14.0002Z"
                                                        fill="#4285F4"></path>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_google_logo">
                                                        <rect width="28" height="28" fill="white"></rect>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                        <button id="social-x" class="social-btn x-btn" type="button"
                                            aria-label="Đăng nhập Twitter X">
                                            <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none"
                                                xmlns="http://www.w3.org/2000/svg" class="social-svg"
                                                aria-label="Twitter logo">
                                                <path
                                                    d="M15.7124 12.3123L22.4133 4.5H20.8254L15.0071 11.2833L10.3599 4.5H5L12.0274 14.7576L5 22.95H6.58799L12.7324 15.7866L17.6401 22.95H23L15.7121 12.3123H15.7124ZM13.5375 14.848L12.8255 13.8265L7.16017 5.69895H9.59922L14.1712 12.2582L14.8832 13.2796L20.8262 21.8056H18.3871L13.5375 14.8484V14.848Z"
                                                    fill="black"></path>
                                            </svg>
                                        </button>
                                        <button id="social-vk" class="social-btn vk-btn" type="button"
                                            aria-label="Đăng nhập VK">
                                            <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none"
                                                xmlns="http://www.w3.org/2000/svg" class="social-svg"
                                                aria-label="VK logo">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M14.4646 25H13.5486H13.5485C8.57479 25 6.0888 25 4.5444 23.4556C3 21.9112 3 19.4252 3 14.4647V14.4646V13.5354V13.5354C3 8.57392 3 6.0888 4.5444 4.54441C6.0888 3 8.5748 3 13.5486 3H14.4646C19.4375 3 21.9376 3 23.4688 4.54441C25 6.0888 25 8.57568 25 13.5354V14.4646V14.5897C25.0001 19.4671 25.0002 21.9242 23.4688 23.4556C21.9244 25 19.4375 25 14.4647 25H14.4646ZM6.71055 9.70059C6.82759 15.4197 9.83807 18.8614 14.7986 18.8614H15.0864V15.5895C16.8921 15.7726 18.2403 17.1207 18.7903 18.8614H21.3942C20.6876 16.2575 18.8554 14.8178 17.7167 14.2678C18.8554 13.5875 20.4649 11.9384 20.8442 9.70059H18.4761C17.9781 11.5195 16.4997 13.1687 15.0864 13.3253V9.70059H12.6778V16.048C11.2126 15.6846 9.30127 13.9017 9.22295 9.70059H6.71055Z"
                                                    fill="#ffffff"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="logged-in-box-card" role="status">
                                <div class="user-avatar-thumb-wrapper">
                                    <img :src="activeGame.icon" :alt="activeGame.name" class="user-avatar-thumb-img" />
                                    <span v-if="activeGame.badge" class="user-avatar-hot-badge">{{ activeGame.badge
                                        }}</span>
                                </div>
                                <div class="user-account-meta">
                                    <div class="account-name-line">
                                        {{ verifiedPlayerName }}
                                    </div>
                                    <div class="account-uid-line">
                                        Người chơi: {{ playerId }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="step-section" aria-label="Bước 2 Mệnh giá nạp">
                    <div class="step-header">
                        <span class="step-number" aria-hidden="true">2</span>
                        <h3 class="step-title">Mệnh giá nạp</h3>
                    </div>

                    <div class="denom-tabs-row" role="tablist" aria-label="Loại hình nạp thẻ">
                        <button id="tab-sub-online" type="button" role="tab" :aria-selected="activeSubTab === 'online'"
                            :class="['denom-tab-btn', { active: activeSubTab === 'online' }]"
                            @click="switchSubTab('online')">
                            Nạp Online
                        </button>
                        <button id="tab-sub-card" type="button" role="tab" :aria-selected="activeSubTab === 'card'"
                            disabled :class="['denom-tab-btn', { active: activeSubTab === 'card' }, 'disabled']"
                            @click="handleGarenaCardTab">
                            Thẻ Garena
                        </button>
                        <button id="tab-sub-shop" type="button" role="tab" :aria-selected="activeSubTab === 'shop'"
                            :class="['denom-tab-btn', { active: activeSubTab === 'shop' }]"
                            @click="switchSubTab('shop')">
                            Shop
                        </button>
                    </div>

                    <div v-if="selectedPayment" class="payment-filter-reset-bar">
                        <span class="reset-bar-text">
                            Hiện đang hiển thị mệnh giá qua <strong class="reset-pm-name">{{ selectedPaymentObj?.name
                                }}</strong>. Bấm vào đặt lại để loại bỏ lựa chọn.
                        </span>
                        <button id="btn-reset-payment-filter" type="button" class="btn-reset-filter"
                            @click="resetSelection">
                            Đặt lại
                        </button>
                    </div>

                    <div v-if="activeSubTab !== 'shop'" class="denom-grid" role="radiogroup" aria-label="Chọn mệnh giá">
                        <button v-for="d in denominations" :key="d.amount" :id="`denom-${d.amount}`" type="button"
                            role="radio" :aria-checked="selectedDenomination === d.amount"
                            :class="['denom-card-box', { active: selectedDenomination === d.amount }]"
                            @click="toggleDenomination(d.amount)">
                            <div class="denom-price-text">
                                {{ d.amount.toLocaleString('vi-VN') }} <span class="currency-symbol">đ</span>
                            </div>
                            <div class="denom-item-row">
                                <img src="/img/icon/kclogo.png" alt="Diamond" class="denom-diamond-img" />
                                <span class="item-count-val">{{ d.items.toLocaleString('vi-VN') }}</span>
                            </div>
                        </button>
                    </div>

                    <div v-else class="shop-packages-section">
                        <div class="shop-header-title">Gói nạp thẻ đặc biệt</div>
                        <div class="shop-grid" role="radiogroup" aria-label="Chọn gói nạp thẻ đặc biệt">
                            <button v-for="pkg in shopPackages" :key="pkg.id" :id="`shop-pkg-${pkg.id}`" type="button"
                                role="radio" :aria-checked="selectedShopPkg === pkg.id"
                                :class="['shop-card-box', { active: selectedShopPkg === pkg.id }]"
                                @click="toggleShopPkg(pkg.id)">
                                <div class="shop-card-banner-wrapper">
                                    <span v-if="pkg.badge" class="shop-card-hot-badge">{{ pkg.badge }}</span>
                                    <img :src="pkg.image" :alt="pkg.name" class="shop-card-real-img" />
                                </div>
                                <div class="shop-card-footer">
                                    <span class="shop-card-name">{{ pkg.name }}</span>
                                    <svg width="1em" height="1em" viewBox="0 0 80 80" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class="info-icon-svg shop-info-red"
                                        aria-hidden="true">
                                        <path
                                            d="M44 26C44 23.7909 42.2091 22 40 22C37.7909 22 36 23.7909 36 26C36 28.2091 37.7909 30 40 30C42.2091 30 44 28.2091 44 26Z"
                                            fill="rgb(216, 26, 13)"></path>
                                        <path
                                            d="M43 54C43 55.6569 41.6569 57 40 57C38.3431 57 37 55.6569 37 54V37C37 35.3431 38.3431 34 40 34C41.6569 34 43 35.3431 43 37V54Z"
                                            fill="rgb(216, 26, 13)"></path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M5 25C5 13.9543 13.9543 5 25 5H55C66.0457 5 75 13.9543 75 25V55C75 66.0457 66.0457 75 55 75H25C13.9543 75 5 66.0457 5 55V25ZM25 11H55C62.732 11 69 17.268 69 25V55C69 62.732 62.732 69 55 69H25C17.268 69 11 62.732 11 55V25C11 17.268 17.268 11 25 11Z"
                                            fill="rgb(216, 26, 13)"></path>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </section>

                <section class="step-section" aria-label="Bước 3 Phương thức thanh toán">
                    <div class="step-header">
                        <span class="step-number" aria-hidden="true">3</span>
                        <h3 class="step-title">Phương thức thanh toán</h3>
                    </div>

                    <div v-if="selectedPayment" class="payment-instruction-box">
                        <svg class="note-doc-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <rect x="4" y="3" width="16" height="18" rx="2" stroke="#888888" stroke-width="1.8" />
                            <path d="M8 7H16" stroke="#888888" stroke-width="1.8" stroke-linecap="round" />
                            <path d="M8 11H16" stroke="#888888" stroke-width="1.8" stroke-linecap="round" />
                            <path d="M8 15H12" stroke="#888888" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                        <span class="instruction-text">
                            {{ activePaymentInstruction }}
                        </span>
                    </div>

                    <div class="payment-grid" role="radiogroup" aria-label="Chọn phương thức thanh toán">
                        <button v-for="pm in paymentMethods" :key="pm.id" :id="`payment-${pm.id}`" type="button"
                            role="radio" :aria-checked="selectedPayment === pm.id" :disabled="pm.id !== 'qrpay'"
                            :class="['payment-card-box', { active: selectedPayment === pm.id, 'compact-mode': !currentAmount, disabled: pm.id !== 'qrpay' }]"
                            @click="togglePayment(pm.id)">

                            <div class="payment-brand-left-col">
                                <img :src="pm.icon" :alt="pm.name" class="payment-brand-logo" />
                                <span class="payment-brand-name">{{ pm.name }}</span>
                            </div>

                            <div v-if="currentAmount" class="payment-denom-right-col">
                                <div v-if="pm.id === 'garenaso'" class="payment-price-row">
                                    <img src="/img/payment/sò.png" alt="Sò" class="payment-so-icon" />
                                    <span class="payment-price-val">{{ currentSoAmount.toLocaleString('vi-VN') }}</span>
                                </div>
                                <div v-else class="payment-price-row">
                                    <span class="payment-price-val">{{ currentAmount.toLocaleString('vi-VN') }}</span>
                                    <span class="currency-symbol">đ</span>
                                </div>

                                <div v-if="activeSubTab === 'online' && activeDenom.items" class="payment-items-row">
                                    <img src="/img/icon/kclogo.png" alt="Diamond" class="payment-diamond-img" />
                                    <span class="payment-items-val">{{ activeDenom.items.toLocaleString('vi-VN')
                                        }}</span>
                                </div>
                            </div>

                            <span v-if="pm.badge" class="payment-hot-badge">{{ pm.badge }}</span>
                        </button>
                    </div>

                    <div v-if="currentAmount" ref="bottomActionRef" class="payment-bottom-action-wrapper">
                        <div class="payment-summary-right">
                            <div class="summary-info-block">
                                <div v-if="activeSubTab === 'shop'" class="summary-shop-title-row">
                                    <span class="summary-shop-name">{{ selectedShopObject.name }}</span>
                                </div>
                                <div v-else-if="activeDenom.items" class="summary-items-row">
                                    <img src="/img/icon/kclogo.png" alt="Diamond" class="summary-diamond-img" />
                                    <span class="summary-items-val">{{ activeDenom.items.toLocaleString('vi-VN')
                                        }}</span>
                                </div>

                                <div v-if="!selectedPayment" class="summary-select-prompt-row">
                                    Chọn Phương thức thanh toán
                                </div>
                                <div v-else class="summary-total-row">
                                    Tổng cộng: <span class="summary-total-price">{{
                                        currentAmount.toLocaleString('vi-VN') }} <span
                                            class="currency-symbol">đ</span></span>
                                </div>
                            </div>
                            <button id="btn-recharge-submit" class="btn-official-recharge-shield" type="button"
                                :aria-busy="isSubmitting" :disabled="isSubmitting || !selectedPayment"
                                @click="handleRecharge">
                                <svg class="shield-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                                        fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>{{ isSubmitting ? 'Đang xử lý...' : 'Nạp ngay' }}</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </template>

        <main v-else-if="viewState === 'checkout'" id="main-content" class="checkout-main-container" tabindex="-1"
            :style="activeGame.bgr ? { backgroundImage: `url(${activeGame.bgr})` } : {}">
            <div class="checkout-card">
                <div class="checkout-banner-wrapper"
                    :style="{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%), url(${activeGame.banner})` }">
                    <button class="btn-back-previous" type="button" @click="viewState = 'form'">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                        <span>Trang trước</span>
                    </button>
                    <div class="checkout-game-icon-wrapper">
                        <img :src="activeGame.icon" :alt="activeGame.name" class="checkout-game-icon" />
                        <span v-if="activeGame.badge" class="checkout-game-badge">{{ activeGame.badge }}</span>
                    </div>
                </div>

                <h2 class="checkout-game-title">{{ activeGame.name }}</h2>

                <div class="checkout-details-list">
                    <div class="checkout-detail-row">
                        <span class="detail-label">Tổng cộng</span>
                        <div v-if="activeSubTab === 'shop'" class="detail-value shop-pkg-val">
                            {{ selectedShopObject.name }}
                        </div>
                        <div v-else class="detail-value kc-count-val">
                            <img src="/img/icon/kclogo.png" alt="Diamond" class="checkout-kc-icon" />
                            <span>{{ activeDenom.items.toLocaleString('vi-VN') }}</span>
                        </div>
                    </div>

                    <div class="checkout-detail-row">
                        <span class="detail-label">Giá</span>
                        <span class="detail-value price-val">{{ currentAmount?.toLocaleString('vi-VN') }} đ</span>
                    </div>

                    <div class="checkout-detail-row">
                        <span class="detail-label">Phương thức thanh toán</span>
                        <span class="detail-value payment-val">{{ selectedPaymentObj?.name }}</span>
                    </div>

                    <div class="checkout-detail-row">
                        <span class="detail-label">Tên tài khoản trong game</span>
                        <span class="detail-value player-val">{{ verifiedPlayerName || 'Gấu亗PK' }}</span>
                    </div>
                </div>

                <div class="checkout-divider"></div>

                <div class="checkout-qr-section">
                    <div class="qr-instruction-title">Quét mã bằng ngân hàng bạn chọn</div>
                    <div class="qr-code-box">
                        <img :src="qrCodeUrl" alt="Mã QR thanh toán VietQR" class="qr-code-img" />
                    </div>

                    <button id="btn-complete-payment" class="btn-checkout-complete" type="button"
                        :disabled="isSubmitting" @click="confirmPaymentComplete">
                        {{ isSubmitting ? 'Đang xác nhận...' : 'Thanh toán đã hoàn tất' }}
                    </button>
                </div>
            </div>
        </main>

        <main v-else-if="viewState === 'loading'" id="main-content" class="loading-main-container" tabindex="-1"
            :style="activeGame.bgr ? { backgroundImage: `url(${activeGame.bgr})` } : {}">
            <div class="loading-content-box">
                <div class="loading-spinner-wrapper">
                    <div class="red-spinner-ring"></div>
                </div>
                <h3 class="loading-title-text">Đang tải...</h3>
                <p class="loading-sub-text">Đang tải, vui lòng đợi</p>
            </div>

            <div class="loading-action-row">
                <button id="btn-return-home-loading" class="btn-return-home-red" type="button" @click="resetToForm">
                    Quay lại Trang chủ
                </button>
            </div>
        </main>

        <main v-else-if="viewState === 'success'" id="main-content" class="result-main-container" tabindex="-1"
            :style="{ backgroundImage: `url(${activeGame.bgr || '/bgr/FF-06d91604.png'})` }">
            <div class="result-content-box">
                <div class="result-header-banner" :style="{ backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.98) 100%), url(${activeGame.banner || '/img/banner/ff.jpg'})` }">
                    <div class="result-bg-illustration">
                        <img src="/bgr/FF-06d91604.png" alt="Background Illustration" class="result-sketch-img" />
                    </div>

                    <div class="result-status-icon-wrapper">
                        <svg class="green-check-circle-svg" width="86" height="86" viewBox="0 0 68 68" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="34" cy="37" r="23" stroke="#25c974" stroke-width="4.5" fill="none" />
                            <path d="M20 36L31 47L53 18" stroke="#25c974" stroke-width="5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>

                    <h2 class="result-title-text">Thanh toán đã hoàn tất!</h2>
                    
                    <div v-if="currentTransaction" class="result-id-block">
                        <span class="result-id-label">ID giao dịch</span>
                        <div class="result-id-val-row">
                            <span class="result-id-code">{{ currentTransaction.id }}</span>
                            <button class="btn-copy-tx-id" type="button" title="Sao chép ID giao dịch" @click="copyTransactionId">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="currentTransaction" class="result-bill-card">
                    <div class="bill-row">
                        <span class="bill-label">Tổng cộng</span>
                        <div v-if="activeSubTab === 'shop'" class="bill-val">
                            {{ currentTransaction.items }}
                        </div>
                        <div v-else class="bill-val-items">
                            <img src="/img/icon/kclogo.png" alt="Diamond" class="bill-kc-icon" />
                            <span>{{ typeof currentTransaction.itemsCount === 'number' ? currentTransaction.itemsCount.toLocaleString('vi-VN') : currentTransaction.itemsCount }}</span>
                        </div>
                    </div>
                    <div class="bill-row">
                        <span class="bill-label">Giá</span>
                        <span class="bill-val">{{ currentTransaction.amount }}</span>
                    </div>
                    <div class="bill-row">
                        <span class="bill-label">Game</span>
                        <span class="bill-val">{{ currentTransaction.game }}</span>
                    </div>
                    <div class="bill-row">
                        <span class="bill-label">Phương thức thanh toán</span>
                        <span class="bill-val">{{ currentTransaction.payment }}</span>
                    </div>
                    <div class="bill-row">
                        <span class="bill-label">Thời gian giao dịch</span>
                        <span class="bill-val">{{ currentTransaction.time }}</span>
                    </div>
                </div>

                <div class="result-action-wrapper">
                    <button id="btn-return-home-success" class="btn-return-home-red" type="button" @click="resetToForm">
                        Quay lại Trang chủ
                    </button>
                </div>
            </div>
        </main>

        <transition name="slide-up">
            <div v-if="showStickyFooter && currentAmount && viewState === 'form'" class="sticky-footer-bar"
                role="region" aria-label="Thanh toán cố định">
                <div class="sticky-footer-inner">
                    <div class="sticky-summary-info">
                        
                        <div v-if="activeSubTab === 'shop'" class="summary-shop-title-row">
                            <span class="summary-shop-name">{{ selectedShopObject.name }}</span>
                        </div>
                        <div v-else-if="activeDenom.items" class="summary-items-row">
                            <img src="/img/icon/kclogo.png" alt="Diamond" class="summary-diamond-img" />
                            <span class="summary-items-val">{{ activeDenom.items.toLocaleString('vi-VN') }}</span>
                        </div>

                        <div v-if="!selectedPayment" class="summary-select-prompt-row">
                            Chọn Phương thức thanh toán
                        </div>
                        <div v-else class="summary-total-row">
                            Tổng cộng:
                            <template v-if="selectedPayment === 'garenaso'">
                                <img src="/img/payment/sò.png" alt="Sò"
                                    class="summary-so-icon inline-block h-4 w-4 align-middle" />
                                <span class="summary-total-price ml-1">{{ currentSoAmount }}</span>
                            </template>
                            <template v-else>
                                <span class="summary-total-price">{{ currentAmount.toLocaleString('vi-VN') }} <span
                                        class="currency-symbol">đ</span></span>
                            </template>
                        </div>
                    </div>
                    <button id="btn-sticky-recharge-submit" class="btn-official-recharge-shield" type="button"
                        :aria-busy="isSubmitting" :disabled="isSubmitting || !selectedPayment" @click="handleRecharge">
                        <svg class="shield-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="currentColor"
                                fill-opacity="0.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                        <span>{{ isSubmitting ? 'Đang xử lý...' : 'Nạp ngay' }}</span>
                    </button>
                </div>
            </div>
        </transition>

        <LogoutModal :is-open="showLogoutModal" @close="showLogoutModal = false" @confirm="confirmLogout" />

        <LoginModal v-model:player-id="playerId" :is-open="showLoginModal" :active-game="activeGame"
            :player-error="playerError" :is-verifying-player="isVerifyingPlayer" @close="showLoginModal = false"
            @submit="handleVerifyPlayer" @open-howto="openHowtoModal" />

        <HowtoModal v-model:show="showHowtoModal" />

        <SepayModal :show="showSepayModal" :amount="currentAmount || 50000" :game-name="activeGame?.name"
            :items="activeSubTab === 'shop' ? selectedShopObject?.name : `${activeDenom?.items} ${activeGame?.currencyName}`"
            :player-name="verifiedPlayerName || 'Gấu亗PK'" @close="showSepayModal = false"
            @success="handleSepaySuccess" />

        <div v-if="showSuccessModal" class="modal-overlay" role="dialog" aria-modal="true"
            aria-labelledby="modal-title">
            <div class="modal-box">
                <div class="modal-head">
                    <h3 id="modal-title" class="modal-title-text">🎉 Giao Dịch Thành Công!</h3>
                </div>
                <div class="modal-content" v-if="currentTransaction">
                    <div class="info-row">
                        <span>Mã giao dịch:</span>
                        <strong>{{ currentTransaction.id }}</strong>
                    </div>
                    <div class="info-row">
                        <span>Trò chơi:</span>
                        <span>{{ currentTransaction.game }}</span>
                    </div>
                    <div class="info-row">
                        <span>Tài khoản:</span>
                        <span>{{ currentTransaction.player }}</span>
                    </div>
                    <div class="info-row">
                        <span>Số tiền:</span>
                        <span>{{ currentTransaction.amount }}</span>
                    </div>
                    <div class="info-row">
                        <span>Nhận được:</span>
                        <strong class="text-red">{{ currentTransaction.items }}</strong>
                    </div>
                    <div class="info-row">
                        <span>Kênh nạp:</span>
                        <span>{{ currentTransaction.payment }}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button id="btn-modal-copy" class="modal-btn copy-btn" type="button" @click="copyTransactionId">Sao
                        chép mã</button>
                    <button id="btn-modal-close" class="modal-btn close-btn" type="button"
                        @click="closeModal">Đóng</button>
                </div>
            </div>
        </div>

        <footer class="official-footer" role="contentinfo">
            <div class="footer-inner-container">
                <div class="footer-company-info">
                    CÔNG TY CỔ PHẦN SHOPEEPAY | Giấy CNĐKKD số 0103959912 | Cơ quan cấp: Phòng Đăng ký kinh doanh - Sở
                    Kế hoạch và Đầu tư TP Hà Nội | Địa chỉ trụ sở chính: Tầng 5, Tháp 2, Tòa nhà Capital Place, số 29
                    Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, TP Hà Nội, Việt Nam
                </div>
                <nav class="footer-links" aria-label="Liên kết điều khoản">
                    <a id="link-footer-faq" href="#faq">Câu hỏi thường gặp</a>
                    <span class="sep" aria-hidden="true">|</span>
                    <a id="link-footer-help" href="#help">Trung tâm trợ giúp</a>
                    <span class="sep" aria-hidden="true">|</span>
                    <a id="link-footer-terms" href="#terms">Điều khoản dịch vụ</a>
                    <span class="sep" aria-hidden="true">|</span>
                    <a id="link-footer-privacy" href="#privacy">Chính sách bảo mật</a>
                </nav>
            </div>
        </footer>

        <a
            v-if="!isAnyModalOpen"
            id="zalo-hotline-widget"
            href="https://zalo.me/84997031943"
            target="_blank"
            rel="noopener noreferrer"
            :class="['zalo-hotline-float', { 'has-sticky-footer': showStickyFooter && currentAmount && viewState === 'form' }]"
            aria-label="Hotline Hỗ Trợ Zalo"
        >
            <div class="zalo-pulse-ring"></div>
            <div class="zalo-icon-wrapper">
                <img src="/img/contact/zalo.png" alt="Zalo Hotline" class="zalo-icon-img" />
            </div>
        </a>
    </div>
</template>

<style scoped>
.napthe-official-app {
    --font-family-stack: Roboto, Noto Sans Thai, Noto Sans Arabic, Noto Sans JP, Noto Sans KR, Noto Sans Khmer, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-md: 15px;
    --font-size-lg: 16px;
    --font-size-xl: 18px;
    --font-size-2xl: 24px;

    --color-text-primary: #323232;
    --color-text-secondary: #757575;
    --color-text-inverse: #28292f;

    --color-surface-muted: #ffffff;
    --color-surface-base: #000000;
    --color-surface-raised: #006afc;
    --color-surface-strong: #0077ff;

    --color-border-default: #e5e7eb;
    --color-border-muted: #d3d3d3;
    --color-brand-red: rgb(216, 26, 13);

    --space-1: 4px;
    --space-2: 6px;
    --space-3: 8px;
    --space-4: 12px;
    --space-5: 14px;
    --space-6: 15px;
    --space-7: 16px;
    --space-8: 20px;

    --radius-xs: 6px;
    --radius-sm: 9999px;

    --motion-duration-instant: 150ms;
    --motion-duration-fast: 200ms;

    font-family: var(--font-family-stack);
    font-size: var(--font-size-md);
    color: var(--color-text-primary);
    background-color: #ffffff;
    min-height: 100vh;
    margin: 0;
    padding: 60px 0 0 0;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    position: relative;
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

.skip-link {
    position: absolute;
    top: -100px;
    left: 16px;
    background: var(--color-surface-base);
    color: var(--color-surface-muted);
    padding: var(--space-3) var(--space-4);
    z-index: 9999;
    border-radius: var(--radius-xs);
    font-size: var(--font-size-sm);
    text-decoration: underline;
    transition: top var(--motion-duration-fast) ease;
}

.skip-link:focus {
    top: 16px;
    outline: 3px solid var(--color-surface-raised);
    outline-offset: 2px;
}

:focus,
:focus-visible {
    outline: none !important;
    box-shadow: none !important;
}

.top-header {
    background-color: #ffffff;
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    width: 100%;
}

.header-inner {
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
    padding: 0 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text-decoration-none {
    text-decoration: none;
    display: flex;
    align-items: center;
}

.garena-logo-img {
    height: 25px;
    max-height: 25px;
    width: auto;
    object-fit: contain;
    display: block;
}

.garena-logo-img-mobile {
    height: 28px;
    max-height: 28px;
    width: auto;
    object-fit: contain;
    display: none;
}

.mobile-br {
    display: none;
}

.garena-brand-name {
    color: #e41e26;
    font-size: 22px;
    font-weight: 100;
    margin-left: 5px;
    letter-spacing: -0.3px;
}

.header-divider {
    color: #d3d3d3;
    font-size: 14px;
    margin: 0 8px;
}

.header-title {
    color: #323232;
    font-size: 16px;
    font-weight: 500;
    margin: 0;
}

.header-user {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.user-avatar-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    transition: opacity 150ms ease;
    overflow: hidden;
    width: 32px;
    height: 32px;
}

.user-avatar-btn img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #e5e7eb;
    display: block;
}

.user-avatar-btn:hover {
    opacity: 0.8;
}

.top-promo-banner-section {
    background-color: #121212;
    padding: 16px 0;
    width: 100%;
    position: relative;
    z-index: 1;
    overflow: hidden;
}

.promo-banner-wrapper {
    max-width: 992px;
    margin: 0 auto;
    padding: 0 15px;
    display: flex;
    justify-content: center;
}

.promo-mkt-banner-img {
    width: 100%;
    max-width: 690px;
    border-radius: 12px;
    margin-top: 4px;
    height: auto;
    display: block;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.golden-accent-left {
    height: 6px;
    width: 370px;
    flex-shrink: 0;
    background: linear-gradient(270deg, #FF9800 0%, rgba(255, 152, 0, 0) 100%);
}

.golden-accent-center-slant {
    height: 14px;
    width: 140px;
    background-color: #FF9800;
    clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
    flex-shrink: 0;
}

.golden-accent-right {
    height: 6px;
    flex: 1;
    background: linear-gradient(90deg, #FF9800 0%, rgba(255, 152, 0, 0) 100%);
}

.game-selector-section {
    position: relative;
    margin-top: -1px;
    background-color: #EFEFEF;
}

.game-selector-nav {
    min-height: 186px;
    overflow: hidden;
}

.selector-bg-layer {
    background: linear-gradient(90deg, #EFEFEF 0%, #EFEFEF 48%, #F5F5F5 55%, #EFEFEF 72%, #EFEFEF 100%);
}

.selector-pattern-layer {
    opacity: 0.22;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.selector-pattern-layer svg {
    transform: translateX(60px);
}

@media (max-width: 768px) {
    .selector-pattern-layer svg {
        transform: translateX(20px);
    }
}

.w-full {
    width: 100%;
}

.h-full {
    height: 100%;
}

.justify-center {
    justify-content: center;
}

.items-center {
    align-items: center;
}

.relative {
    position: relative;
}

.absolute {
    position: absolute;
}

.inset-0 {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.pointer-events-none {
    pointer-events: none;
}

.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.flex {
    display: flex;
}

.accent-bar-container {
    top: 0;
    left: 0;
    right: 0;
    height: 27px;
    bottom: auto;
    align-items: flex-start;
    overflow: hidden;
}

.accent-bar-left {
    
    flex: 1 1 0%;
    height: 7px;
    
    background-color: #f2b13e;
    align-self: flex-start;
}

.accent-bar-svg {
    display: block;
    height: 27px;
    flex-shrink: 0;
    min-width: 0;
}

.accent-bar-right {
    
    flex: 1 1 0%;
    height: 27px;
    background-color: rgba(253, 211, 115, 0.63);
}

.flex-1 {
    flex: 1 1 0%;
}

.h-\[7px\] {
    height: 7px;
}

.h-\[27px\] {
    height: 27px;
}

.bg-\[\#F2813E\] {
    background-color: #F2813E;
}

.bg-\[\#FDD373\]\/\[0\.63\] {
    background-color: rgba(253, 211, 115, 0.63);
}

.block {
    display: block;
}

.hidden {
    display: none;
}

.flex-col {
    flex-direction: column;
}

.px-\[22px\] {
    padding-left: 22px;
    padding-right: 22px;
}

.pb-\[14px\] {
    padding-bottom: 14px;
}

.pt-5 {
    padding-top: 20px;
}

.bg-\[\#EFEFEF\] {
    background-color: #EFEFEF;
}

.text-lg\/none {
    font-size: 1.125rem;
    line-height: 1;
}

.font-bold {
    font-weight: 700;
}

.text-text-title {
    color: #1f2937;
}

.mb-4 {
    margin-bottom: 1rem;
}

.grid {
    display: grid;
}

.grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

.gap-x-\[22px\] {
    column-gap: 22px;
}

.gap-y-4 {
    row-gap: 1rem;
}

@media (min-width: 640px) {
    .sm\:grid-cols-6 {
        grid-template-columns: repeat(6, minmax(0, 1fr));
    }
}

@media (min-width: 768px) {
    .md\:hidden {
        display: none !important;
    }

    .md\:block {
        display: block !important;
    }

    .md\:max-w-5xl {
        max-width: 64rem;
    }

    .md\:px-8 {
        padding-left: 2rem;
        padding-right: 2rem;
    }

    .md\:pb-4 {
        padding-bottom: 1rem;
    }

    .md\:pt-\[27px\] {
        padding-top: 27px;
    }

    .md\:mb-5 {
        margin-bottom: 1.25rem;
    }

    .md\:text-xl\/none {
        font-size: 1.25rem;
        line-height: 1;
    }
}

@media (min-width: 1024px) {
    .lg\:grid-cols-8 {
        grid-template-columns: repeat(8, minmax(0, 1fr));
    }

    .game-selector-section,
    .game-selector-nav {
        height: 220px;
        min-height: 220px;
    }
}

.game-selector-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 84px;
    padding: 0;
    transition: transform var(--motion-duration-instant) ease;
}

.game-selector-btn:disabled,
.game-selector-btn.disabled {
    opacity: 0.45;
    cursor: not-allowed;
    filter: grayscale(0.5);
}

.game-icon-container {
    position: relative;
    width: 77px;
    height: 77px;
    border-radius: 16px;
    overflow: visible;
    border: 2px solid transparent;
    transition: all var(--motion-duration-instant) ease;
}

.game-icon-image {
    width: 100%;
    height: 100%;
    border-radius: 14px;
    object-fit: cover;
}

.game-selector-btn.active .game-icon-container {
    border-color: var(--color-brand-red);
    box-shadow: 0 0 0 2px var(--color-brand-red);
}

.active-check-badge {
    position: absolute;
    top: -4px;
    left: -4px;
    background-color: var(--color-brand-red);
    color: #ffffff;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    font-size: var(--font-size-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.game-top-badge {
    position: absolute;
    top: -4px;
    left: -4px;
    background-color: var(--color-brand-red);
    color: #ffffff;
    font-size: 9px;
    font-weight: 800;
    padding: 1px 4px;
    border-radius: 3px;
}

.game-selector-name {
    font-size: var(--font-size-md);
    margin-top: 6px;
    text-align: center;
    line-height: 1.2;
}

.active-name {
    color: rgb(216, 26, 13) !important;
    font-weight: 700;
}

.game-hero-banner-section {
    margin-top: 24px;
    margin-bottom: 24px;
}

.main-container {
    max-width: 970px;
    margin: 0 auto;
    padding: 0 15px;
}

.game-hero-card {
    height: 120px;
    border-radius: 11px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    padding: 0 20px;
}

.game-hero-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.hero-thumb-wrapper {
    position: relative;
}

.hero-game-thumb {
    width: 72px;
    height: 72px;
    border-radius: 12px;
    object-fit: cover;
    display: block;
}

.hero-thumb-badge {
    position: absolute;
    top: -4px;
    left: -4px;
    background-color: var(--color-brand-red);
    color: #ffffff;
    font-size: 9px;
    font-weight: 800;
    padding: 1px 4px;
    border-radius: 3px;
}

.hero-game-title {
    color: #ffffff;
    font-size: 20px;
    font-weight: 800;
    margin: 0 0 4px 0;
}

.hero-security-badge {
    background-color: rgba(0, 0, 0, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
    padding: 5px 8px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    line-height: 1;
}

.security-shield-svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    display: block;
}

.step-section {
    margin-bottom: 24px;
}

.step-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.step-number {
    background-color: rgb(216, 26, 13);
    color: #ffffff;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 13px;
}

.step-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: var(--color-text-primary);
}

.step-content-card {
    background-color: #f9f9f9;
    border: 0.5px solid var(--color-border-default);
    border-radius: var(--radius-xs);
    padding: 20px;
}

.step-1-wrapper {
    width: 50%;
    box-sizing: border-box;
}

@media (max-width: 768px) {
    .step-1-wrapper {
        width: 100%;
    }
}

.login-label {
    font-size: 16px;
    font-weight: 600;
    color: #555555;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.info-icon-svg {
    width: 14px;
    height: 14px;
    display: inline-block;
    vertical-align: middle;
    color: #909399;
    flex-shrink: 0;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.info-icon-svg:hover {
    transform: scale(1.18);
    opacity: 0.8;
}

.shop-info-red {
    color: rgb(216, 26, 13) !important;
}

.step-header-with-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.step-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.btn-logout-link {
    background: none;
    border: none;
    color: rgb(216, 26, 13);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
}

.btn-logout-link:hover {
    opacity: 0.7;
}

.login-input-group-joined {
    display: flex;
    align-items: center;
    width: 100%;
}

.login-input-wrapper-joined {
    position: relative;
    flex: 1;
}

.login-input-joined {
    width: 100%;
    height: 40px;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-right: none;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding: 0 32px 0 14px;
    font-size: 14px;
    color: #303133;
    outline: none !important;
    box-sizing: border-box;
}

.login-input-joined::placeholder {
    color: #c0c4cc;
}

.input-dropdown-chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    width: 12px;
    height: 12px;
}

.btn-login-submit-joined {
    background-color: rgb(216, 26, 13);
    color: #ffffff;
    border: 1px solid rgb(216, 26, 13);
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding: 0 20px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    height: 40px;
    white-space: nowrap;
    transition: background-color var(--motion-duration-instant) ease;
}

.btn-login-submit-joined:hover:not(:disabled) {
    background-color: rgb(216, 26, 13);
    border-color: rgb(216, 26, 13);
}

.login-error-msg {
    color: var(--color-brand-red);
    font-size: var(--font-size-xs);
    margin: 6px 0 0 0;
}

.social-login-footer-row {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
}

.social-label-multiline {
    font-size: 12px;
    color: #757575;
    line-height: 1.3;
}

.social-icons {
    display: flex;
    gap: 16px;
}

.social-btn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity var(--motion-duration-instant) ease;
    border: none;
}

.social-btn:hover {
    opacity: 0.85;
}

.social-svg {
    width: 18px;
    height: 18px;
    display: block;
}

.fb-btn {
    background-color: #006AFC;
}

.google-btn {
    background-color: #ffffff;
    border: 1px solid var(--color-border-muted);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.x-btn {
    background-color: #ffffff;
    border: 1px solid var(--color-border-muted);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.vk-btn {
    background-color: #0077FF;
}

.logged-in-box-card {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
}

.user-avatar-thumb-wrapper {
    position: relative;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
}

.user-avatar-thumb-img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
}

.user-avatar-hot-badge {
    position: absolute;
    top: -2px;
    left: -2px;
    background-color: rgb(216, 26, 13);
    color: #ffffff;
    font-size: 8px;
    font-weight: 800;
    padding: 1px 3px;
    border-radius: 3px;
    line-height: 1;
}

.user-account-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.account-name-line {
    font-size: 14px;
    font-weight: 700;
    color: #303133;
}

.account-uid-line {
    font-size: 13px;
    color: #757575;
}

.denom-tabs-row {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.denom-tab-btn {
    background-color: #ffffff;
    border: 2px solid var(--color-border-muted);
    border-radius: 20px;
    padding: 2px 12px;
    font-size: 14px;
    font-weight: 500;
    color: #555555;
    cursor: pointer;
    transition: all var(--motion-duration-instant) ease;
    user-select: none;
    -webkit-user-select: none;
}

.denom-tab-btn.active {
    border-color: var(--color-brand-red);
    color: var(--color-brand-red);
    background-color: #fff0f2;
}

.denom-tab-btn:disabled,
.denom-tab-btn.disabled {
    opacity: 0.45;
    cursor: not-allowed;
    background-color: #f5f5f5;
}

.denom-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
}

.denom-card-box {
    width: 100%;
    height: 72px;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all var(--motion-duration-instant) ease;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
}

.denom-card-box.active {
    border-color: #c70101;
    box-shadow: 0 0 0 1px #c70101;
}

.denom-price-text {
    font-size: 16px;
    font-weight: 550;
    color: #303133;
    padding: 0 4px;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    line-height: 1;
    white-space: nowrap;
}

.currency-symbol {
    text-decoration: underline;
}

.denom-item-row {
    background-color: #f2f3f5;
    border-top: 1px solid #e4e7ed;
    width: 100%;
    height: 26px;
    padding: 0;
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-sizing: border-box;
    flex-shrink: 0;
}

.denom-card-box.active .denom-item-row {
    background-color: #f2f3f5;
}

.denom-diamond-img {
    width: 13px;
    height: 13px;
    object-fit: contain;
}

.item-count-val {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    line-height: 1;
}

.shop-packages-section {
    margin-top: 10px;
}

.shop-header-title {
    font-size: 14px;
    font-weight: 700;
    color: #555555;
    margin-bottom: 12px;
}

.shop-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
}

.shop-card-box {
    position: relative;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    overflow: hidden;
    padding: 0;
    cursor: pointer;
    transition: all var(--motion-duration-instant) ease;
    display: flex;
    flex-direction: column;
    user-select: none;
    -webkit-user-select: none;
}

.shop-card-box.active {
    border-color: #d81a0d;
    background-color: #fff8f8;
    box-shadow: 0 0 0 1px #d81a0d;
}

.shop-card-banner-wrapper {
    position: relative;
    height: 125px;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    padding: 8px;
    box-sizing: border-box;
}

.shop-card-real-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

.shop-card-hot-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    background-color: rgb(216, 26, 13);
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 3px;
    z-index: 2;
    line-height: 1;
}

.shop-card-footer {
    padding: 10px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background-color: #ffffff;
    border-top: 1px solid #f2f3f5;
}

.shop-card-name {
    font-size: 13.5px;
    font-weight: 700;
    color: #323232;
}

.shop-card-box.active .shop-card-name {
    color: #d81a0d;
}

.payment-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
}

.payment-card-box {
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    cursor: pointer;
    position: relative;
    transition: all var(--motion-duration-instant) ease;
    min-height: 84px;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
}

.payment-card-box.active {
    border-color: rgb(216, 26, 13);
    background-color: #ffffff;
    box-shadow: 0 0 0 1px rgb(216, 26, 13);
}

.payment-card-box:disabled,
.payment-card-box.disabled {
    opacity: 0.45;
    cursor: not-allowed;
    filter: grayscale(0.5);
    background-color: #f7f7f7;
    border-color: #e5e7eb;
}

.payment-instruction-box {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 13px;
    color: #606266;
    margin-bottom: 16px;
    line-height: 1.45;
}

.note-doc-icon {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    margin-top: 2px;
}

.instruction-text {
    flex: 1;
}

.payment-brand-left-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 86px;
    flex-shrink: 0;
}

.payment-brand-logo {
    width: auto;
    height: 60px;
    max-width: 72px;
    object-fit: contain;
    display: block;
}

.payment-brand-name {
    font-size: 11px;
    font-weight: 500;
    color: #606266;
    text-align: center;
    line-height: 1.2;
}

.payment-card-box.compact-mode {
    justify-content: flex-start;
    padding: 14px 18px;
}

.payment-card-box.compact-mode .payment-brand-left-col {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
    width: 100%;
}

.payment-card-box.compact-mode .payment-brand-name {
    font-size: 14px;
    font-weight: 700;
    color: #303133;
    text-align: left;
}

.payment-denom-right-col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 2px;
    flex: 1;
}

.payment-price-row {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 16px;
    font-weight: 700;
    color: #303133;
    line-height: 1.2;
}

.payment-so-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
}

.payment-price-val {
    font-weight: 700;
}

.payment-items-row {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
}

.payment-diamond-img {
    width: 13px;
    height: 13px;
    object-fit: contain;
}

.payment-items-val {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
}

.payment-hot-badge {
    position: absolute;
    top: 3px;
    right: 3px;
    background-color: #000000;
    color: rgb(242, 219, 31);
    font-size: 9px;
    font-weight: 800;
    padding: 3px 4px;
    border-radius: 3px;
    line-height: 1.2;
}

.payment-filter-reset-bar {
    background-color: #f7f8fa;
    border-radius: 6px;
    padding: 10px 14px;
    margin-top: 12px;
    margin-bottom: 12px;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    font-size: 13px;
    color: #606266;
    gap: 12px;
}

.reset-pm-name {
    color: rgb(216, 26, 13);
    font-weight: 700;
}

.btn-reset-filter {
    background-color: #ffffff;
    border: 1px solid rgba(216, 26, 13, 0.589);
    border-radius: 4px;
    color: rgb(216, 26, 13);
    font-size: 12.5px;
    font-weight: 500;
    padding: 6px 10px;
    cursor: pointer;
    white-space: nowrap;
    transition: all var(--motion-duration-instant) ease;
}

.btn-reset-filter:hover {
    background-color: #fff0f2;
    border-color: rgb(216, 26, 13);
    color: rgb(216, 26, 13);
}

.payment-bottom-action-wrapper {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
}

.payment-summary-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.summary-info-block {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.summary-shop-title-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.summary-shop-name {
    font-size: 16px;
    font-weight: 700;
    color: #303133;
}

.summary-items-row {
    display: flex;
    align-items: center;
    gap: 4px;
}

.summary-diamond-img {
    width: 14px;
    height: 14px;
    object-fit: contain;
}

.summary-items-val {
    font-size: 16px;
    font-weight: 700;
    color: #303133;
}

.summary-select-prompt-row {
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    margin-top: 2px;
}

.summary-total-row {
    font-size: 17px;
    font-weight: 500;
    color: #303133;
    margin-top: 2px;
}

.summary-total-price {
    color: rgb(216, 26, 13);
    font-weight: 700;
}

.summary-so-icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
    margin: 0 2px 0 4px;
}

.btn-official-recharge-shield {
    background: rgb(216, 26, 13);
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 10px 24px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all var(--motion-duration-fast) ease;
    user-select: none;
    -webkit-user-select: none;
}

.btn-official-recharge-shield:hover:not(:disabled) {
    background: rgb(216, 26, 13);
}

.btn-official-recharge-shield:disabled {
    background-color: #f8a5ab !important;
    color: #ffffff !important;
    opacity: 1 !important;
    cursor: not-allowed !important;
}

.shield-check-icon {
    width: 16px;
    height: 16px;
    display: block;
}

.sticky-footer-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    z-index: 999;
    padding: 12px 0;
}

.sticky-footer-inner {
    max-width: 970px;
    margin: 0 auto;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    box-sizing: border-box;
}

.sticky-summary-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 250ms ease, opacity 250ms ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.official-footer {
    background-color: #ffffff;
    border-top: 1px solid var(--color-border-default);
    padding: 20px 0;
    margin-top: 40px;
}

.footer-inner-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.footer-company-info {
    font-size: 10px;
    color: var(--color-text-secondary);
    line-height: 1.5;
    max-width: 500px;
}

.footer-links {
    font-size: 11px;
    color: var(--color-text-secondary);
    display: flex;
    gap: 6px;
    white-space: nowrap;
}

.footer-links a {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color var(--motion-duration-instant) ease;
}

.footer-links a:hover {
    color: var(--color-brand-red);
    text-decoration: underline;
}

.sep {
    color: var(--color-border-muted);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-box {
    background-color: #ffffff;
    border-radius: var(--radius-xs);
    width: 400px;
    overflow: hidden;
}

.modal-head {
    background-color: var(--color-brand-red);
    color: #ffffff;
    padding: 12px 16px;
}

.modal-title-text {
    font-size: var(--font-size-md);
    font-weight: 700;
    margin: 0;
}

.modal-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
}

.info-row {
    display: flex;
    justify-content: space-between;
}

.text-red {
    color: var(--color-brand-red);
}

.modal-actions {
    padding: 12px 16px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    background-color: #f5f5f5;
}

.modal-btn {
    padding: 6px 12px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
}

.copy-btn {
    background-color: #e0e0e0;
}

.close-btn {
    background-color: var(--color-brand-red);
    color: #ffffff;
}

@media (max-width: 900px) {
    .denom-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }

    .denom-card-box {
        width: 100%;
        height: 60px;
    }

    .denom-price-text {
        font-size: 15px;
        padding: 0 4px;
    }

    .payment-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .footer-inner-container {
        flex-direction: column;
        align-items: flex-start;
    }
}

.checkout-main-container {
    min-height: calc(100vh - 140px);
    padding: 30px 15px 50px 15px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-color: #f5f5f5;
    position: relative;
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
}

.checkout-card {
    width: 100%;
    max-width: 520px;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
}

.checkout-banner-wrapper {
    height: 170px;
    width: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
    padding: 16px;
    box-sizing: border-box;
}

.btn-back-previous {
    background: rgba(0, 0, 0, 0.55);
    color: #ffffff;
    border: none;
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: background 150ms ease;
    user-select: none;
    -webkit-user-select: none;
}

.btn-back-previous:hover {
    background: rgba(0, 0, 0, 0.75);
}

.checkout-game-icon-wrapper {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 72px;
    height: 72px;
}

.checkout-game-icon {
    width: 72px;
    height: 72px;
    border-radius: 14px;
    object-fit: cover;
    border: 3px solid #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    display: block;
}

.checkout-game-badge {
    position: absolute;
    top: -2px;
    left: -2px;
    background-color: rgb(216, 26, 13);
    color: #ffffff;
    font-size: 9px;
    font-weight: 800;
    padding: 1px 4px;
    border-radius: 3px;
}

.checkout-game-title {
    margin-top: 48px;
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    text-align: center;
    margin-bottom: 24px;
}

.checkout-details-list {
    padding: 0 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.checkout-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.detail-label {
    color: #606266;
    font-weight: 400;
}

.detail-value {
    color: #303133;
    font-weight: 600;
}

.kc-count-val {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 700;
    color: #303133;
}

.checkout-kc-icon {
    width: 15px;
    height: 15px;
    object-fit: contain;
}

.price-val {
    font-weight: 700;
    color: #303133;
}

.payment-val {
    font-weight: 600;
    color: #303133;
}

.player-val {
    font-weight: 600;
    color: #303133;
}

.checkout-divider {
    height: 1px;
    background-color: #f0f0f0;
    margin: 24px 32px 20px 32px;
}

.checkout-qr-section {
    padding: 0 32px 32px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.qr-instruction-title {
    font-size: 13px;
    font-weight: 600;
    color: #303133;
    text-align: center;
}

.qr-instruction-sub {
    font-size: 12px;
    color: #909399;
    text-align: center;
    margin-top: 4px;
}

.qr-code-box {
    position: relative;
    width: 180px;
    height: 180px;
    margin: 20px 0;
    padding: 8px;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-sizing: border-box;
}

.qr-code-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

.qr-center-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 28px;
    height: 28px;
    background-color: #ffffff;
    border-radius: 50%;
    padding: 3px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.qr-garena-logo {
    width: 18px;
    height: 18px;
    object-fit: contain;
}

.btn-checkout-complete {
    width: 100%;
    height: 48px;
    background-color: rgb(216, 26, 13);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 150ms ease;
    user-select: none;
    -webkit-user-select: none;
}

.btn-checkout-complete:hover:not(:disabled) {
    background-color: rgb(216, 26, 13);
}

.btn-checkout-complete:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.loading-main-container {
    min-height: calc(100vh - 140px);
    padding: 80px 15px 60px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #fafafa;
    position: relative;
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
}

.loading-content-box {
    position: relative;
    width: 100%;
    max-width: 600px;
    height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.loading-spinner-wrapper {
    margin-bottom: 16px;
    z-index: 2;
}

.red-spinner-ring {
    width: 44px;
    height: 44px;
    border: 3.5px solid #f3d1d5;
    border-top-color: rgb(216, 26, 13);
    border-radius: 50%;
    animation: spin-loader 0.8s linear infinite;
}

@keyframes spin-loader {
    to {
        transform: rotate(360deg);
    }
}

.loading-title-text {
    font-size: 16px;
    font-weight: 700;
    color: #303133;
    margin: 0 0 6px 0;
    z-index: 2;
}

.loading-sub-text {
    font-size: 13px;
    color: #909399;
    margin: 0;
    z-index: 2;
}

.loading-action-row {
    margin-top: 36px;
    width: 100%;
    max-width: 440px;
    display: flex;
    justify-content: center;
}

.btn-return-home-red {
    width: 100%;
    height: 44px;
    background-color: rgb(216, 26, 13);
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 150ms ease;
    user-select: none;
    -webkit-user-select: none;
}

.btn-return-home-red:hover {
    background-color: rgb(216, 26, 13);
}

.result-main-container {
    min-height: calc(100vh - 140px);
    padding: 30px 15px 60px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #f5f5f5;
    position: relative;
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
}

.result-content-box {
    position: relative;
    width: 100%;
    max-width: 520px;
    background-color: #ffffff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.result-header-banner {
    position: relative;
    width: 100%;
    padding: 32px 20px 24px 20px;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
}

.result-bg-illustration {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 260px;
    height: 180px;
    pointer-events: none;
    opacity: 0.15;
    filter: grayscale(100%) contrast(1.2);
}

.result-sketch-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.result-status-icon-wrapper {
    margin-bottom: 14px;
    z-index: 2;
}

.green-check-circle-svg {
    width: 86px;
    height: 86px;
}

.result-title-text {
    font-size: 21px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 8px 0;
    z-index: 2;
    text-align: center;
}

.result-id-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
}

.result-id-label {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 2px;
}

.result-id-val-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
}

.btn-copy-tx-id {
    background: none;
    border: none;
    padding: 3px;
    cursor: pointer;
    color: #6b7280;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: color 150ms ease, background-color 150ms ease;
}

.btn-copy-tx-id:hover {
    color: #111827;
    background-color: rgba(0, 0, 0, 0.05);
}

.result-bill-card {
    width: 100%;
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-sizing: border-box;
    z-index: 2;
}

.bill-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.bill-label {
    color: #4b5563;
    font-weight: 400;
}

.bill-val {
    color: #111827;
    font-weight: 500;
}

.bill-val-items {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #111827;
    font-weight: 600;
}

.bill-kc-icon {
    width: 15px;
    height: 15px;
    object-fit: contain;
}

.result-action-wrapper {
    width: 100%;
    padding: 8px 32px 32px 32px;
    box-sizing: border-box;
    z-index: 2;
}

.btn-return-home-red {
    width: 100%;
    height: 48px;
    background-color: rgb(216, 26, 13);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 150ms ease;
    user-select: none;
    -webkit-user-select: none;
}

.btn-return-home-red:hover {
    background-color: rgb(190, 20, 10);
}

@media (max-width: 640px) {
    .garena-logo-img {
        display: none !important;
    }

    .garena-logo-img-mobile {
        display: block !important;
        height: 28px !important;
        max-height: 28px !important;
    }

    .mobile-br {
        display: block !important;
    }

    .napthe-official-app {
        padding-top: 54px !important;
    }

    .top-header {
        height: 54px !important;
        min-height: 54px !important;
        padding: 0 !important;
        background-color: #ffffff !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 9999 !important;
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        border-bottom: 1px solid #e5e7eb !important;
        box-sizing: border-box !important;
    }

    .header-inner {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        background-color: #ffffff !important;
        height: 100% !important;
        width: 100% !important;
        padding: 0 12px !important;
        box-sizing: border-box !important;
    }

    .garena-logo-img-mobile {
        height: 28px !important;
        max-height: 28px !important;
        width: auto !important;
        object-fit: contain !important;
        display: block !important;
    }

    .header-title {
        font-size: 13px !important;
        line-height: 1.25 !important;
        font-weight: 600 !important;
        color: #323232 !important;
    }

    .header-divider {
        margin: 0 6px !important;
        color: #d3d3d3 !important;
    }

    .top-promo-banner-section {
        background-color: transparent !important;
        padding: 0 !important;
    }

    .promo-banner-wrapper {
        padding: 0 !important;
    }

    .promo-mkt-banner-img {
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    .gap-x-\[22px\] {
        column-gap: 6px !important;
    }

    .game-selector-btn {
        width: 100% !important;
        max-width: 76px !important;
    }

    .game-icon-container {
        width: 58px !important;
        height: 58px !important;
        border-radius: 14px !important;
    }

    .game-icon-image {
        border-radius: 12px !important;
    }

    .game-selector-name {
        font-size: 11.5px !important;
        font-weight: 400 !important;
        color: #323232;
        margin-top: 5px !important;
        word-break: break-word !important;
        line-height: 1.2 !important;
    }

    .game-selector-name.active-name,
    .game-selector-btn.active .game-selector-name {
        color: rgb(216, 26, 13) !important;
        font-weight: 700 !important;
    }

    .shop-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px !important;
    }

    .shop-card-banner-wrapper {
        height: 105px !important;
    }

    .game-hero-banner-section {
        margin-top: 12px !important;
        margin-bottom: 12px !important;
    }

    .game-hero-card {
        height: 84px !important;
        padding: 0 12px !important;
        border-radius: 10px !important;
    }

    .hero-game-thumb {
        width: 52px !important;
        height: 52px !important;
        border-radius: 10px !important;
    }

    .hero-game-title {
        font-size: 16px !important;
        margin-bottom: 2px !important;
    }

    .hero-security-badge {
        font-size: 10.5px !important;
        padding: 3px 6px !important;
    }

    .security-shield-svg {
        width: 12px !important;
        height: 12px !important;
    }

    .sticky-footer-bar {
        padding: 14px 0 !important;
    }

    .sticky-footer-inner {
        justify-content: space-between !important;
        padding: 0 14px !important;
        width: 100% !important;
    }

    .sticky-summary-info {
        align-items: flex-start !important;
    }

    .summary-items-val {
        font-size: 14px !important;
    }

    .summary-diamond-img {
        width: 12px !important;
        height: 12px !important;
    }

    .summary-total-row {
        font-size: 14px !important;
    }

    .summary-select-prompt-row {
        font-size: 12.5px !important;
    }

    .btn-official-recharge-shield {
        padding: 10px 18px !important;
        font-size: 14px !important;
    }

    @media (max-width: 768px) {
        .denom-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
        }

        .denom-card-box {
            width: 100% !important;
            height: 50px !important;
            min-height: 50px !important;
        }

        .denom-price-text {
            font-size: 13.5px !important;
            font-weight: 500 !important;
            padding: 0 2px !important;
            white-space: nowrap !important;
        }

        .denom-item-row {
            height: 22px !important;
            padding: 0 !important;
            gap: 3px !important;
        }

        .item-count-val {
            font-size: 12px !important;
            font-weight: 600 !important;
        }

        .denom-diamond-img {
            width: 11px !important;
            height: 11px !important;
        }
    }

    .payment-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px !important;
    }

    .payment-card-box {
        padding: 10px 12px !important;
        gap: 10px !important;
        min-height: 72px !important;
        border-radius: 6px !important;
    }

    .payment-card-box.compact-mode {
        padding: 12px 12px !important;
    }

    .payment-brand-left-col {
        width: 62px !important;
        gap: 3px !important;
    }

    .payment-card-box.compact-mode .payment-brand-left-col {
        width: 100% !important;
        gap: 10px !important;
    }

    .payment-brand-logo {
        height: 46px !important;
        max-width: 58px !important;
    }

    .payment-brand-name {
        font-size: 11.5px !important;
        line-height: 1.2 !important;
    }

    .payment-card-box.compact-mode .payment-brand-name {
        font-size: 13.5px !important;
        font-weight: 700 !important;
        line-height: 1.25 !important;
    }

    .payment-instruction-box {
        font-size: 12.5px !important;
        margin-bottom: 14px !important;
    }

    .payment-price-row {
        font-size: 14.5px !important;
    }

    .payment-so-icon {
        width: 16px !important;
        height: 16px !important;
    }

    .payment-items-val {
        font-size: 11px !important;
    }

    .payment-diamond-img {
        width: 10px !important;
        height: 10px !important;
    }

    .payment-hot-badge {
        top: 4px !important;
        right: 4px !important;
        font-size: 8.5px !important;
        padding: 1px 4px !important;
    }

    .checkout-details-list {
        padding: 0 16px !important;
        gap: 12px !important;
    }

    .checkout-detail-row {
        font-size: 13px !important;
        align-items: flex-start !important;
    }

    .detail-label {
        min-width: 100px !important;
        flex-shrink: 0 !important;
        white-space: nowrap !important;
    }

    .detail-value {
        text-align: right !important;
        word-break: break-word !important;
    }

    .checkout-divider {
        margin: 16px 16px !important;
    }

    .checkout-qr-section {
        padding: 0 16px 24px 16px !important;
    }

    .result-main-container,
    .checkout-main-container,
    .loading-main-container {
        background-image: url('/bgr/FF-06d91604.png') !important;
        background-position: center top !important;
        background-repeat: no-repeat !important;
        background-size: cover !important;
    }

    .result-bg-illustration {
        display: block !important;
        opacity: 0.15 !important;
        width: 220px !important;
        height: 180px !important;
        top: 40px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }

    .payment-filter-reset-bar {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 8px 12px !important;
        margin-top: 10px !important;
        margin-bottom: 10px !important;
        font-size: 12px !important;
    }

    .btn-reset-filter {
        padding: 3px 10px !important;
        font-size: 12px !important;
    }
}

.zalo-hotline-float {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 99999;
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    cursor: pointer;
    transition: bottom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.zalo-hotline-float.has-sticky-footer {
    bottom: 90px;
}

.zalo-hotline-float:hover {
    transform: translateY(-4px) scale(1.05);
}

.zalo-icon-wrapper {
    position: relative;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #0068ff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 18px rgba(0, 104, 255, 0.45);
    overflow: hidden;
    z-index: 2;
    transition: box-shadow 0.3s ease;
}

.zalo-hotline-float:hover .zalo-icon-wrapper {
    box-shadow: 0 6px 24px rgba(0, 104, 255, 0.65);
}

.zalo-icon-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.zalo-pulse-ring {
    position: absolute;
    right: 0;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: rgba(0, 104, 255, 0.5);
    z-index: 1;
    animation: zalo-pulse-anim 2s infinite ease-out;
}

@keyframes zalo-pulse-anim {
    0% {
        transform: scale(1);
        opacity: 0.85;
    }
    100% {
        transform: scale(1.75);
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .zalo-hotline-float {
        right: 14px;
        bottom: 16px;
    }
    .zalo-hotline-float.has-sticky-footer {
        bottom: 85px;
    }
    .zalo-icon-wrapper,
    .zalo-pulse-ring {
        width: 46px;
        height: 46px;
    }
}
</style>
