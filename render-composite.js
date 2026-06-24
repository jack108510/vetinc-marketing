const { chromium } = require('playwright');
const fs = require('fs');

const aiB64 = fs.readFileSync('/Users/jackserver/.openclaw/media/tool-image-generation/image-1---9df956ba-820f-4e3b-9300-3123c64e9e5c.png').toString('base64');
const dashB64 = fs.readFileSync('dashboard-full.png').toString('base64');
const phoneB64 = fs.readFileSync('dashboard-preview.png').toString('base64');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1248, height: 832 } });
  
  const html = `
  <!DOCTYPE html>
  <html><head><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1248px; height:832px; overflow:hidden; position:relative; }
  
  .bg {
    position:absolute; top:0; left:0;
    width:1248px; height:832px;
    background: url('data:image/jpeg;base64,${aiB64}') no-repeat;
    background-size: 1248px 832px;
  }
  
  /* MacBook screen area - LCD display */
  .mb {
    position:absolute;
    /* Use the bounding box of the trapezoid */
    left: 188px; top: 207px;
    width: 542px;  /* 730-188 */
    height: 405px; /* 612-207 */
    overflow: hidden;
    clip-path: polygon(
      0px 0px,           /* TL */
      526px 0px,         /* TR (714-188) */
      542px 405px,       /* BR (730-188, 612-207) */
      2px 393px          /* BL (190-188, 600-207) */
    );
  }
  .mb img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: top;
    display:block;
  }
  
  /* iPhone screen area */
  .ip {
    position:absolute;
    left: 741px; top: 361px;
    width: 94px; height: 289px;
    overflow: hidden;
    clip-path: polygon(
      0px 0px,
      94px 4px,
      88px 284px,
      -2px 278px
    );
  }
  .ip img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: top;
    display:block;
  }
  </style></head>
  <body>
    <div class="bg"></div>
    <div class="mb"><img src="data:image/png;base64,${dashB64}"/></div>
    <div class="ip"><img src="data:image/png;base64,${phoneB64}"/></div>
  </body></html>`;
  
  await page.setContent(html);
  await page.waitForTimeout(3000);
  
  await page.screenshot({ 
    path: 'device-composited.png',
    omitBackground: false,
    clip: { x: 0, y: 0, width: 1248, height: 832 }
  });
  
  await browser.close();
  console.log('DONE');
})();
