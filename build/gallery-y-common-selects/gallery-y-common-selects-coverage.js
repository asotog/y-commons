if (typeof __coverage__ === 'undefined') { __coverage__ = {}; }
if (!__coverage__['build/gallery-y-common-selects/gallery-y-common-selects.js']) {
   __coverage__['build/gallery-y-common-selects/gallery-y-common-selects.js'] = {"path":"build/gallery-y-common-selects/gallery-y-common-selects.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0},"b":{"1":[0,0],"2":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0},"fnMap":{"1":{"name":"(anonymous_1)","line":1,"loc":{"start":{"line":1,"column":36},"end":{"line":1,"column":55}}},"2":{"name":"(anonymous_2)","line":23,"loc":{"start":{"line":23,"column":17},"end":{"line":23,"column":29}}},"3":{"name":"(anonymous_3)","line":32,"loc":{"start":{"line":32,"column":22},"end":{"line":32,"column":34}}},"4":{"name":"(anonymous_4)","line":34,"loc":{"start":{"line":34,"column":52},"end":{"line":34,"column":75}}},"5":{"name":"(anonymous_5)","line":44,"loc":{"start":{"line":44,"column":16},"end":{"line":44,"column":32}}},"6":{"name":"(anonymous_6)","line":49,"loc":{"start":{"line":49,"column":29},"end":{"line":49,"column":41}}},"7":{"name":"(anonymous_7)","line":52,"loc":{"start":{"line":52,"column":28},"end":{"line":52,"column":41}}},"8":{"name":"(anonymous_8)","line":58,"loc":{"start":{"line":58,"column":19},"end":{"line":58,"column":35}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":117,"column":58}},"2":{"start":{"line":13,"column":0},"end":{"line":13,"column":22}},"3":{"start":{"line":20,"column":0},"end":{"line":20,"column":28}},"4":{"start":{"line":22,"column":0},"end":{"line":115,"column":3}},"5":{"start":{"line":24,"column":8},"end":{"line":24,"column":32}},"6":{"start":{"line":33,"column":8},"end":{"line":33,"column":22}},"7":{"start":{"line":34,"column":8},"end":{"line":41,"column":11}},"8":{"start":{"line":35,"column":12},"end":{"line":35,"column":48}},"9":{"start":{"line":36,"column":12},"end":{"line":40,"column":13}},"10":{"start":{"line":37,"column":16},"end":{"line":37,"column":58}},"11":{"start":{"line":38,"column":16},"end":{"line":38,"column":51}},"12":{"start":{"line":39,"column":16},"end":{"line":39,"column":38}},"13":{"start":{"line":45,"column":8},"end":{"line":45,"column":22}},"14":{"start":{"line":46,"column":8},"end":{"line":46,"column":40}},"15":{"start":{"line":47,"column":8},"end":{"line":47,"column":54}},"16":{"start":{"line":48,"column":8},"end":{"line":48,"column":51}},"17":{"start":{"line":49,"column":8},"end":{"line":51,"column":11}},"18":{"start":{"line":50,"column":12},"end":{"line":50,"column":55}},"19":{"start":{"line":52,"column":8},"end":{"line":55,"column":11}},"20":{"start":{"line":53,"column":12},"end":{"line":53,"column":54}},"21":{"start":{"line":54,"column":12},"end":{"line":54,"column":41}},"22":{"start":{"line":59,"column":8},"end":{"line":59,"column":52}},"23":{"start":{"line":60,"column":8},"end":{"line":60,"column":22}},"24":{"start":{"line":61,"column":8},"end":{"line":63,"column":9}},"25":{"start":{"line":62,"column":12},"end":{"line":62,"column":42}},"26":{"start":{"line":64,"column":8},"end":{"line":64,"column":20}}},"branchMap":{"1":{"line":36,"type":"if","locations":[{"start":{"line":36,"column":12},"end":{"line":36,"column":12}},{"start":{"line":36,"column":12},"end":{"line":36,"column":12}}]},"2":{"line":61,"type":"if","locations":[{"start":{"line":61,"column":8},"end":{"line":61,"column":8}},{"start":{"line":61,"column":8},"end":{"line":61,"column":8}}]}},"code":["(function () { YUI.add('gallery-y-common-selects', function (Y, NAME) {","","/**"," * Utility to generate base markup to give a skin or different look and feel to <code>select</code> tags"," *"," * @class Selects"," * @namespace Common"," * @extends Base"," * @module gallery-y-common-selects"," * @constructor"," */","","Y.namespace('Common');","","/**"," * Helper event that can be fired when object is instanced to refresh all the  selects associated to component instance"," *"," * @event refresh "," */","var EVT_REFRESH = 'refresh';","","Y.Common.Selects = Y.Base.create('gallery-y-common-selects', Y.Base, [], {","    initializer: function () {","        this.syncUIComponents();","    },","    ","    /**","     * Iterates over all the selects and adds the respective markup and attaches events","     *","     * @method syncUIComponents","     */","    syncUIComponents: function () {","        var me = this;","        Y.all(this.get('selectFieldSelector')).each(function (node, index) {","            var parent = node.get('parentNode');","            if (!parent.hasClass(me.get('containerClass'))) {","                parent.addClass(me.get('containerClass'));","                parent.prepend(me.get('maskHtml'));","                me.bindSelect(parent);","            }","        });","    },","","    bindSelect: function (node) {","        var me = this;","        var select = node.one('select');","        var mask = node.one(this.get('maskSelector'));","        mask.set('text', me.getOptionText(select));","        this.on(EVT_REFRESH, function () {","            mask.set('text', me.getOptionText(select));","        });","        select.on('change', function (e) {","            var optionText = me.getOptionText(select);","            mask.set('text', optionText);","        });","    },","","    getOptionText: function (node) {","        var checkedOpt = node.one('option:checked');","        var text = '';","        if (checkedOpt) {","            text = checkedOpt.get('text');","        }","        return text;","    }","","","}, {","    ATTRS: {","        /**","         * Select tag field selector","         *","         * @attribute selectFieldSelector","         * @type String","         * @default 'select'","         */","        selectFieldSelector: {","            value: 'select'","        },","","        /**","         * Select tag container class","         *","         * @attribute containerClass","         * @type String","         * @default 'custom-select'","         */","        containerClass: {","            value: 'custom-select'","        },","","        /**","         * Mask node selector","         *","         * @attribute maskSelector","         * @type String","         * @default '.custom-select-mask'","         */","        maskSelector: {","            value: '.custom-select-mask'","        },","","","        /**","         * Mask html","         *","         * @attribute maskHtml","         * @type String","         * @default '<span class=\"custom-select-mask\"></span>'","         */","        maskHtml: {","            value: '<span class=\"custom-select-mask\"></span>'","        }","    }","});","","}, '@VERSION@', {\"requires\": [\"yui-base\", \"base-build\"]});","","}());"]};
}
var __cov_Aw1djMNNVzio7G3pi539XQ = __coverage__['build/gallery-y-common-selects/gallery-y-common-selects.js'];
__cov_Aw1djMNNVzio7G3pi539XQ.s['1']++;YUI.add('gallery-y-common-selects',function(Y,NAME){__cov_Aw1djMNNVzio7G3pi539XQ.f['1']++;__cov_Aw1djMNNVzio7G3pi539XQ.s['2']++;Y.namespace('Common');__cov_Aw1djMNNVzio7G3pi539XQ.s['3']++;var EVT_REFRESH='refresh';__cov_Aw1djMNNVzio7G3pi539XQ.s['4']++;Y.Common.Selects=Y.Base.create('gallery-y-common-selects',Y.Base,[],{initializer:function(){__cov_Aw1djMNNVzio7G3pi539XQ.f['2']++;__cov_Aw1djMNNVzio7G3pi539XQ.s['5']++;this.syncUIComponents();},syncUIComponents:function(){__cov_Aw1djMNNVzio7G3pi539XQ.f['3']++;__cov_Aw1djMNNVzio7G3pi539XQ.s['6']++;var me=this;__cov_Aw1djMNNVzio7G3pi539XQ.s['7']++;Y.all(this.get('selectFieldSelector')).each(function(node,index){__cov_Aw1djMNNVzio7G3pi539XQ.f['4']++;__cov_Aw1djMNNVzio7G3pi539XQ.s['8']++;var parent=node.get('parentNode');__cov_Aw1djMNNVzio7G3pi539XQ.s['9']++;if(!parent.hasClass(me.get('containerClass'))){__cov_Aw1djMNNVzio7G3pi539XQ.b['1'][0]++;__cov_Aw1djMNNVzio7G3pi539XQ.s['10']++;parent.addClass(me.get('containerClass'));__cov_Aw1djMNNVzio7G3pi539XQ.s['11']++;parent.prepend(me.get('maskHtml'));__cov_Aw1djMNNVzio7G3pi539XQ.s['12']++;me.bindSelect(parent);}else{__cov_Aw1djMNNVzio7G3pi539XQ.b['1'][1]++;}});},bindSelect:function(node){__cov_Aw1djMNNVzio7G3pi539XQ.f['5']++;__cov_Aw1djMNNVzio7G3pi539XQ.s['13']++;var me=this;__cov_Aw1djMNNVzio7G3pi539XQ.s['14']++;var select=node.one('select');__cov_Aw1djMNNVzio7G3pi539XQ.s['15']++;var mask=node.one(this.get('maskSelector'));__cov_Aw1djMNNVzio7G3pi539XQ.s['16']++;mask.set('text',me.getOptionText(select));__cov_Aw1djMNNVzio7G3pi539XQ.s['17']++;this.on(EVT_REFRESH,function(){__cov_Aw1djMNNVzio7G3pi539XQ.f['6']++;__cov_Aw1djMNNVzio7G3pi539XQ.s['18']++;mask.set('text',me.getOptionText(select));});__cov_Aw1djMNNVzio7G3pi539XQ.s['19']++;select.on('change',function(e){__cov_Aw1djMNNVzio7G3pi539XQ.f['7']++;__cov_Aw1djMNNVzio7G3pi539XQ.s['20']++;var optionText=me.getOptionText(select);__cov_Aw1djMNNVzio7G3pi539XQ.s['21']++;mask.set('text',optionText);});},getOptionText:function(node){__cov_Aw1djMNNVzio7G3pi539XQ.f['8']++;__cov_Aw1djMNNVzio7G3pi539XQ.s['22']++;var checkedOpt=node.one('option:checked');__cov_Aw1djMNNVzio7G3pi539XQ.s['23']++;var text='';__cov_Aw1djMNNVzio7G3pi539XQ.s['24']++;if(checkedOpt){__cov_Aw1djMNNVzio7G3pi539XQ.b['2'][0]++;__cov_Aw1djMNNVzio7G3pi539XQ.s['25']++;text=checkedOpt.get('text');}else{__cov_Aw1djMNNVzio7G3pi539XQ.b['2'][1]++;}__cov_Aw1djMNNVzio7G3pi539XQ.s['26']++;return text;}},{ATTRS:{selectFieldSelector:{value:'select'},containerClass:{value:'custom-select'},maskSelector:{value:'.custom-select-mask'},maskHtml:{value:'<span class="custom-select-mask"></span>'}}});},'@VERSION@',{'requires':['yui-base','base-build']});
