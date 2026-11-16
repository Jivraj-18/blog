---
title: I Recorded a WhatsApp Call on a Stock Phone — No Root, No Wi-Fi
date: 2026-11-16
description: Both sides of a WhatsApp call, recorded on an ordinary unrooted Moto G96. No root, and no Wi-Fi during the call. The story, and the part that actually works.
dek: A day of dead ends, and the one thing that worked.
tags: [android, call-recording, whatsapp, no-root, shizuku, moto-g96]
---

I wanted my phone to keep a recording of my calls — including WhatsApp — saved as files I own. I spent a day on it. Most of what I tried failed. This is the part that worked, written so it makes sense whether or not you write code.

## The short version

On an ordinary **Moto G96** (Android 15), **with no rooting and nothing unlocked**, I can now record **both sides** of a WhatsApp call. And once it is set up, it keeps working on mobile data with **no Wi-Fi** and even with the app swiped away.

## Why this is normally hard

Phones deliberately stop apps from secretly recording your calls. When a call is live, Android hands the sound to the system only — an ordinary app that tries to listen just gets silence. That is why so many "call recorder" apps quietly fail, especially for WhatsApp.

## The one idea that gets around it (honestly)

Your phone has a built-in, trusted "developer" account — the same one that's used when a developer plugs a phone into a computer to debug it. Android *does* let that account hear calls. The clever bit: you can let a recorder app borrow that account **right on the phone**, over the phone's own "wireless debugging" feature — no computer, and no rooting.

For the technically minded: the account is the **shell** identity (the one an ADB session runs as), and it holds `CAPTURE_AUDIO_OUTPUT`, which ordinary apps are denied. Tools like Shizuku, or an app with its own built-in ADB, let you lend that privilege to the recorder.

And the surprise that makes WhatsApp work at all: starting with **Android 14**, the same channel that carries a normal phone call also carries internet calls (WhatsApp, Telegram, and so on) on supported phones. My Moto G96 is one of them.

## Why "no root" was the whole point

There is another way to do all this — *rooting* the phone, which removes its safety locks. But rooting breaks UPI and banking apps (they refuse to run on a modified phone). I wanted this on my everyday phone, untouched. So: **no root, nothing unlocked.**

## The part that genuinely surprised me: no Wi-Fi during calls

Setting it up ("arming" it) needs Wi-Fi for a moment — but only to *start* the recorder. After that, the recorder runs on its own, completely detached from the thing that launched it. So:

- **Swipe the app away — recording still happens.** The recorder isn't the app you see; it's a separate background process.
- **No Wi-Fi needed during actual calls.** Mobile data is fine. Wi-Fi is only needed at the moment you arm it.
- It stays running **until you restart the phone.** After a restart you re-arm it in a few seconds on any Wi-Fi, then you're set again.

So in day-to-day use you touch Wi-Fi for a few seconds after a reboot, and never during a call.

## How to set it up (the short list)

I used **[JemRec](https://github.com/jemcik/JemRec)** — free, open-source, built for exactly this (phone, WhatsApp, Telegram, Viber, Meet; both sides; Android 14+). Its README has the full walkthrough; the essentials:

- Android 12 or newer, with **Developer options** turned on.
- Turn on **both** USB debugging and Wireless debugging (the first just stops the second from switching itself off).
- In JemRec, **pair** it using the wireless-debugging pairing code.
- Run its **Self-test** first (Settings → Diagnostics) — in about a second it tells you whether your phone will hand over both sides of a call.
- **The easy-to-miss step:** turn on the **messenger toggle** for WhatsApp. Internet-call apps are off by default, so WhatsApp is ignored until you switch it on. (This was the exact reason an earlier app recorded nothing for WhatsApp.)

## What to expect

- **Normal phone calls:** both sides, reliably.
- **WhatsApp:** both sides — on my phone. This part is "best-effort" and **depends on the phone model**, so it may not work on every Android 14+ device. Run the self-test before trusting it.

One honest note: recording calls has legal and consent rules that differ from place to place — worth checking before you rely on it.

*Tested on a Moto G96, Android 15, in November 2026.*
