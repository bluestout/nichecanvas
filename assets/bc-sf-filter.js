// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: bcSfFilterConfig.custom.products_per_page,
        // Optional
        loadProductFirst: true,
        styleScrollToTop: 'style2',
        defaultDisplay: bcSfFilterConfig.custom.layout,
        showPlaceholderProductList: false,
        swatchStyle: 'square-list',
        requestInstantly: true,
    },
};


BCSfFilter.prototype.buildProductGridItem = function(data) {
  /*** Prepare data ***/
  var images = data.images_info;
  // Displaying price base on the policy of Shopify, have to multiple by 100
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  var priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) {
      return e.id == getParam('variant');
    });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  /*** End Prepare data ***/

  // Get Template
  var itemHtml = bcSfFilterTemplate.productGridItemHtml;

  // Add a specific class for grid item
  var itemGridWidthClass = '';
  var imageSize = '600x600';

  switch (bcSfFilterConfig.custom.products_per_row) {
    case 2:
      itemGridWidthClass = 'medium-up--one-half';
      imageSize = '540x600';
      break;
    case 3:
      itemGridWidthClass = 'small--one-half medium-up--one-third';
      imageSize = '345x550';
      break;
    case 4:
      itemGridWidthClass = 'small--one-half medium-up--one-quarter';
      imageSize = '250x';
      break;
    case 5:
      itemGridWidthClass = 'small--one-half medium-up--one-fifth';
      imageSize = '195x';
      break;
  }
  itemHtml = itemHtml.replace(/{{itemGridWidthClass}}/g, itemGridWidthClass);

  // Add soldOut class
  var itemSoldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
  itemHtml = itemHtml.replace(/{{itemSoldOutClass}}/g, itemSoldOutClass);

  // Add soldOut label
  var itemSoldOutLabel = soldOut ? bcSfFilterTemplate.soldOutLabelGridHtml : '';
  itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);

  var imgId = 'ProductCardImage-' + data.id;
  var wrapperId = 'ProductCardImageWrapper-' + data.id;

  // Build Image style
  var imageStyle = buildImageStyle(data);
  itemHtml = itemHtml.replace(/{{imageStyle}}/g, imageStyle);

  // Add Images
  var aspect_ratio = '';
  var itemImagesHtml = '';
//   itemImagesHtml += '<div id="' + wrapperId + '" class="grid-view-item__image-wrapper js">';
//   itemImagesHtml += '<div style="padding-top:';
//   if (images.length > 0) {
//     aspect_ratio = images[0]['width'] / images[0]['height'];
//     itemImagesHtml += 1 / aspect_ratio * 100;
//   } else {
//     itemImagesHtml += 100;
//   }
//   itemImagesHtml += '%;">';
  itemImagesHtml += '<img ' +
    'class="grid-view-item__image lazyload" ' +
    'src="' + this.getFeaturedImage(images, '300x300') + '" ' +
    'data-src="' + this.getFeaturedImage(images, '{width}x') + '" ' +
    'data-widths="[180, 360, 540, 720, 900, 1080, 1296, 1512, 1728, 2048]" ' +
    'data-aspectratio="' + aspect_ratio + '" ' +
    'data-sizes="auto" ' +
    'alt="{{itemTitle}}">';
//   itemImagesHtml += '</div>';
//   itemImagesHtml += '</div>';

  var image_size = bcSfFilterConfig.custom.max_height + 'x' + bcSfFilterConfig.custom.max_height;
  var max_width = images.length > 0 ? bcSfFilterConfig.custom.max_height * aspect_ratio : 0;
  itemImagesHtml += '<noscript><img class="grid-view-item__image" src="' + this.getFeaturedImage(images, image_size + '@2x') + '" alt="{{itemTitle}}" style="max-width: ' + max_width + 'px;"></noscript>';
  itemHtml = itemHtml.replace(/{{itemImages}}/g, itemImagesHtml);

  // Add Vendor
  var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorGridHtml : '';
  itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

  // Add Price
  var itemPriceHtml = buildPrice(data, onSale, priceVaries);
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

  // Add data json
  itemHtml = itemHtml.replace(/{{itemJson}}/g, JSON.stringify(data.json));
  
  // Add Wish List
  var itemWishlistHtml = "<!-- include 'wishlist-button-collection' with '" + data.id + "' -->";
  itemHtml = itemHtml.replace(/{{itemWishlist}}/g, itemWishlistHtml);
  
  // Add item Tag Label
  var itemTagsHtml = '';
  if (data.tags) {
    if (data.tags.indexOf('limited') > -1) {
      itemTagsHtml += '<li class="limtedAdd">Limited Edition</li>';
    }
    if (data.tags.indexOf('onsale') > -1) {
      itemTagsHtml += '<li class="gbSale">SALE</li>';
    }
    if (data.tags.indexOf('newarrival') > -1) {
      itemTagsHtml += '<li class="gbNewarrive"><img src="https://cdn.shopify.com/s/files/1/2012/8501/t/103/assets/icon-new-arrival.svg" alt="img" title="img">New Arrival</li>';
    }
    if (data.tags.indexOf('trending') > -1) {
      itemTagsHtml += '<li class="gbtrmding">Trending</li>';
    }
    if (data.tags.indexOf('featuredartist') > -1) {
      itemTagsHtml += '<li class="gbFA"><img src="https://cdn.shopify.com/s/files/1/2012/8501/t/103/assets/icon-featured-artist.svg" alt="img" title="img">Featured Artist</li>';
    }
    if (data.tags.indexOf('bestseller') > -1) {
      itemTagsHtml += '<li class="gbBS"><img src="https://cdn.shopify.com/s/files/1/2012/8501/t/103/assets/icon-best-seller.svg" alt="img" title="img">Best Seller</li>';
    }
  }
  itemHtml = itemHtml.replace(/{{itemTags}}/g, itemTagsHtml);

  // Add Loox rating
  var avg_rating = this.getProductMetafield(data, 'loox', 'avg_rating');
  var num_reviews = this.getProductMetafield(data, 'loox', 'num_reviews');
  var itemRating = '<div class="loox-rating" data-id="{{itemId}}" data-rating="'+avg_rating+'" data-raters="'+num_reviews+'"></div>';
  itemHtml = itemHtml.replace(/{{itemRating}}/g, itemRating);
  
  // Add main attribute
  itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
  itemHtml = itemHtml.replace(/{{itemFirstVariantId}}/g, firstVariant.id);
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

  return itemHtml;
}

// Build Image style
function buildImageStyle(data) {
  var images = data.images_info;
  var imgId = 'ProductCardImage-' + data.id;
  var wrapperId = 'ProductCardImageWrapper-' + data.id;
  var imageStyle = '';
  if (images.length > 0) {
    var image = images[0];
    var width = bcSfFilterConfig.custom.max_height;
    var height = bcSfFilterConfig.custom.max_height;
    var aspect_ratio = image.width / image.height;
    var small_style = true;
    var container_aspect_ratio = width * 1.0 / height;

    if (image.aspect_ratio < 1.0) {
      var maximum_width = height * aspect_ratio;
      if (image.height <= height) {
        var maximum_height = image.height;
        maximum_width = image.width;
      } else {
        var maximum_height = height;
      }
    } else if (aspect_ratio < container_aspect_ratio) {
      var maximum_height = height / aspect_ratio;
      if (image.height <= height) {
        var maximum_height = image.height;
        var maximum_width = image.width;
      } else {
        var maximum_height = height;
        var maximum_width = height * aspect_ratio;
      }
    } else {
      var maximum_height = height / aspect_ratio;
      if (image.width <= width) {
        maximum_height = image.height;
        var maximum_width = image.width
      } else {
        var maximum_width = width;
        maximum_height = maximum_width / aspect_ratio;
      }
    }

    imageStyle += '<style>';
    if (small_style) imageStyle += '@media screen and (min-width: 750px) {';
    imageStyle += '#' + imgId + ' {' +
      'max-width: ' + maximum_width + 'px;' +
      'max-height: ' + maximum_height + 'px;' +
      '}' +
      '#' + wrapperId + ' {' +
      'max-width: ' + maximum_width + 'px;' +
      'max-height: ' + maximum_height + 'px;' +
      '}';
    if (small_style) imageStyle += '}';

    if (small_style) {
      if (aspect_ratio < 1) {
        maximum_width = 750 * aspect_ratio;
      } else {
        if (image.width < 750) {
          maximum_width = image.width;
        } else {
          maximum_width = 750;
        }
      }
      imageStyle += '@media screen and (max-width: 749px) {'
      imageStyle += '#' + imgId + ' {' +
        'max-width: ' + maximum_width + 'px;' +
        'max-height: 750px;' +
        '}' +
        '#' + wrapperId + ' {' +
        'max-width: ' + maximum_width + 'px;' +
        '}';
      imageStyle += '}';
    }
    imageStyle += '</style>';
  }
  return imageStyle;
}

BCSfFilter.prototype.buildProductListItem = function(data) {
  /*** Prepare data ***/
  var images = data.images_info;
  // Displaying price base on the policy of Shopify, have to multiple by 100
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  var priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) {
      return e.id == getParam('variant');
    });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  /*** End Prepare data ***/

  // Get Template
  var itemHtml = bcSfFilterTemplate.productListItemHtml;

  // Add onSale label
  var itemSaleLabel = onSale ? bcSfFilterTemplate.saleLabelListHtml : '';
  itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabel);

  // Add soldOut label
  var itemSoldOutLabel = soldOut ? bcSfFilterTemplate.soldOutLabelListHtml : '';
  itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);

  // Add Thumbnail
  var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src'], '600x600') : bcSfFilterConfig.general.no_image_url;
  itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

  // Add Vendor
  var itemSmallVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorSmallListHtml : '';
  itemHtml = itemHtml.replace(/{{itemSmallVendor}}/g, itemSmallVendorHtml);
  var itemMediumVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorMediumListHtml : '';
  itemHtml = itemHtml.replace(/{{itemMediumVendor}}/g, itemMediumVendorHtml);

  // Add Price
  var itemPriceHtml = buildPrice(data, onSale, priceVaries);
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

  // Add main attribute
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

  return itemHtml;
}

function buildPrice(data, onSale, priceVaries) {
  var priceHtml = '',
    onSaleClass = onSale ? ' price--on-sale' : '';

  priceHtml += '<dl class="price' + onSaleClass + '" data-price>';
  if (bcSfFilterConfig.custom.vendor_enable) {
    priceHtml += '<div class="price__vendor">';
    priceHtml += '<dt>';
    priceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.vendor + '</span>';
    priceHtml += '</dt>';
    priceHtml += '<dd>';
    priceHtml += data.vendor;
    priceHtml += '</dd>';
    priceHtml += '</div>';
  }
  priceHtml += '<div class="price__regular">';
  priceHtml += '<dt>';
  priceHtml += '<span class="visually-hidden visually-hidden--inline">' + bcSfFilterConfig.label.regular_price + '</span>';
  priceHtml += '</dt>';
  priceHtml += '<dd>';
  priceHtml += '<span class="price-item price-item--regular" data-regular-price>';
  if (data.available) {
    if (onSale) {
      priceHtml += bcsffilter.formatMoney(data.compare_at_price_min, bcsffilter.moneyFormat);
    } else {
      priceHtml += bcsffilter.formatMoney(data.price_min, bcsffilter.moneyFormat);
    }
  } else {
    priceHtml += bcSfFilterConfig.label.sold_out;
  }
  priceHtml += '</span>';
  priceHtml += '</dd>';
  priceHtml += '</div>';
  priceHtml += '<div class="price__sale">';
  priceHtml += '<dt>';
  priceHtml += '<span class="visually-hidden visually-hidden--inline">' + bcSfFilterConfig.label.sale_price + '</span>';
  priceHtml += '</dt>';
  priceHtml += '<dd>';
  priceHtml += '<span class="price-item price-item--sale" data-sale-price>';
  priceHtml += bcsffilter.formatMoney(data.price_min, bcsffilter.moneyFormat);
  priceHtml += '</span> ';
  priceHtml += '<span class="price-item__label" aria-hidden="true">' + bcSfFilterConfig.label.sale + '</span>';
  priceHtml += '</dd>';
  priceHtml += '</div>';
  priceHtml += '</dl>';

  return priceHtml;
}

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
  // Get page info
  var currentPage = parseInt(this.queryParams.page);
  var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

  // If it has only one page, clear Pagination
  if (totalPage == 1) {
    jQ(this.selector.pagination).html('');
    return false;
  }

  if (this.getSettingValue('general.paginationType') == 'default') {
    var paginationHtml = bcSfFilterTemplate.paginateHtml;

    // Build Previous
    var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
    previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
    paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

    // Build Next
    var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml : bcSfFilterTemplate.nextDisabledHtml;
    nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
    paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

    // Build page items
    var currentPage = bcSfFilterConfig.label.current_page.replace(/{{ current }}/g, currentPage).replace(/{{ total }}/g, totalPage);
    paginationHtml = paginationHtml.replace(/{{pageItems}}/g, currentPage);

    jQ(this.selector.pagination).html(paginationHtml);
  }
};

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
  jQ(this.selector.topSorting).html('');
  var sortingArr = this.getSortingList();
  if (sortingArr) {
    var paramSort = this.queryParams.sort || '';
    // Build content
    var sortingItemsHtml = '';
    for (var k in sortingArr) {
      activeClass = '';
      if(paramSort == k) {
        activeClass = 'active';
      }
      sortingItemsHtml += '<li><a href="#" data-sort="' + k + '" class="' + activeClass+ '">' + sortingArr[k] + '</a></li>';
    }
    var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
    jQ('.bc-sf-filter-custom-sorting').html(html);
    if(jQ('.bc-sf-filter-custom-sorting').hasClass("bc-sf-filter-sort-active")) {
      jQ('.bc-sf-filter-custom-sorting').toggleClass('bc-sf-filter-sort-active');
    }

    var labelSort = '';
    if(paramSort.length > 0) {
      var labelHandle = 'sorting_' + paramSort.replace(/\-/g, '_');
      labelSort = bcSfFilterConfig.label[labelHandle];
    } else {
      labelSort = bcSfFilterConfig.label.sorting;
    }

    jQ('.bc-sf-filter-custom-sorting label span span').text(labelSort);
  }
};

BCSfFilter.prototype.buildSortingEvent = function() {
  var _this = this;
  jQ('.bc-sf-filter-filter-dropdown a').click(function(e){
    e.preventDefault();
    onInteractWithToolbar(e, 'sort', _this.queryParams.sort, jQ(this).data('sort'));
  });

  jQ(".bc-sf-filter-custom-sorting > label").click(function(){
    if (!jQ('.bc-sf-filter-filter-dropdown').is(':animated')) {
      jQ('.bc-sf-filter-filter-dropdown').toggle().parent().toggleClass('bc-sf-filter-sort-active');
      jQ('#bc-sf-filter-tree').hide();
    }
  });
  
  jQ('body').click(function(e){
    var contentContainer = jQ('.bc-sf-filter-custom-sorting');
    if (!contentContainer.is(e.target) && contentContainer.has(e.target).length === 0) {
      jQ('.bc-sf-filter-filter-dropdown').hide().parent().removeClass('bc-sf-filter-sort-active');
    }
  });  

  jQ(this.getSelector('filterTreeMobileButton')).click(function(){
    jQ('#bc-sf-filter-top-sorting-mobile .bc-sf-filter-filter-dropdown').hide();
  });
  
  jQ('#bc-sf-filter-tree-h .bc-sf-filter-block-title a').click(function(){
    jQ('.bc-sf-filter-filter-dropdown').hide().parent().removeClass('bc-sf-filter-sort-active');
  });  
  
  jQ(window).on('scroll', function(){
    jQ('.bc-sf-filter-filter-dropdown').hide().parent().removeClass('bc-sf-filter-sort-active');
  });
};

// Build Display type
BCSfFilter.prototype.buildFilterDisplayType = function() {
  var itemHtml = '<span>View As </span>';
  itemHtml += '<a href="' + this.buildToolbarLink('display', 'list', 'grid') + '" title="Grid view" class="bc-sf-filter-display-item bc-sf-filter-display-grid" data-view="grid"><span class="icon-fallback-text"><span class="fallback-text">Grid view</span></span></a>';
  itemHtml += '<a href="' + this.buildToolbarLink('display', 'grid', 'list') + '" title="List view" class="bc-sf-filter-display-item bc-sf-filter-display-list" data-view="list"><span class="icon-fallback-text"><span class="fallback-text">List view</span></span></a>';
  jQ(this.selector.topDisplayType).html(itemHtml);

  // Active current display type
  jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').removeClass('active');
  jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').removeClass('active');
  if (this.queryParams.display == 'list') {
    jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').addClass('active');
  } else if (this.queryParams.display == 'grid') {
    jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').addClass('active');
  }
};

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {
    /* start-initialize-bc-al */
    var self = this;
    var alEnable = true;
    if(self.getSettingValue('actionlist.qvEnable') != '' || self.getSettingValue('actionlist.atcEnable') != ''){
      alEnable = self.getSettingValue('actionlist.qvEnable') || self.getSettingValue('actionlist.atcEnable');
    }
    if (alEnable === true && typeof BCActionList !== 'undefined') {
        if (typeof bcActionList === 'undefined') {
            bcActionList = new BCActionList();
        }else{
          if (typeof bcAlParams !== 'undefined' && typeof bcSfFilterParams !== 'undefined') {
              bcActionList.initFlag = false;
              bcActionList.alInit(bcSfFilterParams, bcAlParams);
          } else {
              bcActionList.alInit();
          }
        }
    }
    /* end-initialize-bc-al */
  var productSelector = jQ(this.selector.products);
  if (this.queryParams.display == 'list') {
    if (productSelector.children('.list-view-items').length == 0) {
      productSelector.children().wrapAll('<ul class="list-view-items"></ul>');
    }
    productSelector.removeClass('grid grid--uniform grid--view-items');
  } else {
    if (productSelector.children('.list-view-items').length > 0) {
      productSelector.children('.list-view-items').children().unwrap();
    }
    productSelector.addClass('grid grid--uniform grid--view-items');
  }
};

// Build Additional Elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {
  var totalProduct = '';
  if (data.total_product == 1) {
    totalProduct = bcSfFilterConfig.label.items_with_count_one.replace(/{{ count }}/g, data.total_product);
  } else {
    totalProduct = bcSfFilterConfig.label.items_with_count_other.replace(/{{ count }}/g, data.total_product);
  }
  jQ('#bc-sf-filter-total-product').html(totalProduct);
  
  jQ(".GridCartBtn").click(function(){
    var GetId = $(this).attr("data-id");
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: 'quantity=1&id=' + GetId,
      dataType: 'json',
      success: function(line_item) {
        window.location.href = "/cart";
      }
    })
  });
  
};

// Build Default layout
BCSfFilter.prototype.buildDefaultElements=function(){var isiOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,isSafari=/Safari/.test(navigator.userAgent),isBackButton=window.performance&&window.performance.navigation&&2==window.performance.navigation.type;if(!(isiOS&&isSafari&&isBackButton)){var self=this,url=window.location.href.split("?")[0],searchQuery=self.isSearchPage()&&self.queryParams.hasOwnProperty("q")?"&q="+self.queryParams.q:"";window.location.replace(url+"?view=bc-original"+searchQuery)}};

function customizeJsonProductData(data) {for (var i = 0; i < data.variants.length; i++) {var variant = data.variants[i];var featureImage = data.images.filter(function(e) {return e.src == variant.image;});if (featureImage.length > 0) {variant.featured_image = {"id": featureImage[0]['id'],"product_id": data.id,"position": featureImage[0]['position'],"created_at": "","updated_at": "","alt": null,"width": featureImage[0]['width'], "height": featureImage[0]['height'], "src": featureImage[0]['src'], "variant_ids": [variant.id]}} else {variant.featured_image = '';};};var self = bcsffilter;var itemJson = {"id": data.id,"title": data.title,"handle": data.handle,"vendor": data.vendor,"variants": data.variants,"url": self.buildProductItemUrl(data),"options_with_values": data.options_with_values,"images": data.images,"images_info": data.images_info,"available": data.available,"price_min": data.price_min,"price_max": data.price_max,"compare_at_price_min": data.compare_at_price_min,"compare_at_price_max": data.compare_at_price_max};return itemJson;};
BCSfFilter.prototype.prepareProductData = function(data) {var countData = data.length;for (var k = 0; k < countData; k++) {data[k]['images'] = data[k]['images_info'];if (data[k]['images'].length > 0) {data[k]['featured_image'] = data[k]['images'][0]} else {data[k]['featured_image'] = {src: bcSfFilterConfig.general.no_image_url,width: '',height: '',aspect_ratio: 0}}data[k]['url'] = '/products/' + data[k].handle;var optionsArr = [];var countOptionsWithValues = data[k]['options_with_values'].length;for (var i = 0; i < countOptionsWithValues; i++) {optionsArr.push(data[k]['options_with_values'][i]['name'])}data[k]['options'] = optionsArr;if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) {var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim();function updateMultiCurrencyPrice(oldPrice, newPrice) {if (typeof newPrice != 'undefined') {return newPrice;}return oldPrice;}data[k].price_min = updateMultiCurrencyPrice(data[k].price_min, data[k]['price_min_' + currentCurrency]);data[k].price_max = updateMultiCurrencyPrice(data[k].price_max, data[k]['price_max_' + currentCurrency]);data[k].compare_at_price_min = updateMultiCurrencyPrice(data[k].compare_at_price_min, data[k]['compare_at_price_min_' + currentCurrency]);data[k].compare_at_price_max = updateMultiCurrencyPrice(data[k].compare_at_price_max, data[k]['compare_at_price_max_' + currentCurrency]);}data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100;data[k]['price'] = data[k]['price_min'];data[k]['compare_at_price'] = data[k]['compare_at_price_min'];data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max'];var firstVariant = data[k]['variants'][0];if (getParam('variant') !== null && getParam('variant') != '') {var paramVariant = data[k]['variants'].filter(function(e) {return e.id == getParam('variant')});if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0]} else {var countVariants = data[k]['variants'].length;for (var i = 0; i < countVariants; i++) {if (data[k]['variants'][i].available) {firstVariant = data[k]['variants'][i];break}}}data[k]['selected_or_first_available_variant'] = firstVariant;var countVariants = data[k]['variants'].length;for (var i = 0; i < countVariants; i++) {var variantOptionArr = [];var count = 1;var variant = data[k]['variants'][i];var variantOptions = variant['merged_options'];if (Array.isArray(variantOptions)) {var countVariantOptions = variantOptions.length;for (var j = 0; j < countVariantOptions; j++) {var temp = variantOptions[j].split(':');data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1];data[k]['variants'][i]['option_' + temp[0]] = temp[1];variantOptionArr.push(temp[1])}data[k]['variants'][i]['options'] = variantOptionArr}data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100;data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100}data[k]['description'] = data[k]['content'] = data[k]['body_html'];if (data[k].hasOwnProperty('original_tags') && data[k]['original_tags'].length > 0) {data[k]['tags'] = data[k]['original_tags'].slice(0);}data[k]['json'] = customizeJsonProductData(data[k]);}return data;};


/**** Start - Boost - 32722 ****/
BCSfFilter.prototype.afterBuildFilterTree = function(data) {
    // Wrap all filter option blocks for styling
    jQ(this.selector.filterTree).children().wrapAll('<div id="bc-sf-filter-options-wrapper"></div>');
    // Box Style
    this.buildFilterOptionBoxStyle();
    // Open again filter options after submitting on PC
    this.triggerOpenHorizontalFilterEvent();
    // Add scroll bar for block has long content, except the filter option which is range
    this.buildFilterShowMore();
    // Collapse all filter options by default
    if (!this.checkIsFullWidthMobile()) this.collapseFilterOption();
  
  	var htmlTemplate = '<li><ul class="horizontal"><li>Horizontal</li></ul></li><li><ul class="vertical"><li>Vertical</li></ul></li>'
  	jQ('[data-id="pf_t_format"] .bc-sf-filter-block-content ul').append(htmlTemplate);
  
  	jQ('#bc-sf-filter-tree-h [data-id="pf_t_format"] .bc-sf-filter-block-content ul a[data-id="pf_t_format"]').each(function(){
      	var $this = jQ(this);
      	var value = $this.data('value');
      	var $parent = $this.parent('li');
      	var html = '<li>' + $parent.html() + '</li>';
      
      	if (value.indexOf('vertical') > -1) {
          	jQ('#bc-sf-filter-tree-h [data-id="pf_t_format"] .bc-sf-filter-block-content ul.vertical').append(html);
          	
        } else {
          	jQ('#bc-sf-filter-tree-h [data-id="pf_t_format"] .bc-sf-filter-block-content ul.horizontal').append(html);
        }
      
      	$parent.remove();
    });
  
  	jQ('#bc-sf-filter-tree [data-id="pf_t_format"] .bc-sf-filter-block-content ul a[data-id="pf_t_format"]').each(function(){
      	var $this = jQ(this);
      	var value = $this.data('value');
      	var $parent = $this.parent('li');
      	var html = '<li>' + $parent.html() + '</li>';
      
      	if (value.indexOf('vertical') > -1) {
          	jQ('#bc-sf-filter-tree [data-id="pf_t_format"] .bc-sf-filter-block-content ul.vertical').append(html);
          	
        } else {
          	jQ('#bc-sf-filter-tree [data-id="pf_t_format"] .bc-sf-filter-block-content ul.horizontal').append(html);
        }
      
      	$parent.remove();
    });
};


BCSfFilter.prototype.buildFilterOptionLabel = function(label, productNumber, fOData) {
    // Customize label
    label = this.customizeFilterOptionLabel(label, fOData.prefix, fOData.filterType, fOData.displayAllValuesInUppercaseForm);
  	switch (label) {
      case 'Acmehorizontal': label = 'One piece'; break;
      case 'Acme3horizontal': label = '3 pieces'; break;
      case 'Acme5p': label = '5 pieces'; break;
      case 'Acmevertical': label = 'One piece'; break;
      case 'Acme3vertical': label = '3 pieces'; break;
      default: label = label;
    }
  
    // Build Labels
    var itemLabelHtml = this.getTemplate('filterOptionLabel').replace(/{{itemValue}}/g, label);
    if (this.getSettingValue('general.showFilterOptionCount') && fOData.displayType != 'box') {
        if (fOData.keepValuesStatic !== true && productNumber !== null && ((productNumber > 0 && this.getSettingValue('general.showOutOfStockOption') == false) || this.getSettingValue('general.showOutOfStockOption') == true)) {
            return itemLabelHtml.replace(/{{itemAmount}}/g, '(' + productNumber + ')');
        }
    }
    return itemLabelHtml.replace(/{{itemAmount}}/g, '');
};

BCSfFilter.prototype.buildFilterOptionSwatchData = function(fOType, fOId, fOLabel, fODisplayType, fOSelectType, fOItemValue, fOData, fTreeType) {
    if (this.checkShowFilterOptionItem(fOItemValue, fOData)) {
        var iValue = fOItemValue.key, iLabel = fOItemValue.key;
        var swatchName = iValue;
        if (fOType == 'collection') {
            iLabel = fOItemValue.label, iValue = fOItemValue.handle;
            swatchName = iLabel;
        }

        var colorOptionsArr = this.getSettingValue('general.colorOptionsArr');
        // Get prefix of swatch from filter option id
        // Ex: By option: pf_opt_color -> color, pf_opt_size -> size
        //     By tag: pf_t_color -> color, pf_t_dimension -> dimension
        var prefixSwatch = fOId.replace('pf_t_', '').replace('pf_opt_', '');
        // Deprecated
        if (colorOptionsArr != '') {
            var isColor = colorOptionsArr.filter(function(item) {
                return fOId.indexOf(item) > -1;
            });
            if (typeof isColor[0] !== 'undefined') {
                prefixSwatch = 'color';
            }
        }
        // Get Swatch name
        swatchName = this.customizeSwatchFileName(swatchName, fOItemValue, fOData);
        // Get item HTML Template & Build data
        var html = this.getTemplate('filterOptionSwatchItem');
        html = this.buildFilterOptionItem(html, iLabel, iValue, fOType, fOId, fOLabel, fODisplayType, fOSelectType, fOItemValue, fOData, fTreeType);
        // Add Image
        var filePath = getFilePath(prefixSwatch + '-' + swatchName, this.swatchExtension, this.getSettingValue('general.swatchImageVersion'));
      	if (fOId == 'pf_t_format') {
          	filePath = bcSfFilterMainConfig.general.asset_url.replace('bc-sf-filter.js', prefixSwatch + '-' + swatchName + '.svg');
        }
        html = html.replace(/{{itemImageValue}}/g, filePath);
        // Add Border
        var border = fOData.hasOwnProperty('borderSwatch') && fOData.borderSwatch != '' ? fOData.borderSwatch : 'none';
        html = html.replace(/{{itemBorder}}/g, border);
        return html;
    }
    return '';
};

BCSfFilter.prototype.buildFilterSelectionData = function(data) {
    function buildItem(template, title, label, clearLink) {
        switch (label) {
          case 'Acmehorizontal': label = 'Horizontal: One piece'; break;
          case 'Acme3horizontal': label = 'Horizontal: 3 pieces'; break;
          case 'Acme5p': label = 'Horizontal: 5 pieces'; break;
          case 'Acmevertical': label = 'Vertical: One piece'; break;
          case 'Acme3vertical': label = 'Vertical: 3 pieces'; break;
          default: label = label;
        }
        template = template.replace(/{{itemType}}/g, title);
        template = template.replace(/{{itemLabel}}/g, label);
        template = template.replace(/{{itemLink}}/g, clearLink);
        return template;
    }

    var _this = this;
    var verticalContent = horizontalContent = '';
    var itemVerticalHtml = this.getTemplate('filterRefineItem');
    var itemHorizontalHtml = this.getTemplate('filterRefineHorizontalItem');
    var options = data.filter.options;

    // Get all params that have on URL
    var paramKeys = Object.keys(_this.queryParams);
    paramKeys = paramKeys.filter(function(key) {
        return key.indexOf('pf_') == 0
    });

    jQ.each(paramKeys, function(i, key) {
        var selectedOption = options.filter(function(e) { return e.filterOptionId == key })[0];
        if (typeof selectedOption !== 'undefined' && _this.queryParams.hasOwnProperty(key) && _this.queryParams[key] && _this.queryParams[key].length) {
            var values = _this.queryParams[key],
                fOId = selectedOption.filterOptionId,
                prefix = selectedOption.prefix,
                title = selectedOption.label,
                fType = selectedOption.filterType,
                fODisplayType = selectedOption.displayType;
            prefix = typeof prefix !== 'undefined' && prefix !== null && prefix !== false ? prefix.replace(/\\/g, '') : '';
            if (!Array.isArray(values)) values = [values];
            // Fix email campaign issue
            values = values.map(function(value) {
                return value.toString().replace(/\+/g, '%20');
            });

            if (fODisplayType == 'range') {
                /* RANGE SLIDER
                *  - Is advanced range slider: Get first value and last value for min-max
                *  - Is general range slider:  Split value by ":" to get min-max
                **/
                var label = '';
                if (fType.indexOf('price') == -1 && fType !== 'weight' && fType.indexOf('range_slider') == -1) {
                    // Return an Array of values
                    var rangeValues = []
                    if (selectedOption && selectedOption.hasOwnProperty('values')) {
                        rangeValues = selectedOption['values'].map(function(value) {
                            return value.key;
                        });
                    }
                    // Get min/max label from URL
                    var currentLabels = rangeValues.length ? _this.getAdvancedRangeSelectedValues(values, rangeValues) : [values[0], values[values.length - 1]];
                    label = currentLabels[0].toString().replace(prefix, '');
                    if (values.length > 1) {
                        label += ' - ' + currentLabels[1].toString().replace(prefix, '');
                    }
                } else {
                    var value = values[0], elements = value.split(':');
                    if (fType == 'price') {
                        var minPrice = _this.formatMoney(elements[0] * 100),
                            maxPrice = _this.formatMoney(elements[1] * 100);
                        if (_this.getSettingValue('general.removePriceDecimal')) {
                            minPrice = _this.removeDecimal(minPrice), maxPrice = _this.removeDecimal(maxPrice);
                        }
                        label = minPrice + ' - ' + maxPrice;
                    } else {
                        label = elements[0] + ' - ' + elements[1];
                    }
                }
                var clearLink = _this.buildClearFilterOptionLink(fOId, title, values);
                verticalContent += buildItem(itemVerticalHtml, title, label, clearLink);
                horizontalContent += buildItem(itemHorizontalHtml, title, label, clearLink);
            } else {
                for (var i = 0; i < values.length; i++) {
                    var value = values[i], label = value;
                    // Customize label
                    label = _this.customizeFilterOptionLabel(label, prefix, fType);
                    var clearLink = _this.buildClearFilterOptionLink(fOId, title, value);
                    // Remove the prefix in label
                    if (typeof prefix !== 'undefined' && prefix !== null && prefix !== false) {
                        prefix = prefix.replace(/\\/g, '');
                        value = value.replace(prefix, '').trim();
                    }
                    switch(fType) {
                        case 'price': label = _this.getPriceLabel(value); break;
                        case 'percent_sale': label = _this.getPercentSaleLabel(value); break;
                        case 'stock': label = (value === 'true') ? selectedOption.values[0].label : selectedOption.values[1].label; break;
                        case 'review_ratings':
                            var showExactRating = selectedOption.hasOwnProperty('showExactRating')? selectedOption.showExactRating: false;
                            label = _this.getReviewRatingsLabel(value, showExactRating);
                            break;
                    }
                    verticalContent += buildItem(itemVerticalHtml, title, label, clearLink);
                    horizontalContent += buildItem(itemHorizontalHtml, title, label, clearLink);
                }
            }
        }
    });

    return [verticalContent, horizontalContent];
};

/**** End - Boost - 32722 ****/