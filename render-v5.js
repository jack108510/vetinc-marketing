const { chromium } = require('playwright');
const fs = require('fs');

const aiB64 = fs.readFileSync('/Users/jackserver/.openclaw/media/tool-image-generation/image-1---9df956ba-820f-4e3b-9300-3123c64e9e5c.png').toString('base64');
const dashB64 = fs.readFileSync('/Users/jackserver/.openclaw/workspace/vetinc-marketing/dashboard-full.png').toString('base64');
const phoneB64 = fs.readFileSync('/Users/jackserver/.openclaw/workspace/vetinc-marketing/dashboard-preview.png').toString('base64');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1248, height: 832 } });
  
  // Make the element SMALLER than the actual screen area (inset by ~8px from bezel)
  // and the clip-path polygon slightly inside even that
  // 
  // MacBook screen visible area (inset 8px from bezel):
  // Element box: left:196, top:220, width:520, height:395
  // Clip polygon relative to box (inset 5px from edges):
  // TL:(5,5) TR:(515,20) BR:(520,390) BL:(10,375)
  // In %: TL:(1%,1.3%) TR:(99%,5.1%) BR:(100%,98.7%) BL:(1.9%,94.9%)
  
  // iPhone (inset 3px):
  // Element box: left:743, top:368, width:84, height:269
  // Clip: TL:(4,4) TR:(80,1) BR:(78,265) BL:(1,268)
  // In %: TL:(4.8%,1.5%) TR:(95.2%,0.4%) BR:(92.9%,98.5%) BL:(1.2%,99.6%)
  
  const html = `<!DOCTYPE html>
<html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1248px;height:832px;overflow:hidden;position:relative}
.bg{position:absolute;top:0;left:0;width:1248px;height:832px;
  background:url('data:image/jpeg;base64,${aiB64}') no-repeat;
  background-size:1248px 832px}

/* MacBook - inset inside bezel */
.mb{position:absolute;left:196px;top:220px;width:520px;height:395px;
  clip-path:polygon(1% 1.3%,99% 5.1%,100% 98.7%,1.9% 94.9%);
  overflow:hidden}
.mb img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}

/* iPhone - inset inside frame */
.ip{position:absolute;left:743px;top:368px;width:84px;height:269px;
  clip-path:polygon(4.8% 1.5%,95.2% 0.4%,92.9% 98.5%,1.2% 99.6%);
  overflow:hidden}
.ip img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}

/* Subtle screen glow on MacBook */
.mb-glow{position:absolute;left:190px;top:215px;width:535px;height:410px;
  clip-path:polygon(0% 0%,100% 3.7%,100% 100%,4.7% 94%);
  background:linear-gradient(135deg,rgba(255,255,255,0.04),rgba(0,0,0,0.02));
  pointer-events:none;z-index:10}
</style></head><body>
<div class="bg"></div>
<div class="mb"><img src="data:image/png;base64,${dashB64}"/></div>
<div class="mb-glow"></div>
<div class="ip"><img src="data:image/png;base64,${phoneB64}"/></div>
</body></html>`;
  
  await page.setContent(html);
  await page.waitForTimeout(3000);
  
  await page.screenshot({ 
    path: '/Users/jackserver/.openclaw/workspace/vetinc-marketing/device-final-v5.png',
    omitBackground: false
  });
  
  await browser.close();
  console.log('DONE');
})();
