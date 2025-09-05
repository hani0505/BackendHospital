import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
//rota de autenticação 

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors)

app.use("/auth")
app.use('/paciente')
app.use('/med')
app.use('/atendimento')
app.use('/relatorio')

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando em localhost:${PORT}`)
})
