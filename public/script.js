const copyBtn = document.querySelector('i')
const input = document.querySelector('#transcription');
const placeholder = document.querySelector('#placeholder');
const toast = document.querySelector('.toast');

copyBtn.addEventListener('click', async () =>{
    try {
        let value = input.textContent;
        if(navigator.clipboard) {   
            await navigator.clipboard.writeText(value);
            
            if(value !== ''){
                toast.style.display = 'block';
            }
            
            setTimeout(() => {
                toast.style.display='none';
            },2000)
        } else {
            alert(`Clipboard API is Not Supported`);
        }
    } catch (err) {
        console.error(`Failed to copy: ${err}`);
    }
})
const DG_ENDPOINT = 'wss://api.deepgram.com/v1/listen';
        navigator.mediaDevices.getUserMedia({audio: true}).then(stream =>{
            if(!MediaRecorder.isTypeSupported('audio/webm')) return alert("Browser not supported");
            const mediaRecorder = new MediaRecorder(stream, {mimeType:'audio/webm'})
            const socket = new WebSocket(DG_ENDPOINT, ['token',process.env.dg_key]);

            socket.onopen = () => {
                mediaRecorder.addEventListener('dataavailable', event => {
                    if(event.data.size > 0 && socket.readyState == 1){
                        socket.send(event.data)
                    }
                })
                mediaRecorder.start(250)
            }

            socket.onmessage = message =>{
                const data = JSON.parse(message.data)

                const {is_final} = data;
                const transcript = data.channel.alternatives[0].transcript;
                if(transcript && is_final){
                    placeholder.style.display = 'none';
                    input.textContent += ' ' + transcript
                }
            }
        })