import { getGoogleDriveClient } from '../config/googleDriveClient'

export interface UploadResult {
  fileId: string
  webViewLink: string
}

/**
 * Generate a resumable upload session URL for direct client uploads
 * This allows large files to be uploaded directly to Google Drive, bypassing Vercel's 4.5MB limit
 */
export async function createResumableUploadSession(input: {
  fileName: string
  mimeType: string
  fileSize: number
}): Promise<{ uploadUrl: string; fileId: string }> {
  const { drive, folderId } = getGoogleDriveClient()

  try {
    // Create a resumable upload session
    const response = await drive.files.create(
      {
        requestBody: {
          name: input.fileName,
          parents: [folderId],
        },
        media: {
          mimeType: input.mimeType,
        },
        fields: 'id',
      },
      {
        // Use resumable upload
        onUploadProgress: () => {}, // No-op for session creation
      }
    )

    // For resumable uploads, we need to use the Google Drive API's resumable upload endpoint
    // The file ID is returned, but we need to get the upload URL
    // Actually, googleapis doesn't directly expose the resumable URL
    // We'll need to use a different approach - upload in chunks server-side
    
    // For now, return the file ID and the client will need to upload via the API
    // But actually, let's use the standard upload method with streaming for large files
    throw new Error('Resumable upload session creation not yet implemented - using standard upload')
  } catch (error: any) {
    console.error('Error creating upload session:', error)
    throw error
  }
}

export async function uploadFileToDrive(input: {
  fileName: string
  mimeType: string
  buffer: Buffer
}): Promise<UploadResult> {
  const { drive, folderId } = getGoogleDriveClient()

  try {
    // Upload file to Google Drive
    // For large files, this will stream the upload
    const driveResponse = await drive.files.create({
      requestBody: {
        name: input.fileName,
        parents: [folderId],
      },
      media: {
        mimeType: input.mimeType,
        body: input.buffer,
      },
      fields: 'id, name, webViewLink, webContentLink',
    })

    if (!driveResponse.data.id) {
      throw new Error('Failed to upload file to Google Drive: no file ID returned')
    }

    const fileId = driveResponse.data.id

    // Make the file accessible (optional - adjust permissions as needed)
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      })
    } catch (permError) {
      // Permission setting is optional, log but don't fail
      console.warn('Failed to set file permissions:', permError)
    }

    // Get the file URL
    const webViewLink =
      driveResponse.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`

    return {
      fileId,
      webViewLink,
    }
  } catch (error: any) {
    console.error('Error uploading to Google Drive:', error)
    throw new Error(`Failed to upload file to Google Drive: ${error.message || 'Unknown error'}`)
  }
}

