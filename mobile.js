let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchMoveX = 0;
    this.touchMoveY = 0;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
    this.initialAngle = 0;
  }

  init(paper) {
    paper.addEventListener("touchstart", (e) => this.onTouchStart(e, paper));
    paper.addEventListener("touchmove", (e) => this.onTouchMove(e, paper));
    paper.addEventListener("touchend", () => this.onTouchEnd());

    // Multi-touch rotation handling
    paper.addEventListener("touchstart", (e) => this.handleMultiTouchStart(e));
    paper.addEventListener("touchmove", (e) => this.handleMultiTouchMove(e, paper));
    paper.addEventListener("touchend", (e) => this.handleMultiTouchEnd(e));
  }

  onTouchStart(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    
    paper.style.zIndex = highestZ++;
    
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.prevTouchX = this.touchStartX;
    this.prevTouchY = this.touchStartY;
  }

  onTouchMove(e, paper) {
    e.preventDefault();
    if (this.rotating || !this.holdingPaper) return;

    this.touchMoveX = e.touches[0].clientX;
    this.touchMoveY = e.touches[0].clientY;

    this.velX = this.touchMoveX - this.prevTouchX;
    this.velY = this.touchMoveY - this.prevTouchY;

    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;

    this.prevTouchX = this.touchMoveX;
    this.prevTouchY = this.touchMoveY;

    requestAnimationFrame(() => {
      paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
    });
  }

  onTouchEnd() {
    this.holdingPaper = false;
  }

  // Multi-touch rotation handling
  handleMultiTouchStart(e) {
    if (e.touches.length === 2) {
      this.rotating = true;
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      this.initialAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    }
  }

  handleMultiTouchMove(e, paper) {
    if (this.rotating && e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const newAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      this.rotation += newAngle - this.initialAngle;
      this.initialAngle = newAngle;

      requestAnimationFrame(() => {
        paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
      });
    }
  }

  handleMultiTouchEnd(e) {
    if (e.touches.length < 2) {
      this.rotating = false;
    }
  }
}

document.querySelectorAll(".paper").forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
