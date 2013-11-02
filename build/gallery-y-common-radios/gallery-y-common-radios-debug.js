YUI.add('gallery-y-common-radios', function (Y, NAME) {

/**
 * Utility to generate base markup to give a skin or different look and feel to radio buttons tags
 *
 * @class Radios
 * @namespace Common
 * @extends Base
 * @module gallery-y-common-radios
 * @constructor
 */

Y.namespace('Common');

/**
 * Helper event that can be fired when object is instanced to refresh all the  radios associated to component instance
 *
 * @event refresh 
 */
var EVT_REFRESH = 'refresh';

Y.Common.Radios = Y.Base.create('gallery-y-common-radios', Y.Base, [], {

    initializer: function () {
        var me = this;
        Y.all(this.get('radioFieldSelector')).each(function (node, index) {
            me.bindRadio(node);
        });
    },

    bindRadio: function (node) {
        var me = this;
        /* init */
        node.all(this.get('radioInputSelector')).each(function (node) {
            var parent = node.get('parentNode');
            if (!parent.hasClass(me.get('radioContainerClass'))) {
                parent.addClass(me.get('radioContainerClass'));
                var checkedClass = node.get('checked') ? ' checked' : '';
                parent.prepend(Y.Lang.sub(me.get('maskHtml'), {
                    checked: checkedClass
                }));
            }
        });

        /* binds events */
        node.delegate('click', function (e) {
            node.all(me.get('maskSelector')).removeClass('checked');
            var parent = e.currentTarget.get('parentNode');
            parent.one(me.get('maskSelector')).addClass('checked');
        }, this.get('radioInputSelector'));

        /* listen refresh */
        this.on(EVT_REFRESH, function () {
            node.all('input').each(function (radio) {
                var checked = radio.get('checked');
                var parent = radio.get('parentNode');
                if (!checked) {
                    parent.one(me.get('maskSelector')).removeClass('checked');
                } else {
                    parent.one(me.get('maskSelector')).addClass('checked');
                }
            });
        });
    }


}, {
    ATTRS: {
        /**
         * Radio buttons group container selector
         *
         * @attribute radioFieldSelector
         * @type String
         * @default '.custom-radio-buttons'
         */
        radioFieldSelector: {
            value: '.custom-radio-buttons'
        },


        /**
         * Mask node selector
         *
         * @attribute maskSelector
         * @type String
         * @default '.radio-mask'
         */
        maskSelector: {
            value: '.radio-mask'
        },


        /**
         * Radio button wrapper class
         *
         * @attribute radioContainerClass
         * @type String
         * @default 'radio'
         */
        radioContainerClass: {
            value: 'radio'
        },

        /**
         * Radio tag field selector
         *
         * @attribute radioInputSelector
         * @type String
         * @default 'input[type="radio"]'
         */
        radioInputSelector: {
            value: 'input[type="radio"]'
        },

        /**
         * Mask html
         *
         * @attribute maskHtml
         * @type String
         * @default '<span class="radio-mask {checked}"></span'
         */
        maskHtml: {
            value: '<span class="radio-mask {checked}"></span>'
        }
    }
});

}, '@VERSION@', {"requires": ["yui-base", "base-build", "node"]});
