import { Language } from '../types';

export interface LocalizedResumeData {
  personal: {
    name: string;
    roles: string;
    location: string;
    phone: string;
    email: string;
    status: string;
    summary: string;
    heroMedia?: {
      videoUrl: string;
      avatarUrl: string;
    };
  };
  education: Array<{
    id: string;
    school: string;
    degree: string;
    major: string;
    period: string;
    gpa?: string;
    coursesLabel: string;
    courses: string[];
    images?: string[];
    image?: string;
  }>;
  internships: Array<{
    id: string;
    company: string;
    role: string;
    period: string;
    tag: string;
    bullets: string[];
    skills: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    role: string;
    period: string;
    tag: string;
    summary: string;
    bullets: string[];
    deliverables: string[];
  }>;
  portfolio?: Array<{
    id: string;
    iconType: 'package1' | 'package2' | 'signage' | 'vinyl' | 'popup' | 'building';
    category: string;
    direction: string;
    title: string;
    client: string;
    year: string;
    summary: string;
    details: string[];
    tags: string[];
    image: string;
    pages?: string[];
  }>;
  socialMedia: {
    platform: string;
    role: string;
    period: string;
    summary: string;
    metrics: Array<{
      label: string;
      value: string;
      subtext: string;
    }>;
    bullets: string[];
  };
  skills: Array<{
    category: string;
    items: string;
  }>;
  awards: Array<{
    id: string;
    year: string;
    title: string;
    level: string;
  }>;
  contact: {
    title: string;
    subtitle: string;
    phoneLabel: string;
    emailLabel: string;
    locationLabel: string;
    statusLabel: string;
    copiedText: string;
    copyPrompt: string;
  };
}

export const RESUME_CONTENT: Record<Language, LocalizedResumeData> = {
  zh: {
    personal: {
      name: '李珂 Lykke',
      roles: '数字媒体硕士 / 视觉传达本科 ｜ 品牌AE项目控场与社媒运营',
      location: '上海',
      phone: '17871741095',
      email: '42llykke@gmail.com',
      status: '求职意向 · 随时可沟通',
      summary:
        '数字媒体硕士 / 视觉传达本科。兼具品牌AE项目控场与社媒（抖音/小红书）运营经验。既能精准对接客户需求、统筹预算与供应商高效推进项目落地；又擅长以视觉创意驱动内容策划与数据优化。',
      heroMedia: {
        videoUrl: "/videos/shouye.mp4",
        avatarUrl: "/images/I.png",
      },
    },
    education: [
      {
        id: 'edu-southampton',
        school: '南安普顿大学',
        degree: '硕士在读',
        major: '数字媒体',
        period: '2025.09 – 2026.12（预计）',
        coursesLabel: '主修课程',
        courses: ['数字媒体', '媒体研究与方法论', '批判性媒体实践'],
        images: ["/images/nanan1.jpg", "/images/nanan2.jpg", "/images/nanan3.jpg"],
      },
      {
        id: 'edu-hbut',
        school: '湖北工业大学',
        degree: '本科',
        major: '视觉传达设计',
        period: '2021.09 – 2025.06',
        gpa: '88.15 / 100',
        coursesLabel: '主修课程',
        courses: ['广告策划设计', '品牌设计'],
        image: "/images/hugong.jpg",
      },
    ],
    internships: [
      {
        id: 'intern-ymjr',
        company: '一鸣惊人文化传播有限公司',
        role: '个人设计组实习生 ｜ 品牌项目执行',
        period: '2026.7 – 至今',
        tag: '个人设计组实习生 · 品牌项目执行',
        bullets: [
          '梳理客户需求及老板创意方向，完成策划案提案，支撑方案沟通、呈现及项目推进。',
          '开展 KOL 及社交媒体账号调研，整理账号、内容与合作信息并制作 PPT 汇报材料。',
          '使用 Excel 进行项目排期、任务拆解与进度跟进，协调设计师、供应商及宣传物料制作。',
          '负责宣传物料需求整理、询价及供应商沟通，跟进物料制作与交付。',
        ],
        skills: ['客户需求沟通', '策划案提案', '项目排期', 'KOL调研', '物料协调与供应商沟通'],
      },
      {
        id: 'intern-tr',
        company: '武汉茼仁电子商务有限公司',
        role: '视觉设计实习生',
        period: '2023.06 – 2023.09',
        tag: '视觉设计 · 企业文化宣传',
        bullets: [
          '参与企业文化相关内容的视觉呈现，完成文化墙及配套宣传物料设计。',
          '协助整理与优化品牌视觉素材，支持企业文化内容的视觉传播。',
        ],
        skills: ['企业文化墙设计', '配套宣传物料设计', '品牌视觉素材整理与优化'],
      },
    ],
    projects: [
      {
        id: 'proj-taikoo-li',
        title: '北京太古坊 ｜ 竹林酒堂品牌活动',
        role: '项目执行实习生',
        period: '2026.7 – 2026.9',
        tag: '线下品牌活动 · 现场全流程统筹',
        summary:
          '北京太古坊竹林酒堂大型品牌活动现场全流程统筹执行，涵盖前期设计与排期建立、客户预算沟通、KOL调研与供应链比价采购，以及20+受邀品牌账目核对结算。',
        bullets: [
          '项目前期统筹：拆解创意、平面/3D设计、方案报审定稿、施工图、打样、物料制作、预搭建、运输核查、现场搭建及宣传运营等节点，建立项目排期。',
          '客户与预算：参与客户预算沟通，在预算不足时协同调整活动机制、执行步骤及物料配置，推动方案与预算同步优化。',
          '传播与供应链：调研适配活动定位的 KOL/博主并形成汇报；对接多家工厂询价、比对制作成本，整理采购表，协调椅子、冰柜等设备租赁。',
          '项目收尾：参与 20+ 家受邀酒馆及酒吧品牌的账目核对与结算信息整理。',
        ],
        deliverables: ['活动各节点全流程排期表', '供应商比价与物料设备采购表', '20+酒馆品牌结算对账清单'],
      },
    ],
    portfolio: [
      {
        id: 'work-vi-chufeng',
        iconType: 'package1',
        category: '品牌VI设计',
        direction: '湖北本土茶品牌与武当太极结合 · 完整VI系统设计',
        title: '楚风香茗 · 湖北茶品牌VI设计',
        client: '楚风香茗茶业',
        year: '2024',
        summary: '以武当太极与茶道结合为核心理念，茶壶冒出的热气渐变过渡如烟雾与茶叶之梗。全案涵盖标志网格制图、标准色（#4F6A3D、#F6E9C5、#1B1F22）、辅助图形、产品包装袋/盒、户外广告展板及全套品牌VI手册规范。',
        details: [
          '标志演变于武当太极，中文全称运用钢笔造字法，体现人与自然产物相互依存。',
          '严格规范标志组合关系、最小使用尺寸（10mm）、辅助色（#A6AA54、#78AA8B）与组合错误范例。',
          '输出全套茶杯、信封手提袋、包装铁罐、茶叶礼盒、户外大牌及折页宣传规范。',
        ],
        tags: ['品牌VI设计', '标志造字', '标准色规范', '包装延展', '辅助图形'],
        image: '/images/dl_leaflet_grid_1.png',
        pages: ['/images/dl_leaflet_grid_1.png'],
      },
      {
        id: 'work-package-taikang',
        iconType: 'package2',
        category: '包装设计',
        direction: '面向当代年轻群体的茶礼包装全案 · 五福理念',
        title: '泰康保险集团茶礼 · 包装设计（茶锦福运）',
        client: '泰康保险集团',
        year: '2024',
        summary: '结合泰康集团理念选用“五福”为核心设计语言，面向当代年轻人提炼现代人的五福（好身体-鹤瘦松青、好年轻-白齿青眉、好事业-青云直上、好心情-春风拂面、好运气-白鱼入舟），完成普洱茶饼与外包装礼盒全案。',
        details: [
          '字体采用传统书法绘制并加重笔画，厚重清晰大气；灵感提取泰康蝴蝶元素、北京天坛与泰康大厦。',
          '茶饼包装参考中国传统国色（玉色 #3A6D55、青色 #BCCBB8、白色 #E5C7C7、橙色 #DCCCB2）。',
          '完成五福理念专属标志设计、包装盒平面图、结构刀模及抽拉式硬质天地盖礼盒打样。',
        ],
        tags: ['包装设计', '书法字体', '茶饼包装', '五福概念', '结构展开'],
        image: '/images/茶饼5.png',
      },
      {
        id: 'work-signage-yishe',
        iconType: 'signage',
        category: '导视系统设计',
        direction: '空间高效定位与美学统一 · 建筑走廊导视与展板',
        title: '艺设走廊 · 导视系统设计',
        client: '艺术设计学院',
        year: '2023',
        summary: '充分考量使用者行为路径，旨在帮助用户不依赖外部帮助快速定位与导航。视觉主色选用饱满红色系（#EC5B3C），结合柔和辅助色（#D9D9D9、#F7A8DF、#4D4D4D、#DBF2FF），构建强烈的视觉焦点与高效美学统一。',
        details: [
          '设计立式导视牌（高度 170-230cm）、悬挂导向牌、贴墙科室标牌与多功能展板系统。',
          '规范消防栓、饮水机、卫生间、办公室、垃圾桶及方向等完整象形图标与立体楼号字形（0-9）。',
          '实地落地安装于教学楼走廊拐角、班级门牌（如 A 301）与长廊公共展示区。',
        ],
        tags: ['导视系统设计', '空间导向', '环境图形', '图标设计', '展板规范'],
        image: '/images/Frame 14.png',
      },
      {
        id: 'work-web-vinyl',
        iconType: 'vinyl',
        category: '网页 / 交互设计',
        direction: '音乐与生物结合 · 音乐振动影响黏菌轨迹定制生物唱片',
        title: '环保黑胶 · 音乐生物可视化 · 手机网页设计 / 交互设计',
        client: '声音生物实验室',
        year: '2023',
        summary: '通过音乐振动影响黏菌的生长轨迹产生每首歌独特的视觉图案，通过手机网页定制专属生物唱片。使用环保生物塑料代替传统PVC制作黑胶唱片模型，倡导可持续发展理念。',
        details: [
          '研究不同音乐风格（民谣、funk、电子音乐、R&B、爵士）振幅与黏菌微观形态生长的对话关系。',
          '包含生物材料4步制作工序（过期牛奶加热混合白醋、过滤水分、加入颜色、模具烘烤成型贴纸）。',
          '完成移动端完整交互原型：开屏、音乐上传、视觉展示、实验过程查看、定制地址填写及实验记录。',
        ],
        tags: ['网页 / 交互设计', '声音可视化', '黏菌实验', '环保生物塑料', '移动端原型'],
        image: '/images/二-2.png',
      },
      {
        id: 'work-web-3d-digital',
        iconType: 'popup',
        category: '交互网页 / 3D 建模 / 动画',
        direction: '社交数据枷锁反思 · 交互网页与层叠报错弹窗Error动画',
        title: '数字化生活 · 交互网页设计 / 3D 建模 / 动画',
        client: '新媒体艺术研究',
        year: '2023',
        summary: '人们将拍照与发帖的行为格式化，沉溺于社交平台的不断刷新循环，被红色数字串操纵着自我套入数据枷锁。通过交互网页设计、Figma低保真流程与3D建模动画呈现多层“Error - Click Fix to fix error”弹窗层叠失控的视觉隐喻。',
        details: [
          '设计多层 Windows/网页报错弹窗连锁触发微交互，点击按钮产生不断裂变弹窗的交互张力。',
          '构建完整 Figma 交互流转图与低保真框架，探索社交沉迷心理机制。',
          'Blender/C4D 3D建模制作概念动画，呈现被红点与数字包围的数字化现代人精神困境。',
        ],
        tags: ['交互网页', '3D 建模', '概念动画', '报错弹窗', '社交隐喻'],
        image: '/images/截图81.png',
      },
      {
        id: 'work-3d-touchdesigner',
        iconType: 'building',
        category: '3D 建模 / TouchDesigner',
        direction: '破败小旧社区记忆 · 三维点云扫描与动态粒子运动效果',
        title: '遗忘的避风港 · 3D 建模 / TouchDesigner',
        client: '城市记忆与空间叙事实验',
        year: '2023',
        summary: '在高楼林立间，破败的小旧社区藏着温暖与被遗忘的故事。拆迁打破了宁静，伫立废墟前记忆如梦境涌现。将实地考察照片与三维激光点云扫描模型导入 TouchDesigner 进行动态粒子运动艺术处理，唤起归属感与温存时光。',
        details: [
          '实地三维扫描旧社区巷弄、阳台晾晒短袖与废墟建筑结构，获取高精度点云数据。',
          '利用 TouchDesigner 构建参数化粒子流体系统，模拟记忆碎片消散与重组的视听效果。',
          '输出三维点云动态漫游视频与空间渲染装置方案，达成具有沉浸感与哲学反思的艺术表达。',
        ],
        tags: ['3D 建模', 'TouchDesigner', '点云扫描', '动态粒子', '空间建筑叙事'],
        image: '/images/避风港.png',
      },
    ],
    socialMedia: {
      platform: '抖音 & 小红书',
      role: '个人账号',
      period: '2023.01 – 至今',
      summary:
        '独立运营账号，负责内容策划、拍摄、发布与数据复盘。抖音累计1.2万+粉丝，单条最高254.7万播放、12万+点赞；小红书主打生活及穿搭内容，单篇最高3万+浏览、800+点赞。',
      metrics: [
        { label: '抖音粉丝', value: '1.2万+', subtext: '真实自然沉淀' },
        { label: '单条最高播放', value: '254.7万', subtext: '12万+点赞 · 5.8万+分享' },
        { label: '200万+播放内容', value: '2条', subtext: '2条内容播放量超过200万' },
        { label: '小红书单篇最高', value: '3万+浏览', subtext: '生活及穿搭 · 800+点赞' },
      ],
      bullets: [
        '独立运营账号，负责内容策划、拍摄、发布与数据复盘。',
        '抖音：1.2万+粉丝；单条最高254.7万播放、12万+点赞、5.8万+分享；2条内容播放量超过200万。',
        '小红书：生活及穿搭内容，单篇最高3万+浏览、800+点赞。',
      ],
    },
    skills: [
      {
        category: '品牌与项目执行',
        items: '客户需求沟通、策划案提案、项目排期、任务跟进、KOL调研、物料协调、供应商沟通',
      },
      {
        category: '社交媒体与内容',
        items: '抖音、小红书运营、内容策划、短视频制作、数据复盘',
      },
      {
        category: '工具',
        items: 'PowerPoint、Excel、Figma、PS、AI、AE、ID、剪映、blender、TouchDesigner',
      },
      {
        category: 'AI 应用能力',
        items: '熟练运用 ChatGPT、Gemini（AI Studio）、Codex、Midjourney 将生成式 AI 融入客户执行、策划提案、视觉设计及前端开发流程：使用 ChatGPT 辅助客户需求梳理与策划案提案；使用 Gemini（AI Studio）独立完成个人作品集网站从视觉设计、交互开发到部署上线的全流程，掌握 AI 驱动的前端开发；使用 Codex 辅助代码生成、功能实现及调试迭代；使用 Midjourney 快速生成场地设计效果图与空间视觉方案，提升创意验证与视觉提案效率',
      },
      {
        category: '视觉与传播',
        items: '广告创意、品牌视觉、信息视觉呈现',
      },
      {
        category: '语言',
        items: '英语（IELTS 6.5）',
      },
    ],
    awards: [
      {
        id: 'award-2025',
        year: '2025',
        title: '未来设计师大赛',
        level: '湖北省一等奖',
      },
      {
        id: 'award-2022',
        year: '2022',
        title: '中国大学生广告艺术节学院奖',
        level: '平面设计类优秀奖',
      },
    ],
    contact: {
      title: '联系方式',
      subtitle: '期待与您进一步沟通交流',
      phoneLabel: '电话',
      emailLabel: '邮箱',
      locationLabel: '所在城市',
      statusLabel: '求职状态',
      copiedText: '已复制',
      copyPrompt: '点击复制',
    },
  },
  en: {
    personal: {
      name: 'Lykke Li',
      roles: 'MA in Digital Media / BA in Visual Communication · Brand AE & Social Media',
      location: 'Shanghai',
      phone: '+86 17871741095',
      email: '42llykke@gmail.com',
      status: 'Open for Opportunities',
      summary:
        'MA in Digital Media / BA in Visual Communication. Experienced in brand AE project control and social media (Douyin/RED) operations. Adept at interfacing with client needs, coordinating budgets and vendors for on-time delivery, and driving content strategy and data optimization with visual creativity.',
      heroMedia: {
        videoUrl: "/videos/shouye.mp4",
        avatarUrl: "/images/I.png",
      },
    },
    education: [
      {
        id: 'edu-southampton',
        school: 'University of Southampton',
        degree: "Master's Degree",
        major: 'Digital Media',
        period: '2025.09 – 2026.12 (Expected)',
        coursesLabel: 'Main Courses',
        courses: ['Digital Media', 'Media Research & Methodologies', 'Critical Media Practice'],
        images: ["/images/nanan1.jpg", "/images/nanan2.jpg", "/images/nanan3.jpg"],
      },
      {
        id: 'edu-hbut',
        school: 'Hubei University of Technology',
        degree: "Bachelor's Degree",
        major: 'Visual Communication Design',
        period: '2021.09 – 2025.06',
        gpa: '88.15 / 100',
        coursesLabel: 'Main Courses',
        courses: ['Advertising Planning & Design', 'Brand Design'],
        image: "/images/hugong.jpg",
      },
    ],
    internships: [
      {
        id: 'intern-ymjr',
        company: 'Yiming Jingren Culture Communication Co., Ltd.',
        role: 'Design Group Intern | Brand Project Execution',
        period: '2026.7 – Present',
        tag: 'Design Group Intern · Brand Project Execution',
        bullets: [
          'Synthesized client requirements and executive creative direction, crafting pitch proposals to support client communications, presentations, and project milestones.',
          'Conducted comprehensive KOL and social media account research, structuring profiles, content strategies, and partnership terms into executive PPT presentation decks.',
          'Utilized Excel for project scheduling, task breakdown, and progress tracking, synchronizing designers, print vendors, and promotional collateral fabrication.',
          'Managed promotional collateral specifications, vendor RFQs, and supplier communications, supervising material prototyping, fabrication, and final delivery.',
        ],
        skills: ['Client Briefing', 'Pitch Proposals', 'Excel Scheduling', 'KOL Scouting', 'Vendor & Collateral Coordination'],
      },
      {
        id: 'intern-tr',
        company: 'Wuhan Tongren E-Commerce Co., Ltd.',
        role: 'Visual Design Intern',
        period: '2023.06 – 2023.09',
        tag: 'Visual Design · Corporate Culture',
        bullets: [
          'Participated in the visual manifestation of corporate culture, designing thematic culture walls and matching promotional collateral.',
          'Assisted in curating and optimizing brand visual assets, bolstering effective multi-channel visual communication of corporate culture.',
        ],
        skills: ['Culture Wall Design', 'Promotional Collateral', 'Brand Visual Asset Curation'],
      },
    ],
    projects: [
      {
        id: 'proj-taikoo-li',
        title: 'Beijing Taikoo Li | Bamboo Forest Tavern Brand Event',
        role: 'Project Execution Intern',
        period: '2026.7 – 2026.9',
        tag: 'Offline Brand Event · End-to-End Execution',
        summary:
          'End-to-end coordination and execution for the large-scale immersive brand event at Beijing Taikoo Li, spanning design milestones, client budget negotiations, influencer scouting, vendor RFQs, and financial settlement across 20+ partner bar brands.',
        bullets: [
          'Pre-event Milestones: Decomposed deliverables across creative, 2D/3D design, submission approval, blueprints, sampling, material fabrication, pre-build, shipping QC, on-site staging, and campaign rollout to build master schedules.',
          'Client & Budget: Participated in client budget negotiations; collaboratively adjusted event mechanics, execution stages, and collateral specs when budgets shifted, achieving synchronous strategy-budget alignment.',
          'Outreach & Supply Chain: Scouted tailored KOLs/influencers matching brand positioning and created briefing decks; negotiated RFQs across factories, audited procurement costs, and coordinated rental logistics for furniture and refrigeration units.',
          'Event Closeout: Verified accounts and structured financial settlement data across 20+ participating tavern and cocktail bar brands.',
        ],
        deliverables: ['Master Event Execution Schedule', 'Supplier RFQ & Procurement Matrix', '20+ Tavern Brand Financial Settlements'],
      },
    ],
    portfolio: [
      {
        id: 'work-vi-chufeng',
        iconType: 'package1',
        category: 'Brand VI Design',
        direction: 'Hubei Local Tea Brand & Wudang Tai Chi · Comprehensive VI System',
        title: 'Chufeng Xiangming · Hubei Tea Brand VI Design',
        client: 'Chufeng Xiangming Tea Co.',
        year: '2024',
        summary: 'Fusing Wudang Mountain Tai Chi philosophy with tea culture. Logo steam gradients symbolize tea aroma and leaf stems. Full VI system includes logo geometry, corporate colors (#4F6A3D, #F6E9C5, #1B1F22), secondary graphics, packaging, and billboard guidelines.',
        details: [
          'Logo evolved from Wudang Tai Chi; custom pen calligraphy Chinese typography expressing harmony between humans and nature.',
          'Standardized logo proportions, minimum display scale (10mm), secondary colors (#A6AA54, #78AA8B), and incorrect usage rules.',
          'Delivered cups, tote bags, tin cans, gift boxes, outdoor billboards, and fold-out brochure specifications.',
        ],
        tags: ['Brand VI Design', 'Logo Typography', 'Corporate Color System', 'Packaging Extension'],
        image: '/images/dl_leaflet_grid_1.png',
        pages: ['/images/dl_leaflet_grid_1.png'],
      },
      {
        id: 'work-package-taikang',
        iconType: 'package2',
        category: 'Packaging Design',
        direction: 'Contemporary Youth Tea Gift Packaging · Five Blessings Concept',
        title: 'Taikang Insurance Group Tea Gift · Packaging Design',
        client: 'Taikang Insurance Group',
        year: '2024',
        summary: 'Centered on the "Five Blessings" core ethos tailored for contemporary youth (Health, Youthfulness, Career, Happiness, Serendipity), creating pu-erh tea cake packaging and slide-out gift boxes.',
        details: [
          'Traditional calligraphy typography with bold strokes; inspiration extracted from Taikang butterflies, Beijing Temple of Heaven, and Taikang HQ.',
          'Tea cake palette referenced classical Chinese tones (Jade #3A6D55, Celadon #BCCBB8, White #E5C7C7, Amber #DCCCB2).',
          'Completed Five Blessings brand icons, flat layout plans, structural die-cuts, and rigid drawer gift box prototyping.',
        ],
        tags: ['Packaging Design', 'Calligraphy Typography', 'Pu-erh Tea Packaging', 'Structural Die-line'],
        image: '/images/茶饼5.png',
      },
      {
        id: 'work-signage-yishe',
        iconType: 'signage',
        category: 'Wayfinding System Design',
        direction: 'Efficient Spatial Orientation & Aesthetic Unity · Building Corridor Wayfinding',
        title: 'Art & Design Gallery Corridor · Wayfinding System Design',
        client: 'School of Art & Design',
        year: '2023',
        summary: 'Designed around intuitive pedestrian pathfinding to enable unassisted spatial navigation. Employs bold crimson (#EC5B3C) with soft accents (#D9D9D9, #F7A8DF, #4D4D4D, #DBF2FF), establishing prominent visual anchors with aesthetic cohesion.',
        details: [
          'Designed freestanding directory totems (170-230cm height), suspended signs, wall plaques, and display boards.',
          'Standardized pictograms for fire hydrants, power switches, restrooms, offices, trash bins, directions, and 3D room numerals (0-9).',
          'Installed across academic corridor corners, classroom plaques (e.g. A 301), and gallery exhibit spaces.',
        ],
        tags: ['Wayfinding System Design', 'Spatial Navigation', 'Environmental Graphics', 'Signage Guidelines'],
        image: '/images/Frame 14.png',
      },
      {
        id: 'work-web-vinyl',
        iconType: 'vinyl',
        category: 'Web / Interactive Design',
        direction: 'Sound & Biology Fusion · Slime Mold Audio Visualization Custom Vinyl',
        title: 'Eco-Vinyl · Audio Biological Visualization · Mobile Web / Interactive Design',
        client: 'Audio-Biology Laboratory',
        year: '2023',
        summary: 'Sound vibration shapes slime mold growth patterns into unique visuals, enabling users to customize bespoke biological records on mobile web. Replaces traditional PVC with eco-friendly bioplastics to champion sustainability.',
        details: [
          'Investigated dialogue between distinct genres (Folk, Funk, Electronic, R&B, Jazz) and slime mold morphology.',
          'Documented 4-step biomaterial fabrication (expired milk + vinegar heating, filtration, food color mixing, oven curing).',
          'Produced complete mobile interactive prototype: splash, music upload, visual generation, lab process timeline, and shipping order flow.',
        ],
        tags: ['Web / Interactive Design', 'Audio Visualization', 'Slime Mold Lab', 'Eco Bioplastics', 'Mobile UI/UX'],
        image: '/images/二-2.png',
      },
      {
        id: 'work-web-3d-digital',
        iconType: 'popup',
        category: 'Interactive Web / 3D Modeling / Animation',
        direction: 'Social Data Shackles Critique · Interactive Web & Cascading Error Modals',
        title: 'Digitalized Existence · Interactive Web / 3D Modeling / Animation',
        client: 'New Media Art Research',
        year: '2023',
        summary: 'Examines social media addiction and algorithmic traps where users are conditioned by red notification dots. Implements interactive web flows, Figma low-fi architectures, and 3D animations featuring compounding "Error - Click Fix to fix error" window popups.',
        details: [
          'Engineered cascading modal trigger interactions where closing a window spawns multiplying glitch errors.',
          'Constructed comprehensive Figma user journey low-fi wires analyzing compulsive feed refreshing psychology.',
          'Modeled and animated 3D conceptual scenes capturing the cognitive isolation of modern digital life.',
        ],
        tags: ['Interactive Web', '3D Modeling', 'Concept Animation', 'Error Modals', 'Social Metaphor'],
        image: '/images/截图81.png',
      },
      {
        id: 'work-3d-touchdesigner',
        iconType: 'building',
        category: '3D Modeling / TouchDesigner',
        direction: 'Abandoned Community Memory · 3D Point Cloud Scanning & Particle Simulation',
        title: 'The Forgotten Haven · 3D Modeling / TouchDesigner',
        client: 'Urban Memory & Spatial Narrative Lab',
        year: '2023',
        summary: 'Amid skyscrapers, an old dilapidated neighborhood held warmth and vanishing memories. Demolition disrupted silence; standing before ruins, memory flows like a dream. Field photography and 3D laser point-cloud scans are converted into dynamic particles in TouchDesigner.',
        details: [
          'Executed 3D spatial laser scans of narrow alleys, drying balconies, and ruinous masonry structures.',
          'Built generative parametric fluid particle systems in TouchDesigner visualizing memory fragmentation and reconstitution.',
          'Produced 3D point-cloud spatial flythrough video and installation proposals offering immersive philosophical reflection.',
        ],
        tags: ['3D Modeling', 'TouchDesigner', 'Point Cloud Scan', 'Dynamic Particles', 'Spatial Narrative'],
        image: '/images/避风港.png',
      },
    ],
    socialMedia: {
      platform: 'Douyin & Xiaohongshu',
      role: 'Personal Accounts',
      period: '2023.01 – Present',
      summary:
        'Independently manage accounts, overseeing content planning, shooting, publishing, and data retrospectives. Douyin: 12K+ followers, single peak 2.54M views, 120K+ likes; RED: lifestyle and outfit content, single peak 30K+ views, 800+ likes.',
      metrics: [
        { label: 'Douyin Followers', value: '12K+', subtext: 'Organic community growth' },
        { label: 'Peak Video Views', value: '2.54M', subtext: '120K+ likes · 58K+ shares' },
        { label: '2M+ Viral Hit Videos', value: '2 Posts', subtext: 'Over 2M views per video' },
        { label: 'RED Peak Post', value: '30K+ Views', subtext: 'Lifestyle & Outfits · 800+ likes' },
      ],
      bullets: [
        'Independently manage accounts, responsible for content strategy, shooting, publishing, and data retrospectives.',
        'Douyin: 12K+ followers; single peak 2.54M views, 120K+ likes, 58K+ shares; 2 videos exceeding 2M views.',
        'RED: Lifestyle and outfit content, single peak 30K+ views, 800+ likes.',
      ],
    },
    skills: [
      {
        category: 'Brand & Project Execution',
        items: 'Client Communication, Pitch Proposals, Project Scheduling, Task Tracking, Influencer/KOL Research, Collateral Coordination, Vendor Communication',
      },
      {
        category: 'Social Media & Content',
        items: 'Douyin & Xiaohongshu Operations, Content Planning, Short Video Production, Data Retrospectives',
      },
      {
        category: 'Tools',
        items: 'PowerPoint, Excel, Figma, Adobe Creative Suite, CapCut / Jianying',
      },
      {
        category: 'AI Capabilities',
        items: 'Skilled in applying ChatGPT, Gemini (AI Studio), Codex, and Midjourney to integrate Generative AI into client execution, pitch proposals, visual design, and frontend development: leveraging ChatGPT for client brief structuring and pitch proposals; utilizing Gemini (AI Studio) to independently engineer, design, develop, and deploy personal portfolio website end-to-end, mastering AI-driven frontend development; using Codex for code generation, feature execution, and debugging iterations; employing Midjourney for rapid venue design renderings and spatial visuals to elevate validation and pitch efficiency',
      },
      {
        category: 'Visual & Communications',
        items: 'Advertising Concepts, Brand Visuals, Information Visualization',
      },
      {
        category: 'Languages',
        items: 'English (IELTS 6.5)',
      },
    ],
    awards: [
      {
        id: 'award-2025',
        year: '2025',
        title: 'Future Designers Competition',
        level: 'Hubei Provincial First Prize',
      },
      {
        id: 'award-2022',
        year: '2022',
        title: 'China Academy Advertising Art Festival',
        level: 'Graphic Design Excellence Award',
      },
    ],
    contact: {
      title: 'Contact Information',
      subtitle: 'Looking forward to communicating with you',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      locationLabel: 'City',
      statusLabel: 'Status',
      copiedText: 'Copied',
      copyPrompt: 'Click to copy',
    },
  },
};

export const RESUME_CHAPTERS = {
  zh: [
    { id: 'education', number: '1', title: '教育背景' },
    { id: 'experience', number: '2', title: '实习经历' },
    { id: 'projects', number: '3', title: '项目经历' },
    { id: 'portfolio', number: '4', title: '设计作品集' },
    { id: 'social-media', number: '5', title: '社交媒体实践' },
    { id: 'skills', number: '6', title: '核心能力' },
    { id: 'awards', number: '7', title: '获奖' },
    { id: 'contact', number: '8', title: '联系方式' },
  ],
  en: [
    { id: 'education', number: '1', title: 'Education' },
    { id: 'experience', number: '2', title: 'Internships' },
    { id: 'projects', number: '3', title: 'Projects' },
    { id: 'portfolio', number: '4', title: 'Design Portfolio' },
    { id: 'social-media', number: '5', title: 'Social Media' },
    { id: 'skills', number: '6', title: 'Core Skills' },
    { id: 'awards', number: '7', title: 'Awards' },
    { id: 'contact', number: '8', title: 'Contact' },
  ],
};

// Legacy alias for compatibility
export const RESUME_DATA = {
  personal: {
    name: '李珂',
    nameEn: 'Lykke',
    roles: ['数字媒体硕士', '视觉传达本科', '品牌AE项目控场', '社媒运营'],
    location: '上海',
    phone: '17871741095',
    email: '42llykke@gmail.com',
    photoUrl: 'public/images/I.png',
    summaryParagraph:
      '数字媒体硕士 / 视觉传达本科。兼具品牌AE项目控场与社媒（抖音/小红书）运营经验。既能精准对接客户需求、统筹预算与供应商高效推进项目落地；又擅长以视觉创意驱动内容策划与数据优化。',
  },
  education: RESUME_CONTENT.zh.education,
  internships: RESUME_CONTENT.zh.internships,
  projects: RESUME_CONTENT.zh.projects,
  socialMedia: RESUME_CONTENT.zh.socialMedia,
  skills: RESUME_CONTENT.zh.skills,
  awards: RESUME_CONTENT.zh.awards,
};

export const RESUME_SECTIONS = [
  { id: 'education', title: '教育背景', en: 'Education', number: '1' },
  { id: 'experience', title: '实习经历', en: 'Internships', number: '2' },
  { id: 'projects', title: '项目经历', en: 'Projects', number: '3' },
  { id: 'portfolio', title: '设计作品集', en: 'Design Portfolio', number: '4' },
  { id: 'social-media', title: '社交媒体实践', en: 'Social Media', number: '5' },
  { id: 'skills', title: '核心能力', en: 'Core Skills', number: '6' },
  { id: 'awards', title: '获奖', en: 'Awards', number: '7' },
  { id: 'contact', title: '联系方式', en: 'Contact', number: '8' },
];
