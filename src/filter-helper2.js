module.exports = {
    init(config) {
        Object.assign(this, config)
        this.storeOriginalItemValues()
        this.addEventListenerToSelector(this.filterItemSelector, 'click', this.onFilterClick)
    },

    addEventListenerToSelector(selector, event, func) {
        document.querySelectorAll(selector)
            .forEach(node => node.addEventListener(event, func.bind(this)))
    },

    storeOriginalItemValues() {
        [...document.querySelectorAll(this.filterItemSelector)].forEach((item) => {
            const text = item.innerText;
            [...item.querySelectorAll('input')].forEach(el => el.setAttribute(this.filterItemValueAttribute, text))
        })
    },

    onFilterClick(event) {
        const state = this.getFilterState()
        this.applyFilterState(state)
    },

    getFilterState() {
        console.log('Getting filter state')
        const checkedFilterItems = [...document.querySelectorAll(this.filterItemSelector + ' input:checked')];
        const appliedFilters = {}
        checkedFilterItems.forEach(item => {
            const filterName = item.getAttribute(this.filterNameAttribute);
            if (!appliedFilters[filterName]) {
                appliedFilters[filterName] = []
            }
            appliedFilters[filterName].push(item.getAttribute(this.filterItemValueAttribute))
        })

        return appliedFilters       
    },

    applyFilterState(state) {
        [...document.querySelectorAll(this.filteredItemsSelector)].forEach((item) => {
            let showItem = true;
            Object.entries(state).forEach(([filterName, values]) => {
                const itemValueForFilter = this.getValueForFilter(item, filterName);
                if (values.length) {
                    if (!values.includes(itemValueForFilter)) {
                        showItem = false
                        return
                    }
                }
            })
            if (!showItem) {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
            }
        });
    },  

    getValueForFilter(element, filterName) {
        return element.getAttribute(`data-${filterName}-tag`)
    },

}