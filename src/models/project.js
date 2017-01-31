export default function (attr) {
    // The database id set from the api
    this.id = attr.id || null

    // Name of the project
    this.name = attr.name || 'unnamed'

    // The uuid of the site that this project belongs to
    this.siteUUID = attr.siteUUID || null
}
