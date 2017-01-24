import router from '../router/index'

export default {
  authenticated: false,
  login (context, creds, redirect) {
    this.authenticated = true
    if (redirect) {
      router.go(redirect)
    }
  },

  logout () {
    window.localStorage.removeItem('user')
    this.authenticated = false
    router.go('/login')
  }
}
