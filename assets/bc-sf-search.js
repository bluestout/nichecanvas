var bcSfSearchSettings={search:{}};function closeSuggestionMobile(e,t){jQ(e).autocomplete("close"),jQ("."+bcsffilter.class.searchSuggestion+'[data-search-box="'+e+'"]').parent().hide(),(t=void 0!==t&&t)&&jQ(".bc-sf-search-suggestion-mobile-top-panel,.bc-sf-search-suggestion-mobile-overlay").hide(),setValueAllSearchBoxes(),jQ(".bc-sf-search-no-tabindex").attr("tabindex",-1),jQ("body").hasClass(bcsffilter.getClass("searchSuggestionMobileOpen"))&&jQ("body").removeClass(bcsffilter.getClass("searchSuggestionMobileOpen")),bcsffilter.afterCloseSuggestionMobile(e,t),jQ(".js-drawer-close").length>1&&jQ(".js-drawer-close").trigger("click")}BCSfFilter.prototype.afterShowSearchBoxMobile=function(e){window.theme&&theme.SearchDrawer&&"function"==typeof theme.SearchDrawer.close&&theme.SearchDrawer.close()},BCSfFilter.prototype.customizeSuggestion=function(e,t,r){jQ(".predictive-search-wrapper").length>0&&jQ(".predictive-search-wrapper").hide()},BCSfFilter.prototype.buildSearchResultNumber=function(e){var t="",r=this.escape(this.getSearchTerm());if(null!=r){t=bcSfFilterConfig.label.search_result_number_other;if(e.total_product<=1)t=bcSfFilterConfig.label.search_result_number_one;t=t.replace(/{{ count }}/g,e.total_product).replace(/{{ terms }}/g,r)}jQ("."+this.class.searchResultNumber).html(t)};