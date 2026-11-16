---
title: Recording WhatsApp calls on a stock phone. No root.
date: 2026-11-16
description: Both sides of a WhatsApp call, recorded on an unrooted Moto G96. No root, and no Wi-Fi during the call. The bit that worked, after a day of dead ends.
dek: A day of dead ends, and the one thing that worked.
tags: [android, call-recording, whatsapp, no-root, shizuku, moto-g96]
---

I wanted my phone to keep every call as a file I own. Cellular, WhatsApp, the lot. Spent a day on it. Most of it failed. Here's the bit that worked.

Phones don't let apps record calls. When a call is live, Android hands the audio to the system only. An ordinary app gets silence. That's why most "call recorder" apps quietly fail, especially on WhatsApp.

But there's a loophole, and it's a clean one. Your phone has a built-in trusted account — the *shell*, the same identity an ADB (developer) session runs as. Android lets *it* hear calls. And you can lend that privilege to a recorder right on the phone, over wireless debugging. No computer. No root.

The unlock for WhatsApp: since Android 14, the normal call-audio channel also carries VoIP — WhatsApp, Telegram, Meet — on phones that support it. My Moto G96 does. It actually works.

## No root was the whole point

There's another route: root the phone. But root breaks UPI and banking apps — they refuse to run on a modified phone (Play Integrity). I wanted this on my everyday phone, untouched. So: no root, nothing unlocked.

## The surprise: no Wi-Fi during calls

Wireless debugging only *starts* the recorder. After that it runs on its own — detached from the app and from the thing that launched it. Swipe the app away, it keeps recording. On mobile data. Until a reboot. Wi-Fi is needed for about ten seconds to re-arm after a restart, and never during an actual call.

## The tool

[JemRec](https://github.com/jemcik/JemRec). Open source. Built for exactly this — phone, WhatsApp, Telegram, Viber, Meet, both sides, Android 14+.

Setup, short version. Android 12+. Turn on Developer options. Turn on both USB debugging and Wireless debugging. Pair JemRec with the wireless-debugging pairing code. Then run its self-test (Settings → Diagnostics) — one second, and it tells you whether your phone hands over both sides of a call.

## The mistake that cost me an hour

The messenger toggle for WhatsApp is off by default. So: self-test passed, cellular recorded fine, WhatsApp recorded nothing. Gaah. Flip the toggle for WhatsApp, and it works. VoIP apps are simply ignored until you switch them on.

## What to expect

Cellular: both sides, reliably. WhatsApp: both sides — on my phone. This part is best-effort and device-dependent #ForNow, so run the self-test before you trust it on any given phone.

PS: recording calls has consent and legal rules that vary by place. Worth a check before you lean on it.

*Tested on a Moto G96, Android 15, November 2026.*
