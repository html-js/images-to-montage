# Contributing

Thanks for helping improve Images to Montage.

The whole tool is one file, `index.html`. Styles and script live inline,
and there is nothing to install or build. To try a change, open the file in
a browser, or run `make serve` and visit the local address it prints. The
served copy also accepts `?src=` links, so the sample pictures in
`docs/samples/` load with a single address.

The most useful reports describe a montage that came out wrong. Say which
layout you had selected, whether "Size from images" was on, how the pictures
were added, and what you expected to see. Please never attach private
pictures to an issue. The sample pictures, or plain test images you are
happy to publish, show most problems just as well. Captions can print file
names into the result, so check those too before sharing a screenshot.

When changing the page, keep it a single dependency-free file and keep
pictures on the device: the page should only ever fetch an address that the
person typed or opened. Wording in the interface and the docs stays generic,
so please describe tools and platforms by what they do instead of by product
name. Keep code, comments and documentation in English.

If your change affects how the page looks, regenerate the README images with
`make shots`. The figure sources sit in `docs/figures/`, and `make figures`
rebuilds their images afterwards (one figure embeds the example export that
`make shots` writes).

Please follow the [Code of Conduct](./CODE_OF_CONDUCT.md) in all project
spaces.
