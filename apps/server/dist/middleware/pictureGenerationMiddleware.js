import handleControllerError from '../controllers/handleControllerError.js';
import { fal } from '@fal-ai/client';
import { PromptInput } from '../validation/promptSchema.js';
import userLimits from '../utils/constants/userLimits.js';
export const generateCloudflarePicture = async (req, res) => {
    const model = '@cf/black-forest-labs/flux-2-dev';
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
                console.log('Result:', result.result?.sample);
                req.body.generatedPictureUrl = result.result?.sample;
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
export const generatFalPicture = async (req, res, next) => {
    try {
        const url = 'fal-ai/z-image/turbo/lora';
        const validatedData = PromptInput.parse(req.body.prompt);
        let prompt = '';
        switch (validatedData.type) {
            case 'character':
                prompt = `in the style of cksc and japanese anime with muted colors, create a picutre of a character that can be described as ${validatedData.description}. The background setting of the picture should be ${validatedData.setting} at ${validatedData.time}. The focus of the picture is the character themself. The picture should be sharp with clearly defined lines.`;
                break;
            case 'item':
                prompt = `in the style of cksc and japanese anime with muted colors, create a picutre of ${validatedData.description}. The background setting of the picture should be ${validatedData.setting} at ${validatedData.time}. The focus of the picture is the item itself. The picture should be sharp with clearly defined lines.`;
                break;
            case 'scene':
                prompt = `in the style of cksc and japanese anime with muted colors, create a picutre of a scene that can be described as ${validatedData.description}. The background scene of the picture should be ${validatedData.setting} at ${validatedData.time}. The picture should be sharp with clearly defined lines.`;
                break;
            default:
                prompt = '';
                break;
        }
        if (!prompt) {
            throw new Error('Failed to generate prompt');
        }
        const result = await fal.subscribe(url, {
            input: {
                prompt,
                loras: [
                    {
                        path: 'https://huggingface.co/benjlong50/gated/resolve/main/ZIT_CPA_PRO_V1.5.safetensors',
                        scale: 1,
                    },
                    {
                        path: 'https://huggingface.co/benjlong50/gated/resolve/main/ck-NeurocoreShadowCircuit-ZIT_000003000.safetensors',
                        scale: 0.3,
                    },
                ],
                image_size: validatedData.type === 'scene'
                    ? {
                        width: 1024,
                        height: 576,
                    }
                    : {
                        width: 1024,
                        height: 1024,
                    },
                num_images: validatedData.pictureCount,
                num_inference_steps: 8,
                output_format: 'png',
            },
        });
        const urls = result.data.images.map((image) => image.url);
        if (urls.length === 0) {
            handleControllerError(res, new Error('All image generation requests failed'));
            return;
        }
        const { pictureCount, type, ...promptData } = validatedData;
        req.body.generatedPictureUrls = urls;
        req.body.prompt = promptData;
        req.body.type = type;
    }
    catch (error) {
        handleControllerError(res, error);
        return;
    }
    next();
};
export const validatePictureGeneration = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('Failed to find user');
        }
        const role = req.user.role;
        const limits = userLimits[role];
        const montlyGenerationLimit = limits.monthlyPictureGenerations;
        const newMonthlyGenerationCount = req.body.prompt.pictureCount + req.user.generationCount;
        if (req.user._count == null) {
            throw new Error('Failed to find generated picture count');
        }
        const storageLimit = limits.pictures;
        const newStorageCount = req.body.prompt.pictureCount + req.user._count.generatedPictures;
        if (newMonthlyGenerationCount > montlyGenerationLimit) {
            throw new Error(`Cannot process picture generations since it would put you over your monthly generation limit by ${newMonthlyGenerationCount - montlyGenerationLimit}.`);
        }
        if (newStorageCount > storageLimit) {
            throw new Error(`Cannot process picture generations since it would put you over your availbable generation storage limit by ${newStorageCount - storageLimit}. Delete unused pictures from your storage and try again.`);
        }
        switch (req.query.generationType) {
            case 'standard':
                req.body.folder = `/gated/standard/${req.body.prompt.type}`;
                break;
            case 'user':
                req.body.folder = `/gated/users/${req.user.id}/${req.body.prompt.type}`;
                break;
            default:
                req.body.folder = '/gated';
                break;
        }
        next();
    }
    catch (error) {
        handleControllerError(res, error);
        return;
    }
};
