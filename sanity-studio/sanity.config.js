import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'traders-at-wisconsin',
  title: 'Traders at Wisconsin',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '3vxa65y6',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            orderableDocumentListDeskItem({ type: 'placement', S, context }),
            S.documentTypeListItem('sponsor').title('Sponsors'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
