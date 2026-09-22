import { sepayConfig } from '../config/sepay';

/**
 * Generate unique 19-digit transaction ID (e.g. 9643477460489410227)
 */
export const generatePaymentCode = () => {
    const part1 = Math.floor(100000000 + Math.random() * 900000000).toString();
    const part2 = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    return part1 + part2;
};

export const getVietQrUrl = (amount, paymentCode) => {
    const bank = sepayConfig.bank || 'ACB';
    const acc = sepayConfig.accountNo || '43580797';
    const holder = encodeURIComponent(sepayConfig.accountName || 'PHAN HOANG MINH');
    const template = sepayConfig.template || 'compact2';
    const showinfo = sepayConfig.showinfo || 'false';
    const des = encodeURIComponent(paymentCode);

    return `https://vietqr.app/img?bank=${bank}&acc=${acc}&amount=${amount}&des=${des}&template=${template}&showinfo=${showinfo}&holder=${holder}`;
};

/**
 * Check SePay API for matching completed transfer
 * SePay API Endpoint: GET https://my.sepay.vn/userapi/transactions/list
 */
export const checkSePayTransaction = async (paymentCode, amount) => {
    const token = sepayConfig.apiToken?.trim();

    if (!token) {
        // If no SePay API Token provided, return false (user can use manual "Confirm" button or enter API token in settings)
        return { success: false, reason: 'NO_TOKEN' };
    }

    try {
        const response = await fetch('https://my.sepay.vn/userapi/transactions/list?limit=20', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return { success: false, reason: 'HTTP_ERROR', status: response.status };
        }

        const data = await response.json();
        if (data && data.transactions && Array.isArray(data.transactions)) {
            const match = data.transactions.find((tx) => {
                const content = (tx.transaction_content || tx.content || '').toUpperCase();
                const txAmount = parseFloat(tx.amount_in || tx.amount || 0);
                const codeMatch = content.includes(paymentCode.toUpperCase());
                const amountMatch = txAmount >= amount;
                return codeMatch && amountMatch;
            });

            if (match) {
                return { success: true, transaction: match };
            }
        }

        return { success: false, reason: 'NOT_FOUND' };
    } catch (error) {
        console.warn('SePay API check failed:', error);
        return { success: false, reason: 'FETCH_ERROR', error: error.message };
    }
};
