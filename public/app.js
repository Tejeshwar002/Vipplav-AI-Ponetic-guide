document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/telugu-text');
        const data = response.data;

        if (data) {
            showTextDetails(data);
        } else {
            document.getElementById('teluguText').innerText = 'No Telugu text found';
        }
    } catch (error) {
        console.error('Error fetching initial Telugu text:', error);
    }
});

function handleSaveAndNextClick() {
    const romanisedInputs = document.getElementById('romanisedInputs').value;
    const phoneticGuide = document.getElementById('phoneticGuide').value;
    const lastId = document.getElementById('teluguText').dataset.lastId;
    const text = document.getElementById('teluguText').innerText; // Get the current text from the DOM

    saveAndNextText(romanisedInputs, phoneticGuide, text, lastId)
        .then((data) => {
            if (data.message) {
                document.getElementById('teluguText').innerText = data.message;
            } else {
                showTextDetails(data);
            }
        })
        .catch(console.error);
}

async function saveAndNextText(romanisedInputs, phoneticGuide, text, lastId) {
    try {
        const response = await axios.post('http://127.0.0.1:3000/api/save-and-next-telugu-text', {
            _id: lastId,
            text, // Include the text field
            romanisedInputs,
            phoneticGuide
        });
        return response.data;
    } catch (error) {
        console.error('Error saving and fetching next Telugu text:', error);
    }
}

function showTextDetails(data) {
    document.getElementById('teluguText').innerText = data.Telugu_Words;
    document.getElementById('teluguText').dataset.lastId = data._id;
    document.getElementById('romanisedInputs').value = data.romanisedInputs || '';
    document.getElementById('phoneticGuide').value = data.phoneticGuide || '';
}

document.getElementById('nextBtn').addEventListener('click', handleSaveAndNextClick);

document.getElementById('prevBtn').addEventListener('click', async () => {
    const lastId = document.getElementById('teluguText').dataset.lastId;

    try {
        const response = await axios.get(`http://127.0.0.1:3000/api/previous-telugu-text?lastId=${lastId}`);
        const data = response.data;

        if (data) {
            showTextDetails(data);
        } else {
            document.getElementById('teluguText').innerText = 'No previous Telugu text found';
        }
    } catch (error) {
        console.error('Error fetching previous Telugu text:', error);
    }
});

function startSessionTimer() {
    const sessionDuration = 60; // Session duration in seconds
    let remainingTime = sessionDuration;

    const timerElement = document.getElementById('sessionTimer');

    const interval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            timerElement.innerText = `Session expires in: ${remainingTime}s`;
        } else {
            clearInterval(interval);
            timerElement.innerText = 'Session expired';
            saveAndExit();
        }
    }, 1000);
}

async function saveAndExit() {
    try {
        await axios.post('http://127.0.0.1:3000/api/save-session-telugu-texts');
        alert('Session saved successfully.');
    } catch (error) {
        console.error('Error saving session Telugu texts:', error);
    }
}

startSessionTimer();

// Manual save and exit button
document.getElementById('saveExitBtn').addEventListener('click', async () => {
    await saveAndExit();
    // Optionally redirect to another page or perform other actions after saving and exiting
});
