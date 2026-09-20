<script setup>
import { watch, onUnmounted } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close', 'confirm']);

const handleClose = () => {
    emit('close');
};

const handleConfirm = () => {
    emit('confirm');
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
    <transition name="fade">
        <div
            v-if="isOpen"
            class="logout-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            @click.self="handleClose"
        >
            <div class="logout-modal-card">
                <h3 id="logout-modal-title" class="logout-modal-title">
                    Không phải tài khoản của bạn?
                </h3>
                <p class="logout-modal-desc">
                    Vui lòng đăng xuất và đăng nhập bằng tài khoản<br />khác của bạn
                </p>
                <div class="logout-modal-actions">
                    <button id="btn-modal-logout-cancel" type="button" class="btn-modal-cancel" @click="handleClose">
                        Hủy
                    </button>
                    <button id="btn-modal-logout-confirm" type="button" class="btn-modal-logout" @click="handleConfirm">
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.logout-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
}

.logout-modal-card {
    background-color: #ffffff;
    border-radius: 12px;
    width: 100%;
    max-width: 320px;
    padding: 22px 18px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
}

.logout-modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 10px 0;
    line-height: 1.3;
}

.logout-modal-desc {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.45;
    margin: 0 0 20px 0;
}

.logout-modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.btn-modal-cancel {
    flex: 1;
    height: 38px;
    background-color: #ffffff;
    border: 1px solid rgb(216, 26, 13);
    color: rgb(216, 26, 13);
    font-size: 14px;
    font-weight: 700;
    border-radius: 8px;
    cursor: pointer;
    transition: all 150ms ease;
}

.btn-modal-cancel:hover {
    background-color: #fff0f2;
}

.btn-modal-logout {
    flex: 1;
    height: 38px;
    background-color: rgb(216, 26, 13);
    border: 1px solid rgb(216, 26, 13);
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    border-radius: 8px;
    cursor: pointer;
    transition: all 150ms ease;
}

.btn-modal-logout:hover {
    background-color: rgb(216, 26, 13);
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
