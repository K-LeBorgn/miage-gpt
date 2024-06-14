// Get value of environment variable OPENAI_API_KEY and store into API_KEY
// This is the API key for the OpenAI API
// Vous devez définir une variable d'environnement OPENAI_API
// et l'exporter.
// Sur mac/linux:
// export OPENAI_API_KEY="votre_clé_api"
// Sur windows:
// set OPENAI_API_KEY="votre_clé_api"
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

export const PORT = process.env.PORT || 3001;

// create an instance of OpenAI with the api key
export const openai = new OpenAI({
    apiKey: API_KEY
});