# 📊 PaymentPage Visual Flows (Mermaid Diagrams)

## Flow 1: Component Initialization & Rendering

```mermaid
graph TD
    A["Page Load<br/>useLocation, useParams, useAuth"] --> B["Extract plan from<br/>location.state"]
    B --> C{"Plan<br/>exists?"}
    C -->|Yes| D["Use provided plan"]
    C -->|No| E["Use default plan"]
    D --> F["Initialize State:<br/>loading, verifying,<br/>paymentMethod,<br/>qrData, polling,<br/>countdown"]
    E --> F
    F --> G["Render UI:<br/>Order Summary +<br/>Payment Options"]
    G --> H["User selects<br/>payment method"]
```

---

## Flow 2: Modal Payment (Cards & NetBanking)

```mermaid
graph TD
    A["User selects<br/>Modal Payment"] --> B["User clicks<br/>Pay Now Button"]
    B --> C["setLoading = true"]
    C --> D["POST /create-order<br/>planId: plan.id"]
    
    D --> E{"Order<br/>Created?"}
    E -->|No| F["Toast Error:<br/>Payment initiation failed"]
    F --> G["setLoading = false"]
    G --> H["END - Payment Failed"]
    
    E -->|Yes| I["Toast: Order created"]
    I --> J["Extract: orderId,<br/>amount, key"]
    J --> K["Create Razorpay<br/>Options object"]
    K --> L["new Razorpay options"]
    L --> M["Open Razorpay Modal"]
    
    M --> N{"User<br/>Completes<br/>Payment?"}
    
    N -->|Dismissed| O["Toast: Payment cancelled"]
    O --> P["setLoading = false"]
    P --> H
    
    N -->|Success| Q["Handler Function Triggered"]
    Q --> R["setVerifying = true<br/>(Full screen loader)"]
    R --> S["Toast: Verifying payment..."]
    S --> T["POST /verify<br/>paymentId, orderId,<br/>signature, planId"]
    
    T --> U{"Signature<br/>Valid?"}
    U -->|No| V["Toast: Verification failed"]
    V --> W["setVerifying = false"]
    W --> H
    
    U -->|Yes| X["Toast: Payment verified!"]
    X --> Y["setTimeout 2000ms"]
    Y --> Z["Call logoutApi"]
    Z --> AA["Call logout<br/>from Auth context"]
    AA --> AB["Redirect to<br/>/login?message=..."]
    AB --> AC["END - Payment Success"]
```

---

## Flow 3: QR Code Payment (UPI)

```mermaid
graph TD
    A["User selects<br/>QR Code Payment"] --> B["setPaymentMethod = 'qr'"]
    B --> C["User clicks<br/>Generate QR Button"]
    C --> D["setLoading = true<br/>setQrData = null<br/>setCountdown = 300"]
    
    D --> E["POST /create-qr<br/>planId: plan.id"]
    
    E --> F{"QR<br/>Created?"}
    F -->|No| G["Toast Error:<br/>Failed to generate QR"]
    G --> H["setLoading = false"]
    H --> I["END - QR Failed"]
    
    F -->|Yes| J["setQrData = data<br/>Toast: QR Generated"]
    J --> K["setLoading = false"]
    K --> L["Display QR Image<br/>on UI"]
    L --> M["startPolling qr_id"]
    
    M --> N["setPolling = true<br/>Set interval: 5000ms"]
    
    N --> O["Every 5 seconds:<br/>GET /check-status"]
    
    O --> P{"Payment<br/>Received?"}
    
    P -->|No| Q["Continue polling<br/>Wait 5 seconds"]
    Q --> O
    
    P -->|Yes| R["clearInterval"]
    R --> S["setPolling = false<br/>setVerifying = true"]
    S --> T["Toast: Payment Received!"]
    T --> U["setTimeout 2000ms"]
    U --> V["Call logoutApi"]
    V --> W["Call logout"]
    W --> X["Redirect to /login"]
    X --> Y["END - QR Payment Success"]
    
    O -.->|Polling Error| Z["console.error<br/>Continue retrying"]
    Z --> O
```

---

## Flow 4: Countdown Timer (QR Code)

```mermaid
graph TD
    A["useEffect Triggers<br/>when paymentMethod = 'qr'"] --> B{"qrData exists?"}
    B -->|No| C["Don't run timer"]
    C --> D["END"]
    
    B -->|Yes| E["Set interval: 1000ms"]
    E --> F["Every 1 second:<br/>setCountdown(prev - 1)"]
    
    F --> G{"countdown<br/>> 0?"}
    G -->|Yes| H["Continue decrementing"]
    H --> F
    
    G -->|No| I["Timer expires<br/>User must generate<br/>new QR"]
    I --> J["Cleanup interval<br/>on unmount"]
    J --> K["END"]
```

---

## Flow 5: UI State Transitions

```mermaid
graph TD
    A["Payment Page Renders"] --> B["Show Payment Method Tabs"]
    B --> C{"Which<br/>Method?"}
    
    C -->|Modal| D["Show Modal Tab Content"]
    D --> E["Display payment methods grid<br/>Visa, MC, RuPay, UPI, etc"]
    E --> F["Show Pay Button"]
    F --> G["Ready for Modal Payment"]
    
    C -->|QR| H["Show QR Tab Content"]
    H --> I{"QR Data<br/>exists?"}
    
    I -->|No| J["Show Generate QR Button<br/>📱 Scan & Pay with UPI"]
    J --> K["Click triggers QR generation"]
    
    I -->|Yes| L["Show QR Image<br/>⏱️ Countdown Timer"]
    L --> M["Show Reload Button<br/>for new QR"]
    M --> N["Polling running in background"]
    N --> O["Waiting for payment"]
```

---

## Flow 6: Full Component Lifecycle

```mermaid
graph TD
    A["Component Mounts<br/>useEffect hooks setup"] --> B["State initialized with defaults"]
    B --> C["Page Renders<br/>UI visible"]
    
    C --> D{"User<br/>Action?"}
    
    D -->|Select Modal| E["Display Modal Content"]
    E --> F{"Click<br/>Pay?"}
    F -->|No| D
    F -->|Yes| G["Modal Payment Flow"]
    G --> H{Success?}
    
    D -->|Select QR| I["Display QR Content"]
    I --> J["Not yet generated"]
    J --> K{"Click<br/>Generate?"}
    K -->|No| D
    K -->|Yes| L["QR Payment Flow"]
    
    L --> M["Polling Started<br/>Countdown Started"]
    M --> N{Payment<br/>Received?}
    
    H -->|Yes| O["User Redirected<br/>Component Unmounts"]
    H -->|No| P["Show Error<br/>User can retry"]
    P --> D
    
    N -->|Yes| O
    N -->|No/Timeout| Q["User can<br/>Generate new QR"]
    Q --> D
    
    O --> R["useEffect Cleanup<br/>Clear intervals,<br/>disconnect polls"]
    R --> S["Component Destroyed"]
```

---

## Flow 7: Error Handling & Recovery

```mermaid
graph TD
    A["Error Occurs<br/>at any step"] --> B{Error<br/>Type?}
    
    B -->|Order Creation Error| C["Toast: Payment initiation failed"]
    C --> D["setLoading = false"]
    D --> E["User can retry"]
    
    B -->|Payment Verification Error| F["Toast: Verification failed"]
    F --> G["setVerifying = false"]
    G --> E
    
    B -->|QR Generation Error| H["Toast: Failed to generate QR"]
    H --> I["setLoading = false"]
    I --> E
    
    B -->|Polling Error| J["Log error silently<br/>Continue retrying"]
    J --> K["Polling continues<br/>every 5 seconds"]
    
    B -->|Network Error| L["Generic error message"]
    L --> E
    
    E --> M["User Returns to<br/>Payment Options"]
```

---

## Flow 8: Razorpay Integration

```mermaid
graph TD
    A["Create Order<br/>Backend"] --> B["Backend Creates<br/>Razorpay Order"]
    B --> C["Returns orderId,<br/>amount, key"]
    
    C --> D["Frontend Configures<br/>Razorpay Options"]
    D --> E["Set Payment Methods:<br/>UPI, Card, NetBanking,<br/>Wallet, PayLater"]
    
    E --> F["new Razorpay options"]
    F --> G["Modal Opens"]
    
    G --> H["User Fills Details<br/>in Razorpay Modal"]
    H --> I["Razorpay Processes<br/>Payment"]
    
    I --> J{Payment<br/>Status?}
    
    J -->|Success| K["Razorpay Returns:<br/>paymentId,<br/>orderId,<br/>signature"]
    K --> L["Handler Function<br/>Triggered"]
    
    J -->|Failure| M["Handler NOT called<br/>Modal shows error<br/>User can retry"]
    M --> N["User Back in Modal"]
    
    L --> O["Send payment details<br/>to Backend"]
    O --> P["Backend Verifies<br/>Signature using<br/>Razorpay Secret"]
    
    P --> Q{Valid<br/>Signature?}
    Q -->|Yes| R["Update DB:<br/>Payment Status = Paid"]
    R --> S["Return Success"]
    
    Q -->|No| T["Return Error"]
```

---

## Flow 9: Authentication & Redirect

```mermaid
graph TD
    A["Payment Verified<br/>Success"] --> B["Call logoutApi<br/>via Redux"]
    B --> C{API<br/>Success?}
    
    C -->|Yes| D["Server clears<br/>session/cookie"]
    D --> E["Frontend calls<br/>logout from<br/>Auth Context"]
    
    C -->|No| F["Log error<br/>but continue"]
    F --> E
    
    E --> G["Clear user from<br/>React Context"]
    G --> H["Clear localStorage<br/>if any"]
    H --> I["window.location.href<br/>= /login?message=..."]
    I --> J["Full page reload<br/>to /login"]
    J --> K["User sees:<br/>Please login again"]
    L["User forced to<br/>re-authenticate"]
```

---

## State Dependency Graph

```mermaid
graph LR
    A["loading"] -->|affects| B["Pay Button State"]
    C["verifying"] -->|shows| D["Full Screen Loader"]
    E["paymentMethod"] -->|determines| F["Displayed Content"]
    G["qrData"] -->|displays| H["QR Image"]
    I["countdown"] -->|displays| J["Time Remaining"]
    K["polling"] -->|controls| L["Poll Interval"]
    
    style A fill:#ff9999
    style C fill:#99ccff
    style E fill:#99ff99
    style G fill:#ffff99
    style I fill:#ff99ff
    style K fill:#99ffff
```

---

## Performance Considerations

```mermaid
graph TD
    A["Component Mounts"] --> B["Create 15 floating<br/>particles animation"]
    B --> C["Framer Motion<br/>animations start"]
    
    C --> D["useEffect: Countdown<br/>runs every 1 second<br/>when QR active"]
    
    D --> E["useEffect: Polling<br/>runs every 5 seconds<br/>when polling active"]
    
    E --> F["Network requests<br/>during QR polling"]
    F --> G["Performance Impact:<br/>Moderate"]
    
    G --> H["Optimizations:<br/>- Intervals cleared<br/>- Effects cleanup<br/>- Animations GPU accelerated"]
```

