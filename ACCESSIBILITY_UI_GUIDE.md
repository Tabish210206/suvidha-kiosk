# Accessibility UI - Visual Guide

## Where to Find the Accessibility Mode Selector

### Language Selection Page (Initial Screen)
```
═══════════════════════════════════════════════════════════════
║                    SUVIDHA 4.0                               ║
║                Select Your Language                          ║
║                                                               ║
║  ┌─────────┬─────────┬─────────┬─────────┬─────────┐       ║
║  │ English │ हिंदी  │ தமிழ் │ తెలుగు │ ಕನ್ನಡ │       ║
║  └─────────┴─────────┴─────────┴─────────┴─────────┘       ║
║                                                               ║
═══════════════════════════════════════════════════════════════
No accessibility selector here yet
```

---

### Home Page (After Language Selection) ⭐ MAIN LOCATION
```
╔════════════════════════════════════════════════════════════╗
║              [🎧] [🏠] [⚙️]  [🚪]                         ║
║  ↑         ACCESSIBILITY   HOME  SETTINGS LOGOUT            ║
║  │         MODE SELECTOR                                    ║
║  └─ TOP RIGHT CORNER                                        ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║              SUVIDHA 4.0 - Home                             ║
║         Select Your Service                                 ║
║                                                             ║
║  ┌──────────────────┐  ┌──────────────────┐                ║
║  │ 🎙️ AI Avatar    │  │ 💡 Services      │                ║
║  │                  │  │ ⚡ Electricity   │                ║
║  │ (Voice Guidance) │  │ 💧 Water         │                ║
║  │                  │  │ 🔥 Gas          │                ║
║  │ [Repeat Button]  │  │ 🏛️  Municipal   │                ║
║  └──────────────────┘  └──────────────────┘                ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
     ↑
     Voice Guide Overlay appears here (bottom-right)
     when in Visually Impaired mode
```

---

## Accessibility Mode Selector - Detailed View

### Button Appearance
```
┌───────────────────────┐
│ 🎧 Visually Impaired  │  ← Shows current mode
└───────────────────────┘
```

### Dropdown Menu
```
┌─────────────────────────────────────────┐
│ Accessibility Modes                     │
├─────────────────────────────────────────┤
│ 📱 Standard                             │
│    Regular interface                    │
├─────────────────────────────────────────┤
│ 🎧 Visually Impaired (DEMO) [✓ Active] │
│    Voice navigation                     │
├─────────────────────────────────────────┤
│ 👁️  Hearing Impaired (DEMO)            │
│    Visual captions                      │
├─────────────────────────────────────────┤
│ 🎤 Motor Disability (DEMO)              │
│    Voice control                        │
└─────────────────────────────────────────┘
```

---

## Voice Guide Overlay - Bottom Right

```
When in Visually Impaired Mode:

┌──────────────────────────────────────┐
│ 🎧 Reading... (while speaking)       │
│                                      │
│ "Select a service to get started"    │ ← Current content
│                                      │
│                           [🔊 Repeat]│ ← Re-read button
└──────────────────────────────────────┘
        ↑
    Bottom-right corner
    Only visible when Blind mode active
```

---

## Settings Page - Full Accessibility Modes

```
╔═══════════════════════════════════════════════════════════╗
║  ← Settings                                               ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  🎯 Accessibility Demo Mode Active                       ║
║  Currently in Visually Impaired Mode...                  ║
║                                                           ║
║  Accessibility Modes (WCAG 2.1 Compliant)                ║
║                                                           ║
║  ┌─────────────────────────────────────┐                ║
║  │ 📱 Standard                         │                ║
║  │    Regular interface - WCAG AA      │                ║
║  └─────────────────────────────────────┘                ║
║                                                           ║
║  ┌─────────────────────────────────────┐                ║
║  │ 🎧 Visually Impaired (Demo) [✓]    │                ║
║  │    Voice-based navigation, audio    │                ║
║  │    descriptions...           [Active]               ║
║  └─────────────────────────────────────┘                ║
║                                                           ║
║  ┌─────────────────────────────────────┐                ║
║  │ 👁️  Hearing Impaired (Demo)        │                ║
║  │    Visual captions, no sound...     │                ║
║  └─────────────────────────────────────┘                ║
║                                                           ║
║  ┌─────────────────────────────────────┐                ║
║  │ 🎤 Motor Disability (Demo)          │                ║
║  │    Voice control enabled...         │                ║
║  └─────────────────────────────────────┘                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## How to Interact with Accessibility Mode Selector

### Step 1: See the Icon
```
Top-Right Corner:
┌────────────────────────────────────────┐
│ ...other buttons...  [🎧]  [🏠] [⚙️] │
│                      ↑
│                      Click here
└────────────────────────────────────────┘
```

### Step 2: Menu Opens
```
┌──────────────────────────────────────┐
│ Accessibility Modes                  │
├──────────────────────────────────────┤
│ 📱 Standard          (or)             │ ← Tap to switch
│                      ▼                │
│ 🎧 Visually Impaired (DEMO) [✓]     │ ← Currently active
│                                      │
│ 👁️  Hearing Impaired (DEMO)        │
│                                      │
│ 🎤 Motor Disability (DEMO)          │
│                                      │
│ 💡 Select a mode optimized...       │
└──────────────────────────────────────┘
```

### Step 3: Switch and Hear Confirmation
```
You tap: 👁️ Hearing Impaired

Result:
- Button changes to 👁️
- Voice says: "Switched to Hearing Impaired mode"
- Interface updates with visual adjustments
- No more voice announcements
- More visual indicators instead
```

---

## Demo Mode Indicators

### Current Configuration - What You'll See

#### 1. On Page Load
```
Voice announces:
"Welcome to SUVIDHA 4.0. I am your digital assistant. 
How can I help you today?"

Visual indicators:
✓ Accessibility icon shows 🎧 (Blind mode)
✓ Voice guide overlay in bottom-right
✓ Large buttons (64x64px)
✓ High contrast colors
```

#### 2. Demo Badge on Settings
```
Each demo mode shows:
┌─────────────────────────────────┐
│ 🎧 Visually Impaired            │
│ ┌──────────────┐                │
│ │    DEMO      │ ← Blue badge  │
│ └──────────────┘                │
│ Voice-based navigation...       │
└─────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop/Tablet
```
┌─────────────────────────────────────────────┐
│ [🎧 Visually Impaired] [🏠] [⚙️] [🚪]     │
│ Full label shown, all buttons visible       │
└─────────────────────────────────────────────┘
```

### Mobile
```
┌──────────────────────────────┐
│ [🎧] [🏠] [⚙️] [🚪]        │
│ Icon only, more compact      │
└──────────────────────────────┘
```

---

## Accessibility Features at a Glance

| Mode | Location | Voice | Large Text | High Contrast | Visual |
|------|----------|-------|------------|---------------|--------|
| Standard | Top-right | ✓ optional | Default | WCAG AA | Full |
| Blind (Demo) | Top-right | ✓ Auto | Large (64px) | High | Minimal |
| Deaf (Demo) | Top-right | ✗ None | Large | Max (7:1) | Full |
| Motor (Demo) | Top-right | ✓ Commands | Large (80px) | High | Full |

---

## User Journey - Visually Impaired User (Demo)

```
1. LAUNCH
   └─> Language Page (no selector)
       └─> User selects language
           └─> Home Page loads

2. HOME PAGE
   └─> Voice: "Welcome to SUVIDHA 4.0..."
   └─> Accessibility icon appears: [🎧]
   └─> Voice guide overlay: (bottom-right)

3. INTERACT
   └─> User presses Tab key
   └─> Button gets focus
   └─> Voice announces button name
   └─> User presses Enter
   └─> Action happens, voice confirms

4. SWITCH MODE (Optional)
   └─> User says "Accessibility menu" (if voice control on)
       or clicks [🎧] icon
   └─> Dropdown opens
   └─> User selects new mode
   └─> Voice: "Switched to [Mode Name]"

5. SETTINGS
   └─> User clicks [⚙️] Settings
   └─> Settings page with all 4 modes shown
   └─> User can try other modes
```

---

## Key Points for Demo

✅ **Visually Impaired mode enabled by default**
✅ **Accessibility icon visible in top-right**
✅ **Voice announces all actions**
✅ **Voice guide overlay shows (bottom-right)**
✅ **4 demo modes selectable from dropdown**
✅ **Settings page shows all modes with descriptions**
✅ **DEMO badge shows on new modes**
✅ **Works without any API calls** (offline mode)

---

## Testing the Demo

### Quick Test Checklist
- [ ] Load page → Voice greets you
- [ ] See 🎧 icon in top-right
- [ ] Click 🎧 → Dropdown appears
- [ ] Click different mode → Voice announces change
- [ ] See 👁️ icon in top-right → Mode changed
- [ ] Click ⚙️ Settings
- [ ] See all 4 modes on Settings page
- [ ] See "DEMO" badge on 3 modes
- [ ] Click mode in settings → Changes immediately
- [ ] Go back to home → Header visible
- [ ] Voice guide visible in bottom-right

---

**Status:** ✅ READY FOR DEMO
All features are live and working!

Last Updated: February 28, 2026
