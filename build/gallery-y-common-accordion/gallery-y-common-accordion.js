YUI.add('gallery-y-common-accordion', function (Y, NAME) {

/**
 * This module is a widget that helps to render an accordion
 *
 * @class Accordion
 * @namespace Common
 * @extends Widget
 * @module gallery-y-common-accordion
 * @constructor
 */

Y.namespace('Common');

/**
 * Event that gets fired everytime that item gets expanded
 *
 * @event itemShown
 * @param {Y.Node} node Node of the item shown
 */
var EVT_ITEM_SHOWN = 'itemShown';

Y.Common.Accordion = Y.Base.create('gallery-y-common-accordion', Y.Widget, [], {

    /**
     * Selector for each accordion item container
     * 
     * @property _ACCORDION_ITEM
     * @type String
     * @public
     * @default '.accordion-item'
     */ 
    _ACCORDION_ITEM: '.accordion-item',
    
    /**
     * Selector for the accordion item container link,  this link will display the current content
     * 
     * @property _ACCORDION_ITEM_LINK
     * @type String
     * @public
     * @default '.accordion-item-link'
     */ 
    _ACCORDION_ITEM_LINK: '.accordion-item-link',
    
    /**
     * Content container selector that goes inside of accordion item container,
     * inside of this container will be going the content that is going to be displayed or not
     * 
     * @property _ACCORDION_ITEM_CONTENT
     * @type String
     * @public
     * @default '.accordion-item-content'
     */ 
    _ACCORDION_ITEM_CONTENT: '.accordion-item-content',
    
    /**
     * Class added to content container when is hidden
     * 
     * @property _HIDE
     * @type String
     * @public
     * @default 'hide'
     */ 
    _HIDE: 'hide',
    
    /**
     * Class added to content container when is shown
     * 
     * @property _SHOW
     * @type String
     * @public
     * @default 'show'
     */ 
    _SHOW: 'show',
    
    /**
     * Class added to content item container when is currently selected
     * 
     * @property _SELECTED
     * @type String
     * @public
     * @default '_SELECTED'
     */ 
    _SELECTED: 'selected',

    bindUI: function () {
        var me = this;
        if (me.hasItems()) {
            this.get('srcNode').delegate('click', function (e) {
                e.preventDefault();
                me._deselectAllItems();
                var li = e.target.get('parentNode');
                var itemContent = li.one(me._ACCORDION_ITEM_CONTENT);
                li.addClass(me._SELECTED);
                if (itemContent) {
                    itemContent.removeClass(me._HIDE);
                    itemContent.addClass(me._SHOW);
                    me.slideDown(itemContent);
                }
                me.fire(EVT_ITEM_SHOWN, {node: li});
            }, me._ACCORDION_ITEM_LINK);
        }
    },

    slideDown: function (node) {
        if (this.get('animated')) {
            this._slideDown(node);
        }
    },

    slideUp: function (node) {
        if (this.get('animated')) {
            this._slideUp(node);
        }
    },

    _slideDown: function (node) {
        this._blockAnimNode(node);
        this.get('animation').height = this._getNodeOffsetHeight(node) + 'px';
        node.setStyle('height', '0');
        node.transition(this.get('animation'), function () {
            node.setStyle('overflow', '');
        });
    },

    _slideUp: function (node) {
        this._blockAnimNode(node);
        this.get('animation').height = 0;
        node.transition(this.get('animation'), function () {
            node.setStyle('height', '');
            node.setStyle('display', 'none');
            node.setStyle('overflow', '');
        });
    },
    
    _blockAnimNode: function(node) {
        node.setStyle('display', 'block');
        node.setStyle('overflow', 'hidden');
    },
    
    /**
     * Deselects all the items in the list
     * 
     */
    _deselectAllItems: function () {
        var me = this;
        var cfg = this.config;
        this.get('srcNode').all(this._ACCORDION_ITEM).each(function (node) {
            node.removeClass(me._SELECTED);
            var itemContent = node.one(me._ACCORDION_ITEM_CONTENT);
            if (itemContent && itemContent.hasClass(me._SHOW)) {
                itemContent.removeClass(me._SHOW);
                itemContent.addClass(me._HIDE);
                me.slideUp(itemContent);
            }
        });
    },

    /**
     * Validates if the list has items
     * 
     */
    hasItems: function () {
        return this.get('srcNode') && this.get('srcNode').all(this._ACCORDION_ITEM_LINK).size() > 0;
    },


    /**
     * Obtains the precise height of the node provided, including padding and border.
     *
     * @param node {Node|HTMLElement} The node to gather the height from
     * @return {Number} The calculated height or zero in case of failure
     */
    _getNodeOffsetHeight: function (node) {
        var height, preciseRegion;
        height = node.get('offsetHeight');
        return Y.Lang.isValue(height) ? height : 0;
    }

}, {
    ATTRS: {
        
        /**
         * Object to configure and overwrite default animation when items are sliding up or down
         *
         * @attribute animation
         * @type Object
         * @default Object with properties easing = 'ease', duration = 0.75
         */
        animation: {
            value: {
                easing: 'ease',
                duration: 0.75
            }
        },

        /**
         * Flag to set whether or not the accordion will show and hide items with animation,
         * if <code>false</code>, it will just display or hide without any animation
         *
         * @attribute animated
         * @type boolean
         * @default true
         */
        animated: {
            value: true
        }
    }
});

}, '@VERSION@', {"requires": ["widget", "base", "node", "node-event-delegate", "transition"], "skinnable": false});
