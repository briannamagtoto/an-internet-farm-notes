import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { resolveRelative, SimpleSlug } from "../util/path"

interface TopicCard {
  title: string
  slug: SimpleSlug
  description?: string
  emoji?: string
}

interface Options {
  topics: TopicCard[]
  showCounts?: boolean
}

const defaultOptions: Options = {
  topics: [
    {
      title: "art x tech",
      slug: "MOCs/tech" as SimpleSlug,
      description: "dreaming of a 🌫️ poetic web 🕸️",
      emoji: "💭",
    },
    {
      title: "About",
      slug: "MOCs/brianna-magtoto-moc" as SimpleSlug,
      description: "personal notes & beliefs <3",
      emoji: "💌",
    },
    {
      title: "Projects",
      slug: "projects" as SimpleSlug,
      description: "creative work & experiments",
      emoji: "🍥",
    },
    {
      title: "Essays",
      slug: "articles--and--mini-essays" as SimpleSlug,
      description: "long-form writing & reflections",
      emoji: "🔎",
    },
  ],
  showCounts: false,
}

export default ((userOpts?: Partial<Options>) => {
  const WikiHome: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }

    const getTopicCount = (topicSlug: SimpleSlug): number => {
      const topicName = topicSlug.split("/").pop()?.toLowerCase()
      const mocFile = allFiles.find((file) => file.slug === topicSlug)

      const linkedFiles = new Set<string>()
      if (mocFile?.text) {
        const wikilinkRegex = /\[\[([^\]]+)\]\]/g
        let match
        while ((match = wikilinkRegex.exec(mocFile.text)) !== null) {
          const linkTarget = match[1].split('|')[0].trim()
          linkedFiles.add(linkTarget)
        }
      }

      return allFiles.filter((file) => {
        if (file.slug === topicSlug) return false

        const moc = file.frontmatter?.moc as string | undefined
        const tags = (file.frontmatter?.tags as string[]) || []

        const isLinkedInMoc = file.slug && Array.from(linkedFiles).some(wikilink => {
          const normalizedWikilink = wikilink.toLowerCase().replace(/\s+/g, '-')
          const normalizedSlug = file.slug!.toLowerCase()
          return normalizedSlug === normalizedWikilink ||
                 normalizedSlug.endsWith('/' + normalizedWikilink) ||
                 normalizedSlug.endsWith(normalizedWikilink)
        })

        return (
          moc?.toLowerCase() === topicName ||
          file.slug?.startsWith(topicSlug) ||
          tags.some(tag => tag.toLowerCase().includes(topicName || "")) ||
          isLinkedInMoc
        )
      }).length
    }

    return (
      <div class={classNames(displayClass, "wiki-home")}>
        <div class="topic-grid">
          {opts.topics.map((topic) => {
            const href = resolveRelative(fileData.slug!, topic.slug)
            const count = opts.showCounts ? getTopicCount(topic.slug) : null

            return (
              <a href={href} class="topic-card">
                {topic.emoji && <div class="topic-emoji">{topic.emoji}</div>}
                <div class="topic-content">
                  <h3 class="topic-title">{topic.title.toLowerCase()}</h3>
                  {topic.description && (
                    <p class="topic-description">{topic.description}</p>
                  )}
                  {opts.showCounts && count !== null && (
                    <div class="topic-count">{count} notes</div>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  WikiHome.css = `
.wiki-home {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

html {
  scroll-behavior: auto !important;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.topic-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  text-decoration: none;
  color: var(--dark);
  background-color: var(--light);
  transition: all 0.2s ease;
  cursor: pointer;
}

.topic-card:hover {
  border-color: var(--secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.topic-emoji {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1;
}

.topic-content {
  flex: 1;
}

.topic-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark);
}

.topic-description {
  margin: 0 0 1rem 0;
  color: var(--gray);
  font-size: 0.95rem;
  line-height: 1.5;
}

.topic-count {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--lightgray);
  color: var(--darkgray);
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

@media (max-width: 600px) {
  .topic-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .topic-card {
    padding: 1.25rem;
  }
  .topic-emoji {
    font-size: 2rem;
  }
  .topic-title {
    font-size: 1.3rem;
  }
}

@media (min-width: 601px) and (max-width: 1024px) {
  .topic-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
`

  return WikiHome
}) satisfies QuartzComponentConstructor
