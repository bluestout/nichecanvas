// Override Settings
var bcSfSearchSettings = {
    search: {
        //suggestionMode: 'test',
        //suggestionPosition: 'left'
    }
};

BCSfFilter.prototype.afterShowSearchBoxMobile = function(searchBoxId) {
    // Hide debut's search bar on mobile, and show our search bar instead
    if (window.theme && theme.SearchDrawer && typeof theme.SearchDrawer.close == 'function') {
  		theme.SearchDrawer.close();
  	}
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {
    // Hide debut's search suggestion
  	if (jQ('.predictive-search-wrapper').length > 0){
        jQ('.predictive-search-wrapper').hide();
    }
};

// Build number of Search result
BCSfFilter.prototype.buildSearchResultNumber = function(data) {
    var content = '';
    var searchTerm = this.escape(this.getSearchTerm());
    if (searchTerm != null) {
        var content = bcSfFilterConfig.label.search_result_number_other;
        if (data.total_product <= 1) {
            var content = bcSfFilterConfig.label.search_result_number_one;
        }
        content = content.replace(/{{ count }}/g, data.total_product).replace(/{{ terms }}/g, searchTerm);
    }
    jQ('.' + this.class.searchResultNumber).html(content);
};

function closeSuggestionMobile(searchBoxId, isCloseSearchBox) {
  /* console.log('closeSuggestionMobile'); */
  jQ(searchBoxId).autocomplete('close');
  jQ('.' + bcsffilter.class.searchSuggestion + '[data-search-box="' + searchBoxId + '"]').parent().hide();
  // Remove search box
  var isCloseSearchBox = typeof isCloseSearchBox !== 'undefined' ? isCloseSearchBox : false;
  if (isCloseSearchBox) jQ('.bc-sf-search-suggestion-mobile-top-panel,.bc-sf-search-suggestion-mobile-overlay').hide();
  // Update current term for all search boxes
  setValueAllSearchBoxes();
  // Add back tabindex=-1
  jQ('.bc-sf-search-no-tabindex').attr('tabindex', -1);
  // Return scrolling of body
  if(jQ('body').hasClass(bcsffilter.getClass('searchSuggestionMobileOpen'))){    
    jQ('body').removeClass(bcsffilter.getClass('searchSuggestionMobileOpen'));
  }
  bcsffilter.afterCloseSuggestionMobile(searchBoxId, isCloseSearchBox);
  
  // Close search theme debut
  if(jQ('.js-drawer-close').length > 1){
    jQ('.js-drawer-close').trigger('click');
  }
}