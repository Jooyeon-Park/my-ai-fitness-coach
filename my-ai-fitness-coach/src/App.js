import { useState, setState } from "react";
import "./App.scss";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import ReactMarkdown from "react-markdown";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";

const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content: `You are the world's foremost expert on physical health and workout routines. 
    You are a professional for suggesting custom, personalized workouts for people.

    Return your answer with text formatting, newlines and such as necessary.

    Don't use greetings.
    `,
  // Go straight into your answer. Don't use niceties such as "sure" or "okay"!
};

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [gender, setGender] = useState("Male");
  const [days, setDays] = useState("3");
  const [cardio, setCardio] = useState("Without");
  const [length, setLength] = useState("1 hour");
  const [target, setTarget] = useState({
    calves: false,
    hamstrings: false,
    quad: false,
    glutes: false,
    biceps: false,
    triceps: false,
    forearms: false,
    traps: false,
    lats: false,
  });

  function targetString() {
    var string = "";
    for (var key in target) {
      if (target[key]) {
        string += key + ", ";
      }
    }

    console.log("String: ", string);
    return string;
  }

  const handleSend = async () => {
    const newMessage = {
      message:
        "Generate " +
        days +
        " days workout plan" +
        cardio +
        " cardio, without a rest day for " +
        gender +
        ". The duration of each day's workout should be total " +
        length +
        " long. Include workout that targets the following: " +
        targetString(),
      direction: "outgoing",
      sender: "user",
    };

    console.log("New message: ", newMessage.message);

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  const handleChange = async (event) => {
    this.setState({ value: event.target.value });
  };

  const handleTargetChange = (event) => {
    setTarget({
      ...target,
      [event.target.name]: event.target.checked,
    });
  };

  const {
    calves,
    hamstrings,
    quad,
    glutes,
    biceps,
    triceps,
    forearms,
    traps,
    lats,
  } = target;
  async function processMessageToChatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <div className="App">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <MainContainer>
          <h1 className="title">My AI Fitness Coach</h1>

          <FormLabel>Gender</FormLabel>
          <RadioGroup
            row
            defaultValue="Male"
            name="radio-buttons-group"
            onChange={(i) => setGender(i.target.value)}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="Female"
              control={<Radio />}
              label="Female"
            />
          </RadioGroup>

          <FormLabel>Working out Days</FormLabel>
          <RadioGroup
            row
            defaultValue="3"
            name="radio-buttons-group"
            onChange={(i) => setDays(i.target.value)}
          >
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormControlLabel value="6" control={<Radio />} label="6" />
            <FormControlLabel value="7" control={<Radio />} label="7" />
          </RadioGroup>

          <FormLabel>Length of the workout</FormLabel>
          <RadioGroup
            row
            defaultValue="1 hour"
            name="radio-buttons-group"
            onChange={(i) => setLength(i.target.value)}
          >
            <FormControlLabel
              value="10 min"
              control={<Radio />}
              label="10 min"
            />
            <FormControlLabel
              value="20 min"
              control={<Radio />}
              label="20 min"
            />
            <FormControlLabel
              value="30 min"
              control={<Radio />}
              label="30 min"
            />
            <FormControlLabel
              value="45 min"
              control={<Radio />}
              label="45 min"
            />
            <FormControlLabel
              value="1 hour"
              control={<Radio />}
              label="1 hour"
            />
            <FormControlLabel
              value="2 hour"
              control={<Radio />}
              label="2 hour"
            />
          </RadioGroup>

          <FormLabel>Include Cardio?</FormLabel>
          <RadioGroup
            row
            defaultValue="without"
            name="radio-buttons-group"
            onChange={(value) => setCardio(value)}
          >
            <FormControlLabel value="with" control={<Radio />} label="Yes" />
            <FormControlLabel value="without" control={<Radio />} label="No" />
          </RadioGroup>

          <Box sx={{ display: "flex" }}>
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">
                Target muscle group (Optional)
              </FormLabel>
              <FormGroup xs={3} row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={calves}
                      onChange={handleTargetChange}
                      name="calves"
                    />
                  }
                  label="Calves"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hamstrings}
                      onChange={handleTargetChange}
                      name="hamstrings"
                    />
                  }
                  label="Hamstrings"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={quad}
                      onChange={handleTargetChange}
                      name="quad"
                    />
                  }
                  label="Quad"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={glutes}
                      onChange={handleTargetChange}
                      name="glutes"
                    />
                  }
                  label="Glutes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={biceps}
                      onChange={handleTargetChange}
                      name="biceps"
                    />
                  }
                  label="Biceps"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={triceps}
                      onChange={handleTargetChange}
                      name="triceps"
                    />
                  }
                  label="Triceps"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={forearms}
                      onChange={handleTargetChange}
                      name="forearms"
                    />
                  }
                  label="Forearms"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={traps}
                      onChange={handleTargetChange}
                      name="traps"
                    />
                  }
                  label="Traps"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={lats}
                      onChange={handleTargetChange}
                      name="lats"
                    />
                  }
                  label="Lats"
                />
              </FormGroup>
            </FormControl>
          </Box>

          <Button variant="contained" onClick={handleSend}>
            Generate Workout Plan
          </Button>
          {/* thithithithih */}

          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="ChatGPT is typing" />
                ) : null
              }
            >
              {messages.map((message, i) => {
                return (
                  <ReactMarkdown styles={{ alignSelf: "flex-start" }}>
                    {message.message}
                  </ReactMarkdown>
                );
              })}
            </MessageList>
            {/* <MessageInput placeholder="hello!!!" onSend={handleSend} /> */}
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
