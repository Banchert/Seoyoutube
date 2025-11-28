/**
 * Content Script for Gemini Integration
 * Handles prompt injection and response extraction
 */

const CONFIG = {
    SELECTORS: {
        INPUT_FIELD: [
            'textarea[aria-label*="Message"]',
            'textarea[placeholder*="Message"]',
            'div[contenteditable="true"][role="textbox"]',
            'textarea[role="textbox"]',
            'rich-textarea textarea',
            '.ql-editor[contenteditable="true"]'
        ],
        SEND_BUTTON: [
            'button[aria-label*="Send"]',
            'button[title*="Send"]',
            'button[data-tooltip*="Send"]',
            'button[aria-label="Send message"]',
            'button.send-button'
        ],
        RESPONSE_CONTAINER: [
            '[data-message-author-role="model"]',
            '.model-response',
            '[role="article"]',
            '.response-container'
        ],
        IMAGE_CONTAINER: [
            'img[src*="googleusercontent"]',
            'img[alt*="Generated"]',
            '.generated-image img',
            'picture img'
        ]
    },
    TIMEOUTS: {
        WAIT_FOR_ELEMENT: 10000,
        WAIT_FOR_RESPONSE: 120000,
        WAIT_FOR_IMAGE: 120000,
        POLL_INTERVAL: 500
    }
};

let isProcessing = false;
let currentPromptType = null;

/**
 * Wait for element to appear
 */
function waitForElement(selectors, timeout = CONFIG.TIMEOUTS.WAIT_FOR_ELEMENT) {
    return new Promise((resolve, reject) => {
        const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
        
        // Check if element already exists
        for (const selector of selectorArray) {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
        }

        const observer = new MutationObserver(() => {
            for (const selector of selectorArray) {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                    return;
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element not found: ${selectorArray.join(', ')}`));
        }, timeout);
    });
}

/**
 * Inject prompt into Gemini
 */
async function injectPrompt(prompt, type) {
    try {
        console.log('Injecting prompt:', type);
        isProcessing = true;
        currentPromptType = type;

        // Wait for input field
        const inputField = await waitForElement(CONFIG.SELECTORS.INPUT_FIELD);
        console.log('Input field found:', inputField);

        // Clear existing content
        inputField.value = '';
        if (inputField.contentEditable === 'true') {
            inputField.textContent = '';
        }

        // Insert prompt
        if (inputField.contentEditable === 'true') {
            inputField.textContent = prompt;
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            inputField.value = prompt;
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
            inputField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Wait a bit for UI to update
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find and click send button
        const sendButton = await waitForElement(CONFIG.SELECTORS.SEND_BUTTON);
        console.log('Send button found:', sendButton);
        
        sendButton.click();
        console.log('Prompt sent, waiting for response...');

        // Wait for response
        if (type === 'SEO') {
            return await waitForSeoResponse();
        } else if (type === 'THUMBNAIL') {
            return await waitForImageResponse();
        }

    } catch (error) {
        console.error('Error injecting prompt:', error);
        isProcessing = false;
        throw error;
    }
}

/**
 * Wait for SEO response from Gemini
 */
async function waitForSeoResponse() {
    const startTime = Date.now();
    let lastResponseLength = 0;
    let stableCount = 0;

    return new Promise((resolve, reject) => {
        const checkInterval = setInterval(async () => {
            try {
                // Check timeout
                if (Date.now() - startTime > CONFIG.TIMEOUTS.WAIT_FOR_RESPONSE) {
                    clearInterval(checkInterval);
                    reject(new Error('Response timeout'));
                    return;
                }

                // Find response container
                const responses = document.querySelectorAll(CONFIG.SELECTORS.RESPONSE_CONTAINER.join(','));
                if (responses.length === 0) return;

                const lastResponse = responses[responses.length - 1];
                const responseText = lastResponse.textContent || lastResponse.innerText;

                // Check if response is still being generated
                if (responseText.length === lastResponseLength) {
                    stableCount++;
                } else {
                    stableCount = 0;
                    lastResponseLength = responseText.length;
                }

                // If response is stable for 3 checks, extract data
                if (stableCount >= 3 && responseText.length > 50) {
                    clearInterval(checkInterval);
                    
                    console.log('Response received:', responseText.substring(0, 200));
                    
                    // Extract JSON from response
                    const jsonData = extractJSON(responseText);
                    
                    if (jsonData) {
                        isProcessing = false;
                        resolve({
                            success: true,
                            data: jsonData,
                            rawText: responseText
                        });
                    } else {
                        isProcessing = false;
                        reject(new Error('Could not extract JSON from response'));
                    }
                }
            } catch (error) {
                clearInterval(checkInterval);
                isProcessing = false;
                reject(error);
            }
        }, CONFIG.TIMEOUTS.POLL_INTERVAL);
    });
}

/**
 * Wait for image response from Gemini
 */
async function waitForImageResponse() {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
        const checkInterval = setInterval(async () => {
            try {
                // Check timeout
                if (Date.now() - startTime > CONFIG.TIMEOUTS.WAIT_FOR_IMAGE) {
                    clearInterval(checkInterval);
                    reject(new Error('Image generation timeout'));
                    return;
                }

                // Find generated images
                const images = document.querySelectorAll(CONFIG.SELECTORS.IMAGE_CONTAINER.join(','));
                
                if (images.length > 0) {
                    // Get the last generated image
                    const lastImage = images[images.length - 1];
                    
                    // Check if image is fully loaded
                    if (lastImage.complete && lastImage.naturalHeight > 0) {
                        clearInterval(checkInterval);
                        
                        console.log('Image found:', lastImage.src);
                        
                        // Download image as blob
                        const imageBlob = await downloadImage(lastImage.src);
                        
                        isProcessing = false;
                        resolve({
                            success: true,
                            imageUrl: lastImage.src,
                            imageBlob: imageBlob
                        });
                    }
                }
            } catch (error) {
                clearInterval(checkInterval);
                isProcessing = false;
                reject(error);
            }
        }, CONFIG.TIMEOUTS.POLL_INTERVAL);
    });
}

/**
 * Download image as blob
 */
async function downloadImage(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error('Failed to download image');
        }
        return await response.blob();
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
    }
}

/**
 * Extract JSON from text
 */
function extractJSON(text) {
    try {
        // Try to find JSON block with code fence
        const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
            return JSON.parse(codeBlockMatch[1]);
        }

        // Try to find JSON object
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return null;
    } catch (error) {
        console.error('JSON extraction error:', error);
        return null;
    }
}

/**
 * Message listener
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Gemini content script received message:', request.action);

    if (request.action === 'INJECT_PROMPT') {
        injectPrompt(request.prompt, request.type)
            .then(result => {
                console.log('Prompt injection successful:', result);
                
                // Send result back to background
                chrome.runtime.sendMessage({
                    action: request.type === 'SEO' ? 'SEO_RESULT' : 'THUMBNAIL_RESULT',
                    data: result
                });
                
                sendResponse({ success: true, data: result });
            })
            .catch(error => {
                console.error('Prompt injection failed:', error);
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keep channel open for async response
    }

    if (request.action === 'GET_STATUS') {
        sendResponse({
            success: true,
            isProcessing: isProcessing,
            currentPromptType: currentPromptType
        });
        return true;
    }
});

console.log('Gemini content script loaded');
