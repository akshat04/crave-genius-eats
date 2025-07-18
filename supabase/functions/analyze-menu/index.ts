import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, cravings } = await req.json();

    console.log('Analyzing menu with cravings:', cravings);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!imageBase64) {
      throw new Error('No menu image provided');
    }

    if (!cravings || !cravings.trim()) {
      throw new Error('Please describe what you are craving');
    }

    const systemPrompt = `You are a food expert analyzing a menu image. Based on the user's cravings and the menu items visible in the image, identify which dishes would best match their desires.

Your response should be a JSON object with the following structure:
{
  "recommendations": [
    {
      "name": "Dish Name",
      "description": "Brief description from menu or inferred",
      "price": "Price if visible, or 'Price not visible'",
      "category": "Category (appetizer, main, dessert, etc.)",
      "matchScore": 85,
      "reasons": ["Reason 1", "Reason 2", "Reason 3"],
      "dietary": ["Vegetarian", "Gluten-Free", etc.],
      "spiceLevel": 2,
      "estimatedPosition": {
        "x": 50,
        "y": 30,
        "width": 200,
        "height": 80
      }
    }
  ],
  "summary": "Brief explanation of why these dishes were recommended"
}

Guidelines:
- Identify 3-6 menu items that best match the user's cravings
- matchScore should be 60-95 based on how well it matches their craving
- Include dietary information if visible or can be inferred
- spiceLevel: 0=mild, 1=mild-medium, 2=medium, 3=spicy, 4=very spicy
- estimatedPosition should be approximate coordinates where the dish appears on the menu (as percentages)
- Focus on dishes that genuinely match what they're craving
- If you can't read the menu clearly, mention this in the summary

Return ONLY the JSON object, no additional text.`;

    const userPrompt = `I'm craving: ${cravings}

Please analyze this menu image and recommend dishes that match my cravings. Focus on items that would satisfy what I'm looking for.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              { 
                type: 'image_url', 
                image_url: { 
                  url: imageBase64,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    console.log('Raw AI response:', analysisText);

    let analysis;
    try {
      // Remove any markdown formatting and extract JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw response:', analysisText);
      throw new Error('Failed to parse menu analysis. Please try again.');
    }

    // Validate the response structure
    if (!analysis.recommendations || !Array.isArray(analysis.recommendations)) {
      throw new Error('Invalid analysis format received');
    }

    console.log('Parsed analysis:', analysis);

    return new Response(
      JSON.stringify({ 
        analysis,
        success: true 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-menu function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});