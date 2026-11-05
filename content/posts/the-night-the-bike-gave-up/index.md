---
title: The Night the Bike Gave Up
date: 2026-11-05
description: Dinner at 7 Sisters, a detour to Hussain Sagar, a bike that kept dying, a stranger's foot, a ChatGPT fix, and an anxiety experiment, all rebuilt from my Google Maps Timeline.
dek: Dinner, a lake, a dying bike, a stranger's foot, a ChatGPT hack, and a small experiment on my own anxiety. My memory told the story; my phone kept the receipts.
byline: with Sai · times and distances from my Google Maps Timeline
tags: [hyderabad, night-ride, food, bike-trouble, google-timeline, data-story]
styles: ["https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"]
scripts: ["https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js", "post.js"]
---

This is my first blog post, and I wanted it to be about something that actually happened rather than something I think about. So here's last Wednesday night. Most of it I remember well. The times, though, I only *thought* I remembered. So I exported my Google Maps Timeline and checked myself against it. Where my memory and the data disagree, I'll show both.

## Dinner at 7 Sisters <span class="clock">9:54 → 10:57 pm</span>

Sai and I were planning to eat out somewhere. Earlier that day I'd been at my friend Devam's place, and her parents told me 7 Sisters is a good restaurant. We found the one in Prism Mall, Gachibowli, and headed out.

I'd have told you we left around 9:30 and got there around 10:15. The phone says we left at **9:54** and parked at **10:09**, a 15-minute ride. I was off by twenty minutes in one direction and six in the other.

We were sitting and going through the menu when one of the staff came over and said this would be our last order, so please hurry. It wasn't true. People who came in after us also ordered. It was just fake urgency. Cool, that's fine. We got one sushi and two noodles. We wanted avocado in the noodles, but they were out, so we settled for garlic. We left at **10:57**.

## A Buddha in the middle of a lake <span class="clock">~11:30 pm → 12:06 am</span>

Outside, the question was: back to the PG, or go see a bit of Hyderabad? I told Sai there's a Buddha statue standing in the middle of some lake. I'd seen it once with Nandan, Dev and Bala, but I didn't know the name of the place. Sai did: "It's Hussain Sagar." Okay, let's go.

We stopped where there was space to park the bike, next to a row of stalls: potato snacks, spring rolls, Amul ice cream. All junk, so we didn't eat anything and just went along the road by the lake instead.

Further along, a girl, a complete stranger, was setting off fireworks into the sky, and honestly it looked good. Policemen were on duty, but about 200 metres apart, so the gaps between them were where people did whatever they liked. The part I didn't like came after: once the crackers were done, the empty boxes went straight into the lake. Until then I was enjoying it.

On the way back we drove along the side of the lake where you see the Buddha from the front. The problem was there was nowhere to stop. While I was driving, I spotted parking on the other side of the road and asked Sai whether he wanted to cross over. "It's on you." It was already late, so I said let's go home.

> The lake part is the fuzziest stretch in the data. My phone was only getting cell-tower fixes there (±100 m or worse), so it shows the loop around the lake clearly but not exactly where we parked or watched the fireworks.

<figure class="wide">
  <p class="fig-title">The route, coloured by what was moving the bike</p>
  <p class="fig-sub">Engine, people, or my curiosity. Tap the markers.</p>
  <div id="map" role="img" aria-label="Map of the night's route across Hyderabad, from Gachibowli to Hussain Sagar and back west"></div>
  <ul class="legend">
    <li><span class="sw" style="background:var(--engine)"></span>Engine running</li>
    <li><span class="sw" style="background:var(--human)"></span>Human-powered (pushing, a stranger's foot)</li>
    <li><span class="sw" style="background:var(--loop)"></span>The anxiety experiment</li>
  </ul>
  <figcaption>The area around where we live is cut out of the map on purpose. Fixes near the lake come from cell towers and wobble; the breakdown section onwards is GPS at roughly one fix every 30 seconds.</figcaption>
</figure>

## The bike gives up <span class="clock">12:17 → 12:41 am</span>

We were about 12 km from home when the bike just died. We restarted it. It went 100–200 metres and died again. Restart, 100–200 metres, dead. We tried three or four times and got the same pattern every time, until it wouldn't start at all.

So we pushed it by hand. I'd have guessed this was "12 or 12:30-ish". The phone pins the first trouble at around **12:17**, and at **12:19:45** its activity recogniser logged an event I didn't know it tracked: `EXITING_VEHICLE`. That's the moment we got off.

> The next part is why I wanted the data. Once we were walking, the phone switched to GPS and recorded speeds of **3.4–4.6 km/h**, which is human walking pace (pushing a bike, in our case), while labelling us `WALKING` with 86–94% confidence. Across those 24 minutes we covered about 1.8 km, restart attempts included.

While we were pushing, a man on a Bullet slowed down: "Did your bike run out of petrol?" No, we have petrol, we just don't know what's wrong. It starts, then it gives up after 100–200 metres. He nodded and rode on.

## A stranger's foot <span class="clock">12:42 → 12:54 am</span>

Then a delivery rider, doing food delivery I think, stopped and asked: "Can I push your bike with my leg?" Sure. He rode alongside with his foot on our bike and pushed us all the way to a petrol pump. I thought it was a few kilometres. It was more than I gave him credit for.

<figure class="wide">
  <p class="fig-title">Speed after the breakdown</p>
  <p class="fig-sub">GPS speed, km/h, 12:15–1:30 am. Shaded bands are what was happening.</p>
  <div class="chart" id="speed-chart"></div>
  <figcaption>Only GPS fixes carry a speed reading; the gap before 12:29 is when the phone was still on cell towers. Single readings are noisy, so the 39 km/h spike is one sample, not a sustained pace.</figcaption>
</figure>

> One man, pushing a dead bike with two people on it using his leg, covered **about 4.1 km in 12 minutes, averaging roughly 20 km/h**, with individual readings up to 30+ km/h. He dropped us at a pump about 7 km by road from our PG (5.5 km in a straight line).

## The petrol pump, and the ChatGPT fix <span class="clock">12:54 → 1:04 am</span>

I asked the guys at the pump if there was a mechanic nearby. One street behind, they said. Open now? No idea.

We didn't want to leave the bike there, because then how would we come back for it? So we decided that whatever happens, we take it home, even if we have to push it until 2:30 or 3.

We walked to another petrol pump and asked again. They didn't know either, only that there might be one a kilometre away. So, mostly on a whim, I asked ChatGPT: our bike won't start, and when it does it stops after 100–200 metres, what's wrong? One of its suggestions was to open the fuel tank, blow air into it with your mouth, and close it again.

I had no idea why that would work. It worked.

> My best guess afterwards: the fuel cap has a tiny vent that lets air in as fuel goes out. If it's blocked, a vacuum builds up in the tank, the carburettor starves, and the engine dies after a short run, which is exactly our 100–200 m pattern. Opening the cap releases the vacuum. I haven't verified this on our bike, so treat it as a plausible explanation, not a diagnosis.

## The long way home <span class="clock">1:04 → 1:19 am</span>

When it started and kept going, I was cautiously happy. Okay, it's working, it's going. Google Maps said 4.6 km. There were two ways home: one like the hypotenuse of a triangle, the other along the base and the perpendicular. We somehow took the longer one.

Every kilometre that ticked down felt like insurance. At 3 km, fine. At 2 km I told myself that even if it breaks now, I can push it. It didn't break. We rode all the way to within a few hundred metres of the PG. I'd have said 600 m; the phone says about 400 m in a straight line.

## An experiment in anxiety <span class="clock">1:19 → 1:26 am</span>

Then something occurred to me, and I wanted to try it. Instead of turning in, we rode *away* from home, in the opposite direction, on a bike that had broken down repeatedly an hour earlier. The question: how anxious would I get as the distance from home grew?

The answer felt almost linear. Every bit of extra distance added a bit of extra worry. Somewhere around what I'd have called 2 km, the feeling flipped from "this is interesting" to "no boss, now it's a real risk", and we took a U-turn.

<figure class="wide">
  <p class="fig-title">How far from home we were, all night</p>
  <p class="fig-sub">Straight-line distance from our PG (approximate, km), 9:50 pm – 1:45 am.</p>
  <div class="chart" id="home-chart"></div>
  <figcaption>The little bump at the far right is the anxiety experiment. Distances are measured from a deliberately blurred point near home, so they're good to within a few hundred metres.</figcaption>
</figure>

> The phone puts the U-turn at **1:23 am**, about **1.6 km** from home in a straight line, three and a half minutes after we turned away. It felt like 2 km. Anxiety rounds up, apparently.

We came back, the bike carried us right up to the PG, and by Timeline's reckoning we were home at **1:37 am**. Then we slept.

## Memory vs. phone

Here's everything I estimated in my head, next to what the data says.

| Moment | I remembered | Timeline says | Off by |
|---|---|---|---|
| Left the PG | ~9:30 pm | 9:54 pm | 24 min early |
| Reached 7 Sisters | ~10:15 pm | 10:09 pm | 6 min late |
| Bike first died | 12–12:30 am | ~12:17 am | inside the range |
| Where it died | ~12 km from home | 8.9 km straight-line | road vs. crow |
| Delivery rider's drop-off | ~7 km from home | 5.5 km straight-line | road vs. crow |
| Where I relaxed | ~600 m from home | ~400 m straight-line | close |
| Anxiety U-turn | ~2 km out | ~1.6 km straight-line | felt further |
| Home | ~1:30 am | 1:37 am | 7 min early |

My distances were all a bit bigger than the straight-line numbers, which is expected because roads aren't straight. My clock times were off by up to 24 minutes, always in the direction of a neater number. The one thing memory got *more* right than any data could is the part nothing logged: the waiter's fake urgency, the boxes going into the lake, and how the delivery rider just offered.

## How I made this

Google Maps Timeline now lives on the phone, not in the cloud. On Android you export it from Maps → *Your Timeline* → ⋮ → *Location & privacy settings* → *Export Timeline data*, which gives you a single JSON file. Mine had three parts: `semanticSegments` (visits and trips, like "Motorcycling, 17 km"), `rawSignals` (individual location fixes with accuracy, source and sometimes speed, plus activity guesses like `WALKING` or `EXITING_VEHICLE`), and a small profile.

For this post I pulled every fix between 9:53 pm and 1:42 am (about 190 location points and 500 activity readings), split the night into phases by time, and computed distance and speed per phase in Python. Speed told the phases apart cleanly: about 4 km/h is pushing, about 20 km/h is a stranger's leg, and 25–45 km/h is a working engine. I didn't need Google Fit; the 30-second GPS fixes were enough to see the walking.

The track data behind the map and charts is [here](track.json), with the area around where we live removed.
