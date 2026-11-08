# CSS split verification

Chromium 158, macOS arm64, 2026-11-08. Compared the built showcase before and after moving the CSS, with Funder, Investor and Portare at 1280×900 and 375×900, menu closed and open. All 12 PNG pairs were byte-identical (SHA-256 below); no browser page errors. Images are retained locally under `artifacts/css-split/{before,after}`. The stylesheet expansion regression test also pins declaration order and values. The built showcase CSS asset hash remained unchanged.

These are showcase checks, not visual verification in Funder, Portare or Investor consumer apps. Portare is still proposed. The baseline includes the showcase fix that places the selected theme after Vite's generated base stylesheet.

| Screenshot | Before and after SHA-256 |
| --- | --- |
| funder-1280-closed.png | `5fd80a840e7aeca8059462313d76f2b646d6fdf75a25ead9a7373bc361ddddd0` |
| funder-1280-open.png | `8a5439e0118cb6aa92c92a6b4dd5e33ef3f70f0ef0cd003cb4e75fea95f84f5f` |
| funder-375-closed.png | `8d167cff8202e629606aa98d31ebbddffd4536e4a97ab694b720fc6e1421513a` |
| funder-375-open.png | `6bc724fbb18d28a1ab7881cce65f3766c29a64265d3deb3edcacd7429522b655` |
| investor-1280-closed.png | `4edc9d4c1f95b7dacd60fcb8ba701535550c543eee34177fab6275d5a04cd6e4` |
| investor-1280-open.png | `766ac49cd3346e2845c3aece285622f50309e66ed97ad6b931e244a0f3dcd165` |
| investor-375-closed.png | `a60977a3052efc657410efcf956452c616fca3c46bec7425d50ee0fc37f6ea8f` |
| investor-375-open.png | `83b39a06baf7c72234392cf652583799db24db0cc827683fbdf6a1f09dcb1313` |
| portare-1280-closed.png | `e110370adc033832f0aa11255231a621c321a0e52773d3bb1ae0916ba44a00fd` |
| portare-1280-open.png | `0d4905aa4175fc7af32abe7187c49694d94bc6979353ce5d14b2001717c07290` |
| portare-375-closed.png | `8f408b7d78700d38707b38e8f683396a56d0f16d9075b6512887d7a0874200eb` |
| portare-375-open.png | `3907e47e3448de09546e0c756cd023225d8da7be1f643fb2eb89545874edf4cb` |
