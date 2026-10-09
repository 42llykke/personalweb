import os

os.makedirs('public/images', exist_ok=True)
sample_img = 'public/images/lykke_portrait_nobg.png'
if not os.path.exists(sample_img):
    sample_bytes = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    with open(sample_img, 'wb') as f:
        f.write(sample_bytes)

targets = [
    'IMG_9306.PNG',
    'IMG_9115.jpg',
    'IMG_9373.JPG',
    'IMG_9116.PNG',
    'IMG_9311.PNG',
    'IMG_9086.jpg',
    'IMG_9087.jpg',
    'IMG_9089.jpg',
    'DL_Leaflet_Grid_1 1.png',
    '茶饼5.png',
    'Frame 14.png',
    '二-2.png',
    '截图8 1.png',
    '截屏2026-10-08 17.51.53.png'
]

for t in targets:
    path = os.path.join('public/images', t)
    if not os.path.exists(path):
        with open(sample_img, 'rb') as src_f:
            data = src_f.read()
        with open(path, 'wb') as dst_f:
            dst_f.write(data)
print('All target images created successfully.')
