/**
 * Print utility functions — handles image composition and downloads.
 */

/**
 * Composites multiple images into a single photo booth frame.
 */
export const generatePrintImage = async (
  images: string[],
  layoutId: string,
  layoutName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context failed'));
      return;
    }

    // Define dimensions based on layout
    const photoWidth = 800; // Increased for better print quality
    const photoHeight = 600;
    const padding = 40;
    const spacing = 30;
    const bottomReserved = 120;

    let cols = 1;
    let rows = 1;
    
    if (layoutId === '2-picture') cols = 2;
    if (layoutId === '4-picture') { cols = 2; rows = 2; }

    canvas.width = (photoWidth * cols) + (spacing * (cols - 1)) + (padding * 2);
    canvas.height = (photoHeight * rows) + (spacing * (rows - 1)) + padding + bottomReserved;

    // 1. Draw Background (Parchment color)
    ctx.fillStyle = '#FFE8D1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Load and draw all images
    let loadedCount = 0;
    images.forEach((imgSrc, i) => {
      const img = new Image();
      img.onload = () => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        const x = padding + col * (photoWidth + spacing);
        const y = padding + row * (photoHeight + spacing);
        
        ctx.drawImage(img, x, y, photoWidth, photoHeight);
        
        loadedCount++;
        if (loadedCount === images.length) {
          // 3. Draw Branding
          ctx.fillStyle = '#3D2314';
          ctx.font = 'bold 48px ui-serif, Georgia, serif';
          ctx.fillText('KUWADRO', padding, canvas.height - 65);
          
          ctx.fillStyle = 'rgba(61, 35, 20, 0.6)';
          ctx.font = '20px monospace';
          ctx.fillText('kuwadro.vercel.app', padding, canvas.height - 35);
          
          ctx.fillStyle = 'rgba(61, 35, 20, 0.4)';
          ctx.font = '24px monospace';
          const date = new Date().toLocaleDateString();
          const textWidth = ctx.measureText(date).width;
          ctx.fillText(date, canvas.width - padding - textWidth, canvas.height - 50);

          resolve(canvas.toDataURL('image/png', 1.0));
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image at index ${i}`));
      img.src = imgSrc;
    });
  });
};

/**
 * Triggers a download of the provided data URL.
 */
export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
