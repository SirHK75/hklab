/* tslint:disable:member-ordering */
import { Directive, ElementRef, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {

  @Input('appTooltip') tooltipData: any;

  parent: any;
  tooltip: any = null;
  margin = 10;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) {
    this.parent = this.el.nativeElement;
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) {
    if (this.tooltipData !== '') {
      this.tooltip = document.createElement('div');
      this.tooltip.id = 'tooltip_' + Math.random().toString(36).substr(2, 9);
      this.tooltip.className = 'tooltip';
      this.tooltip.innerHTML = this.tooltipData;
      document.body.appendChild(this.tooltip);
      this.renderer.setStyle(this.tooltip, 'left', event.pageX + 'px');
      this.renderer.setStyle(this.tooltip, 'top', event.pageY + 'px');
    }
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.tooltip && this.tooltipData !== '') {
      this.renderer.setStyle(this.tooltip, 'opacity', 1);
      this.renderer.setStyle(this.tooltip, 'left', (event.pageX - (this.tooltip.offsetWidth / 2)) + 'px');
      this.renderer.setStyle(this.tooltip, 'top', (event.pageY - this.margin - this.tooltip.offsetHeight) + 'px');
    }
  }

  @HostListener('mouseout') onMouseOut() {
    if (this.tooltip !== null) {
      document.body.removeChild(this.tooltip);
      this.tooltip = null;
    }
  }
}
