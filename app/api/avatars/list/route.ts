import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - List all avatars for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // List all files in the user's avatar folder
    const { data: files, error: listError } = await supabase.storage
      .from('avatars')
      .list(user.id, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (listError) {
      console.error('Error listing avatars:', listError)
      return NextResponse.json(
        { error: 'Failed to list avatars', details: listError.message },
        { status: 500 }
      )
    }

    // Get public URLs for all files
    const avatars = files
      .filter(file => file.name) // Filter out folders
      .map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${user.id}/${file.name}`)
        
        return {
          name: file.name,
          url: publicUrl,
          created_at: file.created_at,
          updated_at: file.updated_at,
          size: file.metadata?.size || 0
        }
      })

    return NextResponse.json({ data: avatars })
  } catch (error: any) {
    console.error('Error in avatars list API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to list avatars', details: error.toString() },
      { status: 500 }
    )
  }
}

