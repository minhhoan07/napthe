import { reactive } from 'vue';

// Default SePay Bank & API Config
const STORAGE_KEY = 'napthe_sepay_config';

const defaultConfig = {
    bank: 'ACB',
    accountNo: '43580797',
    accountName: 'PHAN HOANG MINH',
    apiToken: '', // User can paste their SePay API Token here if needed
    template: 'compact2',
    showinfo: 'false'
};

// Load saved config from localStorage if available
const loadSavedConfig = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return { ...defaultConfig, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn('Could not read sepay config from localStorage', e);
    }
    return defaultConfig;
};

export const sepayConfig = reactive(loadSavedConfig());

export const saveSepayConfig = (newConfig) => {
    Object.assign(sepayConfig, newConfig);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sepayConfig));
    } catch (e) {
        console.warn('Could not save sepay config to localStorage', e);
    }
};
