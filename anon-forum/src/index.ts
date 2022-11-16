import app from './app'

const PORT = process.env.PORT || 12121

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
