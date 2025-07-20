import mongoose from 'mongoose'
import config from './app/config'
import app from './appFile'

async function bootstrap() {
  try {
    await mongoose.connect(config.db_url as string, { autoIndex: true })

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`)
    })
  } catch (err) {
    console.log(err)
  }
}

bootstrap()
