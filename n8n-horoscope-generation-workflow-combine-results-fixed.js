// This node receives merged data from both Parse Text Result and OpenAI Image Generation
// The Merge node combines them, so we get both in $input.all()

// Get all input items from the merge (should be 2: one from text path, one from image path)
const inputItems = $input.all();

// Find text result (from Parse Text Result node)
let textResult = null;
let imageOutput = null;

for (const item of inputItems) {
  const data = item.json;
  // Text result has horoscope, dos, donts properties
  if (data.horoscope && data.dos && data.donts) {
    textResult = data;
  }
  // Image output - could be file object (mimeType, fileType) or API response
  else if (data.mimeType || data.fileType || data.data || data.url || data.response || (data.choices === undefined && !data.horoscope)) {
    imageOutput = data;
  }
}

// Fallback: try getting directly from nodes if merge didn't work as expected
if (!textResult) {
  try {
    textResult = $('Parse Text Result').item.json;
  } catch (e) {
    console.error('Could not get text result from Parse Text Result node');
  }
}

if (!textResult) {
  throw new Error('Failed to get text result. Make sure Parse Text Result node completed successfully.');
}

// CRITICAL: Get image URL directly from OpenAI Image Generation node
// Even with "Return URL" enabled, n8n may still download the image as a file object
// The file object (with mimeType, fileType, etc.) doesn't contain the URL
// We MUST get the URL from the OpenAI node's original response before it gets converted
let imageUrl = null;

// Helper function to safely get node data
function getNodeData(nodeName) {
  try {
    const node = $(nodeName);
    if (node && node.item) {
      return node.item;
    }
  } catch (e) {
    // Silently fail - node might not be accessible
    return null;
  }
  return null;
}

// Try to get the URL from the OpenAI Image Generation node
const imageGenItem = getNodeData('OpenAI Image Generation');

if (imageGenItem && imageGenItem.json) {
  console.log('Checking OpenAI Image Generation node for URL...');
  console.log('Node json keys:', Object.keys(imageGenItem.json || {}));
  
  // OpenAI API returns: { data: [{ url: '...' }] }
  if (imageGenItem.json.data && Array.isArray(imageGenItem.json.data) && imageGenItem.json.data[0] && imageGenItem.json.data[0].url) {
    imageUrl = imageGenItem.json.data[0].url;
    console.log('✅ Found image URL in OpenAI node data array');
  }
  // Check if URL is in the json directly
  else if (imageGenItem.json.url) {
    imageUrl = imageGenItem.json.url;
    console.log('✅ Found image URL in OpenAI node json.url');
  }
  // Check if there's a response property with the original API response
  else if (imageGenItem.json.response && imageGenItem.json.response.data && Array.isArray(imageGenItem.json.response.data) && imageGenItem.json.response.data[0] && imageGenItem.json.response.data[0].url) {
    imageUrl = imageGenItem.json.response.data[0].url;
    console.log('✅ Found image URL in OpenAI node response.data');
  }
  else {
    console.error('❌ Could not find URL in OpenAI Image Generation node');
    console.error('Node json structure:', JSON.stringify(imageGenItem.json, null, 2));
  }
} else {
  console.log('Could not access OpenAI Image Generation node directly (this is OK, will try fallback)');
}

// Fallback: Check the merged imageOutput (though it's likely a file object without URL)
if (!imageUrl) {
  console.log('Trying fallback: checking merged imageOutput...');
  // Check if this is the standard OpenAI response format
  if (imageOutput && imageOutput.data && Array.isArray(imageOutput.data) && imageOutput.data[0] && imageOutput.data[0].url) {
    imageUrl = imageOutput.data[0].url;
    console.log('✅ Found image URL in merged output data array');
  }
  // Check for direct url property
  else if (imageOutput && imageOutput.url) {
    imageUrl = imageOutput.url;
    console.log('✅ Found image URL in merged output url property');
  }
  // If it's a file object (has mimeType, fileType, etc.), we can't extract URL from it
  else if (imageOutput && (imageOutput.mimeType || imageOutput.fileType)) {
    console.error('❌ Image was downloaded as file object. Cannot extract URL from file metadata.');
    console.error('File object structure:', JSON.stringify(imageOutput, null, 2));
  }
}

if (!imageUrl) {
  // Log the actual structure for debugging
  console.error('❌ Failed to extract image URL');
  console.error('imageOutput structure:', Object.keys(imageOutput || {}));
  console.error('imageOutput full:', JSON.stringify(imageOutput, null, 2));
  // Also check the full item structure
  const imageItem = inputItems.find(item => item.json.mimeType || item.json.fileType || (!item.json.horoscope && !item.json.dos));
  if (imageItem) {
    console.error('Full image item:', JSON.stringify(imageItem, null, 2));
  }
  throw new Error('Failed to extract image URL from OpenAI response. The image was downloaded as a file object. Please check that "Return URL" is enabled in the OpenAI Image Generation node, or check the node execution logs for the original API response.');
}

// Get original webhook data for slots and reasoning
let webhookData = {};
try {
  const webhookNode = getNodeData('Webhook');
  if (webhookNode && webhookNode.json) {
    webhookData = webhookNode.json;
  }
} catch (e) {
  console.error('Could not access Webhook node:', e.message || e);
}

// Combine all results
return {
  json: {
    horoscope: textResult.horoscope,
    dos: textResult.dos,
    donts: textResult.donts,
    imageUrl: imageUrl,
    prompt: webhookData.imagePrompt || textResult.imagePrompt,
    slots: webhookData.slots || textResult.slots,
    reasoning: webhookData.reasoning || textResult.reasoning
  }
};

