// 图片保护：禁用右键、禁止拖拽图片
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

document.addEventListener('dragstart', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
    return false;
  }
});

// 给所有图片加保护
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  images.forEach(function(img) {
    img.setAttribute('draggable', 'false');
    img.style.userSelect = 'none';
    img.oncontextmenu = function() { return false; };
  });
});
