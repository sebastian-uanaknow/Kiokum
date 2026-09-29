import { createClient } from 'npm:@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface InvitationRequest {
  email: string;
  role: 'owner' | 'viewer' | 'editor';
  memoryId?: string;
  memoryTitle?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { email, role }: InvitationRequest = await req.json();

    if (!email || !role) {
      throw new Error('Email and role are required');
    }

    const { data: existingAccess } = await supabaseClient
      .from('shared_access')
      .select('id')
      .eq('memory_owner_id', user.id)
      .eq('shared_with_email', email)
      .maybeSingle();

    if (existingAccess) {
      await supabaseClient
        .from('shared_access')
        .update({ access_role: role })
        .eq('id', existingAccess.id);
    } else {
      await supabaseClient
        .from('shared_access')
        .insert({
          memory_owner_id: user.id,
          shared_with_email: email,
          access_role: role,
          shared_by_id: user.id,
        });
    }

    const { data: userData } = await supabaseClient.auth.admin.getUserById(user.id);
    const senderName = userData?.user?.email || 'Un usuario';

    const roleNames = {
      owner: 'Propietario',
      editor: 'Editor',
      viewer: 'Visualizador'
    };

    const roleDescriptions = {
      owner: 'Tendrás control total sobre los recuerdos: podrás visualizar, editar, eliminar y gestionar usuarios.',
      editor: 'Podrás visualizar y editar los recuerdos compartidos contigo.',
      viewer: 'Podrás visualizar los recuerdos compartidos contigo.'
    };

    const roleIcons = {
      owner: '👑',
      editor: '✏️',
      viewer: '👁️'
    };

    const appUrl = req.headers.get('origin') || 'http://localhost:5173';
    const loginUrl = `${appUrl}/login`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #2C1810;
            background-color: #F5EFE7;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #A8D5E2 0%, #F5EFE7 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 32px;
            color: #2C1810;
            margin-bottom: 8px;
            font-weight: 700;
          }
          .header p {
            color: #6B5D54;
            font-size: 16px;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #2C1810;
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .content p {
            color: #6B5D54;
            margin-bottom: 16px;
            font-size: 16px;
          }
          .role-card {
            background: linear-gradient(135deg, #F5EFE7 0%, #ffffff 100%);
            border: 2px solid #A8D5E2;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            text-align: center;
          }
          .role-icon {
            font-size: 48px;
            margin-bottom: 12px;
          }
          .role-name {
            font-size: 24px;
            font-weight: 700;
            color: #31250b;
            margin-bottom: 12px;
          }
          .role-description {
            color: #6B5D54;
            font-size: 15px;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            background: #31250b;
            color: #ffffff;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: background 0.3s;
          }
          .button:hover {
            background: #4a3a1a;
          }
          .info-box {
            background: #F5EFE7;
            border-left: 4px solid #A8D5E2;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
          }
          .info-box p {
            color: #6B5D54;
            font-size: 14px;
            margin: 0;
          }
          .footer {
            background: #F5EFE7;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #D4C4B0;
          }
          .footer p {
            color: #6B5D54;
            font-size: 14px;
            margin: 0;
          }
          @media only screen and (max-width: 600px) {
            body {
              padding: 10px;
            }
            .header {
              padding: 30px 20px;
            }
            .content {
              padding: 30px 20px;
            }
            .header h1 {
              font-size: 28px;
            }
            .content h2 {
              font-size: 22px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 Kiokum</h1>
            <p>Plataforma de Recuerdos</p>
          </div>
          <div class="content">
            <h2>¡Has recibido una memoria!</h2>
            <p>Has recibido la memoria de <strong>${senderName}</strong></p>
            
            <div class="role-card">
              <div class="role-icon">${roleIcons[role]}</div>
              <div class="role-name">${roleNames[role]}</div>
              <div class="role-description">${roleDescriptions[role]}</div>
            </div>

            <p style="text-align: center; font-weight: 600; color: #2C1810;">Para acceder a la plataforma, haz clic en el botón:</p>
            
            <div style="text-align: center;">
              <a href="${loginUrl}" class="button">Acceder a Kiokum</a>
            </div>
            
            <div class="info-box">
              <p><strong>Nota:</strong> Si no tienes una cuenta, deberás registrarte con este correo electrónico (<strong>${email}</strong>) para acceder a los recuerdos compartidos contigo.</p>
            </div>

            <p style="font-size: 14px; color: #6B5D54; margin-top: 32px;">
              Este es un espacio para preservar y compartir momentos importantes. Tu acceso como <strong>${roleNames[role]}</strong> te permite colaborar de manera significativa.
            </p>
          </div>
          <div class="footer">
            <p>Este es un correo automático de Kiokum.</p>
            <p style="margin-top: 8px;">Por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (resendApiKey) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Kiokum <onboarding@resend.dev>',
            to: [email],
            subject: `🌸 Invitación a Kiokum como ${roleNames[role]}`,
            html: emailHtml,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json();
          throw new Error(`Resend error: ${JSON.stringify(errorData)}`);
        }

        const resendData = await resendResponse.json();
        console.log('Email sent via Resend:', resendData);

        return new Response(
          JSON.stringify({
            success: true,
            message: `Invitación enviada exitosamente a ${email}`,
            emailSent: true,
            provider: 'resend',
            role: roleNames[role],
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (emailError: any) {
        console.error('Error sending email via Resend:', emailError);
        return new Response(
          JSON.stringify({
            success: true,
            message: `Permiso creado, pero no se pudo enviar el email: ${emailError.message}`,
            emailSent: false,
            role: roleNames[role],
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    } else {
      console.log('RESEND_API_KEY not configured. Email HTML prepared but not sent.');
      console.log('To:', email);
      console.log('Subject:', `🌸 Invitación a Kiokum como ${roleNames[role]}`);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Permiso creado. Para enviar emails, configura RESEND_API_KEY.',
          emailSent: false,
          emailPreview: {
            to: email,
            subject: `🌸 Invitación a Kiokum como ${roleNames[role]}`,
            html: emailHtml,
          },
          role: roleNames[role],
          setup_instructions: 'Visita https://resend.com para obtener tu API key gratuita (100 emails/día)',
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (err: any) {
    console.error('Error in send-invitation:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Error sending invitation',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});