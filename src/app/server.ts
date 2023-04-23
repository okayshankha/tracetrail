import path from 'path'
import express, { Request, Response } from 'express'

const app = express()

app.use('/', express.static(path.join(__dirname, '../../public')))

app.get('/api', (req: Request, res: Response) => {
    return res.json({ message: 'Hello from trailtrace' })
})

export default app