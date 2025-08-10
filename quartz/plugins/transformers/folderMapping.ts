import { QuartzTransformerPlugin } from "../types"
import { FullSlug, slugifyFilePath, FilePath } from "../../util/path"
import path from "path"

export interface Options {}

const defaultOptions: Options = {}

export const FolderMapping: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  return {
    name: "FolderMapping",
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            // Check for folder tags like "folder/MOCs" or "folder/Cards" (primary method)
            let publishFolder: string | undefined
            if (file.data.frontmatter?.tags) {
              const tags = file.data.frontmatter.tags as string[]
              for (const tag of tags) {
                if (typeof tag === 'string' && tag.startsWith('folder/')) {
                  publishFolder = tag.replace('folder/', '')
                  break
                }
              }
            }
            
            // Fallback: Check if frontmatter has folder field (secondary method)
            if (!publishFolder) {
              publishFolder = file.data.frontmatter?.["folder"]
            }
            
            // Auto-detect based on file path if no explicit folder is set
            if (!publishFolder) {
              const relativePath = file.data.relativePath as string
              if (relativePath.includes('/MOCs/')) {
                publishFolder = "MOCs"
              } else if (relativePath.includes('/Cards/')) {
                publishFolder = "Cards"
              }
            }
            
            if (publishFolder && typeof publishFolder === "string") {
              // Get the original filename without path
              const basename = path.basename(file.data.relativePath as string, ".md")
              
              // Create new slug with custom folder
              const newPath = path.posix.join(publishFolder, basename + ".md")
              const customSlug = slugifyFilePath(newPath as FilePath)
              
              // Update the slug
              file.data.slug = customSlug
              
              console.log(`Folder mapping: ${file.data.relativePath} -> ${customSlug}`)
            }
          }
        }
      ]
    }
  }
}

declare module "vfile" {
  interface DataMap {
    frontmatter: { [key: string]: unknown } & {
      "folder"?: string
    }
  }
}