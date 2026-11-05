---
title: The Night the Bike Gave Up
date: 2026-11-05
description: A night in Hyderabad told from two sources, my memory and my Google Maps Timeline. Dinner, Hussain Sagar, a dying bike, a stranger's foot, and an anxiety experiment.
dek: One night, told twice. Once from my memory, once from my Google Maps Timeline.
byline: with Sai
tags: [hyderabad, night-ride, food, bike-trouble, google-timeline, data-story]
styles: ["https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"]
scripts: ["https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js", "post.js"]
---

This post has two sources. **The story comes from my memory. The times, distances and speeds come from my Google Maps Timeline**, which I exported from my phone and went through in Python. Wherever the two disagree, you'll see both.

## Dinner at 7 Sisters <span class="clock">9:54 → 10:57 pm</span>

On 11 October, while I was staying over at my friend Devam's place near Manikonda, Devam's parents recommended 7 Sisters. So last Wednesday, Sai and I rode to the one in Prism Mall, Gachibowli.

> **Memory:** left around 9:30, arrived around 10:15. **Timeline:** left at 9:54, arrived at 10:09.

A staff member told us to hurry because this was the last order. It wasn't; people who came in after us ordered too. We had one sushi and two noodles, with garlic, since they were out of avocado.

## Hussain Sagar <span class="clock">~11:30 pm → 12:06 am</span>

Instead of going home, we went to see the Buddha statue in the middle of a lake I'd once visited with Nandan and Bala. I didn't know its name. Sai did: Hussain Sagar.

We skipped the junk-food stalls and rode along the lake. A stranger was setting off fireworks, and it looked great until the empty boxes went into the lake. Police were posted about 200 m apart, and the gaps between them were a free-for-all. We wanted to see the Buddha from the front, but there was nowhere to stop, so we headed home.

<figure class="wide">
  <p class="fig-title">The route, coloured by what was moving the bike</p>
  <p class="fig-sub">Engine, people, or my curiosity. Tap the markers.</p>
  <div id="map" role="img" aria-label="Map of the night's route across Hyderabad, from Gachibowli to Hussain Sagar and back west"></div>
  <ul class="legend">
    <li><span class="sw" style="background:var(--engine)"></span>Engine running</li>
    <li><span class="sw" style="background:var(--human)"></span>Human-powered (pushing, a stranger's foot)</li>
    <li><span class="sw" style="background:var(--loop)"></span>The anxiety experiment</li>
  </ul>
  <figcaption>From my Timeline. The area around home is cut out on purpose. Near the lake the phone only had cell-tower fixes, so that loop is approximate.</figcaption>
</figure>

## The bike dies <span class="clock">12:17 → 12:41 am</span>

About 12 km from home, the bike died. Restart, 100–200 m, dead. Three or four times, then nothing. So we pushed.

> **Memory:** "12 or 12:30-ish". **Timeline:** trouble started around 12:17, and at 12:19:45 the phone logged an `EXITING_VEHICLE` event, the moment we got off. While we pushed, GPS recorded 3.4–4.6 km/h, which is walking pace.

A man on a Bullet asked if we'd run out of petrol. We hadn't, and he rode on. Then a food-delivery rider offered to push our bike with his leg, and he pushed us all the way to a petrol pump.

> **Timeline:** that push covered about 4.1 km in 12 minutes, averaging around 20 km/h.

<figure class="wide">
  <p class="fig-title">Speed after the breakdown</p>
  <p class="fig-sub">GPS speed, km/h, 12:15–1:30 am. Shaded bands are what was happening.</p>
  <div class="chart" id="speed-chart"></div>
  <figcaption>GPS speed from my Timeline. Single readings are noisy; the gap before 12:29 is when the phone had no GPS fix.</figcaption>
</figure>

## Blow into the tank <span class="clock">12:54 → 1:04 am</span>

Nobody at the petrol pumps knew of a mechanic that was open. We decided to get the bike home even if we had to push it until 3 am. Then I asked ChatGPT. One suggestion: open the fuel tank, blow into it, close it.

It worked.

> My guess at why: a blocked vent in the fuel cap lets a vacuum build up in the tank, which starves the engine after a short run. That matches our 100–200 m pattern, but it's a guess, not a diagnosis.

## The anxiety experiment <span class="clock">1:19 → 1:26 am</span>

The bike got us to within a few hundred metres of home. Then, instead of turning in, we rode the other way. I wanted to see how anxious I'd get as home got further away, on a bike that had just failed us. The worry grew roughly in step with the distance, and at what felt like 2 km we turned back.

<figure class="wide">
  <p class="fig-title">How far from home we were, all night</p>
  <p class="fig-sub">Straight-line distance from our PG (approximate, km), 9:50 pm – 1:45 am.</p>
  <div class="chart" id="home-chart"></div>
  <figcaption>The bump at the far right is the anxiety experiment. Measured from a deliberately blurred point near home.</figcaption>
</figure>

> **Timeline:** the U-turn was at 1:23 am, about 1.6 km from home in a straight line. We were home at 1:37.

## Memory vs. Timeline

| Moment | Memory | Timeline | |
|---|---|---|---|
| Left home | ~9:30 pm | 9:54 pm | 24 min off |
| Reached 7 Sisters | ~10:15 pm | 10:09 pm | 6 min off |
| Bike died | 12–12:30 am | ~12:17 am | in range |
| Where it died | ~12 km from home | 8.9 km straight-line | roads aren't straight |
| Anxiety U-turn | ~2 km out | ~1.6 km straight-line | anxiety rounds up |
| Home | ~1:30 am | 1:37 am | 7 min off |

My times drifted towards neater numbers. My distances were longer than the straight-line ones, which makes sense on roads. And the things only memory had are the ones no phone logs: the fake urgency, the boxes in the lake, a stranger offering his leg.

## How I made this

I exported my Timeline from the phone (Maps → *Your Timeline* → ⋮ → *Location & privacy settings* → *Export Timeline data*), which gives one JSON file. For this night it held about 190 location fixes and 500 activity readings. Speed separated the phases cleanly: about 4 km/h is pushing, about 20 km/h is a stranger's leg, and 25–45 km/h is a working engine. The area around home is removed from the [track data](track.json).
