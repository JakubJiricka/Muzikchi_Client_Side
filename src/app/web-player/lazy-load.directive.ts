import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[lazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit {

    @Input() scrollTarget: ElementRef;

    @Input('lazyLoad') imgUrl: string;

    constructor(private el: ElementRef) {
    }

    ngAfterViewInit() {
        this.el.nativeElement.setAttribute('src', this.imgUrl);
        this.el.nativeElement.classList.add('ng-lazyloaded');
    }
}
