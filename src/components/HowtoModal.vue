<template>
    <Teleport to="body">
        <Transition name="howto-fade">
            <div v-if="show" class="howto-modal-overlay" @click.self="handleClose">
                <div class="howto-modal-card" role="dialog" aria-modal="true" aria-label="Hướng dẫn lấy ID người chơi">
                    <div class="howto-img-container">
                        <img 
                            src="/img/howto/ff (1).jpg" 
                            alt="Hướng dẫn lấy ID người chơi Free Fire" 
                            class="howto-guide-image"
                        />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'update:show']);

const handleClose = () => {
    emit('update:show', false);
    emit('close');
};

const handleKeyDown = (e) => {
    if (e.key === 'Escape' && props.show) {
        handleClose();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.howto-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    padding: 16px;
}

.howto-modal-card {
    position: relative;
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    background: #0d0d0d;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.howto-close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 20;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.howto-close-btn:hover {
    background: rgb(216, 26, 13);
    border-color: rgb(216, 26, 13);
    transform: scale(1.08);
}

.howto-img-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.howto-guide-image {
    width: 100%;
    height: auto;
    max-height: 85vh;
    object-fit: contain;
    display: block;
    border-radius: 12px;
}

/* Modal Transition */
.howto-fade-enter-active,
.howto-fade-leave-active {
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.howto-fade-enter-from,
.howto-fade-leave-to {
    opacity: 0;
}

.howto-fade-enter-active .howto-modal-card {
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.howto-fade-leave-active .howto-modal-card {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.howto-fade-enter-from .howto-modal-card {
    opacity: 0;
    transform: scale(0.92) translateY(-12px);
}

.howto-fade-leave-to .howto-modal-card {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}

/* Media queries for Tablet and Mobile optimization */
@media (max-width: 768px) {
    .howto-modal-card {
        max-width: 480px;
        border-radius: 10px;
    }
    .howto-close-btn {
        width: 30px;
        height: 30px;
        top: 8px;
        right: 8px;
    }
}

@media (max-width: 480px) {
    .howto-modal-overlay {
        padding: 12px;
    }
    .howto-modal-card {
        max-width: 100%;
        border-radius: 8px;
    }
    .howto-close-btn {
        width: 28px;
        height: 28px;
        top: 6px;
        right: 6px;
    }
}
</style>
