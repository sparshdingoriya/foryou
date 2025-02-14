let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener("mousemove", (e) => {
      if (!this.holdingPaper) return; // Only track movement when holding paper
      
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;

      if (this.rotating) {
        const dirX = e.clientX - this.mouseTouchX;
        const dirY = e.clientY - this.mouseTouchY;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);

        if (dirLength > 0) { // Prevent division by zero
          const dirNormalizedX = dirX / dirLength;
          const dirNormalizedY = dirY / dirLength;

          const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
          let degrees = (180 * angle) / Math.PI;
          this.rotation = (360 + Math.round(degrees)) % 360;
        }
      } else {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
    });

    paper.addEventListener("mousedown", (e) => {
      if (this.holdingPaper) return; 
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.mouseTouchX = e.clientX;
      this.mouseTouchY = e.clientY;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      if (e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener("mouseup", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Prevent right-click context menu when trying to rotate
    paper.addEventListener("contextmenu", (e) => e.preventDefault());
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
