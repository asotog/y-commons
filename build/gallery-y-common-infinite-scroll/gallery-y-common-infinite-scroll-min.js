YUI.add("gallery-y-common-infinite-scroll",function(e,t){var n="infinite-scroll:loading",r="infinite-scroll:finished",i="infinite-scroll:no-more-results";e.InfiniteScroll=e.Base.create("gallery-y-common-infinite-scroll",e.Base,[],{updateInitiated:!1,offset:null,allItemsFetched:!1,initializer:function(){this.offset=this.get("offset"),this.get("initialize")&&this._onScroll(),e.one(document).on("scroll",e.bind(function(){this._onScroll()},this))},_onScroll:function(){var t=this,r=0;if(this.updateInitiated)return;var i=document.documentElement.scrollHeight,s=document.documentElement.clientHeight;e.UA.ie?r=document.documentElement.scrollTop:r=window.pageYOffset;if(i-(r+s)<50&&!this.allItemsFetched){this.updateInitiated=!0;var o=this.get("container").all(".item").size();this.fire(n),document.documentElement.scrollTop+=60,this.get("requestCustomData")?e.bind(this.get("requestCustomData"),this)(function(e){t._processResponse(e),t.updateInitiated=!1}):this.requestItems()}},requestItems:function(){var t=this,n=e.Lang.sub(this.get("dataSourceUrl"),{offset:this.offset}),r=e.io(n,{on:{success:function(n,r,i){var s=e.JSON.parse(r.responseText);t._processResponse(s)},complete:function(e,n,r){t.updateInitiated=!1}}})},_processResponse:function(t){var n=this;n.offset+=n.get("offset"),t.length>0?e.Array.each(t,function(t){t=n.get("itemProcessor")(t),n.get("container").append(e.Lang.sub(n.get("itemTemplate"),t))}):(n.fire(i),n.allItemsFetched=!0),n.fire(r)}},{ATTRS:{dataSourceUrl:{value:""},container:{value:null},itemTemplate:{value:""},offset:{value:15},initialize:{value:!1},requestCustomData:{value:null},itemProcessor:{value:function(e){return e}}}})},"@VERSION@",{requires:["yui-base","widget","base","node","node-event-delegate","event","io-base","json-parse"]});