export default function (attr) {
    this.name = attr.name || 'unnamed'
    this.site = attr.site || null // this is the uuid of the site that this project belongs to
}