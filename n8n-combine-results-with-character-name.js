// This node receives merged data from Parse Text Result, Create Avatar, and Analyze image
// There are TWO merge nodes: Merge Results and Merge Results1
// Merge Results1 sends 3 items to this node

// Helper function to check if a string looks like a URL
const isUrl = (str) => {
  if (typeof str !== 'string') return false;
  return str.startsWith('http://') || str.startsWith('https://');
};

// Helper function to recursively search for URLs in an object
const findUrlInObject = (obj, path = '') => {
  if (!obj || typeof obj !== 'object') return null;
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'string' && isUrl(value)) {
      // Skip if it's clearly not an image URL (like API endpoints)
      if (!value.includes('blob.core.windows.net') && !value.includes('oaidalle') && !value.match(/\.(png|jpg|jpeg|gif|webp)/i)) {
        continue;
      }
      console.log(`✅ Found potential image URL at ${currentPath}:`, value.substring(0, 80));
      return value;
    }
    
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const found = findUrlInObject(value[i], `${currentPath}[${i}]`);
        if (found) return found;
      }
    } else if (value && typeof value === 'object') {
      const found = findUrlInObject(value, currentPath);
      if (found) return found;
    }
  }
  return null;
};

// Get all input items from the merge
const inputItems = $input.all();

console.log('🔍 DEBUG: Number of input items:', inputItems.length);
console.log('🔍 DEBUG: Input items structure:');
inputItems.forEach((item, idx) => {
  const itemData = item.json || {};
  console.log(`  Item ${idx} keys:`, Object.keys(itemData));
  console.log(`  Item ${idx} full data:`, JSON.stringify(itemData, null, 2));
  
  // Check specifically for URL fields
  if (itemData.url) console.log(`  Item ${idx} HAS 'url' field:`, itemData.url.substring(0, 100));
  if (itemData.imageUrl) console.log(`  Item ${idx} HAS 'imageUrl' field:`, itemData.imageUrl.substring(0, 100));
  if (itemData.revised_prompt) console.log(`  Item ${idx} HAS 'revised_prompt' field (Create Avatar output)`);
  if (itemData.choices) console.log(`  Item ${idx} HAS 'choices' field (Analyze image output)`);
  if (itemData.dos) console.log(`  Item ${idx} HAS 'dos' field (Parse Text Result output)`);
});

// With double merge, we might have multiple items or one merged object
let mergedData = null;
let textResult = null;
let imageUrl = null;
let characterName = null;

// Check if we have multiple items (from Merge Results1 with append mode)
if (inputItems.length > 1) {
  console.log('✅ Detected multiple items structure (from Merge Results1)');
  
  // Search through all items to find what we need
  for (const item of inputItems) {
    const data = item.json || {};
    
    // Text result (from Parse Text Result)
    if (data.horoscope || (data.dos && data.donts)) {
      textResult = {
        horoscope: data.horoscope || null,
        dos: data.dos || [],
        donts: data.donts || [],
        imagePrompt: data.imagePrompt,
        slots: data.slots,
        reasoning: data.reasoning
      };
      console.log('✅ Found text result in item');
    }
    // Image URL (from Create Avatar)
    else if (data.url && isUrl(data.url) && !data.horoscope && !data.dos) {
      imageUrl = data.url;
      console.log('✅ Found image URL in item (url field)');
    } else if (data.imageUrl && isUrl(data.imageUrl)) {
      imageUrl = data.imageUrl;
      console.log('✅ Found image URL in item (imageUrl field)');
    }
    // Character name (from Analyze image)
    else if (data.choices && Array.isArray(data.choices) && data.choices[0] && data.choices[0].message) {
      characterName = data.choices[0].message.content?.trim();
      console.log('✅ Found character name in item');
    }
  }
  
  // If we still don't have everything, check if items are nested
  if (!textResult || !imageUrl) {
    console.log('⚠️ Some data missing, checking for nested structures...');
    for (const item of inputItems) {
      const data = item.json || {};
      // Deep search in each item
      if (!imageUrl) {
        const found = findUrlInObject(data);
        if (found) {
          imageUrl = found;
          console.log('✅ Found image URL via deep search');
        }
      }
    }
  }
  
} else if (inputItems.length === 1) {
  // Everything is merged into one object
  mergedData = inputItems[0].json;
  console.log('✅ Detected merged data structure (all in one object)');
  console.log('Merged data keys:', Object.keys(mergedData));
  
  // Extract text result (horoscope, dos, donts)
  textResult = {
    horoscope: mergedData.horoscope || null,
    dos: mergedData.dos || [],
    donts: mergedData.donts || [],
    imagePrompt: mergedData.imagePrompt,
    slots: mergedData.slots,
    reasoning: mergedData.reasoning
  };
  console.log('✅ Extracted text result from merged data');
  
  // Extract image URL - check multiple possible locations
  console.log('🔍 Searching for image URL in merged data...');
  console.log('Merged data keys:', Object.keys(mergedData));
  
  // First, try common field names
  if (mergedData.imageUrl && isUrl(mergedData.imageUrl)) {
    imageUrl = mergedData.imageUrl;
    console.log('✅ Found imageUrl in merged data');
  } else if (mergedData.url && isUrl(mergedData.url) && !mergedData.horoscope && !mergedData.dos) {
    imageUrl = mergedData.url;
    console.log('✅ Found url in merged data (assuming it\'s image URL)');
  } else if (mergedData.data && Array.isArray(mergedData.data) && mergedData.data[0] && mergedData.data[0].url) {
    imageUrl = mergedData.data[0].url;
    console.log('✅ Found image URL in data array');
  } else if (mergedData.revised_prompt && mergedData.url && isUrl(mergedData.url)) {
    // Create Avatar often outputs { url, revised_prompt }
    imageUrl = mergedData.url;
    console.log('✅ Found image URL in url field (with revised_prompt)');
  }
  
  // If not found, do a deep search for any URL that looks like an image URL
  if (!imageUrl) {
    console.log('⚠️ Image URL not in common fields, doing deep search...');
    imageUrl = findUrlInObject(mergedData);
  }
  
  // If still not found in merged data, try to get from nodes directly
  // This is the most reliable way since Create Avatar output might not be in the merge
  if (!imageUrl) {
    console.log('⚠️ Image URL not in merged data, trying to get from Create Avatar node directly...');
    
    // Try Create Avatar node - this should work even if merge didn't include it
    try {
      const createAvatarNode = $('Create Avatar');
      if (createAvatarNode && createAvatarNode.item) {
        const avatarData = createAvatarNode.item.json;
        console.log('✅ Successfully accessed Create Avatar node');
        console.log('Create Avatar node data keys:', Object.keys(avatarData));
        console.log('Create Avatar node full data:', JSON.stringify(avatarData, null, 2).substring(0, 1000));
        
        // Check all possible URL locations
        if (avatarData.url && isUrl(avatarData.url)) {
          imageUrl = avatarData.url;
          console.log('✅ Found image URL from Create Avatar node (url field)');
        } else if (avatarData.imageUrl && isUrl(avatarData.imageUrl)) {
          imageUrl = avatarData.imageUrl;
          console.log('✅ Found imageUrl from Create Avatar node');
        } else if (avatarData.data && Array.isArray(avatarData.data) && avatarData.data[0] && avatarData.data[0].url) {
          imageUrl = avatarData.data[0].url;
          console.log('✅ Found image URL from Create Avatar node (data array)');
        } else if (avatarData.revised_prompt && avatarData.url) {
          // Create Avatar often outputs { url, revised_prompt }
          imageUrl = avatarData.url;
          console.log('✅ Found image URL from Create Avatar node (url with revised_prompt)');
        } else {
          // Deep search in Create Avatar output
          const found = findUrlInObject(avatarData);
          if (found) {
            imageUrl = found;
            console.log('✅ Found image URL in Create Avatar node (deep search)');
          } else {
            console.error('❌ Create Avatar node data does not contain a recognizable image URL');
            console.error('Full Create Avatar data:', JSON.stringify(avatarData, null, 2));
          }
        }
      } else {
        console.warn('Create Avatar node exists but has no item data');
      }
    } catch (e) {
      console.error('❌ Could not access Create Avatar node:', e.message);
      console.error('This might mean the node name is different or the node failed');
    }
    
    // Try Extract Image URL node
    if (!imageUrl) {
      try {
        const extractImageUrlNode = $('Extract Image URL');
        if (extractImageUrlNode && extractImageUrlNode.item) {
          const extractData = extractImageUrlNode.item.json;
          console.log('Extract Image URL node data keys:', Object.keys(extractData));
          if (extractData.imageUrl && isUrl(extractData.imageUrl)) {
            imageUrl = extractData.imageUrl;
            console.log('✅ Found imageUrl from Extract Image URL node');
          } else if (extractData.url && isUrl(extractData.url)) {
            imageUrl = extractData.url;
            console.log('✅ Found url from Extract Image URL node');
          } else {
            const found = findUrlInObject(extractData);
            if (found) {
              imageUrl = found;
              console.log('✅ Found image URL in Extract Image URL node (deep search)');
            }
          }
        }
      } catch (e) {
        console.warn('Could not get image URL from Extract Image URL node:', e.message);
      }
    }
  }
  
  // Extract character name from Analyze image result
  // Check for choices[0].message.content (OpenAI Vision format) - this is what you showed
  if (mergedData.choices && Array.isArray(mergedData.choices) && mergedData.choices[0]) {
    const choice = mergedData.choices[0];
    if (choice.message && choice.message.content) {
      characterName = choice.message.content.trim();
      console.log('✅ Found character name in choices[0].message.content:', characterName);
    }
  }
  // Check for other possible character name fields
  else if (mergedData.character_name) {
    characterName = mergedData.character_name;
    console.log('✅ Found character_name field');
  } else if (mergedData.characterName) {
    characterName = mergedData.characterName;
    console.log('✅ Found characterName field');
  } else if (mergedData.name && !mergedData.horoscope) {
    characterName = mergedData.name;
    console.log('✅ Found name field');
  } else if (mergedData.content && !mergedData.horoscope && !mergedData.dos) {
    characterName = mergedData.content.trim();
    console.log('✅ Found character name in content field');
  }
  
} else {
  // Multiple items - handle separately (fallback)
  console.log('✅ Detected separate items structure');
  
  for (const item of inputItems) {
    const data = item.json || {};
    
    // Text result
    if (data.horoscope || (data.dos && data.donts)) {
      textResult = data;
      console.log('✅ Found text result');
    }
    // Image URL
    else if (data.imageUrl) {
      imageUrl = data.imageUrl;
      console.log('✅ Found imageUrl');
    } else if (data.url && !data.horoscope && !data.dos) {
      imageUrl = data.url;
      console.log('✅ Found url');
    }
    // Character name
    else if (data.choices && Array.isArray(data.choices) && data.choices[0] && data.choices[0].message) {
      characterName = data.choices[0].message.content?.trim();
      console.log('✅ Found character name');
    }
  }
  
  // If textResult wasn't found, try to construct it from available data
  if (!textResult) {
    const firstItem = inputItems[0]?.json || {};
    textResult = {
      horoscope: firstItem.horoscope || null,
      dos: firstItem.dos || [],
      donts: firstItem.donts || [],
      imagePrompt: firstItem.imagePrompt,
      slots: firstItem.slots,
      reasoning: firstItem.reasoning
    };
  }
}

// Validate we have the required data
if (!textResult) {
  console.error('❌ Text result not found.');
  console.error('Available data keys:', Object.keys(mergedData || inputItems[0]?.json || {}));
  throw new Error('Failed to get text result. Make sure Parse Text Result node completed successfully.');
}

if (!imageUrl) {
  console.error('❌ Image URL not found after all attempts.');
  console.error('Available data keys in merged data:', Object.keys(mergedData || inputItems[0]?.json || {}));
  
  // Try one last desperate attempt - check ALL nodes that might have the image
  console.log('🔍 Last attempt: Checking all possible nodes...');
  
  const nodeNamesToCheck = ['Create Avatar', 'Extract Image URL', 'OpenAI Image Generation', 'Generate Image'];
  
  for (const nodeName of nodeNamesToCheck) {
    try {
      const node = $(nodeName);
      if (node && node.item) {
        const nodeData = node.item.json;
        console.log(`Checking ${nodeName} node...`);
        console.log(`  Keys:`, Object.keys(nodeData));
        
        // Try all possible URL fields
        if (nodeData.url && isUrl(nodeData.url)) {
          imageUrl = nodeData.url;
          console.log(`✅ Found image URL in ${nodeName} node!`);
          break;
        }
        if (nodeData.imageUrl && isUrl(nodeData.imageUrl)) {
          imageUrl = nodeData.imageUrl;
          console.log(`✅ Found imageUrl in ${nodeName} node!`);
          break;
        }
        
        // Deep search in this node's output
        const found = findUrlInObject(nodeData);
        if (found) {
          imageUrl = found;
          console.log(`✅ Found image URL in ${nodeName} node (deep search)!`);
          break;
        }
      }
    } catch (e) {
      // Node doesn't exist or can't be accessed - that's okay
      console.log(`  ${nodeName} node not accessible:`, e.message);
    }
  }
  
  if (!imageUrl) {
    // Log all string values that might be URLs for debugging
    const data = mergedData || inputItems[0]?.json || {};
    console.error('Full merged data structure (first 5000 chars):', JSON.stringify(data, null, 2).substring(0, 5000));
    console.error('All string values in merged data that might be URLs:');
    const findStringValues = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj || {})) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === 'string' && value.length > 10 && (value.includes('http') || value.includes('blob') || value.includes('oaidalle'))) {
          console.error(`  ${currentPath}:`, value.substring(0, 150));
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          findStringValues(value, currentPath);
        } else if (Array.isArray(value)) {
          value.forEach((item, idx) => {
            if (item && typeof item === 'object') {
              findStringValues(item, `${currentPath}[${idx}]`);
            } else if (typeof item === 'string' && item.length > 10 && (item.includes('http') || item.includes('blob') || item.includes('oaidalle'))) {
              console.error(`  ${currentPath}[${idx}]:`, item.substring(0, 150));
            }
          });
        }
      }
    };
    findStringValues(data);
    
    // Last resort: check if we can continue without image URL (make it optional for now)
    console.error('❌ CRITICAL: Image URL not found after exhaustive search.');
    console.error('This means Create Avatar output is not reaching Combine Results.');
    console.error('Please check:');
    console.error('1. Is Create Avatar connected to Merge Results?');
    console.error('2. Check Create Avatar node execution - what fields does it output?');
    console.error('3. Check Merge Results node - does it include Create Avatar data?');
    console.error('4. Check Merge Results1 node - does it pass through the Create Avatar data?');
    
    // For now, set imageUrl to null so the workflow can continue
    // The API will need to handle missing imageUrl
    imageUrl = null;
    console.warn('⚠️ Continuing without image URL - it will be set to null in the response');
  }
}

// Clean up character name if found
if (characterName) {
  characterName = String(characterName).trim();
  // Remove surrounding quotes if present
  characterName = characterName.replace(/^["']|["']$/g, '');
  console.log('✅ Character name extracted and cleaned:', characterName);
} else {
  console.warn('⚠️ No character name found. This is optional, continuing without it.');
}

// Get original webhook data (imagePrompt, slots, reasoning)
const webhookData = {
  imagePrompt: textResult?.imagePrompt || mergedData?.imagePrompt || null,
  slots: textResult?.slots || mergedData?.slots || null,
  reasoning: textResult?.reasoning || mergedData?.reasoning || null
};

console.log('📊 Final data summary:', {
  hasHoroscope: !!textResult.horoscope,
  hasDos: !!textResult.dos && textResult.dos.length > 0,
  hasDonts: !!textResult.donts && textResult.donts.length > 0,
  hasImageUrl: !!imageUrl,
  hasCharacterName: !!characterName,
  characterName: characterName,
  imageUrlPreview: imageUrl ? imageUrl.substring(0, 50) + '...' : null
});

// Validate we have at least the text result
if (!textResult) {
  throw new Error('Failed to get text result. Make sure Parse Text Result node completed successfully.');
}

// Combine all results
// Note: imageUrl might be null if Create Avatar output isn't in the merge
const result = {
  horoscope: textResult.horoscope,
  dos: textResult.dos || [],
  donts: textResult.donts || [],
  imageUrl: imageUrl || null, // May be null if not found
  character_name: characterName || null,
  prompt: webhookData.imagePrompt,
  slots: webhookData.slots,
  reasoning: webhookData.reasoning
};

console.log('✅ Final result prepared:', {
  hasHoroscope: !!result.horoscope,
  hasDos: result.dos.length > 0,
  hasDonts: result.donts.length > 0,
  hasImageUrl: !!result.imageUrl,
  hasCharacterName: !!result.character_name
});

return {
  json: result
};
