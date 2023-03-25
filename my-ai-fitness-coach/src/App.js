import { useState } from "react";
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
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import loading from "./deadlift.gif";
import { FormControlProps } from "@mui/material";

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
      message: "",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [gender, setGender] = useState("Male");
  const [days, setDays] = useState("3");
  const [cardio, setCardio] = useState("without");
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

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleDaysChange = (event) => {
    setDays(event.target.value);
  };

  const handleLengthChange = (event) => {
    setLength(event.target.value);
  };

  const handleCardioChange = (event) => {
    setCardio(event.target.value);
  };

  function targetString() {
    var string = "";
    for (var key in target) {
      if (target[key]) {
        string += key + ", ";
      }
    }
    return string;
  }

  const controlGender = (item) => ({
    checked: gender === item,
    onChange: handleGenderChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  const controlDays = (item) => ({
    checked: days === item,
    onChange: handleDaysChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  const controlLength = (item) => ({
    checked: length === item,
    onChange: handleLengthChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  const controlCardio = (item) => ({
    checked: cardio === item,
    onChange: handleCardioChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

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
    // await processMessageToChatGPT(newMessages);
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
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

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
      <h1 className="title">My AI Fitness Coach</h1>
      <div className="subTitle">Powered by Chat GPT</div>
      <div className="content">
        <MainContainer className="mainContainer">
          <div className="options">
            <div className="optionGroup">
              <FormLabel sx={{ color: "#17152a" }}>Gender</FormLabel>
              <RadioGroup
                row
                defaultValue="Male"
                name="radio-buttons-group"
                // onChange={(i) => setGender(i.target.value)}
              >
                <FormControlLabel
                  value="Male"
                  control={
                    <Radio
                      {...controlGender("Male")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={
                    <Radio
                      {...controlGender("Female")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="Female"
                />
              </RadioGroup>
            </div>
            <div className="optionGroup">
              <FormLabel sx={{ color: "#17152a" }}>Working out Days</FormLabel>
              <RadioGroup
                row
                defaultValue="3"
                name="radio-buttons-group"
                // onChange={(i) => setDays(i.target.value)}
              >
                <FormControlLabel
                  value="1"
                  control={
                    <Radio
                      {...controlDays("1")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="1"
                />
                <FormControlLabel
                  value="2"
                  control={
                    <Radio
                      {...controlDays("2")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="2"
                />
                <FormControlLabel
                  value="3"
                  control={
                    <Radio
                      {...controlDays("3")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="3"
                />
                <FormControlLabel
                  value="4"
                  control={
                    <Radio
                      {...controlDays("4")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="4"
                />
                <FormControlLabel
                  value="5"
                  control={
                    <Radio
                      {...controlDays("5")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="5"
                />
                <FormControlLabel
                  value="6"
                  control={
                    <Radio
                      {...controlDays("6")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="6"
                />
                <FormControlLabel
                  value="7"
                  control={
                    <Radio
                      {...controlDays("7")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="7"
                />
              </RadioGroup>
            </div>
            <div className="optionGroup">
              <FormLabel sx={{ color: "#17152a" }}>
                Length of the workout
              </FormLabel>
              <RadioGroup
                row
                defaultValue="1 hour"
                name="radio-buttons-group"
                // onChange={(i) => setLength(i.target.value)}
              >
                <FormControlLabel
                  value="10 min"
                  control={
                    <Radio
                      {...controlLength("10 min")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="10 min"
                />
                <FormControlLabel
                  value="20 min"
                  control={
                    <Radio
                      {...controlLength("20 min")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="20 min"
                />
                <FormControlLabel
                  value="30 min"
                  control={
                    <Radio
                      {...controlLength("30 min")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="30 min"
                />
                <FormControlLabel
                  value="45 min"
                  control={
                    <Radio
                      {...controlLength("45 min")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="45 min"
                />
                <FormControlLabel
                  value="1 hour"
                  control={
                    <Radio
                      {...controlLength("1 hour")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="1 hour"
                />
                <FormControlLabel
                  value="2 hour"
                  control={
                    <Radio
                      {...controlLength("2 hour")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="2 hour"
                />
              </RadioGroup>
            </div>
            <div className="optionGroup">
              <FormLabel sx={{ color: "#17152a" }}>Include Cardio?</FormLabel>
              <RadioGroup
                row
                defaultValue="without"
                name="radio-buttons-group"
                // onChange={(value) => setCardio(value)}
              >
                <FormControlLabel
                  value="with"
                  control={
                    <Radio
                      {...controlCardio("with")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="Yes"
                />
                <FormControlLabel
                  value="without"
                  control={
                    <Radio
                      {...controlCardio("without")}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2b7a78",
                        },
                      }}
                    />
                  }
                  label="No"
                />
              </RadioGroup>
            </div>
            <div className="optionGroup">
              <Box sx={{ display: "flex" }}>
                <FormControl component="fieldset" variant="standard">
                  <FormLabel sx={{ color: "#17152a" }}>
                    Target muscle group (Optional)
                  </FormLabel>
                  <FormGroup xs={3} row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={calves}
                          onChange={handleTargetChange}
                          name="calves"
                          sx={{
                            "&.Mui-checked": {
                              color: "#2b7a78",
                            },
                          }}
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
                          sx={{
                            "&.Mui-checked": {
                              color: "#2b7a78",
                            },
                          }}
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
                          sx={{
                            "&.Mui-checked": {
                              color: "#2b7a78",
                            },
                          }}
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
                          sx={{
                            "&.Mui-checked": {
                              color: "#2b7a78",
                            },
                          }}
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
                          sx={{
                            "&.Mui-checked": {
                              color: "#2b7a78",
                            },
                          }}
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
                          sx={{
                            "&.Mui-checked": {
                              color: "#2b7a78",
                            },
                          }}
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
                          sx={{
                            "&.Mui-checked": {
                              color: "#2b7a78",
                            },
                          }}
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
                          sx={{
                            "&.Mui-checked": {
                              color: "#2b7a78",
                            },
                          }}
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
                          sx={{
                            "&.Mui-checked": {
                              color: "#2b7a78",
                            },
                          }}
                        />
                      }
                      label="Lats"
                    />
                  </FormGroup>
                </FormControl>
              </Box>
            </div>
          </div>
          <div className="generateButton">
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2b7a78", color: "#feffff" }}
              onClick={handleSend}
            >
              Generate Workout Plan
            </Button>
          </div>

          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <div className="loading">
                    <img src={loading} width="160px" alt="loading..." />
                    <br />
                    AI is generating your workout plan...
                  </div>
                ) : null
                //   <TypingIndicator content="ChatGPT is typing" />
                // ) : null
              }
            >
              {messages.map((message, i) => {
                return message.sender == "ChatGPT" ? (
                  <ReactMarkdown styles={{ alignSelf: "flex-start" }}>
                    {message.message}
                  </ReactMarkdown>
                ) : null;
              })}
            </MessageList>
          </ChatContainer>
        </MainContainer>

        <div className="footer">
          <div className="row row1">Created by Jooyeon Park</div>
          <div className="row row2">
            Snake Software: Snake is the cuttest animal
          </div>
          <a
            className="row row3"
            href="https://github.com/Jooyeon-Park/y-hack-2023"
          >
            https://github.com/Jooyeon-Park/y-hack-2023
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
