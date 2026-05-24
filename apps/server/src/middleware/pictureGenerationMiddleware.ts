import { NextFunction, Request, Response } from 'express';
import handleControllerError from '../controllers/handleControllerError.js';
import { fal } from '@fal-ai/client';
import z from 'zod';

export const generateCloudflarePicture = async (
  req: Request,
  res: Response,
) => {
  const model = '@cf/black-forest-labs/flux-2-dev';
  // const model = '@cf/black-forest-labs/flux-2-klein-4b';

  try {
    const formData = new FormData();

    formData.append('prompt', req.body.prompt);
    formData.append('width', '512');
    formData.append('height', '512');

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/ai/run/${model}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
        method: 'POST',
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const errors = data.errors.map((error: any) => error.message).join(', ');

      console.log(errors);

      throw new Error(errors);
    }

    res.status(200).json({ base64: data.result.image });
  } catch (error: any) {
    handleControllerError(res, error);
  }
};

export const generateBFLPicture = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

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
  } catch (error: any) {
    handleControllerError(res, error);
  }

  next();
};

export const generatFalPicture = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const promptInfo = {
    //   environment: {
    //     style:
    //       'Black and white manga style with a dark and gritty aesthetic like the manga berserk',
    //     setting:
    //       'Neo-futuristic cyberpunk city',
    //   },
    //   character: {
    //     firstName: 'Dingus',
    //     lastName: 'McDingus',
    //     height: '72 inches',
    //     weight: '250 pounds',
    //     sex: 'male',
    //     age: '40',
    //   },
    // };

    const words = req.body.prompt.trim().split(' ').filter(Boolean);

    console.log(words);

    const promptInput = z
      .array(z.string())
      .min(20, 'Prompt length must be greater than 20 words');

    const validatedPrompt = promptInput.parse(words);

    const result = await fal.run('fal-ai/flux/schnell', {
      input: { prompt: validatedPrompt.join(' ') },
    });

    req.body.generatedPictureUrl = result.data.images[0].url;
  } catch (error: any) {
    handleControllerError(res, error);
    return;
  }

  next();
};
