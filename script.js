
async function handleQuery() {
    const input = document.getElementById("userInput").value.trim();
    const chatbox = document.getElementById("chatbox");
    const imageEl = document.getElementById("resultImage");

    if (!input) return;

    chatbox.innerHTML += `<div><strong>You:</strong> ${input}</div>`;
    chatbox.innerHTML += `<div><strong>Claude:</strong> <span id="streamText"></span></div>`;
    const streamEl = document.getElementById("streamText");

    // Claude streaming with Opus 4
    const response = await puter.ai.chat(input, {
        model: "claude-3.5-opus-20240620",
        stream: true
    });

    for await (const part of response) {
        streamEl.textContent += part?.text || '';
    }

    // Docs link
    const docLink = await fetchDocs(`how to ${input}`);
    chatbox.innerHTML += `<div><strong>📘 Suggested Docs:</strong> <a href="\${docLink}" target="_blank">\${docLink}</a></div>`;

    // Image preview
    const imageURL = await imageSearch(input);
    imageEl.src = imageURL;
}

async function fetchDocs(query) {
    const res = await fetch(`https://api.duckduckgo.com/?q=\${encodeURIComponent(query)}&format=json&no_redirect=1`);
    const data = await res.json();
    return data.AbstractURL || data.RelatedTopics?.[0]?.FirstURL || "https://google.com/search?q=" + encodeURIComponent(query);
}

async function imageSearch(keyword) {
    return `https://source.unsplash.com/featured/?\${encodeURIComponent(keyword)}`;
}
