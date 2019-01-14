/* tslint:disable:member-ordering */
import { OnInit } from '@angular/core';
import { Directive, ElementRef, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appSlider]'
})
export class SliderDirective implements OnInit {

  @Input('appSlider') sliderConfig: any;

  parent: any;
  divSlides: any;
  divBullets: any;
  originalContent = [];

  // SLIDER PARAMS
  nbSlides = 0;
  currentSlide = 0;
  containerWidth: any = 0;

  // IMG
  imgToload = [];
  nbTotalImg = 0;
  imgLoaded = 0;
  imgCpt = 0;

  // SLIDES MOVE
  marginLeft = 0;
  marginLeftDrag = 0;

  posX = 0;
  posY = 0;
  isDrag = false;

  // config
  isBullets = false;
  isClickBullet = false;
  autoSlide = false;

  // autoslide
  timer = 2000; // millisec
  userStopAutoSlider = false;
  timeOut = null;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) {
    this.parent = this.el.nativeElement;
  }

  ngOnInit() {
    this.getSliderConfig();

    this.containerWidth = this.parent.offsetWidth;

    // get original contents
    const children = this.parent.childNodes;
    this.nbTotalImg = 0;
    for (const child of children) {
      this.originalContent.push(child);
      if (child.nodeName.toLowerCase() === 'img') {
        this.originalContent[this.originalContent.length - 1].draggable = false;
        this.nbTotalImg++;
      }
    }
    this.nbSlides = this.originalContent.length - 1;
    // clean parent
    this.parent.innerHTML = '';
    // get parent width
    this.containerWidth = this.parent.getBoundingClientRect();
    // Assign parent size
    this.renderer.setStyle(
      this.parent,
      'width',
      '100%'
    );
    this.renderer.setStyle(
      this.parent,
      'overflow',
      'hidden'
    );
    this.renderer.setStyle(
      this.parent,
      'text-align',
      'center'
    );

    this.loadImgs();
  }

  getSliderConfig() {
    this.isBullets = (typeof this.sliderConfig.isBullets !== 'undefined') ? this.sliderConfig.isBullets : false;
    this.autoSlide = (typeof this.sliderConfig.autoSlide !== 'undefined') ? this.sliderConfig.autoSlide : false;
  }

  loadImgs() {
    for (const content of this.originalContent) {
      // Images
      if (content.nodeName.toLowerCase() === 'img') {
        this.imgToload[this.imgCpt] = new Image();
        this.imgToload[this.imgCpt].onload = () => {
          this.imgLoaded++;
          if (this.imgLoaded === this.nbTotalImg) {
            // all img loaded
            this.putContent();
          }
        };
        this.imgToload[this.imgCpt].src = content.src;
      }
    }
  }

  putContent() {
    if (typeof this.divSlides !== 'undefined') {
      // remove if exist
      this.parent.removeChild(this.divSlides);
    }
    if (typeof this.divBullets !== 'undefined') {
      this.parent.removeChild(this.divBullets);
    }
    // create divSlide if not exists
    this.divSlides = document.createElement('div');
    this.divSlides.className = 'dirslider_divSlides';
    // push divSlide into parent
    this.parent.appendChild(this.divSlides);

    // assign divSlides width from new containerWidth
    const nbSlides = (this.currentSlide === 0 || this.currentSlide === this.nbSlides) ? this.nbSlides + 2 : this.nbSlides + 1;
    this.renderer.setStyle(
      this.divSlides,
      'width',
      (this.containerWidth.width * nbSlides) + 'px'
    );
    // real marginLeft
    const nbDecalScreen = (this.currentSlide === 0) ? this.currentSlide + 1 : this.currentSlide;
    this.marginLeft = (this.containerWidth.width * (nbDecalScreen)) * - 1;
    // make diff between real MarginLeft and dragged marginLeft - to go back to real if mouseup too soon
    this.marginLeftDrag = this.marginLeft;
    this.renderer.setStyle(
      this.divSlides,
      'margin-left',
      this.marginLeft + 'px'
    );
    // add contents
    let slide: any;

    // add previous slide
    if (this.currentSlide === 0) {
      slide = document.createElement('div');
      slide.className = 'dirslider_slide' + '_previous';
      slide.style.width = (this.containerWidth.width) + 'px';
      // append content into div
      const clonedContent = this.originalContent[this.originalContent.length - 1].cloneNode(true);
      slide.appendChild(clonedContent);
      // push div into divSlide
      this.divSlides.appendChild(slide);
    }

    // loop all accessible slides
    for (let i = 0; i < this.originalContent.length; i++) {
      slide = document.createElement('div');
      slide.className = 'dirslider_slide' + i;
      slide.style.width = (this.containerWidth.width) + 'px';
      // append content into div
      slide.appendChild(this.originalContent[i]);
      // push div into divSlide
      this.divSlides.appendChild(slide);
    }

    // add next slide -> index 0
    if (this.currentSlide === this.nbSlides) {
      slide = document.createElement('div');
      slide.className = 'dirslider_slide' + '_next';
      slide.style.width = (this.containerWidth.width) + 'px';
      // append content into div
      const clonedContent = this.originalContent[0].cloneNode(true);
      slide.appendChild(clonedContent);
      // push div into divSlide
      this.divSlides.appendChild(slide);
    }

    // add bullets
    if (this.isBullets) {
      // create bullets
      this.divBullets = document.createElement('div');
      this.divBullets.className = 'dirslider_divBullets';
      let bulletDiv: any;
      for (let i = 0; i < this.originalContent.length; i++) {
        const classActive = (i === this.currentSlide) ? 'dirslider_bullet dirslider_activeBullet' : 'dirslider_bullet';
        bulletDiv = document.createElement('div');
        bulletDiv.id = i;
        bulletDiv.className = classActive;
        // push div into divBullets
        this.divBullets.appendChild(bulletDiv);
      }
      // push divSlide into parent
      this.parent.appendChild(this.divBullets);
    }
    if (this.autoSlide && !this.userStopAutoSlider) {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        this.processAutoSlide();
      }, this.timer);
    }
  }

  // RESIZE
  @HostListener('window:resize', ['$event']) onResize(event) {
    clearTimeout(this.timeOut);
    this.containerWidth = this.parent.getBoundingClientRect();
    this.putContent();
  }

  // DESKTOP
  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    const target: any = event.target;
    if (target.className !== 'dirslider_bullet') {
      this.processMouseDown(event);
    } else {
      this.isClickBullet = true;
    }
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    this.processMouseMove(event);
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    const target: any = event.target;
    if (target.className === 'dirslider_bullet' && this.isClickBullet) {
      this.processClickBullet(target.id);
    } else {
      this.processMouseUp(event);
    }
    this.isClickBullet = false;
  }
  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent) {
    this.processMouseUp(event);
  }

  // MOBILE
  @HostListener('touchstart', ['$event']) onTouchStart(event: TouchEvent) {
    this.processMouseDown(event);
  }
  @HostListener('touchmove', ['$event']) onTouchMove(event: TouchEvent) {
    this.processMouseMove(event);
  }
  @HostListener('touchend', ['$event']) onTouchEnd(event: TouchEvent) {
    this.processMouseUp(event);
  }

  unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }

  processMouseDown(event) {
    // remove transition during drag
    this.divSlides.classList.add('dirslider_noTransition');
    this.posX = this.unify(event).clientX - this.parent.offsetLeft;
    this.posY = this.unify(event).clientY;
    this.isDrag = true;
  }

  processMouseMove(event) {
    if (!!this.isDrag) {
      const diffX = (this.unify(event).clientX - this.parent.offsetLeft) - this.posX;
      const diffY = (this.unify(event).clientY) - this.posY;
      const tmpDiffX = (diffX < 0) ? (diffX * -1) : diffX;
      const tmpDiffY = (diffY < 0) ? (diffY * -1) : diffY;
      // check if scroll or swipe
      if (tmpDiffX > tmpDiffY) {
        this.marginLeftDrag = this.marginLeft + diffX;
        if (this.marginLeftDrag < this.marginLeft) {
          if (((this.marginLeftDrag + (this.marginLeft * -1)) * -1) > (this.containerWidth.width)) {
            this.marginLeftDrag = this.marginLeft - (this.containerWidth.width);
          }
        } else {
          if (((this.marginLeft + (this.marginLeftDrag * -1)) * -1) > (this.containerWidth.width)) {
            this.marginLeftDrag = this.marginLeft + (this.containerWidth.width);
          }
        }
        if (this.marginLeftDrag !== this.marginLeft) {
          this.renderer.setStyle(
            this.divSlides,
            'margin-left',
            this.marginLeftDrag + 'px'
          );
        }
      }
    }
  }

  processMouseUp(event) {
    if (!!this.isDrag) {
      // add transition when drag finished
      this.divSlides.classList.remove('dirslider_noTransition');
      const diff = (this.unify(event).clientX - this.parent.offsetLeft) - this.posX;
      const tmpDiff = (diff < 0) ? (diff * -1) : diff;
      if (tmpDiff <= ((this.containerWidth.width) / 3)) {
        // go back if drag not enough
        this.renderer.setStyle(
          this.divSlides,
          'margin-left',
          this.marginLeft + 'px'
        );
      } else {
        // user move = stop autoSlide
        clearTimeout(this.timeOut);
        this.userStopAutoSlider = true;
        // move prev/next
        if (diff < 0) {
          this.marginLeft = this.marginLeft - (this.containerWidth.width);
        } else {
          this.marginLeft = this.marginLeft + (this.containerWidth.width);
        }
        if (diff < 0) {
          this.currentSlide = ((this.currentSlide + 1) > this.nbSlides) ? 0 : this.currentSlide + 1;
        } else {
          this.currentSlide = ((this.currentSlide - 1) < 0) ? this.nbSlides : this.currentSlide - 1;
        }
        this.renderer.setStyle(
          this.divSlides,
          'margin-left',
          this.marginLeft + 'px'
        );
      }
      this.isDrag = false;
      setTimeout(() => {
        // remove transitions to reconstruct slider
        this.divSlides.classList.add('dirslider_noTransition');
        this.putContent();
      }, 400);
    }
  }

  processClickBullet(index) {
    // user move = stop autoSlide
    clearTimeout(this.timeOut);
    this.userStopAutoSlider = true;
    // move to screen
    const nbDecalScreen = (this.currentSlide === 0) ? Number(index) + 1 : Number(index);
    this.marginLeft = (this.containerWidth.width * (nbDecalScreen)) * - 1;
    this.currentSlide = Number(index);
    this.renderer.setStyle(
      this.divSlides,
      'margin-left',
      this.marginLeft + 'px'
    );
    setTimeout(() => {
      // remove transitions to reconstruct slider
      this.divSlides.classList.add('dirslider_noTransition');
      this.putContent();
    }, 400);
  }

  processAutoSlide() {
    if (this.autoSlide && !this.userStopAutoSlider) {
      this.currentSlide = ((this.currentSlide + 1) > this.nbSlides) ? 0 : this.currentSlide + 1;

      this.renderer.setStyle(
        this.divSlides,
        'margin-left',
        (this.marginLeft - this.containerWidth.width) + 'px'
      );

      setTimeout(() => {
        // remove transitions to reconstruct slider
        this.divSlides.classList.add('dirslider_noTransition');
        this.putContent();
      }, 400);
    } else {
      clearTimeout(this.timeOut);
    }
  }

}
