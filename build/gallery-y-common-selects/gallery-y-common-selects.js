YUI.add('gallery-y-common-selects', function (Y, NAME) {

/**
 * Utility to generate base markup to give a skin or different look and feel to <code>select</code> tags
 *
 * @class Selects
 * @namespace Common
 * @extends Base
 * @module gallery-y-common-selects
 * @constructor
 */

Y.namespace('Common');

/**
 * Helper event that can be fired when object is instanced to refresh all the  selects associated to component instance
 *
 * @event refresh 
 */
var EVT_REFRESH = 'refresh';

Y.Common.Selects = Y.Base.create('gallery-y-common-selects', Y.Base, [], {
    initializer: function () {
        this.syncUIComponents();
    },
    
    /**
     * Iterates over all the selects and adds the respective markup and attaches events
     *
     * @method syncUIComponents
     */
    syncUIComponents: function () {
        var me = this;
        Y.all(this.get('selectFieldSelector')).each(function (node, index) {
            var parent = node.get('parentNode');
            if (!parent.hasClass(me.get('containerClass'))) {
                parent.addClass(me.get('containerClass'));
                parent.prepend(me.get('maskHtml'));
                me.bindSelect(parent);
            }
        });
    },

    bindSelect: function (node) {
        var me = this;
        var select = node.one('select');
        var mask = node.one(this.get('maskSelector'));
        mask.set('text', me.getOptionText(select));
        this.on(EVT_REFRESH, function () {
            mask.set('text', me.getOptionText(select));
        });
        select.on('change', function (e) {
            var optionText = me.getOptionText(select);
            mask.set('text', optionText);
        });
    },

    getOptionText: function (node) {
        var checkedOpt = node.one('option:checked');
        var text = '';
        if (checkedOpt) {
            text = checkedOpt.get('text');
        }
        return text;
    }


}, {
    ATTRS: {
        /**
         * Select tag field selector
         *
         * @attribute selectFieldSelector
         * @type String
         * @default 'select'
         */
        selectFieldSelector: {
            value: 'select'
        },

        /**
         * Select tag container class
         *
         * @attribute containerClass
         * @type String
         * @default 'custom-select'
         */
        containerClass: {
            value: 'custom-select'
        },

        /**
         * Mask node selector
         *
         * @attribute maskSelector
         * @type String
         * @default '.custom-select-mask'
         */
        maskSelector: {
            value: '.custom-select-mask'
        },


        /**
         * Mask html
         *
         * @attribute maskHtml
         * @type String
         * @default '<span class="custom-select-mask"></span>'
         */
        maskHtml: {
            value: '<span class="custom-select-mask"></span>'
        }
    }
});

}, '@VERSION@', {"requires": ["yui-base", "base-build", "node"]});
