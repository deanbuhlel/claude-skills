import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

// Initialize Anthropic client with API key from environment variables
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation text is required.' }, { status: 400 });
    }

    // Define the prompt for Claude
    const prompt = `You are an expert summarizer. Your task is to condense the following long conversation into a concise summary, highlighting key points, decisions, and outcomes. The summary should be easy to read and capture the essence of the discussion, suitable for saving tokens.

<conversation>
${conversation}
</conversation>

Please provide the summary:`;

    // Call the Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Or another suitable Claude model
      max_tokens: 500, // Adjust max tokens for the summary as needed
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const summary = response.content[0].text;

    // Store the conversation and summary in Supabase
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .insert([
        { original_text: conversation, summary: summary }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      // Even if Supabase insert fails, we still want to return the summary to the user
      return NextResponse.json({ summary, warning: 'Summary generated but failed to save to history.' }, { status: 200 });
    }

    return NextResponse.json({ summary }, { status: 200 });

  } catch (error) {
    console.error('Summarization API error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
