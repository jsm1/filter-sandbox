module.exports = {
    items: [],
    parser: null,
    chunkSize: null,
    nextPageSelector: null,
    filterTagsSelector: null,
    itemSelector: null,

    init(config) {
        Object.assign(this, config)
        this.parser = new DOMParser()
    },

    async run() {
        const nextPagePrefix = this.getNextPagePrefix(document)
        let pageNumber = 2
        let lastPageReached = false
        while (!lastPageReached) {
            let count = 0
            const promises = []
            while (count < this.chunkSize) {
                promises.push(
                    this.getPage(nextPagePrefix, pageNumber)
                        .then((pageData) => {
                            const doc = this.parser.parseFromString(pageData, 'text/html')
                            this.parsePage(doc)
                            if (!this.getNextPageQueryString(doc)) {
                                lastPageReached = true
                            }
                        })
                )
                pageNumber++
                count++
            }
            await Promise.all(promises)
        }
        this.addItemsToPage()
        this.addFilterTags()
    },
    async getPage(prefix, number) {
        return fetch(`${prefix}${number}`)
            .then((resp) => resp.text())
    },

    parsePage(doc) {
        this.items.push(...doc.querySelectorAll(this.itemSelector));
    },

    getNextPagePrefix(doc) {
        const queryString = this.getNextPageQueryString(doc)
        return queryString.replace(/=\d+$/, '=')
    },

    getNextPageQueryString(doc) {
        const nextPageNode = doc.querySelector(this.nextPageSelector)
        return nextPageNode ? nextPageNode.search : null
    },

    addItemsToPage() {
        const listItemParent = document.querySelector(this.itemSelector).parentNode
        this.items.forEach(node => {
            node.style.display = 'none'
            listItemParent.appendChild(node)
        })
    },

    addFilterTags() {
        [...document.querySelectorAll(this.itemSelector)].forEach(el => {
            const attributeEl = el.querySelector(this.filterTagsSelector + ' div')
            if (!attributeEl) {
                return
            }
            const attributes = [...attributeEl.attributes]
                .filter(attribute => {
                    return /^data-\w+-tag$/.test(attribute.name)
                }).forEach(attribute => {
                    el.setAttribute(attribute.name, attribute.value)
                })

        })
    },
}