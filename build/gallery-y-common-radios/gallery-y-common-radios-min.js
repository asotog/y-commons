YUI.add("gallery-y-common-radios",function(e,t){e.namespace("Common");var n="refresh";e.Common.Radios=e.Base.create("gallery-y-common-radios",e.Base,[],{initializer:function(){var t=this;e.all(this.get("radioFieldSelector")).each(function(e,n){t.bindRadio(e)})},bindRadio:function(t){var r=this;t.all(this.get("radioInputSelector")).each(function(t){var n=t.get("parentNode");if(!n.hasClass(r.get("radioContainerClass"))){n.addClass(r.get("radioContainerClass"));var i=t.get("checked")?" checked":"";n.prepend(e.Lang.sub(r.get("maskHtml"),{checked:i}))}}),t.delegate("click",function(e){t.all(r.get("maskSelector")).removeClass("checked");var n=e.currentTarget.get("parentNode");n.one(r.get("maskSelector")).addClass("checked")},this.get("radioInputSelector")),this.on(n,function(){t.all("input").each(function(e){var t=e.get("checked"),n=e.get("parentNode");t?n.one(r.get("maskSelector")).addClass("checked"):n.one(r.get("maskSelector")).removeClass("checked")})})}},{ATTRS:{radioFieldSelector:{value:".custom-radio-buttons"},maskSelector:{value:".radio-mask"},radioContainerClass:{value:"radio"},radioInputSelector:{value:'input[type="radio"]'},maskHtml:{value:'<span class="radio-mask {checked}"></span>'}}})},"@VERSION@",{requires:["yui-base","base-build"]});
