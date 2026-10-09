import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function mediaUploadPlugin(): Plugin {
  return {
    name: 'media-upload-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload-media', (req, res) => {
        if (req.method === 'POST') {
          const rawFileName = (req.headers['x-file-name'] as string) || '';
          let decodedFileName = decodeURIComponent(rawFileName);
          
          const isVideo = decodedFileName.endsWith('.MOV') || 
                          decodedFileName.endsWith('.mov') || 
                          decodedFileName.endsWith('.mp4') || 
                          decodedFileName.endsWith('.webm') ||
                          req.headers['content-type']?.includes('video');

          let targetName = decodedFileName 
            ? path.basename(decodedFileName) 
            : (isVideo ? '实验影像.MOV' : 'lykke_portrait_nobg.png');

          const targetPath = path.resolve(__dirname, 'public', targetName);
          const chunks: Uint8Array[] = [];

          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            fs.writeFileSync(targetPath, buffer);
            console.log(`[MediaUpload] Successfully saved ${targetName} (${buffer.length} bytes) to public/ folder!`);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, fileName: targetName, path: `/${targetName}` }));
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    },
  };
}

function staticAssetServePlugin(): Plugin {
  return {
    name: 'static-asset-serve-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        try {
          const rawUrl = (req.originalUrl || req.url || '').split('?')[0];
          const decoded = decodeURIComponent(rawUrl);

          const candidates = [
            path.resolve(__dirname, 'public', decoded.startsWith('/') ? decoded.slice(1) : decoded),
            path.resolve(__dirname, 'public', 'images', path.basename(decoded)),
            path.resolve(__dirname, 'public', 'documents', path.basename(decoded)),
          ];

          for (const target of candidates) {
            if (fs.existsSync(target) && fs.statSync(target).isFile()) {
              const ext = path.extname(target).toLowerCase();
              const mimeMap: Record<string, string> = {
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.svg': 'image/svg+xml',
                '.pdf': 'application/pdf',
                '.mov': 'video/quicktime',
                '.mp4': 'video/mp4',
                '.glb': 'model/gltf-binary',
              };
              if (mimeMap[ext]) {
                res.statusCode = 200;
                res.setHeader('Content-Type', mimeMap[ext]);
                const stat = fs.statSync(target);
                res.setHeader('Content-Length', stat.size);
                fs.createReadStream(target).pipe(res);
                return;
              }
            }
          }
        } catch (e) {
          console.error('[staticAssetServePlugin error]', e);
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    assetsInclude: ['**/*.glb'],
    plugins: [react(), tailwindcss(), mediaUploadPlugin(), staticAssetServePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name ? assetInfo.name.split('.').pop()?.toLowerCase() || '' : '';
            if (/png|jpe?g|svg|gif|webp|avif/i.test(extType)) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/mp4|mov|webm|avi|mkv/i.test(extType)) {
              return 'assets/videos/[name]-[hash][extname]';
            }
            if (/pdf/i.test(extType)) {
              return 'assets/documents/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
    },
  };
});
