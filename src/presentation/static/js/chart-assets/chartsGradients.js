function getGradientLightBlue(index, total) {
    const startColor = { r: 135, g: 206, b: 250 };
    const endColor = { r: 70, g: 130, b: 180 };
  
    const ratio = index / (total - 1);
    const r = Math.floor(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.floor(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.floor(startColor.b + (endColor.b - startColor.b) * ratio);
  
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  }
  
function getGradientRed(index, total) {
    const startColor = { r: 255, g: 69, b: 69 };
    const endColor = { r: 139, g: 0, b: 0 };
  
    const ratio = index / (total - 1);
    const r = Math.floor(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.floor(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.floor(startColor.b + (endColor.b - startColor.b) * ratio);
  
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  }
  
function getGradientGreen(index, total) {
    const startColor = { r: 144, g: 238, b: 144 };
    const endColor = { r: 0, g: 100, b: 0 };
  
    const ratio = index / (total - 1);
    const r = Math.floor(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.floor(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.floor(startColor.b + (endColor.b - startColor.b) * ratio);
  
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  }

function getGradientPurple(index, total) {
    const startColor = { r: 216, g: 191, b: 216 };
    const endColor = { r: 75, g: 0, b: 130 };

    const ratio = index / (total - 1);
    const r = Math.floor(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.floor(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.floor(startColor.b + (endColor.b - startColor.b) * ratio);

    return `rgba(${r}, ${g}, ${b}, 0.3)`;
}
  
