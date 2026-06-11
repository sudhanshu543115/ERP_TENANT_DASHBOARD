# ⚡ PaymentPage Quick Reference

## 📝 Component Summary

**File:** `src/common/pages/PaymentPage.jsx`  
**Purpose:** Handle subscription payments via Razorpay (Modal or QR)  
**Auth Required:** Yes (uses authMiddleware)  

---

## 🎯 Two Payment Methods

### 1️⃣ Modal Payment (Cards & NetBanking)
```
User → Clicks "Pay Now" → Razorpay Modal Opens → 
User enters details → Razorpay processes → 
Signature verification → Success → Redirect
```

**Time:** ~2-3 minutes (user action dependent)  
**Methods:** Visa, Mastercard, RuPay, UPI, Paytm, PhonePe  

### 2️⃣ QR Code Payment (UPI)
```
User → Clicks "Generate QR" → QR image shows → 
User scans with phone → Payment processed → 
Polling detects payment → Redirect
```

**Time:** ~5 minutes (5 min QR validity)  
**Method:** Any UPI app (Google Pay, PhonePe, Paytm, etc.)

---

## 🔄 Data Flow

```
Frontend State → User Action → API Call → Backend → Verification → Redirect
```

**Key States:**
| State | Type | Purpose |
|-------|------|---------|
| `loading` | bool | Order creation in progress |
| `verifying` | bool | Payment verification in progress |
| `paymentMethod` | str | 'modal' or 'qr' |
| `qrData` | obj | QR code image + metadata |
| `polling` | bool | Currently checking payment status |
| `countdown` | int | QR expiry timer (300-0) |

---

## 🌐 API Endpoints

| Endpoint | Method | Called When |
|----------|--------|-------------|
| `/create-order` | POST | User clicks "Pay Now" (modal) |
| `/verify` | POST | Payment handler callback (modal) |
| `/create-qr` | POST | User clicks "Generate QR" |
| `/check-status/{qrId}` | GET | Polls every 5 sec (QR) |

**Base URL:** `http://localhost:5000/api/v1/subscription-payment`

---

## 📱 UI Sections

```
┌─────────────────────────────────────────────┐
│         PAYMENT PAGE HEADER                  │
│  "Complete Your Payment" (with gradient)    │
└─────────────────────────────────────────────┘
│         MAIN CONTENT (2 columns on desktop)  │
├─────────────────┬───────────────────────────┤
│                 │                           │
│  ORDER SUMMARY  │  PAYMENT OPTIONS          │
│  ├─ Plan name   │  ├─ Tab: Modal            │
│  ├─ Price       │  ├─ Tab: QR              │
│  ├─ Duration    │  └─ Content changes      │
│  ├─ GST         │     based on tab         │
│  ├─ Total       │                          │
│  └─ Features    │                          │
│                 │                          │
└─────────────────┴───────────────────────────┘
```

---

## 🔐 Security

✅ **SSL 256-bit encryption** - Badge shown  
✅ **PCI Compliant** - Badge shown  
✅ **Signature Verification** - Backend validates Razorpay signature  
✅ **No Card Data** - Razorpay handles all payment details  
✅ **Force Re-login** - User logged out after successful payment  

---

## ⏱️ Timing

| Event | Duration |
|-------|----------|
| Order creation | <1 sec |
| Razorpay modal delay | Instant |
| Payment verification | 1-5 sec |
| Redirect wait | 2 sec |
| QR validity | 5 min (300 sec) |
| Polling interval | 5 sec |
| Countdown tick | 1 sec |

---

## 🎨 Animations

**Framework:** Framer Motion

| Animation | Where | Duration |
|-----------|-------|----------|
| Entrance | All items fade + slide up | Spring (0.1-0.2s) |
| Decorative | Background circles rotate | 20-25s loop |
| Particles | 15 floating dots | 15-25s each |
| Loading Spinner | Order creation | Rotates continuously |
| Verification Spinner | Payment verification | Rotates continuously |
| Countdown | QR timer display | Real-time |
| Tab Switch | Payment method switch | 0.2s fade |

---

## 🚦 User Flows Summary

### ✅ Modal Payment Success
```
Pay Now → Order Created → Modal Opens → User Pays → 
Verification ✓ → Toast "Payment verified!" → 
Wait 2s → Logout → Redirect /login
```

### ❌ Modal Payment Failed
```
Pay Now → Order Created → Modal Opens → User Cancels/Fails → 
Error Toast → Try Again Available
```

### ✅ QR Payment Success
```
Generate QR → QR Displays → Countdown Starts (5 min) → 
Polling Every 5s → Payment Detected ✓ → 
Verification ✓ → Toast "Payment Received!" → 
Wait 2s → Logout → Redirect /login
```

### ❌ QR Payment Expired
```
Generate QR → QR Displays → Countdown Runs → 
Time Runs Out → QR Expires → Generate New QR Available
```

---

## 🎯 Key Functions

### `handleModalPayment()`
- Creates Razorpay order
- Opens Razorpay modal
- Handles payment response
- Verifies signature

### `handleQrPayment()`
- Creates QR code
- Starts countdown timer
- Initiates polling

### `startPolling(qrId)`
- Checks payment status every 5 sec
- Stops on success
- Verifies and redirects

### `formatTime(seconds)`
- Converts seconds to MM:SS format
- Used for countdown display

---

## 💾 Order Summary Calculation

```
Base Price: plan.price

GST (18%): Math.round(plan.price * 0.18)

Total: plan.price + GST
```

**Example:**
```
Plan Price:     ₹1000
GST (18%):      ₹180
Total:          ₹1180
```

---

## 📊 Component Dependencies

```
react
├─ useState (6 states)
├─ useEffect (2 effects: countdown + cleanup)
└─ Hooks:
    ├─ useLocation
    ├─ useNavigate
    ├─ useParams
    └─ useAuth

framer-motion
├─ motion (animations)
├─ AnimatePresence (conditional rendering)
└─ Variants (animation configs)

react-hot-toast
├─ toast (notifications)
└─ Toaster (container)

heroicons
├─ Various payment/security icons
└─ Used for visual indicators

react-icons
└─ Additional icon library

API
├─ window.Razorpay (injected script)
└─ fetch API (network calls)
```

---

## 🔗 Related Files

```
PaymentPage.jsx
├─ Uses authcontext (useAuth, useLogoutMutation)
├─ Uses react-router (location, navigate, params)
├─ Calls backend endpoints
│   └─ /subscription-payment/*
└─ Redirects to /login on success
```

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Fix |
|-------|-------|-----|
| QR doesn't generate | Backend error | Check `/create-qr` endpoint |
| Polling doesn't detect payment | Too slow | Check polling interval & endpoint |
| Modal doesn't open | Razorpay script not loaded | Ensure Razorpay script in HTML |
| Verification fails | Invalid signature | Check JWT_SECRET matches |
| User not redirected | Logout fails silently | Check logoutApi endpoint |

---

## 📈 Performance Notes

⚠️ **Heavy Animation Usage**
- 15 floating particles
- Framer Motion staggered animations
- Continuous spinners during loading

💡 **Optimizations**
- All intervals cleared on unmount
- Effects cleanup properly
- GPU-accelerated animations

---

## 🎓 Learning Points

✅ **Payment Integration**: Razorpay modal + QR  
✅ **Polling Pattern**: Checking status repeatedly  
✅ **State Management**: Multiple interdependent states  
✅ **Animation**: Framer Motion for complex UI  
✅ **Error Handling**: Toast notifications + graceful fallbacks  
✅ **Responsive Design**: Works on mobile & desktop  
✅ **Security**: Signature verification, HTTPS, PCI compliance  

---

## 📞 Quick Debug Tips

```bash
# Check if Razorpay is loaded
console.log(window.Razorpay);

# Check component state
// Add console.logs in useState setters

# Check API calls
// Open Network tab in DevTools
// Look for /subscription-payment/* requests

# Check polling
// Set console.log in startPolling interval

# Check animations
// Inspect element in DevTools
# Look for transform and opacity changes
```

---

## 🎬 Next Steps

1. Verify all API endpoints working
2. Test both payment methods
3. Check error scenarios
4. Monitor performance
5. Collect user feedback
6. Optimize animations if needed

