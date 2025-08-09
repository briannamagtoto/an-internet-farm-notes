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
            // Check if frontmatter has folder field
            const publishFolder = file.data.frontmatter?.["folder"]
            
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