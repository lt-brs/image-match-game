import {
    initializeCLIPModel,
    classifyImage,
    calculateSimilarity,
    batchProcessImages
} from './CLIP.mjs';

async function runTests() {
    // Initialize model
    const clipPipeline = await initializeCLIPModel();
    
    // Test single image classification
    const imageUrl = '/home/saberabdi/hackathon/image-match-game/src/partners.jpg';
    const labels = ['car', 'white men', 'motorcycle'];
    const result = await classifyImage(clipPipeline, imageUrl, labels);
    console.log('Classification result:', result);

    // Test similarity
    const text = 'a red sports car';
    const similarity = await calculateSimilarity(clipPipeline, imageUrl, text);
    console.log('Similarity score:', similarity);
}

runTests().catch(console.error);

