var bcSfSearchSettings={search:{}};function closeSuggestionMobile(e,t){jQ(e).autocomplete("close"),jQ("."+bcsffilter.class.searchSuggestion+'[data-search-box="'+e+'"]').parent().hide(),(t=void 0!==t&&t)&&jQ(".bc-sf-search-suggestion-mobile-top-panel,.bc-sf-search-suggestion-mobile-overlay").hide(),setValueAllSearchBoxes(),jQ(".bc-sf-search-no-tabindex").attr("tabindex",-1),jQ("body").hasClass(bcsffilter.getClass("searchSuggestionMobileOpen"))&&jQ("body").removeClass(bcsffilter.getClass("searchSuggestionMobileOpen")),bcsffilter.afterCloseSuggestionMobile(e,t),jQ(".js-drawer-close").length>1&&jQ(".js-drawer-close").trigger("click")}BCSfFilter.prototype.afterShowSearchBoxMobile=function(e){window.theme&&theme.SearchDrawer&&"function"==typeof theme.SearchDrawer.close&&theme.SearchDrawer.close()},BCSfFilter.prototype.customizeSuggestion=function(e,t,r){jQ(".predictive-search-wrapper").length>0&&jQ(".predictive-search-wrapper").hide()},BCSfFilter.prototype.buildSearchResultNumber=function(e){var t="",r=this.escape(this.getSearchTerm());null!=r&&(t=bcSfFilterConfig.label.search_result_number_other,e.total_product<=1&&(t=bcSfFilterConfig.label.search_result_number_one),t=t.replace(/{{ count }}/g,e.total_product).replace(/{{ terms }}/g,r)),jQ("."+this.class.searchResultNumber).html(t)},BCSfFilter.prototype.setSuggestionWidth=function(t,e){e<275&&(e=275),jQ("ul."+this.class.searchSuggestion+'[data-search-box="'+t+'"]').outerWidth(e)},BCSfFilter.prototype.buildSuggestionCollection=function(searchTerm,itemData,ul,itemInfo,suggestionData){var result="";if(Object.keys(itemData).length>0){var result=bcsffilter.buildSuggestionHeader(itemInfo.label,"collection"),searchSuggestionClass=this.class.searchSuggestion,k,itemDataLength=itemData.length;for(k=0;k<itemDataLength;k++){var searchResult=bcsffilter.highlightSuggestionResult(itemData[k].title,searchTerm);result+='<li class="'+bcsffilter.class.searchSuggestionItem+'" data-label="'+this.escape(itemData[k].id)+'" data-value="'+this.escape(itemData[k].title)+'" aria-label="'+this.escape(itemInfo.label)+": "+this.escape(itemData[k].title)+'">',result+='<a href="/collections/'+itemData[k].handle+'">',result+='<div class="'+searchSuggestionClass+'-left"></div>',result+='<div class="'+searchSuggestionClass+'-right">'+searchResult+"</div>",result+="</a>",result+="</li>",jQ.get("/collections/"+itemData[k].handle+".json/",(function(data){if(data){var collection=data.collection,img="";collection.image?img='<img src="'+collection.image+'" />':collection.description&&collection.description.indexOf("img")>-1&&(img=collection.description),img&&jQ('.bc-sf-search-suggestion-group[data-group="collections"] [data-label="'+bcsffilter.escape(collection.id)+'"] .bc-sf-search-suggestion-left').html(img)}}))}}return result};