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
        clearCart: "Clear Cart",
        selectPaymentMethod: "Select Payment Method",

        // Benefits
        freeShipping: "Free Shipping",
        freeShippingDesc: "Free shipping for order above $180",
        flexiblePayment: "Flexible Payment",
        flexiblePaymentDesc: "Multiple secure payment options",
        support24x7: "24×7 Support",
        supportDesc: "We support online all days.",

        // Footer Corrections
        company: "Company",
        career: "Careers",
        customerServices: "Customer Service",
        trackOrder: "Track Order",
        return: "Returns",
        faq: "FAQ",
        ourInformation: "Information",
        privacy: "Privacy Policy",
        termsCondition: "Terms & Conditions",
        returnPolicy: "Return Policy",
        contactInfo: "Contact Info",
        copyright: "All Rights Reserved",
        footerDesc: "Homesta helps you turn your home into a dream oasis through expert selection, design, and implementation of furniture, decor, and smart solutions.",
        signUpOffer: "Sign up and get 20% off your first order.",
    },
    ar: {
        // Navbar & General
        home: "الرئيسية",
        all: "الكل",
        shop: "المتجر",
        categories: "التصنيفات",
        aboutUs: "من نحن",
        contactUs: "تواصل معنا",
        blog: "المدونة",
        signIn: "تسجيل الدخول",
        signUp: "اشتراك",
        logOut: "تسجيل الخروج",
        myAccount: "حسابي",
        sellerDashboard: "لوحة البائع",
        search: "بحث",
        callUs: "اتصل بنا: 789-456-123+",
        signUpOffer: "سجل واحصل على خصم 20٪ على طلبك الأول.",
        signUpNow: "سجل الآن",

        // Footer
        company: "الشركة",
        career: "وظائف",
        customerServices: "خدمة العملاء",
        trackOrder: "تتبع طلبك",
        return: "استرجاع",
        faq: "الأسئلة الشائعة",
        ourInformation: "معلوماتنا",
        privacy: "الخصوصية",
        termsCondition: "الشروط والأحكام",
        returnPolicy: "سياسة الاسترجاع",
        contactInfo: "معلومات التواصل",
        copyright: "جميع الحقوق محفوظة",
        footerDesc: "هومستا تساعدك على تحويل منزلك إلى واحة أحلامك من خلال اختيار وتصميم وتنفيذ الأثاث والديكور والحلول الذكية بخبرة احترافية.",

        // Benefits
        freeShipping: "شحن مجاني",
        freeShippingDesc: "شحن مجاني للطلبات فوق 180 دولار",
        flexiblePayment: "دفع مرن",
        flexiblePaymentDesc: "خيارات دفع آمنة متعددة",
        support24x7: "دعم فني 24/7",
        supportDesc: "نحن ندعمك عبر الإنترنت طوال أيام الأسبوع.",

        // Products & Filters
        inventory: "المخزون",
        myProducts: "منتجاتي",
        manageShowroom: "أدر قطع المعرض وحافظ على تحديث مخزونك.",
        addNewProduct: "إضافة منتج جديد",
        searchInventory: "بحث في المخزون...",
        subcategory: "تصنيف فرعي",
        continueShopping: "مواصلة التسوق",
        errorLoading: "خطأ في تحميل المنتجات",
        retry: "إعادة المحاولة",
        noProductsFound: "لم يتم العثور على منتجات",
        createProduct: "إنشاء منتج",
        stock: "المخزون",
        status: "الحالة",
        actions: "إجراءات",
        productAnalysis: "تحليل المنتج",
        marketPrice: "سعر السوق",
        stockAvailable: "المخزون المتاح",
        rating: "التقييم",
        activeDiscount: "الخصم النشط",
        colorVariations: "خيارات الألوان",
        customerFeedback: "آراء العملاء",
        noReviews: "لا توجد مراجعات لهذه القطعة بعد.",
        outOfStock: "نفذت الكمية",
        lowStock: "مخزون منخفض",
        off: "خصم",
        viewDetails: "عرض التفاصيل",
        editProduct: "تعديل المنتج",
        deleteProduct: "حذف المنتج",
        deleteConfirmTitle: "حذف المنتج؟",
        deleteConfirmMsg: "لا يمكن التراجع عن هذا الإجراء. ستتم إزالة هذه القطعة نهائيًا من معرضك.",
        delete: "حذف",
        cancel: "إلغاء",

        // Cart & Checkout (Existing + Extensions)
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
        addToCart: "أضف إلى السلة",
        adding: "جاري الإضافة...",
        buyNow: "شراء الآن",
        inStock: "متوفر",
        available: "متاح",
        selectedColor: "اللون المحدد",
        none: "لا شيء",
        description: "الوصف",
        reviews: "المراجعات",
        premiumMaterials: "مواد ممتازة",
        modernDesign: "تصميم حديث",
        durableConstruction: "بناء متين",
        easyMaintenance: "سهولة الصيانة",
        basedOn: "بناءً على",
        review_s: "مراجعة",
        writeReview: "اكتب مراجعة",
        submitReview: "إرسال المراجعة",
        yourRating: "تقييمك",
        yourReview: "مراجعتك",
        loginToReview: "يرجى تسجيل الدخول لكتابة مراجعة.",
        relatedProducts: "منتجات ذات صلة",
        viewProduct: "عرض المنتج",
        addToCartSuccess: "تمت إضافة المنتج إلى السلة بنجاح",
        stockLimitReached: "تم الوصول إلى حد المخزون",
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
        dealsOfDay: "صفقات الـيوم",
        buyNow: "اشتر الآن",
        shopNow: "تسوق الآن",
        freeShipping: "شحن مجاني",
        freeShippingDesc: "شحن مجاني للطلبات فوق 180$",
        flexiblePayment: "دفع مرن",
        flexiblePaymentDesc: "خيارات دفع آمنة متعددة",
        support: "دعم 24/7",
        supportDesc: "دعم فني على مدار اليوم",
        chairs: "كراسي",
        sofa: "كنب",
        lighting: "إضاءة",
        itemsCount: "منتج",
        discoverQuality: "اكتشف جودة استثنائية وأسلوبًا مميزًا مع عروضنا اليومية. نقدم لك أرقى قطع الأثاث لتغيير مساحة معيشتك بأقل الأسعار.",
        woodChairCollection: "مجموعة الكراسي الخشبية",
        handcraftedMasterpieces: "تحف خشبية مصنوعة يدوياً لأناقة خالدة في منزلك.",
        modernSofaCollection: "مجموعة الكنب المودرن",
        exclusiveRange: "اكتشف مجموعتنا الحصرية من الكنب المريح.",

        // Hero Section
        heroTitle: "أثاث عصري،",
        heroSubtitle: "لنمط حياة بسيط",
        heroDesc: "استمتع بالأناقة والوظائفية مع مجموعتنا الجديدة، المصممة للارتقاء بمستوى راحتك.",
        exploreMore: "اكتشف المزيد",

        // Products
        ourProducts: "منتجاتنا",
        viewAll: "عرض الكل",
        featured: "متميز",
        newArrival: "جديدنا",
        bestSeller: "الأكثر مبيعاً",
    }
};

// Update English as well
translations.en = {
    ...translations.en,
    heroTitle: "Modern Furniture,",
    heroSubtitle: "For Minimalist Lifestyle",
    heroDesc: "Experience elegance and functionality with our new collection, designed to elevate your living comfort.",
    exploreMore: "Explore More",
    ourProducts: "Our Products",
    viewAll: "View All",
    featured: "Featured",
    newArrival: "New Arrival",
    bestSeller: "Best Seller",
};

import GlobalAlert from '../components/GlobalAlert';

export const AppProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'usd');
    const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    useEffect(() => {
        localStorage.setItem('language', language);
        if (language === 'ar') {
            // Keeping direction LTR to maintain layout structure/responsiveness
            document.dir = 'ltr';
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
        const numPrice = Number(price) || 0;
        if (currency === 'eg') {
            const egpPrice = numPrice * 50;
            return language === 'ar'
                ? `${egpPrice.toLocaleString('ar-EG')} جنيه مصري`
                : `${egpPrice.toLocaleString('en-EG')} EGP`;
        }
        return `$${numPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const showAlert = (message, type = 'info', title = '') => {
        setAlert({ isOpen: true, message, type, title });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isOpen: false }));
    };

    const value = {
        language,
        setLanguage,
        currency,
        setCurrency,
        formatPrice,
        t,
        showAlert
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            <GlobalAlert
                {...alert}
                onClose={closeAlert}
            />
        </AppContext.Provider>
    );
};
