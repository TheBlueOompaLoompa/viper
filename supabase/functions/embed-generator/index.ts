// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result?.toString());
    reader.readAsDataURL(blob);
  });
}

serve(async (req) => {
  const id = req.url.split('?id=')[1]
  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const client = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxOTk5ODIyNiwiZXhwIjoxOTM1NTc0MjI2fQ.cPMjt7bXd8bzPWC9_xfg6BrB_a7cavba3ZU-hbP6QhU',
    );

    let post: any;

    {
      // And we can run queries in the context of our authenticated user
      const { data, error } = await client.from('posts').select('*').eq('id', id);
      if (error) throw error;
      post = data[0]
    }

    console.log(post)

    let imgURL = '';

    if(post.type == 1) {
      const { data, error } = await client.storage.from('media').download(post.id);
      if(error) {
        console.error(error);
        return;
      }

      imgURL = await blobToBase64(data);
    }

    return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
    <meta property="og:title" content="${post.title}"/>
    <meta property="og:url" content="https://viper.social/post?p=${id}" />
    <meta property="og:description" content="${post.content}" />
    <meta property="og:image" content="${imgURL}" />
    </head>
    </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 200,
    });
  } catch (error) {
    return new Response(error.message, {
      headers: { 'Content-Type': 'text/html' },
      status: 400,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: text/html' \
//   --data '{"name":"Functions"}'
