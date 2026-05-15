import handleControllerError from '../controllers/handleControllerError.js';
export const generateCloudflarePicture = async (req, res) => {
    const model = '@cf/black-forest-labs/flux-2-dev';
    // const model = '@cf/black-forest-labs/flux-2-klein-4b';
    try {
        const formData = new FormData();
        formData.append('prompt', req.body.prompt);
        formData.append('width', '512');
        formData.append('height', '512');
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/ai/run/${model}`, {
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            },
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            const errors = data.errors.map((error) => error.message).join(', ');
            console.log(errors);
            throw new Error(errors);
        }
        res.status(200).json({ base64: data.result.image });
    }
    catch (error) {
        handleControllerError(res, error);
    }
};
export const generateBFLPicture = async (req, res, next) => {
    var _a, _b;
    try {
        const response = await fetch('https://api.bfl.ai/v1/flux-2-pro', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'x-key': `${process.env.BLF_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: req.body.prompt,
                width: 512,
                height: 512,
            }),
        });
        const data = await response.json();
        const pollingUrl = data.polling_url;
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        while (true) {
            await sleep(500);
            const response = await fetch(pollingUrl, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'x-key': `${process.env.BFL_API_KEY}`,
                },
            });
            const result = await response.json();
            const status = result.status;
            console.log(`Status: ${status}`);
            if (status === 'Ready') {
                console.log('Result:', (_a = result.result) === null || _a === void 0 ? void 0 : _a.sample);
                req.body.generatedPictureUrl = (_b = result.result) === null || _b === void 0 ? void 0 : _b.sample;
                break;
            }
            if (status === 'Error' || status === 'Failed') {
                console.log('Generation failed:', result);
                break;
            }
        }
    }
    catch (error) {
        handleControllerError(res, error);
    }
    next();
};
