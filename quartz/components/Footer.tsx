import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const links = opts?.links ?? []
    const linkEntries = Object.entries(links)
    const firstLink = linkEntries[0]
    const remainingLinks = linkEntries.slice(1)
    
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          {i18n(cfg.locale).components.footer.createdWith}
          {firstLink && (
            <>
              {" "}
              <a href={firstLink[1]}>{firstLink[0]}</a>
            </>
          )}
        </p>
        {remainingLinks.length > 0 && (
          <ul>
            {remainingLinks.map(([text, link]) => (
              <li>
                <a href={link}>{text}</a>
              </li>
            ))}
          </ul>
        )}
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
