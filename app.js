const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function clearMessageList() {
  const list = document.getElementById("message-list");
  list.innerHTML = "";
}

function addMessageToList(name, content) {
  const list = document.getElementById("message-list");
  const li = document.createElement("li");
  const title = document.createElement("h3");
  const body = document.createElement("p");

  title.textContent = "Nachricht von " + name;
  body.textContent = content;

  li.appendChild(title);
  li.appendChild(body);
  list.appendChild(li);
}

async function loadMessages() {
  const list = document.getElementById("message-list");
  clearMessageList();

  const { data, error } = await client
    .from("messages")
    .select("name, content, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = "Nachrichten konnten nicht geladen werden.";
    li.appendChild(p);
    list.appendChild(li);
    return;
  }

  if (!data || data.length === 0) {
    return;
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    addMessageToList(row.name, row.content);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("message");

  const name = nameInput.value.trim();
  const content = messageInput.value.trim();

  if (name === "" || content === "") {
    return;
  }

  const { error } = await client.from("messages").insert({
    name: name,
    content: content,
  });

  if (error) {
    console.error(error);
    alert("Die Nachricht konnte nicht gespeichert werden.");
    return;
  }

  nameInput.value = "";
  messageInput.value = "";
  await loadMessages();
}

document
  .getElementById("message-form")
  .addEventListener("submit", handleFormSubmit);

loadMessages();