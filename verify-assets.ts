import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AssetCategory {
  category: string;
  dir: string;
  files: string[];
}

const REQUIRED_ASSETS: AssetCategory[] = [
  {
    category: '首页背景视频 (Videos)',
    dir: 'public/videos/shouye.mp4',
    files: ['public/videos/shouye.mp4'],
  },
  {
    category: '首页、学术与项目照片 (Personal & Academic Images)',
    dir: 'public/images',
    files: [
      'public/images/I.png', // 首页照片
      'public/images/nanan1.jpg', // 研究生第1张
      'Ipublic/images/nanan2.jpg', // 研究生第2张
      'public/images/nanan3.jpg', // 研究生第3张
      'public/images/hugong.jpg', // 本科照片
      'public/images/xiangmu1.jpg', // 项目经历第1张
      'public/images/xiangmu2.jpg', // 项目经历第2张
      'public/images/xiangmu3.jpg', // 项目经历第3张
    ],
  },
  {
    category: '设计作品集图片 (Portfolio Images)',
    dir: 'public/images',
    files: [
      'DL_Leaflet_Grid_1 1.png', // 楚风香茗 • 品牌VI设计
      '茶饼5.png', // 泰康保险集团茶礼 • 包装设计
      'Frame 14.png', // 艺设走廊 • 导视系统设计
      '二-2.png', // 环保黑胶 • 网页/交互设计
      '截图8 1.png', // 数字化生活 • 交互网页/3D建模/动画
      '截屏2026-10-08 17.51.53.png', // 遗忘的避风港 • 3D建模 / TouchDesigner
    ],
  },
  {
    category: '设计作品集跳转文档 (Portfolio Documents)',
    dir: 'public/documents',
    files: [
      '品牌VI.pdf',
      '包装.pdf',
      '导视.pdf',
      '交互.pdf',
      '交互-3D.pdf',
      '3D.pdf',
    ],
  },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function verifyAssets(): boolean {
  console.log('\n========================================================');
  console.log('🔍 开始执行全站静态媒体资产完整性校验 (verify-assets)...');
  console.log('========================================================\n');

  let totalFiles = 0;
  let missingFiles: string[] = [];
  let emptyFiles: string[] = [];

  for (const group of REQUIRED_ASSETS) {
    console.log(`📁 【${group.category}】: 目标目录 -> ${group.dir}/`);
    const fullDirPath = path.resolve(__dirname, group.dir);

    if (!fs.existsSync(fullDirPath)) {
      console.warn(`  ⚠️  [警告] 目录不存在: ${group.dir}/`);
      missingFiles.push(...group.files.map((f) => path.join(group.dir, f)));
      continue;
    }

    for (const fileName of group.files) {
      totalFiles++;
      const filePath = path.join(fullDirPath, fileName);
      const relativePath = path.join(group.dir, fileName);

      if (!fs.existsSync(filePath)) {
        console.warn(`  ❌ [缺失] ${fileName} (路径: ${relativePath})`);
        missingFiles.push(relativePath);
      } else {
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
          console.warn(`  ⚠️  [空文件] ${fileName} 大小为 0 字节 (路径: ${relativePath})`);
          emptyFiles.push(relativePath);
        } else {
          console.log(`  ✅ [存在] ${fileName} (${formatBytes(stats.size)})`);
        }
      }
    }
    console.log('');
  }

  console.log('========================================================');
  console.log(`📊 校验总结: 共检查 ${totalFiles} 个关键核心文件`);

  if (missingFiles.length === 0 && emptyFiles.length === 0) {
    console.log('🎉 校验全部通过！所有必需的物理视频、图片及 PDF 文件均完整存在且有效。');
    console.log('========================================================\n');
    return true;
  } else {
    if (missingFiles.length > 0) {
      console.warn('\n⚠️ [警告] 检测到以下必要物理文件缺失:');
      missingFiles.forEach((file) => console.warn(`   - ${file}`));
    }
    if (emptyFiles.length > 0) {
      console.warn('\n⚠️ [警告] 检测到以下物理文件内容为空 (0 字节):');
      emptyFiles.forEach((file) => console.warn(`   - ${file}`));
    }
    console.warn('\n⚠️ 请在执行 npm run build 前补充上述文件，以防生产环境资源加载失败！');
    console.log('========================================================\n');
    return false;
  }
}

const isSuccess = verifyAssets();
if (!isSuccess) {
  process.exitCode = 1;
}
