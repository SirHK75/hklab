/* tslint:disable:member-ordering */
import { OnInit, AfterViewInit } from '@angular/core';
import { Directive, ElementRef, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appSlider]'
})
export class SliderDirective implements OnInit, AfterViewInit {

  @Input('appSlider') sliderConfig: any;

  parent: any;
  divSlides: any;
  divBullets: any;
  originalContent = [];
  isAnimated = false;
  focusSlider = false;
  innerWidth = window.innerWidth;

  // CONFIG
  isBullets = false;
  isArrows = false;
  isInline = false;
  isVertical = false;
  verticalLimit = 0;
  isClickBullet = false;
  autoSlide = false;
  autoSliderTimer = 0;

  // SLIDER PARAMS
  nbSlides = 0;
  currentSlide = 0;
  containerWidth: any = 0;
  inlineWidthItem = 0;
  inlineHeightItem = 0;

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
  hasMoved = false;

  // autoslide
  timer = 5000; // millisec
  userStopAutoSlider = false;
  timeOut = null;

  // arrows
  btControls: any;
  btLeft: any;
  btRight: any;
  isClickArrow = false;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) {
    this.parent = this.el.nativeElement;
    this.renderer.setStyle(
      this.parent,
      'opacity',
      '0'
    );
  }

  ngOnInit() {
    this.getSliderConfig();
    // get original contents
    const children = this.parent.childNodes;
    this.getAllContents(children);
    if (this.nbSlides > 0) {
      this.setSlider();
    }
  }

  ngAfterViewInit() {
    // get view generated original contents
    if (this.nbSlides <= 0) {
      const children = this.parent.childNodes;
      this.getAllContents(children);
      if (this.nbSlides > 0) {
        this.setSlider();
      }
    }
  }

  getAllContents(contents) {
    this.nbSlides = 0;
    for (const child of contents) {
      // check si on gère bien tous les types de commentaires et autres trucs qu'on ne voudrait pas
      if (child.nodeName !== '#comment') {
        this.originalContent.push(child);
        this.inlineWidthItem = (child.offsetWidth > this.inlineWidthItem) ? child.offsetWidth : this.inlineWidthItem;
        this.inlineHeightItem = (child.offsetHeight > this.inlineHeightItem) ? child.offsetHeight : this.inlineHeightItem;
        if (child.nodeName.toLowerCase() === 'img') {
          this.originalContent[this.originalContent.length - 1].draggable = false;
          this.nbTotalImg++;
        }
      }
    }
    this.nbSlides = this.originalContent.length - 1;
  }

  setSlider() {
    // Assign parent size
    this.renderer.setStyle(
      this.parent,
      'transition',
      'opacity .6s ease-out'
    );
    const widthParent = (!this.isVertical) ? '100%' : this.inlineWidthItem + 'px';
    this.renderer.setStyle(
      this.parent,
      'width',
      widthParent
    );
    if (this.isVertical) {
      const slidesHeight = (this.verticalLimit === 0) ? this.inlineHeightItem * (this.nbSlides + 1) : this.verticalLimit;
      this.renderer.setStyle(
        this.parent,
        'height',
        slidesHeight + 'px'
      );
    }
    this.renderer.setStyle(
      this.parent,
      'overflow',
      'hidden'
    );
    if (!this.isInline) {
      this.renderer.setStyle(
        this.parent,
        'text-align',
        'center'
      );
    }
    this.renderer.setStyle(
      this.parent,
      'position',
      'relative'
    );

    // clean parent
    this.parent.innerHTML = '';

    setTimeout(() => {
      this.containerWidth = this.parent.getBoundingClientRect();
      // remove arrows if container < 250px
      this.isArrows = (this.containerWidth.width <= 250 && !this.isVertical)
      ? false
      : (typeof this.sliderConfig.isArrows !== 'undefined')
      ? this.sliderConfig.isArrows
      : false;

      if (this.nbTotalImg > 0) {
        this.loadImgs();
      } else {
        this.putContent();
      }
    }, 0);
  }

  getSliderConfig() {
    this.isBullets = (typeof this.sliderConfig.isBullets !== 'undefined') ? this.sliderConfig.isBullets : this.isBullets;
    this.isArrows = (typeof this.sliderConfig.isArrows !== 'undefined') ? this.sliderConfig.isArrows : this.isArrows;
    this.autoSlide = (typeof this.sliderConfig.autoSlide !== 'undefined') ? this.sliderConfig.autoSlide : this.autoSlide;
    this.autoSliderTimer = (typeof this.sliderConfig.timer !== 'undefined') ? this.sliderConfig.timer * 1000 : this.timer;
    this.timer = this.autoSliderTimer; // assign

    this.isVertical = (typeof this.sliderConfig.isVertical !== 'undefined') ? this.sliderConfig.isVertical : this.isVertical;
    this.verticalLimit = (typeof this.sliderConfig.verticalLimit !== 'undefined') ? this.sliderConfig.verticalLimit : this.verticalLimit;

    this.isInline = (typeof this.sliderConfig.inline !== 'undefined') ? this.sliderConfig.inline : this.isInline;
    // slider inline = no bullets + no autoslide
    this.isBullets = (this.isInline) ? false : this.isBullets;
    this.autoSlide = (this.isInline) ? false : this.autoSlide;
  }

  loadImgs() {
    this.imgLoaded = 0;
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
    // remove if exist
    if (typeof this.divSlides !== 'undefined') {
      this.parent.removeChild(this.divSlides);
    }
    if (typeof this.divBullets !== 'undefined' && this.isBullets) {
      this.parent.removeChild(this.divBullets);
    }
    // get containerWidth
    this.containerWidth = this.parent.getBoundingClientRect();
    // create divSlides if not exists
    this.divSlides = document.createElement('div');
    this.divSlides.className = 'dirslider_divSlides';
    // push divSlide into parent
    this.parent.appendChild(this.divSlides);

    // assign divSlides width from new containerWidth
    const nbSlides = (this.currentSlide === 0 || this.currentSlide === this.nbSlides) ? this.nbSlides + 2 : this.nbSlides + 1;
    let slidesWidth: any;
    if (!this.isInline) {
      slidesWidth = this.containerWidth.width * nbSlides;
    } else {
      if (!this.isVertical) {
        slidesWidth = this.inlineWidthItem * (this.nbSlides + 1);
      } else {
        slidesWidth = this.inlineWidthItem;
        this.renderer.setStyle(
          this.divSlides,
          'height',
          (this.inlineHeightItem * (this.nbSlides + 1)) + 'px'
        );
      }
    }
    this.renderer.setStyle(
      this.divSlides,
      'width',
      slidesWidth + 'px'
    );
    // real marginLeft
    const nbDecalScreen = (this.currentSlide === 0) ? this.currentSlide + 1 : this.currentSlide;
    this.marginLeft = (!this.isInline) ? (this.containerWidth.width * (nbDecalScreen)) * - 1 : this.marginLeftDrag;
    // make diff between real MarginLeft and dragged marginLeft - to go back to real if mouseup too soon
    this.marginLeftDrag = this.marginLeft;
    const marginType = (!this.isVertical) ? 'margin-left' : 'margin-top';
    this.renderer.setStyle(
      this.divSlides,
      marginType,
      this.marginLeft + 'px'
    );
    // add contents
    let slide: any;

    // add previous slide
    if (this.currentSlide === 0 && !this.isInline) {
      slide = document.createElement('div');
      slide.className = 'dirslider_slide';
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
      slide.className = 'dirslider_slide';
      const itemWidth = (!this.isInline) ? this.containerWidth.width : this.inlineWidthItem;
      slide.style.width = itemWidth + 'px';
      // append content into div
      slide.appendChild(this.originalContent[i]);
      // push div into divSlide
      this.divSlides.appendChild(slide);
    }

    // add next slide -> index 0
    if (this.currentSlide === this.nbSlides && !this.isInline) {
      slide = document.createElement('div');
      slide.className = 'dirslider_slide';
      slide.style.width = (this.containerWidth.width) + 'px';
      // append content into div
      const clonedContent = this.originalContent[0].cloneNode(true);
      slide.appendChild(clonedContent);
      // push div into divSlide
      this.divSlides.appendChild(slide);
    }

    if (!this.isInline) {
      // >768 = 12 + 6 // <=768 = 16 + 6
      const bulletSize = (innerWidth > 768) ? ((this.nbSlides + 1) * 18 - 6) : ((this.nbSlides + 1) * 22 - 6);
      this.isBullets = (bulletSize > this.containerWidth.width)
      ? false
      : (typeof this.sliderConfig.isBullets !== 'undefined')
      ? this.sliderConfig.isBullets
      : false;
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
    // autoslide
    if (this.autoSlide && !this.userStopAutoSlider) {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        this.processAutoSlide();
      }, this.timer);
    }

    // add arrows
    if (this.isArrows) {
      if (typeof this.btLeft === 'undefined') {
        this.btLeft = document.createElement('div');
        this.btLeft.className = 'dirslider_btLeft';
        this.btLeft.innerHTML = '<i class="fas fa-angle-left"></i>';
        // push div into divSlide
        this.parent.appendChild(this.btLeft);
        const tmpTop = (!this.isVertical)
          ? ((this.divSlides.offsetHeight / 2) - (this.btLeft.offsetHeight / 2) + 2)
          : ((this.containerWidth.height / 2) - (this.btLeft.offsetHeight / 2) + 2);
        this.renderer.setStyle(
          this.btLeft,
          'top',
          tmpTop + 'px'
        );
      }
      if (typeof this.btRight === 'undefined') {
        this.btRight = document.createElement('div');
        this.btRight.className = 'dirslider_btRight';
        this.btRight.innerHTML = '<i class="fas fa-angle-right"></i>';
        // push div into divSlide
        this.parent.appendChild(this.btRight);
        const tmpTop = (!this.isVertical)
          ? ((this.divSlides.offsetHeight / 2) - (this.btRight.offsetHeight / 2) + 2)
          : ((this.parent.offsetHeight / 2) - (this.btRight.offsetHeight / 2) + 2);
        this.renderer.setStyle(
          this.btRight,
          'top',
          tmpTop + 'px'
        );
      }

      const opacity = (this.focusSlider) ? 1 : 0;
      this.renderer.setStyle(
        this.btLeft,
        'opacity',
        opacity
      );
      this.renderer.setStyle(
        this.btRight,
        'opacity',
        opacity
      );
    } else {
      if (typeof this.btLeft !== 'undefined') {
        this.parent.removeChild(this.btLeft);
        this.btLeft = undefined;
      }
      if (typeof this.btRight !== 'undefined') {
        this.parent.removeChild(this.btRight);
        this.btRight = undefined;
      }
    }

    if (this.isInline) {
      // particular case: when margin on mobile bigger than desktop
      this.marginLeftDrag = ((this.divSlides.offsetWidth - this.containerWidth.width + this.marginLeftDrag) < 0)
          ? this.containerWidth.width - this.divSlides.offsetWidth
          : this.marginLeftDrag;
    }

    this.renderer.removeStyle(
      this.parent,
      'opacity',
    );
  }

  // RESIZE EVENT
  @HostListener('window:resize', ['$event']) onResize(event) {
    clearTimeout(this.timeOut);
    this.containerWidth = this.parent.getBoundingClientRect();
    this.innerWidth = window.innerWidth;

    if (this.isInline) {
      // particular case: when margin on mobile bigger than desktop
      this.marginLeftDrag = ((this.divSlides.offsetWidth - this.containerWidth.width + this.marginLeftDrag) < 0)
          ? this.containerWidth.width - this.divSlides.offsetWidth
          : this.marginLeftDrag;
    }
    // remove arrows if container < 250px
    this.isArrows = (this.containerWidth.width <= 250 && !this.isVertical)
    ? false
    : (typeof this.sliderConfig.isArrows !== 'undefined')
    ? this.sliderConfig.isArrows
    : false;

    this.putContent();

    // re-position arrows
    let tmpTop: any;
    if (typeof this.btLeft !== 'undefined') {
      tmpTop = (!this.isVertical)
        ? ((this.divSlides.offsetHeight / 2) - (this.btLeft.offsetHeight / 2) + 2)
        : ((this.containerWidth.height / 2) - (this.btLeft.offsetHeight / 2) + 2);
      this.renderer.setStyle(
        this.btLeft,
        'top',
        tmpTop + 'px'
      );
    }
    if (typeof this.btRight !== 'undefined') {
      tmpTop = (!this.isVertical)
        ? ((this.divSlides.offsetHeight / 2) - (this.btRight.offsetHeight / 2) + 2)
        : ((this.parent.offsetHeight / 2) - (this.btRight.offsetHeight / 2) + 2);
      this.renderer.setStyle(
        this.btRight,
        'top',
        tmpTop + 'px'
      );
    }
  }

  // KEYBOARD EVENT
  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' && this.focusSlider && !this.isAnimated) {
      this.processClickArrow(1);
    }
    if (event.key === 'ArrowRight' && this.focusSlider && !this.isAnimated) {
      this.processClickArrow(-1);
    }
  }

  // MOUSE EVENTS
  @HostListener('mouseover') onMouseOver() {
    this.focusSlider = true;
    if (this.isArrows) {
      this.renderer.setStyle(
        this.btLeft,
        'opacity',
        '1'
      );
      this.renderer.setStyle(
        this.btRight,
        'opacity',
        '1'
      );
    }
  }
  @HostListener('mouseout') onMouseOut() {
    this.focusSlider = false;
    if (this.isArrows) {
      this.renderer.setStyle(
        this.btLeft,
        'opacity',
        '0'
      );
      this.renderer.setStyle(
        this.btRight,
        'opacity',
        '0'
      );
    }
  }
  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    const target: any = event.target;
    if ((target.className === 'dirslider_bullet' || target.className === 'dirslider_bullet dirslider_activeBullet') && !this.isAnimated) {
      this.isClickBullet = true;
    } else if ((target.className === 'dirslider_btLeft' || target.className === 'fas fa-angle-left') && !this.isAnimated) {
      this.isClickArrow = true;
    } else if ((target.className === 'dirslider_btRight' || target.className === 'fas fa-angle-right') && !this.isAnimated) {
      this.isClickArrow = true;
    } else {
      if (!this.isAnimated) {
        this.processMouseDown(event);
      }
    }
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (!this.isAnimated) {
      this.processMouseMove(event);
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    const target: any = event.target;
    if (
      (target.className === 'dirslider_bullet' || target.className === 'dirslider_bullet dirslider_activeBullet')
      && this.isClickBullet && !this.isAnimated
    ) {
      this.processClickBullet(target.id);
    } else if (
      (target.className === 'dirslider_btLeft' || target.className === 'fas fa-angle-left')
      && this.isClickArrow && !this.isAnimated
    ) {
      this.processClickArrow(1);
    } else if (
      (target.className === 'dirslider_btRight' || target.className === 'fas fa-angle-right')
      && this.isClickArrow && !this.isAnimated
    ) {
      this.processClickArrow(-1);
    } else {
      this.processMouseUp(event);
    }
    this.isClickBullet = false;
    this.isClickArrow = false;
  }
  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent) {
    this.processMouseUp(event);
  }

  // TOUCH EVENTS
  @HostListener('touchstart', ['$event']) onTouchStart(event: TouchEvent) {
    const target: any = event.target;
    if ((target.className === 'dirslider_bullet' || target.className === 'dirslider_bullet dirslider_activeBullet') && !this.isAnimated) {
      this.isClickBullet = true;
    } else if ((target.className === 'dirslider_btLeft' || target.className === 'fas fa-angle-left') && !this.isAnimated) {
      this.isClickArrow = true;
    } else if ((target.className === 'dirslider_btRight' || target.className === 'fas fa-angle-right') && !this.isAnimated) {
      this.isClickArrow = true;
    } else {
      if (!this.isAnimated) {
        this.processMouseDown(event);
      }
    }
  }
  @HostListener('touchmove', ['$event']) onTouchMove(event: TouchEvent) {
    if (!this.isAnimated) {
      this.processMouseMove(event);
    }
  }
  @HostListener('touchend', ['$event']) onTouchEnd(event: TouchEvent) {
    const target: any = event.target;
    if (
      (target.className === 'dirslider_bullet' || target.className === 'dirslider_bullet dirslider_activeBullet')
      && this.isClickBullet && !this.isAnimated
    ) {
      this.processClickBullet(target.id);
    } else if (
      (target.className === 'dirslider_btLeft' || target.className === 'fas fa-angle-left')
      && this.isClickArrow && !this.isAnimated
    ) {
      this.processClickArrow(1);
    } else if (
      (target.className === 'dirslider_btRight' || target.className === 'fas fa-angle-right')
      && this.isClickArrow && !this.isAnimated
    ) {
      this.processClickArrow(-1);
    } else {
      this.processMouseUp(event);
    }
    this.isClickBullet = false;
    this.isClickArrow = false;
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
    this.hasMoved = false;
  }

  processMouseMove(event) {
    if (this.isDrag) {
      this.hasMoved = true;
      const diffX = (this.unify(event).clientX - this.parent.offsetLeft) - this.posX;
      const diffY = (this.unify(event).clientY) - this.posY;
      const tmpDiffX = (diffX < 0) ? (diffX * -1) : diffX;
      const tmpDiffY = (diffY < 0) ? (diffY * -1) : diffY;
      // check if scroll or swipe
      if (tmpDiffX > tmpDiffY) {
        this.marginLeftDrag = this.marginLeft + diffX;
        if (this.isInline) {
          // can't swipe out of bounds
          this.marginLeftDrag = (this.marginLeftDrag > 0) ? 0 : this.marginLeftDrag;
          this.marginLeftDrag = ((this.divSlides.offsetWidth - this.containerWidth.width + this.marginLeftDrag) < 0)
          ? this.containerWidth.width - this.divSlides.offsetWidth
          : this.marginLeftDrag;
        }
        // can't swipe more than 1 screen
        if (!this.isInline) {
          if (this.marginLeftDrag < this.marginLeft) {
            if (((this.marginLeftDrag + (this.marginLeft * -1)) * -1) > (this.containerWidth.width)) {
              this.marginLeftDrag = this.marginLeft - (this.containerWidth.width);
            }
          } else {
            if (((this.marginLeft + (this.marginLeftDrag * -1)) * -1) > (this.containerWidth.width)) {
              this.marginLeftDrag = this.marginLeft + (this.containerWidth.width);
            }
          }
        }
        // move only if necessary
        if (this.marginLeftDrag !== this.marginLeft) {
          this.renderer.setStyle(
            this.divSlides,
            'margin-left',
            this.marginLeftDrag + 'px'
          );
        }
      } else {
        if (this.isInline && this.isVertical) {
          this.marginLeftDrag = this.marginLeft + diffY;
          // can't swipe out of bounds
          this.marginLeftDrag = (this.marginLeftDrag > 0) ? 0 : this.marginLeftDrag;
          this.marginLeftDrag = ((this.divSlides.offsetHeight - this.containerWidth.height + this.marginLeftDrag) < 0)
          ? this.containerWidth.height - this.divSlides.offsetHeight
          : this.marginLeftDrag;
          // move only if necessary
          if (this.marginLeftDrag !== this.marginLeft) {
            this.renderer.setStyle(
              this.divSlides,
              'margin-top',
              this.marginLeftDrag + 'px'
            );
          }
        }
      }
    }
  }

  processMouseUp(event) {
    if (this.isDrag) {
      // add transition when drag finished
      this.divSlides.classList.remove('dirslider_noTransition');
      if (!this.isInline) {
        const diff = (this.unify(event).clientX - this.parent.offsetLeft) - this.posX;
        const tmpDiff = (diff < 0) ? (diff * -1) : diff;
        if (tmpDiff <= ((this.containerWidth.width) / 3) && !this.isInline) {
          this.isAnimated = true;
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
      }
      if (this.isInline && this.hasMoved === true) {
        this.marginLeft = this.marginLeftDrag;
        this.hasMoved = false;
      } else {
        this.marginLeftDrag = this.marginLeft;
      }
      this.isDrag = false;
      if (!this.isInline) {
        setTimeout(() => {
          // remove transitions to reconstruct slider
          this.isAnimated = false;
          this.divSlides.classList.add('dirslider_noTransition');
          this.putContent();
        }, 400);
      }
    }
  }

  processClickBullet(index) {
    // user move = stop autoSlide
    clearTimeout(this.timeOut);
    this.userStopAutoSlider = true;
    // move to screen
    this.isAnimated = true;
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
      this.isAnimated = false;
      this.divSlides.classList.add('dirslider_noTransition');
      this.putContent();
    }, 400);
  }

  processAutoSlide() {
    if (this.autoSlide && !this.userStopAutoSlider) {
      this.isAnimated = true;
      this.currentSlide = ((this.currentSlide + 1) > this.nbSlides) ? 0 : this.currentSlide + 1;

      this.renderer.setStyle(
        this.divSlides,
        'margin-left',
        (this.marginLeft - this.containerWidth.width) + 'px'
      );

      setTimeout(() => {
        // remove transitions to reconstruct slider
        this.isAnimated = false;
        this.divSlides.classList.add('dirslider_noTransition');
        this.putContent();
      }, 400);
    } else {
      clearTimeout(this.timeOut);
    }
  }

  processClickArrow(sens) {
    // user move = stop autoSlide
    clearTimeout(this.timeOut);
    this.userStopAutoSlider = true;
    // process move
    this.isAnimated = true;
    if (sens > 0) {
      this.currentSlide = ((this.currentSlide - 1) >= 0) ? this.currentSlide - 1 : this.nbSlides;
    }
    if (sens < 0) {
      this.currentSlide = ((this.currentSlide + 1) > this.nbSlides) ? 0 : this.currentSlide + 1;
    }
    if (!this.isVertical) {
      this.marginLeftDrag = (this.marginLeft + (this.containerWidth.width * sens));
    } else {
      const decal = (this.verticalLimit > 0) ? this.verticalLimit : this.containerWidth.height;
      this.marginLeftDrag = (this.marginLeft + (decal * sens));
    }

    if (this.isInline) {
      // can't swipe out of bounds
      this.marginLeftDrag = (this.marginLeftDrag > 0) ? 0 : this.marginLeftDrag;
      if (!this.isVertical) {
        this.marginLeftDrag = ((this.divSlides.offsetWidth - this.containerWidth.width + this.marginLeftDrag) < 0)
        ? this.containerWidth.width - this.divSlides.offsetWidth
        : this.marginLeftDrag;
      } else {
        this.marginLeftDrag = ((this.divSlides.offsetHeight - this.containerWidth.height + this.marginLeftDrag) < 0)
        ? this.containerWidth.height - this.divSlides.offsetHeight
        : this.marginLeftDrag;
      }
    }

    const marginType = (!this.isVertical) ? 'margin-left' : 'margin-top';
    this.renderer.setStyle(
      this.divSlides,
      marginType,
      this.marginLeftDrag + 'px'
    );

    setTimeout(() => {
      // remove transitions to reconstruct slider
      this.isAnimated = false;
      this.divSlides.classList.add('dirslider_noTransition');
      this.putContent();
    }, 400);
  }

}
