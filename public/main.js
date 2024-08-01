const socket = io("http://localhost:8000");

const clients_total = document.getElementById("clients_total");
const name_input = document.getElementById("name_input");
const msg_container = document.getElementById("msg_container");
const msg_form = document.getElementById("msg_form");
const msg_input = document.getElementById("msg_input");
const isTyping = document.getElementById("isTyping");

msg_form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMsg();
});

socket.on("clients_total", (data) => {
  clients_total.innerHTML = `Total Client Connected : ${data}`;
});

socket.on("chat_message", (data) => {
  addMsgToUi(false, data);
});

function addMsgToUi(isOwnMsg, data) {
  const element = isOwnMsg
    ? `
      <div class="m-2 p-2 border bg-black text-white rounded-t-xl rounded-bl-xl w-56 text-wrap self-end" >
          <p class="">${data.msg}</p>
          <span class="text-xs">😊 ${data.name} 🕓 ${data.dateTime} </span>
      </div>
    `
    : `  
      <div class="m-2 p-2 bg-white text-black rounded-t-xl rounded-br-xl w-56 text-wrap self-start">
        <p class="">${data.msg}</p>
        <span class="text-xs">😊 ${data.name} 🕓 ${data.dateTime} </span>
      </div>`;

  msg_container.innerHTML += element;
  clearFeedback();
  scrollToBottom();
}

function sendMsg() {
  if (msg_input.value == "") return;

  const data = {
    name: name_input.value,
    msg: msg_input.value,
    dateTime: new Date().toLocaleTimeString(),
  };

  socket.emit("new_message", data);
  addMsgToUi(true, data);

  msg_input.value = "";
}

function scrollToBottom() {
  msg_container.scrollTo(0, msg_container.scrollHeight);
}

msg_input.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `✍ ${name_input.value} is typing massage`,
  });
});
msg_input.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: `online`,
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  scrollToBottom();

  const element = `<p class="feedback text-white text-xs">${data.feedback}</p>`;

  isTyping.innerHTML = element;
});

function clearFeedback() {
  isTyping.innerHTML = `<p class="feedback text-white text-xs">online</p>`;
}
