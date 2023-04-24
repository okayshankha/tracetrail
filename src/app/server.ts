import path from 'path'
import express, { Request, Response } from 'express'

const app = express()

app.use(express.static(path.join(__dirname, '../../ui')))

// Handle requests to the sub-route
app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '../../ui', 'index.html'));
});

app.get('/api', (req: Request, res: Response) => {
    return res.json({ message: 'Hello from trailtrace' })
})

export default app