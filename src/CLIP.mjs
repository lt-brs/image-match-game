import { pipeline } from '@xenova/transformers';

export async function initializeCLIPModel() {
    try {
        const clipPipeline = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');
        console.log("model loaded")
        return clipPipeline;
    } catch (error) {
        console.error('Error initializing CLIP model:', error);
        throw error;
    }
}

export async function classifyImage(clipPipeline, imageUrl, labels) {
    try {
        const result = await clipPipeline(imageUrl, labels);
        return result;
    } catch (error) {
        console.error('Error classifying image:', error);
        throw error;
    }
}

export async function calculateSimilarity(clipPipeline, imageUrl, text) {
    try {
        const result = await clipPipeline(imageUrl, [text]);
        return result[0].score;
    } catch (error) {
        console.error('Error calculating similarity:', error);
        throw error;
    }
}

export async function batchProcessImages(clipPipeline, imageUrls, labels) {
    try {
        const results = await Promise.all(
            imageUrls.map(url => classifyImage(clipPipeline, url, labels))
        );
        return results;
    } catch (error) {
        console.error('Error in batch processing:', error);
        throw error;
    }
}


document.initializeCLIPModel = initializeCLIPModel;
document.classifyImage = classifyImage;
document.calculateSimilarity = calculateSimilarity;
document.batchProcessImages = batchProcessImages;


