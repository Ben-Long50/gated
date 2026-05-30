var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import handleControllerError from '../controllers/handleControllerError.js';
import { fal } from '@fal-ai/client';
import { CharacterPromptInput, ItemPromptInput, } from '../validation/promptSchema.js';
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
export const generatFalPicture = async (req, res, next) => {
    try {
        const url = 'fal-ai/z-image/turbo/lora';
        const data = req.body.prompt;
        const validatedData = CharacterPromptInput.parse(data);
        const prompt = `in the style of cksc and japanese anime with muted colors, create a picutre of a ${validatedData.age} ${validatedData.sex} character with a ${validatedData.height} height and ${validatedData.build} build. The characters hair can be described as ${validatedData.hair}. The character is wearing ${validatedData.outfit}. The character has enhanced prosthetic body parts that can be described as ${validatedData.augmentation}. The character is equipped with a ${validatedData.weapon} and is posed ${validatedData.pose}. The background setting of the picture should be ${validatedData.setting} at ${validatedData.time}.`;
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
                image_size: {
                    width: 1024,
                    height: 1024,
                },
                num_images: validatedData.pictureCount,
                num_inference_steps: 8,
                output_format: 'png',
                acceleration: 'regular',
                seed: 746232381338994,
            },
        });
        const urls = result.data.images.map((image) => image.url);
        if (urls.length === 0) {
            handleControllerError(res, new Error('All image generation requests failed'));
            return;
        }
        const { pictureCount } = validatedData, promptData = __rest(validatedData, ["pictureCount"]);
        req.body.generatedPictureUrls = urls;
        req.body.prompt = promptData;
        req.body.type = 'character';
    }
    catch (error) {
        handleControllerError(res, error);
        return;
    }
    next();
};
export const generatFalItemPicture = async (req, res, next) => {
    try {
        const url = 'fal-ai/z-image/turbo/lora';
        const data = req.body.prompt;
        const validatedData = ItemPromptInput.parse(data);
        const prompt = `in the style of cksc and japanese anime with muted colors, create a picutre of ${data.itemDescription}. The background setting of the picture should be ${validatedData.setting} at ${validatedData.time}. The item is found in the setting, ${data.itemArrangement}. The focus of the image is the item itself. The picture should be sharp with clearly defined lines.`;
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
                image_size: {
                    width: 1024,
                    height: 1024,
                },
                num_images: validatedData.pictureCount,
                num_inference_steps: 8,
                output_format: 'png',
                acceleration: 'regular',
                seed: 746232381338994,
            },
        });
        const urls = result.data.images.map((image) => image.url);
        if (urls.length === 0) {
            handleControllerError(res, new Error('All image generation requests failed'));
            return;
        }
        const { pictureCount } = validatedData, promptData = __rest(validatedData, ["pictureCount"]);
        req.body.generatedPictureUrls = urls;
        req.body.prompt = promptData;
        req.body.type = 'item';
    }
    catch (error) {
        handleControllerError(res, error);
        return;
    }
    next();
};
