import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: false,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        const createdDate = fileData.dates.created
        const modifiedDate = fileData.dates.modified
        
        if (createdDate && modifiedDate) {
          if (createdDate.getTime() !== modifiedDate.getTime()) {
            // Different dates - show both
            segments.push(
              <span>
                created <Date date={createdDate} locale={cfg.locale} /> ✺ 
                modified <Date date={modifiedDate} locale={cfg.locale} />
              </span>
            )
          } else {
            // Same date - show only one with "created" label
            segments.push(
              <span>
                created <Date date={createdDate} locale={cfg.locale} />
              </span>
            )
          }
        } else if (createdDate) {
          segments.push(
            <span>
              created <Date date={createdDate} locale={cfg.locale} />
            </span>
          )
        } else if (modifiedDate) {
          segments.push(
            <span>
              modified <Date date={modifiedDate} locale={cfg.locale} />
            </span>
          )
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
