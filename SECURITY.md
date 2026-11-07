# Security policy

Images to Montage is a static page with no server side. Pictures you drop,
paste or choose are read into the browser's memory and never sent anywhere.
The page only makes a network request when you give it an address yourself,
either by typing a path or URL into the list or by opening a link that
carries `?src=` parameters. When "Persist settings" is on, your layout and
output settings are kept in the browser's local storage; pictures and file
names are not stored.

If you find a way for the page to leak a picture, run injected content, or
send anything off the device that you did not ask for, please report it
privately through the repository's private vulnerability reporting under
the Security tab. You can also reach the maintainer through the contact
options on <https://github.com/didvc/>. Please avoid filing a public issue
for anything exploitable, and do not attach private pictures to any report.

Only the latest version on the default branch receives fixes.
