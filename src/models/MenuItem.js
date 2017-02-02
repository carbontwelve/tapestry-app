export default function (attr) {
    this.title = attr.title || ''
    this.route = attr.route || ''
    this.meta = attr.meta || {}
    this.children = attr.children || []
    this.expanded = attr.expanded || false
}
