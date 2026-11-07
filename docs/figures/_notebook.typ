// Shared look for the README figures: a ruled notebook page with a taped
// photograph, a typed log entry and ink sketches (after fig-loop design 23).
#let W = 184mm
#let H = 96mm
#let paper  = rgb("#e7e4dc")
#let type-c = rgb("#2b2d31")
#let ink    = rgb("#2c4a6e")
#let faded  = rgb("#7d7a73")
#let sk     = 0.7pt + ink

#let at(x, y, body) = place(top + left, dx: x, dy: y, body)
#let rnd(i) = calc.fract(calc.sin(i * 12.9898) * 43758.5453)

// ruled lines and the red margin
#let ruled() = {
  for i in range(15) {
    at(0mm, 18mm + i * 5.4mm, line(length: W, stroke: 0.25pt + rgb("#9fb3c8").transparentize(55%)))
  }
  at(14mm, 0mm, line(angle: 90deg, length: H, stroke: 0.35pt + rgb("#c98a8a").transparentize(40%)))
}

// a photograph with a white border, a soft shadow, two strips of tape and a
// handwritten-style caption
#let photo(x, y, w, h, angle, caption, content) = {
  at(x + 0.8mm, y + 1.2mm, rotate(angle, rect(width: w, height: h, fill: rgb(0, 0, 0, 30), stroke: none)))
  at(x, y, rotate(angle, box(width: w, height: h, fill: rgb("#f3f1ea"), inset: 2.4mm, clip: true)[
    #box(width: w - 4.8mm, height: h - 9mm, clip: true, fill: rgb("#14171c"), content)
    #v(0.4mm)
    #align(center, text(font: "C059", size: 5.6pt, style: "italic", fill: faded, caption))
  ]))
  for (tx, ty, a) in ((x - 3mm, y - 1mm, -38deg), (x + w - 8mm, y - 3.4mm, 28deg)) {
    at(tx, ty, rotate(a, rect(width: 13mm, height: 4mm, fill: rgb("#e9dfb8").transparentize(25%), stroke: none)))
  }
}

// a typed entry
#let entry(x, y, w, head, body) = at(x, y, block(width: w)[
  #set par(leading: 1.05em)
  #text(weight: "bold", head) \
  #body
])

// a sketched box drawn twice, slightly offset, like a pen going round again
#let boxed(x, y, w, h, title, body, dashed: false) = {
  let st = if dashed { (paint: ink, thickness: 0.7pt, dash: "dashed") } else { sk }
  at(x, y, rect(width: w, height: h, stroke: st, radius: 0.6mm))
  at(x + 0.5mm, y - 0.4mm, rect(width: w, height: h, stroke: 0.3pt + ink.transparentize(50%), radius: 0.6mm))
  at(x + 2mm, y + 2mm, block(width: w - 4mm)[
    #set par(leading: 0.6em)
    #text(fill: ink, weight: "bold", title) \
    #text(size: 6pt, fill: ink.transparentize(15%), body)
  ])
}

// a horizontal arrow from x1 to x2 at height y; dir 1 points right
#let head(x, y, dir, st: sk) = for s in (1, -1) {
  at(0mm, 0mm, line(start: (x, y), end: (x - dir * 1.8mm, y + s * 1.1mm), stroke: st))
}
#let arrow(x1, x2, y, st: sk) = {
  at(0mm, 0mm, line(start: (x1, y), end: (x2, y), stroke: st))
  head(x2, y, if x2 > x1 { 1 } else { -1 }, st: sk)
}

#let figcaption(body) = at(22mm, 88mm,
  text(font: "C059", size: 6.4pt, style: "italic", fill: faded, body))
