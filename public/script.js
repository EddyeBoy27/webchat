const inputValue = document.getElementById('messageInput');
const ulMsg = document.getElementById('message');
const ulUsers = document.getElementById('onlineUsers');
const divMsgs = document.querySelector('.messagesBox');
const spaceSpan1 = document.createTextNode(' ');
const spaceSpan2 = document.createTextNode(' ');

let sockeToButton;

// createLiMsg Test Ok

function createLiMsg({ user, message, date }) {
  const liMsg = document.createElement('li');
  const divTagMsg = document.createElement('div');
  const span1 = document.createElement('span');
  const span2 = document.createElement('span');
  const span3 = document.createElement('span');
  liMsg.append(divTagMsg);
  divTagMsg.append(span1, spaceSpan1, span2, spaceSpan2, span3);
  span1.innerHTML = user;
  span2.innerHTML = message;
  span3.innerHTML = new Date(date).toLocaleString();
  divTagMsg.className = 'msgContainer';
  span1.className = 'userName';
  span2.className = 'msgSpan';
  span3.className = 'date';
  return liMsg;
}

// createPrivateMsg Test Ok

function createPrivateMsg({ user, message, date }) {
  const liMsg = document.createElement('li');
  const divTagMsg = document.createElement('div');
  const span1 = document.createElement('span');
  const span2 = document.createElement('span');
  const span3 = document.createElement('span');
  liMsg.append(divTagMsg);
  divTagMsg.append(span1, spaceSpan1, span2, spaceSpan2, span3);
  span1.innerHTML = user;
  span2.innerHTML = message;
  span3.innerHTML = new Date(date).toLocaleString();
  divTagMsg.className = 'msgContainer';
  span1.className = 'userName';
  span2.className = 'msgSpan';
  span3.className = 'date';
  return liMsg;
}

// randomNumber256 Test Ok

function randomNumber256() {
  return Math.floor(Math.random() * 256);
}

// setLocalStorage Test Ok

function setLocalStorage(name, obj) {
  return localStorage.setItem(name, obj);
}

// getLocalStorage Test Ok

function getLocalStorage(name) {
  return localStorage.getItem(name);
}

// setBgColor Test Ok

function setBgColor({ target }, socket, getLs, setLs, usMsg) {
  const uMsg = ulMsg || usMsg;
  setLs('socketUser', target.innerText);
  setLs('socketIdPrivate', target.getAttribute('value'));
  const userName = getLs('userName');
  const socketUser = getLs('socketUser');
  if (socketUser !== 'Geral') {
    socket.emit('privateHistory', {
      user: userName,
      forUser: socketUser,
    });
    setLs('clicked', true);
  } else {
    socket.emit('loginUser', {
      user: userName,
      newEmit: false,
    });
    setLs('clicked', false);
  }
  uMsg.innerText = `Falando com: ${socketUser}`;
}

// createLiNewUser Test Ok

function createLiNewUser(
  newUser,
  divClass,
  spanClass,
  socketIdUser,
  socket,
  getLs,
  setLs,
  uMsg,
) {
  const liUser = document.createElement('li');
  const divTagNewUser = document.createElement('div');
  const spanNew1 = document.createElement('span');
  const socketNum = Math.random();
  liUser.onclick = (e) => setBgColor(e, socket, getLs, setLs, uMsg);
  // divTagNewUser.setAttribute('id', 'testClick');
  liUser.append(divTagNewUser);
  if (newUser !== 'Geral') {
    divTagNewUser.setAttribute('value', socketIdUser);
    spanNew1.setAttribute('value', socketIdUser);
  } else {
    divTagNewUser.setAttribute('value', socketNum);
    spanNew1.setAttribute('value', socketNum);
  }
  divTagNewUser.append(spanNew1);
  spanNew1.innerHTML = newUser;
  divTagNewUser.className = divClass;
  spanNew1.className = spanClass;
  return liUser;
}

// receiveMessageAll Test Ok

function receiveMessageAll(socket, uMsg, divMsg, liMsg, getLs) {
  socket.on('message', ({ modelAnswer: { user, message, date } }) => {
    const socketUser = getLs('socketUser');
    if (socketUser === 'Geral') {
      uMsg.append(liMsg({ user, message, date }));
      divMsg.scrollTop = divMsg.scrollHeight;
    }
  });
}

// receiveMessagePrivate Test Ok

function receiveMessagePrivate(socket, uMsg, divMsg, privMsg, getLs) {
  socket.on('messagePrivate', ({ modelAnswer: { user, message, date }, meSocket }) => {
    const clicked = JSON.parse(getLs('clicked'));
    const socketPrivate = getLs('socketIdPrivate');
    const meSocketId = getLs('meSocketId');
    if (
      ((user !== undefined) && (clicked) && (meSocket === socketPrivate))
      || ((user !== undefined) && (clicked) && meSocket === meSocketId)
    ) {
      uMsg.append(privMsg({ user, message, date }));
      divMsg.scrollTop = divMsg.scrollHeight;
    }
  });
}

// historyPrivateMessage Test Ok

function historyPrivateMessage(socket, uMsg, divMsg, privMsg, getLs) {
  socket.on('mePrivateHistory', ({ modelAnswer: { user, message, date }, meSocket }) => {
    const clicked = JSON.parse(getLs('clicked'));
    const socketPrivate = getLs('socketIdPrivate');
    const meSocketId = getLs('meSocketId');
    if (
      ((user !== undefined) && (clicked) && (meSocket === socketPrivate))
      || ((user !== undefined) && (clicked) && meSocket === meSocketId)
    ) {
      uMsg.append(privMsg({ user, message, date }));
      divMsg.scrollTop = divMsg.scrollHeight;
    }
  });
}

// receiveHistory Test Ok

function receiveHistory(socket, uMsg, divMsg, liMsg, getLs) {
  uMsg.innerText = '';
  const socketUser = getLs('socketUser');
  socket.on('history', ({ modelAnswer: { userHistory: user, message, date } }) => {
    uMsg.append(liMsg({ user, message, date }));
    divMsg.scrollTop = 0;
  });
  uMsg.innerText = `Falando com: ${socketUser}`;
}

// setUserName Test Ok

function setUserName(socket, newName, randNum, setLs) {
  let userName = newName('Qual seu nome?');
  if (!userName) {
    userName = `User${randNum()}`;
  }
  setLs('userName', userName);
  setLs('socketUser', 'Geral');
  setLs('clicked', false);
  socket.emit('loginUser', { user: userName, newEmit: true });
}

// newLoggin Test Ok

function newLoggin(socket, ulUs, divMsg, newliUs, getLs, setLs) {
  socket.on('loggedUser', (msg) => {
    const socketUser = getLs('socketUser');
    if (socketUser === 'Geral') {
      ulUs.append(newliUs(msg, 'msgContainer', 'userName', null, socket, getLs, setLs));
      divMsg.scrollTop = divMsg.scrollHeight;
    }
  });
}

// disconnectUser Test Ok

function disconnectUser(socket, uMsg, divMsg, liNewUs, getLs, setLs) {
  socket.on('disconnectChat', (msg) => {
    const socketUser = getLs('socketUser');
    if (socketUser === 'Geral') {
      uMsg.append(liNewUs(msg, 'msgContainer', 'userName', null, socket, getLs, setLs));
      divMsg.scrollTop = divMsg.scrollHeight;
    }
  });
}

// disconnectList Test Ok

function disconnectList(socket, uUsers, liNewUs, getLs, setLs) {
  socket.on('disconnectList', (users) => {
    uUsers.innerText = '';
    uUsers.append(liNewUs('Geral', 'onlineUser', 'onlineSpan', null, socket, getLs, setLs));
    users.forEach(({ user }) => {
      uUsers.append(liNewUs(user, 'onlineUser', 'onlineSpan', null, socket, getLs, setLs));
    });
  });
}

// onlineUsers Test Ok

function onlineUsers(socket, ulUs, newliUs, getLs, setLs) {
  socket.on('onlineList', ({ users }) => {
    const userName = getLs('userName');
    ulUs.innerText = '';
    ulUs.append(newliUs('Geral', 'onlineUser', 'onlineSpan', null, socket, getLs, setLs));
    users.forEach(({ user, socket: socketIdUser }) => {
      if (user === userName) {
        setLs('meSocketId', socketIdUser);
      }
      if (user !== userName) {
        ulUs.append(newliUs(user, 'onlineUser', 'onlineSpan', socketIdUser, socket, getLs, setLs));
      }
    });
  });
}

function submitForm(event, socketIo, inpT) {
  const socket = sockeToButton || socketIo;
  const inp = inputValue || inpT;
  event.preventDefault();
  const lengthMsg = inp.value;
  const userName = getLocalStorage('userName');
  const socketUser = getLocalStorage('socketUser');
  const socketIdPrivate = getLocalStorage('socketIdPrivate');
  const clicked = JSON.parse(getLocalStorage('clicked'));
  if (lengthMsg.length > 0 && !clicked) {
    socket.emit('message', { user: userName, message: lengthMsg });
    inp.value = '';
  }
  if (clicked && socketUser !== 'Geral') {
    socket.emit('messagePrivate', {
      user: userName,
      message: inp.value,
      forId: socketIdPrivate,
    });
    inp.value = '';
  }
}

window.onload = (
  _,
  win,
  random = randomNumber256,
  getLs = getLocalStorage,
  setLs = setLocalStorage,
  uUsers = ulUsers,
  uMsg = ulMsg,
  divMsg = divMsgs,
  liNewUs = createLiNewUser,
  liMsg = createLiMsg,
  privMsg = createPrivateMsg,
) => {
  const socketIo = win || window.io('http://localhost:3000/');
  sockeToButton = socketIo;
  setUserName(socketIo, prompt, random, setLs);
  onlineUsers(socketIo, uUsers, liNewUs, getLs, setLs);
  newLoggin(socketIo, uMsg, divMsg, liNewUs, getLs, setLs);
  receiveMessageAll(socketIo, uMsg, divMsg, liMsg, getLs);
  receiveMessagePrivate(socketIo, uMsg, divMsg, privMsg, getLs);
  receiveHistory(socketIo, uMsg, divMsg, liMsg, getLs);
  historyPrivateMessage(socketIo, uMsg, divMsg, privMsg, getLs);
  disconnectList(socketIo, uUsers, liNewUs, getLs, setLs);
  disconnectUser(socketIo, uMsg, divMsg, liNewUs, getLs, setLs);
};

module.exports = {
  setUserName,
  newLoggin,
  disconnectUser,
  disconnectList,
  onlineUsers,
  receiveMessageAll,
  receiveMessagePrivate,
  historyPrivateMessage,
  receiveHistory,
  randomNumber256,
  createLiNewUser,
  submitForm,
  getLocalStorage,
  setLocalStorage,
  createLiMsg,
  createPrivateMsg,
  setBgColor,
};
