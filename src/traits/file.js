// The below are mutators, this file should also provide methods.
export default {
    fileTitle () {
        return this.file.attributes.frontMatter.title
    },
    fileDate () {
        if (this.file.attributes.frontMatter.date) {
            return Math.floor(this.file.attributes.frontMatter.date * 1000)
        }
        return Math.floor(this.file.attributes.date * 1000)
    },
    isPublished () {
        // Is not published if draft = true
        // Is not published if draft = false && date in future
        let publishDate = this.file.attributes.frontMatter.date
        if (publishDate) {
            let date = Math.floor(new Date(publishDate * 1000).getTime() / 1000)
            let now = Math.floor(Date.now() / 1000)

            if (this.file.attributes.frontMatter.draft === true) {
                return false
            }
            if (this.file.attributes.frontMatter.draft === false && date > now) {
                return false
            }
        }
        return !this.file.attributes.frontMatter.draft
    },
    isScheduled () {
        // Is scheduled if draft = false && date in future
        let publishDate = this.file.attributes.frontMatter.date
        if (!publishDate) {
            return false
        }
        let date = Math.floor(new Date(publishDate * 1000).getTime() / 1000)
        let now = Math.floor(Date.now() / 1000)

        if (this.file.attributes.frontMatter.draft === false && date > now) {
            return true
        }
        return false
    },
    isDraft () {
        // Is a draft if draft = true && date in past
        // Or if date doesn't exist the valule of draft is used
        let publishDate = this.file.attributes.frontMatter.date
        if (typeof publishDate === 'undefined') {
            return this.file.attributes.frontMatter.draft
        }

        let date = Math.floor(new Date(publishDate * 1000).getTime() / 1000)
        let now = Math.floor(Date.now() / 1000)
        if (this.file.attributes.frontMatter.draft === true && date < now) {
            return true
        }

        return false
    }
}
