const { chromium } = require('playwright');
const fs = require('fs');

const aiB64 = fs.readFileSync('/Users/jackserver/.openclaw/media/tool-image-generation/image-1---9df956ba-820f-4e3b-9300-3123c64e9e5c.png').toString('base64');
const dashB64 = fs.readFileSync('/Users/jackserver/.openclaw/workspace/vetinc-marketing/dashboard-full.png').toString('base64');
const phoneB64 = fs.readFileSync('/Users/jackserver/.openclaw/workspace/vetinc-marketing/dashboard-preview.png').toString('base64');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1248, height: 832 } });
  
  // I'm going to make the overlay SMALLER than the screen and position it conservatively.
  // Better to have it slightly too small (small bezel gap) than overflowing.
  
  // Conservative MacBook screen area (inset 15px from estimated bezel):
  // Screen area roughly: x: 205-700, y: 225-590
  // Element: left:205, top:225, width:495, height:365
  // Clip-path: simple polygon matching the slight perspective
  // TL:(0,0) TR:(495,10) BR:(495,365) BL:(0,355)
  // In %: 0% 0%, 100% 2.7%, 100% 100%, 0% 97.3%
  
  const html = `<!DOCTYPE html>
<html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1248px;height:832px;overflow:hidden;position:relative}
.bg{position:absolute;top:0;left:0;width:1248px;height:832px;
  background:url('data:image/jpeg;base64,${aiB64}') no-repeat;
  background-size:1248px 832px}

.mb{position:absolute;left:208px;top:228px;width:489px;height:357px;
  clip-path:polygon(0% 0%,100% 2.8%,99% 99.5%,1% 96.5%);
  overflow:hidden}
.mb img{width:100%;height:100%;object-fit:cover;object-position:top left;display:block}

.ip{position:absolute;left:746px;top:372px;width:78px;height:263px;
  clip-path:polygon(5% 2%,95% 0%,93% 98%,2% 100%);
  overflow:hidden}
.ip img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
</style></head><body>
<div class="bg"></div>
<div class="mb"><img src="data:image/png;base64,${dashB64}"/></div>
<div class="ip"><img src="data:image/png;base64,${phoneB64}"/></div>
</body></html>`;
  
  await page.setContent(html);
  await page.waitForTimeout(3000);
  
  await page.screenshot({ 
    path: '/Users/jackserver/.openclaw/workspace/vetinc-marketing/device-final-v6.png'
  });
  
  await browser.close();
  console.log('DONE');
})();
