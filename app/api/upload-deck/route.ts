import { NextRequest, NextResponse } from 'next/server'
import { getEnv } from '@/lib/decks/config/env'
import { downloadFileFromDrive, getDriveFileMetadata } from '@/lib/decks/services/googleDriveDownloadService'
import { extractSlidesFromPdf } from '@/lib/decks/services/pdfExtractionService'
import { generateDeckMetadata, generateTopics, labelSlide } from '@/lib/decks/llm/llmService'
import {
  createDeckRecord,
  createTopicsForDeck,
  createSlidesForDeck,
} from '@/lib/decks/services/ingestionService'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for processing large PDFs

export async function POST(request: NextRequest) {
  try {
    const config = getEnv()

    // Parse JSON body (expecting Google Drive file ID)
    const body = await request.json()
    const gdriveFileId = body.gdrive_file_id as string | null
    const titleOverride = body.title as string | null

    if (!gdriveFileId) {
      return NextResponse.json(
        { error: 'Google Drive file ID is required. Upload the file to Drive first using /api/decks/upload-to-drive, or provide gdrive_file_id in the request body.' },
        { status: 400 }
      )
    }

    // Get file metadata from Google Drive
    const fileMetadata = await getDriveFileMetadata(gdriveFileId)

    // Validate file type (PDF only)
    if (fileMetadata.mimeType !== 'application/pdf' && !fileMetadata.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    // Download file from Google Drive
    const buffer = await downloadFileFromDrive(gdriveFileId)

    // Extract PDF to check page count
    const slides = await extractSlidesFromPdf(buffer)
    const pageCount = slides.length

    // Validate page count
    if (pageCount > config.maxDeckPages) {
      return NextResponse.json(
        {
          error: `PDF has ${pageCount} pages, which exceeds the limit of ${config.maxDeckPages} pages. Please use a smaller deck.`,
        },
        { status: 400 }
      )
    }

    // Build deck text from slides
    const deckText = slides
      .map((slide) => `Slide ${slide.slideNumber}:\n${slide.text}`)
      .join('\n\n')

    // Generate deck metadata
    const deckMetadata = await generateDeckMetadata(deckText)

    // Generate topics
    const topics = await generateTopics(deckText)

    // Label each slide
    const labeledSlides = await Promise.all(
      slides.map(async (slide) => {
        const label = await labelSlide(slide.text)
        return {
          slideNumber: slide.slideNumber,
          slideText: slide.text,
          label,
        }
      })
    )

    // Create deck record
    const deckRecord = await createDeckRecord({
      title: titleOverride || fileMetadata.name,
      gdriveFileId: gdriveFileId,
      gdriveFileUrl: fileMetadata.webViewLink,
      deckMetadata,
    })

    // Create topics
    const topicRecords = await createTopicsForDeck({
      deckId: deckRecord.id,
      topics,
    })

    // Create slides
    const slideRecords = await createSlidesForDeck({
      deckId: deckRecord.id,
      slides: labeledSlides,
    })

    return NextResponse.json({
      deck_id: deckRecord.id,
      topics_count: topicRecords.length,
      slides_count: slideRecords.length,
    })
  } catch (error: any) {
    console.error('Error uploading deck:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload and process deck' },
      { status: 500 }
    )
  }
}

