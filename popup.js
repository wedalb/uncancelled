document.addEventListener("DOMContentLoaded", async () => {

    const sleep = ms => new Promise(r => setTimeout(r, ms))

    const getActiveTab = async () => {
        const tabs = await chrome.tabs.query({
            currentWindow: true,
            active: true
        })
        return tabs[0]
    }

    const showPopup = async (answer) => {
        if (answer !== "CLOUDFLARE" && answer !== "ERROR") {
            try {
                let res = await answer.split("data:")
                try {
                    const detail = JSON.parse(res[0]).detail
                    document.getElementById('output').style.opacity = 1
                    document.getElementById('output').innerHTML = detail
                    return;
                } catch (e) {
                    try {
                        res = res[1].trim()
                        if (res === "[DONE]") return
                        answer = JSON.parse(res)
                        let final = answer.message.content.parts[0]
                        final = final.replace(/\n/g,'<br>')
                        document.getElementById('output').style.opacity = 1
                        document.getElementById('output').innerHTML = final
                    } catch (e) {}
                }
            } catch (e) {
                document.getElementById('output').style.opacity = 1
                document.getElementById('output').innerHTML = "Something went wrong. Please try in a few minutes."
            }

        } else if (answer === "CLOUDFLARE") {
            document.getElementById('input').style.opacity = 1
            document.getElementById('input').innerHTML = 'You need to once visit <a target="_blank" href="https://chat.openai.com/chat">chat.openai.com</a> and check if the connection is secure. Redirecting...'
            await sleep(3000)
            chrome.tabs.create({url: "https://chat.openai.com/chat"})
        } else {
            document.getElementById('output').style.opacity = 1
            document.getElementById('output').innerHTML = 'Something went wrong. Are you logged in to <a target="_blank" href="https://chat.openai.com/chat">chat.openai.com</a>? Try logging out and logging in again.'
        }
    }

    const getData = async (selection) => {
        if (!selection.length == 0) {
            document.getElementById('input').style.opacity = 1
            document.getElementById('input').innerHTML = selection
            document.getElementById('output').style.opacity = 0.5
            document.getElementById('output').innerHTML = "Loading..."
            const port = chrome.runtime.connect();
            port.postMessage({question: selection})
            port.onMessage.addListener((msg) => showPopup(msg))
        } else {
            document.getElementById('output').style.opacity = 1;
            document.getElementById('output').innerHTML = '<img src="./assets/gifs/texthighlight.gif" alt="My GIF">';
            document.getElementById('output').style.backgroundColor = 'white';
            // Hide the input element
            document.getElementById('input').outerHTML = '<div class="editable" contenteditable="false" id="input" style="font-family: Helvetica; resize: none; background-color: white; color: black;"><p>Please select text to analyze the gender bias!</p></div>';

            /*
            document.getElementById('input').style.opacity = 0.5
            document.getElementById('input').innerHTML = "You have to first select some text"
            */

        }
    }

    const getSelectedText = async () => {
        const activeTab = await getActiveTab()
        chrome.tabs.sendMessage(activeTab.id, {type: "LOAD"}, getData)
    }

    getSelectedText()
})

const myString = 'hello world';

detectBias(myString)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
