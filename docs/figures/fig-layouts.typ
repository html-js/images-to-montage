// Five ways the page lays the same pictures down.
#import "_notebook.typ": *
#set page(width: W, height: H, margin: 0mm, fill: paper)
#set text(font: "Nimbus Mono PS", size: 7.2pt, fill: type-c)
#ruled()

// the photograph: a small contact sheet of eight pictures
#let pal = (
  ("#2b3a67", "#f3a683", "#262a40"), ("#9cc3d5", "#e8f1f2", "#1f3b2d"),
  ("#c9d6df", "#f7f3ea", "#8c7f70"), ("#05070f", "#1b2a4a", "#0a0f1c"),
  ("#f5b971", "#fde2c0", "#6e2b19"), ("#aab4bd", "#dfe3e6", "#4d5860"),
  ("#4f9bd9", "#cfe8f7", "#b78445"), ("#2e4a6e", "#a9c7e3", "#506d8c"),
)
#let PW = 62mm
#let PH = 42mm
#let tw = (PW - 4.8mm - 3.2mm - 3 * 1.2mm) / 4
#let th = (PH - 9mm - 3.2mm - 1.2mm) / 2
#photo(22mm, 12mm, PW, PH, -3deg, [eight pictures, one file.])[
  #for (i, p) in pal.enumerate() {
    let c = calc.rem(i, 4)
    let r = calc.quo(i, 4)
    place(dx: 1.6mm + c * (tw + 1.2mm), dy: 1.6mm + r * (th + 1.2mm),
      box(width: tw, height: th, clip: true, fill: gradient.linear(
        (rgb(p.at(0)), 0%), (rgb(p.at(1)), 62%), (rgb(p.at(2)), 63%), (rgb(p.at(2)), 100%), angle: 90deg))[
        #place(dx: tw * (0.25 + 0.5 * rnd(i)), dy: th * 0.22,
          circle(radius: 1.1mm, fill: white.transparentize(30%), stroke: none))
      ])
  }
]

#entry(94mm, 13mm, 80mm, [MONTAGE LOG — sheet 1, 23:04])[
  Eight pictures came in: two dropped, three pasted, one folder for the rest. \
  The page measured each one and painted them all on a single canvas. \
  The browser wrote it out as one file. Nothing was uploaded; there is no server on the other end.
]

// five sketched layouts
#let SY = 58mm
#let PWD = 28mm
#let mini(x, y, rects) = for (dx, dy, w, h) in rects {
  at(x + dx * 1mm, y + dy * 1mm, rect(width: w * 1mm, height: h * 1mm,
    stroke: 0.45pt + ink, fill: ink.transparentize(88%)))
}
#let panel(i, title, rects) = {
  let x = 22mm + i * (PWD + 4mm)
  boxed(x, SY, PWD, 26mm, title, [])
  mini(x + 2mm, SY + 9.5mm, rects)
}
#panel(0, "grid", range(6).map(k => (calc.rem(k, 3) * 8.33, calc.quo(k, 3) * 7.5, 7.33, 6.5)))
#panel(1, "justified", ((0, 0, 9, 6.5), (10, 0, 6, 6.5), (17, 0, 7, 6.5), (0, 7.5, 12, 6.5), (13, 7.5, 11, 6.5)))
#panel(2, "masonry", ((0, 0, 7.33, 5), (0, 6, 7.33, 8), (8.33, 0, 7.33, 9), (8.33, 10, 7.33, 4),
                     (16.66, 0, 7.33, 4), (16.66, 5, 7.33, 5)))
#panel(3, "single row", ((0, 3.5, 4.5, 7), (5.5, 3.5, 3, 7), (9.5, 3.5, 4, 7), (14.5, 3.5, 6.5, 7), (22, 3.5, 2, 7)))
#panel(4, "single col.", ((7, 0, 10, 3.5), (7, 4.25, 10, 5), (7, 10, 10, 4)))

#figcaption[fig. — five ways to lay the same pictures down]
