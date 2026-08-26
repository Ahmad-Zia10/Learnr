const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js"

//Razorpay's widget is loaded on demand; resolves false if it can't be fetched.
export const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);

        const script = document.createElement("script");
        script.src = RAZORPAY_SCRIPT;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
