$(window).on('load', function () {

});

$(document).ready(function () {
    if (!($('.cNav').find('ul.children li').length)) { $('.cNav').find('ul.children').remove(); }

    var page = $('.page');
    setTimeout(function () {
        page.removeClass('page--loading');
        setTimeout(function () {
            page.find('.page__loader').remove();
            $('#popup').addClass('show');
        }, 250);
    }, 250);

});

$(function () {

    $(document.body).on('click', '.cNavToggle', function () {
        $('.cNav').toggleClass('cNav--visible');
        $(this).toggleClass('cNavToggle--active');
    });

    var postQueryInput = $('#postQueryInput');
    if (postQueryInput.length) {
        var postQueryContainer = $('#ajaxResult');
        ajaxGetPost(postQueryInput.data('query'), postQueryContainer);
        filter_category(postQueryInput, postQueryContainer);
        filter_search(postQueryInput, postQueryContainer);
    }

    var numCounterCnt = $('[data-number-counter]');

    $(window).on('load resize scroll', function () {
        if (numCounterCnt.length) {
            numCounterCnt.each(function () {
                if ($(this).isInViewport()) {
                    numberCounter($(this));
                }
            });
        }
    });

    //Popup
    $('body').on('click', '[data-popup-close]', function () {
        $(this).closest('.popupContainer').removeClass('popupContainer--visible');
        setTimeout(function () {
            $(this).closest('.popupContainer').remove();
        }, 600);
        return false;
    });

});

function addLoader(el) {
    el.addClass('ajaxLoading');
    setTimeout(function () {
        el.addClass('ajaxLoading--isLoading');
    }, 5);
}

function removeLoader(el) {
    el.removeClass('ajaxLoading--isLoading');
    setTimeout(function () {
        el.removeClass('ajaxLoading');
    }, 150);
}

function alterHTML() {
    var group = $('.wp-block-group');
    if (group.length) {
        group.each(function () {
            var g = $(this);
            g.wrapInner('<div class="row"></div>');
            g.removeClass('wp-block-group');
        });
    }

    var h1 = $('h1');
    if (h1.length) {
        h1.each(function () {
            var e = $(this);
            if (!e.closest('.title').length && !e.hasClass('default')) e.wrap('<div class="title"></div>');
        });
    }

    var sideNav = $('.sideNav');
    if (sideNav.length) {

        var sectionBC = $('.section--bc');
        if (sectionBC.length && !sectionBC.find('.cNav').length) {
            sectionBC.find('.row').prepend('<nav data-mobile class="cNav">' + sideNav.html() + '</nav>');
            sectionBC.find('.row').prepend('<div data-mobile><div class="cNavTrigger text--right"><button class="button button--reset pa-4 pr-3 button--sm cNavToggle"><strong>MENI</strong><i class="icon-menu ml-4"></i></button></div></div>');
            sectionBC.find('.cNav ul').removeClass('ul--bb');
        }
    }

    var sideNavSub = $('.sideNav.sideNav--sub');
    if (sideNavSub.length) {
        sideNavSub.find('li').each(function () {
            var li = $(this);
            if (li.hasClass('page_item_has_children')) {
                if (li.find('>ul.children>li').length > 0) {
                    li.find('> a').append('<button class="subNavToggle" aria-expanded="false"></button>');
                }
                if (li.hasClass('current_page_item') || li.hasClass('current_page_parent') || li.hasClass('current_page_ancestor')) {
                    li.addClass('is--active').find('>a>button').attr('aria-expanded', 'true');
                }
            }
            if (li.hasClass('current_page_item')) {
                li.closest('.page_item_has_children').addClass('is--active').find('>a>button').attr('aria-expanded', 'true');
            }

        });
        $('.subNavToggle').on('click', function () {
            $(this).closest('li').toggleClass('is--active');
            if ($(this).closest('.stickyContainer').length) {

                $('.stickyContainer').sticky('update');

            }
            return false;
        });
    }

    var nav = $('.cNav');
    if (nav.length) {
        nav.each(function () {
            var e = $(this),
                c = e.find('li.page_item_has_children');
            e.find('li.page_item_has_children > a').append('<button class="subMenuToggle" aria-expanded="false"></button>');

            c.each(function () {
                var ce = $(this);
                if (!ce.find('> ul.children > li').length) {
                    ce.find('> ul.children').remove();
                }
                if (ce.find('>button').length && !ce.find('>button + ul.children').length) {
                    button_to_link($(this).find('>button'));
                }

                if (ce.find('>ul').length) {
                    ce.find('>ul button').each(function () {
                        button_to_link($(this));
                    });
                }
            });

            if (e.closest('.section--bc')) {
                e.attr('data-count', e.find('> ul > li').length);
            }
        });
    }

    function button_to_link($el) {
        return $el;
        var $button = $el;
        var href = $button.data('href') || '#';
        var text = $button.text();

        var $link = $('<a>', {
            href: href,
            class: $button.attr('class'),
            html: text
        });

        $button.replaceWith($link);
    }

    var wpAdminRow = $('#wpadminbar');
    if (wpAdminRow.length) {
        $('body').addClass('wp-admin-toolbar');
    }

    var table = $('table');
    if (table.length) {
        table.each(function () {
            $(this).addClass('wp-block-table is-style-stripes');
        });
    }
}

function ajaxGetPost(args, container) {
    var ajax = $.ajax({
        type: 'POST',
        url: themeOBJ.ajax_url,
        data: args,
        dataType: 'json',
    });
    container.addClass('is--loading');
    ajax.done(function (response) {
        var data = response.data;

        container.html(data.html);

        $('.loadMoreButton').on('click', function () {
            args.paged = args.paged + 1;
            ajaxGetPost(args, container);
        });

        container.removeClass('is--loading');
        $('#postNumOfResults').text(data.num_posts);

    });

    ajax.fail(function (jqXHR, textStatus) {
        console.log('Request failed: ' + textStatus);
    });
}

function numberCounter(el) {
    var num = el.attr('data-number-counter');
    if (num > 0) {
        $({ Counter: 0 }).animate({
            Counter: num
        }, {
            duration: 2000,
            easing: 'swing',
            step: function () {
                el.text(Math.ceil(this.Counter));
            },
            start: function () {
                el.attr('data-number-counter', 0);
            },
            complete: function () {
                el.attr('data-number-counter', 0);
            }
        });
    }
}

function ajaxGetDocuments(args, container) {
    var ajax = $.ajax({
        type: 'POST',
        url: themeOBJ.ajax_url,
        data: args,
        dataType: 'json',
    });
    container.addClass('is--loading');
    ajax.done(function (response) {
        var data = response.data;

        container.html('<div>' + data.html + '</div>');

        container.removeClass('is--loading');
        $('#postNumOfResults').text(data.num_posts);

        //File accordion
        var fileBlockAccordionTrigger = $('.fileBlockAccordion__trigger');
        if (fileBlockAccordionTrigger.length) {
            fileBlockAccordionTrigger.on('click', function () {
                var el = $(this),
                    parent = el.closest('.fileBlockAccordion');

                if (parent.hasClass('is--active')) {
                    parent.removeClass('is--active');
                } else {
                    $('.fileBlockAccordion.is--active').removeClass('is--active');
                    parent.addClass('is--active');
                }
            });
        }

    });

    ajax.fail(function (jqXHR, textStatus) {
        console.log('Request failed: ' + textStatus);
    });
}

function filter_category(input, container) {
    var category_input = $('select[name="filter_category"]'),
        query = input.data('query');

    category_input.on('change', function () {
        var value = parseInt($(this).val());
        query.cat = value;
        ajaxGetPost(query, container);
        input.attr('data-query', JSON.stringify(query));
    });
}

function filter_search(input, container) {
    var search_input = $('input[name="filter_searchTerm"]'),
        form = $('#postSearchForm'),
        query = input.data('query');

    search_input.on('keyup', function (e) {
        var input_value = $(this).val();
        if (!input_value) {
            query.s = null;
            ajaxGetPost(query, container);
            input.attr('data-query', JSON.stringify(query));
        }
    });

    form.on('submit', function () {
        var input_value = search_input.val();
        if (input_value.length > 0) {
            query.s = input_value;
            ajaxGetPost(query, container);
            input.attr('data-query', JSON.stringify(query));
        }
        return false;
    });
}

function filter_search_all(input, container) {
    var search_input = $('input[name="input_search"]'),
        form = search_input.closest('form'),
        query = input.data('query');

    form.on('submit', function () {
        var input_value = sanitizeInput(search_input.val());
        //if(input_value.length > 0){
        query.cpt = form.find('input[name="cpt"]:checked').val();
        query.s = input_value;
        ajaxGetPost(query, container);
        input.attr('data-query', JSON.stringify(query));
        //}
        return false;
    });
}

function sanitizeInput(input) {
    input = input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return input;
}

function filter_file_category(input, container) {
    var category_input = $('select[name="filter_category"]'),
        query = input.data('query');

    category_input.on('change', function () {
        var value = parseInt($(this).val());
        query.cat = value;
        ajaxGetDocuments(query, container);
        input.attr('data-query', JSON.stringify(query));
    });
}

function filter_file_search(input, container) {
    var search_input = $('input[name="filter_searchTerm"]'),
        form = $('#postSearchForm'),
        query = input.data('query');

    search_input.on('keyup', function (e) {
        var input_value = $(this).val();
        if (!input_value) {
            query.s = null;
            ajaxGetDocuments(query, container);
            input.attr('data-query', JSON.stringify(query));
        }
    });

    form.on('submit', function () {
        var input_value = search_input.val();
        if (input_value.length > 0) {
            query.s = input_value;
            ajaxGetDocuments(query, container);
            input.attr('data-query', JSON.stringify(query));
        }
        return false;
    });
}

$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

$(function () {

    let $header = $('.header'), $body = $('body');

    // Dropdown menu
    $('.dropdown__trigger > button[aria-expanded]').on('click', function (e) {
        e.preventDefault();
        let $el = $(this), $parent = $el.closest('.dropdown'), is_dense = $parent.hasClass('dropdown--hmiDesktop'), $container = $el.closest('.dropdownWrapper'), $menu = $parent.find('.dropdown__content'), is_visible = $el.attr('aria-expanded') === 'true';

        //if(!is_visible) close_dropdown();

        $parent.toggleClass('dropdown--active');
        $container.toggleClass('dropdown--active-parent');

        if (is_dense) {
            let $el_child = $el.closest('.dropdown').find('.dropdown__content .dropdown__trigger button[aria-expanded]');
            $el_child.focus();
            toggle_aria_expanded($el_child, !is_visible);
        }

        toggle_aria_expanded($el, !is_visible);
    });

    // Main nav
    $('.mainNav > ul > li > button[aria-expanded]').on('click', function (e) {
        e.preventDefault();

        let $el = $(this), $menu = $el.parent().find('.mainNav__subMenu'), is_visible = $el.attr('aria-expanded') === 'true';

        if (!is_visible) close_mega_menus();

        toggle_aria_expanded($el, !is_visible);
        toggle_aria_hidden($menu, is_visible);
    });

    // Mobile nav
    $('.navToggle').on('click', function (e) {
        e.preventDefault();

        let $el = $(this);

        toggle_aria_expanded($el, !$header.hasClass('header--navVisible'));

        $header.toggleClass('header--navVisible');
        $body.toggleClass('overflow--hidden');
    });

    // Subpage nav
    $('.cNav button[aria-expanded], .sideNav button[aria-expanded]').on('click', function (e) {
        e.preventDefault();

        let $el = $(this), $menu = $el.parent().find('> ul.children'), is_visible = $el.attr('aria-expanded') === 'true';

        //close_ribbon_nav();

        toggle_aria_expanded($el, !is_visible);
        toggle_aria_hidden($menu, is_visible);
    });

    // Sogo toggle
    let $accessibility_btn = $('#open_sogoacc'), $accessibility_container = $('#sogoacc');
    if ($accessibility_btn.length && $accessibility_container.length) {
        $('.triggerAccessibilityControls').on('click', function (e) {
            e.preventDefault();
            $accessibility_btn.trigger('click');
        });
    }

    // Skip to content
    $('.skip-to-content-btn').on('click', function (e) {
        e.preventDefault();
        get_first_focusable_element($('main')).focus();
    });

    // Skip segment
    $('.skip-section-btn').on('click', function (e) {
        e.preventDefault();
        let $parent = $(this).closest('section');
        get_first_focusable_element($parent.nextAll()).focus();
    });

    // Search
    $('.searchToggle').on('click keydown', function (e) {

        if (e.type === 'keydown' && e.keyCode === 9) return;
        e.preventDefault();
        if (e.type === 'keydown' && (e.keyCode !== 32 && e.keyCode !== 13)) return;

        let $el = $(this), $container = $('.header__search'), is_visible = $el.attr('aria-expanded') === 'true';

        $('.header').toggleClass('header--searchVisible');

        if (!is_visible) {
            $el.addClass('is-clicked');
            $container.find('input:not(:checked)').first().focus();
            setTimeout(() => { $el.removeClass('is-clicked') }, 50)
        }

        toggle_aria_expanded($el, !is_visible);
        toggle_aria_hidden($container, is_visible);
    });

    // TAB / TRAP FOCUS
    $(document).on('focusout', '.dropdown__content', function (e) {
        let $el = $(this);
        if (!$el.is(':focus-within')) $el.find('.dropdown__trigger > button[aria-expanded]').focus();
        setTimeout(() => { if (!$('.dropdown').has(document.activeElement).length) $('.dropdown--active .dropdown__trigger .button').focus() }, 0);
    });

    $(document).on('focusout', '.mainNav__subMenu', function (e) {
        if (!$(this).is(':focus-within')) $(this).parent().find('button[aria-expanded]').focus();
    });

    $(document).on('focusout', '.searchToggle:not(.is-clicked)', function (e) {
        console.log(e);
        if (!$(this).is(':focus-within') && $('.header--searchVisible').length) $('.header__search').find('input:not(:checked)').first().focus();
    });

    $(document).on('focusout', '.header__search', function (e) {
        if (!$(this).is(':focus-within')) $('.searchToggle').focus();
    });

    $(document).on('focusout', '#sogoacc', function (e) {
        if (!$(this).is(':focus-within')) $('#sogoacc').hide();
    });

    $(document).on('focusout', '.header__mobileNav', function (e) {
        if (!$(this).is(':focus-within')) $('.navToggle').focus();
    });

    $(document).on('focusout', '.popup', function (e) {
        if (!$(this).is(':focus-within')) get_first_focusable_element($(this)).focus();
    });

    $(document).on('focusout', '.cDiagramPopup.is-visible', function (e) {
        if (!$(this).is(':focus-within')) get_first_focusable_element($(this)).focus();
    });

    $(document).on('focusout', '.cNav', function (e) {
        if (!$(this).is(':focus-within')) close_ribbon_nav();
    });

    $(document).on('keydown', '.search-form', function (e) {
        if (e.keyCode === 13 && !$(e.target).is("input[type='search'], button")) {
            e.preventDefault();
        }
    });

    // Slider focus
    let $slider_active_thumb_focus = null;

    $('.cSlider').on('focusout', function () {
        if (!$(this).is(':focus-within')) $slider_active_thumb_focus = null;
    });

    $(document).on('focusin', '.ctB ', function () {
        $(this).data('isFocused', true);
    }).on('focusout', '.ctB ', function () {
        $(this).removeClass('focused-click').removeData('isFocused');
    }).on('click', '.ctB ', function () {
        if ($(this).data('isFocused')) {
            $(this).addClass('focused-click');
        }
    });

    $(document).on('focusout', '.ctB.focused-click', function (e) {
        let $el = $(this);
        if (!$el.is(':focus-within')) {
            let $parent = $el.closest('.cSlider');
            $parent.find('.owl-item.active a:first').focus();
            $slider_active_thumb_focus = $el;
        }
    })

    $(document).on('focusout', '.cSlider .buttonContainer', function (e) {
        let $el = $(this), $parent = $el.closest('.cSlider');

        if (!$slider_active_thumb_focus) return;

        if (!$el.is(':focus-within')) {
            if ($slider_active_thumb_focus && $slider_active_thumb_focus.length) {
                if ($slider_active_thumb_focus.next().length) {
                    $slider_active_thumb_focus.next().focus();
                }
                else {
                    if (!$el.closest('section').nextAll().length) $('.footer').find('a:first').focus();
                    else $el.closest('section').nextAll().find('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').filter(':visible').first().focus();
                    $parent.trigger('focusout');
                }
            }
            else {
                if ($parent.find('.ctB.is--active').length && !$parent.find('.ctB.is--active').is(':last-child')) $parent.find('.ctB.is--active').next().focus();
            }
            $slider_active_thumb_focus = null;
        }
    });

    // ON OUTSIDE CLICK
    $(document).on('click', function (e) {
        let $target = $(e.target);

        if (!$target.closest('.mainNav').length) close_mega_menus();
        if (!$target.closest('.dropdown').length) close_dropdown();
        if (!$target.closest('.cNav').length) close_ribbon_nav();
        if (!$target.closest('.header__search, .searchToggle').length) close_search();
    });

    // ON ESC
    $(document).on('keydown', function (event) {
        if (event.key === "Escape" || event.keyCode === 27) {
            $('#popupContainer').html('');
            close_ribbon_nav();
            close_dropdown();
            close_mega_menus();
            close_search();
            cDiagramClosePopup();
        }
    });


});

function close_search() {
    toggle_aria_expanded($('.searchToggle'), false);
    toggle_aria_hidden($('.header__search'), true);
    $('.header').removeClass('header--searchVisible');
}

function close_ribbon_nav() {
    $('.cNav button[aria-expanded="true"]').attr('aria-expanded', 'false');
    $('.cNav ul[aria-hidden="false"]').attr('aria-hidden', 'true');
}

function close_dropdown() {
    toggle_aria_expanded($('.dropdown__trigger .button[aria-expanded]'), false);
    $('.dropdown--active').removeClass('dropdown--active');
    $('.dropdown--active-parent').removeClass('dropdown--active-parent');
}

function close_mega_menus() {
    toggle_aria_expanded($('.mainNav > ul > li > button[aria-expanded]'), false);
    toggle_aria_hidden($('.mainNav__subMenu'), true);
}

function toggle_aria_expanded(trigger, is_expanded) {
    $(trigger).attr('aria-expanded', is_expanded ? 'true' : 'false');
}

function toggle_aria_hidden(trigger, is_expanded) {
    $(trigger).attr('aria-hidden', is_expanded ? 'true' : 'false');
}

function get_first_focusable_element($container) {
    if (!$container) return;
    let $element = $container.find('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').filter(':visible').not(':disabled').first();
    return !$element ? $container : $element;
}

/*
function getFocusedElement() {
    var focusedElement = $(document.activeElement);
    focusedElement.addClass('is-focused');
    console.log('Currently focused element:', focusedElement);
}
$(document).on('focusin', function() {
    getFocusedElement();
});
*/
