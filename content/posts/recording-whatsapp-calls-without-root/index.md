---
title: I Recorded a WhatsApp Call on a Stock Phone — No Root, No Wi-Fi
date: 2026-11-16
description: Both sides of a WhatsApp call, recorded on an unrooted Moto G96 on Android 15, using the Android shell identity. No root, and no Wi-Fi during the call. Here is only the part that works.
dek: What actually works, after a day of dead ends.
tags: [android, call-recording, whatsapp, no-root, shizuku, moto-g96]
---

I spent a day trying to record WhatsApp calls on my phone — a stock, unrooted **Moto G96** on Android 15. Most of what I tried was a dead end. This is only the part that worked.

## The one idea that works

A normal Android app cannot record a call. The operating system hands the call's audio only to **system-level identities**. But there is one such identity you can borrow without rooting your phone: the **shell** — the same user a developer (ADB) session runs as. It holds the audio permission that ordinary apps are denied.

So the trick is to let a recorder run as the shell user. On Android 11+ you can set this up **entirely on the phone**, over wireless debugging — no computer, no root.

The surprising part: on **Android 14+**, the channel that carries a normal phone call's audio also carries **VoIP** calls — WhatsApp, Telegram and the like — on supported phones. The Moto G96 is one of them. That is what makes WhatsApp recording possible here.

## Why no root matters

Rooting would also solve this, but it trips Play Integrity and breaks UPI and banking apps. The whole point was to get this working on a daily-driver phone, untouched. **No root. Nothing unlocked.**

## How "arming" works — and why Wi-Fi isn't needed during calls

This part surprised me most. Wireless debugging is used **only once, to start the recorder**. After that, the recorder runs as its own shell-level process, independent of the app and of the connection that launched it. Which means:

- **Swipe the app away from recents — recording keeps going.** The recorder is not part of the app's UI.
- **No Wi-Fi during calls.** You can be on mobile data; the recorder does not care. Wi-Fi is needed only at arming time, because wireless debugging binds to the Wi-Fi interface.
- It stays up **until you reboot** (or the system kills it — so keep battery optimisation off for it).

In practice you touch Wi-Fi for a few seconds after a reboot to re-arm, and never again until the next one.

## The tool

I used **[JemRec](https://github.com/jemcik/JemRec)** — a free, open-source recorder built exactly for this (phone, WhatsApp, Telegram, Viber, Meet; both sides; Android 14+). Full setup is in its README; the short version:

- Android 12+, with **Developer options** on.
- Turn on **both** USB debugging and Wireless debugging (USB debugging stops wireless debugging from switching itself off).
- In JemRec, **pair** using the wireless-debugging pairing code.
- Run **Settings → Diagnostics → Self-test** first — it tells you in about a second whether your phone hands over both sides of a call.
- **The step that is easy to miss:** enable the **messenger toggle** for WhatsApp. VoIP apps are off by default, so WhatsApp calls are ignored until you switch them on. (This was exactly why an earlier tool I tried recorded nothing for WhatsApp.)

## What to expect

- **Cellular calls:** both sides, reliably.
- **WhatsApp:** both sides — on my Moto G96. It is "best-effort" and **device-dependent**, so it may not work on every Android 14+ phone. Run the self-test before trusting it.

One note: recording calls has legal and consent rules that vary by place — worth checking before you rely on it.

*Tested on a Moto G96, Android 15, November 2026.*
