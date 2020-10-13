import 'regenerator-runtime/runtime.js'
import mixitup from '../lib/mixitup'
import mixitupPagination from '../lib/mixitup-pagination'
import mixitupMultifilter from '../lib/mixitup-multifilter'

mixitup.use(mixitupPagination)
mixitup.use(mixitupMultifilter)

import pageBuster from './page-buster'
import filterHelper2 from './filter-helper2'
import searchHelper from './search-helper'
import ratingsHelper from './ratings-helper'

window.addEventListener('load', function() {
    pageBuster.init({
        chunkSize: 10,
        itemSelector: '.post-item',
        // Embed class for embedded Webflow attributes
        filterTagsSelector: '.filter-tags',
        // Pagination next button selector
        nextPageSelector: 'a.w-pagination-next',
    })

    pageBuster.run().then(() => {
        console.log('Loaded')
        filterHelper2.init({
            // Checkbox filter label (wraps input)
            filterItemSelector: '.w-dyn-item .checkbox-field',
            // Attribute name to store original value of input (in case of translation)
            filterItemValueAttribute: 'filter-item-value',
            // Filter name attribute on input
            filterNameAttribute: 'data-filter-name',
            // Selector for items being filtered
            filteredItemsSelector: '.post-item',
        })
    })

    // Reinitialise Webflow interactions
    Webflow.require('ix2').init()
})


