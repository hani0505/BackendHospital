
import {z} from 'zod'
import * as doctorService from "../services/medService.js"

//schema validation

const createMdShema = z.object({
    nome: z.string().min(3, "o nome é obrigatório"),
    especialidade : z.enum(["CARDIOLOGISTA", "PEDIATRIA", "ORTOPEDISTA"]),
    email: z.string(),
    senha: z.string().min(6, "minimo 6 caracteres")

})

export const createDoctor = async (req, res) => {
    try{
        //valida os dados
        const validate = createMdShema.parse(req.body)
        //pega dados validados
        const doctor = await doctorService.createDoctor(validate)
        res.status(201).json(doctor)
    }
    catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
};
    

export const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};