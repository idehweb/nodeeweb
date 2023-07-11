import store from "#c/functions/store";
// console.log('store',store)
import constants from '../constants';
// console.log('constants',constants)

export default (domComponents, config = {}) => {

    let theOptions = [];
    if(store.allCategories)
        store.allCategories.map((item)=>{
            return theOptions.push({
                id:item._id,
                name:item.slug,
            })
        })
    console.log("theOptions",store,theOptions)
    const defaultType = domComponents.getType('default');
    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;
    const {
        containerName,
        wrapperName,
        prevName,
        nextName,
        paginationName,
        scrollbarName,
        wrapperSelector,
        prevSelector,
        nextSelector,
        paginationSelector,
        scrollbarSelector,
        containerId,
    } = constants;
// console.log("defaultModel.prototype.defaults",defaultModel.prototype.defaults)
// console.log(constants)
    domComponents.addType(containerName, {

        model: defaultModel.extend({
            defaults: {
                ...defaultModel.prototype.defaults,

                name: 'the Product Slider',

                // Properties
                categoryId: null,
                initialSlide: '0',
                speed: 300,
                slidesPerView: 6,
                spaceBetween: '1',
                slidesPerGroup: 1,
                slidesOffsetBefore: '0',
                slidesOffsetAfter: '0',
                direction: 'horizontal',
                effect: 'slide',
                autoHeight: false,
                watchOverflow: true,
                centeredSlides: false,
                loop: false,
                pagination: 'none',
                scrollbar: false,

                // Autoplay
                autoplay: true,
                autoplayDelay: 3000,
                autoplayStopOnLastSlide: false,
                autoplayDisableOnInteraction: true,
                autoplayReverseDirection: false,
                autoplayWaitForTransition: true,

                // Small
                smallSlidesPerView: 4,
                smallSpaceBetween: '1',
                smallSlidesPerGroup: 4,

                // Medium
                mediumSlidesPerView: 5,
                mediumSpaceBetween: '1',
                mediumSlidesPerGroup: 5,

                // Large
                largeSlidesPerView: 5,
                largeSpaceBetween: '1',
                largeSlidesPerGroup: 5,

                traits: [
                    {
                        type: 'text',
                        label: 'category id',
                        name: 'categoryId',
                        changeProp: 1,
                    },
                    {
                        type: 'number',
                        label: 'Initial Slide',
                        name: 'initialSlide',
                        changeProp: 1,
                    },
                    {
                        type: 'number',
                        label: 'Speed',
                        name: 'speed',
                        changeProp: 1,
                    },
                    {
                        type: 'number',
                        label: 'Slides Per View',
                        name: 'slidesPerView',
                        changeProp: 6,
                    },
                    {
                        type: 'number',
                        label: 'Space Between',
                        name: 'spaceBetween',
                        changeProp: 1,
                    },
                    {
                        type: 'number',
                        label: 'Slides Per Group',
                        name: 'slidesPerGroup',
                        changeProp: 6,
                    },
                    {
                        type: 'number',
                        label: 'Slides Offset Before',
                        name: 'slidesOffsetBefore',
                        changeProp: 1,
                    },
                    {
                        type: 'number',
                        label: 'Slides Offset After',
                        name: 'slidesOffsetAfter',
                        changeProp: 1,
                    },
                    {
                        type: 'checkbox',
                        label: 'Autoplay',
                        name: 'autoplay',
                        changeProp: 1,
                    },
                    {
                        type: 'number',
                        label: 'Autoplay Delay',
                        name: 'autoplayDelay',
                        changeProp: 1,
                    },
                    {
                        type: 'checkbox',
                        label: 'Autoplay stop on Last slide',
                        name: 'autoplayStopOnLastSlide',
                        changeProp: 1,
                    },
                    {
                        type: 'checkbox',
                        label: 'Autoplay disable on interaction',
                        name: 'autoplayDisableOnInteraction',
                        changeProp: 1,
                    },
                    {
                        type: 'checkbox',
                        label: 'Autoplay reverse direction',
                        name: 'autoplayReverseDirection',
                        changeProp: 1,
                    },
                    {
                        type: 'checkbox',
                        label: 'Autoplay wait for transition',
                        name: 'autoplayWaitForTransition',
                        changeProp: 1,
                    },
                    {
                        type: 'select',
                        label: 'Direction',
                        name: 'direction',
                        changeProp: 1,
                        options: [
                            'horizontal',
                            'vertical',
                        ]
                    },
                    {
                        type: 'select',
                        label: 'Transition effect',
                        name: 'effect',
                        changeProp: 1,
                        options: [
                            'slide',
                            'fade',
                            'cube',
                            'coverflow',
                            'flip',
                        ]
                    },
                    {
                        type: 'checkbox',
                        label: 'Auto Height',
                        name: 'autoHeight',
                        changeProp: 1,
                    },
                    {
                        type: 'checkbox',
                        label: 'Watch Overflow',
                        name: 'watchOverflow',
                        changeProp: 1,
                    },
                    {
                        type: 'checkbox',
                        label: 'Centered Slides',
                        name: 'centeredSlides',
                        changeProp: 1,
                    },
                    {
                        type: 'checkbox',
                        label: 'Loop',
                        name: 'loop',
                        changeProp: 1,
                    },
                    {
                        type: 'checkbox',
                        label: 'Scrollbar',
                        name: 'scrollbar',
                        changeProp: 1,
                    },
                    {
                        type: 'select',
                        label: 'Pagination',
                        name: 'pagination',
                        changeProp: 1,
                        options: [
                            'none',
                            'bullets',
                            'fraction',
                            'progressbar',
                        ]
                    },

                    // Small
                    {
                        type: 'number',
                        label: 'Small Slides Per View',
                        name: 'smallSlidesPerView',
                        changeProp: 1,
                    },
                    {
                        type: 'number',
                        label: 'Small Space Between',
                        name: 'smallSpaceBetween',
                        changeProp: 1,
                    },
                    {
                        type: 'number',
                        label: 'Small Slider Per Group',
                        name: 'smallSlidesPerGroup',
                        changeProp: 1,
                    },

                    // Medium
                    {
                        type: 'number',
                        label: 'Medium Slides Per View',
                        name: 'mediumSlidesPerView',
                        changeProp: 5,
                    },
                    {
                        type: 'number',
                        label: 'Medium Space Between',
                        name: 'mediumSpaceBetween',
                        changeProp: 1,
                    },
                    {
                        type: 'number',
                        label: 'Medium Slider Per Group',
                        name: 'mediumSlidesPerGroup',
                        changeProp: 5,
                    },

                    // Large
                    {
                        type: 'number',
                        label: 'Large Slides Per View',
                        name: 'largeSlidesPerView',
                        changeProp: 6,
                    },
                    {
                        type: 'number',
                        label: 'Large Space Between',
                        name: 'largeSpaceBetween',
                        changeProp: 1,
                    },
                    {
                        type: 'number',
                        label: 'Large Slider Per Group',
                        name: 'largeSlidesPerGroup',
                        changeProp: 6,
                    },
                ],

                droppable: `${wrapperSelector}, ${prevSelector}, ${nextSelector}, ${scrollbarSelector}, ${paginationSelector}}`,

                draggable: true,

                style: {
                    'min-height': '100px;',
                    'position': 'relative;',
                },

                'script-deps': config.script,
                'style-deps': config.style,
                'class-container': config.classContainer,
                'class-wrapper': config.classWrapper,
                'class-prev': config.classPrev,
                'class-next': config.classNext,
                'class-pagination': config.classPagination,
                'class-scrollbar': config.classScrollbar,
                ...config.sliderProps,

                script:function(){
                    const el = this;
                    const scriptDeps = '{[ script-deps ]}';
                    const styleDeps = '{[ style-deps ]}';
                    const falsies = ['0', 'false', 'none'];
                    const truthies = ['1', 'true'];
                    const elId = el.getAttribute('id');

                    const options = {
                        initialSlide: parseInt('{[ initialSlide ]}', 10),
                        speed: parseInt('{[ speed ]}', 10),
                        slidesPerView: parseInt('{[ slidesPerView ]}', 10),
                        spaceBetween: parseInt('{[ spaceBetween ]}', 10),
                        slidesPerGroup: parseInt('{[ slidesPerGroup ]}', 10),
                        slidesOffsetBefore: parseInt('{[ slidesOffsetBefore ]}', 10),
                        slidesOffsetAfter: parseInt('{[ slidesOffsetAfter ]}', 10),
                        direction: '{[ direction ]}',
                        effect: '{[ effect ]}',
                        autoHeight: isNaN('{[ autoHeight ]}'),
                        watchOverflow: isNaN('{[ watchOverflow ]}'),
                        centeredSlides: isNaN('{[ centeredSlides ]}'),
                        loop: isNaN('{[ loop ]}'),
                        navigation: {
                            nextEl: `#${elId} .swiper-button-next`,
                            prevEl: `#${elId} .swiper-button-prev`,
                        },
                        breakpointsInverse: true,
                        breakpoints: {
                            576: {
                                slidesPerView: parseInt('{[ smallSlidesPerView ]}', 10),
                                spaceBetween: parseInt('{[ smallSpaceBetween ]}', 10),
                                slidesPerGroup: parseInt('{[ smallSlidesPerGroup ]}', 10),
                            },
                            768: {
                                slidesPerView: parseInt('{[ mediumSlidesPerView ]}', 10),
                                spaceBetween: parseInt('{[ mediumSpaceBetween ]}', 10),
                                slidesPerGroup: parseInt('{[ mediumSlidesPerGroup ]}', 10),
                            },
                            992: {
                                slidesPerView: parseInt('{[ largeSlidesPerView ]}', 10),
                                spaceBetween: parseInt('{[ largeSpaceBetween ]}', 10),
                                slidesPerGroup: parseInt('{[ largeSlidesPerGroup ]}', 10),
                            },
                        }
                    };

                    if (!falsies.includes('{[ pagination ]}')) {
                        options.pagination = {
                            el: `#${elId} .swiper-pagination`,
                            type: '{[ pagination ]}',
                        };
                    }

                    if (truthies.includes('{[ autoplay ]}')) {
                        options.autoplay = {
                            delay: '{[ autoplayDelay ]}',
                            stopOnLastSlide: '{[ autoplayStopOnLastSlide ]}',
                            disableOnInteraction: '{[ autoplayDisableOnInteraction ]}',
                            reverseDirection: '{[ autoplayReverseDirection ]}',
                            waitForTransition: '{[ autoplayWaitForTransition ]}',
                        };
                    }

                    if (isNaN('{[ scrollbar ]}')) {
                        options.scrollbar = {
                            el: `#${elId} .swiper-scrollbar`,
                            draggable: true,
                        };
                    }

                    const initSlider = function () {
                        // console.clear()
                        console.log("initSlider",options,el)
                        window.sliderSwiper = new Swiper(el, options);
                    };

                    if (scriptDeps && typeof Swiper == 'undefined') {
                        // Load the style tag
                        var style = document.createElement('link');
                        style.rel = 'stylesheet';
                        style.href = styleDeps;
                        document.head.appendChild(style);

                        // Load the script tag
                        var script = document.createElement('script');
                        script.src = scriptDeps;
                        script.onload = initSlider;
                        document.head.appendChild(script);
                    } else {
                        initSlider();
                    }
                },
            },
        }, {
            isComponent(el) {
                if (el.hasAttribute && el.hasAttribute(containerId)) {
                    return {type: containerName};
                }
            },
        }),

        view: defaultView.extend({
            init() {
                const props = [
                    'initialSlide',
                    'speed',
                    'slidesPerView',
                    'spaceBetween',
                    'slidesPerGroup',
                    'slidesOffsetBefore',
                    'slidesOffsetAfter',
                    'direction',
                    'effect',
                    'autoHeight',
                    'watchOverflow',
                    'centeredSlides',
                    'loop',
                    'pagination',
                    'scrollbar',
                    'autoplay',
                    'autoplayDelay',
                    'autoplayStopOnLastSlide',
                    'autoplayDisableOnInteraction',
                    'autoplayReverseDirection',
                    'autoplayWaitForTransition',

                    // Small
                    'smallSlidesPerView',
                    'smallSpaceBetween',
                    'smallSlidesPerGroup',

                    // Medium
                    'mediumSlidesPerView',
                    'mediumSpaceBetween',
                    'mediumSlidesPerGroup',

                    // Large
                    'largeSlidesPerView',
                    'largeSpaceBetween',
                    'largeSlidesPerGroup',
                ];

                const reactTo = props.map(prop => `change:${prop}`).join(' ');
                this.listenTo(this.model, reactTo, this.render);
                const comps = this.model.components();

                // Add a basic template if it's not yet initialized
                if (!comps.length) {
                    comps.add(`
                            <div data-gjs-type="${wrapperName}" class="hgffghgfd">${config.slideEls}</div>
                            <div data-gjs-type="${prevName}"></div>
                            <div data-gjs-type="${nextName}"></div>
                            <div data-gjs-type="${paginationName}"></div>
                            <div data-gjs-type="${scrollbarName}"></div>
                          `
                    );
                }
            },
        }),
    });
}
