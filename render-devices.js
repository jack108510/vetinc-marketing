const { chromium } = require('playwright');
const fs = require('fs');

const dashB64 = fs.readFileSync('dashboard-full.png').toString('base64');
const phoneB64 = fs.readFileSync('dashboard-preview.png').toString('base64');
const dashUri = `data:image/png;base64,${dashB64}`;
const phoneUri = `data:image/png;base64,${phoneB64}`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  
  const html = `
  <!DOCTYPE html>
  <html><head><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:transparent; display:flex; align-items:center; justify-content:center; padding:40px; }
  .scene { display:flex; align-items:flex-end; justify-content:center; position:relative; }
  
  .macbook { width:740px; position:relative; z-index:2; filter:drop-shadow(0 20px 40px rgba(0,0,0,0.08)); }
  
  /* Screen */
  .lid {
    background: linear-gradient(180deg, #2d2d2f, #1a1a1c);
    border-radius: 14px 14px 1px 1px;
    padding: 10px 10px 6px;
    position: relative;
    border: 1px solid #404042;
  }
  .lid::after {
    content:''; position:absolute; top:3px; left:50%; transform:translateX(-50%);
    width:4px; height:4px; border-radius:50%; background:#000;
  }
  .screen {
    background:#000; border-radius:3px; overflow:hidden;
    aspect-ratio:16/10;
  }
  .screen img { width:100%; height:100%; object-fit:cover; object-position:top; display:block; }
  
  /* The deck - flat, seen from front, slightly trapezoidal */
  .deck-container {
    position: relative;
    margin-top: 0;
  }
  
  /* Hinge line */
  .hinge {
    height: 3px;
    background: linear-gradient(90deg, #555, #666 20%, #777 50%, #666 80%, #555);
    margin: 0 8px;
    border-radius: 1px;
  }
  
  /* Keyboard deck surface - the aluminum flat part */
  .deck {
    background: linear-gradient(180deg, #ccc 0%, #c0c0c0 15%, #b4b4b4 50%, #a8a8a8 85%, #9c9c9c 100%);
    height: 50px;
    margin: 0 -6px;
    position: relative;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.03);
  }
  
  /* Keyboard keys suggestion - subtle dark area */
  .keys {
    position: absolute;
    top: 6px; left: 8%; right: 8%;
    height: 14px;
    background: linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.03));
    border-radius: 2px;
    display: flex;
    gap: 1px;
    padding: 1px;
  }
  .keys::before {
    content: '';
    flex: 1;
    background: repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 3px, transparent 3px, transparent 7px);
    border-radius: 1px;
  }
  
  /* Trackpad */
  .trackpad {
    position: absolute;
    bottom: 4px; left: 50%; transform: translateX(-50%);
    width: 28%; height: 22px;
    background: linear-gradient(180deg, #b8b8b8, #a8a8a8);
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
  }
  
  /* Front bottom lip - thin */
  .lip {
    height: 5px;
    background: linear-gradient(180deg, #969696, #868686);
    margin: 0 -8px;
    border-radius: 0 0 10px 10px;
    position: relative;
  }
  .lip::before {
    content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%);
    width:50px; height:3px; background:#888; border-radius:3px 3px 0 0;
  }
  
  /* iPhone */
  .iphone { width:135px; position:relative; z-index:3; margin-left:-40px; margin-bottom:25px; filter:drop-shadow(0 12px 20px rgba(0,0,0,0.06)); }
  .ip-frame {
    background: linear-gradient(180deg, #2d2d2f, #1a1a1c);
    border-radius: 22px; padding:3px;
    border:1px solid #404042; position:relative;
  }
  .ip-frame::before { content:''; position:absolute; right:-2px; top:22%; width:3px; height:28px; background:#444; border-radius:2px; }
  .ip-frame::after { content:''; position:absolute; right:-2px; top:30%; width:3px; height:28px; background:#444; border-radius:2px; }
  .ip-screen {
    background:#000; border-radius:19px; overflow:hidden;
    aspect-ratio:9/19.5; position:relative;
  }
  .ip-screen img { width:100%; height:100%; object-fit:cover; object-position:top; }
  .ip-notch { position:absolute; top:8px; left:50%; transform:translateX(-50%); width:44px; height:12px; background:#000; border-radius:10px; z-index:10; }
  </style></head>
  <body>
  <div class="scene">
    <div class="macbook">
      <div class="lid">
        <div class="screen"><img src="${dashUri}"/></div>
      </div>
      <div class="deck-container">
        <div class="hinge"></div>
        <div class="deck">
          <div class="keys"></div>
          <div class="trackpad"></div>
        </div>
        <div class="lip"></div>
      </div>
    </div>
    <div class="iphone">
      <div class="ip-frame">
        <div class="ip-screen">
          <div class="ip-notch"></div>
          <img src="${phoneUri}"/>
        </div>
      </div>
    </div>
  </div>
  </body></html>`;
  
  await page.setContent(html);
  await page.waitForTimeout(3000);
  
  const scene = await page.$('.scene');
  await scene.screenshot({ path: 'device-showcase.png', omitBackground: true });
  
  await browser.close();
  console.log('DONE');
})();
