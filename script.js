const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const mainContent = document.getElementById('main-content');
const flames = document.querySelectorAll('.flame'); 
const leftPhotos = document.getElementById('left-photos');
const rightPhotos = document.getElementById('right-photos');
const cakeContainer = document.getElementById('cake-container');
const bdayTitle = document.getElementById('bday-title');
const letter = document.getElementById('letter');

let audioContext;
let analyser;
let microphone;
let candlesBlown = false; 

document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'b' && startScreen.style.display === 'none' && !candlesBlown) {
        candlesBlown = true; 
        blowOutCandles();
    }
});

startBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        startScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.classList.add('fade-in');

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function checkBlow() {
            if (candlesBlown) return; 

            analyser.getByteFrequencyData(dataArray);
            
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            let averageVolume = sum / bufferLength;

            if (averageVolume > 57) { 
                candlesBlown = true; 
                blowOutCandles();
            } else {
                requestAnimationFrame(checkBlow); 
            }
        }

        checkBlow();

    } catch (err) {
        alert("Microphone access unavailable. No worries, just press the 'B' key to blow out the candles!");
        console.error(err);
        
        startScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.classList.add('fade-in');
    }
});

function blowOutCandles() {
    flames.forEach(flame => flame.classList.add('blown-out'));

    setTimeout(() => {
        cakeContainer.style.opacity = '0'; 
        
        setTimeout(() => {
            cakeContainer.style.display = 'none'; 
            
            bdayTitle.classList.remove('hidden');
            bdayTitle.classList.add('fade-in');
            
            leftPhotos.classList.remove('hidden');
            leftPhotos.classList.add('fade-in');
            
            rightPhotos.classList.remove('hidden');
            rightPhotos.classList.add('fade-in');
            
            letter.classList.remove('hidden');
            letter.classList.add('fade-in');

        }, 1000); 
        
    }, 500); 
}