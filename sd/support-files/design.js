var DESIGN = DESIGN || {};

DESIGN.responsiveNav = function() {
    function hasClass(el, className) {
        var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)");
        return regexp.test(el.className);
    }

    function addClass(el, className) {
        if (!hasClass(el, className)) {
            el.className = el.className + " " + className;
        }
    }

    function removeClass(el, className) {
        var re = new RegExp("(^|\\s)" + className + "(\\s|$)");
        while (re.test(el.className)) { // in case multiple occurrences
            el.className = el.className.replace(re, ' ');
        }
        el.className = el.className.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    var responsiveNavWrappers = document.querySelectorAll(".ResponsiveNavWrapper");

    if (responsiveNavWrappers) {
        var body = document.querySelector("body");
        setTimeout(function() {
            addClass(body, 'ResponsiveNavReady');
        }, 100);

        function triggerResponsiveNav (config) {
            var pageWrapper = document.querySelector("#PageWrapper");
            if (hasClass(config.responsiveNavWrapper, 'ResponsiveNavActive')) {
                // close
                config.responsiveNavButton.innerHTML = config.responsiveText;
                removeClass(config.responsiveNavWrapper, 'ResponsiveNavActive');
                removeClass(config.responsiveNavWrapper, 'ResponsiveNavActivated');
                removeClass(body, 'ResponsiveNavActivated');
                pageWrapper.style.height = "auto";
                clearTimeout(config.timer);
            } else {
                // open
                config.responsiveNavButton.innerHTML = '<span>&#x2715;</span>';
                addClass(config.responsiveNavWrapper, 'ResponsiveNavActive');
                config.timer = setTimeout(function() {
                    addClass(config.responsiveNavWrapper, 'ResponsiveNavActivated');
                    addClass(body, 'ResponsiveNavActivated');
                    pageWrapper.style.height = config.responsiveNav.offsetHeight + "px";
                }, 500);
            }
        }

        function switchOffHorizontal() {
            var responsiveNavs = document.querySelectorAll('.ResponsiveNav');
            for (var i = 0, ilen = responsiveNavs.length; i < ilen; i++) {
                var responsiveNav = responsiveNavs[i];
                if (window.innerWidth <= 768) {
                    if (hasClass(responsiveNav, 'HorizontalNavBar') && !hasClass(responsiveNav, 'HorizontalNavBarOff')) {
                        removeClass(responsiveNav, 'HorizontalNavBar');
                        addClass(responsiveNav, 'HorizontalNavBarOff');
                    }
                    if (hasClass(responsiveNav, 'HorizontalNavBarCenter') && !hasClass(responsiveNav, 'HorizontalNavBarCenterOff')) {
                        removeClass(responsiveNav, 'HorizontalNavBarCenter');
                        addClass(responsiveNav, 'HorizontalNavBarCenterOff');
                    } else if (hasClass(responsiveNav, 'HorizontalNavBarLeft') && !hasClass(responsiveNav, 'HorizontalNavBarLeftOff')) {
                        removeClass(responsiveNav, 'HorizontalNavBarLeft');
                        addClass(responsiveNav, 'HorizontalNavBarLeftOff');
                    } else if (hasClass(responsiveNav, 'HorizontalNavBarRight') && !hasClass(responsiveNav, 'HorizontalNavBarRightOff')) {
                        removeClass(responsiveNav, 'HorizontalNavBarRight');
                        addClass(responsiveNav, 'HorizontalNavBarRightOff');
                    }
                } else {
                    if (hasClass(responsiveNav, 'HorizontalNavBarOff') && !hasClass(responsiveNav, 'HorizontalNavBar')) {
                        removeClass(responsiveNav, 'HorizontalNavBarOff');
                        addClass(responsiveNav, 'HorizontalNavBar');
                    }
                    if (hasClass(responsiveNav, 'HorizontalNavBarCenterOff') && !hasClass(responsiveNav, 'HorizontalNavBarCenter')) {
                        removeClass(responsiveNav, 'HorizontalNavBarCenterOff');
                        addClass(responsiveNav, 'HorizontalNavBarCenter');
                    } else if (hasClass(responsiveNav, 'HorizontalNavBarLeftOff') && !hasClass(responsiveNav, 'HorizontalNavBarLeft')) {
                        removeClass(responsiveNav, 'HorizontalNavBarLeftOff');
                        addClass(responsiveNav, 'HorizontalNavBarLeft');
                    } else if (hasClass(responsiveNav, 'HorizontalNavBarRightOff') && !hasClass(responsiveNav, 'HorizontalNavBarRight')) {
                        removeClass(responsiveNav, 'HorizontalNavBarRightOff');
                        addClass(responsiveNav, 'HorizontalNavBarRight');
                    }
                }
            }
        }

        for (var i = 0, ilen = responsiveNavWrappers.length; i < ilen; i++) {
            var responsiveNavWrapper = responsiveNavWrappers[i];
            var responsiveNavButton = responsiveNavWrapper.querySelector(".ResponsiveNavButton");

            (function (responsiveNavWrapper, responsiveNavButton) {
                if (responsiveNavButton) {
                    var responsiveNav = responsiveNavWrapper.querySelector(".ResponsiveNav");
                    var responsiveText = responsiveNavButton.innerHTML;

                    FIX.addEventListener(responsiveNavButton, 'click', function () {
                        var timer;
                        triggerResponsiveNav (
                            {
                                responsiveNavWrapper: responsiveNavWrapper,
                                responsiveNavButton: responsiveNavButton,
                                responsiveText: responsiveText,
                                responsiveNav: responsiveNav,
                                timer: timer
                            }
                        );
                    });
                    FIX.addEventListener(window, 'resize', function () {
                        switchOffHorizontal();
                    });
                    switchOffHorizontal();
                }
            }(responsiveNavWrapper, responsiveNavButton));
        }
    }
};

DESIGN.fixFloatedImages = function() {
    if (document.documentElement.clientWidth > 900) {
        return;
    }
    var images = document.querySelectorAll('#ContentColumn .Liner > .ImageBlockLeft > img, #ContentColumn .Liner > .ImageBlockRight > img, #ContentColumn .Liner > .ImageBlockLeft > a > img, #ContentColumn .Liner > .ImageBlockRight > a > img, #ContentColumn .Liner > .ImageBlockLeft > .noalignment > a > img, #ContentColumn .Liner > .ImageBlockRight > .noalignment > a > img, #ContentColumn .Liner > .ImageBlockLeft > .noalignment > img, #ContentColumn .Liner > .ImageBlockRight > .noalignment > img');
    var width = 0;
    var originalAttributeWidth = 0;
    var widthAttribute;
    var parent = null;
    var noalignmentNode = null;
    var captionEl = null;
    var contentColumnLiner = document.querySelector('#ContentColumn .Liner');
    var style = window.getComputedStyle(contentColumnLiner, null);
    var contentColumnLinerWidth = (contentColumnLiner.clientWidth - parseInt(style.getPropertyValue('padding-left'), 10) - parseInt(style.getPropertyValue('padding-right'), 10));

    function centerImage(img) {
        img.style.display = "";
        if ((img.width / contentColumnLinerWidth) > 0.75) {
            parent = img.parentNode;
            if (parent.tagName === 'A') {
                parent = parent.parentNode;
            }
            if (parent.className === 'noalignment') {
                noalignmentNode = parent;
                parent = parent.parentNode;
            }
            if (parent.className.match(/ImageBlockLeft|ImageBlockRight/i)) {
                parent.className = parent.className.replace(/ImageBlockLeft|ImageBlockRight/i, 'ImageBlockCenter');

                originalAttributeWidth = img.getAttribute("data-width");
                if (originalAttributeWidth) {
                    width = parseInt(originalAttributeWidth, 10);
                }
                else {
                    width = img.naturalWidth;
                }
                if (width === 0) {
                    return;
                }

                if (width > contentColumnLinerWidth) {
                    img.removeAttribute('width');
                }

                captionEl = img.parentNode.querySelector(".Caption");
                if (captionEl) {
                    if (captionEl) {
                        captionEl.style.marginLeft = 'auto';
                        captionEl.style.marginRight = 'auto';
                    }
                }
            }
        }
    }

    for (var i = 0, ilen = images.length; i < ilen; i++) {
        widthAttribute = images[i].getAttribute('width');
        if ((widthAttribute !== null) && (widthAttribute[widthAttribute.length - 1] === '%')) {
            // skip images that already uses percentage width values
            continue;
        }
        (function(img) {
            if(img.complete) {
                centerImage(img);
            } else {
                img.onload = function() {
                    centerImage(img);
                }
            }
        }(images[i]));
    }
};

DESIGN.fixFloatedImages();
DESIGN.responsiveNav();