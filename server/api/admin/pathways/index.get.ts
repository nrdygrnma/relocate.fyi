import { defineEventHandler } from 'h3'
import prisma from '../../../db/client'

export default defineEventHandler(async () => {
  const pathways = await prisma.pathway.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      destinationProfile: {
        include: {
          country: true
        }
      }
    }
  })
  return pathways
})
