# 💳 PaymentPage Flow Diagram

## Overview
The Payment Page is a React component that handles subscription payments via two methods: **Razorpay Modal** and **UPI QR Code**.

---

## 🔄 Main Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT PAGE LOADS                             │
│  (Gets plan from location.state or shows default)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        ▼                                  ▼
   [SELECT PAYMENT METHOD]           [RENDER UI]
   ├─ Card & NetBanking              ├─ Order Summary
   └─ UPI QR Code                    └─ Payment Options
        │                                  │
        └────────────────┬─────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        ▼                                  ▼
   MODAL PAYMENT                    QR CODE PAYMENT
```

---

## 🎯 Detailed Flow: MODAL PAYMENT (Cards & NetBanking)

```
USER CLICKS "Pay Now"
        │
        ▼
setLoading(true)
        │
        ▼
CREATE ORDER
│   └─ POST /api/v1/subscription-payment/create-order
│       ├─ Body: { planId }
│       ├─ Returns: { orderId, amount, key, planName }
│       └─ Toast: "Order created successfully!"
│
        ▼
RAZORPAY OPTIONS CONFIGURED
│   ├─ key: Razorpay API Key
│   ├─ amount: Total amount (price + GST)
│   ├─ order_id: From backend
│   ├─ handler: Payment success callback
│   ├─ prefill: Name, Email, Contact
│   └─ methods: UPI, Card, NetBanking, Wallet, PayLater
│
        ▼
RAZORPAY MODAL OPENS
│   ├─ User enters details
│   ├─ User completes payment
│   └─ User sees success/error
│
        ▼
PAYMENT HANDLER TRIGGERS
│   ├─ setVerifying(true) ← Full screen loader activates
│   ├─ Toast: "Verifying payment..."
│   │
│   ▼
│   VERIFY PAYMENT
│   │   └─ POST /api/v1/subscription-payment/verify
│   │       ├─ Body: {
│   │       │     razorpay_payment_id,
│   │       │     razorpay_order_id,
│   │       │     razorpay_signature,
│   │       │     planId
│   │       │  }
│   │       └─ Returns: { success: true/false }
│   │
│   ▼
│   IF SUCCESS:
│   │   ├─ Toast: "Payment verified! Redirecting..."
│   │   ├─ Wait 2 seconds
│   │   ├─ Call logoutApi()
│   │   ├─ logout() ← Clear auth context
│   │   └─ Redirect: /login?message=Please login again
│   │
│   ELSE:
│       └─ Toast: "Verification failed"
│           setVerifying(false)
│
        ▼
setLoading(false)
        │
        ▼
DONE
```

---

## 🔲 Detailed Flow: QR CODE PAYMENT (UPI)

```
USER CLICKS "Generate QR Code"
        │
        ▼
setLoading(true)
setQrData(null)
setCountdown(300) ← 5 minute timer
        │
        ▼
CREATE QR CODE
│   └─ POST /api/v1/subscription-payment/create-qr
│       ├─ Body: { planId }
│       ├─ Returns: { success: true, qr_id, qr_data }
│       └─ Toast: "QR Code Generated! Scan to pay."
│
        ▼
setPaymentMethod('qr')
setQrData(data) ← Display QR on UI
        │
        ▼
START POLLING
│   ├─ setPolling(true)
│   ├─ Set interval: Every 5 seconds
│   │
│   LOOP (Every 5 seconds):
│   │   │
│   │   └─ GET /api/v1/subscription-payment/check-status/{qrId}?planId={planId}
│   │       │
│   │       ├─ IF data.success === true:
│   │       │   ├─ clearInterval()
│   │       │   ├─ setPolling(false)
│   │       │   ├─ setVerifying(true) ← Full screen loader
│   │       │   ├─ Toast: "Payment Received! Redirecting..."
│   │       │   ├─ Wait 2 seconds
│   │       │   ├─ logoutApi()
│   │       │   ├─ logout()
│   │       │   └─ window.location.href = '/login?message=...'
│   │       │
│   │       └─ IF error:
│   │           └─ console.error(error)
│
        ▼
COUNTDOWN TIMER (useEffect)
│   ├─ Runs every 1 second when paymentMethod === 'qr' && qrData
│   ├─ Decrements countdown from 300 to 0
│   ├─ Displayed as MM:SS on UI
│   └─ When countdown reaches 0: User must generate new QR
│
        ▼
DONE (Either payment received or time expired)
```

---

## 📊 State Management

| State | Type | Purpose |
|-------|------|---------|
| `loading` | boolean | Shows loading spinner during order creation |
| `verifying` | boolean | Shows full-screen loader during verification |
| `paymentMethod` | string | 'modal' or 'qr' |
| `qrData` | object | QR code image and metadata |
| `polling` | boolean | Indicates if polling is active |
| `countdown` | number | QR code timeout counter (5 min = 300 sec) |

---

## 🎨 UI Components & States

### Payment Method Selection
```
┌─────────────────────────────────────┐
│  PAYMENT METHOD                     │
├─────────────────────────────────────┤
│                                     │
│  [Cards & NetBanking] [UPI QR Code] │
│   (Tab 1)               (Tab 2)     │
│                                     │
└─────────────────────────────────────┘
```

### Modal Payment UI
```
┌──────────────────────────────────┐
│  Payment Methods Grid:           │
│  Visa | Mastercard | RuPay       │
│  UPI  | Paytm      | PhonePe     │
│                                  │
│  [Pay ₹{amount} Now] (Button)    │
│                                  │
│  Razorpay Logo                   │
└──────────────────────────────────┘
```

### QR Code Payment UI (Two States)

**State 1: Before QR Generated**
```
┌──────────────────────────────────┐
│  📱 Scan & Pay with UPI          │
│                                  │
│  "Generate QR code with your     │
│  phone's UPI app"                │
│                                  │
│  [Generate QR Code] (Button)     │
└──────────────────────────────────┘
```

**State 2: After QR Generated**
```
┌──────────────────────────────────┐
│  ⏱️ Time remaining: 4:32         │
│                                  │
│  ┌──────────────────────────┐    │
│  │    [QR CODE IMAGE]       │    │
│  │                          │    │
│  │  Scan with any UPI App   │    │
│  └──────────────────────────┘    │
│                                  │
│  [Generate New QR] (Reload Btn)  │
└──────────────────────────────────┘
```

---

## 🔐 Full-Screen Verification Loader

```
┌─────────────────────────────────────────────┐
│                                             │
│         🔄 (Spinning Shield Icon)           │
│                                             │
│    Verifying Payment                        │
│                                             │
│    Please wait while we securely verify    │
│    your transaction. Do not close this     │
│    window or press back.                   │
│                                             │
│    ⚫ ⚫ ⚫ (Animated dots)                  │
│                                             │
│  (This blocks user interaction entirely)   │
└─────────────────────────────────────────────┘
```

---

## 🔗 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/subscription-payment/create-order` | POST | Create Razorpay order |
| `/api/v1/subscription-payment/verify` | POST | Verify payment signature |
| `/api/v1/subscription-payment/create-qr` | POST | Generate UPI QR code |
| `/api/v1/subscription-payment/check-status/{qrId}` | GET | Poll for QR payment status |

---

## 🎬 Animation Effects

### Framer Motion Animations

1. **Container Animation**
   - Staggered children appearing with fade + slide-up
   - Delay: 0.2s, Stagger: 0.1s between items

2. **Item Animations**
   - Each item: fade in + slide up (spring animation)
   - Stiffness: 100, Damping: 12

3. **Background Decorations**
   - Top-right: Scale & rotate (20s cycle)
   - Bottom-left: Scale & rotate (25s cycle)
   - Floating particles: 15 particles with random motion

4. **Button Hover Effects**
   - Scale: 1.02x on hover, 0.98x on click
   - Background gradient shimmer on hover

5. **Tab Switching**
   - Smooth fade out/in transitions (200ms)
   - Layout animation with spring physics

---

## 🔄 Error Handling

### Modal Payment Errors
```
❌ Error during order creation
   └─ Toast: "Payment initiation failed"

❌ Error during payment verification
   └─ Toast: "Verification failed"
   └─ Loader stops (setVerifying = false)
```

### QR Code Errors
```
❌ Error during QR generation
   └─ Toast: "Failed to generate QR Code"

❌ Polling error (network issue)
   └─ Silently retries every 5 seconds
   └─ No user notification (prevents spam)
```

---

## ⏱️ Timing Details

| Event | Duration |
|-------|----------|
| Order creation toast | Auto-dismiss |
| Payment verification loader | Stays until redirect (or error) |
| After payment success | 2 second delay before redirect |
| QR code validity | 5 minutes (300 seconds) |
| QR polling interval | Every 5 seconds |

---

## 🎯 Key Features

✅ **Two Payment Methods**
- Razorpay Modal (supports 6+ payment methods)
- UPI QR Code (mobile-friendly)

✅ **Real-time Polling**
- Checks payment status every 5 seconds
- Automatic redirect on success

✅ **Security Features**
- SSL 256-bit encryption badge
- PCI compliance indicator
- Secure signature verification

✅ **User-Friendly**
- Order summary with price breakdown
- GST calculation included
- Plan features displayed
- Countdown timer for QR

✅ **Animation & UX**
- Smooth transitions between payment methods
- Loading spinners with messaging
- Full-screen verification loader
- Animated background particles

---

## 📱 Responsive Design

- **Desktop (lg screens)**: 3-column layout (summary + payment 2-col)
- **Mobile (<lg)**: Stacked layout (summary above payment)
- **Sticky Summary**: Order summary stays visible while scrolling

---

## 🔒 Security Measures

1. **Credentials**: API calls include `credentials: 'include'`
2. **HTTPS**: Links to Razorpay, PCI logos
3. **Signature Verification**: Backend validates Razorpay signature
4. **No Payment Data**: Card details never touch your server
5. **User Validation**: Logout after successful payment requires re-login

