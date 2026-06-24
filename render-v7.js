const { chromium } = require('playwright');
const fs = require('fs');

const aiB64 = fs.readFileSync('/Users/jackserver/.openclaw/media/tool-image-generation/image-1---9df956ba-820f-4e3b-9300-3123c64e9e5c.png').toString('base64');
const dashB64 = fs.readFileSync('/Users/jackserver/.openclaw/workspace/vetinc-marketing/dashboard-full.png').toString('base64');
const phoneB64 = fs.readFileSync('/Users/jackserver/.openclaw/workspace/vetinc-marketing/dashboard-preview.png').toString('base64');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1248, height: 832 } });
  
  // MacBook screen: x:200, y:200, w:515, h:415 (inset 3px -> 203,203,509,409)
  // iPhone screen: approximately x:743, y:370, w:82, h:270 (inset 2px)
  // 
  // Using clip-path polygons to match slight perspective
  // MacBook corners: TL:(203,203) TR:(712,207) BR:(710,612) BL:(205,609)
  // iPhone corners: TL:(745,372) TR:(823,370) BR:(821,638) BL:(743,640)
  
  const html = `<!DOCTYPE html>
<html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1248px;height:832px;overflow:hidden;position:relative}
.bg{position:absolute;top:0;left:0;width:1248px;height:832px;
  background:url('data:image/jpeg;base64,${aiB64}') no-repeat;
  background-size:1248px 832px}

/* MacBook screen overlay */
.mb{position:absolute;left:203px;top:203px;width:509px;height:409px;
  clip-path:polygon(
    0% 0%,      /* TL: 203,203 */
    99.6% 1%,   /* TR: 712,207 (offset from element: 509,4 = 99.8%,1%) */
    99.4% 99.5%,/* BR: 710,610 (507,407 = 99.6%,99.5%) */
    0.4% 98.5%  /* BL: 205,606 (2,403 = 0.4%,98.5%) */
  );
  overflow:hidden}
.mb img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}

/* iPhone screen overlay */
.ip{position:absolute;left:745px;top:372px;width:78px;height:266px;
  clip-path:polygon(
    0% 0.8%,    /* TL */
    98.7% 0%,   /* TR */
    97.4% 99.2%,/* BR */
    0% 100%     /* BL */
  );
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
    path: '/Users/jackserver/.openclaw/workspace/vetinc-marketing/device-final-v7.png'
  });
  
  await browser.close();
  console.log('DONE');
})();
