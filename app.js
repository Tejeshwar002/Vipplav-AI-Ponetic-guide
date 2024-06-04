document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await axios.get('http://localhost:3000/telugu-text');
        const data = response.data;

        if (data && data.Telugu_Words) {
            showTextDetails(data);
        } else {
            document.getElementById('teluguText').innerText = 'No Telugu text found';
        }
    } catch (error) {
        console.error('Error fetching initial Telugu text:', error);
    }
});

function handleNextClick() {
    const romanisedInputs = document.getElementById('romanisedInputs').value;
    const phoneticGuide = document.getElementById('phoneticGuide').value;
    const lastId = document.getElementById('teluguText').dataset.lastId;

    updateCurrentText(romanisedInputs, phoneticGuide, lastId)
        .then(() => fetchNextText())
        .catch(console.error);
}

async function updateCurrentText(romanisedInputs, phoneticGuide, lastId) {
    try {
        await axios.post('http://127.0.0.1:3000/update-telugu-text', {
            _id: lastId,
            romanisedInputs,
            phoneticGuide
        });
    } catch (error) {
        console.error('Error updating current Telugu text:', error);
    }
}

async function fetchNextText() {
    const lastId = document.getElementById('teluguText').dataset.lastId;

    try {
        const response = await axios.get(`http://127.0.0.1:3000/next-telugu-text?lastId=${lastId}`);
        const data = response.data;

        if (data && data.Telugu_Words) {
            showTextDetails(data);
        } else {
            document.getElementById('teluguText').innerText = 'No more Telugu text found';
        }
    } catch (error) {
        console.error('Error fetching next Telugu text:', error);
    }
}

function showTextDetails(data) {
    document.getElementById('teluguText').innerText = data.Telugu_Words;
    document.getElementById('teluguText').dataset.lastId = data._id;
    document.getElementById('romanisedInputs').value = data.romanisedInputs || '';
    document.getElementById('phoneticGuide').value = data.phoneticGuide || '';
}

document.getElementById('nextBtn').addEventListener('click', handleNextClick);

document.getElementById('prevBtn').addEventListener('click', async () => {
    const lastId = document.getElementById('teluguText').dataset.lastId;

    try {
        const response = await axios.get(`http://127.0.0.1:3000/previous-telugu-text?lastId=${lastId}`);
        const data = response.data;

        if (data && data.Telugu_Words) {
            showTextDetails(data);
        } else {
            document.getElementById('teluguText').innerText = 'No previous Telugu text found';
        }
    } catch (error) {
        console.error('Error fetching previous Telugu text:', error);
    }
});