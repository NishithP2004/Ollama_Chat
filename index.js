import express from 'express';
import ollama from 'ollama';

const LLM_MODEL = "gemma"
const app = express();
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

const PORT = process.env.PORT || 3000;

async function loadModel(model) {
    return ollama.pull({
        model
    })
}

(async () => {
    await loadModel(LLM_MODEL);

    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    });
})();

const generate_response = async (prompt = "Hello", model="gemma") => {
    try {
        let response = (await ollama.generate({
            model,
            prompt
        })).response

        return response;
    } catch (err) {
        throw err;
    }
}

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Hello World"
    })
})

app.post("/chat", async (req, res) => {
    try {
        const { prompt } = req.body; 
        const { model } = req.query;

        let response = await generate_response(prompt, model);
        res.status(200).send({
            response: response
        })

    } catch (err) {
        res.status(500).send({
            error: err.message
        })
    }
})

app.post("/load", async (req, res) => {
    let model = req.body.model;
    try {
        if(model) {
            await loadModel(model)
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch(err) {
        res.status(500).send({
            error: err.message
        })
    }
})