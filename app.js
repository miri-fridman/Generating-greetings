const OpenAI = require('openai');

const express = require('express');
const { urlencoded } = require('body-parser');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/CreateBlessing', (req, res) => {
    const runCreating = async () => {
        const event = req.body["event"];
        const type = req.body["type"];
        const length = req.body["length"];
        // function getLength(selection) {
        //     switch (selection) {
        //         case 'Short (max 100 chars)':
        //             console.log('short');
        //             return 100*3;
        //         case 'Medium (max 200 chars)':
        //             console.log('medium');
        //             return 200*3;
        //         case 'Long (max 250 chars)':
        //             console.log('long');
        //             return 250*3;
        //         default:
        //             console.error(`Invalid length selection: ${selection}`);
        //             return undefined;
        //     }
        // }
        // const selectedLength = getLength(length);
        const prompt = `can you please write me 3 types of ${type} greetings for a ${event}, each greetings should have about ${length} words?, 
        return the response as a prsable JSON text like follows:
        {
            "1":"...",
            "2":"...",
            "3":"..."
        }`;
        console.log(prompt);

        const completion = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            max_tokens: length,
            temperature: 0,
        });
        console.log(`completion:  ${completion.choices[0].text}`);

        let greeting = completion.choices[0].text;
        let parseGreeting; 
        try{
            parseGreeting=JSON.parse(greeting);
        }
        catch{
            console.error('error at parsing JSON',error);
        }
        return parseGreeting;
    }
    runCreating().then(({ greeting }) => {
        if (greeting) {
            res.render('index', { content: 'CreateBlessing', response: greeting, error: 'undefind' })
        }
        else {
            res.render('index', { content: 'CreateBlessing', response: 'undefind', error: 'errer' })
        }
    })
})



app.listen(process.env.PORT, (req, res) => {
    console.log(`listening at port ${process.env.PORT}`);
})