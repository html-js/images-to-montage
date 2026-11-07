// Where pictures come from, and what the page can hand back.
#import "_notebook.typ": *
#set page(width: W, height: H, margin: 0mm, fill: paper)
#set text(font: "Nimbus Mono PS", size: 7.2pt, fill: type-c)
#ruled()

// the photograph: the real example export from docs/
#let PW = 62mm
#let ratio = 720 / 2000   // docs/example-montage.jpg is 2000 × 720 (see shot.js)
#photo(22mm, 12mm, PW, (PW - 4.8mm) * ratio + 9mm, -3deg, [one file. nothing left the desk.])[
  #image("../example-montage.jpg", width: PW - 4.8mm)
]

#entry(94mm, 13mm, 80mm, [EXPORT LOG — sheet 2])[
  The montage is painted on one canvas inside this tab. Download and copy hand that canvas to the browser, which saves it. \
  A picture read from a local path, or from a site that does not share its images, still shows in the preview. \
  The browser will not let the page export it. Drop that file in instead.
]

#let SY = 52mm
#boxed(22mm, SY, 44mm, 8.5mm, "your files", [dropped, pasted or chosen])
#boxed(22mm, SY + 11mm, 44mm, 8.5mm, "shared links", [same-site paths, open URLs])
#boxed(22mm, SY + 22mm, 44mm, 8.5mm, "closed sources", [local paths, closed URLs], dashed: true)
#boxed(86mm, SY, 40mm, 30.5mm, "one canvas", [layout, gaps, captions \ scale, clamped near \ 16384 px a side])
#boxed(144mm, SY + 2mm, 34mm, 11mm, "download", [png, jpeg or webp])
#boxed(144mm, SY + 17.5mm, 34mm, 11mm, "copy", [png on the clipboard])

#let dash = (paint: ink, thickness: 0.7pt, dash: "dashed")
#arrow(67.5mm, 84.5mm, SY + 4.25mm)
#arrow(67.5mm, 84.5mm, SY + 15.25mm)
#arrow(67.5mm, 84.5mm, SY + 26.25mm, st: dash)
#at(69mm, SY + 27.2mm, text(size: 5.2pt, fill: ink)[preview only])
#arrow(127.5mm, 142.5mm, SY + 7.5mm)
#arrow(127.5mm, 142.5mm, SY + 23mm)
#at(88mm, SY + 32mm, text(size: 5.2pt, fill: ink)[one closed source blocks every export])

#figcaption[fig. — what goes in, and what the page can hand back]
