import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// import authRoutes from './routes/authRoutes.js'
import pacienteRoutes from './routes/pacienteRoute.js'
import medicoRoutes from './routes/medRouter.js'
import atendimentoRoutes from './routes/atendimentoRoute.js'
import rellatorioRoute from './routes/rellatorioRoute.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors()) 


// app.use("/auth", authRoutes)
app.use("/paciente", pacienteRoutes)
app.use("/medico", medicoRoutes)
app.use("/atendimento", atendimentoRoutes)
app.use("/relatorio",  rellatorioRoute)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando em localhost:${PORT}`)
})
