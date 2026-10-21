# Cup of Duty . ݁₊ ⊹ 🥐. ݁˖ . ݁݁🥖
Ticket style cafe game where user builds drinks for customers with varying degrees of patience.

## How to run it
 
There's no build step. It's one file, `cafe3.html`.
 
1. Download `cafe3.html`
2. Double click it
3. Play
You need internet because React and Babel load from a CDN (cdnjs). If you're offline it'll just be a blank page.
 
## What it's built with
 
- **React 18.3.1** (the UMD build, loaded with a `<script>` tag, not npm)
- **Babel Standalone 7.23.9** so the JSX gets compiled in the browser
- Plain CSS in a `<style>` tag (no Tailwind, no libraries)
- Inline SVG for the cup, the faces, and the icons
- `localStorage` for the leaderboard
Babel running in the browser is slow-ish on first load and you wouldn't do it in a real app. I did it so everything fits in one file. If you want a real project setup see "Turning this into a real project" below.
 
## How the game works
 
### The loop
 
1. Start a shift. A customer ticket shows up on the rail at the top.
2. Tap a ticket to pick who you're serving.
3. Use the tabs (Drink, Cup, Milk, Syrup, Toppings) to build the drink. The cup in the middle updates live.
4. Hit **Serve**. You get graded, paid, and the next customer comes.
5. If a ticket's timer hits 0 the customer walks out and you lose a heart. 3 hearts gone = shop closed.
It's endless, so it keeps going until you lose all 3 hearts or hit **Close shop**.
 
### Grading
 
Your drink is compared to the ticket and scored out of 100:
 
| Part | Points | How |
|---|---|---|
| Drink type | 30 | exact match or nothing |
| Size | 10 | exact match |
| Hot / iced | 10 | exact match |
| Milk | 15 | exact match |
| Syrups | 15 | Jaccard similarity of the two syrup lists |
| Toppings | 20 | Jaccard similarity of the two topping lists |
 
Jaccard similarity = (things in both lists) ÷ (things in either list). So if they wanted vanilla + caramel and you gave vanilla only, that's 1 ÷ 2 = 0.5, so you get half of the 15 points. If both lists are empty it counts as a perfect 1.
 
Stars: 95+ is 3 stars, 75+ is 2, 50+ is 1, below that is 0.
 
### Money
 
- `base` = drink price + size + milk + 0.50 per syrup + 0.50 per topping
- `pay` = `base × (score / 100)`
- `tip` = `base × 0.4 × (timeLeft / timeMax)`, only if score is 80 or more. Faster = bigger tip.
- Rush customers: total × 1.5, but only if score is 50 or more
- `ingredients` = `base × 0.30`, charged every time you serve (even a bad drink)
- **Profit** = sum of (pay + tip − ingredients)
Walkouts cost you a heart but not money.
 
### Rush customers
 
Starting from the 3rd customer, there's a chance (starts at 14%, goes up 1.2% per customer, caps at 35%) that a customer is a rush order. They get:
 
- a red RUSH · NOW! tag, an angry face, and a shake animation
- a timer that's about half of normal (never under 20 seconds)
- a red banner when they show up
- they get put at the front of the rail
### Difficulty ramp
 
`n` is how many customers have shown up so far.
 
- Timer length = `(50 + 10 × extras) × max(0.6, 1 − 0.015n)` seconds, where extras = number of syrups + toppings + 1 if there's milk
- Time between customers = `max(5, 12 − 0.3n) + random(0 to 5)` seconds
- Rail holds 3 tickets at once, then 4 after 8 customers
So it gets faster until about customer 27 where the timer hits its floor of 60% (I didn't tune any of these numbers very carefully, so they might feel off).
 
### Leaderboard
 
- Saved to `localStorage` under the key `littlecafe_runs_v2`
- Stores the last 40 shifts (profit, served, accuracy, avg serve time, fastest perfect serve, best streak, date)
- **Profit** tab sorts by profit. **Speed** tab sorts by average serve time (lowest first) and needs 3+ drinks served in that shift
- It's per device and per browser. Clearing site data wipes it. It is not a global leaderboard.
## Code tour
 
Everything is in `cafe3.html`. Rough order inside the `<script type="text/babel">` tag:
 
- **Data arrays** (`DRINKS`, `MILKS`, `SYR`, `TOP`, `SIZES`): the menu. Each drink has a price `p` and a milk ratio `m` that controls how light the coffee color gets.
- **`mix()`**: blends two hex colors. Used to tint the coffee based on how much milk is in it.
- **`Cup`**: draws the whole cup as SVG. Hot drinks are a ceramic cup with steam (and latte art if it's a latte with no whipped cream). Iced drinks are a clear glass with ice and a straw, with syrup layered at the bottom. Toppings are drawn on top.
- **`grade()`**, **`priceOf()`**, **`lines()`**: scoring, pricing, and turning an order into text lines.
- **`mk()`**: makes a random customer/ticket.
- **`tick()`**: the game clock. Takes the state and a time step, returns new state. It handles timers counting down, walkouts, and spawning customers.
- **`Face`**: the little customer avatars (angry version for rush).
- **`Board`**: leaderboard table.
- **`Shop`**: the main component. Holds all the game state and the UI.
- **`App`**: just the awning and `<Shop/>`.
### State
 
Two main `useState` objects in `Shop`:
 
- `s` is the shift state: phase (`idle`, `play`, `done`), the ticket list `t`, hearts, profit, streak, finished orders, paused flag, feedback card `fb`, toast message
- `o` is the drink you're currently building: `{drink, size, iced, milk, syrups[], tops[]}`
### The timer
 
A `setInterval` runs every 250ms and calls `setS(p => tick(p, 0.25))`. `tick` returns the same state unchanged if the game is paused, if the feedback card is showing, or if the phase isn't `play`. It also skips if `document.hidden` is true, so the clock stops when you switch tabs.
 
I used a fixed 0.25 step instead of measuring real elapsed time, which means timers can drift a bit if the browser throttles the interval.
 
## Changing stuff
 
**Add a drink:** add an object to `DRINKS`, like `{id:'mocha',n:'Mocha',p:4.5,m:.5}`. The id has to be unique. `m` is how much milk (0 to 1).
 
**Add a syrup:** add `{id:'pumpkin',n:'Pumpkin',c:'#d9822b'}` to `SYR`. `c` is the color it shows in the iced cup.
 
**Add a topping:** add it to `TOP` AND add a drawing for it inside `Cup` (the `Tops` group). If you only do the first part it'll show up as a button but nothing will appear on the cup.
 
**Make it harder or easier:** look at `mk()` and `tick()`. The numbers for timers, rush chance, and spawn rate are right there.
 
## Turning this into a real project
 
If you want normal React with npm:
 
```bash
npm create vite@latest little-cafe -- --template react
cd little-cafe
npm install
npm run dev
```
 
Then:
 
1. Copy the CSS from the `<style>` tag into `src/index.css`
2. Copy the contents of the `<script type="text/babel">` tag into `src/App.jsx`
3. At the top of `App.jsx` add `import { useState, useEffect, useRef } from 'react'` and delete the `const {useState,useEffect,useRef}=React;` line
4. Add `export default App` at the bottom and delete the `ReactDOM.createRoot(...)` line (Vite's `main.jsx` already does that)
5. You'd probably want to split `Cup`, `Shop`, and `Board` into their own files after that
