# Poker Hub — v1.1.0 · the table on one screen

### What changed in v1.1.0 (10/11/2026)

Ernest's notes after the first look on the phone, all on **Tonight**:

- **The top strip is the table.** The venue is the title; under it,
  blinds · how many are seated (and out) · the clock. The clock is the
  pause — tap it, the dot turns amber and the strip says *paused* (also
  in the gear menu). Undo sits beside the gear. The old bar under the
  header and the two stat cards are gone; one line of money sits above
  the roster instead (*On the table · In · buy-ins · tip*, or *Balanced
  — ready to settle* / *missing N* once everyone is out).
- **One person per line**, on a four-column grid so the money lines up:
  name (with the coach's type as a small pill — the exploit is a tap
  away on the card) · total in, with ×N once they have rebought · the
  rebuy box with its + · Cash out. Rows are 47 px (44 px controls, the
  touch floor); fields stay 16 px so iOS does not zoom.
  **Fit, measured at 402 × 874 with the standalone insets:** eight
  players, the seat row, the dealer line and the three buttons on one
  screen with no scrolling; ten scrolls by about one row.
- **Seat someone is a ghost row**, not a pop-up: name, buy-in, Seat.
  Focusing it opens a strip of regulars (ranked by nights together) and
  one line saying who the name lands on — *✓ Patrick Chan from "pat" ·
  20 nights · +HK$34,730*, or *New person: K — did you mean Kenneth?*
  with the guess one tap away. Same identity step as before (stored
  spelling wins, the seat carries the player id). The cursor stays in
  the row after seating, for the six-in-a-row at the start of a night.
- **The dealer is one line:** *Dealer* · who dealt · tip · a quiet ×.
  No Set button — leaving a field saves it, without a redraw, so the
  keyboard can go from name to tip. Undo reaches it. With no dealer the
  line is a quiet *+ Dealer*.
- **History · Timeline · Seating** as three buttons on one row
  (diamond, clock, chair). History carries tonight's hand count and a
  dot while a hand is in progress.
- **The home-screen icon.** iOS fills any transparent pixel with black,
  and the PNGs had transparent rounded corners; the page also carried two
  touch-icon links (a data: URI and the file), so iOS could fall back to
  the manifest's transparent icon. Every PNG is now an opaque, full-bleed
  Prussian tile (iOS applies its own mask), and over http the one touch
  icon link points at the real file with `?v=2`. **Delete the old icon
  from the home screen and add it again** — iOS keeps the old one.
- Fixed on the way: the clock never ticked (it looked for a bar that no
  longer existed); the command bar sat 7 px above the nav and let the
  roster show through; felt labels and the small pill were under the
  11 px floor.

Verification: 2,070 assertions (node suites + 602 in the browser,
including a new §10 that measures the eight-player fit), smoke walk in
both themes with no errors, no overflow and zero network requests.

---

## v1.0.0 · the rebuild on EDB 2.0.0

One app for the whole night: buy-ins, hands, reads, settlement, ledger —
and now the dossier on Ernest himself. **v1.0.0 (09/11/2026)** is the
rebuild agreed that evening: the engines of v0.10 kept with their tests,
the shell rewritten on EDB 2.0.0, three things added, and the four older
apps (tracker, Hand recall, Ledger, Hub v0.10) now in line to retire once
this has survived a real night.

Plan of record: `..\poker-hub-rebuild-plan.md` (mirror of the Claude Doc
*Poker Hub — rebuild plan v3*). Rendered screen options: the Design
artifact *Poker Hub screens*; Ernest chose **C — table first, the hand as
a sheet over it**.

### What changed in v1.0.0 — the rebuild

**The shell is EDB 2.0.0** — `edb-brand.css` 2.0.0 pinned under `eds/`,
the three families inlined as base64 (`eds/fonts.css`, from the poker
ledger's build) so the type is real from `file://` and from a flat with
no signal, still with zero network requests. A sticky `.topbar`, a phone
`.bottom-nav` with **four destinations — Tonight · Nights · Players · Me**
— and `.tabs` taking over from 768 px. Hands and Data & backup are
reached from inside Me and from the settings menu rather than from the
nav. Back follows where you came from (a hand opened from a night returns
to the night), falling back to the parent.

**Tonight is layout C.** The roster takes the screen: name with a status
dot, the buy-in total in mono (tap it to correct), the rebuy field and
Cash out beneath; a cashed-out row folds to one line. Under the roster,
three rows: *N hands logged tonight*, *Timeline*, *Seats* (the felt,
with the draw and the share, moved here from the top of the table). The
command bar carries **Table mode · Settle up · Record a hand**. A hand
opens as a **sheet over the table** — the recorder unchanged underneath,
its own bar as the sheet's footer — and closes back to the table with the
hand kept where it was. Tapping a name opens the **player card**: what
they have in, when they sat down, the coach's read, **Note a tell**
(Tell · Sizing · Villain · Dynamic, filed against the seat), correct
buy-ins, buy back in, remove, and the way to their page.

**Me** is the old Dashboard plus the dossier on him. The verdict and the
confidence interval as before; then **From logged hands** — VPIP, PFR,
3-bet, to showdown, won at showdown, aggression — each with its `k / n`,
and the sentence that makes them honest: *your selection, so skewed
towards the interesting ones*. **Leaks**: the coach's tags across the
hands he played, as bars, with the grades. **The coach on you**: the read
when one has been written, and **Send hands to the coach** either way.

**Log a past night.** A night that happened without the app: date, time
sat down, venue, stakes, hours, *I played / I sat out*, his money, and a
roster of names with buy-in and cash-out (names autocomplete from the
people he has played). The form writes a tracker file in memory and sends
it through **the same importer a settle uses** — the same identity step
for every name, the same preview, the same refusals. The form says when
the money does not balance and by how much, and files it anyway, marked.
Reachable from Tonight when nothing is running, from Nights, from Me and
from the menu.

**The coach loop, both ways.** `src/coachexport.js` writes a stored hand
as `edb-hand-record/1` — facts only (no grade, no tag, no verdict leaves
the hub), prose actions per street with the pot the replay reaches at each
street's end, and `raw` = the stored hand itself. The bundle
(`edb-coach-request/1`) carries every hand not yet sent plus the dossier,
and goes out through the share sheet on a phone (AirDrop, Files) or as a
download. On the way back the importer takes `raw` when it is there, so a
hand the hub wrote returns **exact**: the replay still has to reproduce
the stated net or the record is refused, the twin is replaced and the
review lands on it. Asserted in `test_hero.mjs` §3.

**Reads are the coach's.** Ernest, 09/11: *"Reads should be not from
me."* The in-app read form is gone; a revision arrives as a second coach
file and the earlier read goes into history as before. Tells and table
notes are still his, at the table.

**The dealer is on the ledger.** Ernest, 09/11: the tip settled correctly
at the table but left no trace on the night, so a balanced night read as
short on the ledger. The live table now names the dealer (*Who dealt ·
Tip*), the night carries `dealer: {name, tip}`, the night's page lists the
dealer with the people — *Mel · dealer · +HK$500, tip, funded from the
pot* — and closes with one line: *Players −HK$500 · dealer +HK$500 →
balances to zero*. The league table's reconciliation gap counts tips as
the pot's, not anyone's. Log a past night and Edit this night both take a
dealer and a tip, so old nights can be corrected.

**Backup on the settle.** Filing a night opens *Night filed — back up
now?*; one tap takes the file to the share sheet. The amber nag stays.

**Files out go through the share sheet** where there is one
(`navigator.canShare({files})`): backup, coach bundle. A desktop browser
downloads them as before.

**Icon B1.** The carmine heart Ernest chose in August, with the scalpel-E
now in ink `#edf3ff` instead of knocked out in Prussian — the one change
that rescues it at 16 px (merge spec §15). Regenerated at every size;
`raster-icons.mjs` does it from the SVGs.

**Two latent test bugs fixed.** `test_import.mjs` §9 and `test_browser.mjs`
only passed in US Eastern time: the tracker fixture's first buy-in was
20:30 UTC, the 15th in New York and the 16th in Hong Kong — the zone the
phone actually lives in. The fixture now sits at 10:00 UTC (the 15th from
Honolulu to Auckland) and the §9 night takes its date off the filed
session. `test_browser.mjs` also hard-coded a Chromium path that no longer
existed.

**Verification: 2,027 assertions** — the 1,912 carried over, re-run in
`Asia/Hong_Kong`, `UTC`, `America/New_York`, `Pacific/Auckland` and
`Pacific/Honolulu`; `test_hero.mjs` (69) new; `test_browser.mjs` grown to
559 with §9 (the past-night form end to end, and Me). The browser suite
drives the built file at 390×844 in headless Chromium with real storage:
zero network requests from `file://`, every estimated figure carrying its
tilde, no horizontal overflow, no control under 44 px, no gradient, glow
or coloured rail, EDB stamped 2.0.0.

**Not built, by decision:** no sync (local only, moved by file — network
later through the `Store` interface's empty `sync` hook); no service
worker yet (a hosted copy needs a connection on first load); the Poker
Coach dashboard stays a separate, regenerated file.

### Install — GitHub Pages

Repo **`Erniedabernie/PokerHub`**.
Contents of `app/`: `index.html`, `manifest.webmanifest`, `icons/`.

```
cd "Poker Hub\app"
git init
git add -A
git commit -m "Poker Hub v1.0.0"
git branch -M main
git remote add origin https://github.com/Erniedabernie/PokerHub.git
git push -u origin main
```

Then **Settings → Pages → Deploy from a branch → main / (root)**. The app
is at `https://erniedabernie.github.io/PokerHub/`. Open **that** URL on
the phone, **Share → Add to Home Screen**, and start from the installed
icon — iOS gives an installed web app its own storage, separate from
Safari's, so import nothing until it is on the home screen. Open the same
URL on the computer: one origin, one store, moved between the two by the
backup file.

---

## v0.10.0 and before

### What changed in v0.10.0 — the dossier

**Every person has a read.** Ernest, 10/09/2026: what he needs from a
profile is *"player tendencies and labelling"*, and the labelling is
better done by an LLM. So the split is exact: **the coach writes the read,
the hub stores it, shows it, and counts what it stands on.**

A read, in his own framework's terms (`player-types-framework.md`):

- a **type** from his six — Nit · Rock · TAG · LAG · Station · Maniac —
  shown with the framework's counter for it, so a label is never just a
  name;
- the three-field note: **entry · after the flop · the exploit**, the
  exploit set apart because it is the line that makes money;
- the two questions his framework says type a player in a multiway,
  unraked game: **does he attack a check, does he fold to a raise** —
  with "not seen yet" as a real answer;
- **tells**, physical, dated;
- signed (**by the coach** or **by you**) and dated.

**A read never silently replaces a read.** A new one pushes the old one
into *Earlier reads* and names the fields that moved. The identical read
again changes nothing and says so. Merging two records that were one
person keeps the newer read and files the other in history.

**The evidence sits under it, gathered — never copied.** Every
observation of the person, newest first: the coach's read on each hand,
matched through the **seat** the import linked (so a read filed against
someone else's seat is theirs whatever name it carries), live notes by
the name they were taken against, notes typed onto the person. A hand the
man tabled is marked with his cards — that one is fact, the rest are
inference. Each observation opens to the hand it came from.

**The hub computes only what is mechanical:** how many observations, over
how many nights, how many tabled — and from that a deliberately
conservative tier (*working read* needs ten across three nights; his
framework's first failure mode is typing off three hands). And **how much
has been seen since the read was written** — which is the signal to send
it back to the coach.

**At the table:** each seated player's row carries the type and the
exploit on one line; a tap shows the whole read without leaving the
table. Table mode keeps him on the table, so from there the link to the
full page is not offered.

**The loop:**

1. *Data → Send the reads to the coach* — `edb-dossier/1`: everyone
   observed, their current read, its history, every observation. **No
   money in it**: a net is the number most likely to leak into a read as
   "he wins, so he must be good", which is a result grading a player.
2. The coach writes `edb-player-profile/1` back.
3. *Import a file* — a preview lists first reads, revisions (and which
   fields), unchanged reads. **It never creates a person.** A name that
   matches nobody becomes a question — here is who it might be, or skip —
   and the import waits. Suggestions include close spellings (a slip like
   *Tomas* offers *Thomas*); nothing is acted on until he taps.

**The first reads**, written from all 103 observations
(`fixtures/coach-profiles-2026-09-29.json`, generator
`make-coach-profiles.mjs`, which refuses a name not in his roster, a type
on fewer than three observations, or any read argued from a result):

| Person | Type | On |
|---|---|---|
| Thomas | Maniac | 28 obs · 10 nights · 13 tabled |
| Una | Station | 11 · 8 · 6 |
| Kenneth | LAG | 11 · 4 · 5 |
| James Hooi | LAG | 10 · 5 · 6 |
| Shuki | Rock | 8 · 3 · 6 |
| Vanessa | Rock | 7 · 5 · 1 |
| Benny | Rock | 7 · 4 · 2 |
| Justin | LAG | 6 · 3 · 4 |
| Patrick Chan | LAG | 5 · 3 · 4 |
| Alan | LAG | 5 · 2 · 4 |
| James Cheng | LAG | 3 · 2 · 2 |
| Dave | *not typed* | 1 · 1 · 1 |
| Terence | *not typed* | 1 · 1 · 0 |

Typed by the box whose **counter** works on the person; where the box does
not fit, the summary line says so (Shuki and Vanessa are wide going in and
rock-like after the flop).

**Two fixes on the way:** navigating never reset the scroll, so tapping
someone low in the Players list opened half-way down their page — past the
read; and a sheet left open when navigating away from it stayed open.

### What changed in v0.9.0 — the coaching archive is in

**The hub reads `edb-hand-record/1`.** Point it at a file of Poker Coach
hand records — one, a bundle, or a whole folder read in one go — and it
imports them. That is the format both directions of the pipeline speak,
so "send to the coach" and "bring the analysis back" are now the same
file moving two ways rather than a migration.

**Every hand goes through the gate.** A record becomes a hand only by
replaying through the engine and agreeing with the two figures it states
*independently of its own actions* — the pot at each street end, and his
net. A hand that does not reconcile is **refused and named**, never
imported quietly. The gate lives in `src/coachimport.js` and
`reconcile-coach.mjs` is now a thin driver over it, so the 55-of-55 the
script prints is the 55-of-55 the app gets. There is no second reading of
anything to drift.

**The same hand twice is one hand.** The ids do not match across the two
apps — `txt-2026-08-25-40-AcQd--6000-…` against `hg-20260825-aq` — and
every coach record is hand 1 of its own file, so identity is the night,
the board and the final pot. Verified rather than assumed: across his 26
hub hands and the 55 in the archive that key collides with nothing on
either side and pairs all 26 twins, with the nets agreeing on every one.
The archive copy wins and the hub twin is removed, his call.

**What the import carries besides the hand:** the review the coach wrote
(grade, tags, rulesBroken, verdict, deviation, the range-map path) and a
dated read per villain, each knowing which hand it came from. Kept apart
from the hand on purpose — the hand is verifiable, the review is
judgement, and neither may describe the other.

**Aliases come from the file and nowhere else.** The hub never decides
that two spellings are one person. `Patrick → Patrick Chan` standing,
`James → James Hooi` **pinned to four named hands** because a bare James
is three men in his roster, `Terrence → Terence`.

**Two things it says out loud rather than burying.** Three hands had no
stated winner and no showdown to settle it, so the winner was chosen as
the one that reproduces his own recorded net — that is the one place a
reading is fitted to an answer, and it names the hands. One hand had the
prose naming somebody out of turn, and the engine's turn order was used
instead.

Driven end to end in a real browser: restore his backup, import the
bundle, 26 hands become 55, no duplicates, every seat linked to a
profile, zero console errors.

### What changed in v0.8.4 — two hands re-dated, three names resolved

**Two hands were on nights he never played.** `hg-20260710-kk` moves to
**05/06/2026** and `hg-20260806-a4o` to **30/07/2026**, both on his say-so,
and both hold up independently: session stakes track the room, not the
hand — Bel-air is the HK$20/20 game and Floral Towers the 20/40. The KK
record is 20/20 and 05/06 is Bel-air; the A4o record is 20/40 with an 80
straddle and 30/07 is Floral Towers. Neither night had a hand filed
against it before; both do now, and both have settled money, so the last
two estimated-only nights are gone.

The hand ids moved with the dates (`hg-20260605-kk`, `hg-20260730-a4o`)
because the id encodes the date and would otherwise stay wrong forever.
Applied across his Poker Coach records, the leak log, the coach dashboard,
both range-map documents and their PDFs — the two 06/08 GG hands, which
are real, were scoped out of every replacement. Originals kept in
`Poker Coach\_to_delete\pre-redate-20260909\`.

**Three names now resolve to his roster.** `Patrick` → Patrick Chan
(standing, plus the "Pat" his prose uses), `James` → James Hooi **pinned
to the four hands he named** (a bare "James" is three different men in his
roster), and `Terrence` — where the archive is right and his hub roster
holds the typo.

Aliases live in `fixtures/coach-corrections.json` and are applied to the
*seat*, never by rewriting his prose: the reader still matches what he
actually wrote, and only the identity that leaves the file is canonical.

### What changed in v0.8.3 — the jam names its own size, and the archive reconciles

**All 55 hands of the coaching archive now replay exactly.** Every pot
marker the prose states, every net the record states, chips conserved in
all 55, nothing unread. It was 50 of 55.

**An all-in can state its own total.** Before this the recorder had no
All in button at all: `act` refused a jam unless the player's stack was
already on file, and the night records buy-ins, not what is in front of a
man three hours later. The only way to log one was to type it as a raise
— a raise the engine has no reason to cap, so it matched the caller to
the full amount and never handed back the uncalled part.

Now the amount box **is** the all-in total. It is believed, and the
seat's starting stack is back-filled from it so every later street
settles against a real number. A short all-in for less than the current
bet is accepted, because that is the case that creates a side pot and the
one that matters most. The archive is the proof of what the old
behaviour cost: `hg-20260825-aq` states *"all-in for 5,460 total, 120
returned"* and replayed 120 out on his net and 240 out on the pot.

**The reader no longer trusts written order as action order.** His prose
is a description, not a transcript, and a description sometimes names
people in seat order. `hg-20260825-una-tt` writes its flop as *"Una
checks · Thomas bets 800 · Una calls"* with Una on the button and Thomas
under the gun — Una cannot be first. Taking that literally desynchronised
the street, shunted every later atom one street along and put the flop
pot 1,600 light.

The reconciler now schedules atoms against the engine's own clock: if an
atom names somebody else while a later atom on the same street names the
player actually to act, that one goes first. Bounded to the street, so it
can never reach across a board card, and **every swap is recorded** — a
real transcription error has to stay visible rather than be tidied away.
Across the whole archive it fires exactly once.

**A corrections layer.** `fixtures/coach-corrections.json` holds what
Ernest answered on 09/09/2026, applied over the archive at load time. The
Poker Coach files are his to regenerate and nothing here writes to them.
One attributable entry per hand — take an entry out and the hand goes
straight back to failing, which is the point: no correction can quietly
become part of the parser.

**One thing the archive turned up — and what it does not prove.**
`hg-20260730-a4o` (filed as 06/08 until he re-dated it to 30/07 on 09/09): he folded A4o (aces and fours) on `As9d4h` to a ~188bb
jam, and Patrick showed **AKo**. Against that hand he was 72.0% and
folded the winner.

That does **not** make the fold wrong. It was a range decision and it
still is. At 2,900 to call 6,020 the price needs **40.3%**, and against
the nutted bucket (AA / 99 / 44 / A9 — 11 combos) he holds **8.4%**.
Calling only wins if **over half** the jamming range is one pair or
worse — at least 12 one-pair combos against those 11. AK alone is 8.

So the fold stands. What the sighting does kill is the record's stated
*read*: "unseen, jam range 99 / A9 / 44" and "zero credible bluffs". That
bucket is not empty, and it is now one combo class wide. One observation,
logged as one observation — the Coach record's range line needs
regenerating, its conclusion does not.

### What changed in v0.8.2 — the straddle can sit on the button

Your home game straddles the button. The recorder could only ever post a
straddle **under the gun** — the handler passed `'utg'` and nothing else,
and the engine's own name for a button straddle is `miss` (Mississippi).
An unknown type is not rejected, it falls through to the UTG branch, so
the wrong seat posted it and **every position in the hand moved**, with
nothing on screen to say so.

A Mississippi straddle acts last, which moves first-to-act to the small
blind. Found while reading your coaching archive: 21 of its 55 hands
straddle the button, and none of them replayed correctly until this was
fixed.

### What changed in v0.8.1 — screenshots removed

You can attach a photo to a hand in Hand recall. The hub had storage
reserved for those — the merge spec planned it — and **nothing ever wrote
to it or read from it**. Your instruction, 09/09: *"completely remove this
function … there's no real use for it."* Gone: the IndexedDB store, the
two functions that would have used it, and the flag on a hand record. A
database created before today keeps its empty store, which costs nothing
and is never opened again.

An imported record's screenshot flag is dropped rather than carried. It
points at a picture inside another app's database, and nothing here could
ever show it.

*(Checked before removing: your poker ledger backup — the only real file
of yours I hold — has no image data anywhere in it, and no hands either.
Whatever screenshots you have are in Hand recall, which isn't coming
across.)*

### What changed in v0.8.0 — a hand, as a picture

**Share it** on any hand: the **card** picture, which reads like a hand
history with the board up top, or the **felt**, which draws the table. Two
of Hand recall's four renderers, vendored since v0.6 and reaching no
screen until now. The seating plan and the animated draw shipped in v0.6,
so all four are live. Whichever you pick is remembered, because it is a
choice made while looking at the picture rather than one made in advance.

**The hard part was making an imported hand drawable.** The renderers are
the engine — they replay the hand to draw it — but the store keeps the
*record* the engine produces, which is deliberately flatter. Keeping a
second raw copy of every hand would have drawn the ones recorded here and
**none of the ones imported**, and everything from Hand recall arrives as
a record. So the record has to be enough, and `Rec.toHand` proves it is:
run a record back through it and then through the engine again, and it
reproduces itself field for field. That is asserted against the recorder's
own output — 2-to-10-handed, straddles, side pots, splits, every ending
street — and against the Hand recall fixtures.

**One text.** What you read on the hand page, what you copy, and what the
picture draws are now the same string by construction. Getting there
turned up four defects:

1. **Every hand the hub recorded shipped a picture and a text that
   disagreed about the date.** The store keeps ISO because ISO sorts; the
   picture is read, not sorted, so it draws day-first. The text was being
   written from the stored form and the picture from the display form —
   100% of recorded hands, first line, every time. Both now come from the
   display form, and the record keeps the stored one.
2. **Same again for the currency**: "HKD5/10" on a hand shared to
   WhatsApp. A code is what converts, a symbol is what you read.
3. **Two of your own names at one table gave the hand two heroes.**
   `heroName` is an alias list — "Ernest, EDB" out of the box — and both
   are you. The engine reads the *last* flagged seat and the live table
   the *first*, so a hand could report one chair's cards against the other
   chair's money. The table now refuses to seat you twice, and both the
   recorder and the round trip keep the first claim only.
4. **A hand recorded before v0.8** has the old currency and date frozen
   into its text, and no migration can reach a file already on your phone.
   So the text is derived from the record and the archived copy is only
   the fallback — which fixes those hands without touching them.

Also: the segmented toggle never highlighted the chosen segment. The
design system styles `.active` and every control in this app marks the
choice with `aria-pressed` — so the theme switcher has been shipping with
nothing highlighted since v0.4.

### What changed in v0.7.0 — the cast, significance, and a name on every hand

**Naming who was in a hand no longer shrinks the table.** This is Hand
recall v1.9.1's methodology, which is what you asked for: *"the
methodology of the hand recall part should be the same as the app."*
Everyone stays seated. Tapping somebody out takes them out of the *hand*,
not off the table — so the positions stay right and the blind they posted
stays in the pot as dead money. They fold the instant the action reaches
them, as real recorded actions the shared text already knows to drop.

What was there before was wrong in a way that never announced itself: it
removed the chair as well, so a nine-handed table where three people
played became a **three-handed hand** — the cut-off became the small
blind and six dead blinds vanished out of the pot.

**"Not in the hand" now has a definition.** Yours: *"not in hand means i
was not significant in the hand. meaning if i folded a small blind or big
blind it still means im not in the hand. if i raised and folded im
technically in the hand."* So: **you were in it if you put chips in
voluntarily, or if you were still live when a board card was dealt.**

- Folded the small blind, or walked in the big blind → not in it.
- Raised and folded to a 3-bet → in it.
- Checked the big blind, saw a flop, folded → **in it.** That is the one
  case your sentence does not settle, and seeing a flop is where I put the
  line. Say if you want it the other way; it is one predicate.

It is a **label, not an accounting fudge**. A blind you lost is still
money you lost, so `heroNet` never changes. `heroInHand: false` is what
lets a rate count hands you played rather than hands you sat through, and
`Layers.played()` is the filter. A hand you were not in is filed with your
cards marked *deliberately not recorded* rather than *not filled in yet*,
and the text you would share does not mention you at all.

**Every hand goes into the file under a name.** Two halves. No seat can be
nameless — Hand recall lets a hand run on bare positions, the hub does
not, because a hand that joins to nobody is the thing the two apps merged
to stop. And the hand itself arrives already named: *"Una v Benny · 75"* —
who actually played it, you first when you were in it, and how big the pot
got. Type over it and yours wins. Imported hands are named on the way in
by the same rule, so a list of two hundred rows is searchable instead of
reading "Hand 7" two hundred times.

**Undo now goes back past the deal**, which is the only way to change who
was in a hand once it has started — and what the refusal tells you to do.

Four defects found and fixed on the way, three of them by an adversarial
pass over the new code rather than by review:

1. **Undo could file your next tap against the wrong player.** It dropped
   the derived folds first and only then looked for something real
   underneath. When there was nothing — exactly the state a deal leaves
   when the first seat to act was not in the hand — it returned an error
   *having already thrown the folds away*, so the turn silently went back
   to somebody who was not in the hand while the screen still showed the
   panel for somebody who was. Nothing is dropped now until the real
   action is found.
2. **Anything typed into the name or note box was discarded** by the next
   tap, because every commit rebuilds the panel from the record and those
   two fields were only read at save time. The note box had this hole
   before v0.7; both are now written as you type.
3. **A malformed imported hand threw a raw `TypeError` out of `commit`**
   half way through, leaving the session and the ledger row written and
   the hands not.
4. **A pot could be filed as won by somebody the hand says was not in
   it** — take both blinds out, have the whole cast fold, and the big
   blind gets a walk. Saving that is now refused by name, because it means
   the cast is wrong rather than that the hand is strange.

### What changed in v0.5.1 — the real file, recall, and a way out
### What changed in v0.5.1 — the real file, recall, and a way out

**Ernest's actual ledger, imported.** 32 nights, 48 people, 223 rows, no
questions, nothing orphaned — and it found one defect that only real data
could. His file says the person is **Pat**, with `Patrick` as an alias:
he had already decided. The rename rules, written from the *fragmented*
tracker data weeks earlier, overruled him and renamed the record to
Patrick. A ledger backup's people now come across **verbatim** — his
spelling, his aliases, his decision. The rules stay where they earn their
keep: a raw tracker or Hand recall name, which arrives with no alias list
and no decision behind it. His file is now a fixture, so this stays fixed.

Also from his data: an alias that exactly repeats the name (`Vanessa`
listed as one of Vanessa's aliases) is dropped on import, while `una`
under `Una` is kept — that one records a casing split that got merged.

**A hand from memory.** *"I also need a button that lets me add hands just
based off recall."* The Hands tab now leads with **Record a hand**, with no
live game required. It asks which night — recent ones listed, or a date for
one not logged yet — then opens the same recorder. He is put in the hand
automatically. Adding anyone else runs the same identity step as seating
somebody at a live table, except the suggestions lead with **the people who
were actually at that night**. The finished hand attaches straight to the
night, and everyone in it joins that night's players.

**A way out of a night left running.** *"I need to be able to delete a
current live session… if I opened one but forgot to stop it."* A running
night now offers **End this night without filing it** — on the table
itself, including when the table is empty (the commonest way to be stuck),
and in the settings menu, which is where people look. The confirm lists
what goes with it — players, buy-ins, unfiled hands, reads — and says
plainly that nothing reaches the ledger, pointing at settling as the way
that keeps the money.

One defect found on the way: `validName` compared `exceptId` even when it
was not given, so `undefined === undefined` matched every row without an
id and skipped the duplicate check entirely — which is exactly what
happens when it is asked about a hand's seats rather than a table's.

### What changed in v0.5.0 — stage 3, and the duplication fix

**The night that arrives twice, fixed first.** Ernest was right to worry.
I built the scenario and ran it: a night filed from the live table and the
*same* night typed into the old ledger months ago produced **two sessions
and +1,100 counted twice**, with no warning. The ledger importer matched
on record id alone and never looked at the date. Separately, a hand that
reached the hub through Hand recall and again through the ledger backup
landed **twice**, because that importer keyed hands on id where Hand
recall's keys them on content — and Ernest's workflow (log in Hand recall,
upload the good ones) guarantees the collision.

His ruling, 21/08: *"it should merge if the money, location, date agrees,
and question if ambiguity."* That is what it does now.

- Same date, same venue, same money → **merged**, and the preview says so
  before anything is written. A blank on either side is a gap the merge
  fills, not a disagreement.
- Money that disagrees, or two candidates → **it asks**, showing what is
  already recorded so the answer is informed. "A separate night — keep
  both" is always an option.
- A different venue on the same evening is a different game, unasked.
- On a merge, **counted chips win**: a row already there is left alone and
  only its gaps are filled. The tracker is the truth for money, as Ernest
  set out on 19/08.
- Hands dedupe on content in every importer now.

**The hand recorder.** A hand logged at the table, on the roster that is
already sitting there.

- **Nothing to type but the cards.** The seats, the names and the player
  ids come off the live table. The blinds come off the night's stakes —
  and a night opened without stakes learns them from the first hand rather
  than asking every time.
- **The engine is Hand recall's own**, vendored: it replays the action
  list and derives positions, blinds, straddles, side pots and the
  uncalled-bet return. A hand recorded here is a hand it would have
  recorded, which is why the Hands tab and the importer already read it.
- **The evaluator names the winner** — the thing Ernest asked for that
  none of the three apps did. It is the poker ledger's own 7-card
  evaluator, vendored, with a showdown layer on top.
- **It refuses to guess.** A seat whose cards nobody saw comes back
  *undecided*, and while anything is undecided no winner is asserted at
  all. His own call always overrides, and the record says which it was.
- **One deck.** The picker will not offer a card that is already on the
  board or in somebody's hand — rank, then suit, two taps, 46px targets.
  The evaluator's duplicate detector stays as the backstop for imported
  data. The withdrawn Vanessa read came from a mis-transcribed flop.
- **Undo takes back the misdeal first.** If a street has been dealt but
  nobody has acted on it, the last thing entered was the board — taking
  back the previous street's final call instead would be maddening.
- **A hand's money is an estimate and stays one.** It waits on `liveId`
  until the night is filed, then takes its `sessionId`. It never touches a
  rate, a bankroll or a settlement.

**Who makes the most, and who makes the least.** The Players tab is now a
league table, from counted chips only — net, per night, per hour, nights,
what they bought in for, how often they finish up. Sortable on any column,
with the two ends named outright at the top. A player page adds their best
and worst night, the run they are on, their rebuys read off the night's own
timeline, and what Ernest did on the nights they were there — labelled a
correlation, because they may simply sit at the good games.

Three defects found on the way: a slot in the card picker greyed out **its
own** cards once cleared, with no way to re-enter them; `.field + .field`
leaked its stacked-form margin into every two-column grid, so side-by-side
inputs sat at different heights; and a raise larger than a short stack was
refused with "that is smaller than the current bet", which is true and
useless.

### What changed in v0.4.1 — the live tab, amended

Seven notes from Ernest after the first real look at stage 2, and two
defects the work turned up.

- **The roster row is the tracker's, exactly.** While somebody is in, the
  phone row carries their buy-in total and nothing else — no "still in"
  (the dot already says it) and no net (it does not exist yet). Cashed out
  it reads `in→out` and the result. The desktop columns are labelled
  *Buy-in / Cash-out / Net*, as they were there. The figure is also the
  way to correct it, which is what the tracker did and what the phone had
  no other route to.
- **Sitting down is the identity step.** Type a name and the app says who
  it found: `pat` resolves to **Patrick** and the seat carries his id, not
  his spelling. A name that matches nobody is not quietly accepted — the
  button changes to **Add as a new person**, and half a name offers the
  person it is the start of rather than becoming a man called `K`. The
  suggestion row is the people played with most, by nights logged
  together, narrowing as you type. This is the thing the whole merge turns
  on: everything downstream lands on one record instead of on a string.
- **Enter accepts.** The primary button of any open modal, the *Add*
  beside a rebuy field, the *Set* beside the tip. Enter on a name with no
  buy-in yet moves to the buy-in rather than submitting a form it knows is
  incomplete. In a destructive confirm the primary button is *Cancel*,
  which is the right thing for a key pressed by reflex to do.
- **The reconciliation card says which way it is out** — *missing* or *in
  excess*, not "unaccounted for". And while anyone is still seated it does
  not pass judgement at all: the difference then simply *is* the chips in
  front of them, so the card reads **on the table**. Calling that missing
  money would have been a lie told all night.
- **Reads leave the live tab** for the hand recorder in stage 3. The path
  that carries them onto the night is still live and still asserted.
- **Share, and a Copy that works.** The settle sheet now offers the native
  share sheet where the phone has one — WhatsApp, Messages, anything.
  `navigator.clipboard` needs a secure context and a focused document and
  several webviews refuse it outright, so the payload sits in the DOM and
  `execCommand('copy')` is the fallback, exactly as the tracker did it.
- **No "Back to the table".** The ✕ is that. A modal whose only action
  closes itself is furniture, so the action bar is omitted entirely when
  there is nothing else to do.

Two defects found on the way:

1. **One person could take two seats** under two spellings — `Pat` and
   `Patrick` are different strings and the same man. A ledger row is keyed
   on (session, player), so the second seat would have overwritten the
   first and the night would have stopped summing to zero *without saying
   anything*. Refused now, at the roster.
2. **Two buttons have been shipping with no icon at all.** `icon()`
   returns an empty `<svg>` for a name the subset does not carry — no
   error, no warning, just a gap. Found by writing `user-plus`; the build
   now fails on an unknown icon name, which caught
   `arrow-counter-clockwise` on *Buy back in* and on *Undo the last
   change*.

### What changed in v0.4 — stage 2, and the three apps' design

**The live table.** Start a night, seat everyone, take rebuys, log a read,
cash out, settle, and the night files itself in the ledger.

- **Hours are counted, not typed.** The clock starts with the first
  buy-in and runs to settle; pause it for a break, because a break is not
  poker. The ledger has excluded every hours-less session from every rate
  since it was built — a night that starts here never lacks them.
- **One roster.** The seat resolves to a person when they sit down, so the
  record the ledger row lands on is decided at the table. Nothing to
  reconcile after.
- **Reads at the table**, tagged and attached to a seat. A physical tell
  is the one class of read that cannot be reconstructed from a hand
  history afterwards, so it costs one tap while the hand is in front of
  you, and rides onto the night when you settle.
- **Table mode.** This phone gets handed across so someone can enter their
  own rebuy, and it holds their lifetime result and every read ever taken
  on them. Table mode leaves one tab and hides the settings menu.
- **Settling refuses a night that does not balance**, and says why —
  filing one would record money that never existed.
- **Undo covers everything**, eighty steps deep, on the live bar.

Committing goes through the *same importer a tracker file goes through*
rather than writing rows directly. That path already resolves identity,
already refuses to duplicate a row for a player who has one for this
night, and already had 194 assertions behind it. A second implementation
of the same thing is a second thing to get wrong.

**The design, from all three apps.** Ernest asked for the poker ledger's
format, and for the choices the tracker and Hand recall made:

- **The shell is the ledger's** — a top header with scrolling tabs,
  `.section` headings ruled underneath, `.statcard` figures in 26px mono,
  the `.stat` grid with its small-caps serif labels, and the verdict as
  the single Garamond flash on the page rather than a pill.
- **The live table is the tracker's** — the `.prow` roster row with status
  as a 6px superscript on the name, three figure columns on a desktop
  collapsing to two lines on a phone, a cashed-out row folded to a single
  line so the live players stay on screen late in the game, the inline
  `.topup` rebuy field, the colour-coded timeline, and the share text in
  its monospace block.
- **Cards, list rows, chips and the bottom command bar are Hand
  recall's** — `.crd` at 34×46 in mono, `.lrow` at 56px with an accent
  border on hover, `.chipbtn`, and the fixed `.cmdbar` carrying the one
  action that matters during a session.

The statistics engine, the charts and the Phosphor icon set are the
ledger's own files, vendored rather than reimplemented.

### What changed in v0.3 — a way out

Ernest tried a real backup and stopped short: *"it may duplicate and i cant
delete it yet."* Nobody commits a year of data to an app they cannot clean
up in, so this build is the escape hatches rather than stage 2.

- **Remove a night**, with its ledger rows and its hands — a hand belongs
  to the night it was played in. The confirm counts exactly what goes.
- **Remove a hand.** The night and its counted money are untouched.
- **Remove a player**, or **merge two records for one person** — the thing
  that actually breaks per-opponent numbers. A merge moves every ledger
  row, session roster entry and hand seat, and keeps the dropped name as
  an alias so old files still match.
- **Edit a night** — date, venue, stakes, hours, buy-in, cash-out,
  expenses, rake, rating, notes. Clearing the money drops the settled
  stamp rather than lying about it.
- **Clear everything**, behind a typed confirmation.
- **All of it snapshots first**, so undo covers every one.

**Two real bugs this shook out:**

1. **Re-importing a tracker file duplicated every opponent's ledger row.**
   The ledger and Hand recall importers deduped; the tracker one appended.
   Importing the same night twice doubled the opponents' money and the
   night stopped reconciling to zero. A ledger row is now identified by
   (session, player) — one person has one result per night — and an
   existing row is corrected in place. Asserted by re-importing and
   checking the table still sums to zero.
2. **Clearing everything wiped its own undo pointer.** `clearAll` reset
   `meta` wholesale, which included the pointer to the snapshot it had
   just taken — leaving the single most destructive action as the only
   irreversible one.

**And the reassurance that was missing:** the preview now fingerprints the
file and says *"You imported this exact file on 15/08/2026 21:04 — nothing
new"*, with no Import button to press by mistake. Re-importing was always
harmless, but harmless is not something a reader can see, and the fear of
duplicating is what stops a file being imported at all.

### What changed in v0.2

v0.1 was a diagnostic screen, not an app. The hands were imported and
stored but there was nowhere to look at them, and the first screen carried
less than the ledger it is meant to replace. Both were mistakes in scoping,
not stage boundaries.

- **A Hands tab and a hand page.** Every hand, filterable by player, each
  one opening to its full street-by-street log in the canonical format from
  `poker-app-conventions.md`, four-colour deck, board and hole cards, every
  seat's line, your note, and a way through to the night and to each player.
- **A real dashboard.** Bankroll curve, win rate with its 95% interval and
  a stated verdict, the KPI block, rolling five-night form, breakdowns by
  venue and by stakes, recent nights.
- **The statistics engine and charts are the poker ledger's own**, vendored
  rather than reimplemented. The win-rate model — a random walk in *time*,
  so a nine-hour session carries nine times the variance of a one-hour one
  — is the part that has to be right, and it already was.
- **A ledger backup's settings are adopted** when yours are still untouched.
  Without the starting bankroll the bankroll figure is just a running total.
- **`settledNet` no longer subtracts rake.** The ledger treats rake as
  already inside the cash-out and keeps it only to compute a pre-rake rate;
  deducting it again double-counted every raked night. The two engines are
  now asserted to agree.

Full plan: `poker-hub-merge-spec.md` (v2.1) in the same folder.

**The app is `index.html`.** Single file, 317 KB, zero network requests,
works from `file://` with the wifi off.

---

## What this stage does

| | |
|---|---|
| **Import** | A home game tracker session JSON, a Hand recall export, or a poker ledger backup. It works out which, previews exactly what would change, and refuses to commit while a question is open. |
| **Store** | Sessions, players and the ledger in `localStorage` under the ledger's `pcg:` namespace; **hands and screenshots in IndexedDB**, which lifts the ceiling from ~5 MB to hundreds. |
| **Money** | Two layers, never summed. Counted money feeds every rate; hand-derived money is marked with a tilde and never touches one. |
| **Backup** | One JSON, dated and timed. Merge-import by `updatedAt`, so phone → computer → phone is safe in either direction. Replace is explicit and refused while a session is live. |
| **Undo** | One snapshot deep, taken before every destructive step, covering IndexedDB as well as localStorage. |
| **Read** | Dashboard with the bankroll curve, the confidence interval and its verdict, KPIs, rolling form and breakdowns. Nights, Hands and Players lists, each opening to a detail page. |
| **Edit and remove** | Remove a night, a hand or a player; merge two records for one person; edit a night; clear everything. Every one previewed, and every one undoable. |
| **Live** | Start a night, seat the table, rebuys, cash-outs, tagged reads, a pause, table mode, and a settle that files the night with hours it was never told. |

**Not yet:** the hand recorder and evaluator (stage 3), the dossier
statistics — VPIP, sizing tables, rebuy patterns (stage 4).

---

## Install it

Put `index.html`, `manifest.webmanifest` and `icons/` in a repo, publish
to GitHub Pages, open the page on your phone, **Share → Add to Home
Screen**. Every path is relative and `start_url`/`scope` are `"."`, which
is what makes it work on a project page rather than the domain root.

**Two things to know before you start putting data in.**

1. **Open it from the same URL on both devices.** A page opened from a
   Pages address and the same page opened as a downloaded file are
   different origins with separate storage. Your data would silently split
   in half.
2. **Add it to the home screen before the first import.** On iOS an
   installed web app gets its own storage container, separate from
   Safari's. Import into Safari and the installed copy starts empty.

---

## The two money layers

The rule the merge turns on, and the reason the tracker and Hand recall
can finally live in one file without corrupting each other:

| Layer | Source | Feeds |
|---|---|---|
| **Counted** | Buy-in and cash-out from the table | Session net, win rate, confidence interval, bankroll, every $/hr |
| **Estimated** | Eyeballed stacks and pots from a recorded hand | Hand analysis, per-opponent pot money, sizing buckets, showdown record |

Enforcement is not a naming convention. `Layers.rateInputs()` **throws**
on an estimated value rather than quietly returning a wrong win rate, and
`fmtEstimate()` is the only formatter for the estimated layer — it always
carries the tilde. The browser suite checks mechanically that every
estimated figure on screen starts with `~`.

**Drift** is the two side by side: counted +1,100 against a logged-hands
estimate of +210 is a drift of −890, and that is expected — you only log
the interesting hands. Drift only means something as a *run*: a consistent
direction over six or more nights says the stack estimates are
systematically off. `Layers.calibration()` refuses to call a 3/3 split a
finding.

---

## Identity

Matching is case- and space-insensitive, stored spelling wins. Three
explicit renames, applied at import and recorded as aliases so they stay
auditable and reversible:

| Raw | Canonical |
|---|---|
| `Pat` | Patrick |
| `James` | **James Hooi** |
| `James c` | **James Cheng** |

`Thomas`/`thomas` and `Una`/`una` merge on the match key alone, no rule
needed. `Ident.split()` undoes a wrong merge.

**The hero has no player record.** `players` means opponents — it is what
the Players tab lists and what a villain id points at. Your money lives on
the session.

---

## Layout

```
index.html              the app — build output, do not edit
manifest.webmanifest    beside it, relative paths
icons/                  carmine heart + scalpel E on the Prussian tile
build.mjs               inlines everything, then fails on any outbound URL
src/
  settle.js             settlement solver, recovered from the tracker
  stats.js              the ledger's statistics engine, vendored
  charts.js             the ledger's charts, vendored
  live.js               the live table
  layers.js             the two money layers, and the guard
  identity.js           one person, one id
  idb.js                IndexedDB, with an in-memory twin for node
  hero.js               the dossier on Ernest, from the hands he logged   (v1.0.0)
  coachexport.js        a hand out to the coach as edb-hand-record/1       (v1.0.0)
  store.js              the merged store
  importers.js          the three file importers
  backup.js             backup, merge-import, replace
  app.js  app.css  index.html   the shell
eds/                    edb-brand.css 2.0.0, pinned; fonts.css (base64 faces)
fixtures/
  hand-recall-engine.js vendored from Hand recall v1.11.1
  make.mjs              regenerates the fixtures with that real engine
test_settle.mjs  test_store.mjs  test_import.mjs  test_eval.mjs
test_live.mjs    test_record.mjs test_metrics.mjs test_profile.mjs
test_hero.mjs    test_browser.mjs
test.mjs                runs all ten
smoke.mjs               screenshots every screen, dark and light
raster-icons.mjs        the icon set from the SVGs
shots.mjs               screenshots, dark and light
```

### Build and test

```
node build.mjs        → index.html, and fails the build on any network call
node test.mjs         → 892 assertions
node fixtures/make.mjs  → regenerate fixtures (only after re-vendoring the engine)
```

---

## Verification — 1,912 assertions

**`test_eval.mjs` · 78.** The hand evaluator, checked against something
slower and dumber. The evaluator counts — one pass over ranks and suits,
no search over the 21 five-card subsets of seven. §3 runs **20,000 random
seven-card hands through an independent brute force** that enumerates all
21 subsets and scores each by a different method (sorted rank runs and
suit counts), then takes the maximum. Category and packed comparison value
agree every time, and the fuzz reaches all nine categories. 4,000
head-to-head comparisons order the same way. Also: the wheel is five-high
and loses to a six-high straight, three pairs is two pair, six of a suit
takes the top five, and the showdown **refuses to name a winner** while
any live seat's cards are unknown.

**`test_record.mjs` · 340.** The recorder. Every action run names who is
expected to act — a sequence of bare verbs silently plays a different hand
the moment the button moves, and the test still passes. Covers a hand
built from a live table (seats, ids, blinds from the stakes), everything
the setup refuses, a short stack and its side pot, undo taking the misdeal
before the betting, the evaluator wired to the seats, Ernest's override
and the record saying which it was, a hand where everyone folds, cards
that cannot be, and the finished record's ids and balance.

§8–§11 are v0.7: **the cast** (taking somebody out leaves the table the
same size, their blind in the pot, and every other position unmoved; the
outsider's fold is recorded and flagged, and never reaches the shared
text), **significance** (each of Ernest's three stated cases, plus the
big-blind-sees-a-flop edge his sentence does not settle, plus the money
staying honest while the label changes), **names** (a nameless seat stops
the deal and stops the save; a hand names itself while his own name beats
it), and **undo** (the exact two-tap sequence that used to file the next
action against the wrong seat).

§12 is v0.8: **the record, back into a hand.** `handRecord(toHand(record))`
reproducing the record field for field, against the recorder's own output
and against the Hand recall fixtures — plus the stronger invariant that
what the picture draws is exactly what the text says, which is the one
that catches a date or a currency drifting apart.

**`test_metrics.mjs` · 70.** The league table, over a three-night season
small enough that every figure is checkable by hand. Per-night and
per-hour, hours only over nights that actually had a clock, streaks,
rebuys read off the timeline through a renamed player's alias, the two
ends of the table, a roster entry with no counted night not displacing the
person who really is last, and — asserted mechanically — **an estimated
row reaching the table changes nothing**.

**`test_settle.mjs` · 144.** The settlement solver.

The tracker's original suites — `test_settlement.js` (107),
`test_browser.mjs` (99), `test_icons.mjs` (29) — **do not exist on the
machine**. Only the two built HTML files survived, and the folder is not a
git repo. The solver was running unproven, so this suite is a re-derivation
from the algorithm's stated contract rather than a transcription of
something nobody has.

The optimality check is the important one. The solver claims minimum
payments = n − c, and computes c with a bitmask DP over submasks. §7
checks the same c by **exhaustively enumerating every set partition** and
keeping those whose blocks all sum to zero — a different algorithm, so a
shared bug cannot hide in both. It then verifies on the actual output that
every connected component of the payment graph is zero-sum and that there
are exactly c of them, which is the lower-bound argument itself.

Also: money formatting and the U+2212 minus, the v2.0.1 date-precedence
rule (timeline beats a stale stamp), 13 named scenarios, a 4,000-table
reconciliation fuzz, the EXACT_MAX=16 boundary and its greedy fallback,
`normalise`'s shape gate, and the share text — including that it leaks no
opponent read.

**`test_store.mjs` · 191.** IndexedDB and its in-memory twin, the `pcg:`
namespace, the legacy `pcg:hands` migration (including that a failed write
leaves the original in place), undo across both stores, the backup nag,
ledger rows resolving off their session, both money layers, and identity
including both Jameses and the merge/split round trip.

**`test_import.mjs` · 228.** All three importers against fixtures
**generated by Hand recall's real engine**, not by a guess at its output.
The fixture night is deliberately awkward: the same evening arrives twice,
once as a tracker file with counted money and once as a Hand recall file
with three hands; the tracker file has no venue and the Hand recall file
does; the roster contains all four raw name spellings; and the estimate
does not agree with the counted result.

**§9, the night that arrives twice**, is the duplication fix: same date,
venue and money merging silently with the preview saying so; money that
disagrees asking, with what is already recorded shown in the options;
"keep both" actually keeping both; a different venue on one date staying
two nights; a night with money merging into one without, unasked; counted
rows left alone on a merge; and the same hand under two ids stored once.

Covers: the two files landing on **one** night rather than two, dedupe on
both id and content, no foreign player id surviving the import, the hero
question refusing to commit until answered, an unfinished night logged and
excluded from the rates, orphan rows flagged rather than dropped, undo over
an import, and the full phone → computer → phone round trip including a
stale file that must not clobber newer work.

**`test_browser.mjs` · 382.** The built file at 390×844 in headless
Chromium: real localStorage, real IndexedDB, real file inputs. Zero network
requests from `file://`, including a copy alone in an empty folder. The
import flow end to end. Every estimated figure on screen carrying its
tilde, on the session page *and* the hand page. The Hands tab, a hand page
with its canonical log and coloured suits, the player filter and back out
of it. Theme persistence, the About block, settings round-tripping. No
horizontal overflow, no touch target under 44px, no gradient, glow or
coloured rail, no ASCII hyphen used as a minus. Over http: every link
resolves, `start_url` and `scope` are relative, a dedicated maskable icon
exists and its glyph sits inside Android's 80% safe zone.

**§6b, the dashboard**, runs against a fourteen-night fixture, because
below two counted nights there is no confidence interval, no bankroll
curve, no rolling form and no breakdown — every one of those paths would
otherwise ship unrun. It asserts each chart actually paints, carries an
aria-label, fits the screen, and that **the verdict on screen is the
engine's own rather than a second opinion**.

**`test_live.mjs` · 134.** The session around the solver: the clock and
the pause (a break is not poker), the roster and everything it refuses —
a duplicate name, a zero buy-in, a player called "Dealer", a top-up from
someone who has already left, **and one person trying to take two seats
under two spellings** — reads and their categories, settling
refusing a table that does not balance or still has people seated, the
dealer owed exactly the tip and never paying, a night he ran but did not
play in, and filing the same night twice without doubling a row.

**§8, a seat is a person**, covers the id that now rides on every seat: a
spelling nothing would match filing onto the right record anyway, the
typed spelling kept as an alias so it matches next time, the stored
spelling winning on screen, and a live night saved before ids existed
still falling back to the name rules.

**§6d, a live night**, drives the whole thing in the browser end to end:
start, seat four, refuse a duplicate, rebuy inline (on Enter, then undone),
refuse to settle while people are seated, refuse a table that does not
reconcile *and say which way*, correct it, undo, table mode, and file —
then check the night landed with its hours, its read, `Pat` resolved to
Patrick, and every net summing to zero in the ledger. It then files a
second night eight days back so somebody has played more than somebody
else, and drives the identity step against it: the suggestion row ranked
by nights together, narrowing on a keystroke; `pat` resolving to Patrick
with his record shown; a name matching nobody changing the button to *Add
as a new person*; Enter moving to the buy-in and then taking the form; and
the same person refused a second seat.

**§6c, a way out**, drives the whole clean-up path in the browser: the same
file offered twice and refused a button, an edit landing and a malformed
date being rejected, a merge and its undo, a hand removed without touching
the money, a night removed with everything in it, and clearing everything
behind the typed confirm — each followed by an undo that puts it all back.

---

## Four things the build found

0. **An unknown icon name renders nothing, silently.** `icon()` returns an
   empty `<svg>` for a name the vendored Phosphor subset does not carry —
   no error, no console warning. Two buttons had been shipping blank since
   v0.4. `build.mjs` now fails on it.
1. **EDS 1.7.2's `.btn` (33px) and `.segmented button` (22px) fall under
   the 44px touch floor** that BRAND.md calls non-negotiable. Overridden
   here for coarse pointers only. Worth fixing upstream rather than in
   every app.
2. **The EDS toast sits at `bottom:24px`**, which on a phone lands squarely
   on a bottom nav — a four-second window after every action where the tabs
   stop working. Raised above the nav and given `pointer-events:none`.
3. **`.up`/`.down` must use the `-text` colour variants.** `--success`
   `#10b981` is under 4.5:1 on the light background; `--success-text`
   resolves correctly in both themes.

---

## What is not built yet

Accurate as of v0.10.0, 29/09/2026. The recorder, the cast, the pictures,
the two money layers, every importer, the coaching archive and the dossier
are in. These are not:

1. **Writing `edb-hand-record/1` back out.** Hands come in from the coach;
   a hand recorded here cannot yet go out in the coach's own schema. The
   dossier export covers the reads, not the hands.
2. **A leak view.** The tag vocabulary is real and counted —
   `missed-turn-value` 6, `missed-river-value` 5, `OOP-3bet-call` 3 across
   32 played hands — with no screen that rolls any of it up.

**Deliberately not being built** (his call, 10/09/2026): on-device
chart lookups and off-chart flagging. *"Technically I don't need to know
whether something was off chart — I just need to update player tendencies
and labelling."* That drops embedding `Preflop_Ranges_v2.xlsx` and every
deviation classifier with it.

## Standing limits

Single device, moved by file — that is the choice, not an oversight.
**Undo is one snapshot deep**: it covers the last destructive step and
nothing before it, so a mistake noticed two steps later needs the backup
file instead. The settlement solver is capped at 16 parties for exact
optimality and says so above that. iOS home-screen install is untested on
a real device — no phone in the sandbox, so the manifest and icon geometry
are verified by test rather than by eye.

**HK$39,246 of his ledger does not reconcile** — his opponents' recorded
nets sum to −53,400 against his own +14,154. That is not a bug in the app;
it is what the old freeform imports captured, which was some players'
results and not others'. The Players tab reports the gap rather than
absorbing it.

**Undo does not un-create a person.** Undoing an add-player takes the seat
off the table, but the record that seating them created stays — harmless,
and removable from the Players tab, but it is there.

*Poker Hub 1.0.0 · EDB design system 2.0.0 · © Ernest Tung*
