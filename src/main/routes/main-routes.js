export default (router) => {
  router.post('/signup', (req, res) => {
    res.status(200).json({ success: true })
  })
  router.post('/login', (req, res) => {
    res.status(200).json({ success: true })
  })
}
