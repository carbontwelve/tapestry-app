import Moment from 'moment'
import sha1 from 'sha1'
import axios from 'axios'

// @todo add uuid (needs a uuid lib)
export default function (attr) {
    this.name = attr.name || ''
    this.url = attr.url || ''
    this.token = attr.token || ''
    this.created_at = attr.created_at || Date.now()
    this.token_retrieved_at = attr.token_retrieved_at || null
    this.hash = attr.hash || sha1(JSON.stringify(this))
    this.api = attr.api || { jsonApiVersion: null, tapestryVersion: null }

    // Returns the created date formatted by moment.js
    this.getCreatedDate = function (format) {
        return Moment(this.created_at).format(format || 'MMM Do YYYY')
    }

    this.setJWT = function (token) {
        this.token = token
        this.token_retrieved_at = Date.now()
    }

    // Initiate Hello World with the API endpoint
    this.apiHandshake = function () {
        var ajax = axios.create({
            baseURL: this.url
        })
        return ajax.get('handshake').then((response) => {
            return response.data
        }).catch(function (error) {
            return {data: null, errors: error}
        })
    }

    // Authenticate with the API and store a token
    this.authenticate = function (auth) {
        var ajax = axios.create({
            baseURL: this.url
        })
        return ajax.post('authenticate', {
            username: auth.username,
            password: auth.password
        }).then((response) => {
            return response.data
        }).catch(function (error) {
            return {data: null, errors: error}
        })
    }
}
