 // Get the start button element
 const startButton = document.getElementById('startButton');
    
 // When the start button is clicked
 startButton.addEventListener('click', () => {
     // Start monitoring the user's eye movement and presence
     startMonitoring();
 });

 // Start monitoring the user's eye movement and presence
 function startMonitoring() {
     // Get the message element
     const message = document.getElementById('message');

     // Change the message to "Monitoring..."
     message.textContent = 'Monitoring...';

     // Set a timeout to trigger an alarm if the user's eyes are closed for more than 10 seconds
     let closedEyesTimeout = setTimeout(() => {
         triggerAlarm('closed');
     }, 10000);

     // Set a timeout to trigger an alarm if the user is outside the camera frame for more than 30 seconds
     let outsideFrameTimeout = setTimeout(() => {
         triggerAlarm('outside');
     }, 30000);

     // When the user's eyes are detected as open
     function onEyesOpen() {
         // Clear the closed eyes timeout
         clearTimeout(closedEyesTimeout);

         // Reset the closed eyes timeout
         closedEyesTimeout = setTimeout(() => {
             triggerAlarm('closed');
         }, 10000);
     }

     // When the user's eyes are detected as closed
     function onEyesClosed() {
         // Clear the closed eyes timeout
         clearTimeout(closedEyesTimeout);
     }

     // When the user is detected as inside the camera frame
     function onInsideFrame() {
         // Clear the outside frame timeout
         clearTimeout(outsideFrameTimeout);

         // Reset the outside frame timeout
         outsideFrameTimeout = setTimeout(() => {
             triggerAlarm('outside');
         }, 30000);
     }

     // When the user is detected as outside the camera frame
     function onOutsideFrame() {
         // Clear the outside frame timeout
         clearTimeout(outsideFrameTimeout);
     }

     // Function to trigger the alarm
     function triggerAlarm(reason) {
         // Change the message to the reason for the alarm
         message.textContent = `ALARM: ${reason.toUpperCase()} EYES`;

         // Show the alarm icon
         const circle = document.querySelector('.circle');
         circle.innerHTML = '<img src="alarm-icon.png" alt="Alarm icon" class="alarm-icon">';
     }

     // Use WebRTC to access the user's camera and microphone
     navigator.mediaDevices.getUserMedia({
         video: true,
         audio: false
     }).then(stream => {
         // Create a new FaceDetector object
         const faceDetector = new FaceDetector();

         // Create a new VideoTrackProcessor object to process the video stream
         const processor = new VideoTrackProcessor({
             // When a new frame is available
             process: (frame, controller) => {
                 // Detect the faces in the frame
                 faceDetector.detect(frame).then(faces => {
                     // If there are no faces detected
                     if (faces.length === 0) {
                         // Call the onOutsideFrame functionnn cccccccc                                                                                                                                                                                                                                                                                                                                                                                                                       bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbv          vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvrr
                         onOutsideFrame();
                     } else {
                         // Call the onInsideFrame function
                         onInsideFrame();

                         // Get the first face detected
                         const face = faces[0];

                         // If the face has no landmarks
                         if (!face.landmarks) {
                             return;
                         }

                         // Get the left and right eye landmarks
                         const leftEye = face.landmarks.get('leftEye');
                         const rightEye = face.landmarks.get('rightEye');

                         // Calculate the average position of the left and right eyes
                         const eyeX = (leftEye[0].x + rightEye[0].x) / 2;
                         const eyeY = (leftEye[0].y + rightEye[0].y) / 2;
                            // Get the video element
                            const video = document.getElementById('video');

                            // Calculate the position of the video element
                            const videoRect = video.getBoundingClientRect();

                            // Calculate the position of the eyes relative to the video element
                            const eyeXRelative = eyeX - videoRect.left;
                            const eyeYRelative = eyeY - videoRect.top;

                            // If the position of the eyes is outside the bounds of the video element
                            if (eyeXRelative < 0 || eyeYRelative < 0 || eyeXRelative > videoRect.width || eyeYRelative > videoRect.height) {
                                // Call the onOutsideFrame function
                                onOutsideFrame();
                            } else {
                                // Call the onInsideFrame function
                                onInsideFrame();

                                // Calculate the distance between the eyes
                                const distance = Math.hypot(leftEye[0].x - rightEye[0].x, leftEye[0].y - rightEye[0].y);

                                // If the distance between the eyes is less than a threshold, consider the eyes closed
                                if (distance < 20) {
                                    // Call the onEyesClosed function
                                    onEyesClosed();
                                } else {
                                    // Call the onEyesOpen function
                                    onEyesOpen();
                                }
                            }
                        }

                        // Return the processed frame
                        return frame;
                    });
                }
            });

            // Add the processor to the video stream
            stream.getVideoTracks()[0].applyConstraints({
                advanced: [{
                    videoTrackProcessor: processor
                }]
            });

            // Set the video element source to the video stream
            const video = document.getElementById('video');
            video.srcObject = stream;
        }).catch(error => {
            // If there was an error, log it to the console
            console.error(error);
        });
    }
