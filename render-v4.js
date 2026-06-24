const { chromium } = require('playwright');
const fs = require('fs');

const aiB64 = fs.readFileSync('/Users/jackserver/.openclaw/media/tool-image-generation/image-1---9df956ba-820f-4e3b-9300-3123c64e9e5c.png').toString('base64');
const dashB64 = fs.readFileSync('/Users/jackserver/.openclaw/workspace/vetinc-marketing/dashboard-full.png').toString('base64');
const phoneB64 = fs.readFileSync('/Users/jackserver/.openclaw/workspace/vetinc-marketing/dashboard-preview.png').toString('base64');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1248, height: 832 } });
  
  // The approach: place the dashboard image as an absolutely positioned element
  // Use clip-path with the EXACT polygon of the screen area
  // The image is sized to cover the bounding box of the screen
  
  // Screen bounding box: roughly x:190-725, y:215-625
  // So position the image at left:190, top:215, width:535, height:410
  // Then clip-path polygon is relative to the element's box
  
  // MacBook screen polygon (absolute coords):
  // TL:(190,215) TR:(715,230) BR:(725,625) BL:(215,600)
  // Relative to element at (190,215) with size 535x410:
  // TL:(0,0) TR:(525,15) BR:(535,410) BL:(25,385)
  
  // iPhone screen polygon (absolute):
  // TL:(745,370) TR:(830,365) BR:(825,635) BL:(740,640)
  // Element at (740,365), size 90x275:
  // TL:(5,5) TR:(90,0) BR:(85,270) BL:(0,275)
  
  const html = `<!DOCTYPE html>
<html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1248px;height:832px;overflow:hidden;position:relative;background:transparent}
.bg{position:absolute;top:0;left:0;width:1248px;height:832px;background:url('data:image/jpeg;base64,${aiB64}') no-repeat;background-size:1248px 832px}
.mb{position:absolute;left:190px;top:215px;width:535px;height:410px;clip-path:polygon(0% 0%,98.1% 3.7%,100% 100%,4.7% 94%);overflow:hidden}
.mb img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.ip{position:absolute;left:740px;top:365px;width:90px;height:275px;clip-path:polygon(5.6% 1.8%,100% 0%,94.4% 98.2%,0% 100%);overflow:hidden}
.ip img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
</style></head><body>
<div class="bg"></div>
<div class="mb"><img src="data:image/png;base64,${dashB64}"/></div>
<div class="ip"><img src="data:image/png;base64,${phoneB64}"/></div>
</body></html>`;
  
  await page.setContent(html);
  await page.waitForTimeout(3000);
  
  await page.screenshot({ 
    path: '/Users/jackserver/.openclaw/workspace/vetinc-marketing/device-final-v4.png',
    omitBackground: false
  });
  
  await browser.close();
  console.log('DONE');
})();
