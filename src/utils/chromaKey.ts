export function removeChromaKey(
  base64Image: string,
  chromaColor: string = '#FF00FF',
  tolerance: number = 60
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Canvas context unavailable');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const r0 = parseInt(chromaColor.slice(1, 3), 16);
      const g0 = parseInt(chromaColor.slice(3, 5), 16);
      const b0 = parseInt(chromaColor.slice(5, 7), 16);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2);

        if (dist < tolerance) {
          data[i + 3] = 0;
        } else if (dist < tolerance * 1.5) {
          const alpha = Math.round(((dist - tolerance) / (tolerance * 0.5)) * 255);
          data[i + 3] = Math.min(data[i + 3], alpha);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png').split(',')[1]);
    };
    img.onerror = () => reject('Failed to load image');
    img.src = `data:image/png;base64,${base64Image}`;
  });
}
