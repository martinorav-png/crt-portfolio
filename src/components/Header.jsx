import { playHover } from '../lib/sounds'

const SOCIAL_LINKS = [
  { label: '[github]', url: 'https://github.com/martinorav-png' },
  { label: '[linkedin]', url: 'https://www.linkedin.com/in/martin-orav-30747539b' },
  { label: '[behance]', url: 'https://www.behance.net/martinorav' },
  { label: '[mail]', url: 'mailto:martinoravdisain@gmail.com' },
]

/**
 * Top header bar — compact boot log + sysinfo + profile photo.
 */
export default function Header() {
  return (
    <div className="header">
      <div className="header__boot">
        <div className="header__boot-line header__boot-line--ok">System initialized</div>
        <div className="header__boot-line header__boot-line--ok">Showcase loaded</div>

        <div className="header__prompt">
          <span className="header__prompt-text">Martin@portfolio:~$</span>
          <span className="header__prompt-cursor" />
          <span className="header__badge">ACCESS: GRANTED</span>
        </div>
      </div>

      <div className="header__right">
        <div className="header__sysinfo">
          <div className="header__sysinfo-line">
            Digital Product Designer @ EKA
          </div>
          <div className="header__sysinfo-line">
            <span className="header__sysinfo-label">{'loc: '}</span>
            Tallinn, Estonia
          </div>
          <div className="header__sysinfo-line">
            <span className="header__sysinfo-label">{'focus: '}</span>
            design / games / interaction
          </div>
          <div className="header__endpoints">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="header__endpoint"
                onMouseEnter={playHover}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="header__photo">
          <img
            src="https://ceexzutcamztvkpotwty.supabase.co/storage/v1/object/public/portfolio-images/assets/profile.jpg"
            alt="Martin Orav"
          />
        </div>
      </div>
    </div>
  )
}
