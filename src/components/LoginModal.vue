<script setup>
import { watch, onUnmounted } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    activeGame: {
        type: Object,
        required: true,
    },
    playerId: {
        type: String,
        default: '',
    },
    playerError: {
        type: String,
        default: '',
    },
    isVerifyingPlayer: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:playerId', 'close', 'submit', 'openHowto']);

const handleInput = (e) => {
    const sanitized = e.target.value.replace(/\D/g, '');
    e.target.value = sanitized;
    emit('update:playerId', sanitized);
};

const handleClose = () => {
    emit('close');
};

const handleSubmit = () => {
    emit('submit');
};

watch(
    () => props.isOpen,
    (val) => {
        if (typeof document !== 'undefined') {
            if (val) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    },
    { immediate: true }
);

onUnmounted(() => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
    }
});
</script>

<template>
    <Teleport to="body">
        <transition name="modal-fade">
            <div
                v-if="isOpen"
                class="login-modal-overlay"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-game-title"
                @click.self="handleClose"
            >
                <div class="login-modal-card">
                    <!-- Top Banner Header with Close 'X' Button on TOP-LEFT per Image 4 -->
                    <div
                        class="login-modal-banner-header"
                        :style="{ backgroundImage: `url(${activeGame.banner})` }"
                    >
                        <button type="button" class="modal-close-btn" aria-label="Đóng cửa sổ" @click="handleClose">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Modal Content Body -->
                    <div class="login-modal-body">
                        <!-- Game Header Info Row with Avatar (NO HOT BADGE) -->
                        <div class="modal-game-info-row">
                            <div class="modal-game-icon-box">
                                <img :src="activeGame.icon" :alt="activeGame.name" class="modal-game-icon-img" />
                            </div>
                            <div class="modal-game-text-meta">
                                <h3 id="modal-game-title" class="modal-game-name" style="margin-top: 12px;">{{ activeGame.name }}</h3>
                                <p class="modal-game-subtext">Đăng nhập để xem thêm khuyến mãi</p>
                            </div>
                        </div>

                        <!-- Form Section -->
                        <div class="modal-form-content">
                            <label for="modal-input-uid" class="modal-input-label">
                                ID người chơi
                                <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" class="info-icon-svg" aria-hidden="true"
                                    @click.prevent.stop="emit('openHowto')" role="button" tabIndex="0">
                                    <circle cx="8" cy="8" r="6.5" stroke="#909399" stroke-width="1.2" fill="none"/>
                                    <text x="8" y="11.2" font-size="9.5" font-weight="600" fill="#909399" text-anchor="middle" font-family="Arial, sans-serif">?</text>
                                </svg>
                            </label>

                            <!-- Joined Input & Submit Button Row matching Image 4 -->
                            <div class="modal-input-joined-group">
                                <div class="modal-input-wrapper">
                                    <input
                                        id="modal-input-uid"
                                        :value="playerId"
                                        type="text"
                                        inputmode="numeric"
                                        class="modal-input-joined"
                                        placeholder="Hãy nhập UID của bạn"
                                        :aria-invalid="!!playerError"
                                        aria-describedby="modal-uid-error"
                                        @input="handleInput"
                                        @keyup.enter="handleSubmit"
                                    />
                                </div>
                                <button
                                    class="modal-btn-submit"
                                    type="button"
                                    :disabled="isVerifyingPlayer"
                                    @click="handleSubmit"
                                >
                                    {{ isVerifyingPlayer ? 'Đang...' : 'Đăng nhập' }}
                                </button>
                            </div>
                            <p v-if="playerError" id="modal-uid-error" class="login-error-msg" role="alert">
                                {{ playerError }}
                            </p>

                            <!-- Divider -->
                            <div class="modal-divider-row">
                                <span class="divider-line"></span>
                                <span class="divider-text">Hoặc đăng nhập bằng tài khoản game của bạn</span>
                                <span class="divider-line"></span>
                            </div>

                            <!-- Social Icons Row -->
                            <div class="modal-social-row" role="group" aria-label="Đăng nhập bằng tài khoản game">
                                <button class="modal-social-btn fb" type="button" aria-label="Đăng nhập Facebook">
                                    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M25 14.0672C25 7.95496 20.0751 3 14 3C7.92486 3 3 7.95496 3 14.0672C3 19.5912 7.02254 24.1697 12.2812 25V17.2663H9.48828V14.0672H12.2812V11.629C12.2812 8.85525 13.9235 7.32313 16.4361 7.32313C17.6396 7.32313 18.8984 7.53929 18.8984 7.53929V10.2629H17.5114C16.1449 10.2629 15.7188 11.116 15.7188 11.9912V14.0672H18.7695L18.2818 17.2663H15.7188V25C20.9775 24.1697 25 19.5912 25 14.0672Z" fill="#ffffff"></path>
                                    </svg>
                                </button>
                                <button class="modal-social-btn google" type="button" aria-label="Đăng nhập Google">
                                    <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_modal_google)">
                                            <path d="M8.18376 14.0001C8.18376 13.3651 8.29209 12.756 8.48376 12.1851L5.11876 9.66846C4.44268 11.0122 4.09159 12.4959 4.09376 14.0001C4.09376 15.5568 4.46209 17.0251 5.11709 18.3285L8.48043 15.8076C8.28432 15.2252 8.18412 14.6147 8.18376 14.0001Z" fill="#FBBC05"></path>
                                            <path d="M14.0922 8.22266C15.5005 8.22266 16.773 8.71099 17.773 9.51099L20.6822 6.66682C18.9097 5.15599 16.6372 4.22266 14.0922 4.22266C10.1405 4.22266 6.74385 6.43516 5.11719 9.6849L8.48385 12.1852C9.25885 9.88016 11.4689 8.22266 14.0922 8.22266Z" fill="#EA4335"></path>
                                            <path d="M14.0922 19.7774C11.468 19.7774 9.25802 18.1199 8.48219 15.8149L5.11719 18.3316C6.74302 21.5649 10.1397 23.7774 14.0922 23.7774C16.5305 23.7774 18.8589 22.9299 20.6072 21.3408L17.4122 18.9224C16.5114 19.4783 15.3764 19.7774 14.0914 19.7774" fill="#34A853"></path>
                                            <path d="M23.6396 14.0002C23.6396 13.4227 23.5479 12.8002 23.4121 12.2227H14.0938V16.0002H19.4571C19.1896 17.2885 18.4596 18.2785 17.4154 18.9227L20.6096 21.341C22.4454 19.6727 23.6396 17.1877 23.6396 14.0002Z" fill="#4285F4"></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_modal_google">
                                                <rect width="28" height="28" fill="white"></rect>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                                <button class="modal-social-btn x-btn" type="button" aria-label="Đăng nhập Twitter X">
                                    <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.7124 12.3123L22.4133 4.5H20.8254L15.0071 11.2833L10.3599 4.5H5L12.0274 14.7576L5 22.95H6.58799L12.7324 15.7866L17.6401 22.95H23L15.7121 12.3123H15.7124ZM13.5375 14.848L12.8255 13.8265L7.16017 5.69895H9.59922L14.1712 12.2582L14.8832 13.2796L20.8262 21.8056H18.3871L13.5375 14.8484V14.848Z" fill="#111111"></path>
                                    </svg>
                                </button>
                                <button class="modal-social-btn vk-btn" type="button" aria-label="Đăng nhập VK">
                                    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4646 25H13.5486H13.5485C8.57479 25 6.0888 25 4.5444 23.4556C3 21.9112 3 19.4252 3 14.4647V14.4646V13.5354V13.5354C3 8.57392 3 6.0888 4.5444 4.54441C6.0888 3 8.5748 3 13.5486 3H14.4646C19.4375 3 21.9376 3 23.4688 4.54441C25 6.0888 25 8.57568 25 13.5354V14.4646V14.5897C25.0001 19.4671 25.0002 21.9242 23.4688 23.4556C21.9244 25 19.4375 25 14.4647 25H14.4646ZM6.71055 9.70059C6.82759 15.4197 9.83807 18.8614 14.7986 18.8614H15.0864V15.5895C16.8921 15.7726 18.2403 17.1207 18.7903 18.8614H21.3942C20.6876 16.2575 18.8554 14.8178 17.7167 14.2678C18.8554 13.5875 20.4649 11.9384 20.8442 9.70059H18.4761C17.9781 11.5195 16.4997 13.1687 15.0864 13.3253V9.70059H12.6778V16.048C11.2126 15.6846 9.30127 13.9017 9.22295 9.70059H6.71055Z" fill="#ffffff"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<style scoped>
.login-modal-overlay {
    font-family: Roboto, Noto Sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
}

.login-modal-card {
    background-color: #ffffff;
    border-radius: 14px;
    width: 100%;
    max-width: 440px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.25);
}

.login-modal-banner-header {
    height: 130px;
    background-size: cover;
    background-position: center;
    position: relative;
}

/* Close button on TOP-LEFT per Image 4 */
.modal-close-btn {
    position: absolute;
    top: 12px;
    left: 12px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0);
    border: none;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.15s ease;
    z-index: 10;
    outline: none;
}

.modal-close-btn:hover {
    background-color: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
}

.modal-close-btn:active {
    transform: scale(0.92);
}

.login-modal-body {
    padding: 0 24px 24px 24px;
    position: relative;
}

.modal-game-info-row {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    margin-top: -24px;
    margin-bottom: 24px;
    position: relative;
    z-index: 2;
}

.modal-game-icon-box {
    position: relative;
    width: 62px;
    height: 62px;
    flex-shrink: 0;
}

.modal-game-icon-img {
    width: 62px;
    height: 62px;
    border-radius: 14px;
    object-fit: cover;
    border: 3px solid #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    background-color: #ffffff;
}

.modal-game-text-meta {
    padding-top: 24px;
}

.modal-game-name {
    font-size: 17px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 2px 0;
    line-height: 1.2;
}

.modal-game-subtext {
    font-size: 13px;
    color: #8c8c8c;
    margin: 0;
}

.modal-input-label {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    margin-top: 24px;
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

/* Joined Input & Button Group Side-by-Side */
.modal-input-joined-group {
    display: flex;
    align-items: center;
    gap: 0;
    width: 100%;
}

.modal-input-wrapper {
    position: relative;
    flex: 1;
}

.modal-input-joined {
    width: 100%;
    height: 40px;
    padding: 0 14px;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-right: none;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    font-size: 14px;
    color: #303133;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
}

.modal-input-joined:focus,
.modal-input-joined:focus-visible {
    border-color: #dcdfe6;
    outline: none;
    box-shadow: none;
}

.modal-btn-submit:focus,
.modal-btn-submit:focus-visible {
    outline: none;
    box-shadow: none;
}

.login-error-msg {
    color: rgb(216, 26, 13);
    font-size: 12px;
    margin: 6px 0 0 0;
}

.modal-btn-submit {
    height: 40px;
    padding: 0 20px;
    background-color: #d81a0d;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    border: 1px solid #d81a0d;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.15s ease, opacity 0.15s ease;
    flex-shrink: 0;
}

.modal-btn-submit:hover:not(:disabled) {
    background-color: #c01408;
}

.modal-btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.modal-divider-row {
    display: flex;
    align-items: center;
    margin: 20px 0 16px 0;
    gap: 12px;
}

.divider-line {
    flex: 1;
    height: 1px;
    background-color: #e5e7eb;
}

.divider-text {
    font-size: 12px;
    color: #8c8c8c;
    white-space: nowrap;
}

.modal-social-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
}

.modal-social-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s ease, opacity 0.15s ease;
}

.modal-social-btn:hover {
    transform: translateY(-2px);
    opacity: 0.9;
}

.modal-social-btn.fb {
    background-color: #006AFC;
}

.modal-social-btn.google {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.modal-social-btn.x-btn {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.modal-social-btn.vk-btn {
    background-color: #0077FF;
}

/* Transition Animations (Top-to-Bottom Slide) */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-fade-enter-active .login-modal-card {
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

.modal-fade-leave-active .login-modal-card {
    transition: transform 0.3s cubic-bezier(0.32, 0, 0.67, 0), opacity 0.25s ease;
}

.modal-fade-enter-from {
    opacity: 0;
}

.modal-fade-enter-from .login-modal-card {
    opacity: 0;
    transform: translateY(-80px) scale(0.96);
}

.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-leave-to .login-modal-card {
    opacity: 0;
    transform: translateY(80px) scale(0.96);
}

/* Mobile Responsive Optimization matching Image 4 */
@media (max-width: 640px) {
    .login-modal-overlay {
        align-items: flex-end;
        padding: 0;
    }

    .login-modal-card {
        max-width: 100%;
        border-radius: 16px 16px 0 0;
        animation: slideUpMobile 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUpMobile {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }

    .login-modal-banner-header {
        height: 110px;
    }

    .login-modal-body {
        padding: 0 16px 20px 16px;
    }

    .modal-game-info-row {
        margin-top: -22px;
        margin-bottom: 14px;
        gap: 10px;
    }

    .modal-game-icon-box {
        width: 56px;
        height: 56px;
    }

    .modal-game-icon-img {
        width: 56px;
        height: 56px;
        border-radius: 12px;
    }

    .modal-game-text-meta {
        padding-top: 20px;
    }

    .modal-game-name {
        font-size: 16px;
    }

    .modal-game-subtext {
        font-size: 12px;
    }

    .modal-input-joined-group {
        gap: 6px;
    }

    .modal-input-joined {
        height: 38px;
        font-size: 13px;
    }

    .modal-btn-submit {
        height: 38px;
        padding: 0 16px;
        font-size: 13px;
    }
}
</style>
