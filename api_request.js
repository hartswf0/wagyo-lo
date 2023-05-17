const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

let open_ai_response;
let responseText = "";
let apireturn;
let data;
let userPrompt = "";
let revise_bool = false;
let entityEl;
let entityContents;
let includes_scene = false

// openai_test();
function test(){
  console.log("Test successful");
} 

async function api_request(prompt,revise_bool, previous_prompt_result) {
  let system_status = process.env.SYSTEM_STATUS;
  
  let user_revise = "Can you revise this code for the following user prompt? And put it inside <a-scene> tags. "

  let model = "gpt-3.5-turbo";

  console.log(`API Fired`);
  
  // Test
  var params = {
    "model": model,
    "messages": [
      {"role": "system", "content": system_status},
      {"role": "user", "content": prompt} 
    ]
  };
  
  // If Revision - Not fully integrated
  if (revise_bool == true) {
    
    console.log(`User revision is ${prompt}`);
    console.log(`Previous content was ${previous_prompt_result}`);
    console.log(`Previous prompt had scene ${includes_scene}`);
    
    if(!includes_scene){
      previous_prompt_result = "<a-scene> " + previous_prompt_result + " </a-scene>";
    }
      params = {
      "model": model,
      "messages": [
        {"role": "system", "content": system_status},
        {"role": "user", "content": user_revise + "user prompt:" + prompt + "Previous Code:" + previous_prompt_result}
      ]
    };
    console.log("Revision looks like this: " + user_revise + ". user prompt:" + prompt + ". Previous Code:" + previous_prompt_result);
  } else {
    console.log(`User prompt is ${prompt}`);

    params = {
      "model": model,
        "messages": [
          {"role": "system", "content": system_status},
          {"role": "user", "content": prompt + " .Put it inside <a-scene> tags."}
        ]
    };
  }
  
  const response = await openai.createChatCompletion(params)
  
  const responseText = await response.data.choices[0].message.content;
  
  console.log(responseText);

  
  return responseText
}

module.exports = api_request;