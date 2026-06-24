const { chromium } = require('playwright');
const fs = require('fs');

const aiB64 = fs.readFileSync('/Users/jackserver/.openclaw/media/tool-image-generation/image-1---9df956ba-820f-4e3b-9300-3123c64e9e5c.png').toString('base64');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1248, height: 832 } });
  
  // Place solid color blocks where I think the screen is
  // Red block = my best guess at screen area
  const html = `<!DOCTYPE html>
<html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1248px;height:832px;overflow:hidden;position:relative}
.bg{position:absolute;top:0;left:0;width:1248px;height:832px;
  background:url('data:image/jpeg;base64,${aiB64}') no-repeat;
  background-size:1248px 832px}
.test-red{position:absolute;left:208px;top:228px;width:489px;height:357px;
  background:rgba(255,0,0,0.5);border:2px solid red}
.test-green{position:absolute;left:180px;top:195px;width:560px;height:440px;
  background:rgba(0,255,0,0.2);border:2px solid lime}
.test-blue{position:absolute;left:155px;top:170px;width:600px;height:480px;
  background:rgba(0,100,255,0.15);border:2px solid blue}
</style></head><body>
<div class="bg"></div>
<div class="test-blue"></div>
<div class="test-green"></div>
<div class="test-red"></div>
</body></html>`;
  
  await page.setContent(html);
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'screen-bounds-test.png' });
  
  await browser.close();
  console.log('DONE');
})();
