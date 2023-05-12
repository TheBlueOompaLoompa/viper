// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const id = req.url.split('?id=')[1];
  // Create a Supabase client with the Auth context of the logged in user.
  const client = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxOTk5ODIyNiwiZXhwIjoxOTM1NTc0MjI2fQ.cPMjt7bXd8bzPWC9_xfg6BrB_a7cavba3ZU-hbP6QhU',
  );

  const { data, error } = await client.storage.from('media').download(id);
  if(error) {
    await client.storage
      .from('media')
      .remove([id]);
    await client
      .from('posts')
      .delete()
      .eq('id', id);

    console.error(error);
    return;
  }

  return new Response();
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: text/html' \
//   --data '{"name":"Functions"}'
