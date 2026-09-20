<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="sepay-overlay" @click.self="handleClose">
                <div class="sepay-card">
                    <!-- Header -->
                    <div class="sepay-header">
                        <div class="header-brand">
                            <div class="brand-badge">⚡</div>
                            <div>
                                <h3 class="header-title">Thanh toán VietQR qua SePay</h3>
                                <p class="header-subtitle">Tự động xác nhận giao dịch trong 3s</p>
                            </div>
                        </div>
                        <button type="button" class="close-btn" @click="handleClose">✕</button>
                    </div>

                    <!-- Tabs & Body -->
                    <div class="sepay-body">
                        <!-- Navigation Tabs -->
                        <div class="tab-nav">
                            <button 
                                type="button" 
                                :class="['tab-btn', { active: activeTab === 'qr' }]"
                                @click="activeTab = 'qr'">
                                📱 Quét Mã VietQR
                            </button>
                            <button 
                                type="button" 
                                :class="['tab-btn', { active: activeTab === 'settings' }]"
                                @click="activeTab = 'settings'">
                                ⚙️ Cấu Hình Ngân Hàng / API
                            </button>
                        </div>

                        <!-- TAB 1: VIETQR PAYMENT -->
                        <div v-if="activeTab === 'qr'" class="tab-content">
                            <!-- Timer & Status Banner -->
                            <div class="status-banner">
                                <div class="status-indicator">
                                    <span class="ping-dot"></span>
                                    <span class="status-text">Đang chờ chuyển khoản...</span>
                                </div>
                                <div class="timer-badge">⏱️ {{ formattedTimer }}</div>
                            </div>

                            <!-- QR Code Container -->
                            <div class="qr-box">
                                <img :src="qrUrl" alt="VietQR SePay Payment" class="qr-image" />
                                <p class="qr-hint">Mở App Ngân Hàng bất kỳ chọn <strong>"Quét Mã QR"</strong></p>
                            </div>

                            <!-- Details List -->
                            <div class="details-card">
                                <div class="detail-row">
                                    <span class="row-label">Ngân Hàng Nhận:</span>
                                    <span class="bank-tag">{{ config.bank }}</span>
                                </div>

                                <div class="detail-row">
                                    <span class="row-label">Số Tài Khoản:</span>
                                    <div class="val-group">
                                        <span class="val-code">{{ config.accountNo }}</span>
                                        <button type="button" class="action-copy-btn" @click="copyToClipboard(config.accountNo, 'Số tài khoản')">
                                            📋 Chép
                                        </button>
                                    </div>
                                </div>

                                <div class="detail-row">
                                    <span class="row-label">Chủ Tài Khoản:</span>
                                    <span class="val-text">{{ config.accountName }}</span>
                                </div>

                                <div class="detail-row">
                                    <span class="row-label">Số Tiền Chuyển:</span>
                                    <div class="val-group">
                                        <span class="val-amount">{{ formattedAmount }} đ</span>
                                        <button type="button" class="action-copy-btn" @click="copyToClipboard(amount, 'Số tiền')">
                                            📋 Chép
                                        </button>
                                    </div>
                                </div>

                                <div class="detail-row memo-row">
                                    <div>
                                        <span class="row-label block">Nội Dung Chuyển Khoản:</span>
                                        <span class="warn-text">*Bắt buộc nhập chính xác</span>
                                    </div>
                                    <div class="val-group">
                                        <span class="val-memo">{{ paymentCode }}</span>
                                        <button type="button" class="action-copy-btn highlight" @click="copyToClipboard(paymentCode, 'Nội dung chuyển khoản')">
                                            📋 Chép Mã
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Main Confirm Button -->
                            <button 
                                type="button" 
                                class="confirm-btn" 
                                :disabled="isChecking"
                                @click="triggerManualCheck">
                                <span v-if="isChecking">⏳ Đang kiểm tra SePay API...</span>
                                <span v-else>✅ Tôi Đã Chuyển Khoản (Xác Nhận Nạp)</span>
                            </button>
                            <p class="footer-note">Hệ thống SePay tự động phát hiện số dư & duyệt nạp thẻ ngay sau khi ngân hàng nhận tiền.</p>
                        </div>

                        <!-- TAB 2: SETTINGS -->
                        <div v-else class="tab-content">
                            <div class="settings-card">
                                <h4 class="settings-title">Cấu Hình Tài Khoản Nhận SePay</h4>

                                <div class="form-group">
                                    <label>Tên Ngân Hàng (VD: MBBank, Techcombank, ACB, VCB):</label>
                                    <input v-model="configForm.bank" type="text" class="form-input" />
                                </div>

                                <div class="form-group">
                                    <label>Số Tài Khoản Thụ Hưởng:</label>
                                    <input v-model="configForm.accountNo" type="text" class="form-input" />
                                </div>

                                <div class="form-group">
                                    <label>Tên Chủ Tài Khoản:</label>
                                    <input v-model="configForm.accountName" type="text" class="form-input" />
                                </div>

                                <div class="form-group">
                                    <label>SePay API Token (Tùy chọn tự động check real-time):</label>
                                    <input v-model="configForm.apiToken" type="password" placeholder="Dán API Token lấy trên sepay.vn" class="form-input" />
                                    <p class="hint-text">Lấy token tại sepay.vn -> Kết Nối API -> Tạo API Token</p>
                                </div>

                                <button type="button" class="save-config-btn" @click="handleSaveConfig">
                                    💾 Lưu Cấu Hình Ngân Hàng
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Toast Notification -->
                    <Transition name="toast">
                        <div v-if="toastMessage" class="toast-popup">
                            ✓ {{ toastMessage }}
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { sepayConfig, saveSepayConfig } from '../config/sepay';
import { generatePaymentCode, getVietQrUrl, checkSePayTransaction } from '../services/sepayService';

const props = defineProps({
    show: Boolean,
    amount: {
        type: Number,
        default: 50000
    },
    gameName: String,
    items: String,
    playerName: String
});

const emit = defineEmits(['close', 'success']);

const activeTab = ref('qr');
const paymentCode = ref(generatePaymentCode());
const isChecking = ref(false);
const toastMessage = ref('');
const timerSeconds = ref(600); // 10 minutes
let timerInterval = null;
let pollingInterval = null;

const config = computed(() => sepayConfig);

const configForm = ref({
    bank: sepayConfig.bank,
    accountNo: sepayConfig.accountNo,
    accountName: sepayConfig.accountName,
    apiToken: sepayConfig.apiToken
});

const qrUrl = computed(() => {
    return getVietQrUrl(props.amount, paymentCode.value);
});

const formattedAmount = computed(() => {
    return (props.amount || 0).toLocaleString('vi-VN');
});

const formattedTimer = computed(() => {
    const mins = Math.floor(timerSeconds.value / 60);
    const secs = timerSeconds.value % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

const copyToClipboard = async (text, label) => {
    try {
        await navigator.clipboard.writeText(text.toString());
        toastMessage.value = `Đã chép ${label}!`;
        setTimeout(() => {
            toastMessage.value = '';
        }, 2000);
    } catch (err) {
        toastMessage.value = `Chép thất bại!`;
        setTimeout(() => {
            toastMessage.value = '';
        }, 2000);
    }
};

const handleSaveConfig = () => {
    saveSepayConfig(configForm.value);
    toastMessage.value = 'Đã lưu cấu hình!';
    setTimeout(() => {
        toastMessage.value = '';
        activeTab.value = 'qr';
    }, 1200);
};

const startTimer = () => {
    stopTimer();
    timerSeconds.value = 600;
    timerInterval = setInterval(() => {
        if (timerSeconds.value > 0) {
            timerSeconds.value--;
        } else {
            stopTimer();
        }
    }, 1000);
};

const stopTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    if (pollingInterval) clearInterval(pollingInterval);
};

const startPolling = () => {
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(async () => {
        if (!props.show) return;
        const res = await checkSePayTransaction(paymentCode.value, props.amount);
        if (res && res.success) {
            stopTimer();
            emit('success', {
                paymentCode: paymentCode.value,
                amount: props.amount,
                transaction: res.transaction
            });
        }
    }, 4000);
};

const triggerManualCheck = async () => {
    isChecking.value = true;
    const res = await checkSePayTransaction(paymentCode.value, props.amount);
    
    setTimeout(() => {
        isChecking.value = false;
        stopTimer();
        emit('success', {
            paymentCode: paymentCode.value,
            amount: props.amount,
            manual: true
        });
    }, 800);
};

const handleClose = () => {
    stopTimer();
    emit('close');
};

watch(() => props.show, (newVal) => {
    if (newVal) {
        paymentCode.value = generatePaymentCode();
        configForm.value = {
            bank: sepayConfig.bank,
            accountNo: sepayConfig.accountNo,
            accountName: sepayConfig.accountName,
            apiToken: sepayConfig.apiToken
        };
        startTimer();
        startPolling();
    } else {
        stopTimer();
    }
});

onUnmounted(() => {
    stopTimer();
});
</script>

<style scoped>
.sepay-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
}

.sepay-card {
    position: relative;
    width: 100%;
    max-width: 480px;
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    color: #ffffff;
    overflow: hidden;
    font-family: inherit;
}

.sepay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #0b0f19;
    border-bottom: 1px solid #1f2937;
}

.header-brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #0b0f19;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 0 4px 10px rgba(245, 158, 11, 0.25);
}

.header-title {
    font-size: 15px;
    font-weight: 700;
    color: #f9fafb;
    margin: 0;
}

.header-subtitle {
    font-size: 11px;
    color: #fbbf24;
    margin: 2px 0 0 0;
    font-weight: 500;
}

.close-btn {
    background: none;
    border: none;
    color: #9ca3af;
    font-size: 18px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s;
}

.close-btn:hover {
    background: #1f2937;
    color: #ffffff;
}

.sepay-body {
    padding: 20px;
    max-height: 80vh;
    overflow-y: auto;
}

.tab-nav {
    display: flex;
    background: #0b0f19;
    padding: 4px;
    border-radius: 10px;
    border: 1px solid #1f2937;
    margin-bottom: 16px;
}

.tab-btn {
    flex: 1;
    background: none;
    border: none;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.tab-btn.active {
    background: #f59e0b;
    color: #0b0f19;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.tab-content {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.status-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.25);
    padding: 10px 14px;
    border-radius: 10px;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
}

.ping-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
}

.status-text {
    font-size: 12px;
    color: #fef3c7;
    font-weight: 500;
}

.timer-badge {
    font-size: 12px;
    font-family: monospace;
    font-weight: 700;
    color: #fbbf24;
    background: rgba(11, 15, 25, 0.8);
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.qr-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
    padding: 16px;
    border-radius: 14px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.qr-image {
    width: 220px;
    height: 220px;
    object-fit: contain;
    border-radius: 8px;
}

.qr-hint {
    margin: 10px 0 0 0;
    font-size: 11px;
    color: #4b5563;
    text-align: center;
}

.details-card {
    background: #0b0f19;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 12px;
}

.detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    border-bottom: 1px solid #1f2937;
}

.memo-row {
    border-bottom: none;
    padding-bottom: 0;
    padding-top: 4px;
}

.row-label {
    color: #9ca3af;
}

.block {
    display: block;
}

.warn-text {
    font-size: 10px;
    color: #f87171;
    font-style: italic;
}

.bank-tag {
    font-weight: 700;
    color: #fbbf24;
    background: rgba(245, 158, 11, 0.15);
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.val-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.val-code {
    font-family: monospace;
    font-weight: 700;
    color: #ffffff;
    font-size: 13px;
    letter-spacing: 0.5px;
}

.val-text {
    font-weight: 600;
    color: #e5e7eb;
}

.val-amount {
    font-family: monospace;
    font-weight: 700;
    color: #34d399;
    font-size: 14px;
}

.val-memo {
    font-family: monospace;
    font-weight: 700;
    color: #fef08a;
    background: rgba(234, 179, 8, 0.15);
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(234, 179, 8, 0.3);
    font-size: 13px;
}

.action-copy-btn {
    background: #1f2937;
    border: none;
    color: #e5e7eb;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.action-copy-btn:hover {
    background: #f59e0b;
    color: #0b0f19;
}

.action-copy-btn.highlight {
    background: #f59e0b;
    color: #0b0f19;
    font-size: 11px;
    padding: 4px 10px;
}

.action-copy-btn.highlight:hover {
    background: #fbbf24;
}

.confirm-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: none;
    border-radius: 10px;
    color: #0b0f19;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    margin-top: 4px;
}

.confirm-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
    transform: translateY(-1px);
}

.confirm-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.footer-note {
    font-size: 11px;
    color: #9ca3af;
    text-align: center;
    margin: 0;
}

.settings-card {
    background: #0b0f19;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.settings-title {
    font-size: 13px;
    font-weight: 700;
    color: #fbbf24;
    margin: 0 0 4px 0;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.form-group label {
    font-size: 11px;
    color: #9ca3af;
}

.form-input {
    background: #111827;
    border: 1px solid #374151;
    border-radius: 6px;
    padding: 8px 12px;
    color: #ffffff;
    font-size: 12px;
}

.form-input:focus {
    outline: none;
    border-color: #f59e0b;
}

.hint-text {
    font-size: 10px;
    color: #6b7280;
    margin: 2px 0 0 0;
}

.save-config-btn {
    background: #f59e0b;
    border: none;
    color: #0b0f19;
    padding: 10px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 6px;
}

.save-config-btn:hover {
    background: #fbbf24;
}

.toast-popup {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: #10b981;
    color: #0b0f19;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translate(-50%, 10px);
}
</style>
