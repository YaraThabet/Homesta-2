import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

const translations = {
    en: {
        home: "Home",
        cart: "Shopping Cart",
        shipping: "Shipping",
        payment: "Payment",
        summary: "Summary",
        checkout: "Checkout",
        subtotal: "Subtotal",
        tax: "Tax",
        total: "Total",
        placeOrder: "Place Order",
        chatWithSeller: "Chat with seller",
        backToHome: "Back to home",
        shippingAddress: "Shipping Address",
        paymentMethod: "Payment Method",
        orderItems: "Order Items",
        items: "Items",
        item: "Item",
        couponDiscount: "Coupon Discount",
        confirmPayment: "Confirm Payment",
        proceedToPayment: "Proceed to Payment",
        proceedToCheckout: "Proceed to Checkout",
        orderSummary: "Order Summary",
        product: "Product",
        price: "Price",
        quantity: "Quantity",
        cartEmpty: "Your cart is empty",
        selectColor: "Select Color",
        color: "Color",
        couponCode: "Coupon Code",
        applyCoupon: "Apply Coupon",
        clearCart: "Clear Shopping Cart",
        selectPaymentMethod: "Select Payment Method",
        linkAccount: "Link account",
        addNewCard: "Add New Credit/ Debit Card",
        cardHolderName: "Card Holder Name",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        cvv: "CVV",
        saveCard: "Save card for future payments",
        addCard: "Add Card",
        orderPlacedSuccess: "Order placed successfully!",
    },
    ar: {
        home: "الرئيسية",
        cart: "سلة التسوق",
        shipping: "الشحن",
        payment: "الدفع",
        summary: "الملخص",
        checkout: "إتمام الطلب",
        subtotal: "المجموع الفرعي",
        tax: "الضريبة",
        total: "الإجمالي",
        placeOrder: "إتمام الطلب",
        chatWithSeller: "تحدث مع البائع",
        backToHome: "العودة للرئيسية",
        shippingAddress: "عنوان الشحن",
        paymentMethod: "طريقة الدفع",
        orderItems: "عناصر الطلب",
        items: "العناصر",
        item: "عنصر",
        couponDiscount: "خصم الكوبون",
        confirmPayment: "تأكيد الدفع",
        proceedToPayment: "المتابعة للدفع",
        proceedToCheckout: "المتابعة لإتمام الطلب",
        orderSummary: "ملخص الطلب",
        product: "المنتج",
        price: "السعر",
        quantity: "الكمية",
        cartEmpty: "سلة التسوق فارغة",
        selectColor: "اختر اللون",
        color: "اللون",
        couponCode: "رمز الكوبون",
        applyCoupon: "تطبيق الكوبون",
        clearCart: "مسح السلة",
        selectPaymentMethod: "اختر طريقة الدفع",
        linkAccount: "ربط الحساب",
        addNewCard: "إضافة بطاقة ائتمان جديدة",
        cardHolderName: "اسم صاحب البطاقة",
        cardNumber: "رقم البطاقة",
        expiryDate: "تاريخ الانتهاء",
        cvv: "الرمز السري",
        saveCard: "حفظ البطاقة للمدفوعات المستقبلية",
        addCard: "إضافة البطاقة",
        orderPlacedSuccess: "تم تقديم الطلب بنجاح!",
    }
};

export const AppProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'usd');

    useEffect(() => {
        localStorage.setItem('language', language);
        if (language === 'ar') {
            document.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.dir = 'ltr';
            document.documentElement.lang = 'en';
        }
    }, [language]);

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    const t = (key) => {
        const langData = translations[language] || translations['en'];
        return langData[key] || key;
    };

    const formatPrice = (price) => {
        if (currency === 'eg') {
            const egpPrice = price * 50;
            return language === 'ar'
                ? `${egpPrice.toLocaleString('ar-EG')} جنيه مصري`
                : `${egpPrice.toLocaleString('en-EG')} EGP`;
        }
        return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const value = {
        language,
        setLanguage,
        currency,
        setCurrency,
        formatPrice,
        t,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
