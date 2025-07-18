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
    const { craving, dietaryPreferences } = await req.json();

    console.log('Analyzing craving:', craving);
    console.log('Dietary preferences:', dietaryPreferences);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a food expert and nutritionist. Based on the user's craving description and dietary preferences, provide personalized food recommendations. 

Your response should be friendly, helpful, and include:
1. Understanding of their craving
2. 2-3 specific food recommendations with brief descriptions
3. Why these recommendations match their craving
4. Any dietary consideration notes if relevant

Keep your response conversational and engaging, around 150-200 words.`;

    const userPrompt = `I'm craving: ${craving}${dietaryPreferences && dietaryPreferences.length > 0 ? `\n\nMy dietary preferences: ${dietaryPreferences.join(', ')}` : ''}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log('Generated analysis:', analysis);

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
    console.error('Error in analyze-craving function:', error);
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