export default function (file) {
    this.data = file.data
    this.links = file.links

    this.getTitle = function () {
        return this.data.attributes.frontMatter.title
    }

    this.setTitle = function (v) {
        this.data.attributes.frontMatter.title = v
    }

    this.getDate = function () {
        // We need to multiply the date provided by the server because it's sent in microseconds and Date reads
        // the unix timestamp in milliseconds.
        let d = new Date(this.data.attributes.frontMatter.date * 1000)
        return d.toDateString()
    }

    this.getContent = function () {
        return this.data.attributes.fileContent
    }

    this.isPublished = function () {
        if (!this.data.attributes.draft) {
            return false
        }
        return this.data.attributes.draft
    }
}
