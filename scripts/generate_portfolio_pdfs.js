import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { PDFDocument } from 'pdf-lib';

const FONT_DIR = '/usr/share/fonts/truetype/wqy';

function renderSvgToPng(svgString) {
  const resvg = new Resvg(svgString, {
    font: {
      fontDirs: [FONT_DIR],
      defaultFontFamily: 'WenQuanYi Zen Hei',
      loadSystemFonts: true,
    },
    fitTo: {
      mode: 'width',
      value: 1920,
    },
  });
  return resvg.render().asPng();
}

async function createPdfFromSvgs(svgList, outputPath) {
  const pdfDoc = await PDFDocument.create();
  for (const svg of svgList) {
    const pngBuffer = renderSvgToPng(svg);
    const pngImage = await pdfDoc.embedPng(pngBuffer);
    const page = pdfDoc.addPage([1920, 1080]);
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
    });
  }
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Saved ${outputPath} (${pdfBytes.length} bytes, ${svgList.length} pages)`);
}

// ============================================================================
// 02 · 泰康保险集团茶礼 · 包装设计（茶锦福运）
// ============================================================================
const taikangSvgs = [
  // Page 1: Cover & Project Concept
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg2_1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0c1a16"/>
        <stop offset="50%" stop-color="#142820"/>
        <stop offset="100%" stop-color="#091410"/>
      </linearGradient>
      <linearGradient id="gold2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#D4AF37"/>
        <stop offset="100%" stop-color="#F3E5AB"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg2_1)"/>
    <!-- Decorative Border & Header Grid -->
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#254a3b" stroke-width="2" rx="16"/>
    <rect x="80" y="80" width="1760" height="920" fill="none" stroke="#1d3b2f" stroke-width="1" stroke-dasharray="8 8" rx="12"/>
    
    <!-- Top Meta -->
    <text x="120" y="140" fill="#6ba88f" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 02 PACKAGING DESIGN · 包装全案</text>
    <text x="1800" y="140" fill="#6ba88f" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">YEAR · 2024</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#254a3b" stroke-width="2"/>

    <!-- Title & Chinese Subhead -->
    <text x="120" y="270" fill="url(#gold2)" font-size="64" font-family="WenQuanYi Zen Hei" font-weight="bold">泰康保险集团茶礼 · 包装设计</text>
    <text x="120" y="340" fill="#A8D5BA" font-size="34" font-family="WenQuanYi Zen Hei">《茶锦福运》· 面向当代年轻群体的东方普洱茶礼全案</text>

    <!-- Overview Cards -->
    <rect x="120" y="400" width="1020" height="380" fill="#13271f" rx="16" stroke="#285040" stroke-width="1.5"/>
    <text x="160" y="455" fill="#D4AF37" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【核心理念与设计背景】</text>
    <text x="160" y="505" fill="#e2f1e8" font-size="20" font-family="WenQuanYi Zen Hei">项目客户：泰康保险集团 ｜ 设计年份：2024</text>
    <text x="160" y="555" fill="#c3ded0" font-size="19" font-family="WenQuanYi Zen Hei">· 结合泰康企业文化与东方福运意向，提炼当代年轻人“新五福”精神符号：</text>
    <text x="190" y="595" fill="#9ec4b1" font-size="18" font-family="WenQuanYi Zen Hei">1. 好身体 · 鹤瘦松青 ｜ 2. 好年轻 · 白齿青眉 ｜ 3. 好事业 · 青云直上</text>
    <text x="190" y="635" fill="#9ec4b1" font-size="18" font-family="WenQuanYi Zen Hei">4. 好心情 · 春风拂面 ｜ 5. 好运气 · 白鱼入舟</text>
    <text x="160" y="685" fill="#c3ded0" font-size="19" font-family="WenQuanYi Zen Hei">· 书法字体加重笔画处理，融合泰康蝴蝶符号、北京天坛与泰康大厦建筑轮廓。</text>
    <text x="160" y="730" fill="#c3ded0" font-size="19" font-family="WenQuanYi Zen Hei">· 完成普洱茶饼棉纸、抽拉式硬质天地盖礼盒、结构刀模展开图与样机全案。</text>

    <!-- Side Visual Spec Preview -->
    <rect x="1180" y="400" width="620" height="380" fill="#0f2019" rx="16" stroke="#285040" stroke-width="1.5"/>
    <text x="1220" y="455" fill="#D4AF37" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【视觉识别体系指标】</text>
    
    <circle cx="1250" cy="520" r="28" fill="#3A6D55"/>
    <text x="1300" y="515" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei">玉色 #3A6D55 · 核心主国色</text>
    <text x="1300" y="538" fill="#84a997" font-size="14" font-family="WenQuanYi Zen Hei">主视觉基调 / 茶饼内纸规范</text>

    <circle cx="1250" cy="590" r="28" fill="#BCCBB8"/>
    <text x="1300" y="585" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei">青色 #BCCBB8 · 清雅辅助色</text>
    <text x="1300" y="608" fill="#84a997" font-size="14" font-family="WenQuanYi Zen Hei">外盒侧边 / 礼袋包边点缀</text>

    <circle cx="1250" cy="660" r="28" fill="#E5C7C7"/>
    <text x="1300" y="655" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei">白色 #E5C7C7 · 柔和肌理色</text>
    <text x="1300" y="678" fill="#84a997" font-size="14" font-family="WenQuanYi Zen Hei">特种棉纸底色 / 特效烫金衬托</text>

    <circle cx="1250" cy="730" r="28" fill="#DCCCB2"/>
    <text x="1300" y="725" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei">橙色 #DCCCB2 · 祥瑞提亮色</text>
    <text x="1300" y="748" fill="#84a997" font-size="14" font-family="WenQuanYi Zen Hei">五福封签 / 腰封丝带点睛</text>

    <!-- Bottom Footer -->
    <text x="120" y="930" fill="#588572" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 泰康保险集团茶礼包装设计全案 · PAGE 01 / 03</text>
  </svg>`,

  // Page 2: Color Palette, Typography & Five Blessings Graphic Design
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg2_2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0c1a16"/>
        <stop offset="100%" stop-color="#142820"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg2_2)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#254a3b" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#6ba88f" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 02 PACKAGING DESIGN · 字体与图形规范</text>
    <text x="1800" y="140" fill="#6ba88f" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">五福图形 ＆ 国色系统</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#254a3b" stroke-width="2"/>

    <!-- Left: Five Blessings Icons / Visual Symbols -->
    <rect x="120" y="210" width="810" height="710" fill="#13271f" rx="16" stroke="#285040" stroke-width="1.5"/>
    <text x="160" y="265" fill="#D4AF37" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【当代五福图形化符号设计】</text>

    <!-- Blessing 1 -->
    <rect x="160" y="295" width="730" height="100" fill="#0e1d17" rx="10" stroke="#204234"/>
    <circle cx="215" cy="345" r="28" fill="#3A6D55"/>
    <text x="215" y="353" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="middle">松</text>
    <text x="265" y="335" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" font-weight="bold">01. 鹤瘦松青 · 好身体</text>
    <text x="265" y="365" fill="#84a997" font-size="16" font-family="WenQuanYi Zen Hei">寓意身如苍松健硕、仙鹤长生，图形融合松枝节与茶芽形态</text>

    <!-- Blessing 2 -->
    <rect x="160" y="415" width="730" height="100" fill="#0e1d17" rx="10" stroke="#204234"/>
    <circle cx="215" cy="465" r="28" fill="#2d5845"/>
    <text x="215" y="473" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="middle">眉</text>
    <text x="265" y="455" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" font-weight="bold">02. 白齿青眉 · 好年轻</text>
    <text x="265" y="485" fill="#84a997" font-size="16" font-family="WenQuanYi Zen Hei">代表青春朝气与明亮心境，运用流线弧形勾勒如叶如眉之态</text>

    <!-- Blessing 3 -->
    <rect x="160" y="535" width="730" height="100" fill="#0e1d17" rx="10" stroke="#204234"/>
    <circle cx="215" cy="585" r="28" fill="#366b53"/>
    <text x="215" y="593" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="middle">云</text>
    <text x="265" y="575" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" font-weight="bold">03. 青云直上 · 好事业</text>
    <text x="265" y="605" fill="#84a997" font-size="16" font-family="WenQuanYi Zen Hei">提炼天坛祥云与现代泰康大厦层叠纵向线条，寓意步步高升</text>

    <!-- Blessing 4 & 5 -->
    <rect x="160" y="655" width="730" height="100" fill="#0e1d17" rx="10" stroke="#204234"/>
    <circle cx="215" cy="705" r="28" fill="#3f7a5f"/>
    <text x="215" y="713" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="middle">风</text>
    <text x="265" y="695" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" font-weight="bold">04. 春风拂面 · 好心情</text>
    <text x="265" y="725" fill="#84a997" font-size="16" font-family="WenQuanYi Zen Hei">微风与茶汤涟漪层叠波动，温和抚慰都市青年繁忙日常情绪</text>

    <rect x="160" y="775" width="730" height="100" fill="#0e1d17" rx="10" stroke="#204234"/>
    <circle cx="215" cy="825" r="28" fill="#4d8f70"/>
    <text x="215" y="833" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="middle">舟</text>
    <text x="265" y="815" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" font-weight="bold">05. 白鱼入舟 · 好运气</text>
    <text x="265" y="845" fill="#84a997" font-size="16" font-family="WenQuanYi Zen Hei">古雅吉祥典故，以双鱼太极式巡游轮廓呼应灵动福运归仓</text>

    <!-- Right: Typography & Construction -->
    <rect x="970" y="210" width="830" height="710" fill="#13271f" rx="16" stroke="#285040" stroke-width="1.5"/>
    <text x="1010" y="265" fill="#D4AF37" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【定制书法造字与字体结构】</text>
    
    <text x="1010" y="325" fill="#A8D5BA" font-size="20" font-family="WenQuanYi Zen Hei">“茶锦福运”四字定制书法笔法与网格骨架：</text>
    
    <!-- Character Display Box -->
    <rect x="1010" y="360" width="750" height="240" fill="#0d1914" rx="12" stroke="#234737"/>
    <text x="1100" y="510" fill="#E5C7C7" font-size="110" font-family="WenQuanYi Zen Hei" font-weight="bold">茶</text>
    <text x="1280" y="510" fill="#E5C7C7" font-size="110" font-family="WenQuanYi Zen Hei" font-weight="bold">锦</text>
    <text x="1460" y="510" fill="#E5C7C7" font-size="110" font-family="WenQuanYi Zen Hei" font-weight="bold">福</text>
    <text x="1640" y="510" fill="#E5C7C7" font-size="110" font-family="WenQuanYi Zen Hei" font-weight="bold">运</text>

    <text x="1010" y="640" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 运笔特点：借鉴汉隶沉穆厚重与行楷洒脱笔触，横划微耸，撇捺舒展且尾部微加重。</text>
    <text x="1010" y="680" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 融合元素：在“茶”与“锦”字结构中注入泰康标志蝴蝶展翅的圆润折角形态。</text>
    <text x="1010" y="720" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 工艺工艺配合：外包装采用深凹烫冷金、哑光激凸工艺，赋予包装丰富触觉质感。</text>
    <text x="1010" y="760" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 环保基材：严选 100% 可回收桑皮特种麻纸，契合当代绿色健康与可持续价值观。</text>

    <text x="120" y="955" fill="#588572" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 泰康保险集团茶礼包装设计全案 · PAGE 02 / 03</text>
  </svg>`,

  // Page 3: Die-cut Structure, Tea Cake Wrapping & Mockup
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg2_3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0c1a16"/>
        <stop offset="100%" stop-color="#142820"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg2_3)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#254a3b" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#6ba88f" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 02 PACKAGING DESIGN · 盒型刀模与结构展开</text>
    <text x="1800" y="140" fill="#6ba88f" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">结构工艺与成品打样规范</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#254a3b" stroke-width="2"/>

    <!-- Left: Die-cut / Structure Blueprint -->
    <rect x="120" y="210" width="1000" height="710" fill="#13271f" rx="16" stroke="#285040" stroke-width="1.5"/>
    <text x="160" y="265" fill="#D4AF37" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【抽拉式硬质天地盖礼盒结构刀模】</text>

    <!-- Structural Diagram Lines -->
    <rect x="200" y="310" width="400" height="260" fill="none" stroke="#6ba88f" stroke-width="3" rx="8"/>
    <rect x="230" y="340" width="340" height="200" fill="none" stroke="#3A6D55" stroke-width="2" stroke-dasharray="6 6"/>
    <text x="400" y="445" fill="#A8D5BA" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="middle">外盒天盖 280 × 280 × 65 mm</text>

    <rect x="650" y="310" width="420" height="260" fill="none" stroke="#D4AF37" stroke-width="3" rx="8"/>
    <circle cx="860" cy="440" r="85" fill="none" stroke="#c3ded0" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="860" y="445" fill="#D4AF37" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="middle">普洱茶饼仓 (直径 195mm)</text>

    <!-- Specs List -->
    <text x="160" y="620" fill="#A8D5BA" font-size="20" font-family="WenQuanYi Zen Hei" font-weight="bold">生产制造工艺参数：</text>
    <text x="160" y="660" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 盒型类别：双层抽拉硬壳装配天地盖，高密度 1600g 工业双灰板手工裱糊。</text>
    <text x="160" y="700" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 表面纸张：180g 触感雅致翡翠绿特种纸，正面亚金丝网印制五福专属徽标。</text>
    <text x="160" y="740" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 内衬材质：高回弹 EVA 贴绒布激光开槽，严密贴合 357g 普洱茶饼，防震抗压。</text>
    <text x="160" y="780" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 开启仪式感：内嵌磁吸搭扣与缎面提手，开启顺滑安静，传递高档商务尊崇感。</text>

    <!-- Right: Tea Cake Wrapper & Mockup notes -->
    <rect x="1160" y="210" width="640" height="710" fill="#13271f" rx="16" stroke="#285040" stroke-width="1.5"/>
    <text x="1200" y="265" fill="#D4AF37" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【357g 普洱茶饼棉纸包装】</text>
    
    <circle cx="1480" cy="440" r="140" fill="#0d1914" stroke="#6ba88f" stroke-width="3"/>
    <circle cx="1480" cy="440" r="105" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="6 4"/>
    <circle cx="1480" cy="440" r="65" fill="#1b382c" stroke="#3A6D55" stroke-width="2"/>
    <text x="1480" y="445" fill="#F3E5AB" font-size="24" font-family="WenQuanYi Zen Hei" text-anchor="middle" font-weight="bold">茶锦福运</text>
    <text x="1480" y="475" fill="#A8D5BA" font-size="14" font-family="WenQuanYi Zen Hei" text-anchor="middle">普洱生茶 · 357g</text>

    <text x="1200" y="630" fill="#A8D5BA" font-size="19" font-family="WenQuanYi Zen Hei" font-weight="bold">棉纸手工折包折痕规范：</text>
    <text x="1200" y="670" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 采用 16 折传统手工菊花折折包规范，背面粘贴防伪五福金漆封签。</text>
    <text x="1200" y="710" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 纸张选用 45g 手工傣纸，透气防潮，透发普洱自然陈化香气。</text>
    <text x="1200" y="750" fill="#c3ded0" font-size="18" font-family="WenQuanYi Zen Hei">· 单饼附赠收藏证书、手撕冲泡指南与五福主题明信片。</text>

    <text x="120" y="955" fill="#588572" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 泰康保险集团茶礼包装设计全案 · PAGE 03 / 03</text>
  </svg>`,
];

// ============================================================================
// 03 · 艺设走廊 · 导视系统设计
// ============================================================================
const yisheSvgs = [
  // Page 1: Cover & Project Concept
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg3_1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1c1214"/>
        <stop offset="50%" stop-color="#2a1619"/>
        <stop offset="100%" stop-color="#140c0e"/>
      </linearGradient>
      <linearGradient id="red3" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#EC5B3C"/>
        <stop offset="100%" stop-color="#FF7F63"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg3_1)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#52292f" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#f87171" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 03 WAYFINDING DESIGN · 导视系统全案</text>
    <text x="1800" y="140" fill="#f87171" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">YEAR · 2023</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#52292f" stroke-width="2"/>

    <text x="120" y="270" fill="url(#red3)" font-size="64" font-family="WenQuanYi Zen Hei" font-weight="bold">艺设走廊 · 导视系统设计</text>
    <text x="120" y="340" fill="#FCA5A5" font-size="34" font-family="WenQuanYi Zen Hei">空间高效定位与美学统一 · 艺术设计学院建筑导向与展示系统</text>

    <!-- Overview Box -->
    <rect x="120" y="400" width="1050" height="380" fill="#241417" rx="16" stroke="#5c2c34" stroke-width="1.5"/>
    <text x="160" y="455" fill="#EC5B3C" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【项目背景与人行动线考量】</text>
    <text x="160" y="505" fill="#ffe4e6" font-size="20" font-family="WenQuanYi Zen Hei">客户：艺术设计学院 ｜ 落地周期：2023 ｜ 建筑面积：约 12,000 ㎡</text>
    <text x="160" y="555" fill="#fecdd3" font-size="19" font-family="WenQuanYi Zen Hei">· 充分考量师生、访客、评审专家三类人群在复杂教学建筑中的视觉注视点与行进动线。</text>
    <text x="160" y="595" fill="#fecdd3" font-size="19" font-family="WenQuanYi Zen Hei">· 解决老校区拐弯死角多、科室门牌模糊、展品展厅缺乏统一视觉焦点的核心痛点。</text>
    <text x="160" y="635" fill="#fecdd3" font-size="19" font-family="WenQuanYi Zen Hei">· 确立“高明度警示红 + 柔和哑光灰”的学院派现代主义色彩规范体系。</text>
    <text x="160" y="675" fill="#fecdd3" font-size="19" font-family="WenQuanYi Zen Hei">· 涵盖立式总导览牌（170-230cm）、悬挂分流牌、科室贴墙标牌及多功能展板系统。</text>

    <!-- Color Scheme Card -->
    <rect x="1210" y="400" width="590" height="380" fill="#1f1013" rx="16" stroke="#5c2c34" stroke-width="1.5"/>
    <text x="1250" y="455" fill="#EC5B3C" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【空间色彩规范】</text>

    <circle cx="1285" cy="520" r="28" fill="#EC5B3C"/>
    <text x="1335" y="515" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei">主色彩 #EC5B3C 学院红</text>
    <text x="1335" y="538" fill="#fda4af" font-size="14" font-family="WenQuanYi Zen Hei">核心导向箭头、关键楼层代码主色</text>

    <circle cx="1285" cy="590" r="28" fill="#D9D9D9"/>
    <text x="1335" y="585" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei">辅助灰 #D9D9D9 银雾灰</text>
    <text x="1335" y="608" fill="#fda4af" font-size="14" font-family="WenQuanYi Zen Hei">铝合金拉丝面板基底色</text>

    <circle cx="1285" cy="660" r="28" fill="#F7A8DF"/>
    <text x="1335" y="655" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei">点缀粉 #F7A8DF 柔樱粉</text>
    <text x="1335" y="678" fill="#fda4af" font-size="14" font-family="WenQuanYi Zen Hei">艺术展示走廊展位标号点缀</text>

    <circle cx="1285" cy="730" r="28" fill="#4D4D4D"/>
    <text x="1335" y="725" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei">深炭灰 #4D4D4D 文字色</text>
    <text x="1335" y="748" fill="#fda4af" font-size="14" font-family="WenQuanYi Zen Hei">正文科室中英双语文字印刷</text>

    <text x="120" y="930" fill="#99404f" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 艺设走廊导视系统设计全案 · PAGE 01 / 03</text>
  </svg>`,

  // Page 2: Pictogram & Number Typography
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg3_2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1c1214"/>
        <stop offset="100%" stop-color="#2a1619"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg3_2)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#52292f" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#f87171" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 03 WAYFINDING DESIGN · 图标系统与楼层字形</text>
    <text x="1800" y="140" fill="#f87171" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">象形图标规范 ＆ 模块化网格</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#52292f" stroke-width="2"/>

    <!-- Left: Pictogram Matrix -->
    <rect x="120" y="210" width="860" height="710" fill="#241417" rx="16" stroke="#5c2c34" stroke-width="1.5"/>
    <text x="160" y="265" fill="#EC5B3C" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【全套象形功能图标规范（24 × 24dp 网格）】</text>

    <!-- Row 1 of icons -->
    <rect x="160" y="300" width="150" height="160" fill="#160c0e" rx="12" stroke="#4a2228"/>
    <rect x="210" y="330" width="50" height="60" rx="4" fill="none" stroke="#EC5B3C" stroke-width="4"/>
    <line x1="235" y1="330" x2="235" y2="390" stroke="#EC5B3C" stroke-width="3"/>
    <text x="235" y="430" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">卫生间 RESTROOM</text>

    <rect x="330" y="300" width="150" height="160" fill="#160c0e" rx="12" stroke="#4a2228"/>
    <circle cx="405" cy="350" r="22" fill="none" stroke="#EC5B3C" stroke-width="4"/>
    <path d="M395 365 C 405 380, 405 380, 415 365" stroke="#EC5B3C" stroke-width="4" fill="none"/>
    <text x="405" y="430" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">饮水机 DRINK</text>

    <rect x="500" y="300" width="150" height="160" fill="#160c0e" rx="12" stroke="#4a2228"/>
    <rect x="550" y="335" width="50" height="55" rx="6" fill="none" stroke="#EC5B3C" stroke-width="4"/>
    <line x1="560" y1="335" x2="590" y2="335" stroke="#EC5B3C" stroke-width="4"/>
    <text x="575" y="430" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">消防栓 FIRE</text>

    <rect x="670" y="300" width="150" height="160" fill="#160c0e" rx="12" stroke="#4a2228"/>
    <rect x="715" y="335" width="60" height="50" rx="4" fill="none" stroke="#EC5B3C" stroke-width="4"/>
    <line x1="725" y1="360" x2="765" y2="360" stroke="#EC5B3C" stroke-width="3"/>
    <text x="745" y="430" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">学术报告厅 HALL</text>

    <!-- Row 2 of icons -->
    <rect x="160" y="490" width="150" height="160" fill="#160c0e" rx="12" stroke="#4a2228"/>
    <polygon points="215,550 255,530 255,570" fill="#EC5B3C"/>
    <text x="235" y="620" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">左转导向 LEFT</text>

    <rect x="330" y="490" width="150" height="160" fill="#160c0e" rx="12" stroke="#4a2228"/>
    <polygon points="425,550 385,530 385,570" fill="#EC5B3C"/>
    <text x="405" y="620" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">右转导向 RIGHT</text>

    <rect x="500" y="490" width="150" height="160" fill="#160c0e" rx="12" stroke="#4a2228"/>
    <polygon points="575,525 555,565 595,565" fill="#EC5B3C"/>
    <text x="575" y="620" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">直行导向 STRAIGHT</text>

    <rect x="670" y="490" width="150" height="160" fill="#160c0e" rx="12" stroke="#4a2228"/>
    <rect x="720" y="525" width="50" height="50" rx="25" fill="none" stroke="#EC5B3C" stroke-width="4"/>
    <text x="745" y="620" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">安全出口 EXIT</text>

    <text x="160" y="700" fill="#ffe4e6" font-size="18" font-family="WenQuanYi Zen Hei">· 图标设计遵循等线粗细原则，拐角做 4dp 倒角，保证 15 米外清晰辨识。</text>
    <text x="160" y="740" fill="#ffe4e6" font-size="18" font-family="WenQuanYi Zen Hei">· 经 300+ 人次师生现场视距实验测试，平均识别时间缩短至 0.8 秒以内。</text>

    <!-- Right: Dimension & Building Number -->
    <rect x="1010" y="210" width="790" height="710" fill="#241417" rx="16" stroke="#5c2c34" stroke-width="1.5"/>
    <text x="1050" y="265" fill="#EC5B3C" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【楼层立体字形与门牌设计 (A 301)】</text>

    <!-- Big Numbers Display -->
    <rect x="1050" y="300" width="710" height="230" fill="#160c0e" rx="12" stroke="#4a2228"/>
    <text x="1100" y="450" fill="#EC5B3C" font-size="120" font-family="WenQuanYi Zen Hei" font-weight="bold">A</text>
    <text x="1240" y="450" fill="#ffffff" font-size="120" font-family="WenQuanYi Zen Hei" font-weight="bold">301</text>
    <text x="1500" y="380" fill="#fda4af" font-size="22" font-family="WenQuanYi Zen Hei">视觉传达综合工作室</text>
    <text x="1500" y="420" fill="#fda4af" font-size="16" font-family="WenQuanYi Zen Hei">Visual Comm. Studio</text>
    <line x1="1500" y1="440" x2="1730" y2="440" stroke="#EC5B3C" stroke-width="2"/>
    <text x="1500" y="475" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei">容量：45 人 ｜ 3F 东区</text>

    <text x="1050" y="580" fill="#ffe4e6" font-size="19" font-family="WenQuanYi Zen Hei" font-weight="bold">门牌结构与安装方式：</text>
    <text x="1050" y="620" fill="#fecdd3" font-size="18" font-family="WenQuanYi Zen Hei">· 材质：3mm 航空拉丝阳极氧化铝板 + 亚克力双层夹芯背打光。</text>
    <text x="1050" y="660" fill="#fecdd3" font-size="18" font-family="WenQuanYi Zen Hei">· 安装高度：门锁上方 1.5 米视觉中心视平线位置，侧面带 15° 微仰角倾斜。</text>
    <text x="1050" y="700" fill="#fecdd3" font-size="18" font-family="WenQuanYi Zen Hei">· 盲文触觉：底部同步冲压无障碍盲文标识点位，体现无障碍人文关怀。</text>

    <text x="120" y="955" fill="#99404f" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 艺设走廊导视系统设计全案 · PAGE 02 / 03</text>
  </svg>`,

  // Page 3: Standing Pillars & Corridor Installation
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg3_3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1c1214"/>
        <stop offset="100%" stop-color="#2a1619"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg3_3)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#52292f" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#f87171" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 03 WAYFINDING DESIGN · 实体立柱与空间落地</text>
    <text x="1800" y="140" fill="#f87171" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">170-230cm 立柱尺度规范</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#52292f" stroke-width="2"/>

    <!-- Left: Standing Pillar Blueprint -->
    <rect x="120" y="210" width="820" height="710" fill="#241417" rx="16" stroke="#5c2c34" stroke-width="1.5"/>
    <text x="160" y="265" fill="#EC5B3C" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【170-230cm 立式总览导向牌结构图】</text>

    <!-- Pillar Graphic -->
    <rect x="220" y="310" width="180" height="480" fill="#160c0e" stroke="#EC5B3C" stroke-width="3" rx="6"/>
    <!-- Top red band -->
    <rect x="220" y="310" width="180" height="80" fill="#EC5B3C" rx="4"/>
    <text x="310" y="355" fill="#ffffff" font-size="26" font-family="WenQuanYi Zen Hei" text-anchor="middle" font-weight="bold">3F MAP</text>
    <!-- Map zone -->
    <rect x="240" y="410" width="140" height="180" fill="#241417" stroke="#52292f" stroke-width="1"/>
    <text x="310" y="505" fill="#fda4af" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">楼层平面索引图</text>
    <!-- Direction arrows -->
    <text x="310" y="630" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">← A区专业教室</text>
    <text x="310" y="670" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">B区多功能展厅 →</text>
    <text x="310" y="710" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">↑ 国际艺术交流中心</text>

    <!-- Side Dimension annotations -->
    <line x1="430" y1="310" x2="430" y2="790" stroke="#f87171" stroke-width="2"/>
    <text x="450" y="560" fill="#f87171" font-size="20" font-family="WenQuanYi Zen Hei">高度 2100 mm</text>

    <text x="450" y="350" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei">顶部红标高度: 350mm</text>
    <text x="450" y="450" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei">地图视平区: 1300-1650mm</text>
    <text x="450" y="700" fill="#fecdd3" font-size="16" font-family="WenQuanYi Zen Hei">基座加重稳固配重钢板</text>

    <!-- Right: Public Gallery Space Wall Panels -->
    <rect x="970" y="210" width="830" height="710" fill="#241417" rx="16" stroke="#5c2c34" stroke-width="1.5"/>
    <text x="1010" y="265" fill="#EC5B3C" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【长廊公共展厅多功能活动展板规范】</text>

    <rect x="1010" y="300" width="750" height="260" fill="#160c0e" rx="12" stroke="#4a2228"/>
    <!-- Wireframe Exhibition Wall -->
    <rect x="1040" y="330" width="200" height="190" fill="#241417" stroke="#f87171" stroke-width="2" rx="4"/>
    <text x="1140" y="420" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">模块 01 · 毕业设计展板</text>
    <rect x="1270" y="330" width="200" height="190" fill="#241417" stroke="#f87171" stroke-width="2" rx="4"/>
    <text x="1370" y="420" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">模块 02 · 教师教研成果</text>
    <rect x="1500" y="330" width="230" height="190" fill="#241417" stroke="#f87171" stroke-width="2" rx="4"/>
    <text x="1615" y="420" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">模块 03 · 电子交互屏</text>

    <text x="1010" y="600" fill="#ffe4e6" font-size="19" font-family="WenQuanYi Zen Hei" font-weight="bold">施工节点与现场落地复盘：</text>
    <text x="1010" y="640" fill="#fecdd3" font-size="18" font-family="WenQuanYi Zen Hei">· 展板具备模块化自由磁吸拼装特性，可依据每期展出需求任意增减面积。</text>
    <text x="1010" y="680" fill="#fecdd3" font-size="18" font-family="WenQuanYi Zen Hei">· 走廊拐弯死角处增设 45° 菱形广角反光导向牌，避免人流交汇盲区冲撞。</text>
    <text x="1010" y="720" fill="#fecdd3" font-size="18" font-family="WenQuanYi Zen Hei">· 本项目于 2023 年底全线交付实地施工，获学院师生一致好评与设计推优。</text>

    <text x="120" y="955" fill="#99404f" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 艺设走廊导视系统设计全案 · PAGE 03 / 03</text>
  </svg>`,
];

// ============================================================================
// 04 · 环保黑胶 · 音乐生物可视化 · 手机网页设计 / 交互设计
// ============================================================================
const vinylSvgs = [
  // Page 1: Cover & Project Concept
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg4_1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a192f"/>
        <stop offset="50%" stop-color="#0f2b48"/>
        <stop offset="100%" stop-color="#071324"/>
      </linearGradient>
      <linearGradient id="cyan4" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#818cf8"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg4_1)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#1e3a5f" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#38bdf8" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 04 INTERACTIVE UI/UX · 移动网页与声音生物可视化</text>
    <text x="1800" y="140" fill="#38bdf8" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">YEAR · 2023</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#1e3a5f" stroke-width="2"/>

    <text x="120" y="270" fill="url(#cyan4)" font-size="64" font-family="WenQuanYi Zen Hei" font-weight="bold">环保黑胶 · 音乐生物可视化</text>
    <text x="120" y="340" fill="#bae6fd" font-size="34" font-family="WenQuanYi Zen Hei">手机网页设计 / 交互设计 · 音乐振动影响黏菌轨迹定制生物唱片</text>

    <rect x="120" y="400" width="1050" height="380" fill="#0c233c" rx="16" stroke="#1d4ed8" stroke-width="1.5"/>
    <text x="160" y="455" fill="#38bdf8" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【跨学科实验理念：声音 × 黏菌 × 环保材料】</text>
    <text x="160" y="505" fill="#e0f2fe" font-size="20" font-family="WenQuanYi Zen Hei">研究机构：声音生物实验室 ｜ 设计时间：2023</text>
    <text x="160" y="555" fill="#bae6fd" font-size="19" font-family="WenQuanYi Zen Hei">· 突破传统黑胶唱片高污染 PVC 塑料材质壁垒，探索利用废弃牛奶酪蛋白生物可降解塑料。</text>
    <text x="160" y="595" fill="#bae6fd" font-size="19" font-family="WenQuanYi Zen Hei">· 实验发现：不同音乐风格（民谣/摇滚/电子/爵士）低频与中高频声波振动直接改变真菌菌丝生长方向。</text>
    <text x="160" y="635" fill="#bae6fd" font-size="19" font-family="WenQuanYi Zen Hei">· 设计移动端 H5 交互系统，用户可上传喜爱歌曲，算法实时模拟黏菌生长并渲染黑胶纹理。</text>
    <text x="160" y="675" fill="#bae6fd" font-size="19" font-family="WenQuanYi Zen Hei">· 用户完成虚拟定制后，可一键下单订制独一无二的实体生物环保黑胶唱片模型与专属艺术封套。</text>

    <!-- Side Spec Card -->
    <rect x="1210" y="400" width="590" height="380" fill="#091b30" rx="16" stroke="#1d4ed8" stroke-width="1.5"/>
    <text x="1250" y="455" fill="#38bdf8" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【系统技术与交互架构】</text>
    
    <text x="1250" y="510" fill="#e0f2fe" font-size="18" font-family="WenQuanYi Zen Hei">· Web Audio API：实时解析音频 FFT 快速傅里叶频谱</text>
    <text x="1250" y="550" fill="#e0f2fe" font-size="18" font-family="WenQuanYi Zen Hei">· Physarum Polycephalum 算法：黏菌扩散数学模型</text>
    <text x="1250" y="590" fill="#e0f2fe" font-size="18" font-family="WenQuanYi Zen Hei">· Three.js 3D 渲染：黑胶唱片微观凹槽质感光影</text>
    <text x="1250" y="630" fill="#e0f2fe" font-size="18" font-family="WenQuanYi Zen Hei">· 环保材料闭环：过期牛奶 + 食用白醋 + 自然植物矿物染料</text>
    <text x="1250" y="670" fill="#e0f2fe" font-size="18" font-family="WenQuanYi Zen Hei">· 降解周期：常温土壤填埋 180 天完全生物降解</text>

    <text x="120" y="930" fill="#3b82f6" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 环保黑胶音乐生物可视化交互全案 · PAGE 01 / 03</text>
  </svg>`,

  // Page 2: Slime Mold Experiment & Audio Spectrum
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg4_2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a192f"/>
        <stop offset="100%" stop-color="#0f2b48"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg4_2)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#1e3a5f" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#38bdf8" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 04 INTERACTIVE UI/UX · 生物实验工序与音频映射</text>
    <text x="1800" y="140" fill="#38bdf8" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">4步生物塑料工序 ＆ 5大曲风振幅</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#1e3a5f" stroke-width="2"/>

    <!-- Left: 4 Steps of Bio-Plastic -->
    <rect x="120" y="210" width="810" height="710" fill="#0c233c" rx="16" stroke="#1d4ed8" stroke-width="1.5"/>
    <text x="160" y="265" fill="#38bdf8" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【4 步环保生物酪蛋白唱片制作工序】</text>

    <!-- Step 1 -->
    <rect x="160" y="300" width="730" height="95" fill="#071829" rx="10" stroke="#1e3a5f"/>
    <text x="190" y="345" fill="#38bdf8" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">STEP 01</text>
    <text x="310" y="340" fill="#ffffff" font-size="19" font-family="WenQuanYi Zen Hei">过期牛奶加热与酸凝反应</text>
    <text x="310" y="370" fill="#93c5fd" font-size="15" font-family="WenQuanYi Zen Hei">加热至 65℃，加入食用白醋使酪蛋白团聚沉淀，实现废弃奶品再生</text>

    <!-- Step 2 -->
    <rect x="160" y="415" width="730" height="95" fill="#071829" rx="10" stroke="#1e3a5f"/>
    <text x="190" y="460" fill="#38bdf8" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">STEP 02</text>
    <text x="310" y="455" fill="#ffffff" font-size="19" font-family="WenQuanYi Zen Hei">多级纱布过滤与水分挤压</text>
    <text x="310" y="485" fill="#93c5fd" font-size="15" font-family="WenQuanYi Zen Hei">物理脱水滤除乳清，获得纯度 92% 的致密生物高分子胶体面团</text>

    <!-- Step 3 -->
    <rect x="160" y="530" width="730" height="95" fill="#071829" rx="10" stroke="#1e3a5f"/>
    <text x="190" y="575" fill="#38bdf8" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">STEP 03</text>
    <text x="310" y="570" fill="#ffffff" font-size="19" font-family="WenQuanYi Zen Hei">天然植物萃取矿物调色</text>
    <text x="310" y="600" fill="#93c5fd" font-size="15" font-family="WenQuanYi Zen Hei">注入青黛、茜草与栀子天然色素，使唱片呈现深邃的自然渐变光泽</text>

    <!-- Step 4 -->
    <rect x="160" y="645" width="730" height="95" fill="#071829" rx="10" stroke="#1e3a5f"/>
    <text x="190" y="690" fill="#38bdf8" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">STEP 04</text>
    <text x="310" y="685" fill="#ffffff" font-size="19" font-family="WenQuanYi Zen Hei">数控精密模具高压烘烤定型</text>
    <text x="310" y="715" fill="#93c5fd" font-size="15" font-family="WenQuanYi Zen Hei">70℃ 恒温压机模具成型，刻录专属声音纹理与微米级音轨纹路</text>

    <!-- Right: 5 Music Genres Spectrum -->
    <rect x="970" y="210" width="830" height="710" fill="#0c233c" rx="16" stroke="#1d4ed8" stroke-width="1.5"/>
    <text x="1010" y="265" fill="#38bdf8" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【音乐频谱振幅与黏菌生长形态对应模型】</text>

    <text x="1010" y="325" fill="#e0f2fe" font-size="18" font-family="WenQuanYi Zen Hei">· 民谣 (Folk)：中高频为主，菌丝呈现细密如水草般的丝绒状舒缓扩散。</text>
    <text x="1010" y="375" fill="#e0f2fe" font-size="18" font-family="WenQuanYi Zen Hei">· 电子 (Electronic)：高频节奏断点明显，菌落呈现脉冲同心圆波纹扩张。</text>
    <text x="1010" y="425" fill="#e0f2fe" font-size="18" font-family="WenQuanYi Zen Hei">· 摇滚/Funk：重低音鼓点冲击，刺激菌丝产生粗壮的网状主干能量通道。</text>
    <text x="1010" y="475" fill="#e0f2fe" font-size="18" font-family="WenQuanYi Zen Hei">· 爵士 (Jazz)：即兴切分音，促使菌丝呈现多支点螺旋交织的复杂混沌美感。</text>
    <text x="1010" y="525" fill="#e0f2fe" font-size="18" font-family="WenQuanYi Zen Hei">· 古典 (Classical)：宽动态大交响，呈现外围羽状轻盈与内核深沉的多重层次。</text>

    <!-- Interactive Simulated Audio Waves Visual Box -->
    <rect x="1010" y="575" width="750" height="180" fill="#071829" rx="12" stroke="#1e3a5f"/>
    <!-- Wave Bars -->
    <rect x="1050" y="660" width="16" height="60" fill="#38bdf8" rx="4"/>
    <rect x="1080" y="620" width="16" height="100" fill="#38bdf8" rx="4"/>
    <rect x="1110" y="600" width="16" height="120" fill="#60a5fa" rx="4"/>
    <rect x="1140" y="640" width="16" height="80" fill="#818cf8" rx="4"/>
    <rect x="1170" y="610" width="16" height="110" fill="#a78bfa" rx="4"/>
    <rect x="1200" y="670" width="16" height="50" fill="#38bdf8" rx="4"/>
    <rect x="1230" y="590" width="16" height="130" fill="#38bdf8" rx="4"/>
    <rect x="1260" y="630" width="16" height="90" fill="#60a5fa" rx="4"/>
    <text x="1420" y="670" fill="#bae6fd" font-size="20" font-family="WenQuanYi Zen Hei">实时声谱 FFT 采样率: 44.1kHz</text>

    <text x="120" y="955" fill="#3b82f6" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 环保黑胶音乐生物可视化交互全案 · PAGE 02 / 03</text>
  </svg>`,

  // Page 3: Mobile UI Flow
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg4_3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a192f"/>
        <stop offset="100%" stop-color="#0f2b48"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg4_3)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#1e3a5f" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#38bdf8" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 04 INTERACTIVE UI/UX · 移动端交互原型与用户旅程</text>
    <text x="1800" y="140" fill="#38bdf8" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">Figma 原型交互 ＆ 订制流程</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#1e3a5f" stroke-width="2"/>

    <!-- 4 Mobile Screen Frames -->
    <!-- Screen 1: Splash / Music Upload -->
    <rect x="140" y="220" width="360" height="660" fill="#071829" stroke="#38bdf8" stroke-width="3" rx="32"/>
    <text x="320" y="270" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei" text-anchor="middle">01 · 音乐导入</text>
    <circle cx="320" cy="400" r="80" fill="#0f2b48" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 8"/>
    <text x="320" y="405" fill="#38bdf8" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">+ 上传音频</text>
    <text x="320" y="550" fill="#93c5fd" font-size="15" font-family="WenQuanYi Zen Hei" text-anchor="middle">支持 MP3/WAV/FLAC</text>

    <!-- Screen 2: Realtime Visualization -->
    <rect x="540" y="220" width="360" height="660" fill="#071829" stroke="#60a5fa" stroke-width="3" rx="32"/>
    <text x="720" y="270" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei" text-anchor="middle">02 · 生物渲染</text>
    <circle cx="720" cy="420" r="110" fill="#0c233c" stroke="#818cf8" stroke-width="2"/>
    <circle cx="720" cy="420" r="30" fill="#38bdf8"/>
    <text x="720" y="600" fill="#38bdf8" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">黏菌生长模拟中 78%</text>

    <!-- Screen 3: 3D Vinyl Preview -->
    <rect x="940" y="220" width="360" height="660" fill="#071829" stroke="#818cf8" stroke-width="3" rx="32"/>
    <text x="1120" y="270" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei" text-anchor="middle">03 · 3D 实体预览</text>
    <circle cx="1120" cy="420" r="120" fill="#020617" stroke="#38bdf8" stroke-width="3"/>
    <circle cx="1120" cy="420" r="50" fill="#1e3a5f"/>
    <rect x="1000" y="680" width="240" height="45" fill="#38bdf8" rx="10"/>
    <text x="1120" y="710" fill="#0a192f" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle" font-weight="bold">定制实体唱片</text>

    <!-- Screen 4: Experiment Record & Delivery -->
    <rect x="1340" y="220" width="360" height="660" fill="#071829" stroke="#a78bfa" stroke-width="3" rx="32"/>
    <text x="1520" y="270" fill="#ffffff" font-size="18" font-family="WenQuanYi Zen Hei" text-anchor="middle">04 · 归档与凭证</text>
    <rect x="1370" y="320" width="300" height="180" fill="#0f2b48" rx="12"/>
    <text x="1520" y="370" fill="#38bdf8" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">生物唱片编号 #0842</text>
    <text x="1520" y="410" fill="#ffffff" font-size="14" font-family="WenQuanYi Zen Hei" text-anchor="middle">减碳贡献: 240g CO₂</text>
    <text x="1520" y="445" fill="#93c5fd" font-size="13" font-family="WenQuanYi Zen Hei" text-anchor="middle">包装：可降解植物种籽纸</text>

    <text x="120" y="955" fill="#3b82f6" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 环保黑胶音乐生物可视化交互全案 · PAGE 03 / 03</text>
  </svg>`,
];

// ============================================================================
// 05 · 数字化生活 · 交互网页设计 / 3D 建模 / 动画
// ============================================================================
const digital3dSvgs = [
  // Page 1: Cover & Project Concept
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg5_1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#180b1e"/>
        <stop offset="50%" stop-color="#2a0f35"/>
        <stop offset="100%" stop-color="#120617"/>
      </linearGradient>
      <linearGradient id="purple5" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#c084fc"/>
        <stop offset="100%" stop-color="#f43f5e"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg5_1)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#581c87" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#c084fc" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 05 INTERACTIVE &amp; 3D · 交互网页与数字概念动画</text>
    <text x="1800" y="140" fill="#c084fc" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">YEAR · 2023</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#581c87" stroke-width="2"/>

    <text x="120" y="270" fill="url(#purple5)" font-size="64" font-family="WenQuanYi Zen Hei" font-weight="bold">数字化生活 · 交互网页设计 / 3D 建模 / 动画</text>
    <text x="120" y="340" fill="#f5d0fe" font-size="34" font-family="WenQuanYi Zen Hei">社交数据枷锁反思 · 层叠报错弹窗微交互 ＆ 赛博囚笼 3D 动画隐喻</text>

    <!-- Overview Box -->
    <rect x="120" y="400" width="1050" height="380" fill="#240e30" rx="16" stroke="#7e22ce" stroke-width="1.5"/>
    <text x="160" y="455" fill="#c084fc" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【概念哲学与批判性交互设计反思】</text>
    <text x="160" y="505" fill="#fdf4ff" font-size="20" font-family="WenQuanYi Zen Hei">学术课题：新媒体艺术与批判性交互研究 ｜ 年份：2023</text>
    <text x="160" y="555" fill="#e879f9" font-size="19" font-family="WenQuanYi Zen Hei">· 现象观察：人们将生活、自尊与情绪格式化为数据，被社交平台的未读红点与点赞数字绑架。</text>
    <text x="160" y="595" fill="#e879f9" font-size="19" font-family="WenQuanYi Zen Hei">· 核心交互机制：设计多层“Error: Click Fix to fix error”弹窗，用户越试图修复，裂变弹窗越疯狂。</text>
    <text x="160" y="635" fill="#e879f9" font-size="19" font-family="WenQuanYi Zen Hei">· 心理暗示：通过无休止的确认、勾选与数字弹窗失控，制造用户在数字枷锁中的无力感与觉醒反思。</text>
    <text x="160" y="675" fill="#e879f9" font-size="19" font-family="WenQuanYi Zen Hei">· 3D 艺术短片：Blender/Cinema 4D 制作概念动画，呈现数字化虚拟肉身被红色数据流吞噬的赛博叙事。</text>

    <!-- Side Tech Stack -->
    <rect x="1210" y="400" width="590" height="380" fill="#1b0825" rx="16" stroke="#7e22ce" stroke-width="1.5"/>
    <text x="1250" y="455" fill="#c084fc" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【创作工具流与表现媒介】</text>

    <text x="1250" y="510" fill="#fdf4ff" font-size="18" font-family="WenQuanYi Zen Hei">· Figma：设计 30+ 页面级高保真微交互与弹窗状态机</text>
    <text x="1250" y="550" fill="#fdf4ff" font-size="18" font-family="WenQuanYi Zen Hei">· Web 交互：React + Tailwind + Web Audio 音效反馈</text>
    <text x="1250" y="590" fill="#fdf4ff" font-size="18" font-family="WenQuanYi Zen Hei">· 3D 建模：Blender 拓扑、布料模拟、粒子数据矩阵</text>
    <text x="1250" y="630" fill="#fdf4ff" font-size="18" font-family="WenQuanYi Zen Hei">· 动画合成：After Effects 故障艺术 (Glitch) 视觉特效</text>
    <text x="1250" y="670" fill="#fdf4ff" font-size="18" font-family="WenQuanYi Zen Hei">· 展出形式：交互式单机展位 + 4K 双屏环绕声概念短片</text>

    <text x="120" y="930" fill="#9333ea" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 数字化生活交互网页与3D动画全案 · PAGE 01 / 03</text>
  </svg>`,

  // Page 2: Cascading Popups & Error Dialog Metaphor
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg5_2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#180b1e"/>
        <stop offset="100%" stop-color="#2a0f35"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg5_2)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#581c87" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#c084fc" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 05 INTERACTIVE &amp; 3D · 裂变弹窗机制与交互线框</text>
    <text x="1800" y="140" fill="#c084fc" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">Error Popups 状态机设计</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#581c87" stroke-width="2"/>

    <!-- Left: Cascading Error Windows Demonstration -->
    <rect x="120" y="210" width="850" height="710" fill="#240e30" rx="16" stroke="#7e22ce" stroke-width="1.5"/>
    <text x="160" y="265" fill="#c084fc" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【多层报错弹窗层叠连锁微交互】</text>

    <!-- Popup 1 (Behind) -->
    <rect x="180" y="310" width="480" height="260" fill="#1a1a24" stroke="#4b5563" stroke-width="2" rx="8"/>
    <rect x="180" y="310" width="480" height="35" fill="#374151" rx="8"/>
    <text x="200" y="334" fill="#9ca3af" font-size="14" font-family="WenQuanYi Zen Hei">Warning 0x8821: Social Memory Overflow</text>

    <!-- Popup 2 (Middle) -->
    <rect x="240" y="380" width="480" height="260" fill="#201128" stroke="#ef4444" stroke-width="2" rx="8"/>
    <rect x="240" y="380" width="480" height="35" fill="#b91c1c" rx="8"/>
    <text x="260" y="404" fill="#ffffff" font-size="14" font-family="WenQuanYi Zen Hei">Fatal: Likes Count Dopamine Drop (-99%)</text>
    <text x="280" y="470" fill="#fca5a5" font-size="16" font-family="WenQuanYi Zen Hei">无法连接现实自我。是否尝试修复？</text>
    <rect x="520" y="550" width="160" height="40" fill="#ef4444" rx="6"/>
    <text x="600" y="575" fill="#ffffff" font-size="15" font-family="WenQuanYi Zen Hei" text-anchor="middle">点击修复 [Fix]</text>

    <!-- Popup 3 (Forefront) -->
    <rect x="320" y="470" width="560" height="300" fill="#180b1e" stroke="#c084fc" stroke-width="3" rx="10"/>
    <rect x="320" y="470" width="560" height="40" fill="#7e22ce" rx="10"/>
    <text x="345" y="497" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" font-weight="bold">System Alert: You Are Trapped In The Feed</text>
    <text x="360" y="560" fill="#f5d0fe" font-size="18" font-family="WenQuanYi Zen Hei">“每点击一次 Fix，就会衍生出 2 个新的弹窗。”</text>
    <text x="360" y="600" fill="#e879f9" font-size="15" font-family="WenQuanYi Zen Hei">现代人越急于在屏幕中确认自我，越深陷数据囚笼。</text>
    <rect x="360" y="670" width="220" height="48" fill="#c084fc" rx="8"/>
    <text x="470" y="700" fill="#180b1e" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle" font-weight="bold">继续沉迷 [Stay]</text>
    <rect x="620" y="670" width="220" height="48" fill="#374151" rx="8"/>
    <text x="730" y="700" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">退出？[权限不足]</text>

    <!-- Right: Behavioral Psychology -->
    <rect x="1000" y="210" width="800" height="710" fill="#240e30" rx="16" stroke="#7e22ce" stroke-width="1.5"/>
    <text x="1040" y="265" fill="#c084fc" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【用户行为心理机制与交互流程图】</text>

    <text x="1040" y="325" fill="#fdf4ff" font-size="18" font-family="WenQuanYi Zen Hei">· 阶段 1：伪装成清新日常的社交浏览界面，诱导用户点赞、评论、刷新。</text>
    <text x="1040" y="375" fill="#fdf4ff" font-size="18" font-family="WenQuanYi Zen Hei">· 阶段 2：第 5 次点击后突发首次报错，伴随轻微音频失真与红点累积。</text>
    <text x="1040" y="425" fill="#fdf4ff" font-size="18" font-family="WenQuanYi Zen Hei">· 阶段 3：用户习惯性点击“关闭/修复”，触发斐波那契级弹窗几何倍增裂变。</text>
    <text x="1040" y="475" fill="#fdf4ff" font-size="18" font-family="WenQuanYi Zen Hei">· 阶段 4：满屏报错覆盖全部视口，系统发出蜂鸣警报，背景逐渐溶解为纯黑。</text>
    <text x="1040" y="525" fill="#fdf4ff" font-size="18" font-family="WenQuanYi Zen Hei">· 阶段 5：最终黑屏中显现一行白色反思小字：“放下手机，抬头看看窗外。”</text>

    <text x="120" y="955" fill="#9333ea" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 数字化生活交互网页与3D动画全案 · PAGE 02 / 03</text>
  </svg>`,

  // Page 3: 3D Scene Modeling & Concept Animation Stills
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg5_3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#180b1e"/>
        <stop offset="100%" stop-color="#2a0f35"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg5_3)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#581c87" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#c084fc" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 05 INTERACTIVE &amp; 3D · 3D场景建模与概念动画</text>
    <text x="1800" y="140" fill="#c084fc" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">Blender 资产渲染 ＆ 动画关键帧</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#581c87" stroke-width="2"/>

    <!-- 3 Keyframe Render Displays -->
    <!-- Frame 1 -->
    <rect x="120" y="220" width="500" height="650" fill="#240e30" rx="16" stroke="#7e22ce" stroke-width="1.5"/>
    <rect x="150" y="250" width="440" height="280" fill="#0f0514" rx="10" stroke="#a855f7"/>
    <circle cx="370" cy="390" r="60" fill="#ef4444"/>
    <text x="370" y="400" fill="#ffffff" font-size="32" font-family="WenQuanYi Zen Hei" text-anchor="middle" font-weight="bold">999+</text>
    <text x="150" y="570" fill="#ffffff" font-size="22" font-family="WenQuanYi Zen Hei" font-weight="bold">场景 01 · 红点母体聚变</text>
    <text x="150" y="610" fill="#e879f9" font-size="16" font-family="WenQuanYi Zen Hei">密集的通知红点在虚空中凝聚为巨大引力球体，不断吞噬周围的个人生活记忆碎片照片。</text>

    <!-- Frame 2 -->
    <rect x="660" y="220" width="500" height="650" fill="#240e30" rx="16" stroke="#7e22ce" stroke-width="1.5"/>
    <rect x="690" y="250" width="440" height="280" fill="#0f0514" rx="10" stroke="#a855f7"/>
    <!-- Wireframe Humanoid Trapped -->
    <rect x="850" y="300" width="120" height="180" fill="none" stroke="#c084fc" stroke-width="3"/>
    <line x1="850" y1="360" x2="970" y2="360" stroke="#ef4444" stroke-width="2"/>
    <line x1="850" y1="420" x2="970" y2="420" stroke="#ef4444" stroke-width="2"/>
    <text x="690" y="570" fill="#ffffff" font-size="22" font-family="WenQuanYi Zen Hei" font-weight="bold">场景 02 · 赛博数据牢笼</text>
    <text x="690" y="610" fill="#e879f9" font-size="16" font-family="WenQuanYi Zen Hei">三维人体模型被半透明发光屏幕矩阵栅栏牢牢锁住，双手做出无限向上滑动的机械抽搐动效。</text>

    <!-- Frame 3 -->
    <rect x="1200" y="220" width="500" height="650" fill="#240e30" rx="16" stroke="#7e22ce" stroke-width="1.5"/>
    <rect x="1230" y="250" width="440" height="280" fill="#0f0514" rx="10" stroke="#a855f7"/>
    <!-- Dissolving into white -->
    <circle cx="1450" cy="390" r="80" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="8 8"/>
    <text x="1230" y="570" fill="#ffffff" font-size="22" font-family="WenQuanYi Zen Hei" font-weight="bold">场景 03 · 格式化觉醒与瓦解</text>
    <text x="1230" y="610" fill="#e879f9" font-size="16" font-family="WenQuanYi Zen Hei">屏幕碎片随粒子重力彻底破碎，刺目的白色日光透入，象征从虚妄网络狂热中重获清醒真实。</text>

    <text x="120" y="955" fill="#9333ea" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 数字化生活交互网页与3D动画全案 · PAGE 03 / 03</text>
  </svg>`,
];

// ============================================================================
// 06 · 遗忘的避风港 · 3D 建模 / TouchDesigner
// ============================================================================
const forgotten3dSvgs = [
  // Page 1: Cover & Project Concept
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg6_1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#141109"/>
        <stop offset="50%" stop-color="#241e10"/>
        <stop offset="100%" stop-color="#0f0d06"/>
      </linearGradient>
      <linearGradient id="amber6" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#f97316"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg6_1)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#5c4415" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#fbbf24" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 06 3D &amp; TOUCHDESIGNER · 空间叙事与点云生成艺术</text>
    <text x="1800" y="140" fill="#fbbf24" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">YEAR · 2023</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#5c4415" stroke-width="2"/>

    <text x="120" y="270" fill="url(#amber6)" font-size="64" font-family="WenQuanYi Zen Hei" font-weight="bold">遗忘的避风港 · 3D 建模 / TouchDesigner</text>
    <text x="120" y="340" fill="#fef3c7" font-size="34" font-family="WenQuanYi Zen Hei">破败小旧社区记忆 · 三维激光点云扫描 ＆ 参数化动态粒子流体沉浸装置</text>

    <!-- Overview Box -->
    <rect x="120" y="400" width="1050" height="380" fill="#201a0d" rx="16" stroke="#b45309" stroke-width="1.5"/>
    <text x="160" y="455" fill="#fbbf24" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【创作背景与城市空间叙事】</text>
    <text x="160" y="505" fill="#fffbeb" font-size="20" font-family="WenQuanYi Zen Hei">创作主题：城市更新中的个体记忆留存 ｜ 创作年份：2023</text>
    <text x="160" y="555" fill="#fde68a" font-size="19" font-family="WenQuanYi Zen Hei">· 在摩天高楼林立的现代都市夹缝中，破败的小旧社区承载着几代人温存的生活记忆与人间烟火。</text>
    <text x="160" y="595" fill="#fde68a" font-size="19" font-family="WenQuanYi Zen Hei">· 拆迁推土机的轰鸣打破了安宁。伫立于瓦砾废墟前，晾晒的衣裳、斑驳的砖墙在脑海如梦境般闪现。</text>
    <text x="160" y="635" fill="#fde68a" font-size="19" font-family="WenQuanYi Zen Hei">· 利用三维激光激光雷达点云（LiDAR）实地扫描旧巷弄，采集超过 12,000,000+ 空间三维空间坐标点。</text>
    <text x="160" y="675" fill="#fde68a" font-size="19" font-family="WenQuanYi Zen Hei">· 导入 TouchDesigner 构建参数化粒子力场，模拟记忆粒子在风中消散、重聚与流转的诗意视听艺术。</text>

    <!-- Side Specs -->
    <rect x="1210" y="400" width="590" height="380" fill="#181308" rx="16" stroke="#b45309" stroke-width="1.5"/>
    <text x="1250" y="455" fill="#fbbf24" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【核心技术与艺术表现参数】</text>

    <text x="1250" y="510" fill="#fffbeb" font-size="18" font-family="WenQuanYi Zen Hei">· 采集设备：高精度手持三维激光激光雷达扫描仪</text>
    <text x="1250" y="550" fill="#fffbeb" font-size="18" font-family="WenQuanYi Zen Hei">· 数据规格：.LAS / .PLY 格式点云数据，带原色 RGB 反射率</text>
    <text x="1250" y="590" fill="#fffbeb" font-size="18" font-family="WenQuanYi Zen Hei">· 渲染引擎：TouchDesigner GPU 点云渲染着色器 (GLSL)</text>
    <text x="1250" y="630" fill="#fffbeb" font-size="18" font-family="WenQuanYi Zen Hei">· 粒子算法：Curl Noise 卷曲噪波场 + 万有引力吸引子</text>
    <text x="1250" y="670" fill="#fffbeb" font-size="18" font-family="WenQuanYi Zen Hei">· 视听同步：实地环境声音录音（自行车铃、鸟鸣、风声）驱动粒子</text>

    <text x="120" y="930" fill="#d97706" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 遗忘的避风港3D与TOUCHDESIGNER全案 · PAGE 01 / 03</text>
  </svg>`,

  // Page 2: LiDAR Point Cloud Scan & Site Documentation
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg6_2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#141109"/>
        <stop offset="100%" stop-color="#241e10"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg6_2)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#5c4415" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#fbbf24" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 06 3D &amp; TOUCHDESIGNER · 实地三维激光点云扫描</text>
    <text x="1800" y="140" fill="#fbbf24" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">LiDAR 数据重建 ＆ 空间几何解构</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#5c4415" stroke-width="2"/>

    <!-- Left: Point Cloud Wireframe Diagram -->
    <rect x="120" y="210" width="820" height="710" fill="#201a0d" rx="16" stroke="#b45309" stroke-width="1.5"/>
    <text x="160" y="265" fill="#fbbf24" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【旧社区空间三维激光点云实景重建】</text>

    <!-- Point cloud simulation grid -->
    <rect x="160" y="300" width="740" height="380" fill="#0d0b06" rx="12" stroke="#5c4415"/>
    <!-- Building wireframe dots -->
    <rect x="220" y="380" width="220" height="240" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 6"/>
    <rect x="480" y="340" width="360" height="280" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="4 6"/>
    <text x="330" y="510" fill="#fbbf24" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">阳台晾晒生活区 (85万点)</text>
    <text x="660" y="490" fill="#f97316" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">弄堂入口与剥落砖墙 (320万点)</text>

    <text x="160" y="730" fill="#fde68a" font-size="18" font-family="WenQuanYi Zen Hei">· 扫描定位精度：±2mm，完整保留老旧阳台防盗网、水表、电线缠绕等时光痕迹。</text>
    <text x="160" y="770" fill="#fde68a" font-size="18" font-family="WenQuanYi Zen Hei">· 点云色彩赋予：将现场拍摄的 4K 照片投影回三维点云模型，赋予真实时代质感色彩。</text>

    <!-- Right: Field Research Notes -->
    <rect x="970" y="210" width="830" height="710" fill="#201a0d" rx="16" stroke="#b45309" stroke-width="1.5"/>
    <text x="1010" y="265" fill="#fbbf24" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【田野考察记录与情感空间坐标】</text>

    <rect x="1010" y="300" width="750" height="120" fill="#141109" rx="10" stroke="#3d2d0f"/>
    <text x="1040" y="345" fill="#fbbf24" font-size="20" font-family="WenQuanYi Zen Hei" font-weight="bold">空间坐标 01 · 弄堂深处的槐树下</text>
    <text x="1040" y="385" fill="#fde68a" font-size="16" font-family="WenQuanYi Zen Hei">盛夏时分居民下棋纳凉处，斑驳树影与欢声笑语，如今唯剩半截树桩与碎砖。</text>

    <rect x="1010" y="440" width="750" height="120" fill="#141109" rx="10" stroke="#3d2d0f"/>
    <text x="1040" y="485" fill="#fbbf24" font-size="20" font-family="WenQuanYi Zen Hei" font-weight="bold">空间坐标 02 · 二楼东侧公用灶披间</text>
    <text x="1040" y="525" fill="#fde68a" font-size="16" font-family="WenQuanYi Zen Hei">四家合用的狭长厨房，泛黑的瓷砖记录着数十万顿烟火饭香，烟火气凝固成灰烬。</text>

    <rect x="1010" y="580" width="750" height="120" fill="#141109" rx="10" stroke="#3d2d0f"/>
    <text x="1040" y="625" fill="#fbbf24" font-size="20" font-family="WenQuanYi Zen Hei" font-weight="bold">空间坐标 03 · 废墟前的红色“拆”字墙</text>
    <text x="1040" y="665" fill="#fde68a" font-size="16" font-family="WenQuanYi Zen Hei">巨大的白圈红字宣告旧时光的落幕，成为现代都市巨变中最具冲击力的历史注脚。</text>

    <text x="120" y="955" fill="#d97706" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 遗忘的避风港3D与TOUCHDESIGNER全案 · PAGE 02 / 03</text>
  </svg>`,

  // Page 3: TouchDesigner Node Network & Generative Particles
  `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg6_3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#141109"/>
        <stop offset="100%" stop-color="#241e10"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg6_3)"/>
    <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#5c4415" stroke-width="2" rx="16"/>

    <text x="120" y="140" fill="#fbbf24" font-size="20" font-family="WenQuanYi Zen Hei" letter-spacing="4">PORTFOLIO · 06 3D &amp; TOUCHDESIGNER · 节点网络与动态视听装置</text>
    <text x="1800" y="140" fill="#fbbf24" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="end">TouchDesigner 拓扑 ＆ 粒子场驱动</text>
    <line x1="120" y1="170" x2="1800" y2="170" stroke="#5c4415" stroke-width="2"/>

    <!-- Left: TD Node Graph Topology -->
    <rect x="120" y="210" width="900" height="710" fill="#201a0d" rx="16" stroke="#b45309" stroke-width="1.5"/>
    <text x="160" y="265" fill="#fbbf24" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【TouchDesigner 核心节点流拓扑网络】</text>

    <!-- Node 1: Point File In -->
    <rect x="160" y="320" width="180" height="70" fill="#0284c7" rx="8"/>
    <text x="250" y="362" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">pointFileIn1 (SOP)</text>

    <line x1="340" y1="355" x2="410" y2="355" stroke="#fbbf24" stroke-width="3"/>

    <!-- Node 2: Point GPU -->
    <rect x="410" y="320" width="180" height="70" fill="#7c3aed" rx="8"/>
    <text x="500" y="362" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">pointGpu1 (TOP)</text>

    <line x1="590" y1="355" x2="660" y2="355" stroke="#fbbf24" stroke-width="3"/>

    <!-- Node 3: Feedback Noise -->
    <rect x="660" y="320" width="180" height="70" fill="#ea580c" rx="8"/>
    <text x="750" y="362" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">curlNoise (GLSL)</text>

    <!-- Audio React Branch -->
    <rect x="410" y="440" width="180" height="70" fill="#16a34a" rx="8"/>
    <text x="500" y="482" fill="#ffffff" font-size="16" font-family="WenQuanYi Zen Hei" text-anchor="middle">audioIn1 (CHOP)</text>
    <line x1="590" y1="475" x2="750" y2="390" stroke="#16a34a" stroke-width="3" stroke-dasharray="6 4"/>

    <!-- Output Render -->
    <rect x="410" y="560" width="430" height="80" fill="#b45309" rx="8"/>
    <text x="625" y="608" fill="#ffffff" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="middle" font-weight="bold">render1 -> out1 (4K 60FPS Ultra HD)</text>

    <text x="160" y="700" fill="#fde68a" font-size="18" font-family="WenQuanYi Zen Hei">· 性能优化：全流程基于 Compute Shader GPU 加速，支持 1000 万粒子稳定 60 FPS 实时渲染。</text>
    <text x="160" y="740" fill="#fde68a" font-size="18" font-family="WenQuanYi Zen Hei">· 粒子生命周期系统：随音乐低音释放，实体建筑点云瓦解为飞扬火花，尾声聚合成宁静星云。</text>

    <!-- Right: Exhibition Visual Experience -->
    <rect x="1050" y="210" width="750" height="710" fill="#201a0d" rx="16" stroke="#b45309" stroke-width="1.5"/>
    <text x="1090" y="265" fill="#fbbf24" font-size="24" font-family="WenQuanYi Zen Hei" font-weight="bold">【沉浸式三维视听空间艺术装置展陈】</text>

    <!-- Projection Room Mockup -->
    <rect x="1090" y="310" width="670" height="270" fill="#0d0b06" rx="12" stroke="#5c4415"/>
    <polygon points="1120,540 1200,350 1650,350 1730,540" fill="#1a1407" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="1425" y="450" fill="#fbbf24" font-size="20" font-family="WenQuanYi Zen Hei" text-anchor="middle">3 面环抱式投影沉浸暗房 (5.1 环绕声)</text>
    <circle cx="1425" cy="510" r="14" fill="#ffffff"/>
    <text x="1425" y="535" fill="#ffffff" font-size="12" font-family="WenQuanYi Zen Hei" text-anchor="middle">观察者视点</text>

    <text x="1090" y="630" fill="#fde68a" font-size="19" font-family="WenQuanYi Zen Hei" font-weight="bold">装置展出反思与情感共鸣：</text>
    <text x="1090" y="670" fill="#fde68a" font-size="18" font-family="WenQuanYi Zen Hei">· 观众步入暗房，红外雷达感应观众脚步，脚步临近之处点云粒子向外轻轻荡漾。</text>
    <text x="1090" y="710" fill="#fde68a" font-size="18" font-family="WenQuanYi Zen Hei">· 唤起对故乡、拆迁、成长历程与时间不可逆性的深层哲学反思与集体情感共鸣。</text>

    <text x="120" y="955" fill="#d97706" font-size="16" font-family="WenQuanYi Zen Hei">DESIGN BY LYKKE · 遗忘的避风港3D与TOUCHDESIGNER全案 · PAGE 03 / 03</text>
  </svg>`,
];

async function main() {
  const publicDir = path.resolve('public');
  console.log('Building portfolio PDF documents...');

  // 02: 包装.pdf
  await createPdfFromSvgs(taikangSvgs, path.join(publicDir, '包装.pdf'));

  // 03: 导视.pdf
  await createPdfFromSvgs(yisheSvgs, path.join(publicDir, '导视.pdf'));

  // 04: 交互.pdf
  await createPdfFromSvgs(vinylSvgs, path.join(publicDir, '交互.pdf'));

  // 05: 交互-3D.pdf
  await createPdfFromSvgs(digital3dSvgs, path.join(publicDir, '交互-3D.pdf'));

  // 06: 3D.pdf
  await createPdfFromSvgs(forgotten3dSvgs, path.join(publicDir, '3D.pdf'));

  console.log('All 5 custom distinct portfolio PDFs generated successfully!');
}

main().catch((err) => {
  console.error('Error generating PDFs:', err);
  process.exit(1);
});
